(() => {
  'use strict';

  const pillarMethods = [
    ['year', 'Year'], ['month', 'Month'], ['day', 'Day'], ['hour', 'Time']
  ];
  const yangStems = '甲丙戊庚壬';

  function inputError(field, message) {
    return Object.assign(new RangeError(message), { field });
  }

  function dateParts(dateText) {
    if (typeof dateText !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateText)) {
      throw inputError('date', '請輸入有效的出生日期。');
    }

    const [year, month, day] = dateText.split('-').map(Number);
    if (year < 1900 || year > 2100) {
      throw inputError('date', '可排盤日期為 1900 至 2100 年。');
    }
    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const monthDays = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (!day || !(day <= monthDays[month - 1])) {
      throw inputError('date', '請輸入有效的出生日期。');
    }
    return [year, month, day];
  }

  function timeParts(timeText) {
    if (typeof timeText !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(timeText)) {
      throw inputError('time', '請輸入 00:00 至 23:59 的出生時間。');
    }
    return timeText.split(':').map(Number);
  }

  function describePillar(chart, id, method) {
    const stem = chart['get' + method + 'Gan']();
    const [stemElement, branchElement] = chart['get' + method + 'WuXing']();
    return {
      id,
      stem,
      branch: chart['get' + method + 'Zhi'](),
      stemElement,
      branchElement,
      polarity: yangStems.includes(stem) ? '陽' : '陰',
      hiddenStems: [...chart['get' + method + 'HideGan']()],
      tenGod: chart['get' + method + 'ShiShenGan']().replaceAll('财', '財').replaceAll('伤', '傷').replaceAll('杀', '殺')
    };
  }

  function calculate(dateText, timeText) {
    const date = dateParts(dateText);
    const time = timeParts(timeText);
    if (typeof window.Solar?.fromYmdHms !== 'function') {
      throw new Error('八字排盤元件尚未載入，請重新整理頁面。');
    }

    // The library's solar-term times are UTC+08:00. Its explicit civil-time API does not use the browser time zone.
    const chart = window.Solar.fromYmdHms(...date, ...time, 0).getLunar().getEightChar();
    // School 1 changes the day and hour pillars at 23:00. Year and month still use the entered instant.
    chart.setSect(1);

    const pillars = pillarMethods.map(([id, method]) => describePillar(chart, id, method));
    const day = pillars[2];
    const elementCounts = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    for (const { stemElement, branchElement } of pillars) {
      elementCounts[stemElement]++;
      elementCounts[branchElement]++;
    }
    return {
      date: dateText,
      time: timeText,
      pillars,
      dayMaster: { stem: day.stem, element: day.stemElement, polarity: day.polarity },
      elementCounts
    };
  }

  window.MoonveilBaziChart = { calculate };
})();
