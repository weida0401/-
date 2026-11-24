(() => {
'use strict';
const multiPointReading = (() => {
  const positions = {
    root: ['根基', '可以回頭看看，什麼時候開始有這個狀況？'],
    past: ['過去', '回想一個類似的時刻，當時的做法有哪些現在還適用？'],
    now: ['現況', '先用最近發生的一件事對照這個提醒，看看哪一部分最貼近眼前的狀況。'],
    obstacle: ['卡點與解法', '看看什麼容易卡住，以及手上有沒有辦法把它鬆開。'],
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

  const answerProfiles = {
    investment: {
      headlines: [
        '眼前先釐清投資風險，再決定要不要繼續評估',
        '這個機會可以研究，先把計畫和風險寫清楚',
        '可以繼續評估這個投資機會，計畫還要補清楚'
      ],
      condition: '成不成要看獲利理由能不能用實際資料驗證，以及你能不能守住風險上限。',
      nextStep: '先寫下這筆投資為什麼可能成立、你最多能承受多少損失，以及發生什麼情況就要退出。用這三項去對照實際資料，再做決定。'
    },
    love: {
      headlines: [
        '關係能不能往前，先看卡住的地方能否談開',
        '還有空間了解彼此，先看對方怎麼回應',
        '可以找機會把話說開，後續還要看彼此怎麼回應'
      ],
      condition: '把重點放在雙方能否說清楚各自的期待。如果說完之後，行動也跟得上，關係才有更具體的調整空間。'
    },
    work: {
      headlines: [
        '工作上的關鍵條件還不齊，先確認卡在哪裡',
        '有方向可以試，先確認資源和分工',
        '工作上有可用的條件，可以先驗證一小步'
      ],
      condition: '先找出影響結果的條件，例如對方期待的成果、你能投入的時間，或誰能給你回饋。確認其中一項，再判斷這個做法是否走得通。'
    },
    choice: {
      headlines: [
        '選擇的代價還沒弄清楚，先補一項關鍵資訊',
        '先用同一個標準比較兩條路，再做選擇',
        '可以先試自己較在意的方向，留一點回頭的空間'
      ],
      condition: '決定前可用一個對你最重要的條件比較，例如時間、生活變動或要承擔的代價。如果其中一條路能先小規模試做，就用實際經驗再對照一次。'
    },
    daily: {
      headlines: [
        '今天先把最容易卡住的一件事縮小',
        '今天先觀察一件事，讓下一步清楚一點',
        '今天有一件小事可以往前做'
      ],
      condition: '把牌面的提醒放進今天實際會遇到的一件事。做完或觀察過後，看看自己有沒有更靠近想要的方向。'
    },
    outcome: {
      headlines: [
        '照目前的條件，先處理卡點再談結果',
        '目前成敗還難判斷，關鍵條件值得再確認',
        '有機會往前，結果要看關鍵條件能否落實'
      ],
      condition: '把現在能觀察到的助力和仍待確認的地方分開。先查一個可能改變判斷的條件，看清楚之後再決定要不要繼續。'
    },
    general: {
      headlines: [
        '先處理最消耗你的卡點',
        '先確認一個線索，讓方向更清楚',
        '先用手上已有的條件做一小步'
      ],
      condition: '先把問題縮到眼前一件能調整的事。試過之後，用實際發生的變化重新看這個問題。'
    }
  };

  function questionKind(question, themeKey) {
    if (/面[試试]|[錄录]取|升[遷迁]|[應应][徵征]|求[職职]/.test(question)) return 'work';
    if (/投[資资]|股票|股[價价]|基金(?![會会])|本金|[獲获]利|[報报]酬|理[財财]|比特[幣币]|加密[貨货][幣币]|期[貨货]|[資资][產产]|ETF/i.test(question)) return 'investment';
    if (/感情|[戀恋][愛爱]|[復复]合|[曖暧]昧|前任|交往|分手|[結结]婚|伴[侶侣]|告白|喜[歡欢]我|追求[他她]/.test(question)) return 'love';
    if (/工作|[職职][場场涯业業]|[轉转][職职]|升[職职]|同事|主管|[專专]案|[創创][業业]/.test(question)) return 'work';
    if (/[選选]哪|哪[個个]比[較较]|[兩两][個个][選选][項项]|二[選选]一|[選选].*[還还]是|[還还]是[選选]|[選选][擇择]哪|取[捨舍]/.test(question)) return 'choice';
    if (themeKey !== 'general' && Object.hasOwn(themes, themeKey)) return themeKey;
    if (/[會会]不[會会]|能不能|是否|可否|能否|有[沒没]有|[會会]成功|能成功|[該该]不[該该]|要不要|[嗎吗嘛][？?!！]*$/.test(question)) return 'outcome';
    return 'general';
  }

  const strongest = (items, measure) => items.reduce((best, item) => {
    const value = measure(item);
    return value > 0 && (!best || value > measure(best)) ? item : best;
  }, undefined);

  function pointName(point) {
    return `「${positions[point.key][0]}」的${point.card.name}（${point.reversed ? '逆位' : '正位'}）`;
  }

  function plainMeaning(point) {
    if (point.meaning === '以清楚的願景引導資源投入') return '先訂好方向，再想要投入多少資源';
    if (point.meaning === '找出讓決策遲疑的限制') return '找出哪個條件讓你下不了決定';
    return point.meaning.replace(/^以/, '用');
  }

  function summary(points, themeKey) {
    const theme = themes[themeKey] ?? themes.general;
    const support = strongest(points, point => point.contribution);
    const caution = strongest(points, point => -point.contribution);
    const parts = [];

    if (support) {
      const opening = support.key === 'obstacle' ? '指出一個可以化解卡點的做法' : '給了你一個可以試的方向';
      parts.push(`${pointName(support)}${opening}。試著${plainMeaning(support).replace(/^先/, '')}。`);
    }
    if (caution) {
      parts.push(`${pointName(caution)}值得停下來多看一眼。${plainMeaning(caution)}，會讓下一步更清楚。`);
    }
    if (!support && !caution) {
      const current = points.find(point => point.key === 'now');
      parts.push(`這副牌的推進指數落在中間。${pointName(current)}提醒你${plainMeaning(current)}。`);
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

  function themeStep(theme, point) {
    const steps = theme === themes.general ? everydaySteps[point.card.suit] ?? theme.steps : theme.steps;
    return steps[Math.sign(point.score) + 1];
  }

  function answer(points, themeKey, question, index) {
    const kind = questionKind((question ?? '').trim(), themeKey);
    const profile = answerProfiles[kind];
    const headline = profile.headlines[index < 40 ? 0 : index >= 60 ? 2 : 1];
    const support = strongest(points, point => point.contribution);
    const largestConcern = strongest(points, point => -point.contribution);
    const trend = points.find(point => point.key === 'trend');
    const caution = kind === 'investment' && trend?.contribution < 0 ? trend : largestConcern;
    const focus = points.find(point => point.key === 'action') ?? points.find(point => point.key === 'now');
    const parts = [profile.condition];
    if (support) {
      const lead = support.key === 'obstacle' ? '提供了一個處理卡點的方法' : '指出目前可以借力的地方';
      parts.push(`${pointName(support)}${lead}。它提醒你${plainMeaning(support)}。`);
    }
    if (caution) {
      parts.push(kind === 'investment'
        ? `${pointName(caution)}也提醒你，仍有會影響判斷的條件需要先查清楚。`
        : `${pointName(caution)}提醒你${plainMeaning(caution)}。`);
    }
    if (!support && !caution) {
      parts.push(`這次的牌勢偏中性。${pointName(focus)}可以作為第一個觀察點。`);
    }

    const theme = themes[kind] ?? themes.general;
    return {headline, body: parts.join(''), nextStep: profile.nextStep ?? themeStep(theme, focus)};
  }

  function perCard(point) {
    return `${plainMeaning(point)}。${positions[point.key][1]}`;
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
  $('result-title').focus({preventScroll:true});
  result.scrollIntoView({block:'start'});
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
