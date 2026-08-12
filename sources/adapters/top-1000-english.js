/**
 * Top 1000 English words (with Japanese glosses) for Japanese→English learners.
 * Data: sources/data/top-1000-english.js (SMenigat/thousand-most-common-words, MIT).
 */
(function (global) {
  "use strict";

  const KaniKai = global.KaniKai;
  if (!KaniKai || typeof KaniKai.registerSource !== "function") {
    throw new Error(
      "KaniKai source registry must be loaded before the top-1000-english adapter.",
    );
  }

  function sourceError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function getRows() {
    const data = global.KaniKaiData && global.KaniKaiData.top1000English;
    return Array.isArray(data) ? data : null;
  }

  KaniKai.registerSource({
    id: "top-1000-english",
    label: "Top 1000 English Words",
    labelKey: "sourceLabelTop1000English",
    descriptionKey: "sourceDescTop1000English",
    requiresAuth: false,
    supportsLookBack: false,
    supportsLanguages({ native, target }) {
      return native === "ja" && target === "en";
    },

    async load() {
      const rows = getRows();
      if (!rows || !rows.length) {
        throw sourceError(
          "Top 1000 English word list failed to load.",
          "DATA_MISSING",
        );
      }

      return rows.map((row) =>
        KaniKai.createWord({
          id: row.id,
          word: row.word,
          alternatives: [],
          meanings: row.meanings || [],
          parts_of_speech: [],
        }),
      );
    },
  });
})(window);
