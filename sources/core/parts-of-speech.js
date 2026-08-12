/**
 * Shared parts-of-speech tags for KaniKai word sources.
 *
 * Matches Word.parts_of_speech items in DATA_SOURCES.md:
 * anyOf [ preferred enum, free non-empty string ].
 *
 * Preferred tags are language-agnostic. Source-specific finer tags
 * should be mapped to the preferred tags.
 */
(function (global) {
  "use strict";

  const KaniKai = (global.KaniKai = global.KaniKai || {});

  /** @type {readonly string[]} Preferred enum branch (not exhaustive of allowed values). */
  const PARTS_OF_SPEECH = Object.freeze([
    "noun",
    "numeral",
    "pronoun",
    "prefix",
    "suffix",
    "counter",
    "expression",
    "interjection",
    "conjunction",
    "adverb",
    "adjective",
    "verb",
  ]);

  /**
   * Map source-specific / legacy tags onto the preferred enum.
   * Unknown tags pass through unchanged (schema anyOf free string).
   * @type {Readonly<Record<string, string>>}
   */
  const PARTS_OF_SPEECH_ALIASES = Object.freeze({
    proper_noun: "noun",
    i_adjective: "adjective",
    na_adjective: "adjective",
    no_adjective: "adjective",
    godan_verb: "verb",
    ichidan_verb: "verb",
    suru_verb: "verb",
    transitive_verb: "verb",
    intransitive_verb: "verb",
  });

  const PARTS_OF_SPEECH_SET = new Set(PARTS_OF_SPEECH);

  /**
   * @param {string} tag
   * @returns {boolean} true when tag is in the preferred enum set
   */
  function isKnownPartOfSpeech(tag) {
    return PARTS_OF_SPEECH_SET.has(tag);
  }

  /**
   * Collapse a raw tag onto a preferred enum value when an alias exists.
   * @param {string} tag
   * @returns {string}
   */
  function canonicalizePartOfSpeech(tag) {
    return PARTS_OF_SPEECH_ALIASES[tag] || tag;
  }

  /**
   * Normalize POS tags: trim, alias-collapse, drop empties/non-strings, dedupe.
   * Preferred enum values and free strings are both kept (schema anyOf).
   * @param {string[]} tags
   * @returns {string[]}
   */
  function normalizePartsOfSpeech(tags) {
    if (!Array.isArray(tags)) return [];
    const seen = new Set();
    const result = [];
    for (const tag of tags) {
      if (typeof tag !== "string") continue;
      const raw = tag.trim();
      if (!raw) continue;
      const value = canonicalizePartOfSpeech(raw);
      if (seen.has(value)) continue;
      seen.add(value);
      result.push(value);
    }
    return result;
  }

  KaniKai.PARTS_OF_SPEECH = PARTS_OF_SPEECH;
  KaniKai.PARTS_OF_SPEECH_ALIASES = PARTS_OF_SPEECH_ALIASES;
  KaniKai.isKnownPartOfSpeech = isKnownPartOfSpeech;
  KaniKai.canonicalizePartOfSpeech = canonicalizePartOfSpeech;
  KaniKai.normalizePartsOfSpeech = normalizePartsOfSpeech;
})(window);
