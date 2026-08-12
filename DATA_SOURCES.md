# Data Sources

KaniKai loads vocabulary through a small abstraction layer so any backend (API, CSV, spreadsheet, static JSON, etc.) can feed the same UI.

This document is the contract for that layer: the shared **word** shape, shared **load options**, the **source interface**, and how to add a new source.

## Goals

- One source at a time (no merging yet)
- Sources own their own auth / credentials when needed
- Sources return the shared word shape
- The app applies shared post-processing (optional look-back, sort, randomize, limit)

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
              "proper_noun",
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
              "i_adjective",
              "na_adjective",
              "no_adjective",
              "godan_verb",
              "ichidan_verb",
              "suru_verb",
              "transitive_verb",
              "intransitive_verb"
            ]
          },
          { "type": "string", "minLength": 1 }
        ]
      },
      "description": "Part of speech tags when possible; unknown source tags may be passed through as free strings. Empty array if unknown."
    }
  }
}
```

| Field             | Type              | Required | Notes                                                                                                   |
| ----------------- | ----------------- | -------- | ------------------------------------------------------------------------------------------------------- |
| `id`              | string            | yes      | Use a stable id from the source when available. Otherwise generate a UUID (or equivalent) at load time. |
| `word`            | string            | yes      | Primary surface form. Language is inferred from the source for now.                                     |
| `alternatives`    | string[]          | yes      | Alternate forms / spellings / readings. Use `[]` when there are none.                                   |
| `meanings`        | string[]          | yes      | Gloss list. May be in a different language than `word`.                                                 |
| `created_at`      | string (ISO 8601) | yes      | First time the learner encountered / started the item, when known.                                      |
| `last_seen_at`    | string (ISO 8601) | yes      | Most recent study / exposure time. If the source only has one timestamp, set both fields to that value. |
| `parts_of_speech` | string[]          | yes      | Prefer the shared enum below; free strings are allowed (schema `anyOf`). Use `[]` if unknown.           |

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
- `parts_of_speech` ← subject `parts_of_speech`

When `since` is provided, the adapter prefetches with `updated_after` for efficiency. Shared `applyLoadOptions` still enforces the final `last_seen_at` look-back.

## Shared Load Options

These options are source-agnostic. The app (not the source UI) owns them:

```js
{
  // When set, keep words whose last_seen_at is on/after this instant.
  // When null/undefined, do not filter by recency (full set / random sample use case).
  since: Date | string | null,

  // Max words to keep after filtering/sorting/shuffle. null = no limit.
  limit: number | null,

  // If true, shuffle before applying limit.
  randomize: boolean
}
```

## Important Interfaces (Word and WordSource)

Shared helpers live on `window.KaniKai` (no bundler). A data source is a plain object:

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
 * @property {string} label         // UI label
 * @property {boolean} requiresAuth // whether the source needs credentials
 * @property {(options?: object) => Promise<Word[]>} load
 * @property {(ctx: { t: Function, setStatus: Function }) => object} [createUI]
 */
```

`load(options)` should:

1. Read any source-specific credentials / settings it needs.
2. Fetch or parse raw data.
3. Map each item with `KaniKai.createWord(...)` into the shared **Word** shape.
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

The app mounts UI into `#sourceSetupHost` / `#sourcePanelHost` via `KaniKai.createSourceUIHost`. Only the selected source’s UI is shown.

The app then applies `KaniKai.applyLoadOptions(words, options)` for shared filtering (`since` on `last_seen_at`), sorting, shuffle, and `limit`. Sources may pre-filter for efficiency as long as the returned words still satisfy the shared contract.

### `window.KaniKai` API

| Helper                                              | Role                                                          |
| --------------------------------------------------- | ------------------------------------------------------------- |
| `PARTS_OF_SPEECH`                                   | Frozen allow-list of starting tags                            |
| `isKnownPartOfSpeech(tag)`                          | Whether a tag is in the shared enum                           |
| `normalizePartsOfSpeech(tags)`                      | Dedupe / stringify; unknown tags kept                         |
| `createWord(partial)`                               | Normalize a Word; generate `id` if missing; mirror timestamps |
| `createLoadOptions(partial)`                        | Normalize `{ since, limit, randomize }`                       |
| `matchWords(words, options)`                        | Look-back filter + sort (no shuffle/limit)                    |
| `applyLoadOptions(words, options)`                  | Shared look-back → sort → shuffle → limit                     |
| `applyLoadOptionsWithMeta(words, options)`          | Same, plus `totalMatched` before limit                        |
| `loadFromSource(sourceId, options)`                 | Registry lookup → `source.load` → apply shared options        |
| `parseWordCsv(text)`                                | Parse CSV-like paste/file text into Word[]                    |
| `createSourceUIHost({ setupHost, panelHost })`      | Mount/teardown adapter `createUI` into page slots             |
| `isWordSource(source)`                              | Structural check for the source interface                     |
| `registerSource(source)`                            | Add a source to the registry                                  |
| `getSource(id)` / `listSources()` / `hasSource(id)` | Registry lookup                                               |

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

1. **Create** `sources/adapters/your-source.js` that implements the `WordSource` interface and calls `KaniKai.registerSource(...)`.
2. **Map** every record with `KaniKai.createWord(...)`.
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
  const KaniKai = global.KaniKai;

  KaniKai.registerSource({
    id: "example-csv",
    label: "Example CSV",
    requiresAuth: false,

    async load(/* options */) {
      const rows = []; // parse file / fetch remote CSV / etc.

      return rows.map((row) =>
        KaniKai.createWord({
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

Words are loaded only through registered adapters under `sources/adapters/` via `KaniKai.loadFromSource`.

## Checklist for a New Source

- [ ] Stable `id` when the backend provides one; otherwise generated per load
- [ ] `word` + `alternatives` + `meanings` always present (arrays may be empty)
- [ ] `created_at` and `last_seen_at` always ISO strings (duplicated when only one timestamp exists)
- [ ] `parts_of_speech` mapped to the shared enum when possible
- [ ] Credentials handled only inside the source
- [ ] Works with and without the shared `since` look-back filter
- [ ] Registered for one-at-a-time selection in the UI
