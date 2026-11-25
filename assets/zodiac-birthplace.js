(() => {
  "use strict";

  // Approximate city coordinates and timezone IDs adapted from GeoNames (CC BY 4.0).
  // https://www.geonames.org/  https://creativecommons.org/licenses/by/4.0/
  // Cities were selected from the cities15000 and TW extracts and labelled in Traditional Chinese.
  const cities = Object.freeze([
    ["taipei", "台北市", "台灣", 25.05306, 121.52639, "Asia/Taipei"], // GeoNames 1668341
    ["new-taipei", "新北市（板橋）", "台灣", 25.01427, 121.46719, "Asia/Taipei"], // GeoNames 1670029
    ["keelung", "基隆市", "台灣", 25.13089, 121.74094, "Asia/Taipei"], // GeoNames 1678228
    ["taoyuan", "桃園市", "台灣", 24.99368, 121.29696, "Asia/Taipei"], // GeoNames 6696918
    ["hsinchu", "新竹市", "台灣", 24.80361, 120.96861, "Asia/Taipei"], // GeoNames 1675151
    ["miaoli", "苗栗市", "台灣", 24.56427, 120.82367, "Asia/Taipei"], // GeoNames 1671971
    ["taichung", "台中市", "台灣", 24.1469, 120.6839, "Asia/Taipei"], // GeoNames 1668399
    ["changhua", "彰化市", "台灣", 24.07327, 120.56276, "Asia/Taipei"], // GeoNames 1679136
    ["nantou", "南投市", "台灣", 23.91566, 120.66387, "Asia/Taipei"], // GeoNames 1671566
    ["douliu", "雲林斗六", "台灣", 23.70944, 120.54333, "Asia/Taipei"], // GeoNames 1665196
    ["chiayi", "嘉義市", "台灣", 23.47917, 120.44889, "Asia/Taipei"], // GeoNames 1678836
    ["tainan", "台南市", "台灣", 22.99259, 120.20507, "Asia/Taipei"], // GeoNames 1668355
    ["kaohsiung", "高雄市", "台灣", 22.61626, 120.31333, "Asia/Taipei"], // GeoNames 1673820
    ["pingtung", "屏東市", "台灣", 22.67135, 120.48814, "Asia/Taipei"], // GeoNames 1670481
    ["yilan", "宜蘭市", "台灣", 24.757, 121.753, "Asia/Taipei"], // GeoNames 1674199
    ["hualien", "花蓮市", "台灣", 23.97694, 121.60444, "Asia/Taipei"], // GeoNames 1674504
    ["taitung", "台東市", "台灣", 22.75991, 121.14457, "Asia/Taipei"], // GeoNames 1668295
    ["magong", "澎湖馬公", "台灣", 23.5654, 119.58627, "Asia/Taipei"], // GeoNames 1672228
    ["jincheng", "金門金城", "台灣", 24.43415, 118.31712, "Asia/Taipei"], // GeoNames 1678008
    ["nangan", "馬祖南竿", "台灣", 26.15039, 119.93284, "Asia/Taipei"], // GeoNames 7552914
    ["hong-kong", "香港", "香港", 22.27832, 114.17469, "Asia/Hong_Kong"], // GeoNames 1819729
    ["macau", "澳門", "澳門", 22.20056, 113.54611, "Asia/Macau"], // GeoNames 1821274
    ["beijing", "北京", "中國大陸", 39.9075, 116.39723, "Asia/Shanghai"], // GeoNames 1816670
    ["shanghai", "上海", "中國大陸", 31.22222, 121.45806, "Asia/Shanghai"], // GeoNames 1796236
    ["guangzhou", "廣州", "中國大陸", 23.11667, 113.25, "Asia/Shanghai"], // GeoNames 1809858
    ["shenzhen", "深圳", "中國大陸", 22.54554, 114.0683, "Asia/Shanghai"], // GeoNames 1795565
    ["tokyo", "東京", "日本", 35.6895, 139.69171, "Asia/Tokyo"], // GeoNames 1850147
    ["osaka", "大阪", "日本", 34.69379, 135.50107, "Asia/Tokyo"], // GeoNames 1853909
    ["sapporo", "札幌", "日本", 43.06667, 141.35, "Asia/Tokyo"], // GeoNames 2128295
    ["seoul", "首爾", "韓國", 37.566, 126.9784, "Asia/Seoul"], // GeoNames 1835848
    ["busan", "釜山", "韓國", 35.10168, 129.03004, "Asia/Seoul"], // GeoNames 1838524
    ["manila", "馬尼拉", "菲律賓", 14.6042, 120.9822, "Asia/Manila"], // GeoNames 1701668
    ["ho-chi-minh", "胡志明市", "越南", 10.82302, 106.62965, "Asia/Ho_Chi_Minh"], // GeoNames 1566083
    ["bangkok", "曼谷", "泰國", 13.75398, 100.50144, "Asia/Bangkok"], // GeoNames 1609350
    ["singapore", "新加坡", "新加坡", 1.28967, 103.85007, "Asia/Singapore"], // GeoNames 1880252
    ["kuala-lumpur", "吉隆坡", "馬來西亞", 3.1412, 101.68653, "Asia/Kuala_Lumpur"], // GeoNames 1735161
    ["jakarta", "雅加達", "印尼", -6.21462, 106.84513, "Asia/Jakarta"], // GeoNames 1642911
    ["kathmandu", "加德滿都", "尼泊爾", 27.70169, 85.3206, "Asia/Kathmandu"], // GeoNames 1283240
    ["new-delhi", "新德里", "印度", 28.62137, 77.2148, "Asia/Kolkata"], // GeoNames 1261481
    ["mumbai", "孟買", "印度", 19.07283, 72.88261, "Asia/Kolkata"], // GeoNames 1275339
    ["dubai", "杜拜", "阿拉伯聯合大公國", 25.07725, 55.30927, "Asia/Dubai"], // GeoNames 292223
    ["istanbul", "伊斯坦堡", "土耳其", 41.01384, 28.94966, "Europe/Istanbul"], // GeoNames 745044
    ["cairo", "開羅", "埃及", 30.06263, 31.24967, "Africa/Cairo"], // GeoNames 360630
    ["cape-town", "開普敦", "南非", -33.92584, 18.42322, "Africa/Johannesburg"], // GeoNames 3369157
    ["nairobi", "奈洛比", "肯亞", -1.28333, 36.81667, "Africa/Nairobi"], // GeoNames 184745
    ["london", "倫敦", "英國", 51.50853, -0.12574, "Europe/London"], // GeoNames 2643743
    ["paris", "巴黎", "法國", 48.85341, 2.3488, "Europe/Paris"], // GeoNames 2988507
    ["berlin", "柏林", "德國", 52.52437, 13.41053, "Europe/Berlin"], // GeoNames 2950159
    ["madrid", "馬德里", "西班牙", 40.4165, -3.70256, "Europe/Madrid"], // GeoNames 3117735
    ["rome", "羅馬", "義大利", 41.89193, 12.51133, "Europe/Rome"], // GeoNames 3169070
    ["zurich", "蘇黎世", "瑞士", 47.36667, 8.55, "Europe/Zurich"], // GeoNames 2657896
    ["moscow", "莫斯科", "俄羅斯", 55.75204, 37.61781, "Europe/Moscow"], // GeoNames 524901
    ["new-york", "紐約", "美國", 40.71427, -74.00597, "America/New_York"], // GeoNames 5128581
    ["los-angeles", "洛杉磯", "美國", 34.05223, -118.24368, "America/Los_Angeles"], // GeoNames 5368361
    ["san-francisco", "舊金山", "美國", 37.77493, -122.41942, "America/Los_Angeles"], // GeoNames 5391959
    ["chicago", "芝加哥", "美國", 41.85003, -87.65005, "America/Chicago"], // GeoNames 4887398
    ["denver", "丹佛", "美國", 39.73915, -104.9847, "America/Denver"], // GeoNames 5419384
    ["honolulu", "檀香山", "美國", 21.30694, -157.85833, "Pacific/Honolulu"], // GeoNames 5856195
    ["toronto", "多倫多", "加拿大", 43.65333, -79.38389, "America/Toronto"], // GeoNames 6167865
    ["vancouver", "溫哥華", "加拿大", 49.24966, -123.11934, "America/Vancouver"], // GeoNames 6173331
    ["montreal", "蒙特婁", "加拿大", 45.50884, -73.58781, "America/Toronto"], // GeoNames 6077243
    ["mexico-city", "墨西哥城", "墨西哥", 19.42847, -99.12766, "America/Mexico_City"], // GeoNames 3530597
    ["sao-paulo", "聖保羅", "巴西", -23.5475, -46.63611, "America/Sao_Paulo"], // GeoNames 3448439
    ["buenos-aires", "布宜諾斯艾利斯", "阿根廷", -34.61315, -58.37723, "America/Argentina/Buenos_Aires"], // GeoNames 3435910
    ["sydney", "雪梨", "澳洲", -33.86785, 151.20732, "Australia/Sydney"], // GeoNames 2147714
    ["melbourne", "墨爾本", "澳洲", -37.814, 144.96332, "Australia/Melbourne"], // GeoNames 2158177
    ["perth", "伯斯", "澳洲", -31.95224, 115.8614, "Australia/Perth"], // GeoNames 2063523
    ["auckland", "奧克蘭", "紐西蘭", -36.84853, 174.76349, "Pacific/Auckland"], // GeoNames 2193733
  ].map(([id, name, region, latitude, longitude, timeZone]) =>
    Object.freeze({id, name, region, latitude, longitude, timeZone})));

  const hourMilliseconds = 3600000;

  function invalidInput(code, message) {
    return Object.assign(new RangeError(message), {code});
  }

  function utcStamp(year, month, day, hour, minute, second) {
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    date.setUTCHours(hour, minute, second, 0);
    return date.getTime();
  }

  function parseLocalStamp(dateText, timeText) {
    const dateMatch = typeof dateText === "string" && /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateText);
    if (!dateMatch) throw invalidInput("BIRTH_DATE", "請輸入有效的出生日期。");
    const timeMatch = typeof timeText === "string" && /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(timeText);
    if (!timeMatch) throw invalidInput("BIRTH_TIME", "請輸入有效的出生時間。");

    const [, year, month, day] = dateMatch.map(Number);
    const [, hour, minute] = timeMatch.map(Number);
    const second = Number(timeMatch[3] ?? "0");
    if (hour > 23 || minute > 59 || second > 59) {
      throw invalidInput("BIRTH_TIME", "請輸入有效的出生時間。");
    }
    const localStamp = utcStamp(year, month, day, hour, minute, second);
    const check = new Date(localStamp);
    if (year < 1 || check.getUTCFullYear() !== year || check.getUTCMonth() + 1 !== month ||
        check.getUTCDate() !== day) {
      throw invalidInput("BIRTH_DATE", "出生日期不存在，請核對年、月、日。");
    }
    return localStamp;
  }

  function localFormatter(timeZone) {
    if (typeof timeZone !== "string" || !/^[A-Za-z][A-Za-z0-9_.+-]*(?:\/[A-Za-z0-9_.+-]+)*$/.test(timeZone)) {
      throw invalidInput("BIRTH_TIMEZONE", "請輸入有效的 IANA 時區，例如 Asia/Taipei。");
    }
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone, calendar: "gregory", numberingSystem: "latn", hourCycle: "h23", era: "short",
        year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit"
      });
    } catch {
      throw invalidInput("BIRTH_TIMEZONE", "找不到此時區，請核對 IANA 時區名稱。");
    }
  }

  function formattedWallStamp(formatter, utc) {
    const parts = Object.fromEntries(formatter.formatToParts(utc).map(part => [part.type, part.value]));
    const year = Number(parts.year);
    return utcStamp(parts.era === "BC" ? 1 - year : year, Number(parts.month), Number(parts.day),
      Number(parts.hour), Number(parts.minute), Number(parts.second));
  }

  function formatOffset(offset) {
    const totalSeconds = Math.abs(offset) / 1000;
    const twoDigits = value => String(value).padStart(2, "0");
    const hour = Math.floor(totalSeconds / 3600);
    const minute = Math.floor(totalSeconds / 60) % 60;
    const second = totalSeconds % 60;
    return "UTC" + (offset < 0 ? "-" : "+") + twoDigits(hour) + ":" + twoDigits(minute) +
      (second ? ":" + twoDigits(second) : "");
  }

  function resolveLocalTime(dateText, timeText, timeZone) {
    const localStamp = parseLocalStamp(dateText, timeText);
    const formatter = localFormatter(timeZone);
    // Include offsets on both sides of nearby transitions. Round-trip each candidate
    // against the requested wall time to reject skipped times and retain both folds.
    const offsets = new Set();
    for (let hour = -36; hour <= 36; hour++) {
      const instant = localStamp + hour * hourMilliseconds;
      offsets.add(formattedWallStamp(formatter, instant) - instant);
    }
    const candidates = [];
    for (const offset of offsets) {
      const utc = localStamp - offset;
      if (formattedWallStamp(formatter, utc) === localStamp) {
        candidates.push({date: new Date(utc), offsetLabel: formatOffset(offset)});
      }
    }
    return candidates.sort((first, second) => first.date - second.date);
  }

  window.MoonveilBirthplace = Object.freeze({cities, resolveLocalTime});
})();
