const DICE_FACES = [
  { src: 'assets/dice/one.png' },
  { src: 'assets/dice/one_star.png' },
  { src: 'assets/dice/two.png' },
  { src: 'assets/dice/two_star.png' },
  { src: 'assets/dice/three.png' },
  { src: 'assets/dice/three_star.png' },
];

// ── DOM (cached once at startup) ──
const dieEl  = document.getElementById('die');
const rollBtn = document.getElementById('rollBtn');

function showFace(face) {
  const img = document.createElement('img');
  img.src = face.src;
  dieEl.replaceChildren(img);
}

function randomFace() {
  return DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)];
}

function renderDice() {
  rollBtn.classList.toggle('just-rolled', !STATE.dice.ready);
}

function rollDice() {
  if (STATE.animating || !STATE.dice.ready) return;
  STATE.animating  = true;
  STATE.dice.ready = false;
  renderDice();
  playSfx(SFX.diceRoll, 0, 0.20, -0.1, 0.30);

  const result = randomFace();
  rollBtn.disabled = true;

  let lastFace = null;
  function randomFaceNoRepeat() {
    const pool = lastFace
      ? DICE_FACES.filter(face => face.src !== lastFace.src)
      : DICE_FACES;
    const next = pool[Math.floor(Math.random() * pool.length)];
    lastFace = next;
    return next;
  }

  const DICE_FACE_SHOW_TIME = 100;
  const cycle = setInterval(
    () => showFace(randomFaceNoRepeat()),
    DICE_FACE_SHOW_TIME
  );

  dieEl.classList.remove('rolling');
  void dieEl.offsetWidth;
  dieEl.classList.add('rolling');

  setTimeout(() => {
    clearInterval(cycle);
    dieEl.classList.remove('rolling');
    showFace(result);
    rollBtn.disabled = false;
    STATE.animating = false;
  }, DURATIONS.diceRoll);

  setTimeout(() => {
    STATE.dice.ready = true;
    renderDice();
  }, DURATIONS.diceReady);
}
