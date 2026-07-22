const JACKPOT_RATE = 0.5;

const defaultClothesOptions = ["빨강", "파랑", "초록", "베이지", "검정", "흰색", "노랑", "보라"];
const defaultFoodOptions = ["토스트", "시리얼", "김밥", "과일", "요거트", "죽", "샌드위치", "블랙커피"];
const defaultMusicOptions = ["재즈", "시티팝", "클래식", "로파이", "케이팝", "록", "발라드", "무음"];

const jackpotCombos = [
  {
    clothes: "검정",
    food: "블랙커피",
    music: "록",
    title: "록스타 모드",
    comment: "오늘은 올블랙으로 출근해도 충분히 멋져요. 거침없는 하루가 열립니다.",
    accent: "#3f6f8f"
  },
  {
    clothes: "흰색",
    food: "요거트",
    music: "재즈",
    title: "포근한 아침 연주",
    comment: "하얀 톤과 달콤한 아침 식사는 오늘을 아주 부드럽게 시작해줘요.",
    accent: "#f4edd8"
  },
  {
    clothes: "파랑",
    food: "과일",
    music: "시티팝",
    title: "도시의 작은 기분 전환",
    comment: "시원한 파란빛과 경쾌한 음악이 오늘의 분위기를 올려줄 거예요.",
    accent: "#b9d9e8"
  },
  {
    clothes: "빨강",
    food: "토스트",
    music: "케이팝",
    title: "아이돌 출근길",
    comment: "빨간 포인트에 신나는 비트까지, 오늘 무대의 주인공은 당신이에요.",
    accent: "#c59a3a"
  },
  {
    clothes: "노랑",
    food: "시리얼",
    music: "로파이",
    title: "느긋한 햇살 모드",
    comment: "노란 햇살 같은 옷차림과 잔잔한 비트로 여유롭게 시동을 걸어요.",
    accent: "#ead8a2"
  },
  {
    clothes: "보라",
    food: "샌드위치",
    music: "재즈",
    title: "미드나잇 브런치 클럽",
    comment: "보랏빛 무드에 재즈 한 스푼, 아침부터 분위기가 근사해집니다.",
    accent: "#d8eaf1"
  },
  {
    clothes: "초록",
    food: "김밥",
    music: "클래식",
    title: "숲속 소풍 교향곡",
    comment: "초록 옷에 김밥 한 줄, 클래식이 흐르는 피크닉 같은 하루예요.",
    accent: "#e5f1f6"
  },
  {
    clothes: "베이지",
    food: "죽",
    music: "발라드",
    title: "포근한 담요 아침",
    comment: "따뜻한 죽과 부드러운 발라드가 마음까지 데워주는 아침입니다.",
    accent: "#f4edd8"
  },
  {
    clothes: "검정",
    food: "샌드위치",
    music: "로파이",
    title: "시크한 재택 모드",
    comment: "올블랙에 로파이 비트, 조용히 집중력이 차오르는 하루예요.",
    accent: "#3f6f8f"
  },
  {
    clothes: "흰색",
    food: "토스트",
    music: "클래식",
    title: "호텔 조식 판타지",
    comment: "새하얀 셔츠에 바삭한 토스트, 호텔 라운지 같은 아침이에요.",
    accent: "#f8fbfb"
  },
  {
    clothes: "파랑",
    food: "블랙커피",
    music: "록",
    title: "블루 볼트 충전",
    comment: "차가운 파랑과 진한 커피, 록 사운드로 에너지를 풀충전하세요.",
    accent: "#4f7f9b"
  },
  {
    clothes: "빨강",
    food: "김밥",
    music: "록",
    title: "정열의 김밥 로커",
    comment: "빨간 기운에 든든한 김밥, 오늘은 거칠 것 없이 달려봅시다.",
    accent: "#c59a3a"
  },
  {
    clothes: "노랑",
    food: "과일",
    music: "케이팝",
    title: "비타민 폭발 스테이지",
    comment: "상큼한 과일과 노란 에너지, 스텝이 절로 가벼워지는 아침!",
    accent: "#ead8a2"
  },
  {
    clothes: "초록",
    food: "요거트",
    music: "시티팝",
    title: "그린 시티 드라이브",
    comment: "산뜻한 초록과 요거트 한 컵, 도시를 달리는 기분으로 출발해요.",
    accent: "#b9d9e8"
  },
  {
    clothes: "베이지",
    food: "블랙커피",
    music: "재즈",
    title: "카페 사장님 무드",
    comment: "베이지 톤과 커피 향, 재즈까지 — 단골 카페의 아침 그 자체예요.",
    accent: "#f4edd8"
  },
  {
    clothes: "보라",
    food: "시리얼",
    music: "무음",
    title: "새벽 명상가",
    comment: "고요한 아침, 보랏빛 차림으로 나만의 정적을 즐겨보세요.",
    accent: "#d8eaf1"
  },
  {
    clothes: "검정",
    food: "죽",
    music: "발라드",
    title: "차분한 회복의 날",
    comment: "속 편한 죽과 잔잔한 발라드, 오늘은 몸과 마음을 아껴주세요.",
    accent: "#3f6f8f"
  },
  {
    clothes: "흰색",
    food: "과일",
    music: "무음",
    title: "미니멀 클렌즈 모닝",
    comment: "하얀 옷과 과일 한 접시, 소리 없는 아침이 머리를 맑게 해줘요.",
    accent: "#f8fbfb"
  },
  {
    clothes: "파랑",
    food: "시리얼",
    music: "발라드",
    title: "새벽 바다 감성",
    comment: "파란 새벽빛과 발라드 멜로디, 감성이 차오르는 출근길이에요.",
    accent: "#b9d9e8"
  },
  {
    clothes: "빨강",
    food: "블랙커피",
    music: "시티팝",
    title: "레트로 시티 히어로",
    comment: "빨간 재킷에 블랙커피, 시티팝 리듬으로 도시를 접수하세요.",
    accent: "#c59a3a"
  },
  {
    clothes: "노랑",
    food: "토스트",
    music: "재즈",
    title: "버터 토스트 스윙",
    comment: "노릇한 토스트와 스윙 재즈, 발끝이 들썩이는 아침입니다.",
    accent: "#ead8a2"
  },
  {
    clothes: "초록",
    food: "샌드위치",
    music: "로파이",
    title: "공원 벤치 브런치",
    comment: "초록 셔츠에 샌드위치 하나, 로파이가 흐르는 느긋한 하루예요.",
    accent: "#e5f1f6"
  },
  {
    clothes: "베이지",
    food: "토스트",
    music: "시티팝",
    title: "빈티지 드라이브",
    comment: "베이지 코트에 토스트 한 입, 창문 열고 시티팝 틀어봐요.",
    accent: "#f4edd8"
  },
  {
    clothes: "보라",
    food: "과일",
    music: "발라드",
    title: "감성 충전 모닝",
    comment: "보랏빛 아침과 달콤한 과일, 발라드가 감성을 채워줍니다.",
    accent: "#d8eaf1"
  },
  {
    clothes: "검정",
    food: "김밥",
    music: "케이팝",
    title: "연습생 정신 풀가동",
    comment: "김밥으로 든든하게, 케이팝으로 텐션 올리고 하루를 시작해요.",
    accent: "#3f6f8f"
  },
  {
    clothes: "흰색",
    food: "샌드위치",
    music: "시티팝",
    title: "화이트 시티 산책",
    comment: "하얀 옷에 샌드위치 들고, 시티팝 들으며 가볍게 걸어봐요.",
    accent: "#e5f1f6"
  },
  {
    clothes: "파랑",
    food: "죽",
    music: "클래식",
    title: "고요한 아침 협주곡",
    comment: "파란 셔츠와 따뜻한 죽, 클래식이 하루를 단정하게 열어줍니다.",
    accent: "#b9d9e8"
  },
  {
    clothes: "빨강",
    food: "요거트",
    music: "발라드",
    title: "딸기 요거트 세레나데",
    comment: "빨간 포인트와 부드러운 요거트, 감미로운 하루가 예감돼요.",
    accent: "#c59a3a"
  },
  {
    clothes: "노랑",
    food: "김밥",
    music: "록",
    title: "소풍 대신 콘서트",
    comment: "노란 티셔츠에 김밥, 록 사운드로 아침부터 축제 분위기!",
    accent: "#ead8a2"
  },
  {
    clothes: "초록",
    food: "블랙커피",
    music: "무음",
    title: "새벽 숲의 집중력",
    comment: "초록빛 차림과 진한 커피, 고요 속에서 몰입이 시작됩니다.",
    accent: "#b9d9e8"
  },
  {
    clothes: "베이지",
    food: "시리얼",
    music: "클래식",
    title: "모범생의 아침 루틴",
    comment: "단정한 베이지와 시리얼 한 그릇, 클래식으로 하루를 정돈해요.",
    accent: "#f4edd8"
  },
  {
    clothes: "보라",
    food: "블랙커피",
    music: "로파이",
    title: "야행성 인간의 기상",
    comment: "보라색 후드에 진한 커피, 로파이로 천천히 시동을 걸어요.",
    accent: "#d8eaf1"
  },
  {
    clothes: "흰색",
    food: "시리얼",
    music: "케이팝",
    title: "우유빛 댄스 타임",
    comment: "하얀 옷에 시리얼 우유, 케이팝 안무 연습하기 좋은 아침!",
    accent: "#f8fbfb"
  }
];

const emojiMap = {
  clothes: {
    빨강: "🔴",
    파랑: "🔵",
    초록: "🟢",
    베이지: "🟤",
    검정: "⚫",
    흰색: "⚪",
    노랑: "🟡",
    보라: "🟣"
  },
  food: {
    토스트: "🍞",
    시리얼: "🥣",
    김밥: "🍙",
    과일: "🍇",
    요거트: "🥛",
    죽: "🍲",
    샌드위치: "🥪",
    블랙커피: "☕"
  },
  music: {
    재즈: "🎷",
    시티팝: "🌆",
    클래식: "🎼",
    로파이: "🎚️",
    케이팝: "🎤",
    록: "🤘",
    발라드: "🎵",
    무음: "🤫"
  }
};

function loadCustomOptions(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return [...fallback];
    const parsed = saved.split(",").map((item) => item.trim()).filter(Boolean);
    return parsed.length ? parsed : [...fallback];
  } catch (error) {
    return [...fallback];
  }
}

function loadArchive() {
  try {
    const saved = JSON.parse(localStorage.getItem("morning-slot-archive") || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

const state = {
  streak: Number(localStorage.getItem("morning-slot-streak") || 0),
  lastVisited: Number(localStorage.getItem("morning-slot-last-visited") || 0),
  custom: {
    clothes: loadCustomOptions("morning-slot-clothes", defaultClothesOptions),
    food: loadCustomOptions("morning-slot-food", defaultFoodOptions),
    music: loadCustomOptions("morning-slot-music", defaultMusicOptions)
  },
  archive: loadArchive()
};

const homeView = document.querySelector("#homeView");
const resultView = document.querySelector("#resultView");
const pullButton = document.querySelector("#pullButton");
const reels = {
  clothes: document.querySelector("#reelClothes"),
  food: document.querySelector("#reelFood"),
  music: document.querySelector("#reelMusic")
};
const resultTitle = document.querySelector("#resultTitle");
const resultComment = document.querySelector("#resultComment");
const resultVisual = document.querySelector("#resultVisual");
const resultWeather = document.querySelector("#resultWeather");
const resultSummary = document.querySelector("#resultSummary");
const summaryComment = document.querySelector("#summaryComment");
const summaryVisual = document.querySelector("#summaryVisual");
const summaryWeather = document.querySelector("#summaryWeather");
const streakCount = document.querySelector("#streakCount");
const archiveList = document.querySelector("#archiveList");
const historyList = document.querySelector("#historyList");
const jackpotGuideButton = document.querySelector("#jackpotGuideButton");
const jackpotGuideModal = document.querySelector("#jackpotGuideModal");
const jackpotGuideCloseButton = document.querySelector("#jackpotGuideCloseButton");
const jackpotGuideList = document.querySelector("#jackpotGuideList");
const actionRow = document.querySelector(".action-row");

let audioContext = null;
function persistArchive() {
  localStorage.setItem("morning-slot-archive", JSON.stringify(state.archive));
}

function updateStats() {
  streakCount.textContent = `${state.streak}일`;
}

function setView(viewName) {
  homeView.classList.toggle("active", viewName === "home");
  resultView.classList.toggle("active", viewName === "result");
}

function getDisplayLabel(category, value) {
  const emoji = emojiMap[category]?.[value];
  return emoji ? `${emoji} ${value}` : value;
}

function getReelLabel(category, value) {
  return emojiMap[category]?.[value] || value;
}

function renderJackpotGuide() {
  if (!jackpotGuideList) return;
  jackpotGuideList.innerHTML = jackpotCombos.map((combo, index) => `
    <article class="jackpot-guide-card" style="--guide-accent: ${combo.accent}">
      <div class="jackpot-guide-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="jackpot-guide-content">
        <h3>${combo.title}</h3>
        <div class="jackpot-guide-combo">
          <span>${getDisplayLabel("clothes", combo.clothes)}</span>
          <span>${getDisplayLabel("food", combo.food)}</span>
          <span>${getDisplayLabel("music", combo.music)}</span>
        </div>
        <p>${combo.comment}</p>
      </div>
    </article>
  `).join("");
}

function openJackpotGuide() {
  renderJackpotGuide();
  jackpotGuideModal.hidden = false;
  document.body.classList.add("modal-open");
  jackpotGuideCloseButton.focus();
}

function closeJackpotGuide() {
  jackpotGuideModal.hidden = true;
  document.body.classList.remove("modal-open");
  jackpotGuideButton.focus();
}

function setupJackpotInfoRow() {
  const jackpotRate = document.querySelector("#jackpotRateBadge");
  const guideRow = document.querySelector(".jackpot-guide-row");
  if (!jackpotRate || !guideRow || !jackpotGuideButton) return;

  let infoRow = document.querySelector(".jackpot-info-row");
  if (!infoRow) {
    infoRow = document.createElement("div");
    infoRow.className = "jackpot-info-row";
    jackpotRate.parentNode.insertBefore(infoRow, jackpotRate);
  }

  jackpotGuideButton.textContent = "잭팟 콤보";
  infoRow.append(jackpotRate, jackpotGuideButton);
  guideRow.remove();
}

const weatherPool = [
  { icon: "☀️", text: "맑음" },
  { icon: "⛅", text: "구름 조금" },
  { icon: "☁️", text: "흐림" },
  { icon: "🌧", text: "비" },
  { icon: "🌫", text: "안개" },
  { icon: "💨", text: "바람" }
];

function getTodayWeather() {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const pick = (slot) => {
    const value = Math.abs(Math.sin(seed * (slot + 3) * 12.9898)) * 43758.5453;
    return weatherPool[Math.floor((value % 1) * weatherPool.length)];
  };
  return [
    { label: "아침", ...pick(0) },
    { label: "점심", ...pick(1) },
    { label: "저녁", ...pick(2) }
  ];
}

let currentLocation = null;

function renderWeather(container) {
  const locationBadge = currentLocation
    ? `<span class="weather-location">📍 ${currentLocation}</span>`
    : "";
  const slots = getTodayWeather()
    .map((slot) => `<span class="weather-slot"><em>${slot.label}</em>${slot.icon} ${slot.text}</span>`)
    .join("");
  container.innerHTML = locationBadge + slots;
}

function fetchCurrentLocation() {
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ko`
      );
      const data = await response.json();
      const parts = [...new Set([data.principalSubdivision, data.city || data.locality].filter(Boolean))];
      currentLocation = parts.join(" ") || null;
    } catch (error) {
      currentLocation = null;
    }
    renderWeather(resultWeather);
    renderWeather(summaryWeather);
  });
}

let currentWeather = null;

const FIXED_WEATHER_LOCATION = {
  name: "경기도 성남시",
  latitude: 37.4009,
  longitude: 127.1084
};

const weatherCodeMap = {
  0: { icon: "☀️", text: "맑음" },
  1: { icon: "🌤️", text: "대체로 맑음" },
  2: { icon: "⛅", text: "구름 조금" },
  3: { icon: "☁️", text: "흐림" },
  45: { icon: "🌫️", text: "안개" },
  48: { icon: "🌫️", text: "서리 안개" },
  51: { icon: "🌦️", text: "약한 이슬비" },
  53: { icon: "🌦️", text: "이슬비" },
  55: { icon: "🌧️", text: "강한 이슬비" },
  61: { icon: "🌦️", text: "약한 비" },
  63: { icon: "🌧️", text: "비" },
  65: { icon: "🌧️", text: "강한 비" },
  71: { icon: "🌨️", text: "약한 눈" },
  73: { icon: "🌨️", text: "눈" },
  75: { icon: "❄️", text: "강한 눈" },
  80: { icon: "🌦️", text: "약한 소나기" },
  81: { icon: "🌧️", text: "소나기" },
  82: { icon: "⛈️", text: "강한 소나기" },
  95: { icon: "⛈️", text: "뇌우" },
  96: { icon: "⛈️", text: "우박 동반 뇌우" },
  99: { icon: "⛈️", text: "강한 우박 뇌우" }
};

function getWeatherCodeInfo(code) {
  return weatherCodeMap[code] || { icon: "🌤️", text: "날씨 정보" };
}

function getWeatherSlots() {
  if (!currentWeather) {
    return [
      { label: "현재", icon: "🌤️", text: "날씨 확인 중" },
      { label: "기온", icon: "—", text: "대기" },
      { label: "바람", icon: "—", text: "대기" }
    ];
  }

  const info = getWeatherCodeInfo(currentWeather.weatherCode);
  return [
    { label: "현재", icon: info.icon, text: info.text },
    { label: "기온", icon: "🌡️", text: `${Math.round(currentWeather.temperature)}°C · 체감 ${Math.round(currentWeather.apparentTemperature)}°C` },
    { label: "바람", icon: "💨", text: `${Math.round(currentWeather.windSpeed)}km/h · 습도 ${Math.round(currentWeather.humidity)}%` }
  ];
}

function renderWeather(container) {
  const locationBadge = currentLocation
    ? `<span class="weather-location">📍 ${currentLocation}</span>`
    : `<span class="weather-location">📍 위치 확인 중</span>`;
  const slots = getWeatherSlots()
    .map((slot) => `<span class="weather-slot"><em>${slot.label}</em>${slot.icon} ${slot.text}</span>`)
    .join("");
  container.innerHTML = locationBadge + slots;
}

async function fetchOpenMeteoWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
    timezone: "auto"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!response.ok) throw new Error("Weather API request failed");
  const data = await response.json();
  currentWeather = {
    temperature: data.current?.temperature_2m,
    apparentTemperature: data.current?.apparent_temperature,
    humidity: data.current?.relative_humidity_2m,
    weatherCode: data.current?.weather_code,
    windSpeed: data.current?.wind_speed_10m
  };
}

function fetchCurrentLocation() {
  if (!navigator.geolocation) {
    currentLocation = "위치 권한 없음";
    renderWeather(resultWeather);
    renderWeather(summaryWeather);
    return;
  }

  navigator.geolocation.getCurrentPosition(async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const [locationResponse] = await Promise.all([
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ko`),
        fetchOpenMeteoWeather(latitude, longitude)
      ]);
      const data = await locationResponse.json();
      const parts = [...new Set([data.principalSubdivision, data.city || data.locality].filter(Boolean))];
      currentLocation = parts.join(" ") || "현재 위치";
    } catch (error) {
      currentLocation = "현재 위치";
    }
    renderWeather(resultWeather);
    renderWeather(summaryWeather);
  }, () => {
    currentLocation = "위치 권한 필요";
    renderWeather(resultWeather);
    renderWeather(summaryWeather);
  });
}

function fetchCurrentLocation() {
  currentLocation = FIXED_WEATHER_LOCATION.name;
  fetchOpenMeteoWeather(FIXED_WEATHER_LOCATION.latitude, FIXED_WEATHER_LOCATION.longitude)
    .catch(() => {
      currentWeather = null;
    })
    .finally(() => {
      renderWeather(resultWeather);
      renderWeather(summaryWeather);
    });
}

const REEL_ITEM_HEIGHT = 56;
const REEL_MIN_SEGMENTS = 12;

function createReelItems(container, options, selectedIndex, category) {
  const repeats = Math.max(1, Math.ceil(REEL_MIN_SEGMENTS / options.length));
  const segments = [];
  for (let i = 0; i < repeats; i += 1) {
    segments.push(...options);
  }
  const step = 360 / segments.length;
  const radius = (REEL_ITEM_HEIGHT / 2) / Math.tan(Math.PI / segments.length);

  container.innerHTML = "";
  const scene = document.createElement("div");
  scene.className = "reel-scene";
  const drum = document.createElement("div");
  drum.className = "reel-drum";

  segments.forEach((item, index) => {
    const tile = document.createElement("div");
    tile.className = "reel-item";
    const symbol = document.createElement("span");
    symbol.className = "reel-symbol";
    symbol.textContent = getReelLabel(category, item);
    tile.appendChild(symbol);
    tile.style.transform = `rotateX(${index * step}deg) translateZ(${radius.toFixed(2)}px)`;
    drum.appendChild(tile);
  });

  scene.appendChild(drum);
  container.appendChild(scene);

  container.__drum = drum;
  container.__step = step;
  container.__segmentCount = segments.length;
  container.__rotation = -selectedIndex * step;
  drum.style.transform = `rotateX(${container.__rotation}deg)`;
  drum.children[selectedIndex]?.classList.add("is-front");
}

function initReels() {
  createReelItems(reels.clothes, state.custom.clothes, 0, "clothes");
  createReelItems(reels.food, state.custom.food, 0, "food");
  createReelItems(reels.music, state.custom.music, 0, "music");
}

function getWeekStart(date = new Date()) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  return start;
}

function getArchiveJackpotName(entry) {
  if (entry.isJackpot) return entry.jackpotName || entry.title;
  return jackpotCombos.find((combo) => combo.title === entry.title)?.title || "";
}

function formatArchiveDateTime(value) {
  return new Date(value).toLocaleString("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function renderArchive() {
  const weekStart = getWeekStart();
  const items = state.archive.filter((entry) => new Date(entry.createdAt) >= weekStart).slice(-7).reverse();
  archiveList.innerHTML = "";

  if (!items.length) {
    archiveList.innerHTML = '<div class="archive-empty">오늘의 첫 조합을 저장해보세요.</div>';
  } else {
    archiveList.innerHTML = items.map((entry) => {
      const date = formatArchiveDateTime(entry.createdAt);
      const jackpotName = getArchiveJackpotName(entry);
      const jackpotBadge = jackpotName ? `<span class="archive-jackpot-badge">JACKPOT</span>` : "";
      return `
        <div class="archive-item${jackpotName ? " is-jackpot-entry" : ""}">
          <div>
            ${jackpotBadge}
            <strong>${entry.title}</strong>
            <div>${getDisplayLabel("clothes", entry.clothes)} · ${getDisplayLabel("food", entry.food)} · ${getDisplayLabel("music", entry.music)}</div>
          </div>
          <span class="archive-date">${date}</span>
        </div>
      `;
    }).join("");
  }

  const historyItems = [...state.archive].reverse().slice(0, 10);
  historyList.innerHTML = "";

  if (!historyItems.length) {
    historyList.innerHTML = '<div class="archive-empty">아직 뽑은 내역이 없어요.</div>';
    return;
  }

  historyList.innerHTML = historyItems.map((entry) => {
    const date = formatArchiveDateTime(entry.createdAt);
    const jackpotName = getArchiveJackpotName(entry);
    const jackpotBadge = jackpotName ? `<span class="archive-jackpot-badge">JACKPOT</span>` : "";
    return `
      <div class="archive-item${jackpotName ? " is-jackpot-entry" : ""}">
        <div>
          ${jackpotBadge}
          <strong>${entry.title}</strong>
          <div>${getDisplayLabel("clothes", entry.clothes)} · ${getDisplayLabel("food", entry.food)} · ${getDisplayLabel("music", entry.music)}</div>
        </div>
        <span class="archive-date">${date}</span>
      </div>
    `;
  }).join("");
}

function saveResultToArchive(result, jackpot) {
  const title = jackpot ? jackpot.title : `${result.clothes} 셔츠에 ${result.food}, ${result.music}`;
  const comment = jackpot ? jackpot.comment : `오늘은 ${result.clothes} 톤의 옷을 입고 ${result.food}를 먹고 ${result.music} 음악과 함께 하루를 시작해보세요.`;
  state.archive.push({
    createdAt: new Date().toISOString(),
    clothes: result.clothes,
    food: result.food,
    music: result.music,
    title,
    comment,
    isJackpot: Boolean(jackpot),
    jackpotName: jackpot ? jackpot.title : ""
  });
  state.archive = state.archive.slice(-14);
  persistArchive();
  renderArchive();
}

function renderResult(result, jackpot) {
  const color = result.clothes;
  const menu = result.food;
  const genre = result.music;
  const title = jackpot ? jackpot.title : `${color} 셔츠에 ${menu}, ${genre}`;
  const comment = jackpot ? jackpot.comment : `오늘은 ${color} 톤의 옷을 입고 ${menu}를 먹고 ${genre} 음악과 함께 하루를 시작해보세요.`;
  const cardMarkup = `
    <div class="visual-card">
      <span class="visual-badge">${jackpot ? "✨✨잭팟✨✨ 특별한 하루가 될거에요!" : "소소하게 행복한 하루☀️"}</span>
      <strong>${getDisplayLabel("clothes", color)} · ${getDisplayLabel("food", menu)} · ${getDisplayLabel("music", genre)}</strong>
      <span>${jackpot ? jackpot.title : "오늘의 조합"}</span>
    </div>
  `;
  const accent = jackpot ? jackpot.accent : getColorByName(color);

  resultTitle.textContent = title;
  resultComment.textContent = comment;
  summaryComment.textContent = comment;
  renderWeather(resultWeather);
  renderWeather(summaryWeather);

  resultVisual.classList.toggle("is-jackpot", Boolean(jackpot));
  summaryVisual.classList.toggle("is-jackpot", Boolean(jackpot));
  resultVisual.innerHTML = cardMarkup;
  summaryVisual.innerHTML = cardMarkup;
  resultVisual.style.background = `radial-gradient(circle at 18% 18%, rgba(234, 216, 162, 0.38), transparent 30%), linear-gradient(135deg, ${accent}, #e5f1f6 54%, #f4edd8)`;
  summaryVisual.style.background = `radial-gradient(circle at 18% 18%, rgba(234, 216, 162, 0.38), transparent 30%), linear-gradient(135deg, ${accent}, #e5f1f6 54%, #f4edd8)`;

  resultSummary.hidden = false;
  saveResultToArchive(result, jackpot);
  setView("home");
  window.setTimeout(() => {
    resultSummary.scrollIntoView({ behavior: "smooth", block: "end" });
  }, 80);
}

function getColorByName(name) {
  const map = {
    빨강: "#c59a3a",
    파랑: "#b9d9e8",
    초록: "#e5f1f6",
    베이지: "#f4edd8",
    검정: "#3f6f8f",
    흰색: "#f8fbfb",
    노랑: "#ead8a2",
    보라: "#d8eaf1"
  };
  return map[name] || "#e5f1f6";
}

function getRandomPick(options) {
  return options[Math.floor(Math.random() * options.length)];
}

function ensureAudio() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

function playTone(freq, duration, type = "sine", volume = 0.03) {
  const ctx = ensureAudio();
  if (!ctx) return;
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  oscillator.type = type;
  oscillator.frequency.value = freq;
  gainNode.gain.value = volume;
  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
}

function playSpinSound() {
  [220, 330, 440, 560].forEach((freq, index) => {
    setTimeout(() => playTone(freq, 0.14, "triangle", 0.018 + index * 0.003), index * 110);
  });
}

function playResultSound() {
  [440, 660, 880].forEach((freq, index) => {
    setTimeout(() => playTone(freq, 0.2, "sine", 0.024), index * 90);
  });
}

function playJackpotSound() {
  [523, 659, 784, 1046, 784, 1046, 1318].forEach((freq, index) => {
    setTimeout(() => playTone(freq, 0.24, "triangle", 0.032), index * 110);
  });
}

function launchConfetti() {
  const canvas = document.createElement("canvas");
  canvas.className = "confetti-canvas";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const colors = ["#ead8a2", "#c59a3a", "#b9d9e8", "#4f7f9b", "#f4edd8", "#ffffff"];
  const particles = Array.from({ length: 150 }, () => ({
    x: canvas.width / 2 + (Math.random() - 0.5) * canvas.width * 0.5,
    y: canvas.height * 0.4,
    vx: (Math.random() - 0.5) * 13,
    vy: -(Math.random() * 13 + 7),
    size: Math.random() * 9 + 5,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.3,
    isRect: Math.random() < 0.6
  }));
  const duration = 2600;
  const started = performance.now();

  const tick = (now) => {
    const elapsed = now - started;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.vx *= 0.99;
      p.rotation += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      if (p.isRect) {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    if (elapsed < duration) {
      window.requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  };
  window.requestAnimationFrame(tick);
}

function celebrateJackpot() {
  launchConfetti();
  playJackpotSound();

  const banner = document.createElement("div");
  banner.className = "jackpot-banner";
  banner.textContent = "🎰 JACKPOT! 🎰";
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 2200);

  const machine = document.querySelector(".slot-machine");
  machine.classList.add("jackpot-flash");
  setTimeout(() => machine.classList.remove("jackpot-flash"), 1600);
}

function playSpin(reel, options, targetIndex, isJackpot = false, order = 0) {
  const drum = reel.__drum;
  if (!drum) return;
  const step = reel.__step;
  const segmentCount = reel.__segmentCount;

  if (reel.__spinFrame) {
    window.cancelAnimationFrame(reel.__spinFrame);
    reel.__spinFrame = null;
  }

  reel.classList.add("is-spinning");
  if (isJackpot) {
    reel.classList.add("is-jackpot");
  }
  drum.querySelector(".is-front")?.classList.remove("is-front");

  const startRotation = reel.__rotation || 0;
  const currentIndex = ((Math.round(-startRotation / step) % segmentCount) + segmentCount) % segmentCount;
  const forwardSteps = (((targetIndex - currentIndex) % options.length) + options.length) % options.length;
  const landingIndex = (currentIndex + forwardSteps) % segmentCount;
  const totalDegrees = (3 + order) * 360 + forwardSteps * step;
  const duration = (isJackpot ? 2100 : 2300) + order * 350;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min(1, (now - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 4);
    reel.__rotation = startRotation - totalDegrees * eased;
    drum.style.transform = `rotateX(${reel.__rotation}deg)`;

    if (progress < 1) {
      reel.__spinFrame = window.requestAnimationFrame(tick);
      return;
    }

    reel.__spinFrame = null;
    drum.children[landingIndex]?.classList.add("is-front");
    reel.classList.remove("is-spinning");
    if (isJackpot) {
      reel.classList.remove("is-jackpot");
    }
  };
  reel.__spinFrame = window.requestAnimationFrame(tick);
}

function runSlotMachine() {
  if (pullButton.disabled) return;
  pullButton.disabled = true;
  actionRow.classList.add("is-spinning-control");
  pullButton.textContent = "잭팟이 나올때까지...";
  resultSummary.hidden = true;
  playSpinSound();

  let jackpot = null;
  if (Math.random() < JACKPOT_RATE) {
    jackpot = jackpotCombos[Math.floor(Math.random() * jackpotCombos.length)];
  }
  const clothes = jackpot ? jackpot.clothes : getRandomPick(state.custom.clothes);
  const food = jackpot ? jackpot.food : getRandomPick(state.custom.food);
  const music = jackpot ? jackpot.music : getRandomPick(state.custom.music);

  const clothesIndex = state.custom.clothes.indexOf(clothes);
  const foodIndex = state.custom.food.indexOf(food);
  const musicIndex = state.custom.music.indexOf(music);

  setTimeout(() => {
    playSpin(reels.clothes, state.custom.clothes, clothesIndex, Boolean(jackpot), 0);
    playSpin(reels.food, state.custom.food, foodIndex, Boolean(jackpot), 1);
    playSpin(reels.music, state.custom.music, musicIndex, Boolean(jackpot), 2);
  }, 60);

  const finishDelay = jackpot ? 3400 : 3600;
  setTimeout(() => {
    document.querySelectorAll(".reel").forEach((reel) => {
      reel.classList.remove("is-spinning", "is-jackpot");
    });
    renderResult({ clothes, food, music }, jackpot);
    if (jackpot) {
      celebrateJackpot();
    } else {
      playResultSound();
    }
    pullButton.disabled = false;
    actionRow.classList.remove("is-spinning-control");
    pullButton.textContent = "레버 당기기";
  }, finishDelay);
}

pullButton.addEventListener("click", () => {
  runSlotMachine();
});

jackpotGuideButton.addEventListener("click", openJackpotGuide);
jackpotGuideCloseButton.addEventListener("click", closeJackpotGuide);
jackpotGuideModal.addEventListener("click", (event) => {
  if (event.target.matches("[data-close-jackpot-guide]")) {
    closeJackpotGuide();
  }
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !jackpotGuideModal.hidden) {
    closeJackpotGuide();
  }
});

window.addEventListener("touchstart", (event) => {
  if (event.touches.length === 1) {
    window.__touchStartY = event.touches[0].clientY;
  }
}, { passive: true });

window.addEventListener("touchend", (event) => {
  if (typeof window.__touchStartY === "undefined") return;
  const deltaY = event.changedTouches[0].clientY - window.__touchStartY;
  if (deltaY > 70) {
    runSlotMachine();
  }
}, { passive: true });

function updateStreak() {
  const today = new Date().toISOString().slice(0, 10);
  const last = state.lastVisited;
  const lastDate = last ? new Date(last).toISOString().slice(0, 10) : null;
  if (lastDate !== today) {
    state.streak += 1;
    state.lastVisited = Date.now();
    localStorage.setItem("morning-slot-streak", String(state.streak));
    localStorage.setItem("morning-slot-last-visited", String(state.lastVisited));
  }
}

updateStats();
updateStreak();
initReels();
renderArchive();
renderWeather(resultWeather);
renderWeather(summaryWeather);
fetchCurrentLocation();
const jackpotRateBadge = document.querySelector("#jackpotRateBadge");
jackpotRateBadge.innerHTML = `🎰 오늘의 잭팟 확률 <strong>${Math.round(JACKPOT_RATE * 100)}%</strong>`;
setupJackpotInfoRow();
setView("home");
