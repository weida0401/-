"use strict";

const readingContexts = {
  general: {
    single: "最近有沒有一件小事，讓你想到這張牌？從那一刻回想你怎麼做、又希望有什麼不同，答案可能會比光想整個問題更清楚。",
    connect: ([past, present, direction]) => `${past}像是在問，你以前怎麼走過類似的時刻？看到現在的${present}，可以回頭想想，當時有效的方法現在還適合嗎？${direction}提供了一個新的角度，找一個你願意調整的小地方就好。`,
    close: "今天先挑一件你有餘力做的事。"
  },
  love: {
    single: "可以想起最近的一次互動。當時哪一句話或哪個舉動讓你安心，又有什麼一直想說、還沒說出口？先從你自己的感受整理起。",
    connect: ([feelings, relationship, direction]) => `${feelings}先把視線帶回你自己。最近的相處裡，有沒有一刻特別讓你想起${relationship}？想想你當時想要什麼，也看看對方實際做到了哪些。${direction}可以陪你想一句願意說出口的話。`,
    close: "如果你想把這件事說清楚，先留一點空間給自己的感受。"
  },
  work: {
    single: "先想一個具體的場景，例如最近的分工、剛收到的工作機會，或一直拖著沒決定的事。那個場景裡，有什麼是你真的知道的？還有哪件事需要問清楚？",
    connect: ([situation, concern, next]) => `看見${situation}，可以先想想最近哪個工作場景最像這個情況。${concern}提醒你把還不確定的事問清楚。有了那個答案，再參考${next}，找一個試了也能調整的做法。`,
    close: "做決定前，替自己留一點可以調整的空間。"
  },
  choice: {
    single: "想像你選了其中一條路，隔天醒來會先遇到什麼。再換另一個選項，也想一次。把最大的差異寫下來，往往就能看出自己在意的是什麼。",
    connect: ([optionA, optionB, tradeoff]) => `把選項 A 想得具體一點，看看${optionA}指的是哪一種日常。再用${optionB}想像選項 B 會怎麼過。最後用取捨牌${tradeoff}當共同標準，想想哪一邊的代價你願意長期承擔。`,
    close: "如果還拿不定主意，讓兩個選項先回答同一個問題。"
  },
  daily: {
    single: "今天只要挑一個時刻留意它就好。可能是一段對話、一次休息，或你本來想匆匆做完的一件事。到晚上再回想那個當下有什麼不同。",
    connect: ([theme, concern, action]) => `今天可以把${theme}當成帶在身上的一句提醒。遇到${concern}說的那種時刻，先慢一點看看發生了什麼。再挑個空檔，讓${action}變成一件做得完的小事。`,
    close: "在今天的行程裡挑一個做得到的時段。"
  }
};

const suitInsights = {
  wands: {
    name: "權杖",
    focus: "行動的方向、投入的力氣與可持續的節奏",
    steps: ["留十五分鐘只做第一步，做完記下你還想繼續的理由。", "先暫停一項正在消耗你的投入，隔天再決定要縮小範圍還是改個做法。"]
  },
  cups: {
    name: "聖杯",
    focus: "自己的感受、彼此的需要與關係裡的回應",
    steps: ["用一句「我在意的是……」寫下自己的需要，再選擇是否找人談。", "把一個反覆出現的感受寫下來，想想你希望獲得哪種具體的回應。"]
  },
  swords: {
    name: "寶劍",
    focus: "掌握的資訊、心裡的推測與溝通是否清楚",
    steps: ["選一句影響你判斷的說法，找資料或向當事人確認一次。", "把已知的事和還沒證實的推測分開寫，優先處理一個能釐清的問題。"]
  },
  pentacles: {
    name: "錢幣",
    focus: "可動用的時間、資源與長期要承擔的成本",
    steps: ["替想做的事定一個時間或費用上限，看看用現有資源能完成哪一小步。", "先記下一項目前吃緊的資源，再找一件可以延後、減少或重新分工的事。"]
  }
};

const majorNextSteps = [
  ["挑一件試了也能回頭的小事，先做一次看看。", "把最擔心的後果寫下來，替第一次嘗試設一道停損線。"],
  ["列出手上已有的三樣資源，今天就用其中一樣做出一個小成果。", "把眼前的點子減到一個，替它訂一個半小時內能完成的目標。"],
  ["安靜記下你察覺的兩個線索，等其中一個能查證時再回頭判斷。", "把別人的期待和自己的感受各寫一行，看看它們在哪裡不同。"],
  ["挑一項可以持續補充的支持，先為它排出固定時間。", "把一件長期由你代勞的事說清楚，試著請對方分擔一部分。"],
  ["選一件分工模糊的事，把誰負責、何時完成寫下來。", "找出一條已經造成負擔的規矩，先試行一次較有彈性的版本。"],
  ["向一位熟悉這件事的人問一個具體的問題，再挑一項適用的方法試做。", "端詳一個你一直遵守的規則，寫下它目前對你還有什麼意義。"],
  ["把最重視的一項價值寫下來，用一句話說明它會如何影響你的決定。", "寫下一件你可以退讓的事，以及一個退讓後會後悔的底線。"],
  ["定一個本週能達成的目標，先把最容易分心的工作移開。", "給自己一個檢查點，在追加投入前核對方向、時間和資源。"],
  ["選一句溫和又清楚的話，在需要設界線時說出來。", "先排一段真正能休息的時間，再決定是否接下新的負擔。"],
  ["留一小段不受打擾的時間，記下這段經歷教會你的一件事。", "帶著一個具體的疑問，找你信任的人交換一次看法。"],
  ["為近期可能發生的一個變動預留時間，並寫下一個備案。", "回想上一次遇到同樣狀況的經過，只改動其中一個環節。"],
  ["先列一條所有選項都適用的標準，再拿現有事實逐項對照。", "找出一個如果猜錯就會影響決定的資訊，把它查清楚。"],
  ["在採用熟悉的做法前，先寫下一種平常不會考慮的解法。", "訂一個重新評估的日期，並寫下到時希望看見的變化。"],
  ["把已經結束卻還占著時間的一件事收尾，為下一步留一點空間。", "從一項最容易整理的舊承諾開始，讓過渡有一個具體的起點。"],
  ["只調整一個容易觀察的環節，試上一週再回顧。", "找出最近投入過量的一件事，先把它的頻率減少一次。"],
  ["記下一個習慣帶來的短暫好處，再找一個代價較小的替代方式。", "先辨認一個最容易重回舊習慣的時刻，提早決定那時要做什麼。"],
  ["先寫下最急的一件事，完成後再處理其他變動。", "挑一個已察覺的風險，今天先做一項能用得上的備援準備。"],
  ["選一件做完有踏實感的小事，替它留出可重複的時間。", "找回一項已經有的進展，把接下來的目標縮到可以做到的程度。"],
  ["把一個讓你不安的猜測寫下來，替它找一種可驗證的解釋。", "先查證一條新線索，看它有沒有改變你原本的理解。"],
  ["選一件已經清楚的事，主動把需求或成果說給相關的人聽。", "挑一項值得慶祝的小進展，先不和其他人的成果比較。"],
  ["回看三個影響你的選擇，找出其中一項你現在仍願意投入的事。", "把一件以前遺憾的事拆成當時能控制與當時無法知道的部分。"],
  ["替這階段寫一份收尾清單，只留下下一階段還用得上的做法。", "選出一項真正影響完成的細節，安排確切的處理時間。"]
];

function buildReadingAnalysis(themeKey, entries, positions, deck) {
  const context = readingContexts[themeKey];
  const cards = entries.map((entry, index) => {
    const card = deck[entry.index];
    const orientation = entry.reversed ? "逆位" : "正位";
    return {
      card,
      position: positions[index],
      reversed: entry.reversed,
      label: card.name_zh_hant + "（" + orientation + "）",
      topic: "「" + card.keyword_zh_hant + "」"
    };
  });

  const pivot = cards[cards.length - 1];
  const paragraphs = cards.length === 1
    ? [`這次抽到${pivot.label}，它把話題帶到${pivot.topic}。${context.single}`]
    : [
        context.connect(cards.map(({label, topic}) => label + "的" + topic)),
        describeSpreadPattern(cards)
      ];

  const {card, reversed, label, topic} = pivot;
  const steps = suitInsights[card.suit]?.steps ?? majorNextSteps[card.rank];
  const nextStep = steps?.[Number(reversed)] ?? "先記下一件可以查證或試做的小事，做完再看你的想法有沒有改變。";
  const conclusion = `${context.close}想起${label}帶出的${topic}，${nextStep}`;
  return {paragraphs, conclusion};
}

function describeSpreadPattern(cards) {
  const reversedCards = cards.filter((entry) => entry.reversed);
  let balance;
  if (reversedCards.length === 0) {
    balance = "三張都是正位。你可以回到最有感覺的那一張，試一個現在做得到的改變，看看自己怎麼回應。";
  } else if (reversedCards.length === cards.length) {
    balance = "三張都是逆位。這時不用急著逼自己得出答案。可以先挑一個讓你有點在意的牌位，把它對應的情況想得更具體一點。";
  } else {
    const positions = reversedCards.map(({position}) => "「" + position + "」").join("、");
    balance = `逆位落在${positions}。如果這幾個牌位讓你想起最近卡住的時刻，可以停下來看看。再從其他牌裡找一個眼前已有的線索，幫自己把事情想清楚一點。`;
  }

  const repeatedSuit = Object.keys(suitInsights).find((suit) =>
    cards.filter(({card}) => card.suit === suit).length >= 2
  );
  if (!repeatedSuit) return balance;
  const {name, focus} = suitInsights[repeatedSuit];
  return `這次重複抽到${name}，可以把注意力多放在${focus}。${balance}`;
}
