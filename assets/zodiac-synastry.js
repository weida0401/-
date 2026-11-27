(() => {
  'use strict';

  const neutralScore = 65;
  const neutralWeight = 4;
  const luminaries = new Set(['Sun', 'Moon']);
  const aspects = [
    { angle: 0, orb: 7, luminaryOrb: 9, name: '合相' },
    { angle: 60, orb: 4, luminaryOrb: 5, name: '六合', impact: 23 },
    { angle: 90, orb: 6, luminaryOrb: 7, name: '四分相', impact: -30 },
    { angle: 120, orb: 6, luminaryOrb: 8, name: '三分相', impact: 32 },
    { angle: 180, orb: 7, luminaryOrb: 9, name: '對分相' },
  ];
  const dimensions = [
    {
      id: 'emotion', title: '心情能不能接得住', weight: 30,
      strengthHeadline: '比較懂彼此的心情', frictionHeadline: '心情不好時多問一句',
      pairs: [
        { bodies: ['Moon', 'Moon'], weight: 5, conjunction: 28, opposition: -26 },
        { bodies: ['Sun', 'Moon'], weight: 4, conjunction: 29, opposition: -19 },
        { bodies: ['Moon', 'Asc'], weight: 2, conjunction: 23, opposition: -14 },
      ],
      smooth: '有心事的時候，你們比較容易知道對方想要的是陪伴還是空間。像是回到家累得不想講話，對方可能懂得先陪你坐一會兒。',
      friction: '一個人想把話聊開，另一個人可能想先安靜。有人突然不說話時，可以先問對方想獨處多久，約好晚點再聊。',
      neutral: '累了一天以後，有人想聊兩句，有人想自己待著。可以直接告訴對方，你在什麼時候比較需要人陪。',
      action: '下次對方心情不好，先問「想要我聽，還是想先自己待一下？」等對方回答，再決定怎麼陪。',
    },
    {
      id: 'communication', title: '聊天會不會一直猜', weight: 25,
      strengthHeadline: '聊天比較接得上', frictionHeadline: '有事要多說清楚一點',
      pairs: [
        { bodies: ['Mercury', 'Mercury'], weight: 5, conjunction: 30, opposition: -24 },
        { bodies: ['Mercury', 'Moon'], weight: 4, conjunction: 18, opposition: -26 },
        { bodies: ['Mercury', 'Sun'], weight: 3, conjunction: 22, opposition: -18 },
        { bodies: ['Mercury', 'Mars'], weight: 3, conjunction: -7, opposition: -25 },
      ],
      smooth: '你們比較容易抓到對方話裡的重點。一起改行程或談意見時，可以用這份默契把時間和做法早點講清楚。',
      friction: '一個人說「都可以」只是想配合，另一個人可能真的照自己的意思定下來。遇到在意的事，各講一個明確的選項，會比猜來猜去省力。',
      neutral: '文字少了語氣，忙的時候尤其容易讀錯。約見面或談分歧時，先把時間和你最在意的事講得明白一點。',
      action: '有件事意見不同時，各自說「我最在意的是……」，再用自己的話講一遍剛才聽到的意思。',
    },
    {
      id: 'affection', title: '怎麼讓對方覺得被喜歡', weight: 25,
      strengthHeadline: '比較容易接到對方的心意', frictionHeadline: '喜歡要讓對方感受得到',
      pairs: [
        { bodies: ['Venus', 'Venus'], weight: 4, conjunction: 32, opposition: -18 },
        { bodies: ['Venus', 'Mars'], weight: 5, conjunction: 34, opposition: 10 },
        { bodies: ['Sun', 'Venus'], weight: 3, conjunction: 29, opposition: -9 },
        { bodies: ['Venus', 'Asc'], weight: 3, conjunction: 27, opposition: 6 },
        { bodies: ['Mars', 'Mars'], weight: 2, conjunction: 11, opposition: -29 },
      ],
      smooth: '你們比較容易對彼此的示好有回應。有人主動約見面，另一個人也願意接球，再回約一次會讓那份心意更清楚。',
      friction: '一個人可能用熱情邀約表示喜歡，另一個人更在意答應的事有沒有做到。有落差時，說一件你希望對方這週做得到的小事。',
      neutral: '有些人靠陪伴感受到喜歡，也有人比較吃具體的關心。各自舉一件真的讓你開心過的小事，對方比較知道怎麼做。',
      action: '各說一件會讓自己覺得被放在心上的小事，像是忙完回個訊息或主動約一次見面，這週就各試一件。',
    },
    {
      id: 'long-term', title: '能不能維持共同的生活節奏', weight: 20,
      strengthHeadline: '答應的事比較做得到', frictionHeadline: '長期安排先說好怎麼改',
      pairs: [
        { bodies: ['Saturn', 'Saturn'], weight: 3, conjunction: 12, opposition: -20 },
        { bodies: ['Sun', 'Saturn'], weight: 4, conjunction: -12, opposition: -31 },
        { bodies: ['Venus', 'Saturn'], weight: 5, conjunction: -17, opposition: -33 },
        { bodies: ['Jupiter', 'Saturn'], weight: 4, conjunction: 16, opposition: -17 },
        { bodies: ['Moon', 'Jupiter'], weight: 3, conjunction: 26, opposition: -10 },
        { bodies: ['Moon', 'Saturn'], weight: 3, conjunction: -7, opposition: -27 },
        { bodies: ['Jupiter', 'Jupiter'], weight: 2, conjunction: 22, opposition: -12 },
      ],
      smooth: '排見面或分家務時，你們比較容易找到兩邊都能維持的節奏。忙起來也可以先約好，哪一件事還想留給彼此。',
      friction: '有人想把長期安排定下來，有人想留點彈性。像是週末要留幾天給彼此，說清楚什麼時候還能改，比趕著答應整個計畫踏實。',
      neutral: '長期怎麼配合，從每週做得到的小約定看得出來。可以先說好臨時有事要怎麼改時間，再一起試一週。',
      action: '挑一個接下來四週都想保留的安排，各說出能做到的頻率，並約好有變動要提早多久通知。',
    },
  ];

  function points(chart) {
    return Object.fromEntries([chart.ascendant, ...chart.planets].map(point => [point.id, point]));
  }

  function contact(first, second, pair, contactWeight) {
    const difference = Math.abs(first.longitude - second.longitude) % 360;
    const distance = Math.min(difference, 360 - difference);
    const hasLuminary = luminaries.has(first.id) || luminaries.has(second.id);
    const aspect = aspects.find(({ angle, orb, luminaryOrb }) => Math.abs(distance - angle) < (hasLuminary ? luminaryOrb : orb));
    if (!aspect) return null;

    const { name, angle } = aspect;
    const orb = hasLuminary ? aspect.luminaryOrb : aspect.orb;
    const differenceFromExact = Math.abs(distance - angle);
    const closeness = (1 - differenceFromExact / orb) ** 2;
    const impact = angle === 0 ? pair.conjunction : angle === 180 ? pair.opposition : aspect.impact;
    return {
      first, second, name, angle, distance, differenceFromExact, orb,
      pairWeight: pair.weight, contactWeight, effectiveWeight: contactWeight * closeness, impact,
    };
  }

  function compareArea(area, first, second) {
    const contacts = area.pairs.flatMap(pair => {
      const [a, b] = pair.bodies;
      if (a === b) return [contact(first[a], second[b], pair, pair.weight)];
      // A mixed pair uses the same total importance as a same-body pair of that weight.
      const directionalWeight = pair.weight / 2;
      return [contact(first[a], second[b], pair, directionalWeight), contact(first[b], second[a], pair, directionalWeight)];
    });
    const matched = contacts.filter(Boolean).sort((a, b) => a.effectiveWeight - b.effectiveWeight);
    const totalWeight = matched.reduce((sum, detail) => sum + detail.effectiveWeight, neutralWeight);
    const details = matched.map(({ effectiveWeight, impact, ...detail }) => ({
      ...detail,
      contribution: effectiveWeight * impact / totalWeight,
    })).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution) || a.contribution - b.contribution);
    // Each signed contribution is in unrounded area points. The reference shrinks sparse evidence toward 65.
    const delta = details.reduce((sum, detail) => sum + detail.contribution, 0);
    const rawScore = neutralScore + delta;
    const text = delta <= -3 ? area.friction : delta >= 3 ? area.smooth : area.neutral;
    const { id, title, weight } = area;
    return { id, title, weight, rawScore, score: Math.round(rawScore), text, details,
      matchedCount: details.length, possibleCount: contacts.length };
  }

  function compare(firstChart, secondChart) {
    const first = points(firstChart);
    const second = points(secondChart);
    const areas = dimensions.map(area => compareArea(area, first, second));
    const score = Math.round(areas.reduce((total, area) => total + area.score * area.weight, 0) / 100);
    const easiest = areas.reduce((a, b) => a.rawScore >= b.rawScore ? a : b);
    const hardest = areas.reduce((a, b) => a.rawScore <= b.rawScore ? a : b);
    const strengths = dimensions.find(area => area.id === easiest.id);
    const guidance = dimensions.find(area => area.id === hardest.id);
    const matchedCount = areas.reduce((total, area) => total + area.matchedCount, 0);
    const possibleCount = areas.reduce((total, area) => total + area.possibleCount, 0);
    const headlines = [];
    if (easiest.rawScore >= neutralScore + 3) headlines.push(strengths.strengthHeadline);
    if (hardest.rawScore <= neutralScore - 3) headlines.push(guidance.frictionHeadline);
    const headline = headlines.join('，') || '可以先聊聊彼此想怎麼相處';
    const conclusion = matchedCount ? guidance.action
      : '各說出一件最近希望對方知道的事，再約一個這週做得到的小行動。';
    return { score, areas, headline, conclusion, matchedCount, possibleCount };
  }

  window.MoonveilZodiacSynastry = { compare };
})();
