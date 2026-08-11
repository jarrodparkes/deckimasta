# KaniKai

Turn vocabulary from any word list into conversation practice.

KaniKai is a single-page browser app. Load words from a data source (WaniKani today; CSV, other APIs, and custom sources later), optionally focus on recently seen items or sample from your full set, then generate a ChatGPT-ready prompt for one-turn-at-a-time conversation practice.

## Features

- Pluggable **data sources** that all normalize to one shared word shape
- Optional **look-back** filter on `last_seen_at` (recently learned/seen), or skip it to sample from the full set
- Limit how many words to keep
- Randomize the list before applying the limit
- Copy a formatted word list or a full conversation-practice prompt
- Choose a practice mode (**Speaking**, **Listening**, or **Legacy**) before copying the prompt
- Open ChatGPT in a new tab when you are ready to practice

Built-in source today: [WaniKani](https://www.wanikani.com/) (API token stored only in this browser). Also supports pasting or uploading a simple CSV-like word list.

To add another source, see [DATA_SOURCES.md](./DATA_SOURCES.md). Adapters live in `sources/adapters/`; the shared loading system lives in `sources/core/`.

## Setup

1. Open `index.html` in a modern browser (no build step or server required).
2. Choose a data source. For WaniKani:
   - Open account settings → API Tokens and create a token with **read** access.
   - Paste the token into KaniKai and click **Save token**.
   - Your token stays in `localStorage` on that device only.

## Usage

1. Choose a **Data source** (WaniKani is built in).
2. Choose a **Look back** range to keep words whose `last_seen_at` falls in that window.
3. Optionally set **Limit results** (leave blank for all matches).
4. Optionally check **Randomize** so the selection is shuffled before the limit is applied.
5. Click **Load vocabulary**.
6. Review the list, then click **Create conversation practice**.
7. On the practice card, choose a mode (**Speaking** is the default):
   - **Speaking** — the AI waits for your questions and can suggest starter words one at a time
   - **Listening** — the AI uses the target words and asks you questions about them
   - **Legacy** — the previous AI-led prompt that encourages you to use the words in conversation
8. Copy the prompt into ChatGPT and start talking.

Without randomization, results stay ordered by most recently seen (`last_seen_at`). With randomization on and a limit set, you get a random subset of the matches.

## Privacy

- For WaniKani, API calls go directly from your browser to `https://api.wanikani.com/v2`.
- Source credentials (such as a WaniKani token) are stored only in browser `localStorage` when that source needs them.
- Use **Forget token** (or the source’s equivalent) to remove credentials from the device.

## Requirements

- A modern browser with `fetch`, `localStorage`, and clipboard support
- Whatever credentials the selected data source requires (WaniKani needs a read API token)

## Project docs

- [DATA_SOURCES.md](./DATA_SOURCES.md) — word contract, shared load options, and how to implement a new data source
