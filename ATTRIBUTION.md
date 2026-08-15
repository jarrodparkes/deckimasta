# Attribution

DeckiMasta includes curated vocabulary lists from the following projects.

## Top 1000 English (`sources/data/top-1000-english.js`)

- Upstream: [SMenigat/thousand-most-common-words](https://github.com/SMenigat/thousand-most-common-words)
- License: MIT
- Used for: Japanese → English learners (English headwords with Japanese glosses)

## JLPT N5 (`sources/data/jlpt-n5.js`)

- Upstream: [evanclan/OpenJLPT](https://github.com/evanclan/OpenJLPT) (`data/json/vocab/n5.json`)
- License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Used for: English → Japanese learners (Japanese headwords with readings and English meanings)
- OpenJLPT vocabulary level assignments derive from community JLPT lists (including Jonathan Waller’s tanos.co.uk lists, CC BY). See the OpenJLPT project for full sourcing notes.

## TOEIC Service List / TSL (`sources/data/toeic-tsl.js`)

- Upstream download: [DiQt — TOEIC英単語（TSL）](https://www.diqt.net/ja/word_tags/3/download)
- Word list credit: TOEIC Service List by Browne, C. and Culligan, B.; Tanaka Corpus; DiQt Editors
- License: [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
- Used for: Japanese → English learners (English headwords with Japanese glosses)
- Used raw CSV and converted to JS file slimmed for DeckiMasta

Modifications: lists were slimmed to the fields DeckiMasta needs (`id`, `word`, `alternatives` / readings, `meanings`) and shipped as JS globals so they load under `file://`. Dictionary markup in TSL glosses was normalized (sense splits, countability tags stripped), and each TSL entry keeps only the first primary Japanese gloss for cleaner study cards.
