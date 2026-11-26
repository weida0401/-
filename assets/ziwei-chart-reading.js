(() => {
  'use strict';

  const palaces = {
    ming: {
      opposite: 'travel', scene: '要替自己定方向或接下一件沒做過的事',
      focus: '哪種做法會讓你覺得這是自己選的方向'
    },
    siblings: {
      opposite: 'friends', scene: '兄弟姊妹要分工照顧家人，或有事需要彼此幫忙',
      focus: '手足之間遇到事情各會怎麼出力、怎麼協調'
    },
    spouse: {
      opposite: 'career', scene: '和伴侶商量生活安排，或要兩個人一起做決定',
      focus: '怎樣的相處會讓你覺得彼此有商量的空間'
    },
    children: {
      opposite: 'property', scene: '陪孩子或晚輩做一件他想學的事',
      focus: '什麼時候你會想陪在旁邊，什麼時候想把主導權交給對方'
    },
    wealth: {
      opposite: 'wellbeing', scene: '要分配收入、衡量一筆花費值不值得',
      focus: '你想把錢和力氣花在哪裡，手上留多少才覺得踏實'
    },
    health: {
      opposite: 'parents', scene: '生活忙起來，要替自己安排作息、休息和照顧',
      focus: '哪些生活安排讓你有餘裕休息，哪些需要花更多力氣維持'
    },
    travel: {
      opposite: 'ming', scene: '要在異地工作、搬到外地生活，或剛加入陌生環境',
      focus: '你在新環境裡怎麼找到能熟悉起來的人和事'
    },
    friends: {
      opposite: 'siblings', scene: '和朋友、同事或團隊一起做事',
      focus: '怎樣的分工和互相照應會讓你願意長期合作'
    },
    career: {
      opposite: 'spouse', scene: '挑工作方向，或接下一件需要你負責的任務',
      focus: '哪種工作和責任會讓你覺得值得長久投入'
    },
    property: {
      opposite: 'children', scene: '挑住處、布置家裡，或和家人商量怎麼使用空間',
      focus: '哪些居住條件值得保留，怎樣才有安定落腳的感覺'
    },
    wellbeing: {
      opposite: 'wealth', scene: '手邊的事告一段落，想找個舒服的方式休息',
      focus: '什麼會讓你真正放鬆，或做完後覺得心裡踏實'
    },
    parents: {
      opposite: 'health', scene: '和父母、照顧者或師長商量重要的事',
      focus: '怎樣的支持對你有幫助，哪些決定希望由自己來做'
    }
  };

  const stars = {
    紫微: {
      theme: '定方向與帶頭承擔',
      tendency: '先想清楚整件事要往哪裡走，也在意重要的決定能不能自己掌握'
    },
    天機: {
      theme: '隨變化調整做法',
      tendency: '在心裡過幾種做法，遇到新情況也很快想到怎麼調整'
    },
    太陽: {
      theme: '主動出力和把事情說明白',
      tendency: '主動把需要討論的地方說出來，也願意多出一點力，好讓事情順利'
    },
    武曲: {
      theme: '務實執行和運用資源',
      tendency: '先算清楚手上的時間和資源，知道可行之後就著手把事做起來'
    },
    天同: {
      theme: '舒服的步調和融洽的相處',
      tendency: '先找一個少一點壓力、自己和別人都能維持的步調'
    },
    廉貞: {
      theme: '做事的原則和人情界線',
      tendency: '同時留意彼此的感受和該守的原則，尤其在意哪些事應該先說清楚'
    },
    天府: {
      theme: '讓手上的條件長久穩當',
      tendency: '把手上已經有的東西安排好，順便多留一點餘裕，免得情況一變就得重來'
    },
    太陰: {
      theme: '留意細節與慢慢累積',
      tendency: '先留意一些容易被忽略的感受或細節，確定心裡踏實了，再慢慢投入'
    },
    貪狼: {
      theme: '興趣、人情和探索新鮮事',
      tendency: '先被新鮮的選擇吸引，也善於從興趣或共同話題看見新的可能'
    },
    巨門: {
      theme: '辨明細節和把疑問說開',
      tendency: '把不清楚的地方問一遍，聽到兩種版本時也想弄明白它們差在哪裡'
    },
    天相: {
      theme: '協調分寸和兼顧公平',
      tendency: '先聽聽各方的考量，把權責和能互相配合的地方放在一起談'
    },
    天梁: {
      theme: '照應他人和守住行事原則',
      tendency: '參考過去的經驗，先處理可能出問題的地方，也留意身邊有沒有人需要幫忙'
    },
    七殺: {
      theme: '獨立判斷和果斷承擔',
      tendency: '儘快判斷什麼最需要有人決定，情況清楚之後，也願意承擔接下來的責任'
    },
    破軍: {
      theme: '打破舊局和重新整理',
      tendency: '留意哪些舊方法已經很難做下去，願意放掉一部分，重新找能用的方法'
    }
  };

  const combinations = {
    紫微: {
      天府: '先定好方向，再把手上的時間和資源安排穩當，讓事情能照著做下去',
      貪狼: '先想達成什麼，再用興趣、人際或新點子把原有的安排做得更活',
      天相: '想把方向定清楚，也會花心思安排彼此的角色，讓其他人知道怎麼一起做',
      七殺: '想把重要的決定握在手裡，一旦看清問題，也願意很快站出來承擔',
      破軍: '先抓自己想走的方向，發現原本的安排走不通，就想把那一部分重新整理'
    },
    天機: {
      太陰: '一邊盤點有哪些做法，一邊留意不容易說出口的細節，心裡踏實了才往下做',
      巨門: '碰到新資訊就調整原本的想法，也很想弄清楚眼下各種說法為什麼不一樣',
      天梁: '先想出幾種解法，再用過去的經驗判斷哪種做法最能照應需要的人'
    },
    太陽: {
      太陰: '願意把事情說開，也會留一點時間顧及不想當場說出口的感受',
      巨門: '主動把疑問攤開來談，尤其在意資訊清不清楚、其他人有沒有機會說出自己的版本',
      天梁: '願意出面處理，也會先想整件事有哪些原則要守、哪些人需要有人照應'
    },
    武曲: {
      天府: '把手上的條件和能用的資源算清楚，傾向用一個長久撐得住的做法慢慢做出成果',
      貪狼: '很容易想到有趣的新機會，也會回頭算時間和條件，挑一個真的做得出來的方向',
      天相: '先把實際的工作與資源列出來，同時想好怎麼分才兼顧每個人的責任',
      七殺: '抓住眼下要解決的問題、很快排出優先順序，遇到需要拍板的地方也願意承擔',
      破軍: '從實際花掉的力氣看出舊方法哪裡卡住，願意把拖久的問題一次換個做法'
    },
    天同: {
      太陰: '很在意環境安不安穩，也會從小細節感受彼此相處起來舒不舒服',
      巨門: '想讓相處保有一點輕鬆，也會在有疑問留下來時，想找個舒服的時機把話說開',
      天梁: '想讓步調輕鬆些，真的有人需要幫忙時，也願意把應該顧到的責任扛起來'
    },
    廉貞: {
      天府: '先釐清哪些界線要守，再把手上的資源和責任安排到可以長久維持',
      貪狼: '對新鮮的人事物有興趣，也會很留意彼此靠近之後，怎麼維持舒服的分寸',
      天相: '希望規矩說得清楚，也願意把各方的難處聽完，再找彼此都能接受的做法',
      七殺: '在重要界線上做出明確判斷，確認原則之後，願意承擔比較難開口的決定',
      破軍: '先辨清想守住的原則，發現有些舊安排做不到，就願意重新談條件、換做法'
    }
  };

  const zhTransformations = { 禄: '祿', 权: '權' };
  const transformations = {
    祿: '這類事情可能更容易讓你想投入、分享，或慢慢累積成果',
    權: '也帶出想自己作主、願意多承擔一些的傾向',
    科: '也帶出重視說法有沒有根據、做法能不能被理解的一面',
    忌: '這類事可能更難放下，你也容易反覆想還有哪裡需要說清楚'
  };

  function majorStars(palace) {
    return (palace?.majorStars ?? []).filter(star => Object.hasOwn(stars, star.name));
  }

  function starNames(entries) {
    return entries.map(star => star.name).join('、');
  }

  function behavior([first, second]) {
    if (!second) return stars[first.name].tendency;
    return combinations[first.name]?.[second.name] ?? combinations[second.name]?.[first.name]
      ?? `${stars[first.name].tendency}，同時也在意${stars[second.name].theme}`;
  }

  function localDetail(palace, entries) {
    for (const star of entries) {
      const label = star.mutagen?.replace(/^化/, '');
      const name = zhTransformations[label] ?? label;
      if (Object.hasOwn(transformations, name)) return `${star.name}化${name}，${transformations[name]}。`;
    }
    return palace.isBody ? '這裡也是身宮，這些主題可能在你長期投入的生活選擇裡更常出現。' : '';
  }

  function describe(chart) {
    const actualPalaces = chart?.palaces ?? [];
    const palaceById = new Map(actualPalaces.map(palace => [palace.id, palace]));

    return actualPalaces.map(palace => {
      const setting = palaces[palace.id];
      const opposite = palaceById.get(setting.opposite);
      const local = majorStars(palace);
      const entries = local.length ? local : majorStars(opposite);
      const detail = localDetail(palace, local);
      let summary;

      if (local.length) {
        const [first, second] = local;
        const lead = second
          ? `${starNames(local)}同宮，既重視${stars[first.name].theme}，也在意${stars[second.name].theme}。`
          : `${first.name}著重${stars[first.name].theme}。`;
        summary = `${lead}${setting.scene}時，你可能會${behavior(entries)}。${detail}`;
      } else if (entries.length) {
        summary = `這一宮沒有主星，借看對面${opposite.name}的${starNames(entries)}。${setting.scene}時，你可能會${behavior(entries)}。${detail}`;
      } else {
        const source = opposite ? `這一宮和對面的${opposite.name}都沒有主星。` : '這一宮沒有主星。';
        summary = `${source}${setting.scene}時，比較看得出${setting.focus}。${detail}`;
      }

      return { id: palace.id, summary };
    });
  }

  window.MoonveilZiweiReading = { describe };
})();
