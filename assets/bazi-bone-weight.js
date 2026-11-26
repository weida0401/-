(() => {
  'use strict';

  // Traditional table values in 錢, from the version at https://www.mingdecode.com/zh-TW/chenggu.
  const yearWeights = {
    甲子: 12, 乙丑: 9, 丙寅: 6, 丁卯: 7, 戊辰: 12, 己巳: 5, 庚午: 9, 辛未: 8, 壬申: 7, 癸酉: 8,
    甲戌: 15, 乙亥: 9, 丙子: 16, 丁丑: 8, 戊寅: 8, 己卯: 19, 庚辰: 12, 辛巳: 6, 壬午: 8, 癸未: 7,
    甲申: 5, 乙酉: 15, 丙戌: 6, 丁亥: 16, 戊子: 15, 己丑: 7, 庚寅: 9, 辛卯: 12, 壬辰: 10, 癸巳: 7,
    甲午: 15, 乙未: 6, 丙申: 5, 丁酉: 14, 戊戌: 14, 己亥: 9, 庚子: 7, 辛丑: 7, 壬寅: 9, 癸卯: 12,
    甲辰: 8, 乙巳: 7, 丙午: 13, 丁未: 5, 戊申: 14, 己酉: 5, 庚戌: 9, 辛亥: 17, 壬子: 5, 癸丑: 7,
    甲寅: 12, 乙卯: 8, 丙辰: 8, 丁巳: 6, 戊午: 19, 己未: 6, 庚申: 8, 辛酉: 16, 壬戌: 10, 癸亥: 7
  };
  const monthWeights = [6, 7, 18, 9, 5, 16, 9, 15, 18, 8, 9, 5];
  const dayWeights = [
    5, 10, 8, 15, 16, 15, 8, 16, 8, 16,
    9, 17, 8, 17, 10, 8, 9, 18, 5, 15,
    10, 9, 8, 9, 15, 18, 7, 8, 16, 6
  ];
  const hourWeights = { 子: 16, 丑: 6, 寅: 7, 卯: 10, 辰: 9, 巳: 16, 午: 10, 未: 8, 申: 8, 酉: 9, 戌: 6, 亥: 6 };
  const tables = [Object.values(yearWeights), monthWeights, dayWeights, Object.values(hourWeights)];
  const min = tables.reduce((sum, weights) => sum + Math.min(...weights), 0);
  const max = tables.reduce((sum, weights) => sum + Math.max(...weights), 0);

  function calculate(chart) {
    if (typeof window.Solar?.fromYmdHms !== 'function') {
      throw new Error('農曆換算元件尚未載入。');
    }
    const date = chart.date.split('-').map(Number);
    const time = chart.time.split(':').map(Number);
    // The lunar calendar rolls over at midnight. At 23:00 only the hour branch changes to 子.
    const lunar = window.Solar.fromYmdHms(...date, ...time, 0).getLunar();
    const year = lunar.getYearInGanZhi();
    const month = lunar.getMonthInChinese().replace('闰', '閏').replace('腊', '臘');
    const hour = lunar.getTimeZhi();
    const parts = [
      { id: 'year', label: '出生年', value: year + '年', weight: yearWeights[year] },
      // Leap months use the weight of the regular month with the same number.
      { id: 'month', label: '出生月', value: month + '月', weight: monthWeights[Math.abs(lunar.getMonth()) - 1] },
      { id: 'day', label: '出生日', value: lunar.getDayInChinese(), weight: dayWeights[lunar.getDay() - 1] },
      { id: 'hour', label: '出生時辰', value: hour + '時', weight: hourWeights[hour] }
    ];
    return { total: parts.reduce((sum, part) => sum + part.weight, 0), parts, min, max };
  }

  window.MoonveilBaziBoneWeight = { calculate };
})();
