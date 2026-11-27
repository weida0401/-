(() => {
  'use strict';

  const get = id => document.getElementById(id);
  const forecastSign = get('forecast-sign');
  const periods = get('forecast-period');
  const matchFirst = get('match-first');
  const matchSecond = get('match-second');
  const matchSwap = get('match-swap');
  const forecastResults = get('forecast-results');
  const matchResult = get('match-result');
  const colors = {
    Sun: '#ffd092', Moon: '#e8ddfa', Mercury: '#98cdbc', Venus: '#f4a9c0',
    Mars: '#f58f7c', Jupiter: '#b9b5f1', Saturn: '#c9b38c'
  };
  let signs = [];
  let matchFirstChanged = false;

  function textElement(tag, text, className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function writeFields(prefix, fields) {
    for (const [field, text] of Object.entries(fields)) get(prefix + field).textContent = text;
  }

  function setStatus(id, message) {
    const status = get(id);
    status.hidden = !message;
    status.textContent = message;
  }

  function timeLabel(date) {
    const time = textElement('time', date.split('-').map(Number).join('/'));
    time.dateTime = date;
    return time;
  }

  function renderForecastDate(start, end) {
    const date = get('forecast-date');
    date.dataset.startDate = start;
    date.dataset.endDate = end;
    date.replaceChildren(timeLabel(start));
    if (start !== end) date.append('–', timeLabel(end));
  }

  function positionOnWheel(node, longitude, radius) {
    const angle = (longitude - 90) * Math.PI / 180;
    node.style.setProperty('--wheel-x', 50 + Math.cos(angle) * radius + '%');
    node.style.setProperty('--wheel-y', 50 + Math.sin(angle) * radius + '%');
    return node;
  }

  function renderSky(sky) {
    const sectors = signs.map((sign, index) =>
      positionOnWheel(textElement('span', sign.glyph, 'wheel-sign'), 15 + index * 30, 44)
    );
    const markers = sky.map(({planet, longitude}, index) => {
      const marker = positionOnWheel(textElement('span', '', 'wheel-planet'), longitude, 36 - index * 4.1);
      marker.style.setProperty('--planet-color', colors[planet]);
      return marker;
    });
    get('transit-wheel').replaceChildren(...sectors, ...markers);

    get('forecast-sky').replaceChildren(...sky.map(({planet, planetName, longitude, signName, degree}) => {
      const row = textElement('li', '');
      row.dataset.planet = planet;
      row.dataset.longitude = longitude;
      const key = textElement('span', '', 'planet-key');
      key.setAttribute('aria-hidden', 'true');
      key.style.setProperty('--planet-color', colors[planet]);
      const label = textElement('span', '');
      const displayDegree = (Math.floor(degree * 10) / 10).toFixed(1);
      label.append(textElement('strong', planetName), signName + ' ' + displayDegree + '°');
      row.append(key, label);
      return row;
    }));
  }

  function renderHighlights(highlights, sign) {
    const items = highlights.filter(({aspect}) => aspect).map(({planetName, signName, dateLabel, aspect}) =>
      textElement('li', dateLabel + ' · ' + planetName + '在' + signName + '，與' + sign.name + '中點形成' + aspect.name + '（' + aspect.angle + '°）')
    );
    if (items.length === 0) items.push(textElement('li', '這段期間主要相位較少，可先參考行星所在的星座。'));
    get('forecast-highlights').replaceChildren(...items);
  }

  function renderIndices(indices) {
    const list = get('forecast-indices');
    get('forecast-index-panel').hidden = !indices.length;
    list.replaceChildren(...indices.map(({id, label, stars}) => {
      const item = textElement('li', '', 'forecast-index');
      item.dataset.area = id;
      const heading = textElement('div', '', 'forecast-index-heading');
      const score = textElement('span', stars + ' / 5', 'forecast-index-score');
      score.setAttribute('aria-hidden', 'true');
      heading.append(textElement('strong', label), score);
      const meter = textElement('span', '★★★★★', 'forecast-index-stars');
      meter.setAttribute('role', 'img');
      meter.setAttribute('aria-label', stars + ' 顆星，滿分 5 顆星');
      meter.style.setProperty('--star-fill', stars / 5 * 100 + '%');
      item.append(heading, meter);
      return item;
    }));
  }

  function renderForecast(announce = false) {
    const sign = signs.find(({id}) => id === forecastSign.value);
    if (!sign) return;

    const period = periods.querySelector('input:checked').value;
    const periodName = period === 'weekly' ? '每週' : '每日';
    let forecast, reading;
    try {
      forecast = window.MoonveilTransits.forecast(sign.id, period);
      reading = window.MoonveilHoroscope.generate(sign.id, period, forecast.highlights);
    } catch {
      forecastResults.hidden = true;
      setStatus('forecast-status', '暫時無法載入行星位置，請重新整理後再試。');
      return;
    }

    setStatus('forecast-status', '');
    renderForecastDate(forecast.startDate, forecast.endDate);
    const indices = forecast.indices ?? [];
    renderIndices(indices);
    writeFields('forecast-', {
      caption: sign.name + ' · ' + periodName + '運勢',
      headline: reading.headline,
      overview: reading.overview,
      relationships: reading.relationships,
      work: reading.work,
      next: reading.nextStep,
      'sky-date': forecast.skyDateLabel
    });
    renderHighlights(forecast.highlights, sign);
    renderSky(forecast.sky);
    forecastResults.hidden = false;
    if (announce) {
      const ratings = indices.map(({label, stars}) => label + ' ' + stars + ' 星').join('，');
      get('forecast-announcement').textContent = sign.name + periodName + '運勢已更新。' + (ratings ? ratings + '。' : '') + reading.headline;
    }
  }

  function weeklyMatchNote(firstId, secondId) {
    try {
      const now = new Date();
      const firstWeek = window.MoonveilTransits.forecast(firstId, 'weekly', now);
      const secondWeek = firstId === secondId ? firstWeek : window.MoonveilTransits.forecast(secondId, 'weekly', now);
      return window.MoonveilZodiacMatch.transitNote?.(firstId, secondId, firstWeek, secondWeek) ?? '';
    } catch {
      return '';
    }
  }

  function renderMatchScenes(first, second) {
    const scenes = window.MoonveilZodiacMatchScenes?.describe(first, second) ?? [];
    get('match-scenes').hidden = !scenes.length;
    get('match-scene-grid').replaceChildren(...scenes.map(({id, title, text}) => {
      const card = textElement('article', '', 'match-scene');
      card.dataset.scene = id;
      card.append(textElement('h5', title), textElement('p', text));
      return card;
    }));
  }

  function renderMatch(announce = false) {
    const first = signs.find(({id}) => id === matchFirst.value);
    const second = signs.find(({id}) => id === matchSecond.value);
    matchSwap.disabled = !first || !second || first === second;
    const match = first && second ? window.MoonveilZodiacMatch?.compare(first.id, second.id) : null;
    matchResult.hidden = !match;
    if (!match) {
      setStatus('match-status', first && second ? '暫時無法載入配對，請重新整理後再試。' : '選好兩個星座後，這裡會顯示配對解讀。');
      get('match-announcement').textContent = '';
      return;
    }

    setStatus('match-status', '');
    const note = weeklyMatchNote(first.id, second.id);
    const pairName = first.name + ' × ' + second.name;
    writeFields('match-', {
      caption: pairName,
      headline: match.headline,
      overview: match.overview,
      strength: match.strength,
      friction: match.friction,
      next: match.nextStep,
      'first-glyph': first.glyph,
      'second-glyph': second.glyph,
      transit: note
    });
    get('match-transit-row').hidden = !note;
    renderMatchScenes(first, second);
    if (announce) get('match-announcement').textContent = pairName + '的配對已更新。' + match.headline;
  }

  function selectMatchSign(signId, announce = false) {
    matchFirstChanged = true;
    matchFirst.value = signId;
    renderMatch(announce);
  }

  function initialize(zodiacSigns) {
    signs = zodiacSigns;
    for (const select of [forecastSign, matchFirst, matchSecond]) {
      select.append(...signs.map(sign => new Option(sign.name, sign.id)));
    }
    matchFirst.disabled = false;
    matchSecond.disabled = false;
    forecastSign.addEventListener('change', () => renderForecast(true));
    periods.addEventListener('change', () => renderForecast(true));
    matchFirst.addEventListener('change', () => selectMatchSign(matchFirst.value, true));
    matchSecond.addEventListener('change', () => renderMatch(true));
    matchSwap.addEventListener('click', () => {
      const firstId = matchFirst.value;
      matchFirst.value = matchSecond.value;
      matchSecond.value = firstId;
      matchFirstChanged = true;
      renderMatch(true);
    });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) return;
      renderForecast();
      renderMatch();
    });
  }

  function selectSign(signId) {
    forecastSign.value = signId;
    renderForecast();
    if (!matchFirstChanged) {
      matchFirst.value = signId;
      renderMatch();
    }
  }

  window.MoonveilZodiacTools = { initialize, selectMatchSign, selectSign };
})();
