// ── STATE ──
let isAnimating = false;
let lastDeckId = null;

const DECKS = {
  daily: new CardDeck('daily', 'Daily Alert', 'assets/cards/daily_alert/back.png', [
    new Card('air_pollution',       'daily', 'assets/cards/daily_alert/air_pollution.png'),
    new Card('dividend_agro',       'daily', 'assets/cards/daily_alert/dividend_agro.png'),
    new Card('dividend_consump',    'daily', 'assets/cards/daily_alert/dividend_consump.png'),
    new Card('dividend_healthcare', 'daily', 'assets/cards/daily_alert/dividend_healthcare.png'),
    new Card('dividend_resource',   'daily', 'assets/cards/daily_alert/dividend_resource.png'),
    new Card('dividend_tech',       'daily', 'assets/cards/daily_alert/dividend_tech.png'),
    new Card('flu_spread',          'daily', 'assets/cards/daily_alert/flu_spread.png'),
    new Card('price_03',            'daily', 'assets/cards/daily_alert/price_03.png'),
    new Card('prize_01',            'daily', 'assets/cards/daily_alert/prize_01.png'),
    new Card('prize_02',            'daily', 'assets/cards/daily_alert/prize_02.png'),
    new Card('prize_04',            'daily', 'assets/cards/daily_alert/prize_04.png'),
    new Card('prize_05',            'daily', 'assets/cards/daily_alert/prize_05.png'),
    new Card('trade_asset',         'daily', 'assets/cards/daily_alert/trade_asset.png'),
  ]),
  economics: new CardDeck('economics', 'Economics Event', 'assets/cards/economics_event/back.png', [
    new Card('development_in_ai',          'economics', 'assets/cards/economics_event/development_in_ai.png'),
    new Card('global_inflation',           'economics', 'assets/cards/economics_event/global_inflation.png'),
    new Card('higher_non_farm_unemploy',   'economics', 'assets/cards/economics_event/higher_non_farm_unemploy.png'),
    new Card('higher_oil_price',           'economics', 'assets/cards/economics_event/higher_oil_price.png'),
    new Card('higher_vat',                 'economics', 'assets/cards/economics_event/higher_vat.png'),
    new Card('lower_fed_policy_rate',      'economics', 'assets/cards/economics_event/lower_fed_policy_rate.png'),
    new Card('lower_global_agri_price',    'economics', 'assets/cards/economics_event/lower_global_agri_price.png'),
    new Card('major_flood',                'economics', 'assets/cards/economics_event/major_flood.png'),
    new Card('political_problem',          'economics', 'assets/cards/economics_event/political_problem.png'),
    new Card('restrict_food_export',       'economics', 'assets/cards/economics_event/restrict_food_export.png'),
    new Card('stronger_usd',               'economics', 'assets/cards/economics_event/stronger_usd.png'),
    new Card('support_alternative_energy', 'economics', 'assets/cards/economics_event/support_alternative_energy.png'),
    new Card('trade_war',                  'economics', 'assets/cards/economics_event/trade_war.png'),
  ]),
};

Object.values(DECKS).forEach(deck => deck.shuffle());

function updateDeckCount(deckId) {
  const deck = DECKS[deckId];
  const remaining = deck.cards.length - deck.cursor;
  document.getElementById(`deckCount-${deckId}`).textContent =
    `${remaining} card${remaining !== 1 ? 's' : ''} remaining`;
}

// ── DRAW CARD ──
function drawCard(deckId) {
  if (isAnimating) return;
  lastDeckId = deckId;
  const card = DECKS[deckId].draw();
  openCardModal(card.imagePath);
  updateDeckCount(deckId);
}

function openCardModal(src) {
  isAnimating = true;
  const modal = document.getElementById('cardModal');
  const flipInner = document.getElementById('cardFlipInner');
  const img = document.getElementById('cardRevealImg');

  img.src = src;

  flipInner.classList.remove('revealed');
  modal.classList.add('active');

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
  const deckStack = document.getElementById(`deckStack-${lastDeckId}`);

  flipInner.classList.remove('revealed');

  setTimeout(() => {
    const cardRect = flipInner.getBoundingClientRect();
    const deckRect = deckStack.getBoundingClientRect();

    const flyCard = document.createElement('div');
    flyCard.className = 'flying-card';
    flyCard.style.cssText = `
      left: ${cardRect.left}px;
      top: ${cardRect.top}px;
      width: ${cardRect.width}px;
      height: ${cardRect.height}px;
    `;
    document.body.appendChild(flyCard);

    modal.classList.remove('active');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        flyCard.style.transition = 'all 0.55s cubic-bezier(0.4, 0, 0.2, 1)';
        flyCard.style.left = `${deckRect.left}px`;
        flyCard.style.top = `${deckRect.top + deckRect.height}px`;
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

  }, 400);
}

// ── DICE LOADING ──
let diceImages = [];

function loadDice(input) {
  const files = Array.from(input.files).slice(0, 6);
  diceImages = [];
  files.forEach((file, i) => {
    const reader = new FileReader();
    reader.onload = e => { diceImages[i] = e.target.result; };
    reader.readAsDataURL(file);
  });
}

const pipLayouts = {
  1: '<div class="pips" style="place-items:center"><div class="pip"></div></div>',
  2: '<div class="pips" style="grid-template-columns:1fr 1fr;"><div class="pip" style="grid-column:2"></div><div class="pip" style="grid-column:1;align-self:end"></div></div>',
  3: '<div class="pips" style="grid-template-columns:1fr 1fr;"><div class="pip" style="grid-column:2"></div><div class="pip" style="place-self:center"></div><div class="pip" style="grid-column:1;align-self:end"></div></div>',
  4: '<div class="pips" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>',
  5: '<div class="pips" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;"><div class="pip"></div><div class="pip"></div><div class="pip" style="grid-column:1 / span 2;justify-self:center"></div><div class="pip"></div><div class="pip"></div></div>',
  6: '<div class="pips" style="grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr 1fr;"><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div><div class="pip"></div></div>',
};

function showFace(n) {
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
  const result = Math.floor(Math.random() * 6) + 1;

  badge.classList.remove('show');
  btn.disabled = true;

  let ticks = 0;
  const cycle = setInterval(() => { showFace(Math.floor(Math.random() * 6) + 1); ticks++; }, 80);

  die.classList.remove('rolling');
  void die.offsetWidth;
  die.classList.add('rolling');

  setTimeout(() => {
    clearInterval(cycle);
    die.classList.remove('rolling');
    showFace(result);

    badge.textContent = `${result}`;
    badge.classList.add('show');

    btn.disabled = false;
    isAnimating = false;
  }, 600);
}

// Init counts
Object.keys(DECKS).forEach(updateDeckCount);
