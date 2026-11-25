(() => {
  'use strict';

  const signs = {
    aries: {
      approach: '做一個小嘗試，邊做邊調整',
      sun: '重視自主和勇氣，喜歡靠自己的行動開出一條路。能從零開始、親手試出結果的挑戰，特別容易點燃你的興趣。',
      moon: '情緒來得快也直接，往往很快就知道自己是開心還是不耐煩。有一點能自己決定和行動的空間，心裡比較自在。',
      ascendant: '剛認識你的人常覺得你乾脆、行動快。到了陌生場合，你也可能是先打招呼、率先讓事情動起來的那個人。'
    },
    taurus: {
      approach: '把步調放穩，先確定什麼能長久維持',
      sun: '重視穩定、有品質的生活，願意花時間把看重的東西做紮實。能長期累積的成果，容易帶來踏實的成就感。',
      moon: '熟悉的節奏、舒服的空間和說到做到的人，容易帶來安全感。碰到臨時變動，心情可能需要一點時間跟上。',
      ascendant: '初見常給人沉穩、從容的印象。走進新環境時，通常會先觀察周圍、熟悉節奏，等自在一點才慢慢加入。'
    },
    gemini: {
      approach: '先把疑問說清楚，再交換各自掌握的資訊',
      sun: '好奇心常帶著你往前走。你喜歡弄懂新東西，也享受把不同領域的線索連起來，發現原本沒想到的關聯。',
      moon: '念頭常轉得很快，聊著聊著才弄清楚自己在意什麼。身邊有人能自在地交換想法，心裡也會比較安定。',
      ascendant: '剛認識時常讓人覺得機靈、好聊。你容易從一個小問題接起話題，也很快能跟上不同人的聊天節奏。'
    },
    cancer: {
      approach: '留意自己和身邊的人各需要什麼，再安排下一步',
      sun: '重視歸屬感，喜歡照顧重要的人，也願意花心力維護在乎的生活。讓彼此有個能安心回去的地方，常讓你覺得有意義。',
      moon: '對氣氛和別人的語氣很有感，熟悉的人也容易牽動你的情緒。感受到被惦記、有人願意陪著，心裡就能慢慢安定。',
      ascendant: '初見可能顯得親切又有點慢熟。遇到新面孔，你通常會先留意現場的氣氛，再選一個自己覺得舒服的方式加入。'
    },
    leo: {
      approach: '把你在意的部分說出來，也讓其他人有參與的空間',
      sun: '重視創造力和真誠的自我表達，喜歡把熱情變成自己的作品。當用心的地方被人看見，往往更想繼續投入。',
      moon: '開心或失落常容易寫在臉上，也在意親近的人有沒有看見自己的用心。被明確肯定、被放在心上，會讓你踏實一些。',
      ascendant: '初見常讓人感覺大方、有存在感。場面還有點拘謹時，你容易先說起一件有意思的事，把氣氛帶得熱絡一點。'
    },
    virgo: {
      approach: '拆成幾個能檢查的步驟，先做最有差別的一步',
      sun: '重視做事有條理，也在乎成果能不能真的幫上忙。把原本麻煩的事情整理得好懂、好用，常能帶來成就感。',
      moon: '遇到混亂時，心裡容易惦記還沒處理完的細節。知道問題出在哪裡，日常也有可以預期的秩序，通常比較能放鬆。',
      ascendant: '剛見面通常讓人覺得細心、務實。面對不熟的事，你容易先弄懂細節和做法，也常看見還沒有人處理的小地方。'
    },
    libra: {
      approach: '聽完各方的需要，再把自己的底線也說清楚',
      sun: '重視公平和彼此尊重，相信不同立場的人也能找到一起做事的方式。能顧及彼此的安排，往往更值得你投入。',
      moon: '關係的氣氛容易牽動心情，遇到冷戰或僵持時特別難放鬆。彼此都能開口、意見被公平對待，會讓你比較安心。',
      ascendant: '初見常給人客氣、好商量的印象。意見不一時，你很自然地先聽完各方的話，再找大家都能接得住的說法。'
    },
    scorpio: {
      approach: '先弄清楚真正卡住的地方，用具體行動慢慢建立信任',
      sun: '重視深度與信任，容易對別人略過的原因多問一層。對真正看重的人或事，你往往願意花很久的時間去了解。',
      moon: '感受往往很深，信任慢慢建立後，才比較容易說出脆弱的一面。知道對方會替你保密、答應的事也會做到，心裡比較安定。',
      ascendant: '初見可能顯得安靜、眼神專注，讓人覺得你在觀察。剛認識時通常話不多，熟了才慢慢讓人知道你在想什麼。'
    },
    sagittarius: {
      approach: '試一種沒走過的做法，再把結果帶回眼前的事',
      sun: '重視自由與探索，對遠方的見聞和不熟悉的觀點特別有興趣。能親自體驗、把世界看得更寬的事，常讓你願意投入。',
      moon: '心情悶住時，常會想換個環境，或從別的角度重新看一遍。知道還有選擇、有空間按自己的興趣走，心裡比較自在。',
      ascendant: '初見容易讓人覺得爽快、開朗。到了新地方，你常會直接問起沒見過的事，很自然就聊到不同人的生活與見聞。'
    },
    capricorn: {
      approach: '定出一個清楚的里程碑，再分配自己負擔得起的時間',
      sun: '重視責任和可以一步步做到的目標。花時間把一門本事練紮實，或讓長期的努力有了成果，常讓你感到自豪。',
      moon: '有壓力時往往先把事情扛住，等到獨處才察覺自己有多累。責任分得清楚、身邊的人可靠，通常比較能安心休息。',
      ascendant: '初見常給人認真、可靠的印象。接到陌生任務時，你容易先弄清楚時間和責任，讓人覺得你做事有準備。'
    },
    aquarius: {
      approach: '退一步看看整個流程，再小規模試一個新方法',
      sun: '重視獨立思考，對習以為常的規則也會提出疑問。能試新做法、讓更多人有選擇的事，常能吸引你投入。',
      moon: '情緒上來時，通常要有一點自己的空間，想通了才容易開口。就算關係很親近，彼此能保有各自的步調也很重要。',
      ascendant: '初見容易讓人覺得你有自己的想法。大家順著同一種方式討論時，你常會從意料之外的角度提個問題。'
    },
    pisces: {
      approach: '留一點時間整理感受，再挑一件具體做得到的事',
      sun: '重視想像力和人與人之間的感受。能透過故事、音樂或陪伴，把心裡難說明的東西傳給別人，常讓你覺得有意義。',
      moon: '別人的情緒和周圍氣氛容易留在心裡。有時要等安靜下來，才比較知道自己是什麼感受，溫柔的陪伴也容易帶來安定感。',
      ascendant: '初見容易給人溫和、好親近的印象。到了陌生場合，你常先聽大家的語氣、感受氣氛，再自然地接上對方的話。'
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
