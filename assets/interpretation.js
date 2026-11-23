"use strict";

const readingContexts = {
  general: {
    single: "把牌意放回眼前最困擾你的情境，想想這個主題曾在什麼時候出現。尤其值得留意的是，當時的做法現在還有沒有用。",
    connect: ([past, present, direction]) => `過去的位置抽到${past}，現在的位置抽到${present}。對照這兩張牌，可以回頭看先前的經驗怎麼影響當下的反應。最後，${direction}提供新的觀察方向。想想舊做法有哪一部分仍有幫助，又有哪一部分值得調整。`,
    close: "把眼前的問題縮小成一件你能觀察或改變的事。"
  },
  love: {
    single: "先分清自己真正需要的是什麼，再回想對方實際說過或做過什麼。兩者之間的落差，可以成為你下次開口的起點。",
    connect: ([feelings, relationship, direction]) => `你的感受由${feelings}切入，關係現況則由${relationship}補上另一個角度。把前兩張對照，看看自己的期待和雙方實際的互動在哪裡相符、在哪裡有落差。相處方向的${direction}，適合拿來想一個你願意開啟的對話。`,
    close: "先把感受整理成一項你能清楚表達的需要。"
  },
  work: {
    single: "把牌意對照一個具體的工作情境，例如最近的分工、正在評估的機會，或讓你卡住的決定。這會讓你更容易知道接下來要確認什麼。",
    connect: ([situation, concern, next]) => `目前處境的${situation}和需要留意的${concern}，可以拿來對照工作中已有的條件和仍待確認的資訊。下一步的${next}提供一個試行方向。先驗證一個最可能影響決定的假設，再評估是否要投入更多時間或資源。`,
    close: "把方向轉成一個能在工作上低成本試行的小步驟。"
  },
  choice: {
    single: "先把這張牌的主題當成一個比較標準。用同樣的標準看每個選項，留意哪一項差異會實際影響你的日常。",
    connect: ([optionA, optionB, tradeoff]) => `選項 A 可從${optionA}來看，選項 B 則可從${optionB}來看。兩張牌各自指出一種值得查證的可能。把取捨牌的${tradeoff}當成共同標準，問自己選 A 會放棄什麼、選 B 又需要承擔什麼。`,
    close: "選一項你重視的條件，用它來比較兩個選項會帶來的改變。"
  },
  daily: {
    single: "把主題縮小到今天的一次對話、一件待辦或一段休息時間。事先選好想留意什麼，到了晚上就有一件具體的事可以回顧。",
    connect: ([theme, concern, action]) => `今天可以用${theme}選定焦點，用${concern}提醒自己在哪些時刻放慢看清楚，再把${action}落到一件今天能做的小事。把三張一起看，重點在於讓提醒跟著行程走進一個具體的時刻。`,
    close: "在今天的行程找一個適合的時段，先留給一件你做得到的事。"
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
    ? [`${pivot.label}把重點放在${pivot.topic}。${pivot.reversed ? "先核對這件事有哪一部分需要調整，再想你有多少餘裕往前。" : "先找出目前已有的條件，看看哪一部分可以從小處開始。"}${context.single}`]
    : [
        context.connect(cards.map(({label, topic}) => label + "的" + topic)),
        describeSpreadPattern(cards)
      ];

  const {card, reversed, label, topic} = pivot;
  const steps = suitInsights[card.suit]?.steps ?? majorNextSteps[card.rank];
  const nextStep = steps?.[Number(reversed)] ?? "先記下一件可以查證或試做的小事，做完再看你的想法有沒有改變。";
  const conclusion = `${context.close}以${label}的${topic}為起點，${nextStep}`;
  return {paragraphs, conclusion};
}

function describeSpreadPattern(cards) {
  const reversedCards = cards.filter((entry) => entry.reversed);
  let balance;
  if (reversedCards.length === 0) {
    balance = "三張都是正位。把其中一個已有條件的做法先付諸小規模的嘗試，再觀察它是否帶來你想要的變化。";
  } else if (reversedCards.length === cards.length) {
    balance = "三張都是逆位。先分別看各位置有哪些假設、界線或節奏需要再確認，從最容易改變的一項開始。";
  } else {
    const positions = reversedCards.map(({position}) => "「" + position + "」").join("、");
    balance = `逆位落在${positions}。把這些位置先當作需要多確認的地方，其他位置的正位牌義則可當成你手上已有的線索或資源。把兩邊放在一起，看看哪些事可以開始，哪些還要先弄清楚。`;
  }

  const repeatedSuit = Object.keys(suitInsights).find((suit) =>
    cards.filter(({card}) => card.suit === suit).length >= 2
  );
  if (!repeatedSuit) return balance;
  const {name, focus} = suitInsights[repeatedSuit];
  return `牌陣中重複出現${name}，可以多留意${focus}。${balance}`;
}
