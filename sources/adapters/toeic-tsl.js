/**
 * TOEIC Service List (TSL) English vocabulary with Japanese glosses for Japanese→English learners.
 * Data: sources/data/toeic-tsl.js (DiQt / Browne & Culligan TSL, CC BY-SA 4.0).
 */
(function (global) {
  "use strict";

  const DeckiMasta = global.DeckiMasta;
  if (!DeckiMasta || typeof DeckiMasta.registerSource !== "function") {
    throw new Error(
      "DeckiMasta source registry must be loaded before the toeic-tsl adapter.",
    );
  }

  function sourceError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function getRows() {
    const data = global.DeckiMastaData && global.DeckiMastaData.toeicTsl;
    return Array.isArray(data) ? data : null;
  }

  DeckiMasta.registerSource({
    id: "toeic-tsl",
    label: "TOEIC Service List (TSL)",
    labelKey: "sourceLabelToeicTsl",
    descriptionKey: "sourceDescToeicTsl",
    requiresAuth: false,
    supportsLookBack: false,
    supportsLanguages({ native, target }) {
      return native === "ja" && target === "en";
    },

    async load() {
      const rows = getRows();
      if (!rows || !rows.length) {
        throw sourceError(
          "TOEIC Service List (TSL) failed to load.",
          "DATA_MISSING",
        );
      }

      return rows.map((row) =>
        DeckiMasta.createWord({
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
