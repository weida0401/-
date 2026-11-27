(() => {
'use strict';
const multiPointReading = (() => {
  const positions = {
    root: {name: '根基', lead: '這是正在影響局面的既有條件，重點是'},
    past: {name: '過去', lead: '過去留給現在的經驗是'},
    now: {name: '現況', lead: '眼前最值得留意的是'},
    obstacle: {name: '卡點與解法', lead: '處理卡點時，重點是'},
    inner: {name: '內在', lead: '這張牌指向自己這一邊的感受與反應，重點是'},
    outer: {name: '外在', lead: '環境和別人的反應會影響進度，重點是'},
    action: {name: '行動', lead: '下一步可以'},
    trend: {name: '趨勢', lead: '接下來能不能順利，關鍵在於'}
  };

  const answers = {
    investment: {
      verdicts: ['這個機會先留在評估階段。', '這個機會還缺能支持決定的資料。', '可以繼續評估這個機會。'],
      next: '先用資料查證為什麼可能獲利，算清楚最多能承受多少損失，以及什麼情況要退出，再做決定。'
    },
    money: {
      verdicts: ['目前的重點是穩住手上的錢。', '先釐清每月實際剩下多少。', '有空間改善財務安排，可以從現金流開始。'],
      next: '列出確定會進帳的金額和到期帳單，先留出必要開銷。把其餘的錢分成可動用金額和需要保留的備用金。'
    },
    interview: {
      verdicts: ['面試進度還有阻礙，先補上對方在意的條件。', '目前還難判斷會不會錄取。', '這次有可用的優勢，可以繼續跟進。'],
      next: '用一個具體成果對照職缺最重要的要求。面試後依約定時間詢問進度，錄取以公司正式通知為準。'
    },
    offer: {
      verdicts: ['這份邀約先放在談條件的階段。', '這份工作可以繼續談，先確認條件。', '這份工作值得進一步談。'],
      next: '請對方用文字確認薪資、上班時間、職責和試用條件，再和你目前的安排逐項對照。'
    },
    work: {
      verdicts: ['工作上最優先的是解決目前的卡點。', '工作方向可行性還要確認。', '可以往這個工作方向試一步。'],
      next: '把你想做的調整縮成一件能在一週內拿到回饋的事，和相關的人確認負責範圍跟完成時間。'
    },
    reconciliation: {
      verdicts: ['目前復合的條件還不成熟。', '復合仍有變數，先看分開的原因能不能談清楚。', '有空間重新聯絡一次，復合要看雙方的回應。'],
      next: '如果雙方都願意聯絡，可以用一則簡短訊息提起一件想談清楚的事。以對方的實際回覆和後續行動判斷是否適合再談。'
    },
    feelings: {
      verdicts: ['目前較難從互動確認對方的心意。', '這段互動還需要更明確的回應。', '互動看得到發展空間，心意還要靠實際回應確認。'],
      next: '可以提出一次清楚的邀請，像是約一個時間見面。對方是否主動回覆、願意安排時間，比猜測心意更有參考價值。'
    },
    love: {
      verdicts: ['關係先處理反覆出現的摩擦。', '目前比較適合把期待談清楚。', '關係有空間往前談。'],
      next: '選一件最近發生的互動，用「我當時感到……，我希望……」說明你的需要，再聽對方的回應。'
    },
    choice: {
      verdicts: ['先保留代價較小、還能回頭的選項。', '兩個選項目前還難分高下。', '有條件先試一條路，保留回頭的空間。'],
      next: '用同一個標準比較每個選項的時間、支出和退出成本。先替可短期試做的選項訂一個結束日期。'
    },
    daily: {
      verdicts: ['今天的重點是減少負擔。', '今天適合先確認一件事。', '今天可以完成一個小進度。'],
      next: '把最緊急的一件事排進今天的第一個空檔，其他待辦先留到這一步完成後再安排。'
    },
    outcome: {
      verdicts: ['照目前的牌勢，短期內比較難成。', '現在還看不出成敗。', '照目前的牌勢，有條件往前。'],
      next: '用一個看得到的成果驗證進度，例如確認對方的正式回覆，或把第一個可交付的部分做完。'
    },
    general: {
      verdicts: ['先處理目前最卡的一環。', '現在先核對一個關鍵條件。', '目前有條件先往前走一步。'],
      next: '把眼前的事情拆成一件能查證的事和一件今天能完成的事。先完成小步驟，再用實際結果調整安排。'
    }
  };

  function questionKind(question, themeKey) {
    if (/(接[受下]|拒[絕绝]|要不要接).*(offer|邀[約约]|[錄录]取|工作|[職职]缺)|(offer|邀[約约]).*(接[受下]|拒[絕绝]|要不要接)/i.test(question)) return 'offer';
    if (/面[試试]|[錄录]取|[應应][徵征]|求[職职]|拿(到|下).{0,5}offer/i.test(question)) return 'interview';
    if (/(這|这)(份|個|个).*(工作|[職职]缺|offer|邀[約约])/i.test(question)) return 'offer';
    if (/投[資资]|股票|股[價价]|基金(?![會会])|本金|[獲获]利|[報报]酬|理[財财]|比特[幣币]|加密[貨货][幣币]|期[貨货]|ETF/i.test(question)) return 'investment';
    if (/[財财][務务運运]|[錢钱][夠够]|[借貸贷][錢钱款]|[債债][務务]|[預预]算|收入|存款|手[頭头]/.test(question)) return 'money';
    if (/[復复]合|重新在一起|前任.*回[來来]|[會会]回[來来]找我/.test(question)) return 'reconciliation';
    if (/喜[歡欢]我|[愛爱]我|在乎我|[對对]方.*心意|[對对]我的感[覺觉]|想念我|暗[戀恋]我/.test(question)) return 'feelings';
    if (/感情|[戀恋][愛爱]|[曖暧]昧|前任|交往|分手|[結结]婚|伴[侶侣]|告白|追求[他她]/.test(question)) return 'love';
    if (/工作|[職职][場场涯业業]|[轉转][職职]|升[遷迁職职]|同事|主管|[專专]案|[創创][業业]/.test(question)) return 'work';
    if (/[選选]哪|哪[個个]比[較较]|[兩两][個个][選选][項项]|二[選选]一|[選选].*[還还]是|[還还]是[選选]|[選选][擇择]哪|取[捨舍]/.test(question)) return 'choice';
    if (/今天|今日|今[晚夜]/.test(question)) return 'daily';
    if (Object.hasOwn(answers, themeKey) && themeKey !== 'general') return themeKey;
    if (/[會会]不[會会]|能不能|是否|可否|能否|有[沒没]有|[會会]成功|能成功|[該该]不[該该]|要不要|[嗎吗嘛][？?!！]*$/.test(question)) return 'outcome';
    return 'general';
  }

  const strongest = (items, measure) => items.reduce((best, item) => {
    const value = measure(item);
    return value > 0 && (!best || value > measure(best)) ? item : best;
  }, undefined);

  function pointName(point) {
    return `「${positions[point.key].name}」的${point.card.name}（${point.reversed ? '逆位' : '正位'}）`;
  }

  function plainMeaning(point) {
    return point.meaning.replace(/^以/, '用');
  }

  function summary(points) {
    const support = strongest(points, point => point.contribution);
    const caution = strongest(points, point => -point.contribution);
    const parts = [];
    if (support) parts.push(`最有助力的位置是「${positions[support.key].name}」，正向貢獻來自${support.card.name}。`);
    if (caution) parts.push(`最大的保留在「${positions[caution.key].name}」，${caution.card.name}讓這一環需要優先核對。`);
    return parts.join('') || '每個位置的分數都落在中間，整副牌適合用來釐清現況。';
  }

  function pairing(calc) {
    const pair = strongest(calc.pairs, item => Math.abs(item.contribution));
    const shift = 25 * 0.15 * (calc.adjacent - calc.base);
    const magnitude = Math.abs(shift).toFixed(1);
    const impact = Number(magnitude) === 0
      ? '合計後，牌面加權分數大致維持原位。'
      : `合計後，牌面加權分數比只算單張${shift > 0 ? '高' : '低'}了 ${magnitude} 點。`;

    if (!pair) return '相鄰牌位各自發揮作用。' + impact;

    const first = positions[pair.left.key].name;
    const second = positions[pair.right.key].name;
    const effect = pair.contribution > 0
      ? '兩個位置的條件同向，合在一起提供助力。'
      : '兩個位置的困難同向，容易互相牽制。';
    const contribution = (pair.contribution > 0 ? '+' : '−') + Math.abs(pair.contribution).toFixed(3);
    return `影響最大的一組是「${first}」的${pair.left.card.name}和「${second}」的${pair.right.card.name}（配對貢獻 ${contribution}）。${effect}${impact}`;
  }

  function answer(points, themeKey, question, index) {
    const kind = questionKind((question ?? '').trim(), themeKey);
    const profile = answers[kind];
    const headline = profile.verdicts[index < 40 ? 0 : index >= 60 ? 2 : 1];
    const support = strongest(points, point => point.contribution);
    const largestConcern = strongest(points, point => -point.contribution);
    const trend = points.find(point => point.key === 'trend');
    const caution = kind === 'investment' && trend?.contribution < 0 ? trend : largestConcern;
    const reasons = kind === 'investment' ? ['投資成敗要用實際資料判斷。'] : [];

    if (support) {
      const lead = support.key === 'obstacle' ? '給出的解法是' : '帶來的助力是';
      reasons.push(`${pointName(support)}${lead}${plainMeaning(support)}。`);
    }
    if (caution) {
      reasons.push(`${pointName(caution)}指出容易卡住的地方，重點是${plainMeaning(caution)}。`);
    }
    if (!support && !caution) {
      const current = points.find(point => point.key === 'now');
      reasons.push(`這次各牌位的分數偏中性。${perCard(current)}`);
    }
    return {headline, body: reasons.join(''), nextStep: profile.next};
  }

  function perCard(point) {
    const position = positions[point.key];
    const lead = point.key === 'obstacle' && point.score > 0 ? '這裡有可用的解法，可以' : position.lead;
    return `${lead}${plainMeaning(point)}。`;
  }

  return {answer, summary, pairing, perCard};
})();

const major = [
  ['愚者','☄',1,'以小規模嘗試打開新局',-1,'先確認風險與退路'],
  ['魔術師','✦',2,'整合手邊資源並開始行動',-1,'檢查承諾與實際能力的落差'],
  ['女祭司','☾',1,'留意尚未說出口的線索',0,'釐清直覺與猜測的界線'],
  ['皇后','❀',2,'投入能持續滋養成果的資源',-1,'把過度付出的界線拉回來'],
  ['皇帝','♜',1,'用明確責任與規則穩住局勢',-1,'檢查規則是否已經僵化'],
  ['教皇','✚',1,'向熟悉規則的人請教',0,'重新檢查習慣遵守的規則'],
  ['戀人','♡',2,'用核心價值釐清選擇',-1,'先處理立場或承諾的不一致'],
  ['戰車','✧',2,'統一方向後集中資源推進',-1,'先收束互相牽制的目標'],
  ['力量','☉',2,'用耐心與自制穩定局勢',-1,'先照顧耗損與缺乏信心的地方'],
  ['隱者','☼',0,'留出時間獨立整理證據',-1,'留意隔絕外部回饋的代價'],
  ['命運之輪','◎',1,'留意週期變動帶來的窗口',-1,'保留彈性以應對反覆的變動'],
  ['正義','⚖',1,'以相同標準核對事實與責任',-1,'先釐清偏差與責任歸屬'],
  ['倒吊人','◇',0,'暫停推進以換一個角度檢視',-1,'辨認停滯是否已失去作用'],
  ['死神','♣',-1,'結束耗損的階段以騰出空間',-2,'處理對必要變動的抗拒'],
  ['節制','♒',2,'調整節奏以整合彼此差異',-1,'先降低失衡與過量投入'],
  ['惡魔','◆',-2,'辨認依賴、誘惑與受限的選擇',1,'趁鬆綁時重建自主性'],
  ['高塔','ϟ',-2,'先保護核心資源並處理突變',-1,'找出累積已久而尚未處理的裂縫'],
  ['星星','✶',2,'保留能支持長期修復的方向',-1,'先找回可驗證的小進展'],
  ['月亮','☽',-1,'核對模糊資訊與情緒投射',1,'逐步驗證開始浮現的線索'],
  ['太陽','☀',2,'用清楚可見的成果確認方向',1,'留意仍可利用的進展'],
  ['審判','✴',1,'回顧經驗後做出清楚決定',-1,'找出延遲回應的原因'],
  ['世界','◎',2,'收束一輪成果並準備下一階段',-1,'補齊尚未收尾的環節']
];
const ranks = [
  ['ace','王牌'], ['two','二'], ['three','三'], ['four','四'], ['five','五'],
  ['six','六'], ['seven','七'], ['eight','八'], ['nine','九'], ['ten','十'],
  ['page','侍者'], ['knight','騎士'], ['queen','皇后'], ['king','國王']
];
const minor = [
  ['權杖','wands',[
    [2,'趁動機清楚時啟動構想',-1,'先釐清動機不足或延遲的原因'],
    [1,'比較兩條路的資源與代價',-1,'釐清計畫的方向和讓決定卡住的條件'],
    [2,'觀察擴展計畫的外部回饋',-1,'先處理時程或合作延誤'],
    [2,'穩定已有成果與合作關係',0,'檢查眼前成果是否需要重新協調'],
    [-1,'區分有益競爭與消耗性爭執',1,'利用衝突降溫的時機談共識'],
    [2,'把公開認可轉為可持續的進度',-1,'檢查成果是否過度依賴外界肯定'],
    [1,'明確捍衛值得保留的立場',-1,'選擇值得承擔的防守成本'],
    [2,'讓訊息與行動及時對接',-1,'先排除溝通延宕或節奏混亂'],
    [1,'保持警覺並留足備援',-1,'辨認疲勞造成的防備反應'],
    [-2,'減少超出負荷的責任',1,'釋出或重新分派重擔'],
    [1,'用探索性的小任務驗證興趣',-1,'先為分散的熱情排出順序'],
    [2,'把衝勁投入近期可完成的工作',-1,'先收住衝動與反覆變向'],
    [2,'用有感染力的方式帶動參與',-1,'辨認比較心對判斷的影響'],
    [2,'先定下方向，再安排要投入的資源',-1,'檢查要求是否超過執行條件']
  ]],
  ['聖杯','cups',[
    [2,'為新感受與交流留出空間',-1,'先照顧尚未能表達的感受'],
    [2,'確認交流關係中彼此的承諾',-1,'處理關係中互惠失衡的地方'],
    [2,'善用群體的支持與回饋',-1,'留意群體相處中的消耗'],
    [0,'重新審視已被忽略的選項',1,'從停頓中重新接觸外界'],
    [-2,'承認失落並盤點還能保留的資源',1,'把逐步復原轉成下一步行動'],
    [1,'從過去的經驗找回支持',-1,'檢查懷舊是否限制當下選擇'],
    [-1,'用具體條件縮小選項',1,'從想像收斂到可執行的選擇'],
    [0,'確認哪些投入已缺乏意義',-1,'釐清離開與留下的顧慮'],
    [2,'辨認已實現且值得維持的成果',-1,'檢查滿足感是否只靠短期回報'],
    [2,'鞏固共享的支持與歸屬感',-1,'釐清理想關係與現況的落差'],
    [1,'認真對待新的情感訊息',-1,'讓模糊感受有更清楚的表達'],
    [1,'用具體承諾承接理想',-1,'檢查期待是否超過實際承諾'],
    [2,'聽見感受並維護情緒界線',-1,'留意照顧他人時的情緒耗損'],
    [2,'在情緒波動中維持穩定回應',-1,'先處理壓抑或失衡的情緒反應']
  ]],
  ['寶劍','swords',[
    [2,'用明確證據釐清核心問題',-1,'先澄清資訊與表述的混亂'],
    [0,'找出讓兩難無法收斂的資訊缺口',-1,'處理拖延決策造成的壓力'],
    [-2,'正視受傷或失望的來源',1,'找出已經開始癒合的地方'],
    [0,'安排休息與判斷緩衝',-1,'先處理休息不足帶來的疲憊'],
    [-2,'計算爭勝對關係與資源的代價',1,'利用和解或止損的機會'],
    [1,'有計畫地離開不穩定狀態',-1,'釐清轉換過程中未決的負擔'],
    [-1,'核對策略背後的資訊缺口',1,'把需要交代的事情說清楚'],
    [-2,'拆解限制並驗證仍可行的選擇',1,'善用重新取得選擇權的機會'],
    [-2,'將反覆擔憂改寫為可核對的事項',1,'借助支援減輕焦慮負荷'],
    [-2,'辨認耗盡的路徑並停止追加投入',1,'從谷底進展重建基本節奏'],
    [1,'先蒐集資料再做判斷',-1,'避免把未驗證的消息當事實'],
    [1,'集中處理已確認的關鍵問題',-1,'先停止缺乏核對的急進行動'],
    [2,'用清楚的標準與界線做判斷',-1,'檢查判斷是否被舊經驗拉偏'],
    [2,'依一致的邏輯分配責任與資源',-1,'檢查判斷是否遭權力左右']
  ]],
  ['錢幣','pentacles',[
    [2,'把新機會轉成具體資源或安排',-1,'先釐清機會的成本與條件'],
    [1,'依資源上限調整多項任務',-1,'先減少超出容量的承諾'],
    [2,'透過專長分工改善成果',-1,'釐清分工、品質與期待落差'],
    [0,'保留必要的資源緩衝',-1,'辨認過度防守的持有成本'],
    [-2,'找出短缺的資源與可求援的渠道',1,'把剛恢復的資源用於最急迫之處'],
    [2,'以清楚條件交換資源與支援',-1,'核對資源交換是否失衡'],
    [1,'用實際回報評估繼續投入的價值',-1,'停止效果欠佳的重複投入'],
    [2,'以反覆練習提高交付品質',-1,'修正低效重工或缺乏重點的練習'],
    [2,'用已建立的能力支持自主決定',-1,'評估維持表面成果的成本'],
    [2,'盤點長期累積的資源與支持',-1,'先釐清長期安排內的不穩定因素'],
    [1,'為新技能設定可衡量的練習目標',-1,'把鬆散的學習安排變得具體'],
    [1,'依穩定節奏推進日常工作',-1,'檢查例行是否已轉為停滯'],
    [2,'以務實安排支持生活與工作',-1,'重新平衡照顧與資源分配'],
    [2,'透過穩健管理維持長期成果',-1,'辨認過度控制對資源流動的影響']
  ]]
];
const position = {
  root:'根基',
  past:'過去',
  now:'現況',
  obstacle:'卡點與解法',
  inner:'內在',
  outer:'外在',
  action:'行動',
  trend:'趨勢'
};
const spreads = {
  3:{name:'三點', desc:'從過去、現況與趨勢抓住主線。', slots:[['past',25],['now',45],['trend',30]]},
  5:{name:'五點', desc:'看看事情的根基和現況，找出卡住的地方以及下一步。',slots:[['root',15],['now',25],['obstacle',20],['action',25],['trend',15]]},
  7:{name:'七點', desc:'加入內在與外在點位，檢查兩者如何影響下一步。',slots:[['root',10],['now',20],['obstacle',15],['inner',10],['outer',10],['action',20],['trend',15]]}
};
const deck = [
  ...major.map(([name, , ...values], i) => ({
    id: 'major-' + String(i).padStart(2, '0'), name, values
  })),
  ...minor.flatMap(([suit, suitId, cards]) => cards.map((values, i) => {
    const [rankId, label] = ranks[i];
    return {id: suitId + '-' + rankId, name: suit + label, values};
  }))
];
function randomBelow(limit) {
  const sample = new Uint32Array(1);
  const range = 2 ** 32;
  const ceiling = range - range % limit;
  do { crypto.getRandomValues(sample); } while (sample[0] >= ceiling);
  return sample[0] % limit;
}
function shuffleDeck() {
  const shuffled = deck.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = randomBelow(i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map(card => ({card, reversed: randomBelow(2) === 1}));
}
function calculate(points) {
  const base = points.reduce((sum, point) => sum + point.contribution, 0);
  const neighbors = points.slice(1).map((right, i) => {
    const left = points[i];
    const sameDirection = left.score * right.score > 0;
    return {left, right, score: sameDirection ? (left.score + right.score) / 2 : 0,
      weight: left.weight + right.weight};
  });
  const pairWeights = neighbors.reduce((sum, pair) => sum + pair.weight, 0);
  const pairs = neighbors.map(pair => ({...pair, contribution: pair.score * pair.weight / pairWeights}));
  const adjacent = pairs.reduce((sum, pair) => sum + pair.contribution, 0);
  const combined = base * .85 + adjacent * .15;
  const index = Math.round((50 + 25 * combined) * 10) / 10;
  return {base, pairs, pairWeights, adjacent, combined, index};
}

const root = document.getElementById('tarot-reading');
const $ = id => root.querySelector('#' + id);
const form = $('form');
const cards = $('cards');
const result = $('result');
const draw = $('draw');
const clear = $('clear');
const manualDeck = $('manual-deck');
const deckTitle = $('deck-title');
const shuffleStage = $('shuffle-stage');
const revealStage = $('reveal-stage');
const deckPicking = $('deck-picking');
const deckCards = $('deck-cards');
const deckViewport = $('deck-viewport');
const pickedPreview = $('picked-preview');
const flipMode = $('flip-mode');
const reveal = $('reveal');
const cardsPerRow = 13;
let selection;
let revealedPoints;
let revealRun;
const number = value => value.toFixed(1);
const signed = (value, digits = 0) => {
  const rounded = Number(value.toFixed(digits));
  return (rounded > 0 ? '+' : rounded < 0 ? '−' : '') + Math.abs(rounded).toFixed(digits);
};
const orientation = point => point.reversed ? '逆位' : '正位';
const direction = point => point.score > 0 ? 'support' : point.score < 0 ? 'obstacle' : 'neutral';
function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function cardArtwork({card, reversed}) {
  return window.MoonveilCardArt?.create(card.id, reversed)
    ?? element('span', '牌面暫時無法載入', 'tarot-art-fallback');
}
function cardCaption(point) {
  return [
    element('strong', point.card.name, 'card-name'),
    element('span', orientation(point), 'slot-orientation')
  ];
}
function displayCards(spread, points) {
  $('board-title').textContent = spread.name + '牌陣';
  $('board-desc').textContent = spread.desc;
  cards.dataset.count = spread.slots.length;
  cards.replaceChildren(...spread.slots.map(([key, weight], i) => {
    const slot = element('li', undefined, 'slot');
    const point = points?.[i];
    const tile = element('div', undefined, 'tile');
    slot.append(tile, element('span', position[key], 'slot-title'));
    if (point) {
      tile.classList.add('is-revealed');
      tile.append(cardArtwork(point));
      const caption = element('div', undefined, 'slot-card-caption');
      caption.append(...cardCaption(point));
      slot.append(caption);
    } else {
      const symbol = element('span', '✦', 'sigil');
      symbol.setAttribute('aria-hidden', 'true');
      tile.append(symbol);
    }
    slot.append(element('span', weight + '% 權重', 'weight text-small text-muted'));
    if (point) {
      const contribution = element('span', '貢獻 ' + signed(point.contribution, 2), 'contribution');
      contribution.dataset.direction = direction(point);
      slot.append(contribution);
    }
    return slot;
  }));
  const gallery = $('result-gallery');
  gallery.replaceChildren(...(points ?? []).map(point => {
    const item = element('li');
    const face = element('div', undefined, 'result-gallery-face');
    face.append(cardArtwork(point));
    item.append(face, ...cardCaption(point));
    return item;
  }));
  gallery.scrollLeft = 0;
  $('hint').textContent = points
    ? '已依牌陣順序完成抽牌。展開計算明細可核對每項貢獻。'
    : '從整副 78 張蓋牌中挑選。你選牌的順序，就是它們進入牌位的順序。';
}
function displayReading(points, question, theme) {
  const calc = calculate(points);
  const answer = multiPointReading.answer(points, theme, question, calc.index);
  const band = calc.index < 40 ? '牌面提醒先處理卡點' : calc.index >= 60 ? '牌面有較多助力' : '牌面有助力也有顧慮';
  $('conclusion-headline').textContent = answer.headline;
  $('conclusion').textContent = answer.body;
  $('conclusion-next').textContent = answer.nextStep;
  $('score').textContent = number(calc.index);
  $('bar').style.width = calc.index + '%';
  $('bar').parentElement.setAttribute('aria-valuenow', calc.index);
  $('band').textContent = band;
  $('summary').textContent = multiPointReading.summary(points, theme, question);
  $('pairing').textContent = multiPointReading.pairing(calc);
  $('reading-question').hidden = question.length === 0;
  $('reading-question').textContent = question ? '本次占問 · ' + question : '';
  $('reading').replaceChildren(...points.map(point => {
    const label = position[point.key];
    const line = element('li');
    const metric = element('span', `權重 ${point.weight}% · 貢獻 ${signed(point.contribution, 2)}`, 'point-metric');
    metric.dataset.direction = direction(point);
    line.append(
      element('strong', `${label} · ${point.card.name}（${orientation(point)}）`),
      metric,
      element('p', multiPointReading.perCard(point))
    );
    const href = window.MoonveilCardArt?.meaningUrl?.(point.card.id, point.reversed);
    if (href) {
      const link = element('a', '看這張牌的牌義', 'tarot-meaning-link');
      link.href = href;
      link.setAttribute('aria-label', `查看${point.card.name}${orientation(point)}牌義`);
      line.append(link);
    }
    return line;
  }));
  const pointDetails = element('ul');
  pointDetails.append(...points.map(p => element('li', `${position[p.key]} · ${signed(p.score)} × ${p.weight}% ＝ ${signed(p.contribution, 2)}`)));
  const pairDetails = element('ul');
  pairDetails.append(...calc.pairs.map(p => element('li',
    `${position[p.left.key]} × ${position[p.right.key]} · ${signed(p.score, 1)} × (${p.weight} / ${calc.pairWeights}) ≈ ${signed(p.contribution, 3)}`)));
  $('trace-body').replaceChildren(
    element('p', '點位加權值 ＝ ' + signed(calc.base, 2)), pointDetails,
    element('p', '配對加權值 ≈ ' + signed(calc.adjacent, 3)), pairDetails,
    element('p', `混合值 ≈ (${signed(calc.base, 2)}) × 0.85 ＋ (${signed(calc.adjacent, 3)}) × 0.15 ＝ ${signed(calc.combined, 3)}`),
    element('p', `指數 ≈ 50 ＋ 25 × (${signed(calc.combined, 3)}) ＝ ${number(calc.index)}`));
  $('trace').open = false;
  result.hidden = false;
  $('status').textContent = '抽牌完成。' + answer.headline;
}
function activeSpread() {
  return spreads[new FormData(form).get('spread')];
}
function renderResult() {
  const settings = new FormData(form);
  displayReading(revealedPoints, settings.get('question').trim(), settings.get('theme'));
}
function makeDeckButton(index) {
  const button = element('button', undefined, 'deck-card');
  button.type = 'button';
  const offset = index % cardsPerRow - (cardsPerRow - 1) / 2;
  button.style.setProperty('--fan-offset', offset);
  button.style.setProperty('--fan-angle', `${offset * 2}deg`);
  button.style.setProperty('--fan-rise', `${12 - offset * offset / 3}px`);
  const sigil = element('span', '☾', 'deck-sigil');
  sigil.setAttribute('aria-hidden', 'true');
  const order = element('span', '', 'deck-order');
  order.setAttribute('aria-hidden', 'true');
  button.append(sigil, order);
  button.addEventListener('click', () => {
    if (!selection || revealRun) return;
    const picked = selection.picks.indexOf(index);
    const openNow = picked < 0 && selection.mode === 'instant' && selection.picks.length < selection.spread.slots.length;
    if (picked >= 0) {
      if (selection.mode === 'instant') return;
      selection.picks.splice(picked, 1);
    } else if (selection.picks.length < selection.spread.slots.length) {
      selection.picks.push(index);
    }
    updateSelection();
    if (openNow) {
      window.MoonveilTarotReveal?.accent(button);
      window.MoonveilTarotReveal?.accent(pickedPreview.children[selection.picks.length - 1].querySelector('.pick-preview-art'));
    }
    if (!reveal.disabled) reveal.focus({preventScroll:true});
    else if (selection.mode === 'instant') {
      const buttons = [...deckCards.children];
      const next = buttons.slice(index + 1).find(card => !card.disabled) ?? buttons.find(card => !card.disabled);
      next?.focus({preventScroll:true});
    }
  });
  return button;
}
function pointForSlot([key, weight], order) {
  const {card, reversed} = selection.options[selection.picks[order]];
  const [score, meaning] = card.values.slice(reversed ? 2 : 0);
  return {key, weight, card, reversed, score, meaning, contribution: score * weight / 100};
}
function displayPickedPreview() {
  const {spread, picks, mode} = selection;
  const instant = mode === 'instant';
  pickedPreview.classList.toggle('has-card-art', instant);
  if (instant) pickedPreview.tabIndex = 0;
  else pickedPreview.removeAttribute('tabindex');
  pickedPreview.replaceChildren(...spread.slots.map((slot, order) => {
    const picked = order < picks.length;
    const opened = picked && instant;
    const preview = element('li', undefined, 'pick-preview-slot');
    preview.classList.toggle('is-picked', picked);
    preview.classList.toggle('is-open', opened);
    const mark = element('span', String(order + 1), 'pick-preview-mark');
    if (instant) {
      const face = element('div', undefined, 'pick-preview-art');
      if (opened) {
        const point = pointForSlot(slot, order);
        face.append(cardArtwork(point));
        mark.textContent = point.card.name;
        mark.append(element('span', orientation(point), 'pick-preview-orientation'));
      }
      preview.append(face);
    }
    preview.append(mark, element('span', position[slot[0]], 'pick-preview-position'));
    return preview;
  }));
}
function updateSelection() {
  const {spread, picks, mode} = selection;
  const total = spread.slots.length;
  const complete = picks.length === total;
  const instant = mode === 'instant';
  [...deckCards.children].forEach((button, index) => {
    const order = picks.indexOf(index);
    const selected = order >= 0;
    const opened = instant && selected;
    const drawn = selection.options[index];
    if (opened && !button.classList.contains('is-open')) {
      button.firstElementChild.replaceWith(cardArtwork(drawn));
    }
    const pickedName = opened ? `牌，${drawn.card.name}（${orientation(drawn)}）` : '蓋牌';
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', selected
      ? `第 ${index + 1} 張${pickedName}，已選為第 ${order + 1} 張，牌位${position[spread.slots[order][0]]}`
      : `選擇第 ${index + 1} 張蓋牌`);
    button.classList.toggle('is-open', opened);
    button.lastElementChild.textContent = selected ? String(order + 1) : '';
    button.disabled = instant ? selected || complete : complete && !selected;
  });
  flipMode.disabled = picks.length > 0;
  reveal.disabled = !complete;
  const next = complete
    ? instant ? '牌都翻開了，可以看完整解讀。' : '現在可以翻牌，也可以點一張已選的牌取消。'
    : `下一張放在「${position[spread.slots[picks.length][0]]}」。`;
  const latest = instant && selection.options[picks.at(-1)];
  const openedCard = latest ? `翻到${latest.card.name}（${orientation(latest)}）。 ` : '';
  $('draw-status').textContent = `已選 ${picks.length}／${total} 張。 ${openedCard}${next}`;
  displayPickedPreview();
}
function clearReading() {
  if (revealRun) {
    revealRun.abort();
    revealRun = undefined;
  }
  selection = undefined;
  revealedPoints = undefined;
  displayCards(activeSpread());
  manualDeck.hidden = true;
  shuffleStage.hidden = true;
  deckPicking.hidden = true;
  deckCards.replaceChildren();
  pickedPreview.replaceChildren();
  flipMode.disabled = false;
  reveal.disabled = true;
  reveal.hidden = true;
  result.hidden = true;
  clear.hidden = true;
  draw.disabled = false;
  draw.textContent = '洗牌並展開';
  $('status').textContent = '可以開始洗牌。';
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (draw.disabled) return;

  clearReading();
  const currentSelection = {spread: activeSpread(), options: shuffleDeck(), picks: [], mode: flipMode.value};
  selection = currentSelection;
  draw.disabled = true;
  draw.textContent = '洗牌中…';
  flipMode.disabled = true;
  clear.textContent = '取消洗牌';
  clear.hidden = false;
  deckTitle.textContent = '洗牌';
  $('draw-status').textContent = '正在洗牌，洗好後會展開整副牌。';
  manualDeck.hidden = false;
  deckTitle.focus();

  await window.playTarotShuffle?.(shuffleStage);
  if (selection !== currentSelection) return;

  deckCards.replaceChildren(...selection.options.map((_, index) => makeDeckButton(index)));
  deckTitle.textContent = '從 78 張牌中選牌';
  deckPicking.hidden = false;
  deckViewport.scrollLeft = 0;
  draw.textContent = '重新洗牌';
  draw.disabled = false;
  clear.textContent = '清除結果';
  reveal.textContent = selection.mode === 'instant' ? '看完整解讀' : '翻牌看解讀';
  reveal.hidden = false;
  updateSelection();
});
reveal.addEventListener('click', async () => {
  if (!selection || revealRun || selection.picks.length !== selection.spread.slots.length) return;

  const {spread, mode} = selection;
  const points = spread.slots.map(pointForSlot);
  if (mode === 'batch') {
    const run = new AbortController();
    revealRun = run;
    reveal.disabled = true;
    draw.disabled = true;
    draw.textContent = '翻牌中…';
    clear.textContent = '取消翻牌';
    deckPicking.hidden = true;
    deckTitle.textContent = '翻牌中';
    $('draw-status').textContent = '正在依序翻開你選的牌。';
    deckTitle.focus();
    const entries = points.map(({card, reversed}) => ({id:card.id, name:card.name, reversed}));
    try {
      await window.MoonveilTarotReveal?.play(revealStage, entries, run.signal);
    } catch {
      // Show the reading even when the effect cannot play.
    }
    if (revealRun !== run) return;
    revealRun = undefined;
  }
  revealedPoints = points;
  selection = undefined;
  manualDeck.hidden = true;
  deckCards.replaceChildren();
  pickedPreview.replaceChildren();
  flipMode.disabled = false;
  reveal.disabled = true;
  draw.disabled = false;
  draw.textContent = '再抽一次';
  clear.textContent = '清除結果';
  displayCards(spread, revealedPoints);
  renderResult();
  $('result-title').focus({preventScroll:true});
  result.scrollIntoView({block:'start'});
});
form.addEventListener('change', event => {
  if (event.target.name === 'spread' || (event.target === flipMode && selection)) clearReading();
  if (event.target.name === 'theme' && revealedPoints) renderResult();
});
deckCards.addEventListener('keydown', event => {
  const steps = {ArrowLeft: -1, ArrowRight: 1, ArrowUp: -cardsPerRow, ArrowDown: cardsPerRow};
  const step = steps[event.key];
  const buttons = [...deckCards.children];
  const start = buttons.indexOf(event.target);
  if (!step || start < 0) return;

  event.preventDefault();
  for (let index = start + step; buttons[index]; index += step) {
    if (!buttons[index].disabled) {
      buttons[index].focus();
      break;
    }
  }
});
clear.addEventListener('click', () => {
  clearReading();
  draw.focus();
});
displayCards(activeSpread());

})();
