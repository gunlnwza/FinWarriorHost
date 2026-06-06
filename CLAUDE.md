# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the App

No build step. Open `index.html` directly in a browser:

```bash
open index.html
```

There is no package.json, no bundler, and no local dev server required.

## Architecture

This is a vanilla HTML/CSS/JS game host controller for **The Fin Warrior**, a financial literacy board game.

**Files:**
- `index.html` — UI with two card deck zones (Daily Alert, Economics Event) and a dice zone
- `js/deck.js` — `Card`/`CardDeck` classes and the `DECKS` object (all card data lives here)
- `js/dice.js` — Dice rolling logic
- `js/state.js` — Shared game state
- `css/style.css` — All styling
- `assets/cards/` — Card face images, organized into `daily_alert/`, `economics_event/`, and `asset/` subdirectories
- `assets/dice/` — Dice face images (1–3 plain, 1–3 star variants)

**Card draw flow:** clicking a deck stack calls `drawCard(deckId)` → `openCardModal(src)` → CSS flip animation reveals the card face.

**Dice:** `rollDice()` cycles through random pip layouts then settles on the result.

## Adding Cards

Drop a PNG into the appropriate `assets/cards/<deck>/` folder and add a `new Card(...)` entry to the matching `CardDeck` in `js/deck.js`.
