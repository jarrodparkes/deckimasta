/**
 * CSV file-upload data source — same row format as csv-paste (KaniKai.parseWordCsv).
 * The UI reads the selected file and passes { csvText } (or a File via { file }).
 */
(function (global) {
  "use strict";

  const KaniKai = global.KaniKai;
  if (!KaniKai || typeof KaniKai.registerSource !== "function") {
    throw new Error(
      "KaniKai source registry must be loaded before the file-upload adapter.",
    );
  }
  if (typeof KaniKai.parseWordCsv !== "function") {
    throw new Error(
      "KaniKai.parseWordCsv must be loaded before the file-upload adapter.",
    );
  }

  function sourceError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function readFileAsText(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () =>
        reject(
          sourceError(
            "Could not read the selected file.",
            "CSV_FILE_READ_ERROR",
          ),
        );
      reader.readAsText(file);
    });
  }

  KaniKai.registerSource({
    id: "file-upload",
    label: "CSV File",
    requiresAuth: false,

    /**
     * @param {object} [options]
     * @param {string} [options.csvText]
     * @param {File} [options.file]
     */
    async load(options = {}) {
      let text = options.csvText != null ? String(options.csvText) : "";

      if (!text.trim() && options.file) {
        text = await readFileAsText(options.file);
      }

      if (!text.trim()) {
        throw sourceError("Choose a CSV file to upload first.", "CSV_EMPTY");
      }

      const words = KaniKai.parseWordCsv(text);
      if (!words.length) {
        throw sourceError(
          "No word rows found in the uploaded file.",
          "CSV_EMPTY",
        );
      }
      return words;
    },
  });
})(window);
