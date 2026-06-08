# The Fin Warrior — Host Controller

A browser-based game host controller for **The Fin Warrior**, a Thai financial literacy board game. Runs entirely in the browser with no build step.

## Running

Open `index.html` directly in a browser:

```bash
open index.html
```

## What it does

The host controller manages the shared game state visible to all players:

| Element | Interaction |
|---|---|
| **Daily Alert deck** | Click to draw and flip a card with animation |
| **Economics Event deck** | Click to draw and flip a card with animation |
| **Dice** | Click to roll (1–3 plain or 1–3 ★ variants) |
| **Knight** | Press `A` / `D` to move backward / forward along the economics cycle |
| **Economics cycle row** | Highlights the phase the knight currently occupies |

## File structure

```
index.html                  — UI layout
css/style.css               — All styling
js/
  state.js                  — Shared animation lock
  board.js                  — Board data model + knight rendering + keyboard controls
  deck.js                   — Card/CardDeck classes + all card data (DECKS)
  dice.js                   — Dice rolling logic
assets/
  knight.png                — Knight piece image
  cards/
    daily_alert/            — Daily Alert card faces + back
    economics_event/        — Economics Event card faces + back
    asset/                  — Asset card faces
  dice/                     — Dice face images (one/two/three, plain + star)
```

## Adding cards

1. Drop a PNG into the matching `assets/cards/<deck>/` folder.
2. Add a `new Card(...)` entry to the matching `CardDeck` in `js/deck.js`.

## Economics cycle board

The board has 8 cells mapped across 4 phases (2 cells each):

| Cells | Phase | Thai |
|---|---|---|
| 0–1 | Expansion | ระยะฟื้นตัว |
| 2–3 | Boom (Peak) | ระยะเฟื่องฟู |
| 4–5 | Recession | ระยะถดถอย |
| 6–7 | Depression (Trough) | ระยะตกต่ำ |

The knight wraps around the board and the active phase is highlighted automatically.
