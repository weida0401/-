(() => {
  'use strict';

  const get = id => document.getElementById('natal-' + id);
  const form = get('form');
  const date = get('date');
  const time = get('time');
  const city = get('city');
  const latitude = get('latitude');
  const longitude = get('longitude');
  const timeZone = get('timezone');
  const occurrence = get('occurrence');
  const occurrenceField = get('occurrence-field');
  const result = get('result');
  const canvas = get('wheel');
  const status = get('status');
  const ephemeris = window.MoonveilNatal;
  const birthplace = window.MoonveilBirthplace;
  const reading = window.MoonveilNatalReading;
  const wheel = window.MoonveilNatalWheel;
  let currentChart;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function clearStatus() {
    status.hidden = true;
    status.textContent = '';
    form.querySelector('[aria-invalid="true"]')?.removeAttribute('aria-invalid');
  }

  function fail(message, field) {
    result.hidden = true;
    delete result.dataset.utc;
    currentChart = undefined;
    status.hidden = false;
    status.textContent = message;
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.focus();
    }
  }

  function readBirthplace() {
    if (city.value !== 'custom') {
      const selected = birthplace.cities.find(({id}) => id === city.value);
      if (!selected) fail('請選擇出生城市。', city);
      return selected;
    }

    const lat = latitude.valueAsNumber;
    const lon = longitude.valueAsNumber;
    if (!Number.isFinite(lat) || Math.abs(lat) > 90) {
      fail('請輸入 −90 到 90 度之間的緯度。', latitude);
      return;
    }
    if (!Number.isFinite(lon) || Math.abs(lon) > 180) {
      fail('請輸入 −180 到 180 度之間的經度。', longitude);
      return;
    }
    const zone = timeZone.value.trim();
    if (!zone) {
      fail('請輸入出生地時區，例如 Asia/Taipei。', timeZone);
      return;
    }
    return {name: '自訂座標（' + lat.toFixed(4) + '°, ' + lon.toFixed(4) + '°）', latitude: lat, longitude: lon, timeZone: zone};
  }

  function drawWheel() {
    if (currentChart && !result.hidden) wheel.draw(canvas, currentChart);
  }

  function placementText(point) {
    const degrees = Math.floor(point.degree);
    const minutes = Math.floor(point.degree * 60) % 60;
    const degree = element('span', degrees + '°' + String(minutes).padStart(2, '0') + '′', 'natal-degree');
    return [point.signName + ' ', degree];
  }

  function displayKeys(chart) {
    const sun = chart.planets.find(({id}) => id === 'Sun');
    const moon = chart.planets.find(({id}) => id === 'Moon');
    const keys = [['上升星座', chart.ascendant], ['太陽星座', sun], ['月亮星座', moon]];
    get('keys').replaceChildren(...keys.map(([label, point]) => {
      const item = element('li', '', 'natal-key');
      item.dataset.point = point.id;
      const name = element('p', '', 'natal-key-name');
      name.append(...placementText(point));
      item.append(element('p', label, 'natal-key-label'), name, element('p', reading.describeKey(point), 'natal-key-guide'));
      return item;
    }));
  }

  function displayPlacements(chart) {
    const {planets, ascendant, midheaven, descendant, imumCoeli, cusps} = chart;
    get('placements').replaceChildren(...[...planets, ascendant, midheaven, descendant, imumCoeli].map(point => {
      const row = element('tr', '');
      row.dataset.point = point.id;
      row.dataset.longitude = point.longitude;
      row.dataset.house = point.house;
      const title = element('th', point.name);
      title.scope = 'row';
      const placement = element('td', '');
      placement.append(...placementText(point));
      row.append(title, placement, element('td', '第 ' + point.house + ' 宮'));
      return row;
    }));
    get('cusps').replaceChildren(...cusps.map(point => {
      const item = element('li', '');
      item.dataset.house = point.house;
      item.append(...placementText(point));
      return item;
    }));
  }

  function displayQuadrants(chart) {
    get('quadrants').replaceChildren(...reading.summarize(chart).map(({number, title, summary, nextStep}) => {
      const card = element('article', '', 'natal-panel natal-quadrant');
      card.dataset.quadrant = number;
      const houses = chart.quadrants[number - 1].houses;
      const label = '第 ' + number + ' 象限 · 第 ' + houses[0] + '–' + houses[2] + ' 宮';
      const step = element('p', '', 'natal-quadrant-action');
      step.append(element('strong', '可以試試'), nextStep);
      card.append(element('p', label, 'natal-quadrant-meta'), element('h4', title), element('p', summary), step);
      return card;
    }));
  }

  function displayChart(chart, place, instant) {
    currentChart = chart;
    const localTime = element('time', date.value.replaceAll('-', '/') + ' ' + time.value);
    localTime.dateTime = instant.date.toISOString();
    get('result-meta').replaceChildren(localTime, ' · ' + place.name + ' · ' + instant.offsetLabel);
    result.dataset.utc = instant.date.toISOString();
    displayKeys(chart);
    displayPlacements(chart);
    displayQuadrants(chart);
    result.hidden = false;
    drawWheel();
    get('result-title').focus({preventScroll:true});
    result.scrollIntoView({block:'start'});
  }

  if (!window.Astronomy || !ephemeris || !birthplace || !reading || !wheel) {
    fail('星盤計算元件暫時無法載入，請重新整理後再試。');
    return;
  }

  const groups = new Map();
  for (const place of birthplace.cities) {
    if (!groups.has(place.region)) {
      const group = document.createElement('optgroup');
      group.label = place.region;
      groups.set(place.region, group);
    }
    groups.get(place.region).append(new Option(place.name, place.id));
  }
  city.lastElementChild.before(...groups.values());
  const zones = Intl.supportedValuesOf?.('timeZone') ?? [];
  get('timezones').append(...['UTC', ...zones].map(zone => new Option(zone, zone)));

  form.addEventListener('input', event => {
    clearStatus();
    if (event.target === occurrence) return;
    occurrenceField.hidden = true;
    occurrence.replaceChildren();
    get('custom').hidden = city.value !== 'custom';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearStatus();
    if (!date.value) return fail('請輸入出生日期。', date);
    if (!time.value) return fail('請輸入出生時間。', time);
    const place = readBirthplace();
    if (!place) return;

    let candidates;
    try {
      candidates = birthplace.resolveLocalTime(date.value, time.value, place.timeZone);
    } catch (error) {
      const fields = {BIRTH_DATE:date, BIRTH_TIME:time, BIRTH_TIMEZONE:city.value === 'custom' ? timeZone : city};
      const field = fields[error.code] ?? (city.value === 'custom' ? timeZone : date);
      return fail(error instanceof RangeError ? error.message : '無法換算出生時間，請核對輸入資料。', field);
    }
    if (candidates.length === 0) {
      return fail('這個時間因出生地調整時鐘而沒有出現，請核對出生時間。', time);
    }
    if (candidates.length > 1 && (occurrenceField.hidden || occurrence.value === '')) {
      occurrence.replaceChildren(new Option('選擇當時的時差', ''), ...candidates.map(({offsetLabel}, index) =>
        new Option((index === 0 ? '較早 ' : '較晚 ') + '（' + offsetLabel + '）', String(index))
      ));
      occurrenceField.hidden = false;
      return fail('出生地的這個時間出現過兩次，請依紀錄選擇當時的 UTC 時差。', occurrence);
    }

    const instant = candidates[candidates.length === 1 ? 0 : Number(occurrence.value)];
    if (instant.date.getTime() > Date.now()) return fail('出生日期或時間晚於現在，請核對。', date);
    let chart;
    try {
      chart = ephemeris.calculate(instant.date, place.latitude, place.longitude);
    } catch (error) {
      return fail(error.code === 'NATAL_POLAR_CUSPS' ? error.message : '暫時無法排出星盤，請確認出生資料後再試。');
    }
    displayChart(chart, place, instant);
  });

  if ('ResizeObserver' in window) new ResizeObserver(drawWheel).observe(canvas);
  else window.addEventListener('resize', drawWheel);
  get('submit').disabled = false;
})();
