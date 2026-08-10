/**
 * CSV paste data source — paste headerless CSV-like rows into the UI textarea.
 * Format is shared with the file-upload adapter (see KaniKai.parseWordCsv).
 */
(function (global) {
  "use strict";

  const KaniKai = global.KaniKai;
  if (!KaniKai || typeof KaniKai.registerSource !== "function") {
    throw new Error(
      "KaniKai source registry must be loaded before the CSV paste adapter.",
    );
  }
  if (typeof KaniKai.parseWordCsv !== "function") {
    throw new Error(
      "KaniKai.parseWordCsv must be loaded before the CSV paste adapter.",
    );
  }

  function sourceError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  KaniKai.registerSource({
    id: "csv-paste",
    label: "CSV Paste",
    requiresAuth: false,

    /**
     * @param {object} [options]
     * @param {string} [options.csvText]
     */
    async load(options = {}) {
      const text = options.csvText != null ? String(options.csvText) : "";
      if (!text.trim()) {
        throw sourceError(
          "Paste at least one CSV word row first.",
          "CSV_EMPTY",
        );
      }

      const words = KaniKai.parseWordCsv(text);
      if (!words.length) {
        throw sourceError("No word rows found in the pasted CSV.", "CSV_EMPTY");
      }
      return words;
    },
  });
})(window);
