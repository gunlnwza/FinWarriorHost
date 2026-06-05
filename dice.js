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

  const cycle = setInterval(() => showFace(randomFace()), 80);

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
