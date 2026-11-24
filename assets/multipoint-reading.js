'use strict';

const multiPointReading = (() => {
  const positions = {
    root: ['根基', '可以回頭看看，什麼時候開始有這個狀況？'],
    past: ['過去', '回想一個類似的時刻，當時的做法有哪些現在還適用？'],
    now: ['現況', '先用最近發生的一件事對照這個提醒，看看哪一部分最貼近眼前的狀況。'],
    obstacle: ['阻力', '想一想，眼前最耗力的部分是什麼？有哪一塊可以縮小，或請人一起處理？'],
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

  const strongest = (items, measure) => items.reduce((best, item) => {
    const value = measure(item);
    return value > 0 && (!best || value > measure(best)) ? item : best;
  }, undefined);

  function pointName(point) {
    return `「${positions[point.key][0]}」的${point.card.name}（${point.reversed ? '逆位' : '正位'}）`;
  }

  function summary(points, themeKey) {
    const theme = themes[themeKey] ?? themes.general;
    const support = strongest(points, point => point.contribution);
    const caution = strongest(points, point => -point.contribution);
    const parts = [];

    if (support) {
      parts.push(`${pointName(support)}給了你一個可以試的方向。它提醒你${support.meaning}。`);
    }
    if (caution) {
      parts.push(`${pointName(caution)}值得停下來多看一眼。可以${caution.meaning}，再決定怎麼往前。`);
    }
    if (!support && !caution) {
      const current = points.find(point => point.key === 'now');
      parts.push(`這副牌的推進指數落在中間。先看看${pointName(current)}的提醒，你可以${current.meaning}。`);
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

  function conclusion(points, themeKey) {
    const theme = themes[themeKey] ?? themes.general;
    const focus = points.find(point => point.key === 'action') ?? points.find(point => point.key === 'now');
    const steps = theme === themes.general ? everydaySteps[focus.card.suit] ?? theme.steps : theme.steps;
    return `接下來可以從${pointName(focus)}想一個小步驟。${steps[Math.sign(focus.score) + 1]}`;
  }

  function perCard(point) {
    return `${point.meaning}。${positions[point.key][1]}`;
  }

  return {summary, pairing, conclusion, perCard};
})();
