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

function randomFaceExclude(excludeFace) {
  const filtered = DICE_FACES.filter(face => face.src !== excludeFace.src);
  return filtered[Math.floor(Math.random() * filtered.length)];
}


let lastFace = null;

function randomFaceNoRepeat() {
  const pool = lastFace
  ? DICE_FACES.filter(face => face.src !== lastFace.src)
  : DICE_FACES;
  
  const next = pool[Math.floor(Math.random() * pool.length)];
  lastFace = next;
  return next;
}

let face_index = DICE_FACES.length - 1;

function nextFace() {
  face_index = (face_index + 1) % DICE_FACES.length;
  return DICE_FACES[face_index]
}

function rollDice() {
  if (isAnimating) return;
  isAnimating = true;

  const die = document.getElementById('die');
  const btn = document.getElementById('rollBtn');
  const result = nextFace();

  btn.disabled = true;

  const cycle = setInterval(() => showFace(randomFaceNoRepeat()), 100);
  // const cycle = setInterval(() => showFace(nextFace()), 600);

  die.classList.remove('rolling');
  void die.offsetWidth;
  die.classList.add('rolling');

  setTimeout(() => {
    clearInterval(cycle);
    die.classList.remove('rolling');
    showFace(result);
    btn.disabled = false;
    isAnimating = false;
  }, 600);
}
