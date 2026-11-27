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

  const distanceScores = [84, 69, 84, 66, 91, 67, 76];
  const complementaryElements = ["air-fire", "earth-water"];

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
    const elementPair = pairKey(first.element, second.element);
    const elements = first.element === second.element ? 2 : complementaryElements.includes(elementPair) ? 1 : -1;
    const rhythm = first.modality === second.modality ? -1
      : pairKey(first.modality, second.modality) === "cardinal-mutable" ? 1 : 0;
    const score = distanceScores[Math.min(gap, 12 - gap)] + elements + rhythm;
    return { ...reading, score };
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
