(() => {
  'use strict';

  const get = (name) => document.getElementById(`bazi-${name}`);
  const form = get('form');
  const submit = get('submit');
  const status = get('status');
  const result = get('result');
  const title = get('result-title');
  const fields = { date: get('date'), time: get('time') };
  const required = { date: '請填寫國曆出生日期。', time: '請填寫出生時間。' };
  const engine = window.MoonveilBaziChart;
  const reader = window.MoonveilBaziReading;
  const pillarNames = { year: '年柱', month: '月柱', day: '日柱', hour: '時柱' };
  const elements = ['木', '火', '土', '金', '水'];

  function create(tag, text = '', className = '') {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function clearStatus() {
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

  function pillarSymbol(kind, glyph, element, label) {
    const symbol = create('div', '', `bazi-pillar-${kind}`);
    symbol.dataset.element = element;
    symbol.append(create('strong', glyph), create('span', `${label} · ${element}`));
    return symbol;
  }

  function detail(label, value) {
    const entry = create('div');
    entry.append(create('dt', label), create('dd', value));
    return entry;
  }

  function renderPillars(chart) {
    const { stem, element, polarity } = chart.dayMaster;
    const dayMaster = get('day-master');
    dayMaster.dataset.element = element;
    dayMaster.replaceChildren(create('span', '日主'), create('strong', stem), create('span', `${polarity}${element}`));
    get('result-meta').textContent = `國曆 ${chart.date} · ${chart.time}（UTC+8）`;

    get('pillars').replaceChildren(...chart.pillars.map((pillar) => {
      const card = create('article', '', 'bazi-pillar');
      card.dataset.pillar = pillar.id;
      const details = create('dl', '', 'bazi-pillar-details');
      details.append(detail('天干十神', pillar.tenGod), detail('地支藏干', pillar.hiddenStems.join('、')));
      card.append(
        create('h4', pillarNames[pillar.id]),
        pillarSymbol('stem', pillar.stem, pillar.stemElement, '天干'),
        pillarSymbol('branch', pillar.branch, pillar.branchElement, '地支'),
        details,
      );
      return card;
    }));
  }

  function renderElements(counts) {
    get('elements').replaceChildren(...elements.map((element) => {
      const count = counts[element];
      const entry = create('div', '', 'bazi-element');
      entry.dataset.element = element;
      const value = create('dd');
      const meter = create('div', '', 'bazi-element-meter');
      meter.setAttribute('aria-hidden', 'true');
      const fill = create('span');
      fill.style.width = `${(count / 8) * 100}%`;
      meter.append(fill);
      value.append(create('strong', count), create('span', ' 個'), meter);
      entry.append(create('dt', element), value);
      return entry;
    }));
  }

  function renderReading(reading) {
    get('reading-headline').textContent = reading.headline;
    get('reading-intro').textContent = reading.intro;
    get('reading-sections').replaceChildren(...reading.sections.map(({ title, text }) => {
      const card = create('article');
      card.append(create('h5', title), create('p', text));
      return card;
    }));
    get('conclusion').textContent = reading.conclusion;
  }

  if (!engine || !reader || !window.Solar?.fromYmdHms) {
    showError('排盤功能暫時無法載入，請重新整理頁面。');
    return;
  }

  form.addEventListener('input', clearStatus);
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearStatus();
    for (const [name, field] of Object.entries(fields)) {
      if (!field.value) {
        showError(required[name], field);
        return;
      }
    }
    try {
      const chart = engine.calculate(fields.date.value, fields.time.value);
      renderPillars(chart);
      renderElements(chart.elementCounts);
      renderReading(reader.describe(chart));
    } catch (error) {
      const field = fields[error.field];
      showError(field ? error.message : '暫時無法產生八字，請重新整理頁面後再試。', field);
      return;
    }
    result.hidden = false;
    title.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'start' });
  });
  submit.disabled = false;
})();
