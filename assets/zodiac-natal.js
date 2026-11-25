(() => {
  'use strict';

  const zodiac = [
    ['aries', '牡羊座'], ['taurus', '金牛座'], ['gemini', '雙子座'], ['cancer', '巨蟹座'],
    ['leo', '獅子座'], ['virgo', '處女座'], ['libra', '天秤座'], ['scorpio', '天蠍座'],
    ['sagittarius', '射手座'], ['capricorn', '摩羯座'], ['aquarius', '水瓶座'], ['pisces', '雙魚座']
  ];
  const bodies = [
    ['Sun', '太陽'], ['Moon', '月亮'], ['Mercury', '水星'], ['Venus', '金星'], ['Mars', '火星'],
    ['Jupiter', '木星'], ['Saturn', '土星'], ['Uranus', '天王星'], ['Neptune', '海王星'], ['Pluto', '冥王星']
  ];
  const radiansPerDegree = Math.PI / 180;
  const minimumArc = 1e-9;

  function normalize(degrees) {
    return ((degrees % 360) + 360) % 360;
  }

  function signPosition(longitude) {
    const [signId, signName] = zodiac[Math.floor(longitude / 30)];
    return { longitude, signId, signName, degree: longitude % 30 };
  }

  function undefinedCusps() {
    const error = new RangeError('這組出生時間和緯度的地平線與子午線交點無法形成四個有效象限，無法計算宮位。');
    error.code = 'NATAL_POLAR_CUSPS';
    return error;
  }

  function chartAxes(astronomy, time, latitude, longitude) {
    const localSiderealAngle = (astronomy.SiderealTime(time) * 15 + longitude) * radiansPerDegree;
    const obliquity = astronomy.e_tilt(time).tobl * radiansPerDegree;
    const phi = latitude * radiansPerDegree;
    const cosLatitude = Math.cos(phi);
    const sinSidereal = Math.sin(localSiderealAngle);
    const cosSidereal = Math.cos(localSiderealAngle);
    const cosObliquity = Math.cos(obliquity);

    // The altitude of an ecliptic point vanishes where its vector is perpendicular to the zenith.
    const horizonCosine = cosLatitude * cosSidereal;
    const horizonSine = cosLatitude * sinSidereal * cosObliquity + Math.sin(phi) * Math.sin(obliquity);
    if (cosLatitude < 1e-12 || Math.hypot(horizonCosine, horizonSine) < 1e-12) throw undefinedCusps();

    const intersection = Math.atan2(-horizonCosine, horizonSine);
    const east = -sinSidereal * Math.cos(intersection) + cosSidereal * cosObliquity * Math.sin(intersection);
    if (Math.abs(east) < 1e-12) throw undefinedCusps();

    const ascendant = normalize(intersection / radiansPerDegree + (east < 0 ? 180 : 0));
    const midheaven = normalize(Math.atan2(sinSidereal, cosSidereal * cosObliquity) / radiansPerDegree);
    return { ascendant, midheaven, descendant: normalize(ascendant + 180), imumCoeli: normalize(midheaven + 180) };
  }

  function porphyryCusps({ ascendant, midheaven, descendant, imumCoeli }) {
    const starts = [ascendant, imumCoeli, descendant, midheaven];
    const arcs = starts.map((start, index) => normalize(starts[(index + 1) % starts.length] - start));
    const sum = arcs.reduce((total, arc) => total + arc, 0);
    // At some high latitudes the axes alternate in reverse order, so the same arcs would overlap.
    if (arcs.some(arc => arc < minimumArc) || Math.abs(sum - 360) > minimumArc) throw undefinedCusps();

    return starts.flatMap((start, index) => [0, 1, 2].map(part => ({
      house: index * 3 + part + 1,
      ...signPosition(normalize(start + arcs[index] * part / 3))
    })));
  }

  function houseAt(longitude, cusps) {
    const first = cusps[0].longitude;
    const offset = normalize(longitude - first);
    for (let index = cusps.length - 1; index > 0; index--) {
      if (offset >= normalize(cusps[index].longitude - first)) return cusps[index].house;
    }
    return 1;
  }

  function planetLongitude(astronomy, id, time) {
    if (id === 'Moon') return astronomy.EclipticGeoMoon(time).lon;
    return astronomy.Ecliptic(astronomy.GeoVector(astronomy.Body[id], time, true)).elon;
  }

  function calculate(date, latitude, longitude) {
    if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new RangeError('請填寫有效的出生日期和時間。');
    if (!Number.isFinite(latitude) || Math.abs(latitude) > 90 ||
        !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      throw new RangeError('緯度須介於 −90° 至 90°，經度須介於 −180° 至 180°。');
    }
    const astronomy = window.Astronomy;
    if (!astronomy) throw new Error('行星位置計算元件尚未載入。');

    const time = astronomy.MakeTime(date);
    const axes = chartAxes(astronomy, time, latitude, longitude);
    const cusps = porphyryCusps(axes);
    const planets = bodies.map(([id, name]) => {
      const position = signPosition(normalize(planetLongitude(astronomy, id, time)));
      return { id, name, ...position, house: houseAt(position.longitude, cusps) };
    });
    const quadrants = [0, 1, 2, 3].map(index => {
      const first = index * 3 + 1;
      const houses = [first, first + 1, first + 2];
      return { number: index + 1, houses, planets: planets.filter(planet => houses.includes(planet.house)) };
    });

    return {
      ascendant: { id: 'Asc', name: '上升點', ...signPosition(axes.ascendant), house: 1 },
      midheaven: { id: 'MC', name: '天頂', ...signPosition(axes.midheaven), house: 10 },
      descendant: { id: 'Desc', name: '下降點', ...signPosition(axes.descendant), house: 7 },
      imumCoeli: { id: 'IC', name: '天底', ...signPosition(axes.imumCoeli), house: 4 },
      planets,
      cusps,
      quadrants
    };
  }

  window.MoonveilNatal = { calculate };
})();
