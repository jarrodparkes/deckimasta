/**
 * Registry of available word data sources (one selected at a time in the UI).
 *
 * A WordSource:
 *   {
 *     id: string,
 *     label: string,
 *     requiresAuth: boolean,
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
})(window);
