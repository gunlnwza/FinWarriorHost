// ── BOARD ──

const CYCLES = ['expansion', 'peak', 'recession', 'trough'];

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

function renderKnight() {
  document.querySelectorAll('.color-blob .knight').forEach(el => el.remove());
  const cell = document.querySelector(`.color-blob[data-cell="${knight.position}"]`);
  if (!cell) return;
  const img = document.createElement('img');
  img.src = 'assets/knight.png';
  img.alt = 'knight';
  cell.appendChild(img);
  img.className = 'knight landing';

  const activeCycle = knight.getCell().cycle;
  document.querySelectorAll('.economics-cycle-box').forEach(box => {
    box.classList.toggle('inactive', !box.classList.contains(activeCycle));
  });
}

// ── CONTROLS ──

document.addEventListener('keydown', (e) => {
  if (e.key === 'd' || e.key === 'D') { knight.move(1);  renderKnight(); }
  if (e.key === 'a' || e.key === 'A') { knight.move(-1); renderKnight(); }
});

document.addEventListener('DOMContentLoaded', renderKnight);
