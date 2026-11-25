(() => {
  'use strict';

  const houses = [
    {
      title: '自我與第一印象', topic: '你怎麼走進新環境、展開一件事，以及別人初見你時感受到的樣子。',
      situation: '剛進入新環境或接下陌生的角色', interest: '你習慣怎麼起頭、希望別人怎麼認識自己'
    },
    {
      title: '金錢、資源與價值感', topic: '你如何看待收入、花費和手上的資源，以及什麼會讓你覺得踏實。',
      situation: '安排開銷或取捨手上的資源', interest: '你願意替哪些事花錢或花力氣，怎樣的生活能給你安定感'
    },
    {
      title: '溝通與日常學習', topic: '你平常怎麼說話、理解資訊，也包括手足、鄰里與日常往來。',
      situation: '跟身邊的人交換消息或學一件新東西', interest: '你怎麼整理資訊、又習慣用什麼方式讓人聽懂'
    },
    {
      title: '家庭與歸屬感', topic: '你和家、成長經驗及私人生活的關係，還有什麼地方會讓你覺得有歸屬感。',
      situation: '和家人相處或安排自己的私人空間', interest: '什麼樣的人或地方會讓你有回到自己人身邊的感覺'
    },
    {
      title: '創作、戀愛與樂趣', topic: '你怎麼享受創作、玩樂和心動的感覺，也包括你和孩子相處的方式。',
      situation: '發展興趣、創作，或和喜歡的人相處', interest: '什麼會讓你真心覺得好玩，哪些場合能讓你自在表現'
    },
    {
      title: '日常工作與作息', topic: '你如何分配日常工作、養成習慣，以及維持適合自己的生活步調。',
      situation: '安排每天的工作、分工或作息', interest: '什麼樣的分工和生活步調能讓你長久維持'
    },
    {
      title: '伴侶與合作', topic: '你怎麼和伴侶或搭檔相處，以及在一對一的關係裡重視什麼。',
      situation: '和伴侶或搭檔一起做決定', interest: '你期待在一對一關係裡怎麼配合，遇到分歧時又怎麼相處'
    },
    {
      title: '親密、信任與共用資源', topic: '你如何建立更深的信任，以及和別人一起承擔開銷或責任。',
      situation: '跟他人分享私事或一起負擔開銷和責任', interest: '你想把哪些事交給彼此一起承擔，怎麼樣才願意放心交付'
    },
    {
      title: '進修與世界觀', topic: '你如何透過進修、旅行或接觸不同觀點，改變看事情的方式。',
      situation: '想進修、出遠門或接觸新的觀點', interest: '哪些經驗會改變你原本的看法，讓你願意接著探索'
    },
    {
      title: '職涯與對外角色', topic: '你想走怎樣的職涯路，願意承擔哪些責任，以及希望別人因什麼記得你。',
      situation: '選擇工作方向或接下一項對外的責任', interest: '你想因為怎樣的能力或貢獻被人記得'
    },
    {
      title: '朋友、社群與共同目標', topic: '你怎麼和朋友或團隊往來，以及想和大家一起完成什麼。',
      situation: '和朋友或團隊一起推動一件事', interest: '你喜歡在團隊裡扮演什麼角色，又願意和什麼樣的人長期合作'
    },
    {
      title: '獨處與內在整理', topic: '你怎麼休息、整理難以言說的感受，以及消化外界看不見的事情。',
      situation: '暫時放下手邊的事，留時間獨處', interest: '你平常需要多少獨處的空間，哪種方式真的能讓你放鬆'
    }
  ];

  const signs = {
    aries: { ruler: 'Mars', tendency: '先試一個做法，邊做邊確認方向' },
    taurus: { ruler: 'Venus', tendency: '先熟悉當下的條件，再用能長久維持的步調做下去' },
    gemini: { ruler: 'Mercury', tendency: '先問幾個問題，弄清楚還有哪些資訊和選擇' },
    cancer: { ruler: 'Moon', tendency: '先留意自己和身邊的人各需要什麼，等心裡安定一點再往下走' },
    leo: { ruler: 'Sun', tendency: '把自己有熱情的部分表達出來，也在意投入有沒有被人看見' },
    virgo: { ruler: 'Mercury', tendency: '先弄清楚細節和步驟，從可以實際改好的一小部分著手' },
    libra: { ruler: 'Venus', tendency: '先了解彼此的考量，找一個雙方都能接受的方式' },
    scorpio: { ruler: 'Mars', tendency: '先看看表面之下還有哪些沒說清楚的地方，等確認可以信任再投入' },
    sagittarius: { ruler: 'Jupiter', tendency: '想知道還有沒有沒試過的路，也願意聽聽不一樣的看法' },
    capricorn: { ruler: 'Saturn', tendency: '先分清要承擔什麼，弄清楚哪些事值得慢慢做出成果' },
    aquarius: { ruler: 'Saturn', tendency: '先看看原有的安排為什麼這樣做，也會想有沒有適合自己的新方法' },
    pisces: { ruler: 'Jupiter', tendency: '先感受周圍的氣氛，留一點時間分辨自己的感受' }
  };

  const planetFocus = {
    Sun: '能不能做出自己認同、也願意長期投入的事',
    Moon: '哪種環境能讓你安心，事情有變化時情緒又怎麼跟上',
    Mercury: '事情有沒有說清楚，彼此手上的資訊是否一致',
    Venus: '相處舒不舒服，事情能不能兼顧彼此看重的部分',
    Mars: '有沒有主動行動的空間、哪些界線得先說明白',
    Jupiter: '有沒有機會累積新經驗、接觸原本不知道的做法',
    Saturn: '責任和時間能不能長久負擔，哪些事需要慢慢做出成果',
    Uranus: '哪些習以為常的做法其實還有調整的餘地',
    Neptune: '心裡期待的樣子，和實際情況之間有多少落差',
    Pluto: '反覆卡住的事情背後，有沒有一個深一點的原因'
  };

  function occupiedReading(planets) {
    const placements = planets.map(planet => (
      planet.signName ? `${planet.name}在${planet.signName}` : planet.name
    )).join('、');
    const focus = planetFocus[planets[0].id];
    const position = planets.length === 1 ? `${placements}，也落在這一宮。` : `${placements}，都落在這一宮。`;
    return focus ? `${position}在這個領域，你可能也格外在意${focus}。` : position;
  }

  function emptyReading(house, ruler) {
    if (!ruler) return '';
    const destination = houses[ruler.house - 1];
    if (!destination) return '';
    const placement = ruler.signName ? `${ruler.signName}第 ${ruler.house} 宮` : `第 ${ruler.house} 宮`;
    return `宮主星${ruler.name}落在${placement}。${destination.situation}時，也比較容易看出${house.interest}。`;
  }

  function describe(chart) {
    const cusps = new Map((chart?.cusps ?? []).map(cusp => [cusp.house, cusp]));
    const planets = chart?.planets ?? [];
    const planetsById = new Map(planets.map(planet => [planet.id, planet]));

    return houses.map((house, index) => {
      const number = index + 1;
      const cusp = cusps.get(number);
      const sign = signs[cusp?.signId];
      const ruler = planetsById.get(sign?.ruler) ?? null;
      const located = planets.filter(planet => planet.house === number);
      const overview = sign && cusp.signName
        ? `宮頭在${cusp.signName}，${house.situation}時，你可能會${sign.tendency}。`
        : house.topic;
      const detail = located.length ? occupiedReading(located) : emptyReading(house, ruler);
      return { number, title: house.title, topic: house.topic, summary: overview + detail, ruler };
    });
  }

  window.MoonveilNatalHouses = { describe };
})();
