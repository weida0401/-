(() => {
  'use strict';

  const firstYear = 1900;
  const lastYear = 2100;
  const taipei = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: '2-digit', day: '2-digit'
  });

  function traditional(value) {
    return window.MoonveilAlmanacText?.traditional(value) ?? value;
  }

  function today(now = new Date()) {
    const parts = Object.fromEntries(taipei.formatToParts(now).map(part => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function supportedYear(year) {
    return Number.isInteger(year) && year >= firstYear && year <= lastYear;
  }

  function isoDate(year, month, number) {
    return `${year}-${String(month).padStart(2, '0')}-${String(number).padStart(2, '0')}`;
  }

  function parseDate(dateText) {
    if (typeof dateText !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
      throw new RangeError('請選擇有效的西元日期。');
    }
    const [year, month, number] = dateText.split('-').map(Number);
    if (!supportedYear(year)) throw new RangeError('可查詢 1900 至 2100 年的日期。');
    const civil = new Date(Date.UTC(year, month - 1, number));
    if (civil.getUTCMonth() + 1 !== month || civil.getUTCDate() !== number) {
      throw new RangeError('請選擇有效的西元日期。');
    }
    return [year, month, number];
  }

  function lunarAt(year, month, number) {
    const solar = window.Solar;
    if (typeof solar?.fromYmd !== 'function') throw new Error('黃曆換算元件尚未載入。');
    return solar.fromYmd(year, month, number).getLunar();
  }

  function calendar(year, month) {
    if (!supportedYear(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      throw new RangeError('請選擇 1900 至 2100 年內的月份。');
    }

    const startWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
    const count = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const days = Array.from({ length: count }, (_, index) => {
      const number = index + 1;
      const lunar = lunarAt(year, month, number);
      return {
        date: isoDate(year, month, number),
        number,
        lunarLabel: lunar.getDay() === 1
          ? traditional(lunar.getMonthInChinese()) + '月'
          : traditional(lunar.getDayInChinese()),
        term: traditional(lunar.getJieQi())
      };
    });
    return { year, month, startWeekday, days };
  }

  function activities(values) {
    return [...new Set(values.map(traditional).filter(value => value && value !== '無' && value !== '无'))];
  }

  function hoursFor(lunar) {
    // The official table splits the civil date's two Zi portions; late Zi uses the next day's hour calculation.
    const times = lunar.getTimes();
    return times.map((time, index) => ({
      name: index === 0 ? '早子時' : index === times.length - 1 ? '晚子時' : time.getZhi() + '時',
      range: time.getMinHm() + '–' + time.getMaxHm(),
      pillar: time.getGanZhi(),
      spirit: traditional(time.getTianShen()),
      luck: traditional(time.getTianShenLuck())
    }));
  }

  function day(dateText) {
    const lunar = lunarAt(...parseDate(dateText));
    // The displayed lunar year and zodiac follow New Year. Almanac month fields use the civil day of each term.
    return {
      date: dateText,
      lunarDate: traditional(lunar.toString()),
      term: traditional(lunar.getJieQi()),
      pillars: {
        year: lunar.getYearInGanZhi(),
        month: lunar.getMonthInGanZhi(),
        day: lunar.getDayInGanZhi()
      },
      zodiac: traditional(lunar.getYearShengXiao()),
      yi: activities(lunar.getDayYi()),
      ji: activities(lunar.getDayJi()),
      chong: traditional(lunar.getDayChongShengXiao()) + '（' + lunar.getDayChongGan() + lunar.getDayChong() + '）',
      sha: traditional(lunar.getDaySha()),
      officer: traditional(lunar.getZhiXing()),
      daySpirit: traditional(lunar.getDayTianShen()),
      dayLuck: traditional(lunar.getDayTianShenLuck()),
      hours: hoursFor(lunar)
    };
  }

  window.MoonveilAlmanac = { today, calendar, day };
})();
