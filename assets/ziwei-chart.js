(() => {
  'use strict';

  const palaceNames = [
    ['ming', '命宮'], ['siblings', '兄弟宮'], ['spouse', '夫妻宮'], ['children', '子女宮'],
    ['wealth', '財帛宮'], ['health', '疾厄宮'], ['travel', '遷移宮'], ['friends', '交友宮'],
    ['career', '官祿宮'], ['property', '田宅宮'], ['wellbeing', '福德宮'], ['parents', '父母宮']
  ];

  function inputError(field, code, message) {
    return Object.assign(new RangeError(message), { field, code });
  }

  function validateDate(dateText) {
    const dateError = () => inputError('date', 'ZIWEI_INVALID_DATE', '請輸入有效的出生日期。');
    if (typeof dateText !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateText)) throw dateError();

    const [year, month, day] = dateText.split('-').map(Number);
    // Match the calendar change used by the underlying calendrical converter.
    const leapYear = year % 4 === 0 && (year < 1600 || year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (!year || !day || !(day <= daysInMonth[month - 1])) throw dateError();
    if (year === 1582 && month === 10 && day >= 5 && day <= 14) {
      throw inputError('date', 'ZIWEI_INVALID_DATE', '這段日期落在曆法切換的空檔，無法排盤。');
    }
  }

  function validateTime(timeText) {
    if (typeof timeText !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(timeText)) {
      throw inputError('time', 'ZIWEI_INVALID_TIME', '請輸入 00:00 至 23:59 的出生時間。');
    }
  }

  function copyStars(stars) {
    return stars.map(({ name, brightness, mutagen }) => {
      const star = { name };
      if (brightness) star.brightness = brightness;
      if (mutagen) star.mutagen = mutagen;
      return star;
    });
  }

  function orderPalaces(chart) {
    const lifeIndex = chart.palaces.findIndex(palace => palace.earthlyBranch === chart.earthlyBranchOfSoulPalace);
    // iztro stores the twelve branches in ascending order. Palace roles run in reverse from life.
    return palaceNames.map(([id, name], offset) => {
      const palace = chart.palaces[(lifeIndex + 12 - offset) % 12];
      return {
        id, name,
        branch: palace.earthlyBranch,
        stem: palace.heavenlyStem,
        isBody: palace.isBodyPalace,
        decade: [...palace.decadal.range],
        majorStars: copyStars(palace.majorStars),
        minorStars: copyStars(palace.minorStars)
      };
    });
  }

  function calculate(dateText, timeText, gender) {
    validateDate(dateText);
    validateTime(timeText);
    if (gender !== 'male' && gender !== 'female') {
      throw inputError('gender', 'ZIWEI_INVALID_GENDER', '請選擇排盤性別。');
    }

    const timeIndex = Math.floor((Number(timeText.slice(0, 2)) + 1) / 2);
    if (dateText === '9999-12-31' && timeIndex === 12) {
      throw inputError('date', 'ZIWEI_DATE_OVERFLOW', '晚子時換日後超出可排盤的日期。');
    }
    const astro = window.iztro?.astro;
    if (!astro?.withOptions) {
      throw Object.assign(new Error('排盤元件尚未載入，請重新整理頁面。'), { code: 'ZIWEI_ENGINE_UNAVAILABLE' });
    }

    // Pass civil date and time unchanged. The engine advances index 12 (late Zi) by one day.
    // Leap-month days 1–15 keep the month number; day 16 onward uses the following month.
    const chart = astro.withOptions({
      type: 'solar',
      dateStr: dateText,
      timeIndex,
      gender,
      fixLeap: true,
      language: 'zh-TW',
      config: { dayDivide: 'forward', algorithm: 'default', yearDivide: 'normal', horoscopeDivide: 'normal', ageDivide: 'normal' }
    });
    return {
      solarDate: dateText,
      lunarDate: chart.lunarDate.replaceAll('闰', '閏').replaceAll('腊', '臘'),
      chineseDate: chart.chineseDate,
      timeLabel: `${timeText}（${chart.time}）`,
      lifeBranch: chart.earthlyBranchOfSoulPalace,
      bodyBranch: chart.earthlyBranchOfBodyPalace,
      elementClass: chart.fiveElementsClass,
      soul: chart.soul,
      body: chart.body,
      palaces: orderPalaces(chart)
    };
  }

  window.MoonveilZiweiChart = { calculate };
})();
