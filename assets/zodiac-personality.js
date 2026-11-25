(() => {
  'use strict';

  const signs = {
    aries: {
      element: 'fire', face: '很快站出來', entrance: '有件事需要人開頭時，你可能很快就會說「我先試試看」',
      move: '先問什麼時候能開始', motive: '能讓你自己做主、親手試出一個方向的事',
      check: '想好哪一小步可以現在就做', need: '留一點自己能做主的空間',
      comfort: '能自己決定一件小事，往往比聽更多建議更能讓你定下來',
      reset: '給自己一件可以直接動手的小事，可能比立刻把長期安排談完來得自在'
    },
    taurus: {
      element: 'earth', face: '照自己的步調來', entrance: '剛到不熟悉的地方，你可能會先看看大家照什麼步調做事，再慢慢加入',
      move: '先確認要花多少時間和力氣', motive: '可以慢慢做出品質、之後還用得上的成果',
      check: '確認時間和支出能不能持續', need: '知道接下來大致怎麼走',
      comfort: '行程有個底、手邊有可以做熟的事，比較能讓你放心',
      reset: '等時間和費用有了大致範圍，再答應可能會舒服一點'
    },
    gemini: {
      element: 'air', face: '很快找到話題', entrance: '就算彼此還不熟，你也可能用一個問題讓大家聊起來',
      move: '順口問幾個細節', motive: '有新東西可學、能把分散的線索串成一個想法的事',
      check: '比較手邊幾個做法各能帶來什麼', need: '有個能交換想法的人',
      comfort: '能把腦中反覆打轉的事講一遍，你往往就會比較清楚自己的感受',
      reset: '和信任的人聊過一次，你可能就知道自己接下來想往哪裡走'
    },
    cancer: {
      element: 'water', face: '先照看現場的氣氛', entrance: '剛認識一群人時，你也許先留意誰還插不上話，找個自然的機會讓對方加入',
      move: '先留意這個安排會影響到誰', motive: '能照顧重要的人，也能讓自己的生活更安定的事',
      check: '想想這個安排對彼此的生活有什麼影響', need: '有個能放心說累的人',
      comfort: '有人記得你的習慣，或願意聽你把感受說完，會比匆匆找答案更讓你安心',
      reset: '等能和一個熟悉的人好好聊過，你可能更有餘裕回來做決定'
    },
    leo: {
      element: 'fire', face: '讓場面熱起來', entrance: '大家還有點拘謹時，你可能先分享一件開心的事，讓其他人也有話可接',
      move: '先把自己有興趣的部分說出來', motive: '能投入自己的點子、做出來後也有人看得懂的事',
      check: '想想能不能把自己有熱情的部分做出來', need: '讓在意的人看懂你的用心',
      comfort: '有人願意指出他看見了你哪一份努力，比一句籠統的肯定更容易讓你感到被理解',
      reset: '身邊有人願意先聽你說明自己為什麼在乎，你會更容易把話講完整'
    },
    virgo: {
      element: 'earth', face: '先把事情理清楚', entrance: '接到一件新事，你可能會先問清楚怎麼做，然後主動處理一個別人還沒顧到的細節',
      move: '先問最容易弄錯的是哪一步', motive: '能讓原本難做的事變得清楚、順手的實際改進',
      check: '看看哪一步整理過後最能省力', need: '知道眼前能先處理哪一件事',
      comfort: '把滿腦子的事寫下來，手上只留一件能完成的小事，比較有餘裕聽自己真正需要什麼',
      reset: '先把眼前能做的事排成幾行，可以讓你更踏實地回應這個提議'
    },
    libra: {
      element: 'air', face: '替不同的人留個位置', entrance: '意見一多，你可能會先讓大家把話說完，再把彼此都在意的部分整理出來',
      move: '先聽聽其他人有什麼考量', motive: '彼此都有發言空間，之後也能一起做得下去的安排',
      check: '看看誰需要配合，自己能接受到哪裡', need: '有一場彼此都聽得進去的對話',
      comfort: '能好好說出不同意的地方，還能繼續一起談下去，往往會讓你放鬆不少',
      reset: '替自己的意見留一個明確的位置，再答覆會比較踏實'
    },
    scorpio: {
      element: 'water', face: '先觀察再靠近', entrance: '和不熟的人相處時，你可能先留意別人答應的事有沒有做到，等信任多一點才說自己的想法',
      move: '先聽清楚對方真正想改的是什麼', motive: '值得深入做，而且真能改變現況的事',
      check: '把已經知道的事和還要確認的地方分清楚', need: '慢慢確認對方的話能不能信',
      comfort: '小約定一次次做到了，你會更有把握，願意把真正在意的事說出來',
      reset: '等關鍵的承諾說清楚，再讓對方知道你願意投入到哪裡，可能會更自在'
    },
    sagittarius: {
      element: 'fire', face: '把話題帶去新地方', entrance: '身邊有人提到不熟悉的東西，你可能會順勢追問，讓聊天多出一個意外有趣的方向',
      move: '先問有沒有沒試過的做法', motive: '能帶你認識另一種想法，還有機會親自走一趟的事',
      check: '看看這件事能不能讓你學到原本想不到的東西', need: '保有換個方向的餘地',
      comfort: '知道自己還能換個角度，或暫時離開原地喘口氣，往往比較容易想開',
      reset: '替行程保留一點可以改動的空間，會讓這個選擇容易許多'
    },
    capricorn: {
      element: 'earth', face: '先確認怎麼把事做成', entrance: '有新任務出現時，你可能先弄清楚誰負責什麼，讓人很快知道可以找你處理哪一段',
      move: '先確認有哪些責任和期限', motive: '能一步步練到手、往後用得上的本事',
      check: '想清楚這件事能讓自己練到哪一項本事', need: '確定責任有個邊界',
      comfort: '知道哪些事歸自己、哪些可以交回給別人，你才比較有餘裕休息',
      reset: '明白自己能在哪裡停下來，可能比一口氣把事情全接下來更自在'
    },
    aquarius: {
      element: 'air', face: '率先提一種別的做法', entrance: '大家都順著同一套方法討論時，你可能會問一句「有沒有另一種做法」',
      move: '先問這件事能不能用另一種方式做', motive: '能改掉一個不方便的規則，讓做法有更多選擇的事',
      check: '看看能不能保留一點自己做實驗的空間', need: '留一點時間自己想通',
      comfort: '如果能用自己的方式參與，想清楚再開口，你可能更願意說出自己真正的想法',
      reset: '把想法先理過一遍，再回去跟大家聊，通常會自在一點'
    },
    pisces: {
      element: 'water', face: '順著別人的感受接話', entrance: '剛進入一個新環境，你可能先聽大家的語氣和反應，等知道怎麼接近再開口',
      move: '先感受一下大家對這個提議的反應', motive: '能把心裡模糊的感受做成有人聽得懂的東西',
      check: '看看能不能把心裡想到的畫面做出個雛形', need: '留個安靜的角落把感受理清',
      comfort: '暫時從很多聲音裡退開，你比較能分辨哪個感受是自己的',
      reset: '給自己一段安靜的時間，你可能比較知道哪一部分是真心想答應的'
    }
  };

  const houses = {
    1: { context: '嘗試新角色時', scene: '有人第一次邀你加入一個活動' },
    2: { context: '分配金錢或手上的資源時', scene: '有人問你要不要一起買一件會用很久的東西' },
    3: { context: '學新東西或跟人交換消息時', scene: '群組裡臨時需要有人把一件事說清楚' },
    4: { context: '和家人相處或安排私下的生活時', scene: '家人想改掉原先談好的週末安排' },
    5: { context: '做自己有興趣的事時', scene: '朋友問你要不要一起做個想了很久的小作品' },
    6: { context: '安排日常或分配工作時', scene: '一起生活或工作的人想重分每天都要做的事' },
    7: { context: '和親近的人或搭檔一起做決定時', scene: '伴侶或搭檔想和你談下一步怎麼合作' },
    8: { context: '決定要跟別人分享多少、一起負擔多少時', scene: '有人提議和你共同負擔一筆開銷' },
    9: { context: '碰到進修或接觸新觀點的機會時', scene: '朋友揪你一起報名一門課' },
    10: { context: '選擇工作方向或承擔責任時', scene: '工作上有人問你要不要接一個新任務' },
    11: { context: '跟朋友相處或一起做事時', scene: '群組裡有人在揪團做一個小計畫' },
    12: { context: '獨處或想把思緒理一理時', scene: '有人想約你，把你原本空下的晚上也排進行程' }
  };

  const general = { context: '遇到要做決定的事時', scene: '有人突然找你談一個新安排' };
  const outwardElements = new Set(['fire', 'air']);

  function differentPace(left, right) {
    return outwardElements.has(left.element) !== outwardElements.has(right.element);
  }

  function describe(chart) {
    const sunPoint = chart?.planets?.find(point => point.id === 'Sun');
    const moonPoint = chart?.planets?.find(point => point.id === 'Moon');
    const rising = signs[chart?.ascendant?.signId];
    const sun = signs[sunPoint?.signId];
    const moon = signs[moonPoint?.signId];
    if (!rising || !sun || !moon) return null;

    const sunHouse = houses[sunPoint.house] ?? general;
    const moonHouse = houses[moonPoint.house] ?? general;
    const innerContrast = differentPace(rising, moon);
    const headline = `你可能${rising.face}，${innerContrast ? '心裡卻想' : '也想'}${moon.need}`;

    const motive = differentPace(rising, sun)
      ? `你更願意把時間留給${sun.motive}`
      : `最吸引你的往往是${sun.motive}`;

    const innerContext = outwardElements.has(rising.element)
      ? '即使當下很快就能跟上大家的節奏，你也可能要等熟悉一些，才說得出那一刻真正的感受。'
      : '一開始話少的時候，心裡可能已經有很多想法，熟悉之後才會慢慢讓人知道。';

    return {
      headline,
      firstImpression: `${rising.entrance}。${sunHouse.context}，${motive}。`,
      innerLife: `${moonHouse.context}，${moon.comfort}。${innerContrast ? innerContext : ''}`,
      everydayScene: `像是${sunHouse.scene}。你可能${rising.move}，再${sun.check}。${moon.reset}。`
    };
  }

  window.MoonveilPersonality = { describe };
})();
