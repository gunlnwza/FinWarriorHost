const DICE_FACES = [
  { src: 'assets/dice/one.png' },
  { src: 'assets/dice/one_star.png' },
  { src: 'assets/dice/two.png' },
  { src: 'assets/dice/two_star.png' },
  { src: 'assets/dice/three.png' },
  { src: 'assets/dice/three_star.png' },
];

function showFace(face) {
  document.getElementById('die').innerHTML = `<img src="${face.src}" alt="">`;
}

function randomFace() {
  return DICE_FACES[Math.floor(Math.random() * DICE_FACES.length)]
}

function rollDice() {
  if (isAnimating) return;
  isAnimating = true;

  const die = document.getElementById('die');
  const btn = document.getElementById('rollBtn');
  const result = randomFace();

  btn.disabled = true;

  let lastFace = null;
  function randomFaceNoRepeat() {
    const pool = lastFace
    ? DICE_FACES.filter(face => face.src !== lastFace.src)
    : DICE_FACES;
    
    const next = pool[Math.floor(Math.random() * pool.length)];
    lastFace = next;
    return next;
  }

  const DICE_AIR_TIME = 600;
  const DICE_FACE_SHOW_TIME = 150;
  const cycle = setInterval(
    () => showFace(randomFaceNoRepeat()),
    DICE_FACE_SHOW_TIME
  );

  die.classList.remove('rolling');
  void die.offsetWidth;
  die.classList.add('rolling');

  setTimeout(() => {
    clearInterval(cycle);
    die.classList.remove('rolling');
    showFace(result);
    btn.disabled = false;
    isAnimating = false;
  }, DICE_AIR_TIME);
}
