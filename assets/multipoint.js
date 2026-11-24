(() => {
'use strict';
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
const ranks = ['王牌','二','三','四','五','六','七','八','九','十','侍者','騎士','皇后','國王'];
const minor = [
  ['權杖','♧',[
    [2,'趁動機清楚時啟動構想',-1,'先釐清動機不足或延遲的原因'],
    [1,'比較兩條路的資源與代價',-1,'找出讓決策遲疑的限制'],
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
    [2,'以清楚的願景引導資源投入',-1,'檢查要求是否超過執行條件']
  ]],
  ['聖杯','♙',[
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
  ['寶劍','⚔',[
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
  ['錢幣','✺',[
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
  obstacle:'阻力',
  inner:'內在',
  outer:'外在',
  action:'行動',
  trend:'趨勢'
};
const spreads = {
  3:{name:'三點', desc:'從過去、現況與趨勢抓住主線。', slots:[['past',25],['now',45],['trend',30]]},
  5:{name:'五點', desc:'從根基、現況、阻力、行動與趨勢整理局勢。',slots:[['root',15],['now',25],['obstacle',20],['action',25],['trend',15]]},
  7:{name:'七點', desc:'加入內在與外在點位，檢查兩者如何影響下一步。',slots:[['root',10],['now',20],['obstacle',15],['inner',10],['outer',10],['action',20],['trend',15]]}
};
const deck = [
  ...major.map(([name, symbol, ...values]) => ({name, symbol, suit:'大阿爾克那', values})),
  ...minor.flatMap(([suit, symbol, cards]) => cards.map((values, i) => ({name:suit + ranks[i], symbol, suit, values})))
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
const manualDeck = $('manual-deck');
const deckCards = $('deck-cards');
const reveal = $('reveal');
let selection;
let revealedPoints;
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
function displayCards(spread, points) {
  $('board-title').textContent = spread.name + '牌陣';
  $('board-desc').textContent = spread.desc;
  cards.dataset.count = spread.slots.length;
  cards.replaceChildren(...spread.slots.map(([key, weight], i) => {
    const slot = element('li', undefined, 'slot');
    const point = points?.[i];
    const tile = element('div', undefined, 'tile');
    const symbol = element('span', point?.card.symbol ?? '✦', 'sigil');
    symbol.setAttribute('aria-hidden', 'true');
    tile.append(symbol);
    if (point) {
      tile.dataset.suit = point.card.suit;
      tile.classList.add('is-revealed');
      tile.classList.toggle('reversed', point.reversed);
      tile.append(element('strong', point.card.name, 'card-name'), element('span', orientation(point), 'text-small text-muted'));
    }
    slot.append(tile, element('span', position[key], 'slot-title'), element('span', weight + '% 權重', 'weight text-small text-muted'));
    if (point) {
      const contribution = element('span', '貢獻 ' + signed(point.contribution, 2), 'contribution');
      contribution.dataset.direction = direction(point);
      slot.append(contribution);
    }
    return slot;
  }));
  $('hint').textContent = points
    ? '已依牌陣順序完成抽牌。展開計算明細可核對每項貢獻。'
    : '從整副 78 張蓋牌中挑選。你選牌的順序，就是它們進入牌位的順序。';
}
function displayReading(points, question, theme) {
  const calc = calculate(points);
  const band = calc.index < 40 ? '阻力較強' : calc.index >= 60 ? '推力較強' : '推力與阻力接近';
  $('score').textContent = number(calc.index);
  $('bar').style.width = calc.index + '%';
  $('bar').parentElement.setAttribute('aria-valuenow', calc.index);
  $('band').textContent = band;
  $('summary').textContent = multiPointReading.summary(points, theme);
  $('pairing').textContent = multiPointReading.pairing(calc);
  $('conclusion').textContent = multiPointReading.conclusion(points, theme);
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
  $('status').textContent = `抽牌完成。牌陣推進指數 ${number(calc.index)}，${band}。`;
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
  const sigil = element('span', '☾', 'deck-sigil');
  sigil.setAttribute('aria-hidden', 'true');
  const order = element('span', '', 'deck-order');
  order.setAttribute('aria-hidden', 'true');
  button.append(sigil, order);
  button.addEventListener('click', () => {
    const picked = selection.picks.indexOf(index);
    if (picked >= 0) selection.picks.splice(picked, 1);
    else if (selection.picks.length < selection.spread.slots.length) selection.picks.push(index);
    updateSelection();
  });
  return button;
}
function updateSelection() {
  const {spread, picks} = selection;
  const total = spread.slots.length;
  const complete = picks.length === total;
  [...deckCards.children].forEach((button, index) => {
    const order = picks.indexOf(index);
    const selected = order >= 0;
    button.setAttribute('aria-pressed', String(selected));
    button.setAttribute('aria-label', selected
      ? `第 ${index + 1} 張蓋牌，已選為第 ${order + 1} 張，牌位${position[spread.slots[order][0]]}`
      : `選擇第 ${index + 1} 張蓋牌`);
    button.lastElementChild.textContent = selected ? String(order + 1) : '';
    button.disabled = complete && !selected;
  });
  reveal.disabled = !complete;
  const next = complete ? '現在可以翻牌，也可以點一張已選的牌取消。' : `下一張放在「${position[spread.slots[picks.length][0]]}」。`;
  $('draw-status').textContent = `已選 ${picks.length}／${total} 張。 ${next}`;
}
function clearReading() {
  selection = undefined;
  revealedPoints = undefined;
  displayCards(activeSpread());
  manualDeck.hidden = true;
  deckCards.replaceChildren();
  reveal.disabled = true;
  result.hidden = true;
  $('clear').hidden = true;
  $('draw').textContent = '開始選牌';
  $('status').textContent = '請開始選牌。';
}
form.addEventListener('submit', event => {
  event.preventDefault();
  clearReading();
  selection = {spread: activeSpread(), options: shuffleDeck(), picks: []};
  deckCards.replaceChildren(...selection.options.map((_, index) => makeDeckButton(index)));
  manualDeck.hidden = false;
  $('clear').hidden = false;
  $('draw').textContent = '重新洗牌';
  updateSelection();
  $('deck-title').focus();
});
reveal.addEventListener('click', () => {
  if (!selection || selection.picks.length !== selection.spread.slots.length) return;

  const {spread, options, picks} = selection;
  revealedPoints = spread.slots.map(([key, weight], order) => {
    const {card, reversed} = options[picks[order]];
    const [score, meaning] = card.values.slice(reversed ? 2 : 0);
    return {key, weight, card, reversed, score, meaning, contribution: score * weight / 100};
  });
  selection = undefined;
  manualDeck.hidden = true;
  deckCards.replaceChildren();
  reveal.disabled = true;
  $('draw').textContent = '再抽一次';
  displayCards(spread, revealedPoints);
  renderResult();
  $('board-title').focus();
});
form.addEventListener('change', event => {
  if (event.target.name === 'spread') clearReading();
  if (event.target.name === 'theme' && revealedPoints) renderResult();
});
$('clear').addEventListener('click', () => {
  clearReading();
  $('draw').focus();
});
displayCards(activeSpread());

})();
