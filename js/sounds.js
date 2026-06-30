const audioCtx = new AudioContext();

const SFX = {
  cardDraw:   null,
  cardFlip:   null,
  shuffle:    null,
  diceRoll:   null,
  knightMove: null,
};

async function loadSound(path) {
  const buf = await fetch(path).then(r => r.arrayBuffer());
  return audioCtx.decodeAudioData(buf);
}

(async () => {
  const [takeCard, shuffle, diceRoll, knightMove] = await Promise.all([
    loadSound('assets/sounds/take_card.mp3'),
    loadSound('assets/sounds/shuffle_deck.mp3'),
    loadSound('assets/sounds/roll_dice.mp3'),
    loadSound('assets/sounds/knight_walk.m4a'),
  ]);
  SFX.cardDraw   = takeCard;
  SFX.cardFlip   = takeCard;
  SFX.shuffle    = shuffle;
  SFX.diceRoll   = diceRoll;
  SFX.knightMove = knightMove;
})();

const lastPlayed = new WeakMap();

function playSfx(buffer, minGap = 0, pitchVariance = 0, pitchTrans = 0, volume = 1) {
  if (!buffer) return;
  if (minGap > 0) {
    const last = lastPlayed.get(buffer) ?? 0;
    if (Date.now() - last < minGap) return;
    lastPlayed.set(buffer, Date.now());
  }
  const resume = audioCtx.state === 'suspended' ? audioCtx.resume() : Promise.resolve();
  const source = audioCtx.createBufferSource();
  source.buffer = buffer;
  if (pitchVariance > 0)
    source.playbackRate.value = 1 + (Math.random() * 2 - 1) * pitchVariance + pitchTrans;
  const gain = audioCtx.createGain();
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(audioCtx.destination);
  resume.then(() => source.start(0));
}
