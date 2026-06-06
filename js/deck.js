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
const cardModal    = document.getElementById('cardModal');
const cardFlipInner = document.getElementById('cardFlipInner');
const cardRevealImg = document.getElementById('cardRevealImg');
const cardBackImg   = document.querySelector('#cardFlipInner .card-back-face img');

// ── DRAW CARD ──
function drawCard(deckId) {
  if (isAnimating) return;
  const card = DECKS[deckId].draw();
  openCardModal(card.imagePath, DECKS[deckId].backImagePath, deckId);
}

function openCardModal(src, backSrc, deckId) {
  isAnimating = true;

  cardRevealImg.src = src;
  cardBackImg.src = backSrc;

  cardFlipInner.classList.remove('revealed');
  cardModal.classList.toggle('daily-alert', deckId === 'daily');
  cardModal.classList.toggle('economics-alert', deckId === 'economics');
  cardModal.classList.add('active');

  setTimeout(() => {
    cardFlipInner.classList.add('revealed');
    isAnimating = false;
  }, 200);
}

function dismissCard() {
  if (isAnimating) return;
  isAnimating = true;

  cardFlipInner.classList.remove('revealed');

  setTimeout(() => {
    cardModal.classList.remove('active');
    isAnimating = false;
  }, 300);
}

// ── DECK MENU ──
function toggleDeckMenu(btn) {
  const menu = btn.closest('.deck-menu');
  const isOpen = menu.classList.contains('open');
  closeDeckMenus();
  if (!isOpen) menu.classList.add('open');
}

function closeDeckMenus() {
  document.querySelectorAll('.deck-menu.open').forEach(m => m.classList.remove('open'));
}

document.addEventListener('click', closeDeckMenus);

// ── SHUFFLE ──
function shuffleDeck(deckId) {
  if (isAnimating) return;
  DECKS[deckId].shuffle();
  const stack = document.getElementById(`deckStack-${deckId}`);
  stack.classList.add('shuffling');
  stack.addEventListener('animationend', () => stack.classList.remove('shuffling'), { once: true });
}

// ── INSPECT MODAL ──
function openInspectModal(deckId) {
  const deck = DECKS[deckId];
  const ordered = [
    ...deck.cards.slice(deck.cursor),
    ...deck.cards.slice(0, deck.cursor),
  ];
  const grid = document.getElementById('inspectGrid');
  grid.innerHTML = ordered
    .map(c => `<img src="${c.imagePath}" alt="${c.id}">`)
    .join('');
  document.getElementById('inspectModal').classList.add('active');
}

function closeInspectModal() {
  document.getElementById('inspectModal').classList.remove('active');
}
