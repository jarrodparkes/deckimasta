/**
 * Shared parts-of-speech tags for KaniKai word sources.
 *
 * Matches Word.parts_of_speech items in DATA_SOURCES.md:
 * anyOf [ preferred enum, free non-empty string ].
 * Preferred set mirrors WaniKani vocabulary tags.
 */
(function (global) {
  "use strict";

  const KaniKai = (global.KaniKai = global.KaniKai || {});

  /** @type {readonly string[]} Preferred enum branch (not exhaustive of allowed values). */
  const PARTS_OF_SPEECH = Object.freeze([
    "noun",
    "proper_noun",
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
    "i_adjective",
    "na_adjective",
    "no_adjective",
    "godan_verb",
    "ichidan_verb",
    "suru_verb",
    "transitive_verb",
    "intransitive_verb"
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
   * Normalize POS tags: trim, drop empties/non-strings, dedupe.
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
      const value = tag.trim();
      if (!value || seen.has(value)) continue;
      seen.add(value);
      result.push(value);
    }
    return result;
  }

  KaniKai.PARTS_OF_SPEECH = PARTS_OF_SPEECH;
  KaniKai.isKnownPartOfSpeech = isKnownPartOfSpeech;
  KaniKai.normalizePartsOfSpeech = normalizePartsOfSpeech;
})(window);
