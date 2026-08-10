/**
 * Shared parts-of-speech tags for KaniKai word sources.
 * Starting set mirrors WaniKani vocabulary tags.
 */
(function (global) {
  "use strict";

  const KaniKai = (global.KaniKai = global.KaniKai || {});

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
   * @returns {boolean}
   */
  function isKnownPartOfSpeech(tag) {
    return PARTS_OF_SPEECH_SET.has(tag);
  }

  /**
   * Keep known tags first; unknown tags are preserved so sources can pass
   * through values that are not yet in the shared enum.
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
