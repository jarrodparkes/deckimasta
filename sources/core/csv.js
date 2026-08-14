/**
 * Shared CSV-like word list parser for paste and file adapters.
 *
 * Headerless by default. Columns:
 *   word, alternatives, meanings [, created_at, last_seen_at, parts_of_speech]
 *
 * - alternatives, meanings, parts_of_speech: pipe-separated; empty → []
 * - created_at / last_seen_at: yyyy-mm-dd or full timestamp; empty → now
 * - A leading header row starting with "word," is skipped if present
 */
(function (global) {
  "use strict";

  const DeckiMasta = (global.DeckiMasta = global.DeckiMasta || {});

  function csvError(message, code, lineNumber) {
    const error = new Error(message);
    error.code = code || "CSV_PARSE_ERROR";
    if (lineNumber != null) error.lineNumber = lineNumber;
    return error;
  }

  function splitPipe(value) {
    const raw = value == null ? "" : String(value).trim();
    if (!raw) return [];
    return raw
      .split("|")
      .map(part => part.trim())
      .filter(Boolean);
  }

  function parseCsvDate(value, fallbackIso) {
    const raw = value == null ? "" : String(value).trim();
    if (!raw) return fallbackIso;

    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
      const local = new Date(raw + "T12:00:00");
      if (Number.isNaN(local.getTime())) {
        throw csvError('Invalid date "' + raw + '".', "CSV_INVALID_DATE");
      }
      return local.toISOString();
    }

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) {
      throw csvError('Invalid date "' + raw + '".', "CSV_INVALID_DATE");
    }
    return parsed.toISOString();
  }

  function looksLikeHeader(line) {
    return /^\s*word\s*,/i.test(line);
  }

  function parseCsvLine(line, lineNumber, nowIso) {
    const parts = line.split(",");
    if (parts.length < 3) {
      throw csvError(
        "Line " + lineNumber + ": expected at least word,alternatives,meanings.",
        "CSV_BAD_ROW",
        lineNumber
      );
    }
    if (parts.length > 6) {
      throw csvError(
        "Line " +
          lineNumber +
          ": too many columns (max 6: word,alternatives,meanings,created_at,last_seen_at,parts_of_speech).",
        "CSV_BAD_ROW",
        lineNumber
      );
    }

    const word = (parts[0] || "").trim();
    if (!word) {
      throw csvError("Line " + lineNumber + ": word is required.", "CSV_BAD_ROW", lineNumber);
    }

    let createdAt;
    let lastSeenAt;
    try {
      createdAt = parseCsvDate(parts[3], nowIso);
      lastSeenAt = parseCsvDate(parts[4], nowIso);
    } catch (error) {
      if (error.code === "CSV_INVALID_DATE") {
        throw csvError(
          "Line " + lineNumber + ": " + error.message,
          error.code,
          lineNumber
        );
      }
      throw error;
    }

    if (typeof DeckiMasta.createWord !== "function") {
      throw csvError("DeckiMasta.createWord is required to parse CSV words.", "CSV_DEPENDENCY");
    }

    return DeckiMasta.createWord({
      word,
      alternatives: splitPipe(parts[1]),
      meanings: splitPipe(parts[2]),
      created_at: createdAt,
      last_seen_at: lastSeenAt,
      parts_of_speech: splitPipe(parts[5])
    });
  }

  /**
   * @param {string} text
   * @returns {object[]} Word[]
   */
  function parseWordCsv(text) {
    const raw = text == null ? "" : String(text).replace(/^\uFEFF/, "");
    const lines = raw.split(/\r?\n/);
    const nowIso = new Date().toISOString();
    const words = [];
    let started = false;

    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      const line = lines[i].trim();
      if (!line) continue;

      if (!started && looksLikeHeader(line)) {
        started = true;
        continue;
      }
      started = true;
      words.push(parseCsvLine(line, lineNumber, nowIso));
    }

    return words;
  }

  DeckiMasta.parseWordCsv = parseWordCsv;
})(window);
