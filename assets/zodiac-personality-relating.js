(() => {
  'use strict';

  const venusStyles = {
    aries: ['把「我想到你」變成一個邀約，或直接問對方需不需要幫忙', '對方願意給出清楚的回應，你會比較知道這份心意有沒有傳到'],
    taurus: ['把對方愛吃什麼、什麼時候想休息記在心裡，悄悄留一點空間給他', '有一件小事被長久記得，可能就會讓你感到被好好對待'],
    gemini: ['把今天看到的一件有趣的事分享出去，讓對話自然接下去', '對方還記得你上次沒說完的那句話，會讓你感覺他真的有在聽'],
    cancer: ['挑對方忙完的時候問一句今天過得好不好，留時間聽他回答', '也有人這樣主動想起你時，這份關心會比較有來有往'],
    leo: ['替對方認真慶祝一件小成果，或讓他知道你有多佩服那份努力', '別人能說出看見你哪一份心力，那句肯定比較容易留在心裡'],
    virgo: ['看出哪件小事已經讓對方忙不過來，順手幫他處理一部分', '輪到你很忙時，有人接下一件實際的工作，可能就讓你感到被照顧'],
    libra: ['留意兩個人各在意哪一點，想出一個彼此都能享受的安排', '對方也願意問一句「那你呢」，會讓你覺得自己的偏好被放在心上'],
    scorpio: ['把一件不容易開口的事好好聽完，也替對方守住他的私事', '小約定一次次被做到，會讓你比較放心把在意的事說出來'],
    sagittarius: ['邀對方一起試一件沒做過的事，回來再交流各自喜歡哪一段', '有各自自在的時間，也知道何時會再見，通常會讓你更願意靠近'],
    capricorn: ['把答應陪對方處理的事留進自己的行程，到了那天確實出現', '有人記得你正在忙，也願意替你分擔一小段，你或許會覺得被珍惜'],
    aquarius: ['把對方提過的文章找來分享，等彼此有空再接著聊', '對方願意聽你仔細說想法，也能讓你自己想一想，你可能就會更自在'],
    pisces: ['用記得的細節送上一點體貼，例如傳一首對方聽了會放鬆的歌', '你還說不清楚感受時，有人安靜多聽一會兒，可能就會讓你覺得親近']
  };

  const mercuryPrompts = {
    aries: '我想先試一小步，你覺得我們現在可以做哪一件事？',
    taurus: '我得先知道大概會花多久，這樣我才知道能不能配合。',
    gemini: '我想先確認一件事。這個安排你最想調整哪一段？',
    cancer: '這件事有點讓我掛心，晚點方便聽我把想說的說完嗎？',
    leo: '這件事對我有點重要，可以先讓我說說我最在乎哪一段嗎？',
    virgo: '我們可以一起把最急的那一件列出來，先談它嗎？',
    libra: '我這邊可以配合的是這個部分，你那邊最需要調整哪裡？',
    scorpio: '我現在只知道這一部分，可以讓我了解其餘是怎麼回事嗎？',
    sagittarius: '我們能先試一種做法，再約時間看看還要怎麼調嗎？',
    capricorn: '如果要一起處理，可以先說清楚各自負責到哪一步嗎？',
    aquarius: '我想先把想法理一理，明天再回來一起談，好嗎？',
    pisces: '我現在還有點難說清楚，可以先說哪一段讓我不太自在嗎？'
  };

  const moonReactions = {
    aries: ['心裡一急，也許就會催自己現在非得有個答案', '先離開催促你的訊息，走動一下再回來'],
    taurus: ['安排突然生變，可能會想先找回一點熟悉感', '手邊留一件可以照舊的小事，會比較能讓你定下來'],
    gemini: ['心裡可能同時冒出好幾個問題，越想越難停', '把最掛心的一句話寫下來，先只和一個人談這一件'],
    cancer: ['也許先忙著顧大家的需要，晚一點才察覺自己也累了', '留一段不用回應誰的時間，吃點東西或好好休息'],
    leo: ['也許先撐住現場，等空下來才發現心裡有點委屈', '找願意聽的人說說自己已經花了哪些力氣'],
    virgo: ['可能一直回頭檢查細節，忙到腦中還在排順序', '把今天一定要處理的事和明天再看的事分開寫'],
    libra: ['可能一邊理解各方的難處，一邊為自己要怎麼答覆而累', '先問問自己最希望保住哪一點，答覆前替它留個位置'],
    scorpio: ['沒弄清一件事為什麼變了，腦中可能就會一直回去想', '把實際看到的情況和還想查證的事各寫一行'],
    sagittarius: ['想法被塞在同一個地方太久，可能會很想換個空間透氣', '出去走一小段路，回來先只處理一件事'],
    capricorn: ['可能仍照著行程處理事，等一天快結束才發覺自己沒力了', '先替今天訂個能交代的段落，到那裡就允許自己收工'],
    aquarius: ['資訊和意見一多，可能會想暫時放下手機自己消化', '可以先約好回覆時間，給自己一段安靜的空檔'],
    pisces: ['別人很急的語氣也許留在心裡，等安靜下來才開始感覺到累', '試著把自己的需要和剛才接收到的情緒分開記下']
  };

  const marsResponses = {
    aries: ['也許想先衝過最難的那一步', '先試一輪能回頭的小做法，再決定要不要加快'],
    taurus: ['想撐著把原來的安排做完', '挑一段可以暫停的地方，看看剩下的事能不能換個做法'],
    gemini: ['容易同時著手好幾個方向', '選一個一刻鐘能收尾的小步驟，做完再開下一件'],
    cancer: ['可能先把自己很想保護的那一部分做好', '說清楚能接到哪裡，較難的部分可以請人一起幫忙'],
    leo: ['可能想自己把最難看的場面扛下來', '把其中一段交給信得過的人，自己留力做最在乎的部分'],
    virgo: ['可能在不太要緊的細節花掉太多時間', '先定一個做到哪裡就夠了的標準，照那個標準收工'],
    libra: ['容易一直等大家都點頭，手邊的事就停在原地', '說出目前可行的一步，和還需要一起決定的一點'],
    scorpio: ['一旦開始做，也許就不太願意中途停下來', '先處理影響最大的一段，剩下的事留到下個時段'],
    sagittarius: ['可能一口氣把範圍想得太大', '替自己定一個短一點的目標，試過之後再往外擴'],
    capricorn: ['可能一邊趕進度，一邊把別人的份也扛進來', '把誰負責什麼寫清楚，先交回一件原本不歸你的事'],
    aquarius: ['一覺得原本的方式卡住，可能就想從頭重做', '挑一個最卡的環節小量試改，看到差異後再動其他地方'],
    pisces: ['可能先照著氣氛答應，事後才發現自己接了太多', '先說自己現在做得到哪一段，再留時間回覆其他部分']
  };

  const houses = {
    1: {care:'剛開始和人熟起來時', talk:'第一次一起訂安排', strain:'剛接下不熟的新事時', act:'自己先做出一個開頭'},
    2: {care:'一起安排日常花費、借用物品時', talk:'得分配開銷或時間', strain:'收入或日常開銷不確定時', act:'決定要先花多少時間或錢'},
    3: {care:'平常傳訊息或短暫見面時', talk:'你們對同一句訊息的理解不一樣', strain:'訊息一條接一條進來時', act:'回覆一串還沒說清楚的訊息'},
    4: {care:'和家人或一起生活的人相處時', talk:'家裡原來的安排需要改動', strain:'家裡的行程臨時改變時', act:'調整家裡原先的分工'},
    5: {care:'和人分享嗜好、創作或放鬆時間時', talk:'一起做喜歡的事卻有不同想法', strain:'本來做得開心的事突然被催進度時', act:'把一個作品或興趣做下去'},
    6: {care:'陪人處理瑣事、分擔每天的工作時', talk:'每天的分工開始不太平均', strain:'日常事情一件接著一件時', act:'重新安排工作量與休息時間'},
    7: {care:'和親近的人或固定搭檔相處時', talk:'兩人對接下來的安排想得不一樣', strain:'搭檔突然改了談好的安排時', act:'和在乎的人重新談約定'},
    8: {care:'談到共同開銷、信任或私人界線時', talk:'需要確認彼此願意一起負擔多少', strain:'共用的錢或彼此的承諾有變數時', act:'把兩人要一起承擔的事重新談清楚'},
    9: {care:'一起學新事物、去陌生地方時', talk:'出門或報名前還沒說好彼此想要什麼', strain:'到了陌生的環境、資訊又不全時', act:'適應一個全新的計畫'},
    10: {care:'對方忙著把一件重要的事做完時', talk:'工作安排開始占用共同時間', strain:'有人在等你交出成果時', act:'回應工作上的期限或期待'},
    11: {care:'跟朋友聚會或在群組合作時', talk:'團體裡的人對分工有不同期待', strain:'群體的進度突然落到你身上時', act:'跟上多人共同的進度'},
    12: {care:'私下陪伴，或替彼此留點獨處時間時', talk:'你需要先安靜一下才能繼續聊', strain:'有些累還不知道怎麼說出口時', act:'把拖了一陣子的事重新接起來'}
  };
  const defaultContext = {
    care:'和在意的人相處時', talk:'彼此還沒說清楚自己的需要',
    strain:'眼前的事一多時', act:'處理眼前的一件事'
  };

  function contextOf(point) {
    return Object.hasOwn(houses, point.house) ? houses[point.house] : defaultContext;
  }

  function describe(chart) {
    const planets = Array.isArray(chart?.planets) ? chart.planets : [];
    const venus = planets.find(point => point?.id === 'Venus' && Object.hasOwn(venusStyles, point.signId));
    const mercury = planets.find(point => point?.id === 'Mercury' && Object.hasOwn(mercuryPrompts, point.signId));
    const moon = planets.find(point => point?.id === 'Moon' && Object.hasOwn(moonReactions, point.signId));
    const mars = planets.find(point => point?.id === 'Mars' && Object.hasOwn(marsResponses, point.signId));

    const relationshipParts = [];
    if (venus) {
      const [give, receive] = venusStyles[venus.signId];
      relationshipParts.push(`${contextOf(venus).care}，你可能會${give}。${receive}。`);
    }
    if (mercury) {
      const scene = contextOf(mercury).talk;
      relationshipParts.push(`如果${scene}，可以試著說「${mercuryPrompts[mercury.signId]}」`);
    }

    const pressureParts = [];
    if (moon) {
      const [response, comfort] = moonReactions[moon.signId];
      pressureParts.push(`${contextOf(moon).strain}，${response}。${comfort}。`);
    }
    if (mars) {
      const [reaction, step] = marsResponses[mars.signId];
      pressureParts.push(`需要${contextOf(mars).act}時，你${reaction}。可以${step}。`);
    }

    return { relationships: relationshipParts.join(''), pressure: pressureParts.join('') };
  }

  window.MoonveilPersonalityRelating = Object.freeze({ describe });
})();
