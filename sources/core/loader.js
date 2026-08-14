/**
 * Shared entry point: pick a registered source, load words, apply shared options.
 */
(function (global) {
  "use strict";

  const DeckiMasta = (global.DeckiMasta = global.DeckiMasta || {});

  function loaderError(message, code) {
    const error = new Error(message);
    error.code = code;
    return error;
  }

  /**
   * @param {string} sourceId
   * @param {object} [options]  Shared LoadOptions plus source-specific fields (e.g. token)
   * @returns {Promise<{ source: object, words: object[], totalMatched: number, options: object, raw: object[] }>}
   */
  async function loadFromSource(sourceId, options = {}) {
    if (typeof DeckiMasta.getSource !== "function") {
      throw loaderError("Source registry is not available.", "REGISTRY_MISSING");
    }

    const source = DeckiMasta.getSource(sourceId);
    if (!source) {
      throw loaderError('Unknown word source: "' + sourceId + '".', "SOURCE_NOT_FOUND");
    }

    const raw = await source.load(options);
    const applied =
      typeof DeckiMasta.applyLoadOptionsWithMeta === "function"
        ? DeckiMasta.applyLoadOptionsWithMeta(raw, options)
        : {
            words: Array.isArray(raw) ? raw : [],
            totalMatched: Array.isArray(raw) ? raw.length : 0,
            options: DeckiMasta.createLoadOptions
              ? DeckiMasta.createLoadOptions(options)
              : options
          };

    return {
      source,
      raw: Array.isArray(raw) ? raw : [],
      words: applied.words,
      totalMatched: applied.totalMatched,
      options: applied.options
    };
  }

  DeckiMasta.loadFromSource = loadFromSource;
})(window);
