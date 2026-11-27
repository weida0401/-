(() => {
  "use strict";

  const signs = {
    aries: { element: "fire", modality: "cardinal" },
    taurus: { element: "earth", modality: "fixed" },
    gemini: { element: "air", modality: "mutable" },
    cancer: { element: "water", modality: "cardinal" },
    leo: { element: "fire", modality: "fixed" },
    virgo: { element: "earth", modality: "mutable" },
    libra: { element: "air", modality: "cardinal" },
    scorpio: { element: "water", modality: "fixed" },
    sagittarius: { element: "fire", modality: "mutable" },
    capricorn: { element: "earth", modality: "cardinal" },
    aquarius: { element: "air", modality: "fixed" },
    pisces: { element: "water", modality: "mutable" }
  };

  const sameElements = {
    fire: "同是火象，容易接得上彼此想試試看的心情，興致一來可以留點時間問對方想怎麼做。",
    earth: "同是土象，通常比較能理解彼此想把時間、花費和做法講清楚再答應。",
    air: "同是風象，聊天時容易接上對方的話，也能一起從不同角度想同一件事。",
    water: "同是水象，常能察覺話裡的情緒，留一點時間讓對方慢慢講會更容易聽懂。"
  };
  const mixedElements = {
    "air-earth": {
      score: 70,
      text: "風象常想多聊幾個選項，土象比較在意到底行不行，挑一個能試的小做法比較好繼續。"
    },
    "air-fire": {
      score: 90,
      text: "火象願意先試一個做法，風象容易再補個點子，聊過之後比較有機會真的去做。"
    },
    "air-water": {
      score: 70,
      text: "風象可能先問事情怎麼發生，水象可能想先聊當下的感覺，慢一點比較能聽懂彼此在意什麼。"
    },
    "earth-fire": {
      score: 70,
      text: "火象可能想趁有興趣趕快做，土象想把時間和花費先弄清楚，約個短時間試做能照顧到兩邊。"
    },
    "earth-water": {
      score: 90,
      text: "土象常先想到怎麼安排，水象容易察覺對方覺得方不方便，約時間時能補上彼此沒想到的地方。"
    },
    "fire-water": {
      score: 70,
      text: "火象可能很快說出想法，水象有時需要多一點時間消化，讓對方講完再決定比較容易談下去。"
    }
  };

  const rhythmRules = {
    "cardinal-cardinal": {
      score: 74,
      text: "兩個都偏開創，碰到要決定的事可能都想先帶頭，可以先說好誰負責哪一步。"
    },
    "cardinal-fixed": {
      score: 84,
      text: "開創型容易先開頭，固定型能把說好的事做下去，一開始就講清楚哪一段還可以改會比較省事。"
    },
    "cardinal-mutable": {
      score: 90,
      text: "開創型容易先提議，變動型擅長跟著情況調整，講好今天要做到哪一步就能少重來幾次。"
    },
    "fixed-fixed": {
      score: 72,
      text: "兩個都偏固定，說好的事可以一起做久一點，行程臨時要改時先講理由會比較好談。"
    },
    "fixed-mutable": {
      score: 86,
      text: "固定型能讓約好的事繼續，變動型遇到變化容易想到其他做法，想改安排時可以先商量。"
    },
    "mutable-mutable": {
      score: 80,
      text: "兩個都偏變動，安排有變時常能一起調整，先留一個真的做得到的時間會比較容易成行。"
    }
  };

  // Indexed by the shorter number of signs between the two Sun signs.
  const spacingRules = [
    { score: 84, text: "兩個星座相同，容易理解彼此的習慣，遇到都不熟的情況也可以一起找人問。" },
    { score: 66, text: "兩個星座在黃道上相鄰，可能先注意到不同的細節，約時間或分工時可以把各自的想法說出來。" },
    { score: 91, text: "兩個星座相隔兩格，做法容易互補，例如有人想出可以去哪裡，有人接著找到去得成的時間。" },
    { score: 62, text: "兩個星座相隔三格，遇到要馬上決定的事可能各有主張，先說好兩人都想把什麼做好會比較好談。" },
    { score: 96, text: "兩個星座相隔四格，通常比較容易理解對方為什麼這樣想，聊起共同有興趣的事也容易接得上。" },
    { score: 64, text: "兩個星座相隔五格，同一句話可能各自聽成不同意思，拿一個實際例子確認會比較好懂。" },
    { score: 75, text: "兩個星座在黃道上相對，常能看見對方注意到而自己沒想到的事，一起做決定時可以把兩邊的理由都聽完。" }
  ];

  const transitCues = {
    Mercury: {
      focus: "這週有件事要一起決定嗎？先用一句話把問題講清楚，再各自說想怎麼做。",
      support: "想約見面就把時間和地點寫出來，問一句「這個時間你方便嗎？」",
      challenge: "訊息看起來有點冷時，可以問「你是這個意思嗎？」等對方說完再回。"
    },
    Venus: {
      focus: "各說一件最近讓自己覺得被放在心上的小事，像是下班後收到一句問候。",
      support: "想靠近一點，可以約一頓飯，或直接告訴對方「我有注意到你上次幫我做的那件事」。",
      challenge: "一個人想多見幾次，另一個人這週排不出時間時，先談哪天真的有空。"
    }
  };
  const aspectAngles = {
    合相: 0, 六合: 60, 四分相: 90, 三分相: 120, 對分相: 180
  };
  const venusSnapshotCues = {
    fire: "想拉近距離時，提一個可以這週一起試的小活動，先問對方有沒有時間和興趣。",
    earth: "用一個能做到的小約定照顧彼此，例如敲定見面時間或主動分擔一件日常小事。",
    air: "找一段輕鬆的時間交換近況，聊到在意的事時也可以說清楚你期待怎樣的回應。",
    water: "說出一件最近讓自己感到被照顧的事，也問對方現在希望得到怎樣的支持。"
  };

  const zodiacOrder = Object.keys(signs);

  function pairKey(first, second) {
    return [first, second].sort().join("-");
  }

  function compare(firstId, secondId) {
    const firstIndex = zodiacOrder.indexOf(firstId);
    const secondIndex = zodiacOrder.indexOf(secondId);
    if (firstIndex < 0 || secondIndex < 0) return null;

    const key = firstIndex <= secondIndex ? `${firstId}-${secondId}` : `${secondId}-${firstId}`;
    const reading = window.MoonveilZodiacPairDialogue?.[key];
    if (!reading) return null;
    const first = signs[firstId];
    const second = signs[secondId];
    const gap = Math.abs(firstIndex - secondIndex);
    const element = first.element === second.element
      ? { score: 96, text: sameElements[first.element] }
      : mixedElements[pairKey(first.element, second.element)];
    const rhythm = rhythmRules[pairKey(first.modality, second.modality)];
    const spacing = spacingRules[Math.min(gap, zodiacOrder.length - gap)];
    const factors = [
      { id: "element", title: "元素互動", score: element.score, weight: 40, text: element.text },
      { id: "rhythm", title: "相處步調", score: rhythm.score, weight: 25, text: rhythm.text },
      { id: "spacing", title: "看法與互補", score: spacing.score, weight: 35, text: spacing.text }
    ];
    const score = Math.round(factors.reduce((sum, factor) => sum + factor.score * factor.weight, 0) / 100);
    return { ...reading, score, factors };
  }

  function transitNote(firstId, secondId, firstWeek, secondWeek) {
    if (!zodiacOrder.includes(firstId) || !zodiacOrder.includes(secondId)) return "";

    const weekly = [[firstId, firstWeek], [secondId, secondWeek]];
    const highlights = weekly.flatMap(([target, week]) => {
      if (!Array.isArray(week?.highlights)) return [];
      return week.highlights.map(entry => ({ target, entry }));
    });
    const sampleDate = entry => typeof entry.dateLabel === "string" ? entry.dateLabel : "";
    const notes = [];
    for (const [planet, guide] of Object.entries(transitCues)) {
      const candidates = highlights.filter(({ entry }) => entry?.planet === planet &&
        zodiacOrder.includes(entry.signId) &&
        Object.hasOwn(aspectAngles, entry.aspect?.name) &&
        ["focus", "support", "challenge"].includes(entry.aspect?.tone) &&
        Number.isFinite(entry.aspect?.degrees));
      const distance = ({entry}) => Math.abs(entry.aspect.degrees - aspectAngles[entry.aspect.name]);
      candidates.sort((left, right) => distance(left) - distance(right) ||
        zodiacOrder.indexOf(left.target) - zodiacOrder.indexOf(right.target) ||
        sampleDate(left.entry).localeCompare(sampleDate(right.entry)) ||
        zodiacOrder.indexOf(left.entry.signId) - zodiacOrder.indexOf(right.entry.signId) ||
        left.entry.aspect.name.localeCompare(right.entry.aspect.name) ||
        left.entry.aspect.tone.localeCompare(right.entry.aspect.tone));
      const match = candidates[0];
      if (match) {
        const { entry } = match;
        notes.push(guide[entry.aspect.tone]);
      }
    }
    if (notes.length) return notes.join("");

    const venus = weekly.flatMap(([, week]) => Array.isArray(week?.sky)
      ? week.sky.filter(entry => entry?.planet === "Venus" && zodiacOrder.includes(entry.signId))
      : []).sort((left, right) => sampleDate(left).localeCompare(sampleDate(right)) ||
        zodiacOrder.indexOf(left.signId) - zodiacOrder.indexOf(right.signId))[0];
    if (!venus) return "";
    const sign = signs[venus.signId];
    return venusSnapshotCues[sign.element];
  }

  window.MoonveilZodiacMatch = Object.freeze({ compare, transitNote });
})();
