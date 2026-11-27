(() => {
  'use strict';

  const roles = {
    past: '過去', present: '現在', direction: '可能走向', assumption: '目前的想法', unseen: '可能漏看的地方',
    root: '核心', obstacle: '卡住的地方', action: '可以先做的事', resource: '可用的資源',
    inner: '內在狀態', outer: '外在條件', risk: '需要留意的地方',
    'option-a': 'A 的現況', 'option-b': 'B 的現況', 'option-a-direction': 'A 的可能走向',
    'option-b-direction': 'B 的可能走向', criterion: '最在意的條件',
    'self-state': '我的狀態', 'self-approach': '我怎麼靠近', 'partner-state': '對方的互動線索',
    'partner-approach': '目前的互動方式', 'relationship-direction': '關係的可能走向',
  };
  const aliases = { foundation: 'root', now: 'present', current: 'present', trend: 'direction', outcome: 'direction', potential: 'direction', support: 'resource', advice: 'action' };
  const defaultRoles = {
    single: ['action'], timeline: ['past', 'present', 'direction'], blindspot: ['assumption', 'unseen', 'action'],
    core: ['root', 'obstacle', 'action', 'resource'], options: ['option-a', 'option-b', 'option-a-direction', 'option-b-direction', 'criterion'],
    relationship: ['self-state', 'self-approach', 'partner-state', 'partner-approach', 'relationship-direction'],
    'home-love': ['self-state', 'present', 'relationship-direction'], 'home-work': ['present', 'obstacle', 'action'],
    'home-choice': ['option-a', 'option-b', 'criterion'], 'home-daily': ['present', 'obstacle', 'action'],
  };
  const weightedRoles = {
    3: defaultRoles.timeline, 5: ['root', 'present', 'obstacle', 'action', 'direction'],
    7: ['past', 'present', 'obstacle', 'inner', 'outer', 'action', 'direction'],
  };
  const brighterCards = new Set(['major-03', 'major-14', 'major-17', 'major-19', 'major-21', 'cups-two', 'cups-ten', 'wands-six', 'pentacles-ten']);
  const partnerRoles = new Set(['partner-state', 'partner-approach']);
  const choiceProfiles = new Set(['options', 'home-choice']);
  const relationshipProfiles = new Set(['relationship', 'home-love']);

  const topics = [
    ['investment', /投資|股票|股市|標的|基金|加密|虛擬幣|買進|交易|獲利|進場|下注|賭|\bETF\b/i,
      '先確認這筆投資的風險和退出條件。', '這筆投資能不能做，要看風險是否在你能承受的範圍內。資訊有缺口時，先等你查清楚再決定。', '查這個標的的費用、最壞情況可能損失多少，以及到什麼條件你會退出。'],
    ['health', /病情|生病|症狀|手術|治療|懷孕|受傷|健康|看診|吃藥|停藥/,
      '先把目前想確認的健康問題說清楚。', '能幫你回答身體狀況的是檢查和醫療評估。把這組牌留給你面對等待和不確定時的感受。', '記下最困擾你的情況和出現時間，整理成一個要向醫療人員確認的問題。'],
    ['interview', /錄取|面試|求職|應徵/,
      '這次可以跟進面試進度。', '還在等面試消息的話，可以主動跟進一次，以對方正式回覆為準。', '問招募窗口預計哪天會回覆，並把下一次跟進的時間先記下來。'],
    ['offer', /拿到\s*offer|\boffer\b|新工作|轉職|跳槽|離職/i,
      '把這次工作的進度和條件問清楚。', '如果還在等消息，先以對方正式回覆為準。手上已經有邀約的話，工作內容和條件問清楚之後，就比較好決定。', '如果在等通知，問招募窗口預計哪天回覆。如果已收到邀約，確認薪資、工時和實際做的事。'],
    ['reunion', /復合|挽回|前任|前男友|前女友|分手後|重新在一起/,
      '先看你們能不能談開上次分開的原因。', '有沒有重新開始的空間，要看兩人願不願意談上次的問題，也要看後續做法有沒有改變。', '如果對方願意聊，挑一件當時卡住你們的事，問兩人各自願意怎麼調整。'],
    ['romance', /喜歡我|愛我|想我|告白|曖昧|交往|約會|脫單|桃花|感情|伴侶|戀愛|這段關係/,
      '可以先看一次清楚的邀約會得到什麼回應。', '這段關係能不能往前，取決於你說清楚想法後，對方的回應是否明確、後續是否願意配合。', '發一個有具體時間的輕鬆邀約，留意對方會不會給明確答覆或主動提另一個時間。'],
    ['money', /財務|財運|借錢|借貸|買房|賣房|存錢|預算|負債|還債/,
      '先確認手上的金額和可承擔的範圍。', '這筆錢怎麼安排，要以實際收支和固定負擔決定。先看每月能留下多少，才知道有多少空間可以調整。', '把固定支出和近期一定會付的費用列出來，再算目前可用的金額。'],
    ['move', /搬家|搬遷|租屋|搬出去|換房/,
      '先確認搬過去後，日常真的會比較好過。', '搬家的選擇可以等你核對通勤、租金和周邊生活後再定。有一項長期負擔太大，就值得再看另一個地方。', '挑平常通勤時段跑一次新路線，再把租金、水電和交通一起算進每月預算。'],
    ['exam', /考試|國考|升學|學測|統測|考上|申請學校/,
      '先補眼前最有機會拿回的分數。', '這組牌可以用來整理接下來怎麼準備。複習做完後，拿一次限時練習看調整有沒有用。', '從最近做錯的題目選出一個常失分的題型，今天做一小組同類題並訂正。'],
    ['work', /工作|同事|主管|專案|合作|職涯|公司|升遷|加薪|創業|業績|案子/,
      '先把接下來要交付的事定得更清楚。', '這件工作有沒有往前，可以看下一次交付能不能如期完成，以及需要配合的人有沒有確認分工。', '和需要配合的人確認下一個要交的東西、誰負責，以及什麼時候要看到第一版。'],
    ['daily', /今天|今日|明天|近期提醒|這一天/,
      '今天先把力氣留給一件重要的事。', '今天可以先處理最有影響的一件事。做完後再按手上的時間和精神安排下一件。', '寫下一件今天完成就會輕鬆一點的事，留一段時間專心做它。'],
  ];
  const topicById = new Map(topics.map(topic => [topic[0], topic]));

  function clean(value) {
    return typeof value === 'string' ? value.trim() : '';
  }

  function questionWithoutEnd(question) {
    return question.replace(/[？?。！!\s]+$/u, '');
  }

  function chooseTopic(question, theme, spreadId) {
    const fromQuestion = topics.find(([, pattern]) => pattern.test(question));
    if (fromQuestion) return fromQuestion;
    if (theme === 'love' || spreadId === 'home-love') return topicById.get('romance');
    if (theme === 'work' || spreadId === 'home-work') return topicById.get('work');
    if (theme === 'daily' || spreadId === 'home-daily') return topicById.get('daily');
    return null;
  }

  function optionNames(question, optionA, optionB) {
    const parts = questionWithoutEnd(question).split(/還是|或是/u).map(clean);
    const inferredA = parts[0].replace(/^(?:我|我們)?(?:應不應該|應該|是不是該|到底要|要不要|要|該|想在)\s*/u, '');
    const infer = parts.length === 2 && inferredA && parts[1] && inferredA.length <= 35 && parts[1].length <= 35;
    return [clean(optionA) || (infer ? inferredA : '選項 A'), clean(optionB) || (infer ? parts[1] : '選項 B')];
  }

  function cardTitle(card) {
    return `${card.name}（${card.reversed ? '逆位' : '正位'}）`;
  }

  function cue(card) {
    const keyword = card.keyword.split(/[、，,／/]/u).map(clean).filter(Boolean)[0];
    return keyword ? `${cardTitle(card)}提到的「${keyword}」` : cardTitle(card);
  }

  function sentence(value) {
    return value.match(/^[^。！？]+[。！？]?/u)?.[0] || '';
  }

  function signalFor(card) {
    return (card.signal || sentence(card.meaning) || card.keyword || card.name).replace(/[。！？]+$/u, '');
  }

  function roleNote(card) {
    const meaning = !card.signal && card.meaning ? sentence(card.meaning) : '';
    return `${card.summary}${meaning}`;
  }

  function describeCard(card) {
    return card.summary.includes(card.name) ? roleNote(card) : `${cardTitle(card)}放在「${card.label}」。${roleNote(card)}`;
  }

  function fallbackSummary(card) {
    const point = cue(card);
    if (partnerRoles.has(card.role)) return `${point}可以拿來核對實際互動。回頭看對方有沒有清楚回應、主動聯絡，或做了答應的事。`;
    if (card.role === 'obstacle' || card.role === 'risk') {
      if (!card.reversed && brighterCards.has(card.cardId)) return `${point}本來可以幫忙，現在容易因為期待太高、用力過頭，或時機還沒到而卡住。`;
      return `${point}指出最容易停住的一環。先處理這一段，後面的事才比較做得下去。`;
    }
    const descriptions = {
      past: `${point}能幫你理解，為什麼你現在會習慣用這種方式處理。`,
      present: `${point}對應眼下最容易感覺到的情況，可以先從這裡處理。`,
      direction: `照眼下的做法走下去，${point}是接下來可能浮現的變化。`,
      assumption: `${point}照見你目前怎麼理解這件事。可以先把親眼看到的部分列出來。`,
      unseen: `${point}是還可以查證的一塊，適合回頭核對遺漏的資訊。`,
      root: `${point}牽涉到這件事反覆卡住的原因，值得優先處理。`,
      action: card.reversed ? `${point}提醒你這一步可以做小一點，先調整你現在改得動的一件事。` : `${point}讓下一步比較清楚，可以用一個小動作開始。`,
      resource: `${point}指向眼下可借力的地方，可以拿來減輕下一步的負擔。`,
      inner: `${point}比較貼近你心裡在意的事，可以看它有沒有影響眼下的選擇。`,
      outer: `${point}指向外在條件，像是別人的配合、時程或手邊有多少資源。`,
      'option-a': `${point}描出這條路現在要面對的狀況。`,
      'option-b': `${point}描出這條路現在要面對的狀況。`,
      'option-a-direction': `這條路繼續走，${point}是值得留意的發展。`,
      'option-b-direction': `這條路繼續走，${point}是值得留意的發展。`,
      criterion: `${point}可以變成一條兩個選項都用得到的比較標準。`,
      'self-state': `${point}先放回自己的感受來看，你可能很在意這個部分。`,
      'self-approach': `${point}提醒你可以先從自己說的話和做的事著手。`,
      'relationship-direction': `如果兩人維持現在的相處方式，${point}是下一步值得留意的變化。`,
    };
    return descriptions[card.role] || `${point}可以拿來對照你眼前碰到的情況。`;
  }

  function fallbackAction(card) {
    if (card.cardId === 'wands-ten') return '挑一件你現在全包的事，今天就請一個人分擔其中一部分。';
    if (card.role === 'unseen' || card.role === 'assumption') return '把目前確定的事和自己的推測各寫一行，找一項可以向當事人確認的資訊。';
    if (partnerRoles.has(card.role) || card.role === 'self-approach') return '選一次可以好好說話的時候，說清楚一個需要，等對方用自己的話回應。';
    if (card.role === 'resource') return '列出一個能協助的人或工具，今天用它處理手上最花時間的一小段。';
    if (card.role === 'criterion') return '選一個你不能妥協的條件，替兩個選項各寫下一條能查證的證據。';
    if (card.reversed) return '挑出一件你現在做得太吃力的事，縮成一個今天能試、做完可以重看效果的步驟。';
    const bySuit = {
      wands: '挑一個不用先做大承諾的動作，今天做一次，看實際有沒有進展。',
      cups: '用一句話說出你最在意的事，留一點時間聽對方怎麼回應。',
      swords: '找出一項會改變你決定的資訊，今天向知道答案的人確認。',
      pentacles: '把這一步會用到的時間和費用列在一起，選一項今天能完成的準備。',
    };
    return bySuit[card.cardId.split('-')[0]] || '選一件今天能做完、做完就看得出變化的事，先把它做一次。';
  }

  function normalize(entry, fallbackRole, context) {
    const role = (Object.hasOwn(aliases, entry.role) ? aliases[entry.role] : entry.role);
    const knownRole = Object.hasOwn(roles, role) ? role : fallbackRole || 'present';
    const card = {
      role: knownRole, label: clean(entry.label) || roles[knownRole], cardId: clean(entry.cardId), name: clean(entry.name) || '這張牌',
      keyword: clean(entry.keyword), reversed: Boolean(entry.reversed), meaning: clean(entry.meaning),
    };
    const language = window.MoonveilTarotRoleLanguage?.describe?.(card, context);
    return { ...card, summary: clean(language?.summary) || fallbackSummary(card), action: clean(language?.action) || fallbackAction(card), signal: clean(language?.signal) };
  }

  function readOptions(byRole, context, topic) {
    const { optionA, optionB, question } = context;
    const criterion = byRole.criterion;
    const highStakes = topic?.[0] === 'investment' || topic?.[0] === 'health';
    const paragraphs = [['a', optionA], ['b', optionB]].map(([side, label]) => {
      const situation = byRole[`option-${side}`];
      const direction = byRole[`option-${side}-direction`];
      const start = situation ? `選「${label}」的話，現況看${cardTitle(situation)}。${roleNote(situation)}` : `「${label}」可以先確認走這條路需要哪些條件。`;
      const end = direction ? `這條路的走向看${cardTitle(direction)}。${roleNote(direction)}` : '先把這條路最難改的一個條件問清楚。';
      return `${start}${end}`;
    });
    if (criterion && highStakes) paragraphs.push(`${cardTitle(criterion)}放在取捨的位置。${roleNote(criterion)}`);
    const headline = `選「${optionA}」還是「${optionB}」，先用同一個條件來比。`;
    const decision = criterion ? `${criterion.summary}先考慮更符合這個條件、代價也能接受的那條路。` : '先留下做得到、代價也能接受的那條路。兩邊的資料還不齊，就先補齊再決定。';
    const conclusion = highStakes ? topic[3] : decision;
    const nextStep = highStakes ? topic[4]
      : criterion ? `把這個做法各用在「${optionA}」和「${optionB}」上。${criterion.action}`
        : '把兩個選項最重要的成本和能得到的結果各寫一行，再確認哪一欄還缺資料。';
    if (question && context.optionA === '選項 A' && context.optionB === '選項 B') paragraphs.push(`拿這兩條路回來對照你原來問的「${questionWithoutEnd(question)}」。`);
    return { headline, paragraphs, conclusion, nextStep };
  }

  function connect(byRole, profile, cards) {
    const { root, past, present, obstacle, action, resource, direction, inner, outer, risk, unseen, assumption } = byRole;
    const paragraphs = [];
    if (profile === 'single') return cards.length ? [describeCard(cards[0])] : [];
    if (relationshipProfiles.has(profile)) {
      const self = byRole['self-state'];
      const selfApproach = byRole['self-approach'];
      const partner = byRole['partner-state'];
      const partnerApproach = byRole['partner-approach'];
      const future = byRole['relationship-direction'] || direction;
      if (self || selfApproach) paragraphs.push([self, selfApproach].filter(Boolean).map(describeCard).join(''));
      if (partner || partnerApproach) {
        const clues = [partner, partnerApproach].filter(Boolean).map(card => `${cardTitle(card)}提到的「${signalFor(card)}」`).join('，以及');
        paragraphs.push(`${clues}，都可以當成要核對的線索。看對方有沒有回應、赴約，或把說好的事做完。`);
      }
      if (present) paragraphs.push(`${describeCard(present)}把這個線索放回你們實際說過和做過的事。`);
      if (future) paragraphs.push(`${cardTitle(future)}談的是相處方式延續下去可能遇到的變化。${roleNote(future)}`);
      return paragraphs;
    }
    if (assumption || unseen) {
      paragraphs.push([assumption, unseen].filter(Boolean).map(describeCard).join(''));
    }
    if (past || present || root || obstacle) {
      paragraphs.push([past, root, present, obstacle].filter(Boolean).map(describeCard).join(''));
    }
    if (action || resource || inner || outer || risk) {
      const first = action ? `${cardTitle(action)}放在可以先做的事。${roleNote(action)}` : '';
      const help = resource ? `做這一步時，${cardTitle(resource)}也能幫忙。${roleNote(resource)}` : '';
      const conditions = [inner, outer, risk].filter(Boolean).map(describeCard).join('');
      paragraphs.push(`${first}${help}${conditions}`);
    }
    if (direction) paragraphs.push(`${cardTitle(direction)}放在可能走向。${roleNote(direction)}`);
    return paragraphs;
  }

  function decide(topic, typed, pivot, obstacle, trend) {
    const subject = questionWithoutEnd(typed);
    const opening = subject ? `就你問的「${subject}」` : '就這件事';
    if (topic?.[0] === 'investment' || topic?.[0] === 'health') {
      const caution = obstacle ? `這組牌點出的風險是「${signalFor(obstacle)}」。` : '';
      return `${topic[3]}${caution}`;
    }
    if (!pivot) return topic?.[3] || `${opening}，等一項關鍵資訊確認後再定。`;
    const review = pivot.role === 'unseen' || pivot.role === 'assumption';
    const issue = pivot.reversed || pivot.role === 'obstacle' || pivot.role === 'risk';
    const focus = review ? `，先核對「${signalFor(pivot)}」有沒有實際發生。`
      : issue ? `，可以先處理「${signalFor(pivot)}」這個卡點。`
        : `，眼下可以運用的是「${signalFor(pivot)}」。`;
    const outlook = trend && trend !== pivot ? `做了這一步，再留意接下來有沒有這樣的變化。${signalFor(trend)}。`
      : '先把能調整的一步做完，等看到實際回應再決定要不要往下走。';
    return `${opening}${focus}${topic?.[3] || outlook}`;
  }

  function analyze({ spreadId = 'single', entries = [], theme = 'general', question = '', optionA = '', optionB = '' } = {}) {
    const typed = clean(question);
    const topic = chooseTopic(typed, theme, spreadId);
    const [firstOption, secondOption] = optionNames(typed, optionA, optionB);
    const context = { spreadId, theme, question: typed, optionA: firstOption, optionB: secondOption, intent: topic?.[0] || 'general' };
    const profileRoles = defaultRoles[spreadId] || weightedRoles[entries.length] || [];
    const cards = entries.map((entry, index) => normalize(entry, profileRoles[index] || (entries.length === 1 ? 'action' : 'present'), context));
    const cardReadings = cards.map(({ signal, ...card }) => card);
    const byRole = Object.fromEntries(cards.map(card => [card.role, card]));
    if (choiceProfiles.has(spreadId)) return { ...readOptions(byRole, context, topic), cardReadings };

    const pivot = byRole.action || byRole['self-approach'] || byRole.unseen || byRole.resource || byRole.present || byRole.direction || cards[0];
    const trend = byRole['relationship-direction'] || byRole.direction;
    const paragraphs = connect(byRole, spreadId, cards);
    if (!paragraphs.length && pivot) paragraphs.push(pivot.summary);
    const headline = topic?.[2] || (pivot ? `先從${cue(pivot)}著手。` : '先釐清眼前最重要的一件事。');
    const highStakes = topic?.[0] === 'investment' || topic?.[0] === 'health';
    const conclusion = decide(topic, typed, pivot, byRole.obstacle || byRole.risk, trend);
    const nextStep = (highStakes ? topic[4] : pivot?.action || topic?.[4]) || '把你現在能確認的事寫一項下來，今天就查清楚它。';
    return { headline, paragraphs, cardReadings, conclusion, nextStep };
  }

  window.MoonveilSpreadReading = { analyze };
})();
