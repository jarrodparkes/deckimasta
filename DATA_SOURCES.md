# Data Sources

DeckiMasta loads vocabulary through a small abstraction layer so any backend (API, CSV, spreadsheet, static JSON, etc.) can feed the same UI.

This document is the contract for that layer: the shared **word** shape, shared **load options**, the **source interface**, and how to add a new source.

## Goals

- One source at a time (no merging yet)
- Sources own their own auth / credentials when needed
- Sources return the shared word shape
- The app applies shared post-processing (optional look-back, parts of speech, sort, randomize, limit)

## Word Shape

Every source must produce objects that match this shape:

```json
{
  "type": "object",
  "required": [
    "id",
    "word",
    "alternatives",
    "meanings",
    "created_at",
    "last_seen_at",
    "parts_of_speech"
  ],
  "additionalProperties": false,
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "Stable uuid from the source when available; otherwise a UUID generated at load time."
    },
    "word": {
      "type": "string",
      "minLength": 1,
      "description": "Primary surface form. The language is inferred from the source."
    },
    "alternatives": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Alternate forms / spellings / readings. Empty array when none."
    },
    "meanings": {
      "type": "array",
      "items": { "type": "string" },
      "description": "Definitions list. The language used here may be different from the word."
    },
    "created_at": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 datetime when the learner first encountered / started the item."
    },
    "last_seen_at": {
      "type": "string",
      "format": "date-time",
      "description": "ISO 8601 datetime of the most recent study / exposure. If the source has only one timestamp, set both created_at and last_seen_at to that value."
    },
    "parts_of_speech": {
      "type": "array",
      "items": {
        "anyOf": [
          {
            "type": "string",
            "enum": [
              "noun",
              "numeral",
              "pronoun",
              "prefix",
              "suffix",
              "counter",
              "expression",
              "interjection",
              "conjunction",
              "adverb",
              "adjective",
              "verb"
            ]
          },
          { "type": "string", "minLength": 1 }
        ]
      },
      "description": "Language-agnostic part of speech tags when possible; unknown source tags may be passed through as free strings. Empty array if unknown."
    }
  }
}
```

| Field             | Type              | Required | Notes                                                                                                     |
| ----------------- | ----------------- | -------- | --------------------------------------------------------------------------------------------------------- |
| `id`              | string            | yes      | Use a stable id from the source when available. Otherwise generate a UUID (or equivalent) at load time.   |
| `word`            | string            | yes      | Primary surface form. Language is inferred from the source for now.                                       |
| `alternatives`    | string[]          | yes      | Alternate forms / spellings / readings. Use `[]` when there are none.                                     |
| `meanings`        | string[]          | yes      | Gloss list. May be in a different language than `word`.                                                   |
| `created_at`      | string (ISO 8601) | yes      | First time the learner encountered / started the item, when known.                                        |
| `last_seen_at`    | string (ISO 8601) | yes      | Most recent study / exposure time. If the source only has one timestamp, set both fields to that value.   |
| `parts_of_speech` | string[]          | yes      | Prefer the shared language-agnostic enum; free strings are allowed (schema `anyOf`). Use `[]` if unknown. |

### Word Shape Example

For 色 / いろ / “color”:

```json
{
  "id": "2467",
  "word": "色",
  "alternatives": ["いろ"],
  "meanings": ["Color"],
  "created_at": "2026-08-01T12:00:00.000Z",
  "last_seen_at": "2026-08-10T09:30:00.000Z",
  "parts_of_speech": ["noun"]
}
```

### Mapping Example

For words loaded from WaniKani API, the following mapping is used (see `sources/adapters/wanikani.js`):

- `id` ← subject id (stringified)
- `word` ← subject `characters`
- `alternatives` ← readings (primary first when available)
- `meanings` ← subject meanings (up to 3)
- `created_at` ← assignment `started_at` (first time learning started)
- `last_seen_at` ← latest of assignment `data_updated_at`, `burned_at`, `passed_at`, `resurrected_at`, `started_at`
- `parts_of_speech` ← subject `parts_of_speech`, mapped in the adapter onto the shared enum (e.g. `godan verb` / `する verb` → `verb`, `い adjective` → `adjective`)

When `since` is provided, the adapter prefetches with `updated_after` for efficiency. Shared `applyLoadOptions` still enforces the final `last_seen_at` look-back.

## Shared Load Options

These options are source-agnostic. The app (not the source UI) owns them:

```js
{
  // When set, keep words whose last_seen_at is on/after this instant.
  // When null/undefined, do not filter by recency (full set / random sample use case).
  since: Date | string | null,

  // When non-empty, keep words whose parts_of_speech intersects this list
  // (any-match). Untagged words are excluded. null/[] = no POS filter.
  partsOfSpeech: string[] | null,

  // Max words to keep after filtering/sorting/shuffle.
  // null = no limit. When set, createLoadOptions clamps to 1–100.
  // The UI defaults to 5.
  limit: number | null,

  // If true, shuffle before applying limit.
  randomize: boolean
}
```

Filter order in `applyLoadOptions`: look-back (`since`) → parts of speech → sort → randomize → limit.

## Important Interfaces (Word and WordSource)

Shared helpers live on `window.DeckiMasta` (no bundler). A data source is a plain object:

```js
/**
 * @typedef {object} Word
 * @property {string} id
 * @property {string} word
 * @property {string[]} alternatives
 * @property {string[]} meanings
 * @property {string} created_at
 * @property {string} last_seen_at
 * @property {string[]} parts_of_speech // preferred enum or free string (anyOf)
 */

/**
 * @typedef {object} WordSource
 * @property {string} id            // source identifier, e.g. "csv-paste"
 * @property {string} label         // UI label (fallback)
 * @property {string} [labelKey]    // optional i18n key for the picker label
 * @property {string} [descriptionKey] // optional i18n key for the source tooltip
 * @property {boolean} requiresAuth // whether the source needs credentials
 * @property {boolean} [supportsLookBack] // default true; false for static curated lists (no learner timestamps)
 * @property {boolean} [supportsPartsOfSpeech] // default false; true when the source provides POS tags
 * @property {(options?: object) => Promise<Word[]>} load
 * @property {(ctx: { t: Function, setStatus: Function }) => object} [createUI]
 * @property {(pair: { native: string, target: string }) => boolean} [supportsLanguages]
 */
```

`supportsLanguages({ native, target })` is optional. When present, the source only appears in the Step 2 picker for pairs that return `true`. When omitted, the source is treated as universal (any native/target pair).

`supportsLookBack` is optional and defaults to `true`. Set it to `false` for static curated lists with no learner-progress timestamps. The UI hides Recency for those sources and passes `since: null` so the shared look-back filter does not empty the list.

`supportsPartsOfSpeech` is optional and defaults to `false` (opt-in). Set it to `true` when the source maps `parts_of_speech` for its words. The UI shows a collapsed **More filters** disclosure with the Part of speech multi-select only for those sources and passes selected tags as `partsOfSpeech` in shared load options.

`labelKey` / `descriptionKey` are optional i18n keys. The Source picker shows a `?` tooltip whose text is taken from `descriptionKey` for the currently selected source (among sources available for the active language pair).

`load(options)` should:

1. Read any source-specific credentials / settings it needs.
2. Fetch or parse raw data.
3. Map each item with `DeckiMasta.createWord(...)` into the shared **Word** shape.
4. Return the full mapped list for the source’s natural universe (or as much as the source can provide).

### Optional `createUI(ctx)`

Adapters may provide their own setup/panel UI. Return an object with any of:

| Field                    | Role                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `setup`                  | `HTMLElement` rendered above the shared load card (optional; unused by built-in adapters) |
| `panel`                  | `HTMLElement` rendered inside the load card (tokens, CSV textarea/file picker)            |
| `getLoadOptions()`       | Extra fields merged into `load` options (`token`, `csvText`, `file`, …)                   |
| `prepareLoad()`          | Return `false` to abort before loading                                                    |
| `messageForError(error)` | Map error codes to user-facing strings                                                    |
| `suppressStatus()`       | When true, keep the status line quiet after a successful load                             |
| `applyTranslations()`    | Extra refresh after i18n (e.g. file name label)                                           |

The app mounts UI into `#sourceSetupHost` / `#sourcePanelHost` via `DeckiMasta.createSourceUIHost`. Only the selected source’s UI is shown.

The app then applies `DeckiMasta.applyLoadOptions(words, options)` for shared filtering (`since` on `last_seen_at`, then optional `partsOfSpeech`), sorting, shuffle, and `limit`. Sources may pre-filter for efficiency as long as the returned words still satisfy the shared contract.

### `window.DeckiMasta` API

| Helper                                                | Role                                                          |
| ----------------------------------------------------- | ------------------------------------------------------------- |
| `PARTS_OF_SPEECH`                                     | Frozen preferred POS enum (language-agnostic)                 |
| `isKnownPartOfSpeech(tag)`                            | Whether a tag is in the preferred enum                        |
| `canonicalizePartOfSpeech(tag)`                       | Prefer enum spelling when case/spacing match; else keep free  |
| `normalizePartsOfSpeech(tags)`                        | Trim, enum-case normalize, dedupe; unknown tags kept          |
| `createWord(partial)`                                 | Normalize a Word; generate `id` if missing; mirror timestamps |
| `createLoadOptions(partial)`                          | Normalize `{ since, partsOfSpeech, limit, randomize }`        |
| `matchWords(words, options)`                          | Look-back + POS filter + sort (no shuffle/limit)              |
| `applyLoadOptions(words, options)`                    | Shared look-back → POS → sort → shuffle → limit               |
| `applyLoadOptionsWithMeta(words, options)`            | Same, plus `totalMatched` before limit                        |
| `loadFromSource(sourceId, options)`                   | Registry lookup → `source.load` → apply shared options        |
| `parseWordCsv(text)`                                  | Parse CSV-like paste/file text into Word[]                    |
| `createSourceUIHost({ setupHost, panelHost })`        | Mount/teardown adapter `createUI` into page slots             |
| `isWordSource(source)`                                | Structural check for the source interface                     |
| `registerSource(source)`                              | Add a source to the registry                                  |
| `getSource(id)` / `hasSource(id)`                     | Registry lookup                                               |
| `listSources({ native, target }?)`                    | All sources, or only those supporting the language pair       |
| `sourceSupportsLanguages(source, { native, target })` | Whether a source accepts the given pair                       |
| `sourceSupportsLookBack(source)`                      | Whether Recency / `since` applies (default true)              |
| `sourceSupportsPartsOfSpeech(source)`                 | Whether Part of speech filter applies (default false)         |
| `sourceLabel(source, t)`                              | Localized picker label                                        |
| `sourceDescription(source, t)`                        | Localized tooltip text for the selected source                |

## File Layout

```text
sources/
  core/                 # system that loads / normalizes data sources
    parts-of-speech.js  # enum / allow-list
    types.js            # Word + LoadOptions helpers
    registry.js         # registerSource / listSources
    loader.js           # loadFromSource entry point
    csv.js              # shared CSV-like parser (paste + file)
    source-ui.js        # adapter UI host (setup + panel slots)
  adapters/             # individual data sources
    # your-source.js
  data/                 # static curated lists loaded as JS globals (file:// safe)
    # top-1000-english.js, jlpt-n5.js, …
```

`sources/core/` is the loading system. `sources/adapters/` is only concrete sources.

Include scripts before the main app (order matters: core, then adapters):

```html
<script src="sources/core/parts-of-speech.js"></script>
<script src="sources/core/types.js"></script>
<script src="sources/core/registry.js"></script>
<script src="sources/core/loader.js"></script>
<script src="sources/core/csv.js"></script>
<script src="sources/core/source-ui.js"></script>
<script src="sources/adapters/your-source.js"></script>
```

`index.html` should stay thin: source picker, shared options, render / copy / prompt. Fetch/map logic lives in adapters; shared filtering lives in core.

## How to Add a Data Source

1. **Create** `sources/adapters/your-source.js` that implements the `WordSource` interface and calls `DeckiMasta.registerSource(...)`.
2. **Map** every record with `DeckiMasta.createWord(...)`.
3. **Handle auth** inside the adapter (no-op if none is required).
4. **Include** the script from `index.html` after the `sources/core/*` scripts.
5. **Smoke-test** both modes:
   - with `since` set (recent `last_seen_at`)
   - with `since` unset + `randomize` / `limit` (sample from the set)

### Minimal Skeleton

```js
// sources/adapters/example-csv.js
(function (global) {
  "use strict";
  const DeckiMasta = global.DeckiMasta;

  DeckiMasta.registerSource({
    id: "example-csv",
    label: "Example CSV",
    requiresAuth: false,
    // Optional: limit which Step 1 language pairs show this source.
    // Omit to support every native/target combination.
    // supportsLanguages({ native, target }) {
    //   return native === "en" && target === "ja";
    // },

    async load(/* options */) {
      const rows = []; // parse file / fetch remote CSV / etc.

      return rows.map((row) =>
        DeckiMasta.createWord({
          id: row.id,
          word: row.word,
          alternatives: row.alternatives || [],
          meanings: row.meanings || [],
          created_at: row.created_at || row.last_seen_at,
          last_seen_at: row.last_seen_at || row.created_at,
          parts_of_speech: row.parts_of_speech || [],
        }),
      );
    },
  });
})(window);
```

## Usage

Words are loaded only through registered adapters under `sources/adapters/` via `DeckiMasta.loadFromSource`.

## Checklist for a New Source

- [ ] Stable `id` when the backend provides one; otherwise generated per load
- [ ] `word` + `alternatives` + `meanings` always present (arrays may be empty)
- [ ] `created_at` and `last_seen_at` always ISO strings (duplicated when only one timestamp exists)
- [ ] `parts_of_speech` mapped to the shared language-agnostic enum in the adapter when the source uses a dialect (e.g. WaniKani); CSV authors write preferred tags directly
- [ ] Credentials handled only inside the source
- [ ] `supportsLanguages({ native, target })` declared when the source only fits certain language pairs (omit for universal)
- [ ] `supportsLookBack: false` when the source has no learner-progress timestamps (static lists)
- [ ] `supportsPartsOfSpeech: true` when the source provides `parts_of_speech` (enables the shared POS filter UI)
- [ ] `descriptionKey` (and optional `labelKey`) so the Source tooltip can explain the source
- [ ] Works with and without the shared `since` look-back filter
- [ ] Works with and without the shared `partsOfSpeech` filter when `supportsPartsOfSpeech` is set
- [ ] Registered for one-at-a-time selection in the UI

## Built-in curated lists

| Source id          | Pair    | Data file                          | Upstream                                                                                                           | License      |
| ------------------ | ------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------ |
| `top-1000-english` | ja → en | `sources/data/top-1000-english.js` | [SMenigat/thousand-most-common-words](https://github.com/SMenigat/thousand-most-common-words)                      | MIT          |
| `toeic-tsl`        | ja → en | `sources/data/toeic-tsl.js`        | [DiQt TOEIC英単語 TOEIC Service List（TSL）](https://www.diqt.net/ja/word_tags/3/download) (Browne & Culligan TSL) | CC BY-SA 4.0 |
| `ngsl-en-ja`       | ja → en | `sources/data/ngsl-en-ja.js`       | [koba-ninkigumi/ngsl](https://github.com/koba-ninkigumi/ngsl) (NGSL 1.01 en/ja; Browne, Culligan & Phillips)       | CC BY-SA 4.0 |
| `jlpt-n5`          | en → ja | `sources/data/jlpt-n5.js`          | [evanclan/OpenJLPT](https://github.com/evanclan/OpenJLPT) N5 vocab                                                 | CC BY-SA 4.0 |

See [ATTRIBUTION.md](./ATTRIBUTION.md) for license notices.
