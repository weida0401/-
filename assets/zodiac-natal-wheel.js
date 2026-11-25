(function (window) {
  'use strict';

  const radians = Math.PI / 180;
  const symbolFont = '"Noto Sans Symbols 2", "Noto Sans Symbols2", "Segoe UI Symbol", "DejaVu Sans", "Apple Symbols", serif';
  const signs = ['♈︎', '♉︎', '♊︎', '♋︎', '♌︎', '♍︎', '♎︎', '♏︎', '♐︎', '♑︎', '♒︎', '♓︎'];
  const signColors = ['#f2ad93', '#d8c292', '#f2d99f', '#a5d0cb'];
  const planetSymbols = {
    Sun: ['☉', '#ffd18b'], Moon: ['☽', '#ffe9cd'], Mercury: ['☿', '#eacafa'],
    Venus: ['♀︎', '#f3bfd7'], Mars: ['♂︎', '#ffaf9d'], Jupiter: ['♃', '#f6c797'],
    Saturn: ['♄', '#dfcaa6'], Uranus: ['♅', '#b7dad5'], Neptune: ['♆', '#b8c9ef'],
    Pluto: ['♇', '#e2bce9'],
  };

  function normalize(longitude) {
    return ((longitude % 360) + 360) % 360;
  }

  function limit(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function placeLabels(items, minimumGap) {
    const sorted = [...items].sort((a, b) => a.longitude - b.longitude);
    if (!sorted.length) return [];

    // Cut at the widest empty arc so neighbouring labels across 0° are spaced together.
    let start = 0;
    let widestGap = 0;
    sorted.forEach((item, index) => {
      const next = (index + 1) % sorted.length;
      const gap = sorted[next].longitude + (next === 0 ? 360 : 0) - item.longitude;
      if (gap > widestGap) {
        widestGap = gap;
        start = next;
      }
    });

    const ordered = sorted.slice(start).concat(sorted.slice(0, start));
    const blocks = [];
    ordered.forEach((item, index) => {
      const original = item.longitude + (start + index >= sorted.length ? 360 : 0);
      blocks.push({ sum: original - index * minimumGap, count: 1 });

      // Pool overlapping runs. Averaging keeps each cluster centred on its true positions.
      while (blocks.length > 1) {
        const right = blocks[blocks.length - 1];
        const left = blocks[blocks.length - 2];
        if (left.sum / left.count <= right.sum / right.count) break;
        left.sum += right.sum;
        left.count += right.count;
        blocks.pop();
      }
    });

    let index = 0;
    return blocks.flatMap(({ sum, count }) => Array.from({ length: count }, () => {
      const item = ordered[index];
      const original = item.longitude + (start + index >= sorted.length ? 360 : 0);
      const placed = sum / count + index * minimumGap;
      index++;
      return { ...item, labelLongitude: item.longitude + placed - original };
    }));
  }

  function draw(canvas, chart) {
    const size = canvas.getBoundingClientRect().width;
    const context = canvas.getContext('2d');
    if (!size || !context) return false;

    const pixels = Math.round(size * (window.devicePixelRatio || 1));
    if (canvas.width !== pixels) canvas.width = pixels;
    if (canvas.height !== pixels) canvas.height = pixels;
    context.setTransform(pixels / size, 0, 0, pixels / size, 0, 0);
    context.clearRect(0, 0, size, size);
    context.lineCap = 'round';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    const center = size / 2;
    const zodiacOuter = size * .419;
    const zodiacInner = size * .349;
    const planetRing = size * .263;
    const houseRing = size * .145;
    const axisOuter = size * .433;
    const axes = [
      { longitude: chart.ascendant.longitude, label: 'AC' },
      { longitude: chart.imumCoeli.longitude, label: 'IC' },
      { longitude: chart.descendant.longitude, label: 'DC' },
      { longitude: chart.midheaven.longitude, label: 'MC' },
    ].sort((a, b) => normalize(a.longitude - chart.ascendant.longitude) - normalize(b.longitude - chart.ascendant.longitude));

    function angle(longitude) {
      // The Ascendant sits to the left. Positive longitude advances counter-clockwise.
      return Math.PI - (longitude - chart.ascendant.longitude) * radians;
    }

    function point(longitude, radius) {
      const direction = angle(longitude);
      return [center + radius * Math.cos(direction), center + radius * Math.sin(direction)];
    }

    function disk(radius, fill, stroke, x = center, y = center) {
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      if (fill) {
        context.fillStyle = fill;
        context.fill();
      }
      if (stroke) {
        context.strokeStyle = stroke;
        context.stroke();
      }
    }

    function sector(longitude, sweep, outer, inner, fill) {
      const start = angle(longitude);
      const end = start - sweep * radians;
      context.beginPath();
      context.arc(center, center, outer, start, end, true);
      if (inner) context.arc(center, center, inner, end, start);
      else context.lineTo(center, center);
      context.closePath();
      context.fillStyle = fill;
      context.fill();
    }

    function spoke(longitude, inside, outside, color) {
      context.beginPath();
      context.moveTo(...point(longitude, inside));
      context.lineTo(...point(longitude, outside));
      context.strokeStyle = color;
      context.stroke();
    }

    function connector(item, outside, inside, color) {
      context.beginPath();
      context.moveTo(...point(item.longitude, outside));
      for (let step = 1; step <= 10; step++) {
        const progress = step / 10;
        const drift = progress * progress * (3 - 2 * progress);
        const longitude = item.longitude + drift * (item.labelLongitude - item.longitude);
        context.lineTo(...point(longitude, outside + progress * (inside - outside)));
      }
      context.strokeStyle = color;
      context.stroke();
    }

    const dusk = context.createRadialGradient(center, center - size * .15, 0, center, center, size * .48);
    dusk.addColorStop(0, '#402937');
    dusk.addColorStop(.65, '#261b28');
    dusk.addColorStop(1, '#1b141d');
    context.lineWidth = 1;
    disk(size * .483, dusk, '#bc95615e');
    disk(size * .471, null, '#bc956129');

    axes.forEach((axis, index) => {
      const next = axes[(index + 1) % axes.length];
      sector(axis.longitude, normalize(next.longitude - axis.longitude), zodiacInner, 0,
        index % 2 ? '#4e314828' : '#b8875f0c');
    });

    signs.forEach((glyph, index) => {
      const start = index * 30;
      const color = signColors[index % signColors.length];
      sector(start, 30, zodiacOuter, zodiacInner, color + '19');
      spoke(start, zodiacInner, zodiacOuter, '#bd956997');
      context.font = `${limit(size * .056, 14, 25)}px ${symbolFont}`;
      context.fillStyle = color;
      context.fillText(glyph, ...point(start + 15, (zodiacOuter + zodiacInner) / 2));
    });

    for (let longitude = 0; longitude < 360; longitude += 5) {
      const major = longitude % 30 === 0;
      spoke(longitude, zodiacOuter, zodiacOuter + size * (major ? .012 : .006),
        major ? '#e3b577b5' : '#e3b57749');
    }
    disk(zodiacInner, null, '#d3a88296');
    disk(zodiacOuter, null, '#d3a88296');
    disk(houseRing, null, '#e5b2a328');

    context.setLineDash([2, 3]);
    chart.cusps.forEach(cusp => spoke(cusp.longitude, size * .035, zodiacInner, '#c9a6bb79'));
    context.setLineDash([]);
    axes.forEach(axis => spoke(axis.longitude, 0, axisOuter, '#dfb07796'));
    disk(size * .010, '#e4b680', '#412735');

    const houseMarkers = chart.cusps.map((cusp, index) => {
      const next = chart.cusps[(index + 1) % chart.cusps.length];
      const middle = cusp.longitude + normalize(next.longitude - cusp.longitude) / 2;
      return { longitude: normalize(middle), label: cusp.house };
    });
    const houseMarker = limit(size * .020, 6.1, 8.5);
    const houseGap = 2 * Math.asin((houseMarker + 1) / houseRing) / radians;
    const houseLabels = placeLabels(houseMarkers, houseGap);
    houseLabels.forEach(house => {
      if (Math.abs(house.labelLongitude - house.longitude) > .01) {
        connector(house, size * .189, houseRing, '#d9b0ae82');
        disk(1.15, '#d9b0ae', null, ...point(house.longitude, size * .189));
      }
    });
    context.font = `600 ${limit(size * .029, 9, 13)}px system-ui, sans-serif`;
    houseLabels.forEach(house => {
      const position = point(house.labelLongitude, houseRing);
      disk(houseMarker, '#30212e', null, ...position);
      context.fillStyle = '#e4c1b9';
      context.fillText(house.label, ...position);
    });

    const angleGap = 11.5;
    const angleLabels = placeLabels(axes, angleGap);
    context.font = `700 ${limit(size * .026, 10, 12)}px system-ui, sans-serif`;
    angleLabels.forEach(axis => {
      connector(axis, axisOuter, size * .445, '#e9b981ad');
      disk(limit(size * .0045, 1.3, 2.3), '#f3c28d', null, ...point(axis.longitude, axisOuter));
      context.fillStyle = '#f9d29d';
      context.fillText(axis.label, ...point(axis.labelLongitude, size * .455));
    });

    const marker = limit(size * .029, 8, 12.5);
    const planetGap = 2 * Math.asin((marker + 1.5) / planetRing) / radians;
    const planets = placeLabels(chart.planets, planetGap);
    planets.forEach(planet => {
      const [, color] = planetSymbols[planet.id];
      connector(planet, zodiacInner, planetRing, color + '9c');
      disk(limit(size * .005, 1.5, 2.5), color, '#332332', ...point(planet.longitude, zodiacInner));
    });
    context.font = `${limit(marker * 1.56, 12, 19)}px ${symbolFont}`;
    planets.forEach(planet => {
      const [glyph, color] = planetSymbols[planet.id];
      const position = point(planet.labelLongitude, planetRing);
      disk(marker, '#2c202f', color + '96', ...position);
      context.fillStyle = color;
      context.fillText(glyph, ...position);
    });

    return true;
  }

  window.MoonveilNatalWheel = { draw };
})(window);
