# KaniKai

Turn vocabulary from any word list into conversation practice.

KaniKai is a single-page browser app. Load words from a data source (WaniKani today; CSV, other APIs, and custom sources later), optionally focus on recently seen items or sample from your full set, then generate a ChatGPT-ready prompt for one-turn-at-a-time conversation practice.

## Features

- Choose **native** and **target** languages (English ↔ Japanese) so data sources and practice prompts match the learner
- Pluggable **data sources** that all normalize to one shared word shape
- Optional **look-back** filter on `last_seen_at` (recently learned/seen), or skip it to sample from the full set
- Limit how many words to keep
- Randomize the list before applying the limit
- Copy a formatted word list or a full conversation-practice prompt
- Choose a practice mode (**Speaking**, **Listening**, or **Legacy**) before copying the prompt
- Open ChatGPT in a new tab when you are ready to practice
- Switch the interface between **light** and **dark**, or follow your system appearance

To add a data source, see [DATA_SOURCES.md](./DATA_SOURCES.md). Adapters live in `sources/adapters/`; the shared loading system lives in `sources/core/`.

## Setup

1. Open `index.html` in a modern browser (no build step or server required).
2. Choose your native and target languages, then a data source.

## Usage

1. Choose a **Native language** and **Target language** (Step 1). Both start unselected, and Step 2 stays hidden until you pick two different languages. Available data sources depend on this pair.
2. Choose a **Data source**.
3. Choose a **Look back** range to keep words whose `last_seen_at` falls in that window.
4. Optionally set **Limit results** (leave blank for all matches).
5. Optionally check **Randomize** so the selection is shuffled before the limit is applied.
6. Click **Load vocabulary**.
7. Review the list, then click **Create conversation practice**.
8. On the practice card, choose a mode (**Speaking** is the default):
   - **Speaking** — the AI waits for your questions and can suggest starter words one at a time
   - **Listening** — the AI uses the target words and asks you questions about them
   - **Legacy** — the previous AI-led prompt that encourages you to use the words in conversation
9. Copy the prompt into ChatGPT and start talking. Practice prompts are written in your **native** language and name your **target** language (using your native language only when necessary).

Without randomization, results stay ordered by most recently seen (`last_seen_at`). With randomization on and a limit set, you get a random subset of the matches.

Sample CSV lists for both directions live in `fixtures/` (`en-ja.csv` for English speakers learning Japanese, `ja-en.csv` for Japanese speakers learning English). Use them with **CSV File** or **CSV Paste**.

## Privacy

- Source credentials are stored only in browser `localStorage` when that source needs them.
- Use **Forget token** (or the source’s equivalent) to remove credentials from the device.

## Requirements

- A modern browser with `fetch`, `localStorage`, and clipboard support
- Whatever credentials the selected data source requires

## Project docs

- [DATA_SOURCES.md](./DATA_SOURCES.md) — word contract, shared load options, and how to implement a new data source
