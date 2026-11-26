(() => {
  'use strict';

  const get = (name) => document.getElementById(`ziwei-${name}`);
  const form = get('form');
  const submit = get('submit');
  const status = get('status');
  const result = get('chart-result');
  const resultTitle = get('chart-result-title');
  const facts = get('chart-facts');
  const grid = get('birth-grid');
  const list = get('chart-list');
  const chartEngine = window.MoonveilZiweiChart;
  const reading = window.MoonveilZiweiReading;
  const fields = { date: get('date'), time: get('time'), gender: get('gender') };
  const required = {
    date: '請填寫國曆出生日期。',
    time: '請填寫出生時間。',
    gender: '請選擇排盤性別。',
  };
  const branchOrder = [...'巳午未申辰酉卯戌寅丑子亥'];

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function clearError() {
    for (const field of Object.values(fields)) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
    status.hidden = true;
    status.textContent = '';
  }

  function showError(message, field) {
    result.hidden = true;
    status.hidden = false;
    status.textContent = message;
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', status.id);
      field.focus();
    }
  }

  function renderFacts(chart) {
    const placements = new Map(chart.palaces.map((palace) => [palace.branch, palace]));
    const life = placements.get(chart.lifeBranch);
    const body = placements.get(chart.bodyBranch);
    const entries = [
      ['農曆排盤日', chart.lunarDate],
      ['命宮', `${life.stem}${life.branch}`],
      ['身宮', `${body.stem}${body.branch} · ${body.name}`],
      ['五行局', chart.elementClass],
      ['命主', chart.soul],
      ['身主', chart.body],
    ];
    get('chart-meta').textContent = `國曆 ${chart.solarDate} · ${chart.timeLabel}`;
    facts.replaceChildren(...entries.map(([label, value]) => {
      const entry = element('div');
      entry.append(element('dt', label), element('dd', value));
      return entry;
    }));
  }

  function renderGrid(palaces) {
    const placements = new Map(palaces.map((palace) => [palace.branch, palace]));
    const tiles = branchOrder.map((branch) => {
      const palace = placements.get(branch);
      const tile = element('a', '', 'ziwei-birth-palace');
      tile.dataset.branch = branch;
      tile.href = `#ziwei-result-${palace.id}`;
      tile.classList.toggle('is-life', palace.id === 'ming');
      tile.classList.toggle('is-body', palace.isBody);

      const stars = element('span', '', 'ziwei-grid-stars');
      const names = palace.majorStars.map((star) => star.name);
      stars.append(...(names.length ? names : ['無主星']).map((name) => element('span', name)));
      tile.append(
        element('span', `${palace.stem}${branch}`, 'ziwei-grid-branch'),
        element('strong', palace.name),
        stars,
      );

      if (palace.id === 'ming' || palace.isBody) {
        const tags = element('span', '', 'ziwei-grid-tags');
        if (palace.id === 'ming') tags.append(element('span', '命宮', 'ziwei-grid-badge is-life'));
        if (palace.isBody) tags.append(element('span', '身宮', 'ziwei-grid-badge is-body'));
        tile.append(tags);
      }
      return tile;
    });

    const center = element('div', '', 'ziwei-birth-center');
    center.append(element('strong', '十二宮命盤'), element('p', '點選宮位看解讀'));
    grid.replaceChildren(...tiles, center);
  }

  function renderReading(chart) {
    const summaries = new Map(reading.describe(chart).map(({ id, summary }) => [id, summary]));
    const starLabel = ({ name, brightness, mutagen }) => {
      const details = [brightness, mutagen && `化${mutagen}`].filter(Boolean);
      return details.length ? `${name}（${details.join('、')}）` : name;
    };
    list.replaceChildren(...chart.palaces.map((palace) => {
      const item = element('li');
      const card = element('article', '', 'ziwei-palace-card ziwei-chart-card');
      card.id = `ziwei-result-${palace.id}`;
      card.dataset.palace = palace.id;
      card.tabIndex = -1;
      const placement = [`${palace.stem}${palace.branch}`];
      if (palace.isBody) placement.push('身宮');
      placement.push(`大限 ${palace.decade.join('–')} 虛歲`);
      const stars = palace.majorStars.map(starLabel);
      card.append(
        element('h4', palace.name),
        element('p', placement.join(' · '), 'ziwei-chart-placement'),
        element('p', stars.length ? stars.join('、') : '無主星', 'ziwei-chart-stars'),
      );
      if (palace.minorStars.length) {
        const names = palace.minorStars.map(starLabel).join('、');
        card.append(element('p', `其他星曜 ${names}`, 'ziwei-chart-aux-stars'));
      }
      card.append(element('p', summaries.get(palace.id), 'ziwei-chart-summary'));
      item.append(card);
      return item;
    }));
  }

  if (!chartEngine || !reading) {
    showError('排盤功能暫時無法載入，請重新整理頁面。');
    return;
  }

  form.addEventListener('input', clearError);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearError();
    for (const [name, field] of Object.entries(fields)) {
      if (!field.value) {
        showError(required[name], field);
        return;
      }
    }

    try {
      const chart = chartEngine.calculate(fields.date.value, fields.time.value, fields.gender.value);
      renderFacts(chart);
      renderGrid(chart.palaces);
      renderReading(chart);
    } catch (error) {
      const field = error.field && fields[error.field];
      const message = field ? error.message : '暫時無法產生命盤，請重新整理頁面後再試。';
      showError(message, field);
      return;
    }

    result.hidden = false;
    resultTitle.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'start' });
  });
  submit.disabled = false;
})();
