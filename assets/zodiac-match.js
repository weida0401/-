(() => {
  "use strict";

  const signs = {
    aries: {
      name: "牡羊座", element: "fire", modality: "cardinal",
      style: "提出一個可以立刻試的做法",
      mirror: "各提一個做法，輪流說出一個可能的代價。選一個可以小規模試行的版本，並約好何時回顧。"
    },
    taurus: {
      name: "金牛座", element: "earth", modality: "fixed",
      style: "留意哪種安排能讓日常穩定下來",
      mirror: "下次調整見面安排時，保留一項彼此熟悉的活動，再一起試一個新的時間或地點。"
    },
    gemini: {
      name: "雙子座", element: "air", modality: "mutable",
      style: "先問幾個問題，找出彼此還沒想到的選項",
      mirror: "各分享一件最近感興趣的事，選出一件願意一起試的，直接約好時間。"
    },
    cancer: {
      name: "巨蟹座", element: "water", modality: "cardinal",
      style: "留意氣氛和對方有沒有被照顧到",
      mirror: "各說一件最近希望獲得的照顧，像是先聽自己說五分鐘，或在忙完後主動問一聲。"
    },
    leo: {
      name: "獅子座", element: "fire", modality: "fixed",
      style: "把自己重視的事說得鮮明，也邀請對方參與",
      mirror: "輪流分享一件自己最近努力的事。聽完後，說出一個你真心欣賞對方的具體地方。"
    },
    virgo: {
      name: "處女座", element: "earth", modality: "mutable",
      style: "把卡住的事拆開，找出最容易改善的細節",
      mirror: "想給建議時，先問對方現在想聊聊感受，還是想一起找做法。如果對方想找做法，先談一項就好。"
    },
    libra: {
      name: "天秤座", element: "air", modality: "cardinal",
      style: "先聽懂雙方的立場，再找一個能接受的安排",
      mirror: "面對一項難決定的安排，各自說出一個必須保留的條件和一個能調整的條件，再訂定決定時間。"
    },
    scorpio: {
      name: "天蠍座", element: "water", modality: "fixed",
      style: "先確認彼此說的和做的能不能互相對上",
      mirror: "各說出一件最近讓自己在意的事，從實際發生的情況說起。聽的人先確認理解，再說自己的想法。"
    },
    sagittarius: {
      name: "射手座", element: "fire", modality: "mutable",
      style: "透過新體驗辨認什麼方向值得繼續",
      mirror: "找一個雙方都好奇的活動，各留一段自由時間，並在出發前約好什麼時候重新會合。"
    },
    capricorn: {
      name: "摩羯座", element: "earth", modality: "cardinal",
      style: "先把時間、責任和優先順序安排好",
      mirror: "留一段共同時間談各自的近況，從最近最有成就感或最耗力的一件事開始。"
    },
    aquarius: {
      name: "水瓶座", element: "air", modality: "fixed",
      style: "先退一步看整體，再提出不一樣的做法",
      mirror: "各說出自己希望保留的獨處時間，再定一個雙方都願意固定留給彼此的時段。"
    },
    pisces: {
      name: "雙魚座", element: "water", modality: "mutable",
      style: "從對方的語氣和情緒理解眼前的事",
      mirror: "各說一件能讓自己感到被支持的行動，再說明這週有哪些時間和餘力能提供幫忙。"
    }
  };

  const elementPairs = {
    "air-air": {
      headline: "聊得來，也可以一起把事做成",
      strength: "互相提問容易帶出新點子。一起探索共同興趣，或把一個話題帶進生活，會讓交流更有延續性。",
      friction: "有些話題跳得快，對方可能還在想剛才那件事。遇到真正在意的內容，留時間把同一件事聊完。",
      nextStep: "下次遇到雙方都感興趣的點子，用一句話說清楚想一起做什麼，再約好時間。"
    },
    "air-earth": {
      headline: "點子有了，也找得到做法",
      strength: "討論方案時，一方能多提出幾種可能，另一方能核對時間、資源和細節。用這種分工，很容易找出能做的小版本。",
      friction: "臨時加進新選項時，原本的承諾可能得跟著調整。比較想法之前，可以先把成本和已經答應的事列清楚。",
      nextStep: "挑一件都想試的事，寫下一個最簡單的版本、預計花多久，以及誰負責第一步。"
    },
    "air-fire": {
      headline: "靈感遇到行動，一拍即合時記得約個時間",
      strength: "聊天能帶出行動的靈感，真正一起去做也會帶來新話題。適合安排雙方都喜歡的短活動，保留發揮和臨場調整的空間。",
      friction: "熱度來得快，討論也容易往下一個點子移動。若對一項邀約的認真程度有落差，直接確認各自願意投入的時間。",
      nextStep: "把一件聊得最起勁的事排進這週的行程。做完後交換各自最喜歡的一部分。"
    },
    "air-water": {
      headline: "把感受說出來，讓理解跟得上",
      strength: "一方擅長幫模糊的感受找詞，另一方能察覺話裡還沒說清楚的需要。耐心追問能讓對話走得更深。",
      friction: "分析原因和消化情緒需要不同時間。在討論原因之前，先問當下需要有人聽，還是想一起想辦法。",
      nextStep: "選一件小誤會。一人說當時的感受與希望，另一人用自己的話確認理解，再交換角色。"
    },
    "earth-earth": {
      headline: "用穩定的承諾累積信任",
      strength: "彼此願意把安排落實，也會留意生活裡做得到的細節。固定保留一點共同時間，容易成為長久的連結。",
      friction: "有些默契用久了容易變成例行公事。偶爾檢查哪些安排還有幫助，哪些已經需要調整。",
      nextStep: "各選一個想維持的習慣和一個想改的環節，先對其中一項小改動試行一週。"
    },
    "earth-fire": {
      headline: "把熱情排成走得下去的步驟",
      strength: "有動力的一方能帶動開頭，注重細節的一方能排出時間與分工。共同計畫既有動能，也能穩定收尾。",
      friction: "一方準備開始時，另一方可能還在盤點成本。先說清楚什麼能立即試，以及哪些承諾要等資料齊全再做。",
      nextStep: "把想做的事分成可先試一回的小版本和需要討論的正式版本。先安排一次小試，再比較感受。"
    },
    "earth-water": {
      headline: "體貼和守約能帶來踏實的連結",
      strength: "關心很容易落在實際生活，例如記得對方的安排、適時問候，或幫對方處理一件累人的小事。",
      friction: "提供協助和想被理解有時會錯開。忙著幫忙之前，問一下對方希望你在哪一部分陪著或處理。",
      nextStep: "選一個最近壓力最大的時段，各說一個當時最實用的幫忙方式，試著為彼此做一次。"
    },
    "fire-fire": {
      headline: "一起開始容易，安排收尾也值得先談",
      strength: "雙方對新活動和挑戰容易有回應。遇到需要帶頭的時候，輪流提案能讓彼此都有參與感。",
      friction: "同時有主意時，兩人可能很快跳到各自的方案。先講清楚想一起達成什麼，再談具體做法。",
      nextStep: "選一件小事一起完成。動手前，確認這次誰負責決定做法、誰負責最後整理。"
    },
    "fire-water": {
      headline: "主動靠近時，留時間對齊彼此的感受",
      strength: "主動提出下一步能讓卡住的事往前。把當下的感受說清楚，則能幫忙找出雙方都願意的速度。",
      friction: "一方覺得應該快點處理，另一方可能需要時間想清楚。先確認什麼時候再談，讓彼此知道對話會繼續。",
      nextStep: "下一次有分歧時，先各說一句「我現在最在意的是……」，再約好要談多久和今天能決定哪一件事。"
    },
    "water-water": {
      headline: "容易感受到彼此，適合再多問一句",
      strength: "雙方有機會很快留意對方的情緒變化。能放心分享細微感受時，陪伴會成為很實際的支持。",
      friction: "敏銳有時會變成猜測，尤其遇到回應變慢或語氣改變。說出你觀察到的事，問對方是不是也這樣理解。",
      nextStep: "在兩人都放鬆時交換最近最希望被理解的一件事，最後確認對方希望你怎麼回應。"
    }
  };

  const modalities = {
    "cardinal-cardinal": "兩人都想主動安排時，可以輪流做第一個提案的人。",
    "cardinal-fixed": "討論變動時，一起說清楚什麼值得先試，以及哪一項原有安排值得保留。",
    "cardinal-mutable": "把決定時間和可以彈性調整的部分分開談，會比較容易一起往前。",
    "fixed-fixed": "若雙方都習慣照原本的方式做，可以為一個小改動設定短期試用時間。",
    "fixed-mutable": "先留下一兩項固定約定，其他細節可以隨情況調整。",
    "mutable-mutable": "有好幾個可行選項時，設定一個一起選定的時間，比繼續增加選項更有幫助。"
  };

  const transitCues = {
    Mercury: {
      name: "水星",
      focus: "挑一件本週需要一起決定的事，用一句話寫清楚要確認的問題。",
      support: "把邀約的時間和地點寫下來，再請對方確認安排。",
      challenge: "訊息容易有不同解讀時，先用一句話確認對方的意思，再回應。"
    },
    Venus: {
      name: "金星",
      focus: "各說一件最近讓自己感到被在乎的小事，再想想怎麼把它留在日常。",
      support: "可以主動提一個簡單的邀約，或具體說出你欣賞對方的哪一個舉動。",
      challenge: "期待出現落差時，各說出一件希望對方做到的事，再確認兩人各自能答應多少。"
    }
  };
  const aspectAngles = {
    合相: 0, 六合: 60, 四分相: 90, 三分相: 120, 對分相: 180
  };
  const venusSnapshotCues = {
    fire: "想拉近距離時，提一個可以這週一起試的小活動，先問對方有沒有時間和興趣。",
    earth: "用一個能做到的小約定照顧彼此，例如敲定見面時間或主動分擔一件日常小事。",
    air: "找一段輕鬆的時間交換近況，聊到在意的事時也可以說清楚你期待怎樣的回應。",
    water: "說出一件最近讓自己感到被照顧的事，也問對方現在希望得到怎樣的支持。"
  };

  const zodiacOrder = Object.keys(signs);

  function pairKey(first, second) {
    return [first, second].sort().join("-");
  }

  function compare(firstId, secondId) {
    const firstIndex = zodiacOrder.indexOf(firstId);
    const secondIndex = zodiacOrder.indexOf(secondId);
    if (firstIndex < 0 || secondIndex < 0) return null;

    const first = signs[zodiacOrder[Math.min(firstIndex, secondIndex)]];
    const second = signs[zodiacOrder[Math.max(firstIndex, secondIndex)]];
    const sameSign = firstIndex === secondIndex;
    const pair = elementPairs[pairKey(first.element, second.element)];
    const rhythm = modalities[pairKey(first.modality, second.modality)];
    const overview = sameSign
      ? `兩位${first.name}可能都喜歡${first.style}。${rhythm}`
      : `${first.name}可能喜歡${first.style}，${second.name}可能喜歡${second.style}。${rhythm}`;

    return {
      headline: pair.headline,
      overview,
      strength: pair.strength,
      friction: pair.friction,
      nextStep: sameSign ? first.mirror : pair.nextStep
    };
  }

  function transitNote(firstId, secondId, firstWeek, secondWeek) {
    if (!zodiacOrder.includes(firstId) || !zodiacOrder.includes(secondId)) return "";

    const weekly = [[firstId, firstWeek], [secondId, secondWeek]];
    const highlights = weekly.flatMap(([target, week]) => {
      if (!Array.isArray(week?.highlights)) return [];
      return week.highlights.map(entry => ({ target, entry }));
    });
    const sampleDate = entry => typeof entry.dateLabel === "string" ? entry.dateLabel : "";
    const dated = entry => sampleDate(entry) ? sampleDate(entry) + " " : "";
    const notes = [];
    for (const [planet, guide] of Object.entries(transitCues)) {
      const candidates = highlights.filter(({ entry }) => entry?.planet === planet &&
        zodiacOrder.includes(entry.signId) &&
        Object.hasOwn(aspectAngles, entry.aspect?.name) &&
        ["focus", "support", "challenge"].includes(entry.aspect?.tone) &&
        Number.isFinite(entry.aspect?.degrees));
      const distance = ({entry}) => Math.abs(entry.aspect.degrees - aspectAngles[entry.aspect.name]);
      candidates.sort((left, right) => distance(left) - distance(right) ||
        zodiacOrder.indexOf(left.target) - zodiacOrder.indexOf(right.target) ||
        sampleDate(left.entry).localeCompare(sampleDate(right.entry)) ||
        zodiacOrder.indexOf(left.entry.signId) - zodiacOrder.indexOf(right.entry.signId) ||
        left.entry.aspect.name.localeCompare(right.entry.aspect.name) ||
        left.entry.aspect.tone.localeCompare(right.entry.aspect.tone));
      const match = candidates[0];
      if (match) {
        const { entry, target } = match;
        notes.push(dated(entry) + guide.name + "位於" + signs[entry.signId].name +
          "，與" + signs[target].name + "中點接近" + entry.aspect.name + "。" + guide[entry.aspect.tone]);
      }
    }
    if (notes.length) return "本週取樣中，" + notes.join("");

    const venus = weekly.flatMap(([, week]) => Array.isArray(week?.sky)
      ? week.sky.filter(entry => entry?.planet === "Venus" && zodiacOrder.includes(entry.signId))
      : []).sort((left, right) => sampleDate(left).localeCompare(sampleDate(right)) ||
        zodiacOrder.indexOf(left.signId) - zodiacOrder.indexOf(right.signId))[0];
    if (!venus) return "";
    const sign = signs[venus.signId];
    return dated(venus) + "金星位於" + sign.name + "。" + venusSnapshotCues[sign.element];
  }

  window.MoonveilZodiacMatch = Object.freeze({ compare, transitNote });
})();
