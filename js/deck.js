class Card {
  constructor(id, deckType, imagePath) {
    this.id = id;
    this.deckType = deckType;
    this.imagePath = imagePath;
    Object.freeze(this);
  }
}

class CardDeck {
  constructor(id, label, backImagePath, cards) {
    if (cards.length === 0) throw new Error(`CardDeck "${id}" must have at least one card`);
    this.id = id;
    this.label = label;
    this.backImagePath = backImagePath;
    this.cards = [...cards];
    this.cursor = 0;
  }

  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
    this.cursor = 0;
  }

  draw() {
    const card = this.cards[this.cursor];
    this.cursor = (this.cursor + 1) % this.cards.length;
    if (this.cursor === 0) this.shuffle();
    return card;
  }

  peek() {
    return this.cards[this.cursor];
  }
}


// ── STATE ──
// Use 2 trade_asset and 2 political_problem cards, as per the game spec.
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
    new Card('political_problem',          'economics', 'assets/cards/economics_event/political_problem.png'),
    new Card('restrict_food_export',       'economics', 'assets/cards/economics_event/restrict_food_export.png'),
    new Card('stronger_usd',               'economics', 'assets/cards/economics_event/stronger_usd.png'),
    new Card('support_alternative_energy', 'economics', 'assets/cards/economics_event/support_alternative_energy.png'),
    new Card('trade_war',                  'economics', 'assets/cards/economics_event/trade_war.png'),
  ]),
};

Object.values(DECKS).forEach(deck => deck.shuffle());

// ── DOM (cached once at startup) ──
const cardSlots = {
  daily:      document.getElementById('cardSlot-daily'),
  economics:  document.getElementById('cardSlot-economics'),
};
const cardFlips = {
  daily:      document.getElementById('cardFlip-daily'),
  economics:  document.getElementById('cardFlip-economics'),
};
const cardImgs = {
  daily:      document.getElementById('cardRevealImg-daily'),
  economics:  document.getElementById('cardRevealImg-economics'),
};
const cardModal     = document.getElementById('cardModal');
const cardFlipInner = document.getElementById('cardFlipInner');
const cardRevealImg = document.getElementById('cardRevealImg');

// ── RENDER ──

function renderCards() {
  for (const deckId of ['daily', 'economics']) {
    const { drawn, flipped } = STATE.cards[deckId];
    cardSlots[deckId].classList.toggle('active', drawn);
    cardFlips[deckId].classList.toggle('revealed', flipped);
  }
}

function renderMenus() {
  for (const deckId of ['daily', 'economics']) {
    document.querySelector(`.deck-menu[data-deck="${deckId}"]`)
      .classList.toggle('open', STATE.menus[deckId]);
  }
}

function renderCardModal() {
  const open = STATE.cardModal !== null;
  cardModal.classList.toggle('active', open);
  if (open) {
    const deckId = STATE.cardModal;
    cardRevealImg.src = cardImgs[deckId].src;
    cardModal.classList.toggle('daily-alert',     deckId === 'daily');
    cardModal.classList.toggle('economics-alert', deckId === 'economics');
  }
}

function renderInspectModal() {
  document.getElementById('inspectModal').classList.toggle('active', STATE.inspectModal);
}

// ── DRAW CARD ──

function drawCard(deckId) {
  if (STATE.animating || STATE.cards[deckId].drawn) return;
  STATE.animating = true;
  playSfx(SFX.cardDraw, 0, 0.1);
  const card = DECKS[deckId].draw();
  cardImgs[deckId].src = card.imagePath;
  STATE.cards[deckId].drawn   = true;
  STATE.cards[deckId].flipped = false;
  renderCards();
  setTimeout(() => {
    STATE.cards[deckId].flipped = true;
    renderCards();
    STATE.animating = false;
  }, 50);
}

function returnCard(deckId) {
  playSfx(SFX.cardDraw, 0, 0.1, -0.2);
  STATE.cards[deckId].drawn   = false;
  STATE.cards[deckId].flipped = false;
  renderCards();
}

// ── CARD MODAL ──

function openCardModal(deckId) {
  if (!STATE.cards[deckId].drawn) return;
  STATE.cardModal = deckId;
  cardFlipInner.style.transition = 'none';
  cardFlipInner.classList.add('revealed');
  void cardFlipInner.offsetWidth;
  cardFlipInner.style.transition = '';
  renderCardModal();
}

function closeCardModal() {
  STATE.cardModal = null;
  cardFlipInner.style.transition = 'none';
  cardFlipInner.classList.remove('revealed');
  void cardFlipInner.offsetWidth;
  cardFlipInner.style.transition = '';
  renderCardModal();
}

// ── DECK MENU ──

function toggleDeckMenu(deckId) {
  const wasOpen = STATE.menus[deckId];
  closeDeckMenus();
  STATE.menus[deckId] = !wasOpen;
  renderMenus();
}

function closeDeckMenus() {
  STATE.menus.daily     = false;
  STATE.menus.economics = false;
  renderMenus();
}

document.addEventListener('click', closeDeckMenus);

// ── SHUFFLE ──

function shuffleDeck(deckId) {
  if (STATE.animating) return;
  playSfx(SFX.shuffle, 0, 0.1);
  DECKS[deckId].shuffle();
  const stack = document.getElementById(`deckStack-${deckId}`);
  stack.classList.add('shuffling');
  setTimeout(() => stack.classList.remove('shuffling'), DURATIONS.shuffle);
}

// ── INSPECT MODAL ──

function openInspectModal(deckId) {
  const deck = DECKS[deckId];
  const ordered = [
    ...deck.cards.slice(deck.cursor),
    ...deck.cards.slice(0, deck.cursor),
  ];
  const grid = document.getElementById('inspectGrid');
  grid.className = `inspect-grid ${deckId}-alert`;
  grid.innerHTML = ordered
    .map(c => `<img src="${c.imagePath}" alt="${c.id}">`)
    .join('');
  STATE.inspectModal = true;
  renderInspectModal();
}

function closeInspectModal() {
  STATE.inspectModal = false;
  renderInspectModal();
}
