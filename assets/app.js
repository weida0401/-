"use strict";

const byId = (id) => document.getElementById(id);
const form = byId("reading-form");
const question = byId("question");
const themeSelect = byId("theme-select");
const draw = byId("draw");
const result = byId("result");
const board = byId("card-board");
const reveal = byId("reveal");
const suggestions = byId("suggestions");
const dialog = byId("history-dialog");
const startDraw = byId("start-draw");
const showHistory = byId("show-history");
const retryDeck = byId("retry-deck");
const historyKey = "moonveil-readings-v1";
const themes = {
  general: {
    name: "自由占卜", count: 3, slots: ["過去", "現在", "可能方向"],
    examples: ["我可以怎麼理解這段關係？","我適合換個工作方向嗎？","面對兩個選擇，我該留意什麼？"],
    reflection: "回到你的問題，這些牌意裡哪個部分最貼近你現在的感受？你能在這週做哪一件小事，驗證自己的想法？"
  },
  love: {
    name: "感情塔羅", count: 3, slots: ["我的感受", "關係現況", "相處方向"],
    examples: ["我可以怎麼改善我們的溝通？","這段關係裡，我真正需要的是什麼？"],
    reflection: "關於這段關係，你希望對方了解你的哪一項需要？想一句可以從「我感受到……」開始的話。"
  },
  work: {
    name: "工作塔羅", count: 3, slots: ["目前處境", "值得留意的事", "下一步"],
    examples: ["我適合換個工作方向嗎？","我該怎麼準備下一步的職涯發展？"],
    reflection: "哪一項工作條件對你最重要？在做決定前，你可以向誰了解情況，或先試做哪件小事？"
  },
  choice: {
    name: "選擇指引", count: 3, slots: ["選項 A", "選項 B", "取捨重點"],
    examples: ["我該留在原職，還是嘗試新的機會？","我該現在開始，還是等準備好再行動？"],
    reflection: "把兩個選項都寫下來，想想各自最吸引你的地方、需要付出的代價，以及一個能幫你比較它們的標準。"
  },
  daily: {
    name: "今日一牌", count: 1, slots: ["今日主題", "值得留意的事", "今日行動"],
    examples: ["今天我最值得留意的是什麼？","今天我可以怎麼照顧自己？"],
    reflection: "從牌義挑一個今天想留意的詞。晚上回顧時，看看哪個片刻讓你想到它。"
  }
};
let theme = "general";
let session;
let tarotDeck;
let records = [];
let savedLocally = true;

async function loadDeck(fromRetry = false) {
  retryDeck.disabled = true;
  byId("deck-status").textContent = "正在載入塔羅牌…";
  try {
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

function updateCount() {
  byId("question-count").textContent = question.value.length + " / 160";
}

function show(stage, focusId) {
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
      updateCount();
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
  show("form", focusId);
}

function shuffle() {
  const indices = tarotDeck.map((_, index) => index);
  for (let upper = indices.length - 1; upper > 0; upper--) {
    const index = Math.floor(Math.random() * (upper + 1));
    [indices[upper], indices[index]] = [indices[index], indices[upper]];
  }
  session.options = indices.map((index) => ({index, reversed: Math.random() < 0.5}));
  session.picks = [];
  board.replaceChildren(...session.options.map((_, index) => createBack(index)));
  board.scrollTop = 0;
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

function makeResultCard(entry, position) {
  const card = tarotDeck[entry.index];
  const article = node("article", "", "result-card");
  const face = node("div", "", entry.reversed ? "face reversed" : "face");
  face.setAttribute("aria-hidden", "true");
  face.append(node("span", card.symbol));
  const orientation = entry.reversed ? "逆位" : "正位";
  article.append(
    face,
    node("p", position + " · " + orientation, "kicker"),
    node("h3", card.name_zh_hant + "｜" + card.keyword_zh_hant),
    node("p", entry.reversed ? card.reversed_zh_hant : card.upright_zh_hant)
  );
  return article;
}

function displayReading(reading) {
  const config = themes[reading.theme];
  theme = reading.theme;
  themeSelect.value = theme;
  question.value = reading.question;
  form.querySelector('input[value="' + reading.entries.length + '"]').checked = true;
  updateCount();
  setSuggestions();
  const positions = reading.entries.length === 1 ? [theme === "daily" ? "今日指引" : "當下指引"] : config.slots.length === 3 ? config.slots : themes.general.slots;
  byId("result-question").textContent = config.name + (reading.question ? "｜" + reading.question : "");
  byId("result-cards").replaceChildren(...reading.entries.map((entry, index) => makeResultCard(entry, positions[index])));
  const {paragraphs, conclusion} = buildReadingAnalysis(reading.theme, reading.entries, positions, tarotDeck);
  byId("reading-synthesis").replaceChildren(...paragraphs.map((paragraph) => node("p", paragraph)));
  byId("reading-conclusion").textContent = conclusion;
  byId("reflection-text").textContent = config.reflection;
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
  if (!tarotDeck) return;
  session = {question:question.value.trim(), theme, count:Number(new FormData(form).get("spread"))};
  byId("draw-question").textContent = session.question || themes[theme].name;
  shuffle();
  show("draw", "draw-title");
});
question.addEventListener("input", updateCount);
themeSelect.addEventListener("change", () => selectTheme(themeSelect.value));
byId("edit-question").addEventListener("click", () => show("form", "question"));
byId("start-over").addEventListener("click", () => show("form", "question"));
byId("reshuffle").addEventListener("click", shuffle);
reveal.addEventListener("click", () => {
  if (!session || session.picks.length !== session.count || draw.hidden) return;
  const reading = {
    theme:session.theme,
    question:session.question,
    entries:session.picks.map((index) => session.options[index]),
    at:Date.now()
  };
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
updateCount();
retryDeck.addEventListener("click", () => loadDeck(true));
loadDeck();
