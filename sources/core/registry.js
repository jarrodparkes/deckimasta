/**
 * Registry of available word data sources (one selected at a time in the UI).
 *
 * A WordSource:
 *   {
 *     id: string,
 *     label: string,
 *     labelKey?: string,           // optional i18n key for the picker label
 *     descriptionKey?: string,     // optional i18n key for the source tooltip
 *     requiresAuth: boolean,
 *     supportsLookBack?: boolean,  // default true; false for static curated lists
 *     load: (options?) => Promise<Word[]>,
 *     createUI?: (ctx) => SourceUI,  // optional adapter-owned UI
 *     // Optional: qualify which native/target pairs this source supports.
 *     // Omit (or always return true) to accept any pair.
 *     supportsLanguages?: ({ native: string, target: string }) => boolean
 *   }
 *
 * Auth/credentials and source-specific controls are owned by each source.
 */
(function (global) {
  "use strict";

  const KaniKai = (global.KaniKai = global.KaniKai || {});
  const sources = new Map();

  /**
   * @param {object} source
   * @returns {object}
   */
  function registerSource(source) {
    if (typeof KaniKai.isWordSource === "function" && !KaniKai.isWordSource(source)) {
      throw new Error("Invalid word source: expected { id, label, requiresAuth, load }");
    }
    if (
      source.supportsLanguages != null &&
      typeof source.supportsLanguages !== "function"
    ) {
      throw new Error(
        'Invalid word source "' +
          source.id +
          '": supportsLanguages must be a function when provided'
      );
    }
    if (sources.has(source.id)) {
      throw new Error('Word source already registered: "' + source.id + '"');
    }
    sources.set(source.id, source);
    return source;
  }

  /**
   * @param {string} id
   * @returns {object|null}
   */
  function getSource(id) {
    return sources.get(id) || null;
  }

  /**
   * Whether a source supports the given native/target language pair.
   * Sources without supportsLanguages are treated as universal.
   * @param {object} source
   * @param {{ native?: string, target?: string }} [pair]
   * @returns {boolean}
   */
  function sourceSupportsLanguages(source, pair = {}) {
    if (!source) return false;
    if (typeof source.supportsLanguages !== "function") return true;
    const native = pair.native != null ? String(pair.native) : "";
    const target = pair.target != null ? String(pair.target) : "";
    if (!native || !target) return false;
    try {
      return Boolean(source.supportsLanguages({ native, target }));
    } catch {
      return false;
    }
  }

  /**
   * Whether a source has learner-progress timestamps for the shared look-back filter.
   * Defaults to true when omitted.
   * @param {object} source
   * @returns {boolean}
   */
  function sourceSupportsLookBack(source) {
    if (!source) return false;
    return source.supportsLookBack !== false;
  }

  /**
   * Localized label for a source, falling back to source.label.
   * @param {object} source
   * @param {(key: string) => string} [t]
   * @returns {string}
   */
  function sourceLabel(source, t) {
    if (!source) return "";
    if (
      source.labelKey &&
      typeof t === "function"
    ) {
      const translated = t(source.labelKey);
      if (translated && translated !== source.labelKey) return translated;
    }
    return source.label || "";
  }

  /**
   * Localized description for a source tooltip, or empty string when none.
   * @param {object} source
   * @param {(key: string) => string} [t]
   * @returns {string}
   */
  function sourceDescription(source, t) {
    if (!source || !source.descriptionKey || typeof t !== "function") return "";
    const translated = t(source.descriptionKey);
    if (!translated || translated === source.descriptionKey) return "";
    return translated;
  }

  /**
   * @param {{ native?: string, target?: string }} [filter]
   *   When native and target are both set, only sources that support that pair.
   * @returns {object[]}
   */
  function listSources(filter) {
    const all = Array.from(sources.values());
    if (
      !filter ||
      filter.native == null ||
      filter.native === "" ||
      filter.target == null ||
      filter.target === ""
    ) {
      return all;
    }
    return all.filter(source => sourceSupportsLanguages(source, filter));
  }

  /**
   * @param {string} id
   * @returns {boolean}
   */
  function hasSource(id) {
    return sources.has(id);
  }

  KaniKai.registerSource = registerSource;
  KaniKai.getSource = getSource;
  KaniKai.listSources = listSources;
  KaniKai.hasSource = hasSource;
  KaniKai.sourceSupportsLanguages = sourceSupportsLanguages;
  KaniKai.sourceSupportsLookBack = sourceSupportsLookBack;
  KaniKai.sourceLabel = sourceLabel;
  KaniKai.sourceDescription = sourceDescription;
})(window);
