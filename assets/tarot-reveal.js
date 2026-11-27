(() => {
  'use strict';

  const runs = new WeakMap();
  const revealLimit = 1900;
  const revealBaseDuration = 1100;
  const revealStagger = 95;
  const accentDuration = 700;

  function reducedMotion() {
    try {
      return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
    } catch {
      return false;
    }
  }

  function element(tag, className, text = '') {
    const node = document.createElement(tag);
    node.className = className;
    node.textContent = text;
    return node;
  }

  function makeCard({id, name, reversed}, index) {
    const card = element('div', 'tarot-reveal-card');
    card.style.setProperty('--reveal-index', index);
    card.dataset.cardId = id;
    const turn = element('div', 'tarot-reveal-card-turn');
    const back = element('div', 'tarot-reveal-back', '☾');
    const front = element('div', 'tarot-reveal-front');
    const art = window.MoonveilCardArt?.create?.(id, reversed);
    front.append(
      art ?? element('span', 'tarot-art-fallback', '✦'),
      element('span', 'tarot-reveal-name', name),
      element('span', 'tarot-reveal-orientation', reversed ? '逆位' : '正位')
    );
    turn.append(back, front);
    card.append(turn);
    return card;
  }

  function makeScene(entries) {
    const scene = element('div', 'tarot-reveal-scene');
    scene.setAttribute('aria-hidden', 'true');
    scene.style.setProperty('--reveal-count', entries.length);
    const cards = element('div', 'tarot-reveal-cards');
    cards.append(...entries.map(makeCard));
    scene.append(element('div', 'tarot-reveal-halo'), cards);
    return scene;
  }

  function runningAnimations(stage) {
    try {
      return stage.getAnimations?.({subtree: true}).filter(animation => {
        const end = animation.effect?.getComputedTiming?.().endTime;
        return Number.isFinite(end) && end > 0;
      });
    } catch {
      return undefined;
    }
  }

  function waitForReveal(stage, count, signal) {
    const animations = runningAnimations(stage);
    if (signal.aborted || animations?.length === 0) return Promise.resolve();

    return new Promise(resolve => {
      const fallback = Math.min(revealLimit, revealBaseDuration + (count - 1) * revealStagger);
      const timer = window.setTimeout(finish, animations ? revealLimit : fallback);

      function finish() {
        window.clearTimeout(timer);
        signal.removeEventListener('abort', finish);
        resolve();
      }

      signal.addEventListener('abort', finish, {once: true});
      if (animations) Promise.allSettled(animations.map(animation => animation.finished)).then(finish);
    });
  }

  async function play(stage, entries, signal) {
    if (!stage || !Array.isArray(entries) || !entries.length || signal?.aborted || reducedMotion()) return;
    runs.get(stage)?.abort();
    const controller = new AbortController();
    runs.set(stage, controller);
    const abort = () => controller.abort();
    signal?.addEventListener('abort', abort, {once: true});

    try {
      stage.replaceChildren(makeScene(entries));
      stage.classList.add('is-revealing');
      stage.hidden = false;
      await waitForReveal(stage, entries.length, controller.signal);
    } finally {
      signal?.removeEventListener('abort', abort);
      if (runs.get(stage) === controller) {
        runs.delete(stage);
        stage.hidden = true;
        stage.classList.remove('is-revealing');
        stage.replaceChildren();
      }
    }
  }

  function accent(openedCard) {
    if (!openedCard || reducedMotion() || openedCard.classList.contains('is-tarot-reveal-accent')) return;
    openedCard.classList.add('is-tarot-reveal-accent');
    window.setTimeout(() => openedCard.classList.remove('is-tarot-reveal-accent'), accentDuration);
  }

  window.MoonveilTarotReveal = { play, accent };
})();
