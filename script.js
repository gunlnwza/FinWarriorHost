// ── STATE ──
let isAnimating = false;

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const DECKS = {
  daily: {
    cards: shuffle([
      'assets/cards/daily_alert/air_pollution.png',
      'assets/cards/daily_alert/dividend_agro.png',
      'assets/cards/daily_alert/dividend_consump.png',
      'assets/cards/daily_alert/dividend_healthcare.png',
      'assets/cards/daily_alert/dividend_resource.png',
      'assets/cards/daily_alert/dividend_tech.png',
      'assets/cards/daily_alert/flu_spread.png',
      'assets/cards/daily_alert/price_03.png',
      'assets/cards/daily_alert/prize_01.png',
      'assets/cards/daily_alert/prize_02.png',
      'assets/cards/daily_alert/prize_04.png',
      'assets/cards/daily_alert/prize_05.png',
      'assets/cards/daily_alert/trade_asset.png',
    ]),
    idx: 0,
  },
  economics: {
    cards: shuffle([
      'assets/cards/economics_event/development_in_ai.png',
      'assets/cards/economics_event/global_inflation.png',
      'assets/cards/economics_event/higher_non_farm_unemploy.png',
      'assets/cards/economics_event/higher_oil_price.png',
      'assets/cards/economics_event/higher_vat.png',
      'assets/cards/economics_event/lower_fed_policy_rate.png',
      'assets/cards/economics_event/lower_global_agri_price.png',
      'assets/cards/economics_event/major_flood.png',
      'assets/cards/economics_event/political_problem.png',
      'assets/cards/economics_event/restrict_food_export.png',
      'assets/cards/economics_event/stronger_usd.png',
      'assets/cards/economics_event/support_alternative_energy.png',
      'assets/cards/economics_event/trade_war.png',
    ]),
    idx: 0,
  },
};

function updateDeckCount(deckId) {
  const d = DECKS[deckId];
  const remaining = d.cards.length - d.idx;
  document.getElementById(`deckCount-${deckId}`).textContent =
    remaining > 0 ? `${remaining} card${remaining !== 1 ? 's' : ''} remaining` : 'Deck empty';
}

// ── DRAW CARD ──
function drawCard(deckId) {
  if (isAnimating) return;
  const d = DECKS[deckId];
  if (d.idx >= d.cards.length) {
    document.getElementById(`deckCount-${deckId}`).textContent = 'Deck empty';
    return;
  }
  openCardModal(d.cards[d.idx]);
  d.idx++;
  updateDeckCount(deckId);
}

function openCardModal(src) {
  isAnimating = true;
  const modal = document.getElementById('cardModal');
  const flipInner = document.getElementById('cardFlipInner');
  const img = document.getElementById('cardRevealImg');

  img.src = src;

  // Reset flip state
  flipInner.classList.remove('revealed');
  modal.classList.add('active');

  // Flip to front after brief pause
  setTimeout(() => {
    flipInner.classList.add('revealed');
    isAnimating = false;
  }, 300);
}

function dismissCard() {
  if (isAnimating) return;
  isAnimating = true;

  const modal = document.getElementById('cardModal');
  const flipInner = document.getElementById('cardFlipInner');
  const deckStack = document.getElementById('deckStack');

  // Flip back to card-back first
  flipInner.classList.remove('revealed');

  setTimeout(() => {
    // Get positions
    const cardRect = flipInner.getBoundingClientRect();
    const deckRect = deckStack.getBoundingClientRect();

    // Create flying card clone
    const flyCard = document.createElement('div');
    flyCard.className = 'flying-card';
    flyCard.style.cssText = `
      left: ${cardRect.left}px;
      top: ${cardRect.top}px;
      width: ${cardRect.width}px;
      height: ${cardRect.height}px;
    `;
    document.body.appendChild(flyCard);

    // Hide modal
    modal.classList.remove('active');

    // Animate flying card to deck
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyCard.style.transition = 'all 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
        flyCard.style.left = `${deckRect.left}px`;
        flyCard.style.top = `${deckRect.top + deckRect.height}px`; // slides to bottom
        flyCard.style.width = `${deckRect.width}px`;
        flyCard.style.height = `${deckRect.height}px`;
        flyCard.style.opacity = '0';
        flyCard.style.transform = 'scale(0.85)';
      });
    });

    setTimeout(() => {
      flyCard.remove();
      isAnimating = false;
    }, 600);

  }, 400); // wait for flip-back
}

// ── DICE LOADING ──
// Load up to 6 face images; index 0 = face "1" ... index 5 = face "6"
let diceImages = []; // data URLs, optional

function loadDice(input) {
  const files = Array.from(input.files).slice(0, 6);
  diceImages = [];
  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = e => { diceImages[i] = e.target.result; };
    reader.readAsDataURL(file);
  });
}

// Pip layouts for the placeholder die (when no images loaded)
const pipLayouts = {
  1: '<div class="pips" style="place-items:center"><div class="pip"></div></div>',
  2: '<div class="pips" style="grid-template-columns:1fr 1fr;"><div class="pip" style="grid-column:2"></div><div class="pip" style="grid-column:1;align-self:end"></div></div>',
  3: '<div class="pips" style="grid-template-columns:1fr 1fr;"><div class="pip" style="grid-column:2"></div><div class="pip" style="place-self:center"></div><div class="pip" style="grid-column:1;align-self:end"></div></div>',
  4: '<div class="pips" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>',
  5: '<div class="pips" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;"><div class="pip"></div><div class="pip"></div><div class="pip" style="grid-column:1 / span 2;justify-self:center"></div><div class="pip"></div><div class="pip"></div></div>',
  6: '<div class="pips" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr;"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>',
};

function showFace(n) { // n = 1..6
  const die = document.getElementById('die');
  if (diceImages.length === 6) {
    die.innerHTML = `<img src="${diceImages[n - 1]}" alt="face ${n}">`;
  } else {
    die.innerHTML = pipLayouts[n];
  }
}

// ── ROLL DICE ──
function rollDice() {
  if (isAnimating) return;
  isAnimating = true;

  const die = document.getElementById('die');
  const btn = document.getElementById('rollBtn');
  const badge = document.getElementById('resultBadge');
  const result = Math.floor(Math.random() * 6) + 1; // 1..6

  badge.classList.remove('show');
  btn.disabled = true;

  // shuffle faces visually during the shake
  let ticks = 0;
  const cycle = setInterval(() => { showFace(Math.floor(Math.random() * 6) + 1); ticks++; }, 80);

  die.classList.remove('rolling');
  void die.offsetWidth; // reflow to restart animation
  die.classList.add('rolling');

  setTimeout(() => {
    clearInterval(cycle);
    die.classList.remove('rolling');
    showFace(result); // settle on final face

    badge.textContent = `${result}`;
    badge.classList.add('show');

    btn.disabled = false;
    isAnimating = false;
  }, 600);
}

// Init counts
Object.keys(DECKS).forEach(updateDeckCount);
