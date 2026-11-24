(() => {
  'use strict';

  const signGuides = {
    aries: {
      name: '牡羊座',
      headlines: {
        focus: '先把力氣放在第一步',
        support: '讓一個想法先跑起來',
        challenge: '放慢一拍，再挑一件能做完的事',
        quiet: '用一個小行動試出方向'
      },
      anchor: '先試一小段，再用實際結果找出下一步。',
      relationships: '急著給答案時，先讓對方把想法說完。用一句話確認你聽到的意思。',
      work: '把最想推進的任務拆出可交付的第一步，先完成那一段。',
      daily: '留十分鐘，把一件卡住的事做到能接著做的程度。',
      weekly: '週初排出一個小試做的時段，週末用實際回饋決定要擴大還是縮小。'
    },
    taurus: {
      name: '金牛座',
      headlines: {
        focus: '把時間留給能長久維持的事',
        support: '穩定的步調能帶來進展',
        challenge: '先確認資源，再承諾更多',
        quiet: '把日常的節奏調順一點'
      },
      anchor: '時間、費用和體力都算進來，才知道這個安排能不能長久。',
      relationships: '需要準備時間時直接說明。約定一件彼此都能做到的小事，有助於累積信任。',
      work: '先核對手上的資源，再訂下能做到的品質標準和完成時間。',
      daily: '整理今天的一筆花費或一段耗時流程，找出一個可固定省下的成本。',
      weekly: '挑一個每週固定的流程，先試做兩次，留下最省力的一段。'
    },
    gemini: {
      name: '雙子座',
      headlines: {
        focus: '先弄清楚一個真正重要的問題',
        support: '用新線索打開對話',
        challenge: '把訊息讀清楚再回覆',
        quiet: '把分散的線索整理成一句話'
      },
      anchor: '如果手上同時有好幾個想法，先挑一個能查到答案的問題。',
      relationships: '先接住對方目前在意的話題。想確認理解時，可以回問自己聽到的重點對不對。',
      work: '選最關鍵的一條資訊查證，把結論濃縮成同事能立刻接手的一句話。',
      daily: '從待查清單選一項，找完資料後寫下最有用的一條結論。',
      weekly: '把資料整理和決策分成兩個時段，收完關鍵資訊後留一天重新核對。'
    },
    cancer: {
      name: '巨蟹座',
      headlines: {
        focus: '照顧自己的需要，再照顧安排',
        support: '從熟悉的人與事找回力氣',
        challenge: '先替自己留一點空間',
        quiet: '把容易消耗你的細節整理好'
      },
      anchor: '相處和工作都可以安排緩衝，讓你有餘力回應真正重要的事。',
      relationships: '想照顧對方的同時，也把自己的需要說成一個具體請求，讓彼此都有選擇。',
      work: '替容易被打斷的任務留一段安靜時間，完成後再處理即時訊息。',
      daily: '把一個不急的邀約或雜事延後，留二十分鐘做能讓你恢復精神的事。',
      weekly: '標出本週最耗力的時段，在前後各留一小段可以自由使用的時間。'
    },
    leo: {
      name: '獅子座',
      headlines: {
        focus: '把值得分享的成果說清楚',
        support: '讓好點子得到具體的回饋',
        challenge: '先釐清期待，再把力氣投進去',
        quiet: '把注意力留給正在做的事'
      },
      anchor: '把希望被看見的努力講具體，別人更容易提供你需要的回饋。',
      relationships: '用一件具體的小事表達欣賞。希望被理解時，也可以明說你想得到哪種回應。',
      work: '準備一個能呈現成果的例子，再提出一個你最想聽到回饋的問題。',
      daily: '挑一個進展簡短分享給相關的人，順手說出誰幫你把它做成。',
      weekly: '選一個可以讓團隊試看的成果，週中展示，週末依回饋修正一處。'
    },
    virgo: {
      name: '處女座',
      headlines: {
        focus: '把最關鍵的細節整理好',
        support: '一個小修正就能省下工夫',
        challenge: '先抓住主線，別把每件事都重做',
        quiet: '從最常出錯的一步改善'
      },
      anchor: '先分出必須修正和可以暫放的細節，進度會更容易掌握。',
      relationships: '想幫忙之前，先確認對方需要聽你給建議，還是只需要好好說完。',
      work: '挑一個最容易出錯的步驟加上檢查點，先測試能不能減少重工。',
      daily: '替一件常做的事寫下三步檢查順序，今天先照做一次。',
      weekly: '這週只調整一個流程，週末比對改動前後花的時間或出錯次數。'
    },
    libra: {
      name: '天秤座',
      headlines: {
        focus: '先說清楚你在意的條件',
        support: '替雙方找一個都能接受的做法',
        challenge: '把妥協的範圍先講明白',
        quiet: '選一個標準，讓選項收斂一點'
      },
      anchor: '把每一方的需要說明白，協調時才知道哪些地方可以調整。',
      relationships: '可以先承認對方的考量，再說出自己能接受的範圍，讓交換條件清楚。',
      work: '用同一個條件比較需要決定的方案，替討論定下一個明確的完成時間。',
      daily: '把猶豫的兩個選項寫下來，只比較一個最重要的條件。',
      weekly: '需要多人決定的事，先收齊各方的優先項目，再約時間敲定一個可試的方案。'
    },
    scorpio: {
      name: '天蠍座',
      headlines: {
        focus: '先查清楚真正影響結果的線索',
        support: '把深入的觀察用在關鍵問題上',
        challenge: '核對證據，再回應心裡的疑慮',
        quiet: '替正在在意的事找一項可核對的資訊'
      },
      anchor: '把看見的線索和心裡的推測分開，更容易用對力氣。',
      relationships: '有疑慮時先描述具體發生的事情，再用一句簡短的問句確認對方的想法。',
      work: '保留專注力給資訊缺口最大的地方，先核對能改變判斷的一項證據。',
      daily: '把一件最掛心的事拆成一項事實和一項猜測，只查證後者一次。',
      weekly: '先列好要查證的線索，挑一項本週能確認的，保留其餘尚未定論的部分。'
    },
    sagittarius: {
      name: '射手座',
      headlines: {
        focus: '挑一個新方向先試一次',
        support: '把想學的事帶進日常',
        challenge: '先看看空間有多少，再排新計畫',
        quiet: '替好奇心留下一個可完成的小任務'
      },
      anchor: '替新點子安排一次短期體驗，做完再記下你願意繼續投入的理由。',
      relationships: '想保留自己的時間時，先把可一起安排的時段說清楚。',
      work: '選一個卡住的步驟換方法試做，保留原流程當對照。',
      daily: '挑一件一直想接觸的小事，用半小時完成第一次體驗。',
      weekly: '只替一個新方向排定約一小時的時段，做完再決定下週要不要續試。'
    },
    capricorn: {
      name: '摩羯座',
      headlines: {
        focus: '把要承擔的責任和期限講清楚',
        support: '用一個可交付的里程碑穩住進度',
        challenge: '先調整排程，給重要的事留空間',
        quiet: '把長期目標縮到這一步'
      },
      anchor: '把目標拆到能核對的程度，較容易看出進度和要調整的地方。',
      relationships: '持續做到小承諾，也可以用簡單的句子說出最近的感受，讓對方知道你在忙什麼。',
      work: '先確認分工和期限，替最可能延誤的一步留一點緩衝。',
      daily: '從最重要的目標寫下一件今天交得出去的成果，先完成它。',
      weekly: '把主要目標分成兩段，每段寫清楚完成條件，保留一次可重排的時段。'
    },
    aquarius: {
      name: '水瓶座',
      headlines: {
        focus: '把不同的做法整理成能試的方案',
        support: '有空間試一次新的安排',
        challenge: '新做法先核對使用的人和條件',
        quiet: '從一個平常不順的流程下手'
      },
      anchor: '用小規模結果說明想法，較容易讓相關的人一起調整。',
      relationships: '需要獨處或改變安排時先交代清楚，也留一個對方可以回應的選項。',
      work: '替新想法設一個跟原做法相同的測量標準，先試一次再比較。',
      daily: '改一個不順手的小步驟，用同樣的任務觀察改動前後差異。',
      weekly: '替想改的流程安排一段短期測試，週末依使用者的回饋留下有效的部分。'
    },
    pisces: {
      name: '雙魚座',
      headlines: {
        focus: '把感受說成一件能照顧的事',
        support: '替靈感留一段安靜的時間',
        challenge: '先照顧界線，再安排行程',
        quiet: '留一點空檔整理感受'
      },
      anchor: '把實際發生的事、當下的感受和接下來能做的事分開寫。',
      relationships: '聽完別人的感受，也讓對方知道你目前能幫到哪一步，給彼此留空間。',
      work: '把突然想出的做法寫成一個能在短時間內交付的小版本。',
      daily: '花十分鐘記下最明顯的感受，安排一件今天做得到的照顧。',
      weekly: '劃出一段完整的安靜時段整理想法，然後只選一個最想完成的小作品或待辦。'
    }
  };

  const planetGuides = {
    Sun: {
      name: '太陽',
      focus: '先說清楚這段時間最重要的目標，讓安排有依據。',
      support: '已有清楚方向的事，可以向相關的人說明下一步。',
      challenge: '目標互相拉扯時，先排優先順序再承諾。',
      area: 'work'
    },
    Moon: {
      name: '月亮',
      focus: '把最明顯的感受說成一個具體的需要。',
      support: '適合安排讓自己或對方安穩一點的小事。',
      challenge: '反應很強時，先留一點時間再回覆。',
      area: 'relationships'
    },
    Mercury: {
      name: '水星',
      focus: '先整理訊息，再用一句話說明現在需要確認什麼。',
      support: '適合把進度、問題或安排寫成雙方都能核對的文字。',
      challenge: '回覆之前先核對日期、數字和彼此對重點的理解。',
      area: 'work'
    },
    Venus: {
      name: '金星',
      focus: '優先確認相處中想維持的步調和界線。',
      support: '用簡短的邀約或具體的肯定，讓對方知道你的心意。',
      challenge: '期待出現落差時，先說清楚彼此各自想要的安排。',
      area: 'relationships'
    },
    Mars: {
      name: '火星',
      focus: '先把力氣放在一個能看見結果的動作上。',
      support: '適合替已經準備好的事排出第一段執行時間。',
      challenge: '有急著往前的感覺時，先核對期限和現在能承擔多少。',
      area: 'work'
    },
    Jupiter: {
      name: '木星',
      focus: '比較手上的機會，挑一個最能累積經驗的方向。',
      support: '多出的資源可以拿來試做一件有長期價值的小事。',
      challenge: '接新任務前，先算一次它會占用多少時間和注意力。',
      area: 'work'
    },
    Saturn: {
      name: '土星',
      focus: '把責任、期限和完成標準訂清楚。',
      support: '可以把反覆有效的做法固定成一個簡單流程。',
      challenge: '遇到限制時，先找一項能縮小或重新協調的承諾。',
      area: 'work'
    }
  };

  const areaCues = {
    relationships: {
      focus: '提醒你先把彼此在意的事講清楚。',
      support: '適合安排一次短而明確的交流。',
      challenge: '提醒你先留時間確認意思，再做決定。'
    },
    work: {
      focus: '適合把方向縮到一項清楚的任務。',
      support: '適合選一件條件比較齊全的事，先做到能收回饋。',
      challenge: '提醒你先把分工、時間或可動用的資源確認好。'
    }
  };
  const aspectTones = new Set(['focus', 'support', 'challenge']);
  const knownAspects = new Set(['合相', '六合', '四分相', '三分相', '對分相']);

  function relevantTransit(transits, area) {
    return transits.find(transit => planetGuides[transit.planet].area === area);
  }

  function effectOn(area, transit, guide) {
    if (!transit) return guide[area];
    const name = planetGuides[transit.planet].name;
    return name + '的' + transit.aspect.name + areaCues[area][transit.aspect.tone] + guide[area];
  }

  function generate(signId, period, transits = []) {
    const guide = Object.hasOwn(signGuides, signId) ? signGuides[signId] : signGuides.aries;
    const ranked = Array.isArray(transits)
      ? transits.filter(transit => transit && Object.hasOwn(planetGuides, transit.planet))
      : [];
    const close = ranked.filter(transit => aspectTones.has(transit.aspect?.tone) && knownAspects.has(transit.aspect.name));
    const lead = close[0];
    const weekly = period === 'weekly';
    let overview;
    let headline;

    if (lead) {
      const planet = planetGuides[lead.planet];
      const tone = lead.aspect.tone;
      const sampledDay = weekly ? lead.dateLabel ?? '本週' : '今天';
      const timing = sampledDay + '的盤面上，';
      const location = lead.signName ? '位於' + lead.signName + '，' : '';
      headline = guide.headlines[tone];
      overview = planet[tone] + timing + planet.name + location + '與' + guide.name + '中點形成' + lead.aspect.name + '。' + guide.anchor;
    } else {
      const sampled = ranked[0];
      const sky = sampled?.signName ? planetGuides[sampled.planet].name + '位於' + sampled.signName + '。' : '';
      headline = guide.headlines.quiet;
      overview = sky + (weekly ? '這週可把重心放在自己能安排的節奏。' : '今天可把重心放在自己能處理的小事。') + guide.anchor;
    }

    return {
      headline,
      overview,
      relationships: effectOn('relationships', relevantTransit(close, 'relationships'), guide),
      work: effectOn('work', relevantTransit(close, 'work'), guide),
      nextStep: weekly ? guide.weekly : guide.daily
    };
  }

  window.MoonveilHoroscope = { generate };
})();
