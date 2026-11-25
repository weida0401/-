(() => {
  'use strict';

  const signs = {
    aries: {
      approach: '做一個小嘗試，邊做邊調整',
      sun: '把你想做的事縮成一次小嘗試，做過就更容易看出自己想往哪裡走。',
      moon: '心裡著急時，先走動一下或完成一件小事，等情緒緩下來再回應。',
      ascendant: '進入新場合時，可以先用一句話說明來意，接著聽聽別人的安排。'
    },
    taurus: {
      approach: '把步調放穩，先確定什麼能長久維持',
      sun: '用手上看得見的成果確認方向，把時間留給你還願意持續做的事。',
      moon: '忙亂時，先把一件熟悉的事做完。吃頓飯或散個步，都能幫你慢慢回到自己的步調。',
      ascendant: '到了新地方，先熟悉空間和流程。把準備時間說清楚，別人也更容易配合。'
    },
    gemini: {
      approach: '先把疑問說清楚，再交換各自掌握的資訊',
      sun: '順著好奇心多看幾種做法，再選一個值得多追問的方向做下去。',
      moon: '想法在腦中打轉時，把在意的事寫成兩句話，或找一個信任的人講一遍。',
      ascendant: '在陌生場合，用一個具體的問題開場，順著對方的回答聊下去。'
    },
    cancer: {
      approach: '留意自己和身邊的人各需要什麼，再安排下一步',
      sun: '有意義的事常跟你想照顧的人或想維護的生活有關。把這個理由寫進你的目標。',
      moon: '替自己準備一段可以安靜下來的時間。需要陪伴時，可以直接說出希望對方怎麼陪你。',
      ascendant: '進入新環境時，先認識一個容易開口的人，給彼此一點時間熟悉。'
    },
    leo: {
      approach: '把你在意的部分說出來，也讓其他人有參與的空間',
      sun: '找一種能把想法做給人看的方式，分享成品時也說出你最享受的部分。',
      moon: '想被理解時，可以指出希望對方看見的那份努力。清楚的回應比泛泛的鼓勵更容易接得住。',
      ascendant: '與新朋友見面時，分享一件你有熱情的事，再給對方一個說自己故事的機會。'
    },
    virgo: {
      approach: '拆成幾個能檢查的步驟，先做最有差別的一步',
      sun: '從最想改善的細節挑一項著手，做出能省下時間或力氣的成果。',
      moon: '事情一多時，把眼前要處理的事寫下來，先收尾一項，再留時間休息。',
      ascendant: '加入新團隊時，先問清楚期待，再從一項明確的工作開始。'
    },
    libra: {
      approach: '聽完各方的需要，再把自己的底線也說清楚',
      sun: '比較幾個方向後，寫下你最重視的條件。留意有哪個選項最能兼顧它和長期合作。',
      moon: '相處氣氛緊繃時，可以先讓自己喘口氣，整理好感受後再說出想怎麼談。',
      ascendant: '初次合作時，可以先聽各方的想法，再明白說出自己能配合的範圍。'
    },
    scorpio: {
      approach: '先弄清楚真正卡住的地方，用具體行動慢慢建立信任',
      sun: '挑一件你願意深入做的事，定期用看得到的進展確認投入是否值得。',
      moon: '感受很強時，先用幾行筆記把發生的事和自己的推測分開，再挑能說的部分分享。',
      ascendant: '在新場合可以先觀察實際的做法，再決定想加入哪一段，從小承諾開始。'
    },
    sagittarius: {
      approach: '試一種沒走過的做法，再把結果帶回眼前的事',
      sun: '挑一個能拓寬視野的題目給自己試一週，確認你想持續學下去的理由。',
      moon: '心裡悶住時，換個地方走走或找一種新觀點，回來再說明事情為什麼讓你在意。',
      ascendant: '認識新朋友時，可以從最近學到或體驗的一件事聊起，也聽聽對方有什麼不同的經驗。'
    },
    capricorn: {
      approach: '定出一個清楚的里程碑，再分配自己負擔得起的時間',
      sun: '挑一個你願意花時間累積的目標，替這個月訂一個看得出進展的小里程碑。',
      moon: '壓力上來時，先把責任和休息都排進行程。有些事可以請別人一起分擔。',
      ascendant: '接手新工作時，先問清楚責任範圍和期限，再用一項小成果建立合作默契。'
    },
    aquarius: {
      approach: '退一步看看整個流程，再小規模試一個新方法',
      sun: '把你想改進的規則變成一個可以實測的小方案，再用結果邀請別人給意見。',
      moon: '事情一下湧上來時，留一段自己的時間把思緒整理好，再告訴對方你何時能繼續談。',
      ascendant: '找到一個共同興趣作為開場，提出新方法時可以附上一個大家能一起試的小例子。'
    },
    pisces: {
      approach: '留一點時間整理感受，再挑一件具體做得到的事',
      sun: '把腦中的畫面做成能分享的草稿、音訊或生活安排，找一個人聽聽看。',
      moon: '情緒太多時，先離開吵雜的地方休息一下，過後再分清楚哪些感受和自己有關。',
      ascendant: '在新環境可以先感受氣氛，再明白說出自己想加入什麼、能提供多少時間。'
    }
  };

  const houses = {
    1: { topic: '自我表達和第一步', nextStep: '下次接手一件新事，用一句話說明你想怎麼參與，然後完成一個能當天交出的部分。' },
    2: { topic: '金錢與手上的資源', nextStep: '把一筆常有的開銷或一項常用的資源記下來，替它訂出你能長期負擔的上限。' },
    3: { topic: '溝通與短期學習', nextStep: '把一件容易誤會的事寫成三行，分別說明現況、要確認的資訊和下一次回覆時間。' },
    4: { topic: '家庭與私人生活', nextStep: '先固定一段只留給自己或家人的時間，有共用空間或時間上的需求就直接說清楚。' },
    5: { topic: '創作與樂趣', nextStep: '替一件只因為喜歡才想做的事留半小時，做出一個自己看得見的小成果。' },
    6: { topic: '日常分工與習慣', nextStep: '找一項每週總會重做的任務，改掉最容易卡住的那一步，試行一週再比較。' },
    7: { topic: '伴侶或合作中的相處', nextStep: '和一位重要的對象確認彼此各答應做什麼，說清楚有變動時要怎麼通知。' },
    8: { topic: '親密感與共用資源', nextStep: '如果正和別人共用一筆開支或承擔同一件事，把各自負責的部分寫下來確認一次。' },
    9: { topic: '進修與拓展視野', nextStep: '挑一個想更懂的題目，找一個可靠來源或一次實地體驗，再用自己的話記下新發現。' },
    10: { topic: '工作方向與對外責任', nextStep: '把一項想發展的專長做成一個可展示的成果，並定下要和誰分享、什麼時候分享。' },
    11: { topic: '朋友與團隊合作', nextStep: '選一個想繼續參與的團隊，主動認領一件範圍和期限都清楚的小事。' },
    12: { topic: '獨處與整理思緒', nextStep: '一週留兩次不被打擾的短時段，寫下哪件事持續消耗心力、哪一種休息真的有幫助。' }
  };

  const planets = {
    sun: { rank: 1, when: '找自己想投入的方向', focus: '真正願意投入的方向' },
    moon: { rank: 2, when: '需要安頓情緒', focus: '讓自己安心的條件' },
    mercury: { rank: 3, when: '想把複雜的事說清楚', focus: '資訊怎麼確認和傳達' },
    venus: { rank: 4, when: '想釐清自己在乎什麼', focus: '彼此看重的事' },
    mars: { rank: 5, when: '想把一件重要的事往前推', focus: '能主動推進的部分' },
    saturn: { rank: 6, when: '評估能長期承擔的責任', focus: '能長期負擔的承諾' },
    jupiter: { rank: 7, when: '想把手上的機會延伸出去', focus: '能累積的新經驗' },
    uranus: { rank: 8, when: '想替舊做法找新出路', focus: '值得試試的新做法' },
    neptune: { rank: 9, when: '需要分辨想像和已經確認的事', focus: '想像與現況的差距' },
    pluto: { rank: 10, when: '想改掉反覆出現的舊習慣', focus: '重複出現的問題' }
  };

  const quadrants = [
    {
      number: 1, title: '自我與基本功', angle: 'ascendant', label: '上升',
      topic: '走進新環境、開始一件事或建立自己的基本功',
      nextStep: '挑一個想熟悉的新環境，先找出一個今天能完成的小任務。'
    },
    {
      number: 2, title: '生活根基與日常', angle: 'imumCoeli', label: '天底',
      topic: '讓私人生活和日常步調更安定',
      nextStep: '選出一件想保留的放鬆活動，先在這週的行程裡替它留兩個固定時段。'
    },
    {
      number: 3, title: '關係與視野', angle: 'descendant', label: '下降',
      topic: '和別人密切合作、接觸不同的做法',
      nextStep: '找一位經常合作的人，說清楚你現在最需要哪一種協助，也確認對方的需要。'
    },
    {
      number: 4, title: '志業與社群', angle: 'midheaven', label: '天頂',
      topic: '找到想在團隊或工作中貢獻的位置',
      nextStep: '寫下一件你希望被團隊記得的貢獻，把它變成這個月交得出來的小成果。'
    }
  ];

  const angleFocus = {
    aries: '找一件可以由自己發起的事',
    taurus: '挑出最值得留住的安排，替它留固定的時間',
    gemini: '列出還想知道的事，找一個人交換線索',
    cancer: '確定在哪裡可以安心休息，有需要時可以找誰',
    leo: '找出自己願意出力的部分，再約人一起做',
    virgo: '整理一件最近最常卡住的小事',
    libra: '把彼此都能接受的做法說清楚',
    scorpio: '決定什麼可以分享，什麼想留給自己',
    sagittarius: '留出一段能接觸新經驗的時間',
    capricorn: '分清眼前該承擔的事和還可以等的事',
    aquarius: '找一個能容納不同做法的安排',
    pisces: '留一點安靜的空間，看看什麼讓你放鬆'
  };

  function describeKey(point, kind = point?.id) {
    const label = kind?.toLowerCase();
    const key = label === 'asc' ? 'ascendant' : label;
    const guide = signs[point?.signId];
    return ['sun', 'moon', 'ascendant'].includes(key) ? guide?.[key] ?? '' : '';
  }

  function placementDetails(point) {
    return { point, house: houses[point.house], theme: planets[point.id?.toLowerCase()] };
  }

  function describePlacements(lead, alternate) {
    const { point, house, theme } = lead;
    const approach = signs[point.signId]?.approach;
    let summary = `${point.name}在${point.signName}第 ${point.house} 宮，${house.topic}是這一區的重點。`;
    if (approach) summary += `${theme.when}時，可以${approach}。`;
    if (alternate?.point.house === point.house) {
      summary += `同一宮的${alternate.point.name}也讓${alternate.theme.focus}值得留意。`;
    } else if (alternate) {
      summary += `第 ${alternate.point.house} 宮的${alternate.point.name}也把注意力帶到${alternate.house.topic}。`;
    }
    return { summary, nextStep: house.nextStep };
  }

  function describeAngle(zone, angle) {
    const focus = angleFocus[angle?.signId];
    const summary = focus && angle.signName
      ? `${zone.label}落在${angle.signName}。想${zone.topic}時，可以先${focus}。`
      : `這個象限的生活主題是${zone.topic}。`;
    return { summary, nextStep: zone.nextStep };
  }

  function summarize(chart) {
    return quadrants.map(zone => {
      const group = chart.quadrants.find(group => group.number === zone.number);
      const placements = (group?.planets ?? []).map(placementDetails)
        .filter(entry => entry.house && entry.theme)
        .sort((left, right) => left.theme.rank - right.theme.rank);
      const [lead, ...others] = placements;
      const alternate = lead && (others.find(entry => entry.point.house !== lead.point.house) ?? others[0]);
      return {
        number: zone.number,
        title: zone.title,
        ...(lead ? describePlacements(lead, alternate) : describeAngle(zone, chart[zone.angle]))
      };
    });
  }

  window.MoonveilNatalReading = { summarize, describeKey };
})();
