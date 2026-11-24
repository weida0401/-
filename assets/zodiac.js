(() => {
  'use strict';

  const signs = [
    {
      id: 'aries', name: '牡羊座', glyph: '♈︎', element: '火象', start: [3, 21], end: [4, 19],
      intro: '有了方向，先用行動找到答案。',
      character: '願意率先試一種做法，把原本只停在討論的事往前推。遇到突發變化時，也能很快換個方式開始。',
      relationship: '直接說出期待，讓對方知道你在意什麼。對話有摩擦時，等對方把話說完，再提出你的做法。',
      practice: '挑一件拖延的事，設定十分鐘做出開頭。十分鐘一到就停下來，確認接下來真正缺的是什麼。'
    },
    {
      id: 'taurus', name: '金牛座', glyph: '♉︎', element: '土象', start: [4, 20], end: [5, 20],
      intro: '用穩定的步調，把看重的事做好。',
      character: '擅長察覺什麼條件能長久維持，願意把時間留給品質、手感和看得見的成果。',
      relationship: '穩定赴約、記得小習慣，都能帶來信任感。計畫臨時改動時，可以先說清楚自己需要多少準備時間。',
      practice: '挑一件每週會做的事，固定時間與地點，試做兩週。留下真正省力的一部分。'
    },
    {
      id: 'gemini', name: '雙子座', glyph: '♊︎', element: '風象', start: [5, 21], end: [6, 20],
      intro: '從好奇心出發，把零散線索連在一起。',
      character: '擅長用問題打開討論，也能在不同領域之間找到共通點。選定一個方向後，成果更容易累積。',
      relationship: '新話題可以帶來親近感。遇到對方想深入談的事，多留一點時間在當下的對話裡。',
      practice: '把今天想查的三個問題寫下來，只選一個找資料。最後用一句話記下新發現。'
    },
    {
      id: 'cancer', name: '巨蟹座', glyph: '♋︎', element: '水象', start: [6, 21], end: [7, 22],
      intro: '照顧安心感，讓重要的人與事慢慢靠近。',
      character: '容易留意氣氛的變化和容易被忽略的需要，常透過熟悉的細節維持連結。',
      relationship: '用具體的關心修補距離，例如問對方當天最累的時刻。也可以把自己希望獲得的照顧說出來。',
      practice: '列出最近讓你感覺有餘裕和被耗盡的各一件事。替前者留下一小段固定時間。'
    },
    {
      id: 'leo', name: '獅子座', glyph: '♌︎', element: '火象', start: [7, 23], end: [8, 22],
      intro: '讓熱情成為自己與他人都能參與的事。',
      character: '有把想法說得鮮明的能力，也願意為共同的成果站出來。看見別人的貢獻，常能帶動團隊。',
      relationship: '清楚表達欣賞會讓對方感受到肯定。需要被理解時，可以說你希望對方注意哪份努力。',
      practice: '主動分享一件完成的小成果，並說出一個曾經幫助你的人或方法。'
    },
    {
      id: 'virgo', name: '處女座', glyph: '♍︎', element: '土象', start: [8, 23], end: [9, 22],
      intro: '把複雜的事拆開，讓日常好做一點。',
      character: '看得出容易出錯的地方，也擅長把經驗整理成能重複使用的方法。分清重要的細節後，進度會更穩。',
      relationship: '提供具體協助容易傳達關心。給建議之前，先確認對方比較想被聽見，還是一起找做法。',
      practice: '找一件容易重做的任務，寫下最常出錯的步驟，替它加上一個檢查點。'
    },
    {
      id: 'libra', name: '天秤座', glyph: '♎︎', element: '風象', start: [9, 23], end: [10, 22],
      intro: '讓不同立場都有位置，才找得到可行的平衡。',
      character: '擅長理解一件事為什麼會有不同看法。需要做決定時，先選出最重要的條件，有助於收斂選項。',
      relationship: '願意協商能讓對話繼續下去。也可以明白說出自己能接受的範圍，讓妥協有清楚的界線。',
      practice: '把猶豫的選項放在一起，用同一個條件打分，再訂一個做決定的時間。'
    },
    {
      id: 'scorpio', name: '天蠍座', glyph: '♏︎', element: '水象', start: [10, 23], end: [11, 21],
      intro: '願意看清表面之下，找出真正影響結果的事。',
      character: '重視訊息背後的動機和關係裡的信任，投入時往往很專注。留心可核對的資訊，能讓判斷更踏實。',
      relationship: '親近感可以從逐步兌現的小承諾建立。遇到不安時，把看見的行動和自己的猜測分開說。',
      practice: '選一件反覆在意的事，分別寫下可查證的事實和還沒確認的推測。先查證其中一項。'
    },
    {
      id: 'sagittarius', name: '射手座', glyph: '♐︎', element: '火象', start: [11, 22], end: [12, 21],
      intro: '用新體驗打開視野，再把學到的帶回日常。',
      character: '樂於接觸不同觀點，常能替卡住的事找到新方向。將靈感安排成一個短期嘗試，更容易看出價值。',
      relationship: '保留各自的探索空間，有助於維持相處的活力。約定何時聯絡或見面，能讓自由和安心感並存。',
      practice: '選一個一直想接觸的主題，找一次可以在本週完成的小體驗，過後記下想繼續的理由。'
    },
    {
      id: 'capricorn', name: '摩羯座', glyph: '♑︎', element: '土象', start: [12, 22], end: [1, 19],
      intro: '用時間與規劃，把重要的事一點一點做成。',
      character: '擅長抓出優先順序，也願意整理責任、資源和期限。目標拆成明確的階段後，容易看出進步。',
      relationship: '持續做到答應的事，能累積安全感。記得說出你的感受，對方也會更知道怎麼靠近你。',
      practice: '挑一個長期目標，寫下本月的一個小里程碑，並留下可以調整進度的緩衝時間。'
    },
    {
      id: 'aquarius', name: '水瓶座', glyph: '♒︎', element: '風象', start: [1, 20], end: [2, 18],
      intro: '從不同角度看既有規則，找出更好的可能。',
      character: '習慣先退一步看整體，也擅長提出大家尚未想到的做法。用小規模的結果說明新想法，能讓合作更順。',
      relationship: '共通興趣容易建立連結。想保有自己的時間時，把你的安排先說清楚，讓對方能一起協調。',
      practice: '挑一個讓你覺得不順的日常流程，改一個小步驟，記下改動前後省下的時間。'
    },
    {
      id: 'pisces', name: '雙魚座', glyph: '♓︎', element: '水象', start: [2, 19], end: [3, 20],
      intro: '替想像與感受留出空間，也照顧自己的界線。',
      character: '擅長同理與想像，容易從故事、影像或聲音找到新的表達方式。安靜的時段有助於整理接收的訊息。',
      relationship: '體貼能讓人感到被理解。聽完對方的感受後，也能用簡單的句子說明你能提供多少支持。',
      practice: '留十分鐘寫下今天最清楚的一種感受，再替自己安排一件能照顧這份感受的小事。'
    }
  ];

  const get = id => document.getElementById(id);
  const finder = get('zodiac-finder');
  const month = get('birth-month');
  const day = get('birth-day');
  const birthdayStatus = get('birthday-status');
  const signList = get('zodiac-signs');
  const profile = get('zodiac-profile');
  const signsById = new Map(signs.map(sign => [sign.id, sign]));
  const signLinks = new Map();
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let activeId;

  function dateRange(sign) {
    return sign.start.join('/') + '–' + sign.end.join('/');
  }

  function makeSignLink(sign) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = '#' + sign.id;
    link.className = 'zodiac-tile';
    link.dataset.sign = sign.id;

    const glyph = document.createElement('span');
    glyph.className = 'zodiac-symbol';
    glyph.setAttribute('aria-hidden', 'true');
    glyph.textContent = sign.glyph;
    const name = document.createElement('strong');
    name.textContent = sign.name;
    const dates = document.createElement('span');
    dates.className = 'zodiac-tile-dates';
    dates.textContent = dateRange(sign);

    link.append(glyph, name, dates);
    item.append(link);
    signLinks.set(sign.id, link);
    return item;
  }

  function renderSign(sign) {
    signLinks.get(activeId)?.removeAttribute('aria-current');
    activeId = sign.id;
    signLinks.get(activeId).setAttribute('aria-current', 'location');
    get('sign-glyph').textContent = sign.glyph;
    get('sign-name').textContent = sign.name;
    get('sign-dates').textContent = dateRange(sign);
    get('sign-element').textContent = sign.element;
    get('sign-intro').textContent = sign.intro;
    get('sign-character').textContent = sign.character;
    get('sign-relationship').textContent = sign.relationship;
    get('sign-practice').textContent = sign.practice;
    profile.hidden = false;
    window.MoonveilZodiacTools?.selectSign(sign.id);
  }

  function openSign(sign) {
    renderSign(sign);
    if (location.hash !== '#' + sign.id) {
      history.pushState(null, '', '#' + sign.id);
    }
    profile.focus({preventScroll:true});
    profile.scrollIntoView({block:'nearest'});
  }

  function updateBirthdayDays() {
    const selectedDay = day.value;
    const max = daysInMonth[Number(month.value) - 1] ?? 31;
    const options = Array.from({length:max}, (_, index) => new Option((index + 1) + ' 日', String(index + 1)));
    day.replaceChildren(new Option('選擇日期', ''), ...options);
    if (Number(selectedDay) <= max) day.value = selectedDay;
  }

  function findBirthdaySign(selectedMonth, selectedDay) {
    const birthday = selectedMonth * 100 + selectedDay;
    return signs.find(sign => {
      const start = sign.start[0] * 100 + sign.start[1];
      const end = sign.end[0] * 100 + sign.end[1];
      return start <= end
        ? birthday >= start && birthday <= end
        : birthday >= start || birthday <= end;
    });
  }

  function clearBirthdayStatus() {
    birthdayStatus.textContent = '';
    delete birthdayStatus.dataset.state;
    month.removeAttribute('aria-invalid');
    day.removeAttribute('aria-invalid');
  }

  function updateFromHash() {
    const selected = signsById.get(location.hash.slice(1));
    if (selected) {
      renderSign(selected);
      profile.scrollIntoView({block:'nearest'});
    } else if (!activeId || !location.hash) {
      renderSign(signs[0]);
    }
  }

  finder.addEventListener('submit', event => {
    event.preventDefault();
    clearBirthdayStatus();
    const selectedMonth = Number(month.value);
    const selectedDay = Number(day.value);
    const invalidMonth = selectedMonth < 1 || selectedMonth > 12;
    const invalidDay = selectedDay < 1 || selectedDay > (daysInMonth[selectedMonth - 1] ?? 31);
    if (invalidMonth || invalidDay) {
      birthdayStatus.dataset.state = 'error';
      birthdayStatus.textContent = '請選擇出生月和日。';
      if (invalidMonth) month.setAttribute('aria-invalid', 'true');
      if (invalidDay) day.setAttribute('aria-invalid', 'true');
      (invalidMonth ? month : day).focus();
      return;
    }
    const selected = findBirthdaySign(selectedMonth, selectedDay);
    birthdayStatus.textContent = '你的太陽星座是' + selected.name + '。';
    openSign(selected);
  });

  month.addEventListener('change', () => {
    updateBirthdayDays();
    clearBirthdayStatus();
  });
  day.addEventListener('change', clearBirthdayStatus);
  signList.addEventListener('click', event => {
    const link = event.target.closest('a[data-sign]');
    if (!link || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    event.preventDefault();
    clearBirthdayStatus();
    openSign(signsById.get(link.dataset.sign));
  });
  get('profile-forecast-link')?.addEventListener('click', () => window.MoonveilZodiacTools?.selectSign(activeId));
  window.addEventListener('hashchange', updateFromHash);

  month.append(...Array.from({length:12}, (_, index) => new Option((index + 1) + ' 月', String(index + 1))));
  updateBirthdayDays();
  signList.append(...signs.map(makeSignLink));
  window.MoonveilZodiacTools?.initialize(signs);
  updateFromHash();
})();
