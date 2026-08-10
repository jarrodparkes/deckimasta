/**
 * Registry of available word data sources (one selected at a time in the UI).
 *
 * A WordSource:
 *   {
 *     id: string,
 *     label: string,
 *     requiresAuth: boolean,
 *     load: (options?) => Promise<Word[]>,
 *     createUI?: (ctx) => SourceUI   // optional adapter-owned UI
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
   * @returns {object[]}
   */
  function listSources() {
    return Array.from(sources.values());
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
})(window);
