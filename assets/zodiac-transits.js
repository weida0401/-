(() => {
  'use strict';

  const taipeiCalendar = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei', year: 'numeric', month: 'numeric', day: 'numeric'
  });
  const dayMilliseconds = 24 * 60 * 60 * 1000;
  const signs = [
    ['aries', '牡羊座'], ['taurus', '金牛座'], ['gemini', '雙子座'], ['cancer', '巨蟹座'],
    ['leo', '獅子座'], ['virgo', '處女座'], ['libra', '天秤座'], ['scorpio', '天蠍座'],
    ['sagittarius', '射手座'], ['capricorn', '摩羯座'], ['aquarius', '水瓶座'], ['pisces', '雙魚座']
  ];
  const planets = [
    { planet: 'Sun', planetName: '太陽', daily: .8, weekly: .96 },
    { planet: 'Moon', planetName: '月亮', daily: 1.1, weekly: .72 },
    { planet: 'Mercury', planetName: '水星', daily: .86, weekly: 1 },
    { planet: 'Venus', planetName: '金星', daily: .86, weekly: 1 },
    { planet: 'Mars', planetName: '火星', daily: .82, weekly: 1 },
    { planet: 'Jupiter', planetName: '木星', daily: .7, weekly: .9 },
    { planet: 'Saturn', planetName: '土星', daily: .68, weekly: .9 }
  ];
  const effects = [
    { name: '合相', angle: 0, orbLimit: 7, tone: 'focus' },
    { name: '六合', angle: 60, orbLimit: 4, tone: 'support' },
    { name: '四分相', angle: 90, orbLimit: 6, tone: 'challenge' },
    { name: '三分相', angle: 120, orbLimit: 6, tone: 'support' },
    { name: '對分相', angle: 180, orbLimit: 7, tone: 'challenge' }
  ];
  const skyCache = new Map();

  function taipeiNoon(now) {
    const parts = Object.fromEntries(taipeiCalendar.formatToParts(now).map(part => [part.type, part.value]));
    // Taiwan currently observes UTC+08:00 year-round.
    return new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), 4));
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * dayMilliseconds);
  }

  function monthDay(date) {
    return (date.getUTCMonth() + 1) + '/' + date.getUTCDate();
  }

  function yearMonthDay(date) {
    return date.getUTCFullYear() + '/' + monthDay(date);
  }

  function dateRange(start, end, period) {
    if (period === 'daily') return yearMonthDay(start);
    const endLabel = start.getUTCFullYear() === end.getUTCFullYear() ? monthDay(end) : yearMonthDay(end);
    return yearMonthDay(start) + '–' + endLabel;
  }

  function longitudeFor(planet, date) {
    const astronomy = window.Astronomy;
    if (planet === 'Moon') return astronomy.EclipticGeoMoon(date).lon;
    const vector = astronomy.GeoVector(astronomy.Body[planet], date, true);
    return astronomy.Ecliptic(vector).elon;
  }

  function skyAt(date) {
    const key = date.getTime();
    const existing = skyCache.get(key);
    if (existing) return existing;

    const dateLabel = monthDay(date);
    const sampleDate = date.toISOString().slice(0, 10);
    const sky = planets.map(({ planet, planetName }) => {
      const longitude = longitudeFor(planet, date);
      const [signId, signName] = signs[Math.floor(longitude / 30)];
      return { planet, planetName, longitude, signId, signName, degree: longitude % 30, dateLabel, sampleDate };
    });
    if (skyCache.size >= 14) skyCache.delete(skyCache.keys().next().value);
    skyCache.set(key, sky);
    return sky;
  }

  function scorePosition(position, midpoint, weight) {
    // A sign midpoint is a shared reference for a sun-sign forecast, never a birth-chart degree.
    const difference = Math.abs(position.longitude - midpoint);
    const degrees = Math.min(difference, 360 - difference);
    const effect = effects.find(({ angle, orbLimit }) => Math.abs(degrees - angle) <= orbLimit);
    if (!effect) return { score: 0, entry: { ...position, aspect: null } };

    const { name, angle, tone, orbLimit } = effect;
    const orb = Math.abs(degrees - angle);
    return {
      score: (1 + (1 - orb / orbLimit)) * weight,
      entry: { ...position, aspect: { name, tone, degrees, angle, orb } }
    };
  }

  function highlightsFor(samples, snapshot, midpoint, period) {
    return planets.map((planet, index) => {
      const weight = planet[period];
      let strongest = { score: .5 * weight, entry: { ...snapshot[index], aspect: null } };
      for (const sample of samples) {
        const scored = scorePosition(sample[index], midpoint, weight);
        if (scored.score > strongest.score) strongest = scored;
      }
      return strongest;
    }).sort((left, right) => right.score - left.score)
      .slice(0, 3)
      .map(match => match.entry);
  }

  function forecast(signId, period, now = new Date()) {
    const index = signs.findIndex(([id]) => id === signId);
    if (index < 0 || (period !== 'daily' && period !== 'weekly')) {
      throw new RangeError('Unknown zodiac sign or forecast period.');
    }

    const today = taipeiNoon(now);
    const weekly = period === 'weekly';
    const mondayOffset = (today.getUTCDay() + 6) % 7;
    const start = weekly ? addDays(today, -mondayOffset) : today;
    const end = weekly ? addDays(start, 6) : start;
    const snapshot = skyAt(today);
    const samples = weekly ? Array.from({length: 7}, (_, day) => skyAt(addDays(start, day))) : [snapshot];
    return {
      dateLabel: dateRange(start, end, period),
      startDate: start.toISOString().slice(0, 10),
      endDate: end.toISOString().slice(0, 10),
      skyDateLabel: yearMonthDay(today) + ' 12:00（台灣時間）',
      skyTimestamp: today.toISOString(),
      sky: snapshot.map(position => ({ ...position })),
      highlights: highlightsFor(samples, snapshot, index * 30 + 15, period)
    };
  }

  window.MoonveilTransits = { forecast };
})();
