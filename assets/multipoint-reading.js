'use strict';

const multiPointReading = (() => {
  const positions = {
    root: ['根基', '可以回頭看看，什麼時候開始有這個狀況？'],
    past: ['過去', '回想一個類似的時刻，當時的做法有哪些現在還適用？'],
    now: ['現況', '先用最近發生的一件事對照這個提醒，看看哪一部分最貼近眼前的狀況。'],
    obstacle: ['卡點與解法', '看看什麼容易卡住，以及手上有沒有辦法把它鬆開。'],
    inner: ['內在', '找個安靜的時候問自己，你真正想得到的是什麼？'],
    outer: ['外在', '多看一眼手上已有的資訊和支援，挑一項可以向外確認的條件。'],
    action: ['行動', '挑個容易開始的做法，試過一次再看要不要繼續。'],
    trend: ['趨勢', '把它當成接下來可觀察的變化。條件一變，可以重新想想怎麼走。']
  };

  const themes = {
    general: {
      lens: '把牌面拉回你手上的事，先找出一個你現在能影響的地方。',
      steps: [
        '先寫下一件你目前還沒辦法確認的事，想好要怎麼查，或遇到它時可以怎麼調整。',
        '找一個你能實際觀察的線索，留意它是否跟你原本想的一樣。',
        '挑一個今天能完成的小動作。做完之後，記下它讓事情有了什麼變化。'
      ]
    },
    love: {
      lens: '放到關係裡，可以把自己的感受、對方實際的回應和你希望得到的支持分開看。',
      steps: [
        '先寫下哪個互動讓你不舒服，以及下次你希望怎麼被對待。有了這句話，再決定什麼時候適合談。',
        '回想一個最近的互動，分開寫下對方說了什麼、你當時有什麼感受。這能幫你釐清最想了解的地方。',
        '如果你想開口，可以先說「我最近有個感受想跟你聊聊」，再具體說出一件你在意的事。'
      ]
    },
    work: {
      lens: '談到工作時，可以把想做的改變、手上有的資源，以及還要向別人確認的事分開。',
      steps: [
        '挑出最可能卡住進度的一個條件，像是分工、工時或資訊。先跟相關的人確認，再調整安排。',
        '把眼前最不清楚的一件事寫成一個問題，找知道情況的人確認一次。',
        '先做一件能拿到回饋的小事，例如試做任務的一部分。看過回饋再評估要投入多少時間。'
      ]
    },
    choice: {
      lens: '把每個選項想成真的走進日常，看看各自需要花掉什麼，又能留下什麼。',
      steps: [
        '寫下最難承擔的一個代價，想想如果它真的發生，你需要多少時間或資源才能應付。',
        '選一個還不知道答案的問題，讓兩個選項都接受同一個檢查。',
        '先試一個可以回頭的小動作，像是問一次實際流程，或為其中一條路留一小段試跑時間。'
      ]
    },
    daily: {
      lens: '今天只需要帶一個提醒進日常。想想哪個時段最適合用得上它。',
      steps: [
        '從今天的待辦裡找一件可以延後、縮小或請人幫忙的事，先替自己騰出一點空間。',
        '挑一個今天能觀察的小細節，留到晚上回想，它有沒有改變你對這件事的看法。',
        '選一件今天就能做的小事，做完花一分鐘記下最有感的一個變化。'
      ]
    }
  };

  const everydaySteps = {
    權杖: [
      '看看哪一件事最消耗你的力氣，先把它的範圍縮小一點。',
      '留十分鐘試一下你最想做的事，看看從哪一步開始最順。',
      '留一小段時間做出第一步，結束時記下什麼讓你想繼續。'
    ],
    聖杯: [
      '想起一個反覆出現的感受，寫下它想提醒你注意什麼，或你需要哪一種支持。',
      '把現在的感受寫成一句話，看看其中有沒有你還沒說出口的需要。',
      '挑一種讓你感到踏實的交流方式，和一個你信得過的人聊聊。'
    ],
    寶劍: [
      '把你已經知道的事和心裡的猜測分開寫，挑最容易查證的一項先確認。',
      '選一個最影響你判斷的問題，找一條可核對的線索。',
      '試著把想法用一句話說清楚。要是有關鍵資訊仍不確定，順手列出可以問誰。'
    ],
    錢幣: [
      '盤點時間、費用或支援，看看哪一項最吃緊，再從能減少的承諾開始。',
      '記下你願意為這件事花多少時間，再對照最近一週實際用掉多少。',
      '替想做的事留一小段時間，選一個看得到成果的範圍先做。'
    ]
  };

  const answerProfiles = {
    investment: {
      headlines: [
        '眼前先釐清投資風險，再決定要不要繼續評估',
        '這個機會可以研究，先把計畫和風險寫清楚',
        '可以繼續評估這個投資機會，計畫還要補清楚'
      ],
      condition: '成不成要看獲利理由能不能用實際資料驗證，以及你能不能守住風險上限。',
      nextStep: '先寫下這筆投資為什麼可能成立、你最多能承受多少損失，以及發生什麼情況就要退出。用這三項去對照實際資料，再做決定。'
    },
    love: {
      headlines: [
        '關係能不能往前，先看卡住的地方能否談開',
        '還有空間了解彼此，先看對方怎麼回應',
        '可以找機會把話說開，後續還要看彼此怎麼回應'
      ],
      condition: '把重點放在雙方能否說清楚各自的期待。如果說完之後，行動也跟得上，關係才有更具體的調整空間。'
    },
    work: {
      headlines: [
        '工作上的關鍵條件還不齊，先確認卡在哪裡',
        '有方向可以試，先確認資源和分工',
        '工作上有可用的條件，可以先驗證一小步'
      ],
      condition: '先找出影響結果的條件，例如對方期待的成果、你能投入的時間，或誰能給你回饋。確認其中一項，再判斷這個做法是否走得通。'
    },
    choice: {
      headlines: [
        '選擇的代價還沒弄清楚，先補一項關鍵資訊',
        '先用同一個標準比較兩條路，再做選擇',
        '可以先試自己較在意的方向，留一點回頭的空間'
      ],
      condition: '決定前可用一個對你最重要的條件比較，例如時間、生活變動或要承擔的代價。如果其中一條路能先小規模試做，就用實際經驗再對照一次。'
    },
    daily: {
      headlines: [
        '今天先把最容易卡住的一件事縮小',
        '今天先觀察一件事，讓下一步清楚一點',
        '今天有一件小事可以往前做'
      ],
      condition: '把牌面的提醒放進今天實際會遇到的一件事。做完或觀察過後，看看自己有沒有更靠近想要的方向。'
    },
    outcome: {
      headlines: [
        '照目前的條件，先處理卡點再談結果',
        '目前成敗還難判斷，關鍵條件值得再確認',
        '有機會往前，結果要看關鍵條件能否落實'
      ],
      condition: '把現在能觀察到的助力和仍待確認的地方分開。先查一個可能改變判斷的條件，看清楚之後再決定要不要繼續。'
    },
    general: {
      headlines: [
        '先處理最消耗你的卡點',
        '先確認一個線索，讓方向更清楚',
        '先用手上已有的條件做一小步'
      ],
      condition: '先把問題縮到眼前一件能調整的事。試過之後，用實際發生的變化重新看這個問題。'
    }
  };

  function questionKind(question, themeKey) {
    if (/面[試试]|[錄录]取|升[遷迁]|[應应][徵征]|求[職职]/.test(question)) return 'work';
    if (/投[資资]|股票|股[價价]|基金(?![會会])|本金|[獲获]利|[報报]酬|理[財财]|比特[幣币]|加密[貨货][幣币]|期[貨货]|[資资][產产]|ETF/i.test(question)) return 'investment';
    if (/感情|[戀恋][愛爱]|[復复]合|[曖暧]昧|前任|交往|分手|[結结]婚|伴[侶侣]|告白|喜[歡欢]我|追求[他她]/.test(question)) return 'love';
    if (/工作|[職职][場场涯业業]|[轉转][職职]|升[職职]|同事|主管|[專专]案|[創创][業业]/.test(question)) return 'work';
    if (/[選选]哪|哪[個个]比[較较]|[兩两][個个][選选][項项]|二[選选]一|[選选].*[還还]是|[還还]是[選选]|[選选][擇择]哪|取[捨舍]/.test(question)) return 'choice';
    if (themeKey !== 'general' && Object.hasOwn(themes, themeKey)) return themeKey;
    if (/[會会]不[會会]|能不能|是否|可否|能否|有[沒没]有|[會会]成功|能成功|[該该]不[該该]|要不要|[嗎吗嘛][？?!！]*$/.test(question)) return 'outcome';
    return 'general';
  }

  const strongest = (items, measure) => items.reduce((best, item) => {
    const value = measure(item);
    return value > 0 && (!best || value > measure(best)) ? item : best;
  }, undefined);

  function pointName(point) {
    return `「${positions[point.key][0]}」的${point.card.name}（${point.reversed ? '逆位' : '正位'}）`;
  }

  function plainMeaning(point) {
    if (point.meaning === '以清楚的願景引導資源投入') return '先訂好方向，再想要投入多少資源';
    if (point.meaning === '找出讓決策遲疑的限制') return '找出哪個條件讓你下不了決定';
    return point.meaning.replace(/^以/, '用');
  }

  function summary(points, themeKey) {
    const theme = themes[themeKey] ?? themes.general;
    const support = strongest(points, point => point.contribution);
    const caution = strongest(points, point => -point.contribution);
    const parts = [];

    if (support) {
      const opening = support.key === 'obstacle' ? '指出一個可以化解卡點的做法' : '給了你一個可以試的方向';
      parts.push(`${pointName(support)}${opening}。試著${plainMeaning(support).replace(/^先/, '')}。`);
    }
    if (caution) {
      parts.push(`${pointName(caution)}值得停下來多看一眼。${plainMeaning(caution)}，會讓下一步更清楚。`);
    }
    if (!support && !caution) {
      const current = points.find(point => point.key === 'now');
      parts.push(`這副牌的推進指數落在中間。${pointName(current)}提醒你${plainMeaning(current)}。`);
    }
    parts.push(theme.lens);
    return parts.join('');
  }

  function pairing(calc) {
    const pair = strongest(calc.pairs, item => Math.abs(item.contribution));
    const shift = 25 * 0.15 * (calc.adjacent - calc.base);
    const magnitude = Math.abs(shift).toFixed(1);
    const impact = Number(magnitude) === 0
      ? '把所有配對算進來後，整體指數大致落在同一個位置。'
      : `把所有配對算進來後，整體指數比只看牌位${shift > 0 ? '高' : '低'}了 ${magnitude} 點。`;

    if (!pair) {
      return '這次相鄰牌位各有自己的重點，可以分開看。' + impact;
    }

    const first = positions[pair.left.key][0];
    const second = positions[pair.right.key][0];
    const effect = pair.contribution > 0
      ? '兩張牌都帶來一點助力。可以想想各自提供的條件，有哪兩件事能一起做。'
      : '兩張牌都提醒這裡容易卡住。可以看看它們是否都指向同一個限制。';
    const contribution = (pair.contribution > 0 ? '+' : '−') + Math.abs(pair.contribution).toFixed(3);
    return `比較值得連起來看的是「${first}」的${pair.left.card.name}和「${second}」的${pair.right.card.name}（配對貢獻 ${contribution}）。${effect}${impact}`;
  }

  function themeStep(theme, point) {
    const steps = theme === themes.general ? everydaySteps[point.card.suit] ?? theme.steps : theme.steps;
    return steps[Math.sign(point.score) + 1];
  }

  function answer(points, themeKey, question, index) {
    const kind = questionKind((question ?? '').trim(), themeKey);
    const profile = answerProfiles[kind];
    const headline = profile.headlines[index < 40 ? 0 : index >= 60 ? 2 : 1];
    const support = strongest(points, point => point.contribution);
    const largestConcern = strongest(points, point => -point.contribution);
    const trend = points.find(point => point.key === 'trend');
    const caution = kind === 'investment' && trend?.contribution < 0 ? trend : largestConcern;
    const focus = points.find(point => point.key === 'action') ?? points.find(point => point.key === 'now');
    const parts = [profile.condition];
    if (support) {
      const lead = support.key === 'obstacle' ? '提供了一個處理卡點的方法' : '指出目前可以借力的地方';
      parts.push(`${pointName(support)}${lead}。它提醒你${plainMeaning(support)}。`);
    }
    if (caution) {
      parts.push(kind === 'investment'
        ? `${pointName(caution)}也提醒你，仍有會影響判斷的條件需要先查清楚。`
        : `${pointName(caution)}提醒你${plainMeaning(caution)}。`);
    }
    if (!support && !caution) {
      parts.push(`這次的牌勢偏中性。${pointName(focus)}可以作為第一個觀察點。`);
    }

    const theme = themes[kind] ?? themes.general;
    return {headline, body: parts.join(''), nextStep: profile.nextStep ?? themeStep(theme, focus)};
  }

  function perCard(point) {
    return `${plainMeaning(point)}。${positions[point.key][1]}`;
  }

  return {answer, summary, pairing, perCard};
})();
