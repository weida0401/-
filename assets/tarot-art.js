(() => {
  'use strict';

  const cardsDirectory = new URL('cards/', document.currentScript.src);
  const library = new URL('../cards/', document.currentScript.src);

  function create(id, reversed, { lazy = false } = {}) {
    const image = document.createElement('img');
    image.className = 'tarot-illustration';
    image.dataset.suit = id.split('-', 1)[0];
    image.classList.toggle('is-reversed', reversed);
    image.alt = '';
    image.decoding = 'async';
    if (lazy) image.loading = 'lazy';
    image.draggable = false;
    image.addEventListener('error', () => {
      const fallback = document.createElement('span');
      fallback.className = 'tarot-art-fallback';
      fallback.textContent = '牌面暫時無法載入';
      image.replaceWith(fallback);
    }, {once: true});
    image.src = new URL(encodeURIComponent(id) + '.webp', cardsDirectory).href;
    return image;
  }

  function meaningUrl(id, reversed) {
    const url = new URL(library);
    url.searchParams.set('card', id);
    url.searchParams.set('orientation', reversed ? 'reversed' : 'upright');
    url.hash = 'card-meaning';
    return url.href;
  }

  window.MoonveilCardArt = { create, meaningUrl };
})();
