/**
 * JLPT N5 vocabulary list for English→Japanese learners.
 * Data: sources/data/jlpt-n5.js (evanclan/OpenJLPT, CC BY-SA 4.0).
 */
(function (global) {
  "use strict";

  const DeckiMasta = global.DeckiMasta;
  if (!DeckiMasta || typeof DeckiMasta.registerSource !== "function") {
    throw new Error(
      "DeckiMasta source registry must be loaded before the jlpt-n5 adapter."
    );
  }

  function sourceError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function getRows() {
    const data = global.DeckiMastaData && global.DeckiMastaData.jlptN5;
    return Array.isArray(data) ? data : null;
  }

  DeckiMasta.registerSource({
    id: "jlpt-n5",
    label: "JLPT N5",
    labelKey: "sourceLabelJlptN5",
    descriptionKey: "sourceDescJlptN5",
    requiresAuth: false,
    supportsLookBack: false,
    supportsLanguages({ native, target }) {
      return native === "en" && target === "ja";
    },

    async load() {
      const rows = getRows();
      if (!rows || !rows.length) {
        throw sourceError("JLPT N5 word list failed to load.", "DATA_MISSING");
      }

      return rows.map((row) =>
        DeckiMasta.createWord({
          id: row.id,
          word: row.word,
          alternatives: row.alternatives || [],
          meanings: row.meanings || [],
          parts_of_speech: [],
        })
      );
    },
  });
})(window);
