(() => {
  'use strict';

  const get = id => document.getElementById(id);
  const signMode = get('match-mode-sign');
  const chartMode = get('match-mode-chart');
  const signPanel = get('match-sign-panel');
  const chartPanel = get('match-chart-panel');
  const form = get('synastry-form');
  const status = get('synastry-status');
  const result = get('synastry-result');
  const birthplaces = window.MoonveilBirthplace;
  const natal = window.MoonveilNatal;
  const synastry = window.MoonveilZodiacSynastry;
  const ready = Boolean(window.Astronomy && birthplaces && natal && synastry);
  const planetsToShow = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn'];
  const unavailable = '暫時無法載入星盤計算，請重新整理後再試。';

  function element(tag, text = '', className) {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function setMode(mode) {
    const chartSelected = mode === 'chart';
    signMode.setAttribute('aria-pressed', String(!chartSelected));
    chartMode.setAttribute('aria-pressed', String(chartSelected));
    signPanel.hidden = chartSelected;
    chartPanel.hidden = !chartSelected;
    if (chartSelected && !ready) setStatus(unavailable);
  }

  function setStatus(message) {
    status.hidden = !message;
    status.textContent = message;
  }

  function clearStatus() {
    setStatus('');
    for (const field of form.querySelectorAll('[aria-invalid="true"]')) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
    }
  }

  function fail(message, field) {
    result.hidden = true;
    setStatus(message);
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', status.id);
      field.focus();
    }
    return null;
  }

  function cityGroups() {
    const groups = new Map();
    for (const city of birthplaces.cities) {
      if (!groups.has(city.region)) {
        const group = document.createElement('optgroup');
        group.label = city.region;
        groups.set(city.region, group);
      }
      groups.get(city.region).append(new Option(city.name, city.id));
    }
    return [...groups.values()];
  }

  function addFields(id, label, groups) {
    const fieldset = get('synastry-' + id);
    fieldset.disabled = !ready;
    fieldset.append(get('synastry-fields').content.cloneNode(true));
    const fields = Object.fromEntries([...fieldset.querySelectorAll('[data-field]')].map(field => {
      field.id = fieldset.id + '-' + field.dataset.field;
      return [field.dataset.field, field];
    }));
    if (groups.length) fields.city.lastElementChild.before(...groups.map(group => group.cloneNode(true)));
    return { id, label, fieldset, fields };
  }

  function updateFields({fields}) {
    fields.custom.hidden = fields.city.value !== 'custom';
    fields['occurrence-label'].hidden = true;
    fields.occurrence.replaceChildren();
  }

  function readPlace({label, fields}) {
    if (fields.city.value !== 'custom') {
      const city = birthplaces.cities.find(({id}) => id === fields.city.value);
      return city ?? fail('請選擇' + label + '出生地。', fields.city);
    }

    const latitude = fields.latitude.valueAsNumber;
    const longitude = fields.longitude.valueAsNumber;
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90) {
      return fail('請輸入' + label + '緯度（−90 至 90 度）。', fields.latitude);
    }
    if (!Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      return fail('請輸入' + label + '經度（−180 至 180 度）。', fields.longitude);
    }
    const timeZone = fields['time-zone'].value.trim();
    if (!timeZone) return fail('請輸入' + label + '出生地時區，例如 Asia/Taipei。', fields['time-zone']);
    return { latitude, longitude, timeZone };
  }

  function resolveBirth(person) {
    const {label, fields} = person;
    if (!fields.date.value) return fail('請輸入' + label + '出生日期。', fields.date);
    if (!fields.time.value) return fail('請輸入' + label + '出生時間。', fields.time);
    const place = readPlace(person);
    if (!place) return null;

    let candidates;
    try {
      candidates = birthplaces.resolveLocalTime(fields.date.value, fields.time.value, place.timeZone);
    } catch (error) {
      const responsibleFields = {
        BIRTH_DATE: fields.date,
        BIRTH_TIME: fields.time,
        BIRTH_TIMEZONE: fields.city.value === 'custom' ? fields['time-zone'] : fields.city
      };
      return fail(label + '出生資料有個地方要確認。' + (error instanceof RangeError ? error.message : '無法換算時間，請確認後再試。'),
        responsibleFields[error.code] ?? fields.time);
    }
    if (!candidates.length) {
      return fail(label + '出生地的這個時間因時鐘調整而沒有出現，請核對出生時間。', fields.time);
    }

    const instant = candidates.length === 1 ? candidates[0]
      : candidates.find(({date}) => date.toISOString() === fields.occurrence.value);
    if (!instant) {
      fields.occurrence.replaceChildren(new Option('選擇當時的時差', ''), ...candidates.map(({date, offsetLabel}, index) =>
        new Option((index === 0 ? '較早 ' : '較晚 ') + '（' + offsetLabel + '）', date.toISOString())));
      fields['occurrence-label'].hidden = false;
      return fail(label + '出生地的這個時間出現過兩次，請選擇出生紀錄所用的 UTC 時差。', fields.occurrence);
    }
    if (instant.date.getTime() > Date.now()) return fail(label + '出生日期或時間晚於現在，請核對。', fields.date);
    return { date: instant.date, latitude: place.latitude, longitude: place.longitude, person };
  }

  function calculateChart({date, latitude, longitude, person}) {
    try {
      return natal.calculate(date, latitude, longitude);
    } catch (error) {
      const message = error.code === 'NATAL_POLAR_CUSPS'
        ? error.message : '無法排出星盤，請確認出生資料後再試。';
      const field = person.fields.city.value === 'custom' ? person.fields.latitude : person.fields.city;
      return fail(person.label + '出生資料有個地方要確認。' + message, field);
    }
  }

  function renderPlacements(chart, title, id) {
    const section = element('section');
    section.dataset.person = id;
    const positions = planetsToShow.map(planetId => chart.planets.find(point => point.id === planetId));
    positions.push(chart.ascendant);
    const list = element('dl');
    for (const point of positions) {
      const row = element('div');
      row.dataset.point = point.id;
      const degree = (Math.floor(point.degree * 10) / 10).toFixed(1);
      row.append(element('dt', point.name), element('dd', point.signName + ' ' + degree + '°'));
      list.append(row);
    }
    section.append(element('h4', title), list);
    return section;
  }

  function pointPair(detail) {
    return `你的${detail.first.name}在${detail.first.signName}，對方的${detail.second.name}在${detail.second.signName}`;
  }

  function impactText(contribution) {
    if (contribution === 0) return '對分數影響為 0';
    const amount = Math.abs(contribution);
    const direction = contribution < 0 ? '扣' : '加';
    if (amount < .05) return `${direction}不到 0.1 分`;
    return `${direction} ${amount.toFixed(1)} 分`;
  }

  function evidence(title, detail) {
    const block = element('div', '', 'synastry-evidence-item');
    const reading = window.MoonveilSynastryExplain?.describe(detail);
    block.append(
      element('h5', title),
      element('p', `${pointPair(detail)}。${detail.name}，${impactText(detail.contribution)}。`, 'synastry-area-basis'),
    );
    if (reading) {
      block.append(element('p', reading.summary), element('p', reading.action));
    }
    return block;
  }

  function renderArea({id, title, score, weight, text, details, matchedCount, possibleCount}) {
    const article = element('article', '', 'match-scene synastry-area');
    article.dataset.area = id;
    article.append(
      element('h4', title),
      element('p', `${score} / 100 · 占總分 ${weight}%`, 'synastry-area-score'),
      element('p', `${possibleCount} 組落點裡，有 ${matchedCount} 組算進分數`, 'synastry-area-basis'),
      element('p', text),
    );
    const supportive = details.filter(detail => detail.contribution > 0)
      .sort((a, b) => b.contribution - a.contribution)[0];
    const challenging = details.filter(detail => detail.contribution < 0)
      .sort((a, b) => a.contribution - b.contribution)[0];
    if (supportive) article.append(evidence('哪裡合拍', supportive));
    if (challenging) article.append(evidence('哪裡容易卡住', challenging));
    return article;
  }

  function renderAspectList(areas) {
    const aspects = areas.flatMap(area => area.details.map(detail => {
      const item = element('li');
      item.dataset.area = area.id;
      item.append(
        element('strong', `${area.title} · ${detail.name}`),
        element('p', pointPair(detail)),
        element('p', `相隔 ${detail.distance.toFixed(1)}°，離標準角度 ${detail.differenceFromExact.toFixed(1)}°，容許 ${detail.orb}°。比重 ${detail.contactWeight}，對這一項${impactText(detail.contribution)}。`),
      );
      return item;
    }));
    get('synastry-aspects').replaceChildren(...(aspects.length ? aspects : [element('li', '這次採入的主要相位是 0 組。')]));
  }

  function renderComparison(first, second, comparison) {
    const firstSun = first.planets.find(point => point.id === 'Sun');
    const secondSun = second.planets.find(point => point.id === 'Sun');
    get('synastry-caption').textContent = firstSun.signName + ' × ' + secondSun.signName;
    get('synastry-score').textContent = comparison.score;
    const headline = get('synastry-headline');
    headline.textContent = comparison.headline;
    get('synastry-coverage').textContent = `對照 ${comparison.possibleCount} 組落點，其中 ${comparison.matchedCount} 組符合相位容許度。可參考的相位較少時，分數會靠近起始的 65 分。`;
    get('synastry-conclusion').textContent = comparison.conclusion;
    get('synastry-areas').replaceChildren(...comparison.areas.map(renderArea));
    get('synastry-placements').replaceChildren(
      renderPlacements(first, '你的落點', 'first'),
      renderPlacements(second, '對方的落點', 'second')
    );
    renderAspectList(comparison.areas);
    result.hidden = false;
    headline.focus({preventScroll:true});
    result.scrollIntoView({block:'start'});
  }

  signMode.addEventListener('click', () => setMode('sign'));
  chartMode.addEventListener('click', () => setMode('chart'));
  get('profile-match-link')?.addEventListener('click', () => setMode('sign'));
  signMode.disabled = false;
  chartMode.disabled = false;
  setMode(new URLSearchParams(location.search).get('mode') === 'chart' ? 'chart' : 'sign');
  const groups = ready ? cityGroups() : [];
  const first = addFields('first', '你的', groups);
  const second = addFields('second', '對方的', groups);
  if (!ready) return;

  function inputChanged(event) {
    clearStatus();
    result.hidden = true;
    const person = first.fieldset.contains(event.target) ? first : second;
    if (event.target !== person.fields.occurrence) updateFields(person);
  }
  form.addEventListener('input', inputChanged);
  form.addEventListener('change', inputChanged);
  form.addEventListener('submit', event => {
    event.preventDefault();
    clearStatus();
    const firstBirth = resolveBirth(first);
    if (!firstBirth) return;
    const secondBirth = resolveBirth(second);
    if (!secondBirth) return;
    const firstChart = calculateChart(firstBirth);
    if (!firstChart) return;
    const secondChart = calculateChart(secondBirth);
    if (!secondChart) return;
    try {
      renderComparison(firstChart, secondChart, synastry.compare(firstChart, secondChart));
    } catch {
      fail('暫時無法比較兩張星盤，請確認出生資料後再試。');
    }
  });
  get('synastry-submit').disabled = false;
})();
