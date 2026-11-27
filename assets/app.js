"use strict";

const byId = (id) => document.getElementById(id);
const form = byId("reading-form");
const question = byId("question");
const themeSelect = byId("theme-select");
const draw = byId("draw");
const drawTitle = byId("draw-title");
const result = byId("result");
const board = byId("card-board");
const shuffleStage = byId("shuffle-stage");
const revealStage = byId("reveal-stage");
const spreadLink = byId("home-spread-link");
const spreadLinkDetail = byId("home-spread-link-detail");
const defaultSpreadLinkDetail = spreadLinkDetail.textContent;
const reshuffle = byId("reshuffle");
const reveal = byId("reveal");
const suggestions = byId("suggestions");
const dialog = byId("history-dialog");
const startDraw = byId("start-draw");
const showHistory = byId("show-history");
const retryDeck = byId("retry-deck");
const historyKey = "moonveil-readings-v1";
const themes = {
  general: {
    name: "自由占卜", count: 3, spreadId: "timeline",
    slots: [{ role: "past", label: "過去" }, { role: "present", label: "現在" }, { role: "direction", label: "可能方向" }],
    examples: ["我可以怎麼理解這段關係？","我適合換個工作方向嗎？","面對兩個選擇，我該留意什麼？"],
    reflection: "回到你的問題，這些牌意裡哪個部分最貼近你現在的感受？你能在這週做哪一件小事，驗證自己的想法？"
  },
  love: {
    name: "感情塔羅", count: 3, spreadId: "home-love",
    slots: [{ role: "self-state", label: "我的感受" }, { role: "present", label: "關係現況" }, { role: "relationship-direction", label: "相處方向" }],
    examples: ["我可以怎麼改善我們的溝通？","這段關係裡，我真正需要的是什麼？"],
    reflection: "關於這段關係，你希望對方了解你的哪一項需要？想一句可以從「我感受到……」開始的話。"
  },
  work: {
    name: "工作塔羅", count: 3, spreadId: "home-work",
    slots: [{ role: "present", label: "目前處境" }, { role: "obstacle", label: "值得留意的事" }, { role: "action", label: "下一步" }],
    examples: ["我適合換個工作方向嗎？","我該怎麼準備下一步的職涯發展？"],
    reflection: "哪一項工作條件對你最重要？在做決定前，你可以向誰了解情況，或先試做哪件小事？"
  },
  choice: {
    name: "選擇指引", count: 3, spreadId: "home-choice",
    slots: [{ role: "option-a", label: "選項 A" }, { role: "option-b", label: "選項 B" }, { role: "criterion", label: "取捨重點" }],
    examples: ["我該留在原職，還是嘗試新的機會？","我該現在開始，還是等準備好再行動？"],
    reflection: "把兩個選項都寫下來，想想各自最吸引你的地方、需要付出的代價，以及一個能幫你比較它們的標準。"
  },
  daily: {
    name: "今日一牌", count: 1, spreadId: "home-daily",
    slots: [{ role: "present", label: "今日主題" }, { role: "obstacle", label: "值得留意的事" }, { role: "action", label: "今日行動" }],
    examples: ["今天我最值得留意的是什麼？","今天我可以怎麼照顧自己？"],
    reflection: "從牌義挑一個今天想留意的詞。晚上回顧時，看看哪個片刻讓你想到它。"
  }
};
let theme = "general";
let session;
let shuffleRun;
let revealRun;
let tarotDeck;
let canonicalMeanings = {};
let records = [];
let savedLocally = true;

async function loadDeck(fromRetry = false) {
  retryDeck.disabled = true;
  byId("deck-status").textContent = "正在載入塔羅牌…";
  try {
    const meaningsRequest = Promise.resolve()
      .then(() => window.MoonveilTarotSpreadGuide?.loadMeanings?.())
      .catch(() => undefined);
    const response = await fetch("./data/cards.json");
    if (!response.ok) throw new Error("Card data request failed");
    const cards = await response.json();
    const requiredFields = ["id", "name_zh_hant", "symbol", "keyword_zh_hant", "upright_zh_hant", "reversed_zh_hant"];
    const validDeck = Array.isArray(cards) && cards.length === 78 &&
      cards.every((card, index) => card && card.deck_index === index &&
        requiredFields.every((field) => typeof card[field] === "string" && card[field].trim()));
    if (!validDeck || new Set(cards.map((card) => card.id)).size !== 78) {
      throw new Error("Invalid card data");
    }
    tarotDeck = cards;
    canonicalMeanings = (await meaningsRequest) ?? {};
  } catch {
    byId("deck-status").textContent = "暫時無法載入牌卡資料，請再試一次。";
    retryDeck.hidden = false;
    retryDeck.disabled = false;
    if (fromRetry) retryDeck.focus();
    return;
  }
  records = readHistory();
  startDraw.disabled = false;
  showHistory.disabled = false;
  byId("deck-notice").hidden = true;
  if (fromRetry) startDraw.focus();
}

function node(tag, value, className) {
  const element = document.createElement(tag);
  if (value) element.textContent = value;
  if (className) element.className = className;
  return element;
}

function selectedSpreadCount() {
  return Number(form.querySelector('input[name="spread"]:checked').value);
}

function spreadFor(themeKey, count) {
  if (count === 1) {
    return { spreadId: "single", slots: [{ role: "action", label: themeKey === "daily" ? "今日指引" : "當下指引" }] };
  }
  return themes[themeKey];
}

function describePositions({slots}) {
  return (slots.length === 1 ? "牌位是" : "牌位依序是") + slots.map(({label}) => label).join("、") + "。";
}

function updateSpreadPreview() {
  byId("home-spread-preview").textContent = describePositions(spreadFor(theme, selectedSpreadCount()));
}

function updateSpreadRecommendation() {
  const enteredQuestion = question.value.trim();
  const preset = enteredQuestion && window.MoonveilTarotSpreadGuide?.recommend?.(enteredQuestion, theme);
  spreadLink.setAttribute("href", preset ? `./multipoint/?spread=${encodeURIComponent(preset.id)}#spread-select` : "./multipoint/#spread-select");
  spreadLinkDetail.textContent = preset ? `${preset.name} · ${preset.description ?? preset.reason}` : defaultSpreadLinkDetail;
}

function updateQuestion() {
  byId("question-count").textContent = question.value.length + " / 160";
  updateSpreadRecommendation();
}

function show(stage, focusId) {
  if (stage !== "draw" && revealRun) {
    revealRun.abort();
    revealRun = undefined;
  }
  if (stage !== "draw" && shuffleRun) {
    shuffleRun = undefined;
    shuffleStage.hidden = true;
  }
  form.hidden = stage !== "form";
  draw.hidden = stage !== "draw";
  result.hidden = stage !== "result";
  suggestions.hidden = stage !== "form";
  if (focusId) byId(focusId).focus();
}

function setSuggestions() {
  const choices = themes[theme].examples.map((example) => {
    const button = node("button", example);
    button.type = "button";
    button.addEventListener("click", () => {
      question.value = example;
      updateQuestion();
      question.focus();
    });
    return button;
  });
  suggestions.replaceChildren(...choices);
}

function selectTheme(key, focusId) {
  theme = key;
  const config = themes[key];
  themeSelect.value = theme;
  form.querySelector('input[value="' + config.count + '"]').checked = true;
  setSuggestions();
  updateSpreadPreview();
  updateSpreadRecommendation();
  show("form", focusId);
}

async function shuffle() {
  if (shuffleRun || revealRun || draw.hidden) return;
  const run = session;
  shuffleRun = run;
  drawTitle.textContent = "洗牌";
  if (document.activeElement === reshuffle) drawTitle.focus({preventScroll:true});
  reshuffle.disabled = true;
  reveal.disabled = true;
  board.hidden = true;
  board.replaceChildren();
  byId("draw-status").textContent = "正在洗牌，請稍候。";

  const indices = tarotDeck.map((_, index) => index);
  for (let upper = indices.length - 1; upper > 0; upper--) {
    const index = Math.floor(Math.random() * (upper + 1));
    [indices[upper], indices[index]] = [indices[index], indices[upper]];
  }
  run.options = indices.map((index) => ({index, reversed: Math.random() < 0.5}));
  run.picks = [];

  try {
    await window.playTarotShuffle?.(shuffleStage);
  } catch {
    // The deck is ready even if the visual effect is interrupted.
  }
  if (shuffleRun !== run) return;
  shuffleRun = undefined;
  shuffleStage.hidden = true;
  drawTitle.textContent = "選擇你的牌";
  board.replaceChildren(...run.options.map((_, index) => createBack(index)));
  board.scrollTop = 0;
  board.hidden = false;
  reshuffle.disabled = false;
  updateBoard();
}

function createBack(index) {
  const button = node("button", "", "tarot-back");
  button.type = "button";
  const motif = node("span", "☾");
  motif.setAttribute("aria-hidden", "true");
  const order = node("span", "", "pick-order");
  order.setAttribute("aria-hidden", "true");
  button.append(motif, order);
  button.addEventListener("click", () => {
    if (shuffleRun || revealRun || draw.hidden || button.parentNode !== board) return;
    const orderIndex = session.picks.indexOf(index);
    if (orderIndex >= 0) session.picks.splice(orderIndex, 1);
    else if (session.picks.length < session.count) session.picks.push(index);
    updateBoard();
  });
  return button;
}

function updateBoard() {
  const {picks, count} = session;
  const complete = picks.length === count;
  [...board.children].forEach((button, index) => {
    const order = picks.indexOf(index) + 1;
    button.setAttribute("aria-pressed", String(Boolean(order)));
    button.setAttribute("aria-label", order ? "第 " + (index + 1) + " 張牌，已選為第 " + order + " 順位" : "選擇第 " + (index + 1) + " 張牌");
    button.lastElementChild.textContent = order ? String(order) : "";
    button.disabled = complete && !order;
  });
  reveal.disabled = !complete;
  byId("draw-status").textContent = complete
    ? "選牌完成。準備好就翻牌，也可以點已選的牌來取消。"
    : "從 " + session.options.length + " 張牌中選 " + count + " 張，目前已選 " + picks.length + " 張。";
}

function makeResultCard({cardId, name, keyword, reversed, label, meaning}, summary) {
  const article = node("article", "", "result-card");
  const face = node("div", "", "face");
  const illustration = window.MoonveilCardArt?.create?.(cardId, reversed);
  face.append(illustration ?? node("span", "牌面暫時無法載入", "tarot-art-fallback"));
  const orientation = reversed ? "逆位" : "正位";
  article.append(
    face,
    node("p", label + " · " + orientation, "kicker"),
    node("h3", name + "｜" + keyword),
    node("p", summary || meaning)
  );
  const href = window.MoonveilCardArt?.meaningUrl?.(cardId, reversed);
  if (href) {
    const link = node("a", "看這張牌的牌義", "tarot-meaning-link");
    link.href = href;
    link.setAttribute("aria-label", `查看${name}${orientation}牌義`);
    article.append(link);
  }
  return article;
}

function analyzeForDisplay(reading, {spreadId, slots}) {
  const entries = reading.entries.map(({index, reversed}, position) => {
    const card = tarotDeck[index];
    const orientation = reversed ? "reversed" : "upright";
    const canonical = canonicalMeanings[card.id]?.[orientation];
    return {
      ...slots[position],
      cardId: card.id,
      name: card.name_zh_hant,
      keyword: card.keyword_zh_hant,
      reversed,
      meaning: typeof canonical === "string" && canonical.trim() ? canonical : card[`${orientation}_zh_hant`]
    };
  });
  let analysis;
  try {
    analysis = window.MoonveilSpreadReading?.analyze?.({spreadId, entries, theme:reading.theme, question:reading.question});
  } catch {
    // The existing reading is still available if the role analysis fails.
  }
  if (!analysis) {
    const labels = slots.map(({label}) => label);
    analysis = buildReadingAnalysis(reading.theme, reading.entries, labels, tarotDeck);
  }
  return {entries, analysis};
}

function displayReading(reading) {
  const config = themes[reading.theme];
  theme = reading.theme;
  themeSelect.value = theme;
  question.value = reading.question;
  form.querySelector('input[value="' + reading.entries.length + '"]').checked = true;
  updateQuestion();
  updateSpreadPreview();
  setSuggestions();
  const {entries, analysis} = analyzeForDisplay(reading, spreadFor(theme, reading.entries.length));
  byId("result-question").textContent = config.name + (reading.question ? "｜" + reading.question : "");
  byId("result-cards").replaceChildren(...entries.map((entry, index) => makeResultCard(entry, analysis.cardReadings?.[index]?.summary)));
  const paragraphs = analysis.paragraphs.map((paragraph) => node("p", paragraph));
  if (analysis.headline) {
    const headline = node("p", "", "spread-reading-headline");
    headline.append(node("strong", analysis.headline));
    paragraphs.unshift(headline);
  }
  byId("reading-synthesis").replaceChildren(...paragraphs);
  byId("reading-conclusion").textContent = analysis.conclusion;
  byId("reflection-title").textContent = analysis.nextStep ? "可以先做的一件事" : "給自己的提問";
  byId("reflection-text").textContent = analysis.nextStep || config.reflection;
  show("result", "result-title");
}

function readHistory() {
  try {
    const history = JSON.parse(localStorage.getItem(historyKey) || "[]");
    if (!Array.isArray(history)) return [];
    return history.filter((item) => item && Object.hasOwn(themes, item.theme) && typeof item.question === "string" &&
      Number.isFinite(item.at) && Array.isArray(item.entries) && [1, 3].includes(item.entries.length) &&
      item.entries.every((entry) => entry && Number.isInteger(entry.index) && tarotDeck[entry.index] && typeof entry.reversed === "boolean"));
  } catch {
    return [];
  }
}

function persistHistory() {
  try {
    if (records.length) localStorage.setItem(historyKey, JSON.stringify(records));
    else localStorage.removeItem(historyKey);
    savedLocally = true;
  } catch {
    savedLocally = false;
  }
}

function displayHistory() {
  byId("history-status").textContent = records.length ?
    (savedLocally ? "最多保留最近 20 筆抽牌。" : "目前無法寫入瀏覽器儲存空間。") :
    (savedLocally ? "目前沒有抽牌紀錄。" : "目前無法更新瀏覽器裡儲存的紀錄。");
  byId("history-list").replaceChildren(...records.map((reading) => {
    const button = node("button", "", "history-entry");
    button.type = "button";
    const date = new Date(reading.at);
    const time = node("time", date.toLocaleString("zh-TW", {dateStyle:"medium", timeStyle:"short"}));
    time.dateTime = date.toISOString();
    button.append(node("strong", reading.question || themes[reading.theme].name), time,
      node("span", reading.entries.map((entry) => tarotDeck[entry.index].name_zh_hant).join("、")));
    button.addEventListener("click", () => {
      dialog.close();
      displayReading(reading);
    });
    return button;
  }));
  byId("clear-history").hidden = !records.length;
  byId("confirm-clear").hidden = true;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!tarotDeck || form.hidden) return;
  session = {question:question.value.trim(), theme, count:selectedSpreadCount()};
  byId("draw-question").textContent = session.question || themes[theme].name;
  byId("draw-spread-preview").textContent = describePositions(spreadFor(session.theme, session.count));
  show("draw");
  shuffle();
  drawTitle.focus();
});
question.addEventListener("input", updateQuestion);
form.querySelector(".spread").addEventListener("change", updateSpreadPreview);
themeSelect.addEventListener("change", () => selectTheme(themeSelect.value));
byId("edit-question").addEventListener("click", () => show("form", "question"));
byId("start-over").addEventListener("click", () => show("form", "question"));
reshuffle.addEventListener("click", shuffle);
reveal.addEventListener("click", async () => {
  if (!session || shuffleRun || revealRun || session.picks.length !== session.count || draw.hidden) return;
  const run = new AbortController();
  revealRun = run;
  const reading = {
    theme:session.theme,
    question:session.question,
    entries:session.picks.map((index) => session.options[index]),
    at:Date.now()
  };
  reveal.disabled = true;
  reshuffle.disabled = true;
  board.hidden = true;
  drawTitle.textContent = "翻牌中";
  byId("draw-status").textContent = "正在翻開你選的牌。";
  drawTitle.focus();
  const entries = reading.entries.map(({index, reversed}) => ({
    id:tarotDeck[index].id, name:tarotDeck[index].name_zh_hant, reversed
  }));
  try {
    await window.MoonveilTarotReveal?.play(revealStage, entries, run.signal);
  } catch {
    // A failed visual effect still allows the selected reading to open.
  }
  if (revealRun !== run) return;
  revealRun = undefined;
  records = [reading, ...records].slice(0, 20);
  persistHistory();
  displayReading(reading);
});
document.querySelectorAll("[data-theme]").forEach((button) => {
  button.addEventListener("click", () => selectTheme(button.dataset.theme, "question"));
});
showHistory.addEventListener("click", () => {
  displayHistory();
  dialog.showModal();
});
byId("clear-history").addEventListener("click", () => {
  byId("clear-history").hidden = true;
  byId("confirm-clear").hidden = false;
  byId("cancel-clear").focus();
});
byId("cancel-clear").addEventListener("click", () => {
  byId("confirm-clear").hidden = true;
  byId("clear-history").hidden = false;
  byId("clear-history").focus();
});
byId("confirm-delete").addEventListener("click", () => {
  records = [];
  persistHistory();
  displayHistory();
  dialog.querySelector('button[type="submit"]').focus();
});

setSuggestions();
updateQuestion();
updateSpreadPreview();
retryDeck.addEventListener("click", () => loadDeck(true));
loadDeck();
