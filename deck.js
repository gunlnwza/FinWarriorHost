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
