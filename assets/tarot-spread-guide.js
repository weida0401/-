(() => {
  'use strict';

  const presets = {
    timeline: {
      id: 'timeline', name: '時間之流',
      description: '從事情怎麼走到現在，看接下來可能往哪裡走。',
      reason: '適合看一件事怎麼走到現在，以及接下來可能的變化。',
      slots: [['past', '過去'], ['present', '現在'], ['direction', '可能走向']],
    },
    blindspot: {
      id: 'blindspot', name: '盲點三角',
      description: '先看自己怎麼想，再找可能漏看的線索，最後落到一個可試的做法。',
      reason: '適合把自己目前的看法和可能沒注意到的線索分開。',
      slots: [['assumption', '我目前的看法'], ['unseen', '容易漏看的地方'], ['action', '可以先做的事']],
    },
    core: {
      id: 'core', name: '卡關拆解',
      description: '找出這件事卡在哪裡，再看能做的調整和手邊用得上的資源。',
      reason: '事情一直卡住時，可以從核心、阻礙、做法和資源四個角度拆開看。',
      slots: [['root', '問題核心'], ['obstacle', '卡住的地方'], ['action', '應對做法'], ['resource', '手邊能用的資源']],
    },
    options: {
      id: 'options', name: 'A／B 選擇',
      description: '各看兩條路的現況與可能走向，再用同一個在意的條件來比較。',
      reason: '有兩個選項時，可以分開看各自的現況和走向，再拿同一個標準比較。',
      slots: [
        ['option-a', 'A 的現況'], ['option-b', 'B 的現況'], ['option-a-direction', 'A 的可能走向'],
        ['option-b-direction', 'B 的可能走向'], ['criterion', '你最在意的條件'],
      ],
    },
    relationship: {
      id: 'relationship', name: '關係觀察',
      description: '把自己的感受、對方可觀察的回應和兩人的互動分開，再看下一步。',
      reason: '想知道關係可以怎麼走，先把自己的需要和對方實際做出的回應分開看。',
      slots: [
        ['self-state', '我的狀態'], ['self-approach', '我怎麼靠近'], ['partner-state', '對方的互動線索'],
        ['partner-approach', '目前的互動方式'], ['relationship-direction', '下一步的走向'],
      ],
    },
  };

  function recommend(question = '', theme = 'general') {
    const text = question.normalize('NFKC').trim();
    if (/二選一|兩(個|份|條|種|邊)|還是|或是|或者|想比較|選哪|哪個選|\bA\s*[\/、或跟與]\s*B\b/i.test(text)) return presets.options;
    if (/盲點|誤會|誤判|忽略|沒注意|看漏|沒看見/.test(text)) return presets.blindspot;
    if (/卡住|卡關|打轉|瓶頸|沒有起色|沒起色|停滯|一直不順|哪裡出了問題/.test(text)) return presets.core;
    if (/曖昧|復合|感情|交往|約會|伴侶|喜歡我|相處|這段關係/.test(text)) return presets.relationship;
    if (/走向|未來|過去|接下來|之後|近期會/.test(text)) return presets.timeline;
    if (theme === 'choice') return presets.options;
    if (theme === 'love') return presets.relationship;
    return presets.timeline;
  }

  const url = new URL('../data/card-meanings.json', document.currentScript.src);
  let meaningsRequest;

  function loadMeanings() {
    meaningsRequest ??= fetch(url).then(response => {
      if (!response.ok) throw new Error('Card meanings unavailable');
      return response.json();
    }).then(value => value && typeof value === 'object' ? value : {}).catch(() => ({}));
    return meaningsRequest;
  }

  window.MoonveilTarotSpreadGuide = { presets, recommend, loadMeanings };
})();
