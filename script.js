
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
  document.querySelector('#cardFlipInner .card-back-face img').src = DECKS[lastDeckId].backImagePath;

  flipInner.classList.remove('revealed');
  modal.classList.toggle('daily-alert', lastDeckId === 'daily');
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

// Init counts
Object.keys(DECKS).forEach(updateDeckCount);
