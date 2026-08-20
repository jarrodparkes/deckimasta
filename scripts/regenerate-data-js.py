#!/usr/bin/env python3
"""Regenerate sources/data/*.js from backing CSV files (file://-safe embeds).

Usage:
  python3 scripts/regenerate-data-js.py           # all CSV-backed sources
  python3 scripts/regenerate-data-js.py esl-en    # one source
  python3 scripts/regenerate-data-js.py esl-en ngsl-en-ja
"""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "sources" / "data"


def write_js(path: Path, comment: str, assignment: str, payload: str) -> None:
    path.write_text(
        comment.rstrip()
        + "\n(function (global) {\n"
        + '  "use strict";\n'
        + "  const DeckiMastaData = (global.DeckiMastaData = global.DeckiMastaData || {});\n"
        + f"  DeckiMastaData.{assignment} = {payload};\n"
        + "})(window);\n",
        encoding="utf-8",
    )


def split_pipe(value: str) -> list[str]:
    return [part.strip() for part in (value or "").split("|") if part.strip()]


def compact_json(value: object) -> str:
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def emit_esl_en() -> int:
    csv_path = DATA / "esl-en.csv"
    text = csv_path.read_text(encoding="utf-8-sig").replace("\r\n", "\n").replace("\r", "\n")
    lines = text.split("\n")
    while lines and lines[-1] == "":
        lines.pop()
    payload = (
        "[\n"
        + ",\n".join("    " + json.dumps(line, ensure_ascii=False) for line in lines)
        + ",\n  ].join(\"\\n\")"
    )
    write_js(
        DATA / "esl-en.js",
        """/**
 * Embedded copy of sources/data/esl-en.csv for file:// loads.
 * Edit the .csv, then run: python3 scripts/regenerate-data-js.py esl-en
 */""",
        "eslEnCsv",
        payload,
    )
    return len(lines)


def emit_ngsl_en_ja() -> int:
    csv_path = DATA / "ngsl_english_japanese_normalized.csv"
    rows: list[dict] = []
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        for index, parts in enumerate(csv.reader(handle), start=1):
            if not parts or all(not (cell or "").strip() for cell in parts):
                continue
            while len(parts) < 6:
                parts.append("")
            word = (parts[0] or "").strip()
            if not word:
                continue
            record: dict = {
                "id": f"ngsl-{index}",
                "word": word,
                "meanings": split_pipe(parts[2]),
            }
            alternatives = split_pipe(parts[1])
            if alternatives:
                record["alternatives"] = alternatives
            pos = split_pipe(parts[5])
            if pos:
                record["parts_of_speech"] = pos
            rows.append(record)

    write_js(
        DATA / "ngsl-en-ja.js",
        """/**
 * Static vocabulary data: New General Service List (NGSL) English→Japanese.
 * Generated for offline / file:// use. Do not edit by hand.
 * Upstream CSV: sources/data/ngsl_english_japanese_normalized.csv
 * Source: https://github.com/koba-ninkigumi/ngsl (NGSL-1.01_en_ja.csv)
 * Word list: New General Service List by Browne, C., Culligan, B., and Phillips, J.
 * License: CC BY-SA 4.0
 */""",
        "ngslEnJa",
        compact_json(rows),
    )
    return len(rows)


# --- TOEIC / TSL gloss slimming (DiQt dictionary markup → one primary Japanese gloss)

BOOK_RE = re.compile(r"【[^】]*】")
ORPHAN_CLOSE_RE = re.compile(r"[A-Za-z0-9/]*〉")
BOLD_RE = re.compile(r"\*\*([^*]+)\*\*")
WS_RE = re.compile(r"\s+")
OBJ_MARKER_RE = re.compile(r"(?:…|\.{1,3})\s*[''‘’]?\s*を\s*[''‘’]?\s*")
BARE_WO_RE = re.compile(r"^[''‘’]?\s*を\s*[''‘’]?\s*")
LEADING_USAGE_RE = re.compile(r"^《[^》]+》\s*")
ANGLE_RE = re.compile(r"〈([^〉]*)〉")
POS_LIKE = re.compile(r"^[A-Za-z0-9/]+$")
POS_JA = {"他", "自", "名", "形", "副", "動"}
OPEN = set("（(【《〈")
CLOSE = set("）)】》〉")
SEP_RE = re.compile(r"[,;；・]")
ENUM_DOT_RE = re.compile(r"(?:[^・\s,;；]{1,12}・)+[^・\s,;；]{1,12}など")
QUOTE_PARTICLE_RE = re.compile(r"[''‘’]\s*([をにがでとへからよりの])\s*[''‘’]")


def _replace_angle(match: re.Match[str]) -> str:
    inner = match.group(1).strip()
    if not inner or POS_LIKE.match(inner) or inner in POS_JA:
        return ""
    return inner


def _clean_sense(text: str) -> str:
    text = text.strip()
    text = ANGLE_RE.sub(_replace_angle, text)
    text = BOOK_RE.sub("", text)
    text = ORPHAN_CLOSE_RE.sub("", text)
    text = BOLD_RE.sub(r"\1", text)
    while True:
        match = LEADING_USAGE_RE.match(text)
        if not match:
            break
        text = text[match.end() :].lstrip()
    text = OBJ_MARKER_RE.sub("", text)
    text = BARE_WO_RE.sub("", text)
    text = QUOTE_PARTICLE_RE.sub(r"\1", text)
    return WS_RE.sub(" ", text).strip()


def _first_element(text: str) -> str:
    protected: list[str] = []

    def protect(match: re.Match[str]) -> str:
        protected.append(match.group(0))
        return f"\0ENUM{len(protected) - 1}\0"

    shielded = ENUM_DOT_RE.sub(protect, text)
    depth = 0
    end = len(shielded)
    for index, char in enumerate(shielded):
        if char in OPEN:
            depth += 1
        elif char in CLOSE:
            depth = max(0, depth - 1)
        elif depth == 0 and SEP_RE.match(char):
            end = index
            break
    out = shielded[:end]
    for index, value in enumerate(protected):
        out = out.replace(f"\0ENUM{index}\0", value)
    return out.strip()


def _strip_markup(text: str) -> str:
    text = re.sub(r"《[^》]*》", "", text)
    text = re.sub(r"【[^】]*】", "", text)
    text = re.sub(r"〈[^〉]*〉", "", text)
    return text


def _strip_long_parens(text: str) -> str:
    def repl(match: re.Match[str]) -> str:
        inner = match.group(1)
        if len(inner) > 12 or re.search(r"[：:]", inner):
            return ""
        return match.group(0)

    return re.sub(r"[（(]([^）)]*)[）)]", repl, text)


def slim_toeic_gloss(raw: str) -> str:
    for part in re.split(r"\s+/\s+", raw.strip()):
        text = _clean_sense(part)
        if not text:
            continue
        text = _first_element(text)
        text = _strip_markup(text)
        text = _strip_long_parens(text)
        text = WS_RE.sub(" ", text).strip()
        text = re.sub(r"[;；,、・\s]+$", "", text).strip()
        text = re.sub(r"^(?:\.\.\.|…)\s*", "", text).strip()
        if text:
            return text
    return ""


def emit_toeic_tsl() -> int:
    csv_path = DATA / "toeic-list.csv"
    rows: list[dict] = []
    with csv_path.open(newline="", encoding="utf-8-sig") as handle:
        for row in csv.DictReader(handle):
            word = (row.get("entry") or "").strip()
            word_id = (row.get("word_id") or "").strip()
            gloss = (row.get("meaning_ja") or row.get("meaning") or "").strip()
            if not word or not word_id:
                continue
            meaning = slim_toeic_gloss(gloss)
            if not meaning:
                parts = re.split(r"\s+/\s+", gloss)
                meaning = _clean_sense(parts[0]) if parts else ""
                meaning = _strip_markup(meaning).strip() or word
            rows.append({"id": f"toeic-{word_id}", "word": word, "meanings": [meaning]})

    write_js(
        DATA / "toeic-tsl.js",
        """/**
 * Static vocabulary data: TOEIC Service List (TSL).
 * Generated for offline / file:// use. Do not edit by hand.
 * Upstream CSV: sources/data/toeic-list.csv
 * Source: DiQt TOEIC英単語（TSL） https://www.diqt.net/ja/word_tags/3/download
 * Credit: TOEIC Service List by Browne, C. and Culligan, B.; Tanaka Corpus; DiQt Editors
 * License: CC BY-SA 4.0
 */""",
        "toeicTsl",
        compact_json(rows),
    )
    return len(rows)


GENERATORS = {
    "esl-en": emit_esl_en,
    "ngsl-en-ja": emit_ngsl_en_ja,
    "toeic-tsl": emit_toeic_tsl,
}


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(
        description="Regenerate file://-safe JS data files from backing CSVs."
    )
    parser.add_argument(
        "sources",
        nargs="*",
        metavar="SOURCE",
        help="Source ids to rebuild (default: all). One of: " + ", ".join(GENERATORS),
    )
    args = parser.parse_args(argv)
    names = args.sources or list(GENERATORS)
    unknown = [name for name in names if name not in GENERATORS]
    if unknown:
        parser.error("unknown source(s): " + ", ".join(unknown))

    for name in names:
        count = GENERATORS[name]()
        print(f"{name}: {count} rows")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
