# KaniKai

Turn recently learned [WaniKani](https://www.wanikani.com/) vocabulary into conversation practice.

KaniKai is a single-page browser app. You connect with a WaniKani API token, load vocabulary you started learning in a chosen time window, optionally limit or randomize that list, then generate a ChatGPT-ready prompt for one-turn-at-a-time Japanese conversation practice.

## Features

- Save a WaniKani API token locally in your browser (never shipped with the project)
- Load vocabulary started within the last 24 hours to 14 days
- Limit how many words to keep
- Randomize the list before applying the limit
- Copy a formatted word list or a full conversation-practice prompt
- Open ChatGPT in a new tab when you are ready to practice

## Setup

1. Open `index.html` in a modern browser (no build step or server required).
2. In WaniKani, open account settings → API Tokens and create a token with **read** access.
3. Paste the token into KaniKai and click **Save token**.

Your token stays in `localStorage` on that device only.

## Usage

1. Choose a **Look back** range.
2. Optionally set **Limit results** (leave blank for all matches).
3. Optionally check **Randomize** so the selection is shuffled before the limit is applied.
4. Click **Load vocabulary**.
5. Review the list, then click **Create conversation practice**.
6. Copy the prompt into ChatGPT and start talking.

Without randomization, results stay ordered by most recently started. With randomization on and a limit set, you get a random subset of the matches in that time range.

## Privacy

- API calls go directly from your browser to `https://api.wanikani.com/v2`.
- The token is stored only in browser `localStorage` under `wk_conversation_token`.
- Use **Forget token** to remove it from the device.

## Requirements

- A WaniKani account and API token
- A browser with `fetch`, `localStorage`, and clipboard support
