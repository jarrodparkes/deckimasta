/**
 * Secret ESL (native) → English (target) word list.
 * Seed CSV: sources/data/esl-en.csv (embedded in sources/data/esl-en.js for file://).
 * Same row format and in-browser editor as csv-paste.
 */
(function (global) {
  "use strict";

  const DeckiMasta = global.DeckiMasta;
  if (!DeckiMasta || typeof DeckiMasta.registerSource !== "function") {
    throw new Error(
      "DeckiMasta source registry must be loaded before the esl-en adapter.",
    );
  }
  if (typeof DeckiMasta.parseWordCsv !== "function") {
    throw new Error(
      "DeckiMasta.parseWordCsv must be loaded before the esl-en adapter.",
    );
  }

  function sourceError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  function defaultCsvText() {
    const data = global.DeckiMastaData && global.DeckiMastaData.eslEnCsv;
    return typeof data === "string" ? data : "";
  }

  function loadCsvFromRepo() {
    if (typeof global.fetch !== "function") return Promise.resolve(null);
    return global
      .fetch("sources/data/esl-en.csv")
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => (text && String(text).trim() ? String(text) : null))
      .catch(() => null);
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
      <label for="eslCsvPaste" data-i18n="csvPasteLabel">Word list</label>
      <textarea id="eslCsvPaste" spellcheck="false" data-i18n="csvPastePlaceholder" data-i18n-attr="placeholder" placeholder="word,alternatives,meanings,created_at,last_seen_at,parts_of_speech"></textarea>
    `;

    const posList = panel.querySelector(".csv-pos-list");
    if (posList && Array.isArray(DeckiMasta.PARTS_OF_SPEECH)) {
      posList.textContent = DeckiMasta.PARTS_OF_SPEECH.join(", ");
    }

    const textarea = panel.querySelector("#eslCsvPaste");
    textarea.value = defaultCsvText();
    textarea.addEventListener("input", () => {
      textarea.dataset.dirty = "1";
    });
    loadCsvFromRepo().then((text) => {
      if (text && textarea.dataset.dirty !== "1") textarea.value = text;
    });

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

  DeckiMasta.registerSource({
    id: "esl-en",
    label: "ESL Word List",
    labelKey: "sourceLabelEslEn",
    descriptionKey: "sourceDescEslEn",
    requiresAuth: false,
    supportsLookBack: true,
    supportsPartsOfSpeech: true,
    secret: true,
    supportsLanguages({ native, target }) {
      return native === "esl" && target === "en";
    },
    createUI,

    /**
     * @param {object} [options]
     * @param {string} [options.csvText]
     */
    async load(options = {}) {
      let text = options.csvText != null ? String(options.csvText) : "";
      if (!text.trim()) text = defaultCsvText();
      if (!text.trim()) {
        throw sourceError("Add at least one CSV word row first.", "CSV_EMPTY");
      }

      const words = DeckiMasta.parseWordCsv(text);
      if (!words.length) {
        throw sourceError("No word rows found in the ESL CSV.", "CSV_EMPTY");
      }
      return words;
    },
  });
})(window);
