(() => {
  'use strict';

  const cardsDirectory = new URL('cards/', document.currentScript.src);

  function create(id, reversed) {
    const image = document.createElement('img');
    image.className = 'tarot-illustration';
    image.classList.toggle('is-reversed', reversed);
    image.alt = '';
    image.decoding = 'async';
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

  window.MoonveilCardArt = { create };
})();
