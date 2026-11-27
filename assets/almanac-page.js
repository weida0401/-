(() => {
  'use strict';

  const get = (name) => document.getElementById(`almanac-${name}`);
  const engine = window.MoonveilAlmanac;
  const content = get('content');
  const loadStatus = get('load-status');
  const calendar = get('calendar-body');
  const previous = get('month-prev');
  const next = get('month-next');
  const input = get('date');
  const status = get('status');
  const todayButton = get('today');
  const weekdays = '日一二三四五六';
  const dayOffsets = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
  let selectedDate = '';
  let today = '';

  function create(tag, text = '', className = '') {
    const node = document.createElement(tag);
    node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function supported(date) {
    return date >= input.min && date <= input.max;
  }

  function renderCalendar(year, month) {
    const { startWeekday, days } = engine.calendar(year, month);
    get('month-heading').textContent = `${year} 年 ${month} 月`;

    const rows = [];
    const cells = Math.ceil((startWeekday + days.length) / 7) * 7;
    for (let index = 0; index < cells; index++) {
      if (index % 7 === 0) rows.push(create('tr'));
      const cell = create('td');
      const day = days[index - startWeekday];
      if (day) {
        const button = create('button', '', 'almanac-day');
        button.type = 'button';
        button.dataset.date = day.date;
        const detail = day.term ? `，${day.term}` : '';
        button.setAttribute('aria-label', `${year} 年 ${month} 月 ${day.number} 日，農曆${day.lunarLabel}${detail}`);
        button.classList.toggle('is-term', Boolean(day.term));
        button.append(
          create('span', day.number, 'almanac-day-number'),
          create('span', day.term || day.lunarLabel, 'almanac-lunar-label'),
        );
        cell.append(button);
      }
      rows.at(-1).append(cell);
    }
    calendar.replaceChildren(...rows);
  }

  function markCalendar(focusDay) {
    for (const button of calendar.querySelectorAll('button[data-date]')) {
      const selected = button.dataset.date === selectedDate;
      button.classList.toggle('is-selected', selected);
      button.setAttribute('aria-pressed', String(selected));
      button.tabIndex = selected ? 0 : -1;
      if (button.dataset.date === today) button.setAttribute('aria-current', 'date');
      else button.removeAttribute('aria-current');
      if (selected && focusDay) button.focus();
    }
  }

  function renderActivities(id, items) {
    const list = items.length ? items : ['無記載'];
    get(id).replaceChildren(...list.map((item) => create('li', item)));
  }

  function renderDetails(day, year, month, number) {
    const weekday = new Date(`${day.date}T00:00:00Z`).getUTCDay();
    get('date-heading').replaceChildren(
      `${year} 年 ${month} 月 ${number} 日`,
      create('span', `・星期${weekdays[weekday]}`, 'almanac-weekday'),
    );
    get('lunar-date').textContent = `農曆 ${day.lunarDate}`;
    const term = get('term');
    term.textContent = day.term ? `節氣 ${day.term}` : '';
    term.hidden = !day.term;

    const { year: yearPillar, month: monthPillar, day: dayPillar } = day.pillars;
    const facts = [
      ['干支', `${yearPillar}年 ${monthPillar}月 ${dayPillar}日`],
      ['生肖', day.zodiac],
      ['日沖', day.chong],
      ['煞方', day.sha],
      ['建除', `${day.officer}日`],
      ['值神', `${day.daySpirit}（${day.dayLuck}）`],
    ];
    get('facts').replaceChildren(...facts.map(([label, value]) => {
      const entry = create('div');
      entry.append(create('dt', label), create('dd', value));
      return entry;
    }));

    renderActivities('yi', day.yi);
    renderActivities('ji', day.ji);
    get('hours-body').replaceChildren(...day.hours.map((hour) => {
      const row = create('tr');
      const heading = create('th', '', 'almanac-hour-label');
      heading.scope = 'row';
      heading.append(create('strong', hour.name), create('span', hour.range));
      const luck = create('td', hour.luck, 'almanac-hour-luck');
      luck.dataset.luck = hour.luck;
      row.append(heading, create('td', hour.pillar), create('td', hour.spirit), luck);
      return row;
    }));
  }

  function clearError() {
    status.hidden = true;
    status.textContent = '';
    input.removeAttribute('aria-invalid');
    input.removeAttribute('aria-describedby');
  }

  function selectDate(date, focusDay = false) {
    if (!supported(date)) return;
    const day = engine.day(date);
    const [year, month, number] = date.split('-').map(Number);
    const visibleMonth = date.slice(0, 7);
    if (visibleMonth !== selectedDate.slice(0, 7)) renderCalendar(year, month);
    selectedDate = date;
    today = engine.today();
    input.value = date;
    previous.disabled = visibleMonth === input.min.slice(0, 7);
    next.disabled = visibleMonth === input.max.slice(0, 7);
    todayButton.disabled = !supported(today);
    clearError();
    markCalendar(focusDay);
    renderDetails(day, year, month, number);
  }

  function offsetMonth(offset) {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const first = new Date(Date.UTC(year, month - 1 + offset, 1));
    const last = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0));
    first.setUTCDate(Math.min(day, last.getUTCDate()));
    selectDate(first.toISOString().slice(0, 10));
  }

  try {
    if (!engine || !window.Solar?.fromYmd) throw new Error('Calendar data unavailable');
    let initial = engine.today();
    if (initial < input.min) initial = input.min;
    if (initial > input.max) initial = input.max;
    selectDate(initial);
    content.hidden = false;
  } catch (error) {
    loadStatus.textContent = '黃曆暫時無法載入，請重新整理頁面。';
    loadStatus.hidden = false;
    return;
  }

  previous.addEventListener('click', () => offsetMonth(-1));
  next.addEventListener('click', () => offsetMonth(1));
  todayButton.addEventListener('click', () => selectDate(engine.today()));
  input.addEventListener('input', clearError);
  get('jump').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!input.validity.valid) {
      status.textContent = '請輸入 1900 至 2100 年之間的有效國曆日期。';
      status.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', status.id);
      input.focus();
      return;
    }
    selectDate(input.value);
  });

  calendar.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-date]');
    if (button) selectDate(button.dataset.date, true);
  });
  calendar.addEventListener('keydown', (event) => {
    const button = event.target.closest('button[data-date]');
    const offset = dayOffsets[event.key];
    if (!button || !Number.isInteger(offset) || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    const date = new Date(`${button.dataset.date}T00:00:00Z`);
    date.setUTCDate(date.getUTCDate() + offset);
    selectDate(date.toISOString().slice(0, 10), true);
  });
})();
