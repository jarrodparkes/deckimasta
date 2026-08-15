/**
 * Shared parts-of-speech tags for DeckiMasta word sources.
 *
 * Matches Word.parts_of_speech items in DATA_SOURCES.md:
 * anyOf [ preferred enum, free non-empty string ].
 *
 * Preferred tags are language-agnostic. Source-specific dialects
 * (e.g. WaniKani "godan verb") must be mapped in the adapter before
 * createWord — core only normalizes casing/spacing for known tags.
 */
(function (global) {
  "use strict";

  const DeckiMasta = (global.DeckiMasta = global.DeckiMasta || {});

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

  const PARTS_OF_SPEECH_SET = new Set(PARTS_OF_SPEECH);

  /**
   * @param {string} tag
   * @returns {boolean} true when tag is in the preferred enum set
   */
  function isKnownPartOfSpeech(tag) {
    return PARTS_OF_SPEECH_SET.has(tag);
  }

  /**
   * Lowercase and underscore-separate a raw tag for enum lookup.
   * @param {string} tag
   * @returns {string}
   */
  function tagKey(tag) {
    return String(tag).trim().toLowerCase().replace(/[\s\-・]+/g, "_");
  }

  /**
   * If the tag matches a preferred enum value (ignoring case/spacing), return
   * that enum value. Otherwise return the trimmed original (free string).
   * Source-specific aliases belong in adapters, not here.
   * @param {string} tag
   * @returns {string}
   */
  function canonicalizePartOfSpeech(tag) {
    const trimmed = String(tag).trim();
    if (!trimmed) return "";
    const key = tagKey(trimmed);
    if (PARTS_OF_SPEECH_SET.has(key)) return key;
    return trimmed;
  }

  /**
   * Normalize POS tags: trim, collapse known enum spellings, drop empties, dedupe.
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
      const value = canonicalizePartOfSpeech(tag);
      if (!value || seen.has(value)) continue;
      seen.add(value);
      result.push(value);
    }
    return result;
  }

  DeckiMasta.PARTS_OF_SPEECH = PARTS_OF_SPEECH;
  DeckiMasta.isKnownPartOfSpeech = isKnownPartOfSpeech;
  DeckiMasta.canonicalizePartOfSpeech = canonicalizePartOfSpeech;
  DeckiMasta.normalizePartsOfSpeech = normalizePartsOfSpeech;
})(window);
