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
- `script.js` — Game state (`DECKS` object), card draw/modal logic, dice rolling
- `deck.js` — `Card` and `CardDeck` classes (being introduced in the refactor branch)
- `style.css` — All styling
- `assets/cards/` — Card face images, organized into `daily_alert/`, `economics_event/`, and `asset/` subdirectories
- `assets/dice/` — Dice face images (1–3 plain, 1–3 star variants)

**Current split:** `deck.js` defines the `Card`/`CardDeck` classes but `script.js` still uses the legacy `DECKS` plain-object pattern. The `refactor` branch is migrating `script.js` to use `deck.js`.

**Card draw flow:** clicking a deck stack calls `drawCard(deckId)` → `openCardModal(src)` → CSS flip animation reveals the card face. Dismissing animates a "flying card" clone back to the deck.

**Dice:** `rollDice()` cycles through random pip layouts (or custom images if loaded) then settles on the result. Custom face images can be loaded via `loadDice()`.

## Adding Cards

Drop a PNG into the appropriate `assets/cards/<deck>/` folder and add its path to the `cards` array in `script.js` (`DECKS.daily.cards` or `DECKS.economics.cards`).

## Archive

`archive/slice_cards.py` is a one-off utility to crop card images from a PDF using `pdf2image`. Not part of the app runtime.