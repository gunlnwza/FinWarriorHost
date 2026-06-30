const DURATIONS = {
  cardSlide:  250,
  cardFlip:   700,
  shuffle:   1000,
  modal:      300,
  diceRoll:   800,
  diceReady: 1500,
  returns:    400,
};

const STATE = {
  animating: false,
  cards: {
    daily:     { drawn: false, flipped: false },
    economics: { drawn: false, flipped: false },
  },
  menus: {
    daily:     false,
    economics: false,
  },
  dice: {
    ready: true,
  },
  inspectModal: false,
  cardModal:    null,
  returnsOpen:  false,
};
