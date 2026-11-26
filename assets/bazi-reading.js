(() => {
  'use strict';

  const dayMasters = {
    甲: {
      headline: '先把方向站穩，再一步一步做下去',
      intro: '甲木在八字裡常借大樹來形容。你可能很在意眼前的事能不能走得久，方向一旦想清楚，就願意花時間把它做深。',
      scene: '例如接手一件要做幾個月的事，你可能先弄清楚大家到底想做出什麼，再把一週一週的進度排開。碰到臨時改動時，分清楚是目標變了、還是步驟要換，往往能讓你比較快找回節奏。',
      closing: '先看清哪裡值得走，再把功夫一點一點放進去，可能很像你認同的做事方式。',
      strength: '你先定方向的習慣'
    },
    乙: {
      headline: '沿著能走的地方，慢慢把事做起來',
      intro: '乙木常借柔韌的草木來形容。你可能擅長從手上現有的人和條件找著力點，能先前進一小步，也能在情況改變時換個走法。',
      scene: '比如大家約不出同一個時間，你可能先找有空的人完成一小段，再把成果帶回來一起談。當每個人都有不同期待，你也容易注意到，眼前有哪些地方其實可以先配合。',
      closing: '你的長處可能藏在看出哪裡還有空間，讓原本卡住的事先往前走一點。',
      strength: '你察覺哪裡能互相配合的本事'
    },
    丙: {
      headline: '把在意的事說開，讓大家有機會一起做',
      intro: '丙火常借日光來形容，帶有把事情照亮、讓人看見的意思。遇到真的有興趣的事，你可能很自然地把熱情說清楚，也帶動身邊的人。',
      scene: '一場討論僵著時，你可能先拿個具體例子說明自己的想法，原先不知道怎麼接話的人也就有了方向。事情一口氣湧進來，真正讓你想出力的部分，常比場面有多熱鬧更早浮出來。',
      closing: '你把一件事講明白的時候，也可能替原先還在觀望的人打開了一個能參與的位置。',
      strength: '你讓大家看見想法如何落地的能力'
    },
    丁: {
      headline: '把心力留給一件重要的事，讓它慢慢亮起來',
      intro: '丁火常借燈火來形容，重點在一束光可以持續照著哪裡。你可能比較容易投入有感情、有細節的事，也留意到別人不一定會開口說的需要。',
      scene: '像是看了一份還不完整的作品，你有時會先發現哪個細節其實很有意思，再花時間把它做得更清楚。越是嘈雜、大家都急著做決定，你越可能需要一段安靜時間認出自己在意的地方。',
      closing: '你能長久投入一件事的理由，往往跟某個具體的人、感受或細節有關。',
      strength: '你留意細節與感受的能力'
    },
    戊: {
      headline: '把眼前站穩，讓接下來的事有地方落腳',
      intro: '戊土常借山地來形容，重視穩定和承載。碰到很多事同時出現，你可能先看哪件事一定得有人顧住，再決定要把時間和力氣放在哪裡。',
      scene: '原來的分工突然有變時，你可能會先守住每天都得做的部分，讓其他人還有時間調整。等新的做法有了大致範圍，你也會比較有把握把長期的責任接穩。',
      closing: '你可能很擅長讓一件承諾有地方落實，尤其是事情多、一下子還看不出全貌的時候。',
      strength: '你先穩住眼前事情的耐性'
    },
    己: {
      headline: '把零碎的事照看好，讓日子更好過一點',
      intro: '己土常借田地來形容，重點在培養和照料。你可能很留意事情能不能照這個方式持續，也看得出來哪個小地方改過後，會讓人少累一點。',
      scene: '家裡或團隊有一件事每週都要重做時，你可能會先問到底是哪一步老是卡住，再找到一個大家都做得到的改法。有人默默多做了一段，你有時也會比旁人早一點發現。',
      closing: '你照看的地方往往很日常，久了卻會讓工作或生活變得更能維持。',
      strength: '你把日常瑣事整理得更好做的本事'
    },
    庚: {
      headline: '看清哪裡卡住，就從能解決的地方下手',
      intro: '庚金在八字裡常用鍛造的金屬來形容，著重決斷和執行。碰到事情卡住，你可能比較快分辨哪個問題非處理不可，也願意說清楚該怎麼往下走。',
      scene: '當幾個方案一直談不出結果，你可能會把期限、能用的條件和各自能做的部分攤開來看。真正困擾你的，有時是大家一直在說彼此都明白的事，卻還沒人碰到最要緊的那一點。',
      closing: '你把事情講得直接的時候，可能是在讓一個模糊的問題終於有辦法處理。',
      strength: '你把界線和下一步說清楚的能力'
    },
    辛: {
      headline: '看得見細微的差別，也在意做出來的樣子',
      intro: '辛金常借經過細磨的金屬來形容，著重分寸和品質。你可能不經意就留意到語氣、材料或做法的小差別，也在乎這些差別最後怎麼影響成果。',
      scene: '有人把成品拿來問你哪裡可以再好一點，你可能很快指出最值得調整的一處。當別人的要求說得含糊，你有時會先想清楚自己願意做到什麼程度，才比較知道怎麼答應。',
      closing: '你留意細節的價值，有時就在於你能分辨哪一個小地方真的會改變整件事。',
      strength: '你看出細節是否重要的眼光'
    },
    壬: {
      headline: '先看看還有哪些路，再找一條走得通的',
      intro: '壬水常借江河來形容，著重流動和廣度。你可能很自然地把不同人的消息放在一起，遇到原來的路走不通時，也容易想到還有哪些方向。',
      scene: '例如臨時要換個做法，你可能一邊問有沒有人做過，一邊想手邊有什麼能先用。碰到好幾個方向都行，真正難的有時是挑哪一條值得多走一段。',
      closing: '當事情沒有現成的路，你可能擅長從分散的消息裡找出下一個可行的方向。',
      strength: '你把各處消息串起來的能力'
    },
    癸: {
      headline: '先留意沒人說出口的細節，再慢慢看清楚',
      intro: '癸水常借細雨來形容，著重細緻的觀察和滲透。你可能先看一件事的來龍去脈，等幾個原本不顯眼的線索接起來，才知道要從哪裡回應。',
      scene: '像是訊息裡有句話讀起來不太對，你有時會記在心上，等聽見前後經過後，才知道問題卡在哪裡。別人急著在當下找答案時，你也許需要一點空間，先把自己的感受和聽到的事理開。',
      closing: '你先觀察的那段時間，往往是你把不完整的訊息慢慢整理成判斷的過程。',
      strength: '你從細微線索看出關鍵的本事'
    }
  };

  const elements = {
    木: { theme: '養成和發展', example: '把剛起頭的想法，慢慢養成能持續使用的做法' },
    火: { theme: '表達和帶動', example: '把原先沒人開口的點子，講得讓人願意參與' },
    土: { theme: '承接和穩定', example: '把大家答應的事放進真的做得下去的時間表' },
    金: { theme: '分辨和取捨', example: '弄清楚哪些細節會影響成果，哪些步驟可以簡化' },
    水: { theme: '觀察和變通', example: '先聽幾種說法，再找出能把事情往下接的線索' }
  };

  const tenGods = {
    比肩: { theme: '自己做主、和同伴各自出力', scene: '和能力相近的人合作', result: '找到能自己做主、也接得上別人進度的分工' },
    劫財: { theme: '同輩之間的合作、競爭和資源分配', scene: '一群人要同時出力、分配手上的資源', result: '讓彼此付出的時間和力氣更容易被看見' },
    食神: { theme: '用自己的步調創作、表達或分享成果', scene: '能用自己的方式做一件有興趣的事', result: '把喜歡的東西做成看得見、也能分享的成果' },
    傷官: { theme: '對舊做法的疑問，以及想試新方法的動力', scene: '原本的做法一直卡住', result: '把原本說不清楚的問題講明白，找到可以改的地方' },
    偏財: { theme: '機動地運用時間、人手和其他資源', scene: '手上有好幾種資源可以運用', result: '看清楚哪個地方最值得先放人手或時間' },
    正財: { theme: '確認成本、安排日常開支和長期累積', scene: '要分配預算或一週裡能用的時間', result: '決定哪些安排才有辦法長久維持' },
    七殺: { theme: '面對時間壓力、挑戰與需要有人拿主意的情況', scene: '時間一急、事情又需要有人決定', result: '把眼前最要緊的事分清楚，讓它真的有人接手' },
    正官: { theme: '承擔責任、理解規則和說清楚彼此的標準', scene: '要接下一件需要對別人負責的事', result: '把要交付的成果與各自的責任說明白' },
    偏印: { theme: '摸索不常見的資訊，發展自己的理解和做法', scene: '碰到一個沒有現成做法的問題', result: '從零散的線索裡整理出自己的解法' },
    正印: { theme: '從經驗、學習和可靠的支持裡整理出方法', scene: '遇到一件需要邊學邊做的事', result: '把可信的經驗變成自己用得上的做法' }
  };

  const stemLabels = { month: '月干', year: '年干', hour: '時干' };
  const roleIntroductions = ['談的是', '讓人想到', '也關乎'];

  function visibleElements(counts = {}) {
    const names = Object.keys(elements);
    const most = Math.max(...names.map(name => counts[name] ?? 0));
    return most > 0 ? names.filter(name => counts[name] === most) : [];
  }

  function elementStory(names) {
    if (names.length === 1) {
      const [name] = names;
      const { theme, example } = elements[name];
      return `就盤面可見的八個字來看，${name}出現得最多。${name}在五行裡讓人想到${theme}，放到日常，像是${example}。`;
    }
    const themes = names.map(name => `${name}對應${elements[name].theme}`).join('，');
    return `盤面可見的八個字裡，${names.join('、')}同樣常見。${themes}，是理解這張盤的幾個不同角度。`;
  }

  function visibleRoles(pillars) {
    const locations = new Map();
    for (const [id, label] of Object.entries(stemLabels)) {
      const role = pillars.find(pillar => pillar.id === id)?.tenGod;
      if (!Object.hasOwn(tenGods, role)) continue;
      const labels = locations.get(role) ?? [];
      labels.push(label);
      locations.set(role, labels);
    }
    return [...locations.entries()];
  }

  function describe(chart) {
    const day = dayMasters[chart?.dayMaster?.stem];
    if (!day) return null;

    const visible = visibleElements(chart.elementCounts);
    const roles = visibleRoles(chart.pillars ?? []);
    const sections = [{ title: '做事的起點', text: day.scene }];
    if (visible.length) sections.push({ title: '盤面上的五行', text: elementStory(visible) });
    if (roles.length) {
      const text = roles.map(([name, locations], index) => (
        `${locations.join('和')}見${name}，${roleIntroductions[index]}${tenGods[name].theme}。`
      )).join('');
      sections.push({ title: '十神帶出的生活線索', text });
    }

    const focus = roles[0] && tenGods[roles[0][0]];
    const conclusion = focus
      ? `${day.closing}${focus.scene}時，${day.strength}也可能幫你${focus.result}。`
      : day.closing;
    return { headline: day.headline, intro: day.intro, sections, conclusion };
  }

  window.MoonveilBaziReading = { describe };
})();
