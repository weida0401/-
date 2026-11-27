(() => {
  'use strict';

  const get = (id) => document.getElementById(id);
  const cardsPerDeck = 78;
  const groupNames = {
    major: '大阿爾克納', wands: '權杖', cups: '聖杯', swords: '寶劍', pentacles: '錢幣',
  };
  const detail = get('card-meaning');
  const title = get('meaning-title');
  const grid = get('library-grid');
  const filters = get('library-filters');
  const search = get('library-search');
  const status = get('library-status');
  const retry = get('library-retry');
  const sideList = get('meaning-sides');
  const sides = Array.from(sideList.children);
  const art = window.MoonveilCardArt;
  let entries = [];
  let byCardId = new Map();
  let group = 'all';

  function element(tag, text = '', className = '') {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function groupOf(card) {
    return card.arcana === 'major' ? 'major' : card.suit;
  }

  function normalize(text) {
    return text.normalize('NFKC').toLowerCase().trim();
  }

  function createTile(card) {
    const tile = element('li');
    const link = element('a', '', 'library-card');
    link.href = art.meaningUrl(card.id, false);
    link.dataset.card = card.id;
    const image = element('div', '', 'library-card-art');
    image.append(art.create(card.id, false, { lazy: true }));
    const copy = element('div', '', 'library-card-copy');
    copy.append(
      element('strong', card.name_zh_hant, 'library-card-title'),
      element('span', card.keyword_zh_hant, 'library-card-keyword'),
    );
    link.append(image, copy);
    tile.append(link);
    return tile;
  }

  function renderList() {
    const query = normalize(search.value);
    const matching = entries.filter((entry) => (
      (group === 'all' || entry.group === group) && entry.searchText.includes(query)
    ));
    grid.replaceChildren(...matching.map(({ tile }) => tile));
    get('library-count').textContent = matching.length
      ? `顯示 ${matching.length} 張牌`
      : '找不到符合的牌。可以換個關鍵詞，或選「全部」。';
  }

  function readSelection(focus = false) {
    const params = new URLSearchParams(location.search);
    const id = params.get('card');
    const entry = byCardId.get(id);
    detail.hidden = !entry;
    status.textContent = id && !entry ? '找不到連結裡的牌。請從下方圖鑑選一張。' : '';
    if (!entry) return;

    const { card, meanings } = entry;
    const reversed = params.get('orientation') === 'reversed';
    const selected = reversed ? 'reversed' : 'upright';
    const standard = reversed ? '逆位' : '正位';
    title.textContent = card.name_zh_hant;
    get('meaning-kind').textContent = `${groupNames[entry.group]} · ${card.name_en}`;
    get('meaning-keyword').textContent = card.keyword_zh_hant;
    get('meaning-art').replaceChildren(
      art.create(card.id, reversed),
      element('figcaption', `${card.name_zh_hant} · ${standard}`),
    );
    get('meaning-upright').textContent = meanings.upright;
    get('meaning-reversed').textContent = meanings.reversed;
    for (const side of sides) side.classList.toggle('is-selected', side.dataset.orientation === selected);
    sideList.prepend(reversed ? sides[1] : sides[0]);
    if (focus) {
      title.focus({ preventScroll: true });
      detail.scrollIntoView({ block: 'start' });
    }
  }

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Library data unavailable');
    return response.json();
  }

  async function load() {
    retry.hidden = true;
    retry.disabled = true;
    status.textContent = '正在載入牌卡圖鑑…';
    try {
      const [deck, meanings] = await Promise.all([
        fetchJson('../data/cards.json'), fetchJson('../data/card-meanings.json'),
      ]);
      const filled = (value) => typeof value === 'string' && value.trim().length > 0;
      const usable = Array.isArray(deck) && deck.length === cardsPerDeck && meanings &&
        deck.every((card) => card && [card.id, card.name_zh_hant, card.name_en, card.keyword_zh_hant].every(filled) &&
          Object.hasOwn(groupNames, groupOf(card)) &&
          filled(meanings[card.id]?.upright) && filled(meanings[card.id]?.reversed));
      if (!art || !usable || new Set(deck.map(({ id }) => id)).size !== cardsPerDeck) throw new Error('Invalid library data');

      entries = deck.map((card) => {
        const group = groupOf(card);
        const searchText = normalize([card.name_zh_hant, card.name_en, card.keyword_zh_hant, groupNames[group]].join(' '));
        return { card, group, searchText, meanings: meanings[card.id], tile: createTile(card) };
      });
      byCardId = new Map(entries.map(entry => [entry.card.id, entry]));
      for (const button of filters.querySelectorAll('[data-suit]')) button.disabled = false;
      search.disabled = false;
      renderList();
      readSelection(location.hash === '#card-meaning');
    } catch {
      status.textContent = '暫時無法載入牌卡圖鑑。';
      retry.hidden = false;
      retry.disabled = false;
    }
  }

  search.addEventListener('input', renderList);
  filters.addEventListener('click', (event) => {
    const clicked = event.target.closest('button[data-suit]');
    if (!clicked || clicked.disabled) return;
    group = clicked.dataset.suit;
    for (const button of filters.querySelectorAll('[data-suit]')) {
      button.setAttribute('aria-pressed', String(button === clicked));
    }
    renderList();
  });
  grid.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-card]');
    if (!link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (location.href !== link.href) history.pushState(null, '', link.href);
    readSelection(true);
  });
  window.addEventListener('popstate', () => {
    if (entries.length) readSelection();
  });
  retry.addEventListener('click', load);
  load();
})();
