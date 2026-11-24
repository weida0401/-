async function playTarotShuffle(stage) {
  const stack = document.createElement('div');
  stack.className = 'tarot-shuffle-stack';
  for (let index = 0; index < 8; index++) {
    const card = document.createElement('span');
    card.className = 'tarot-shuffle-card';
    card.textContent = '☾';
    card.style.setProperty('--shuffle-index', index);
    card.style.setProperty('--shuffle-packet', index % 2 === 0 ? -1 : 1);
    card.style.setProperty('--shuffle-rank', Math.floor(index / 2));
    stack.append(card);
  }
  stage.replaceChildren(stack);
  stage.hidden = false;

  try {
    const animations = stage.getAnimations?.({subtree: true}) ?? [];
    await Promise.allSettled(animations.map(animation => animation.finished));
  } finally {
    if (stage.firstChild === stack) {
      stage.hidden = true;
      stage.replaceChildren();
    }
  }
}
