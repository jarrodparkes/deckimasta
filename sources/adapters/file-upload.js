/**
 * CSV file-upload data source — same row format as csv-paste (KaniKai.parseWordCsv).
 * The UI reads the selected file and passes { file } (or csvText).
 */
(function (global) {
  "use strict";

  const KaniKai = global.KaniKai;
  if (!KaniKai || typeof KaniKai.registerSource !== "function") {
    throw new Error(
      "KaniKai source registry must be loaded before the file-upload adapter."
    );
  }
  if (typeof KaniKai.parseWordCsv !== "function") {
    throw new Error(
      "KaniKai.parseWordCsv must be loaded before the file-upload adapter."
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
            "CSV_FILE_READ_ERROR"
          )
        );
      reader.readAsText(file);
    });
  }

  function createUI(ctx) {
    const t = ctx.t;
    const panel = document.createElement("div");
    panel.innerHTML = `
      <div class="csv-format">
        <div data-i18n="csvFileIntro">Upload a .csv or .txt file using the same format as CSV paste.</div>
        <code>word,alternatives,meanings[,created_at,last_seen_at,parts_of_speech]</code>
        <div class="csv-examples" data-i18n="csvFormatRules">Use | inside alternatives, meanings, and parts_of_speech. Dates may be YYYY-MM-DD or a full timestamp; blank dates default to now.</div>
        <div class="csv-examples" data-i18n="csvPartsOfSpeech">Accepted parts of speech:</div>
        <code class="csv-pos-list"></code>
      </div>
      <label for="csvFile" data-i18n="csvFileLabel">CSV file</label>
      <div class="file-picker">
        <input id="csvFile" type="file" accept=".csv,.txt,text/csv,text/plain">
        <button id="csvChooseFile" type="button" class="secondary" data-i18n="csvChooseFile">Choose file</button>
        <span id="csvFileName" class="file-name">No file chosen</span>
      </div>
    `;

    const posList = panel.querySelector(".csv-pos-list");
    if (posList && Array.isArray(KaniKai.PARTS_OF_SPEECH)) {
      posList.textContent = KaniKai.PARTS_OF_SPEECH.join(", ");
    }

    const fileInput = panel.querySelector("#csvFile");
    const fileName = panel.querySelector("#csvFileName");

    function updateFileName() {
      const file = fileInput.files && fileInput.files[0];
      fileName.textContent = file ? file.name : t("csvNoFileChosen");
    }

    panel.querySelector("#csvChooseFile").addEventListener("click", () => {
      fileInput.click();
    });
    fileInput.addEventListener("change", updateFileName);

    return {
      panel,
      getLoadOptions() {
        return {
          file: fileInput.files && fileInput.files[0] ? fileInput.files[0] : null
        };
      },
      messageForError(error) {
        if (error && error.code === "CSV_EMPTY") return t("csvFileEmpty");
        return null;
      },
      applyTranslations() {
        updateFileName();
      },
      onActivate() {
        updateFileName();
      }
    };
  }

  KaniKai.registerSource({
    id: "file-upload",
    label: "CSV File",
    labelKey: "sourceLabelCsvFile",
    descriptionKey: "sourceDescCsvFile",
    requiresAuth: false,
    supportsLookBack: true,
    // Works for any native/target pair (omit supportsLanguages = universal).
    createUI,

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
          "CSV_EMPTY"
        );
      }
      return words;
    }
  });
})(window);
