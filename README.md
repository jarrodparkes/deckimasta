# DeckiMasta

Make vocabulary decks for mastering conversation.

DeckiMasta is a single-page browser app. Load words from a data source and builds vocabulary decks that can be used for one-turn-at-a-time conversation practice.

## Features

- Choose **native** and **target** languages (English ↔ Japanese) so data sources and practice prompts match the learner
- Pluggable **data sources** that all normalize to one shared word shape, including:
  - **WaniKani** (English → Japanese, API token)
  - **JLPT N5** static vocabulary (English → Japanese)
  - **Top 1000 English** static frequency list with Japanese glosses (Japanese → English)
  - **TOEIC Service List (TSL)** static TOEIC-oriented English vocabulary with Japanese glosses (Japanese → English)
  - **New General Service List (NGSL)** static high-frequency English vocabulary with Japanese glosses (Japanese → English)
  - **CSV Paste** / **CSV File** (any pair)
- Source picker **tooltips** that explain the selected source for the current language pair
- Optional **look-back** filter on `last_seen_at` when the source has learner progress (hidden for static lists)
- Optional **part of speech** multi-select under **More filters** when the source provides POS tags (NGSL, WaniKani, CSV)
- Limit how many words to keep
- Randomize the list before applying the limit
- Copy a formatted word list or a full conversation-practice prompt
- Choose a practice mode (**Speaking** or **Listening**) before copying the prompt
- Open ChatGPT in a new tab when you are ready to practice
- Switch the interface between **light** and **dark**, or follow your system appearance

To add a data source, see [DATA_SOURCES.md](./DATA_SOURCES.md). Adapters live in `sources/adapters/`; the shared loading system lives in `sources/core/`.

## Setup

1. Open `index.html` in a modern browser (no build step or server required).
2. Choose your native and target languages, then a data source.

## Usage

1. Choose a **Native language** and **Target language** (Step 1). Both start unselected, and Step 2 stays hidden until you pick two different languages. Available data sources depend on this pair.
2. Choose a **Data source**.
3. Choose a **Look back** range to keep words whose `last_seen_at` falls in that window, or **All time** to skip the recency filter (hidden when the source has no study dates).
4. Optionally open **More filters** to choose one or more **Part of speech** tags when the source provides them (hidden otherwise). Matching is any-tag; untagged words are excluded once you select a tag. Use **Select all** / **Clear all** to flip the whole set.
5. Set **Limit** (default 5; allowed range 1–100).
6. Optionally check **Randomize** so the selection is shuffled before the limit is applied.
7. Click **Build deck**.
8. Review the deck, then click **Practice this deck**.
9. On the practice card, choose a mode (**Speaking** is the default):
   - **Speaking** — the AI waits for your questions and can suggest starter words one at a time
   - **Listening** — the AI uses the target words and asks you questions about them
10. Copy the prompt into ChatGPT and start talking. Practice prompts are written in your **native** language and name your **target** language (using your native language only when necessary).

Without randomization, results stay ordered by most recently seen (`last_seen_at`). With randomization on and a limit set, you get a random subset of the matches. Part of speech filtering runs after look-back and before randomize/limit, so a tight filter may yield fewer words than the limit.

Sample CSV lists for both directions live in `fixtures/` (`en-ja.csv` for English speakers learning Japanese, `ja-en.csv` for Japanese speakers learning English). Use them with **CSV File** or **CSV Paste**.

## Privacy

- Source credentials are stored only in browser `localStorage` when that source needs them.
- Use **Forget token** (or the source’s equivalent) to remove credentials from the device.

## Requirements

- A modern browser with `fetch`, `localStorage`, and clipboard support
- Whatever credentials the selected data source requires

## Project docs

- [DATA_SOURCES.md](./DATA_SOURCES.md) — word contract, shared load options, and how to implement a new data source
- [ATTRIBUTION.md](./ATTRIBUTION.md) — licenses for bundled vocabulary lists
