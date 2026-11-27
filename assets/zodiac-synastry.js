(() => {
  'use strict';

  // A neutral comparison is 70. An aspect moves it toward its target as the angle gets closer.
  const neutralScore = 70;
  const aspects = [
    { angle: 0, orb: 8, name: '合相', target: 87 },
    { angle: 60, orb: 4, name: '六合', target: 89 },
    { angle: 90, orb: 6, name: '四分相', target: 48 },
    { angle: 120, orb: 6, name: '三分相', target: 95 },
    { angle: 180, orb: 8, name: '對分相', target: 54 },
  ];
  const dimensions = [
    {
      id: 'emotion', title: '心情能不能接得住',
      strengthHeadline: '比較懂彼此的心情', frictionHeadline: '心情不好時多問一句',
      pairs: [['Moon', 'Moon'], ['Sun', 'Moon'], ['Moon', 'Asc']],
      smooth: '有心事的時候，你們比較容易知道對方想要的是陪伴還是空間。像是回到家累得不想講話，對方可能懂得先陪你坐一會兒。',
      friction: '一個人想把話聊開，另一個人可能想先安靜。有人突然不說話時，可以先問對方想獨處多久，約好晚點再聊。',
      neutral: '累了一天以後，有人想聊兩句，有人想自己待著。可以直接告訴對方，你在什麼時候比較需要人陪。',
      action: '下次對方心情不好，先問「想要我聽，還是想先自己待一下？」等對方回答，再決定怎麼陪。',
    },
    {
      id: 'communication', title: '聊天會不會一直猜',
      strengthHeadline: '聊天比較接得上', frictionHeadline: '有事要多說清楚一點',
      pairs: [['Mercury', 'Mercury'], ['Mercury', 'Moon'], ['Mercury', 'Sun']],
      smooth: '你們比較容易抓到對方話裡的重點。一起改行程或談意見時，可以用這份默契把時間和做法早點講清楚。',
      friction: '一個人說「都可以」只是想配合，另一個人可能真的照自己的意思定下來。遇到在意的事，各講一個明確的選項，會比猜來猜去省力。',
      neutral: '文字少了語氣，忙的時候尤其容易讀錯。約見面或談分歧時，先把時間和你最在意的事講得明白一點。',
      action: '有件事意見不同時，各自說「我最在意的是……」，再用自己的話講一遍剛才聽到的意思。',
    },
    {
      id: 'affection', title: '怎麼讓對方覺得被喜歡',
      strengthHeadline: '比較容易接到對方的心意', frictionHeadline: '喜歡要讓對方感受得到',
      pairs: [['Venus', 'Venus'], ['Venus', 'Mars'], ['Venus', 'Asc'], ['Mars', 'Mars']],
      smooth: '你們比較容易對彼此的示好有回應。有人主動約見面，另一個人也願意接球，再回約一次會讓那份心意更清楚。',
      friction: '一個人可能用熱情邀約表示喜歡，另一個人更在意答應的事有沒有做到。有落差時，說一件你希望對方這週做得到的小事。',
      neutral: '有些人靠陪伴感受到喜歡，也有人比較吃具體的關心。各自舉一件真的讓你開心過的小事，對方比較知道怎麼做。',
      action: '各說一件會讓自己覺得被放在心上的小事，像是忙完回個訊息或主動約一次見面，這週就各試一件。',
    },
  ];

  function points(chart) {
    return Object.fromEntries([chart.ascendant, ...chart.planets].map(point => [point.id, point]));
  }

  function contact(first, second) {
    const difference = Math.abs(first.longitude - second.longitude) % 360;
    const distance = Math.min(difference, 360 - difference);
    const aspect = aspects.find(({ angle, orb }) => Math.abs(distance - angle) < orb);
    if (!aspect) return { score: neutralScore };
    const differenceFromExact = Math.abs(distance - aspect.angle);
    const weight = 1 - differenceFromExact / aspect.orb;
    return {
      score: neutralScore + weight * (aspect.target - neutralScore),
      detail: { first, second, distance, name: aspect.name, differenceFromExact },
    };
  }

  function compare(firstChart, secondChart) {
    const first = points(firstChart);
    const second = points(secondChart);
    const areas = dimensions.map((area) => {
      const contacts = area.pairs.flatMap(([a, b]) => a === b
        ? [contact(first[a], second[b])]
        : [contact(first[a], second[b]), contact(first[b], second[a])]);
      const score = Math.round(contacts.reduce((total, item) => total + item.score, 0) / contacts.length);
      const strongest = Math.max(...contacts.map(item => item.score - neutralScore));
      const hardest = Math.max(...contacts.map(item => neutralScore - item.score));
      const text = hardest > strongest && hardest >= 5 ? area.friction
        : strongest >= 5 ? area.smooth : area.neutral;
      const details = contacts.filter(item => item.detail)
        .sort((a, b) => Math.abs(b.score - neutralScore) - Math.abs(a.score - neutralScore))
        .map(item => item.detail);
      return { ...area, score, text, details };
    });
    const score = Math.round(areas.reduce((total, area) => total + area.score, 0) / areas.length);
    const easiest = areas.reduce((a, b) => a.score >= b.score ? a : b);
    const hardest = areas.reduce((a, b) => a.score <= b.score ? a : b);
    const headline = easiest.score - hardest.score >= 5
      ? `${easiest.strengthHeadline}，${hardest.frictionHeadline}` : '可以先聊聊彼此想怎麼相處';
    const readings = areas.map(({ id, title, score, text, details }) => ({ id, title, score, text, details }));
    return { score, areas: readings, headline, conclusion: hardest.action };
  }

  window.MoonveilZodiacSynastry = { compare };
})();
