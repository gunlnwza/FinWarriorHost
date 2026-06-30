// ── BOARD ──

const boardSection  = document.getElementById('boardSection');
const returnsPanel  = document.getElementById('returnsPanel');
const returnsChevron = document.querySelector('.returns-chevron');

const CYCLES = ['expansion', 'peak', 'recession', 'trough'];

const RETURNS = {
	"stock_tech": [3, 4, 5, 6, -4, -3, -5, -5],
	"stock_resource": [3, 4, 6, 5, -5, -4, -4, -3],
	"stock_consump": [3, 4, 3, 5, -1, -2, -4, -5],
	"stock_agro": [2, 1, 5, 5, -2, -3, -5, -4],
	"stock_healthcare": [2, 3, 2, 3, 2, -2, -2, -2],
	"mf_real_estate": [2, 3, 5, 6, -2, -4, -4, -5],
	"mf_fixed_income": [1, 2, -1, -2, 1, 1, -2, -3],
	"mf_mixed_fund": [2, 3, 4, 4, -2, -2, -2, -4],
	"gold": [-2, -4, -5, -6, 4, 5, 7, 8]
}

const BOARD = CYCLES.flatMap((cycle, i) => [
  Object.freeze({ index: i * 2,     cycle, cycleSlot: 0 }),
  Object.freeze({ index: i * 2 + 1, cycle, cycleSlot: 1 }),
]);

// ── KNIGHT ──

class Knight {
  constructor() {
    this.position = 0;
  }

  move(steps) {
    this.position = ((this.position + steps) % 8 + 8) % 8;
  }

  getCell() {
    return BOARD[this.position];
  }

  reset() {
    this.position = 0;
  }
}

const knight = new Knight();

// ── RENDER ──

function renderBoard() {
  document.querySelectorAll('.color-blob .knight, .color-blob .knight-tooltip').forEach(el => el.remove());
  const cell = document.querySelector(`.color-blob[data-cell="${knight.position}"]`);
  if (!cell) return;

  const img = document.createElement('img');
  img.src = 'assets/knight.png';
  img.alt = 'knight';

  const tooltip = document.createElement('span');
  tooltip.className = 'knight-tooltip';
  tooltip.innerHTML = 'กด A หรือ D<br>เพื่อเดินนักรบ<br>';

  cell.appendChild(img);
  cell.appendChild(tooltip);
  img.className = 'knight landing';

  const activeCycle = knight.getCell().cycle;
  document.querySelectorAll('.economics-cycle-box').forEach(box => {
    box.dataset.active = box.classList.contains(activeCycle) ? 'true' : 'false';
  });

  renderReturnsPanel();
}

// ── RETURNS PANEL ──

function toggleReturns() {
  STATE.returnsOpen = !STATE.returnsOpen;
  renderReturnsPanel();
}

const RETURNS_ROWS = [
  ['mf_real_estate', 'mf_fixed_income', 'mf_mixed_fund', 'gold'],
  ['stock_tech', 'stock_resource', 'stock_consump', 'stock_agro', 'stock_healthcare'],
];

const returnsValueEls = {};

function initReturnsPanel() {
  const wrapper = document.createElement('div');
  wrapper.className = 'returns-rows-wrapper';

  for (const row of RETURNS_ROWS) {
    const rowEl = document.createElement('div');
    rowEl.className = 'returns-row';
    for (const key of row) {
      const tile = document.createElement('div');
      tile.className = 'returns-tile';

      const img = document.createElement('img');
      img.src = `assets/cards/asset/logo/${key}.png`;
      img.alt = key;

      const span = document.createElement('span');
      span.className = 'returns-value';
      returnsValueEls[key] = span;

      tile.appendChild(img);
      tile.appendChild(span);
      rowEl.appendChild(tile);
    }
    wrapper.appendChild(rowEl);
  }

  returnsPanel.appendChild(wrapper);
}

function renderReturnsPanel() {
  boardSection.classList.toggle('open', STATE.returnsOpen);
  returnsChevron.textContent = STATE.returnsOpen ? '∨' : '∧';

  const pos = knight.position;
  for (const [key, values] of Object.entries(RETURNS)) {
    const val  = values[pos];
    const sign = val > 0 ? '+' : '';
    const cls  = val > 0 ? 'positive' : val < 0 ? 'negative' : 'zero';
    const el   = returnsValueEls[key];
    el.textContent    = `${sign}${val}K`;
    el.className      = `returns-value ${cls}`;
  }
}

// ── CONTROLS ──

const SOUND_GAP = 100;

document.addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'D' || e.key === "ก" || e.key === "ฏ") {
    playSfx(SFX.knightMove, SOUND_GAP, 0.1); knight.move(1);  renderBoard();
  }
  if (e.key === 'a' || e.key === 'A' || e.key === "ฟ" || e.key === "ฤ") {
    playSfx(SFX.knightMove, SOUND_GAP, 0.1); knight.move(-1); renderBoard();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  initReturnsPanel();
  renderBoard();
});
