/**
 * New General Service List (NGSL) English vocabulary with Japanese glosses for Japanese→English learners.
 * Data: sources/data/ngsl-en-ja.js (koba-ninkigumi/ngsl / Browne, Culligan & Phillips, CC BY-SA 4.0).
 */
(function (global) {
  "use strict";

  const DeckiMasta = global.DeckiMasta;
  if (!DeckiMasta || typeof DeckiMasta.registerSource !== "function") {
    throw new Error(
      "DeckiMasta source registry must be loaded before the ngsl-en-ja adapter.",
    );
  }

  function sourceError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function getRows() {
    const data = global.DeckiMastaData && global.DeckiMastaData.ngslEnJa;
    return Array.isArray(data) ? data : null;
  }

  DeckiMasta.registerSource({
    id: "ngsl-en-ja",
    label: "New General Service List (NGSL)",
    labelKey: "sourceLabelNgslEnJa",
    descriptionKey: "sourceDescNgslEnJa",
    requiresAuth: false,
    supportsLookBack: false,
    supportsPartsOfSpeech: true,
    supportsLanguages({ native, target }) {
      return native === "ja" && target === "en";
    },

    async load() {
      const rows = getRows();
      if (!rows || !rows.length) {
        throw sourceError(
          "New General Service List (NGSL) failed to load.",
          "DATA_MISSING",
        );
      }

      return rows.map((row) =>
        DeckiMasta.createWord({
          id: row.id,
          word: row.word,
          alternatives: row.alternatives || [],
          meanings: row.meanings || [],
          parts_of_speech: row.parts_of_speech || [],
        }),
      );
    },
  });
})(window);
