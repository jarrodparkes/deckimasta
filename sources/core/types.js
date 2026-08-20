/**
 * Shared Word shape, LoadOptions, and post-processing helpers.
 *
 * Word (see DATA_SOURCES.md OpenAPI schema):
 *   {
 *     id: string,
 *     word: string,
 *     alternatives: string[],
 *     meanings: string[],
 *     created_at: string,   // ISO 8601 date-time
 *     last_seen_at: string, // ISO 8601 date-time
 *     parts_of_speech: string[] // preferred enum or free string (anyOf)
 *   }
 *
 * LoadOptions:
 *   {
 *     since: Date | string | null, // filter on last_seen_at; null = no look-back
 *     partsOfSpeech: string[] | null, // keep words matching any tag; null/[] = no POS filter
 *     limit: number | null,
 *     randomize: boolean
 *   }
 */
(function (global) {
  "use strict";

  const DeckiMasta = (global.DeckiMasta = global.DeckiMasta || {});

  function generateId() {
    if (global.crypto && typeof global.crypto.randomUUID === "function") {
      return global.crypto.randomUUID();
    }
    return "word-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function toStringArray(value) {
    if (!Array.isArray(value)) return [];
    return value
      .filter(item => item != null && String(item).trim() !== "")
      .map(item => String(item));
  }

  function toIsoString(value) {
    if (value instanceof Date) {
      return Number.isNaN(value.getTime()) ? null : value.toISOString();
    }
    if (typeof value === "string" && value.trim()) {
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? null : date.toISOString();
    }
    return null;
  }

  /**
   * Build a normalized Word. Generates `id` when the source does not provide one.
   * If only one of created_at / last_seen_at is present, both are set to that value.
   * @param {object} partial
   * @returns {object}
   */
  function createWord(partial = {}) {
    const normalizePos =
      typeof DeckiMasta.normalizePartsOfSpeech === "function"
        ? DeckiMasta.normalizePartsOfSpeech
        : value => (Array.isArray(value) ? value : []);

    let createdAt = toIsoString(partial.created_at);
    let lastSeenAt = toIsoString(partial.last_seen_at);

    if (!createdAt && lastSeenAt) createdAt = lastSeenAt;
    if (!lastSeenAt && createdAt) lastSeenAt = createdAt;

    const id =
      partial.id != null && String(partial.id).trim() !== ""
        ? String(partial.id)
        : generateId();

    return {
      id,
      word: partial.word == null ? "" : String(partial.word),
      alternatives: toStringArray(partial.alternatives),
      meanings: toStringArray(partial.meanings),
      created_at: createdAt || new Date(0).toISOString(),
      last_seen_at: lastSeenAt || new Date(0).toISOString(),
      parts_of_speech: normalizePos(partial.parts_of_speech)
    };
  }

  /**
   * @param {object} [partial]
   * @returns {{
   *   since: string|null,
   *   partsOfSpeech: string[]|null,
   *   limit: number|null,
   *   randomize: boolean
   * }}
   */
  function createLoadOptions(partial = {}) {
    let since = null;
    if (partial.since != null && partial.since !== "") {
      const iso = toIsoString(partial.since);
      since = iso;
    }

    const normalizePos =
      typeof DeckiMasta.normalizePartsOfSpeech === "function"
        ? DeckiMasta.normalizePartsOfSpeech
        : value => (Array.isArray(value) ? value : []);
    const partsOfSpeechRaw = normalizePos(partial.partsOfSpeech);
    const partsOfSpeech = partsOfSpeechRaw.length ? partsOfSpeechRaw : null;

    let limit = null;
    if (partial.limit != null && partial.limit !== "") {
      const n = Math.floor(Number(partial.limit));
      if (Number.isFinite(n) && n >= 1) limit = Math.min(100, n);
    }

    return {
      since,
      partsOfSpeech,
      limit,
      randomize: Boolean(partial.randomize)
    };
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Filter by optional `since` (on last_seen_at), optional parts of speech,
   * then sort newest-first. POS filter runs after look-back: keep words whose
   * parts_of_speech intersects the selected tags; untagged words are excluded.
   * @param {object[]} words
   * @param {object} [options]
   * @returns {{ words: object[], options: object }}
   */
  function matchWords(words, options = {}) {
    const opts = createLoadOptions(options);
    let result = Array.isArray(words) ? words.slice() : [];

    if (opts.since) {
      const sinceMs = new Date(opts.since).getTime();
      result = result.filter(word => {
        const seen = new Date(word.last_seen_at).getTime();
        return Number.isFinite(seen) && seen >= sinceMs;
      });
    }

    if (opts.partsOfSpeech && opts.partsOfSpeech.length) {
      const wanted = new Set(opts.partsOfSpeech);
      result = result.filter(word => {
        const tags = Array.isArray(word.parts_of_speech) ? word.parts_of_speech : [];
        if (!tags.length) return false;
        return tags.some(tag => wanted.has(tag));
      });
    }

    result.sort(
      (a, b) => new Date(b.last_seen_at).getTime() - new Date(a.last_seen_at).getTime()
    );

    return { words: result, options: opts };
  }

  /**
   * Apply shared look-back / POS / sort / randomize / limit after a source returns words.
   * @param {object[]} words
   * @param {object} [options]
   * @returns {object[]}
   */
  function applyLoadOptions(words, options = {}) {
    return applyLoadOptionsWithMeta(words, options).words;
  }

  /**
   * Same as applyLoadOptions, plus totalMatched (after look-back + POS, before limit).
   * @param {object[]} words
   * @param {object} [options]
   * @returns {{ words: object[], totalMatched: number, options: object }}
   */
  function applyLoadOptionsWithMeta(words, options = {}) {
    const matched = matchWords(words, options);
    const totalMatched = matched.words.length;
    let result = matched.words;

    if (matched.options.randomize) {
      result = shuffle(result);
    }

    if (matched.options.limit != null) {
      result = result.slice(0, matched.options.limit);
    }

    return {
      words: result,
      totalMatched,
      options: matched.options
    };
  }

  /**
   * Minimal structural check for the WordSource interface.
   * Optional: supportsLanguages({ native, target }) => boolean
   * Optional: secret (boolean) — hidden from unfiltered listSources
   * @param {object} source
   * @returns {boolean}
   */
  function isWordSource(source) {
    return Boolean(
      source &&
        typeof source.id === "string" &&
        source.id &&
        typeof source.label === "string" &&
        typeof source.requiresAuth === "boolean" &&
        typeof source.load === "function" &&
        (source.supportsLanguages == null ||
          typeof source.supportsLanguages === "function")
    );
  }

  DeckiMasta.createWord = createWord;
  DeckiMasta.createLoadOptions = createLoadOptions;
  DeckiMasta.matchWords = matchWords;
  DeckiMasta.applyLoadOptions = applyLoadOptions;
  DeckiMasta.applyLoadOptionsWithMeta = applyLoadOptionsWithMeta;
  DeckiMasta.isWordSource = isWordSource;
  DeckiMasta.generateId = generateId;
})(window);
