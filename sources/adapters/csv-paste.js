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

  function createUI(ctx) {
    const t = ctx.t;
    const panel = document.createElement("div");
    panel.innerHTML = `
      <div class="csv-format">
        <div data-i18n="csvFormatIntro">Paste headerless CSV-like rows. Required columns:</div>
        <code>word,alternatives,meanings</code>
        <div data-i18n="csvFormatOptional">Optional columns:</div>
        <code>word,alternatives,meanings,created_at,last_seen_at,parts_of_speech</code>
        <div class="csv-examples" data-i18n="csvFormatRules">Use | inside alternatives, meanings, and parts_of_speech. Dates may be YYYY-MM-DD or a full timestamp; blank dates default to now.</div>
        <div class="csv-examples" data-i18n="csvPartsOfSpeech">Accepted parts of speech:</div>
        <code class="csv-pos-list"></code>
        <div class="csv-examples">
          <code>word,alternatives,meanings,created_at,last_seen_at,parts_of_speech</code>
        </div>
      </div>
      <label for="csvPaste" data-i18n="csvPasteLabel">Word list</label>
      <textarea id="csvPaste" spellcheck="false" data-i18n="csvPastePlaceholder" data-i18n-attr="placeholder" placeholder="word,alternatives,meanings,created_at,last_seen_at,parts_of_speech"></textarea>
    `;

    const posList = panel.querySelector(".csv-pos-list");
    if (posList && Array.isArray(KaniKai.PARTS_OF_SPEECH)) {
      posList.textContent = KaniKai.PARTS_OF_SPEECH.join(", ");
    }

    const textarea = panel.querySelector("#csvPaste");

    return {
      panel,
      getLoadOptions() {
        return { csvText: textarea.value };
      },
      messageForError(error) {
        if (error && error.code === "CSV_EMPTY") return t("csvPasteEmpty");
        return null;
      },
    };
  }

  KaniKai.registerSource({
    id: "csv-paste",
    label: "CSV Paste",
    requiresAuth: false,
    // Works for any native/target pair (omit supportsLanguages = universal).
    createUI,

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
