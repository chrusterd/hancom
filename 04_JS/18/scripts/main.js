const GRID_WIDTH = 140;
const GRID_HEIGHT = 100;
const CELL_SIZE = 8;
const DEFAULT_COOLDOWN_MS = 0;
const FORMAL_COOLDOWN_MS = 24 * 60 * 60 * 1000;
const STORAGE_KEY = "dot-garden-demo-state";
const GARDENER_ID_KEY = "dot-garden-demo-gardener";
const LAST_PLANTED_KEY = "dot-garden-demo-last-planted";
const CHANNEL_NAME = "dot-garden-demo-channel";
const TIMELAPSE_STEP_MS = 35;

const palette = [
  { name: "새벽 잔디", color: "#4b7a3a" },
  { name: "이슬 초록", color: "#5e944b" },
  { name: "윤슬 연두", color: "#7eb35a" },
  { name: "햇빛 풀", color: "#9ac96d" },
  { name: "장미 분홍", color: "#ce6f8d" },
  { name: "튤립 빨강", color: "#bc4a4a" },
  { name: "코스모스 오렌지", color: "#c97b34" },
  { name: "해바라기 노랑", color: "#d8b13d" },
  { name: "하늘 파랑", color: "#5d8fd6" },
  { name: "바다 청록", color: "#4b8a89" },
  { name: "연한 보라", color: "#8570c8" },
  { name: "라벤더", color: "#b68cde" },
  { name: "토양 갈색", color: "#8b6347" },
  { name: "소나무 녹색", color: "#4f6840" },
  { name: "석회 흰색", color: "#f3eadb" },
  { name: "달빛 회색", color: "#7b7c85" }
];

const state = {
  pixels: {},
  history: [],
  config: {
    width: GRID_WIDTH,
    height: GRID_HEIGHT,
    cooldownMs: DEFAULT_COOLDOWN_MS
  }
};

let currentColorIndex = 0;
let currentGardenerId = localStorage.getItem(GARDENER_ID_KEY) || createGardenerId();
let lastPlantedAt = Number(localStorage.getItem(LAST_PLANTED_KEY) || 0);
let activeAnimations = new Map();
let animationFrameRequested = false;
let showGuide = true;
let timelapseTimer = null;
let timelapsePlaying = false;
let timelapseIndex = 0;
let playbackPixels = {};

const modeSelect = document.querySelector("#modeSelect");
const resetButton = document.querySelector("#resetButton");
const timelapseButton = document.querySelector("#timelapseButton");
const toggleGuideButton = document.querySelector("#toggleGuideButton");
const paletteEl = document.querySelector("#palette");
const canvas = document.querySelector("#gardenCanvas");
const ctx = canvas.getContext("2d");
const minimapCanvas = document.querySelector("#minimapCanvas");
const minimapCtx = minimapCanvas.getContext("2d");
const tooltip = document.querySelector("#tooltip");
const feedback = document.querySelector("#feedback");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");
const gardenerCount = document.querySelector("#gardenerCount");
const statusText = document.querySelector("#statusText");

const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel(CHANNEL_NAME) : null;

function createGardenerId() {
  const id = `anon_${Math.random().toString(36).slice(2, 8)}`;
  localStorage.setItem(GARDENER_ID_KEY, id);
  return id;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (saved && saved.pixels) {
      state.pixels = saved.pixels;
      state.history = Array.isArray(saved.history) && saved.history.length > 0
        ? saved.history
        : Object.entries(saved.pixels).map(([key, pixel]) => {
            const [x, y] = key.split(",").map(Number);
            return { ...pixel, x, y };
          }).filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y));
      state.config = {
        ...state.config,
        ...(saved.config || {})
      };
    }
  } catch (error) {
    console.warn("저장된 정원 데이터를 불러오지 못했습니다.", error);
  }
}

function saveState() {
  const payload = {
    pixels: state.pixels,
    history: state.history,
    config: state.config
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  if (channel) {
    channel.postMessage({ type: "state-update", payload });
  }
}

function renderPalette() {
  paletteEl.innerHTML = "";
  palette.forEach((entry, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = index === currentColorIndex ? "active" : "";
    button.innerHTML = `<span class="swatch" style="background:${entry.color}"></span><span>${entry.name}</span>`;
    button.addEventListener("click", () => {
      currentColorIndex = index;
      renderPalette();
      feedback.textContent = `${entry.name} 색으로 심을 수 있어요.`;
    });
    paletteEl.appendChild(button);
  });
}

function shortenNumber(value) {
  return Intl.NumberFormat("ko-KR").format(value);
}

function updateStats() {
  const totalCells = GRID_WIDTH * GRID_HEIGHT;
  const plantedCount = Object.keys(state.pixels).length;
  const progressRatio = totalCells ? plantedCount / totalCells : 0;
  progressText.textContent = `${shortenNumber(plantedCount)} / ${shortenNumber(totalCells)}`;
  progressFill.style.width = `${(progressRatio * 100).toFixed(1)}%`;
  gardenerCount.textContent = shortenNumber(new Set(Object.values(state.pixels).map((pixel) => pixel.gardener)).size);
  const cooldownMs = state.config.cooldownMs;
  if (cooldownMs > 0) {
    const remaining = Math.max(0, cooldownMs - (Date.now() - lastPlantedAt));
    if (remaining > 0) {
      statusText.textContent = `내일 다시 심을 수 있어요 · ${formatDuration(remaining)}`;
    } else {
      statusText.textContent = "오늘의 씨앗이 준비됐어요";
    }
  } else {
    statusText.textContent = "테스트 모드 · 무제한 심기";
  }
}

function formatDuration(ms) {
  const totalMinutes = Math.ceil(ms / 60000);
  if (totalMinutes < 60) {
    return `${totalMinutes}분 후`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}시간 ${minutes}분 후`;
}

function formatAge(plantedAt) {
  const diffMs = Date.now() - plantedAt;
  const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  if (diffDays <= 0) {
    return "오늘 심어진 픽셀";
  }
  return `${diffDays}일 전에 심어진 픽셀`;
}

function coordKey(x, y) {
  return `${x},${y}`;
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  const value = normalized.length === 3 ? normalized.split("").map((char) => `${char}${char}`).join("") : normalized;
  const intValue = Number.parseInt(value, 16);
  return [
    (intValue >> 16) & 255,
    (intValue >> 8) & 255,
    intValue & 255
  ];
}

function getDisplayColor(index, plantedAt) {
  const baseHex = palette[index]?.color || palette[0].color;
  const [r, g, b] = hexToRgb(baseHex);
  const ageDays = (Date.now() - plantedAt) / (24 * 60 * 60 * 1000);
  const depth = Math.min(0.18, ageDays / 60);
  const red = Math.round(r * (1 - depth));
  const green = Math.round(g * (1 - depth));
  const blue = Math.round(b * (1 - depth));
  return `rgb(${red}, ${green}, ${blue})`;
}

function drawGuideLines() {
  if (!showGuide) {
    return;
  }

  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.strokeStyle = "rgba(70, 120, 53, 0.95)";
  ctx.lineWidth = 2.4;

  ctx.beginPath();
  ctx.moveTo(0, 220);
  ctx.quadraticCurveTo(220, 140, 420, 220);
  ctx.quadraticCurveTo(660, 320, 900, 160);
  ctx.quadraticCurveTo(980, 120, 1120, 180);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 540);
  ctx.quadraticCurveTo(220, 600, 420, 560);
  ctx.quadraticCurveTo(680, 500, 980, 560);
  ctx.quadraticCurveTo(1050, 580, 1120, 620);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(120, 0);
  ctx.quadraticCurveTo(240, 200, 320, 360);
  ctx.quadraticCurveTo(420, 520, 560, 700);
  ctx.stroke();

  ctx.restore();
}

function renderLoop() {
  if (!animationFrameRequested) {
    animationFrameRequested = true;
    requestAnimationFrame(() => {
      animationFrameRequested = false;
      render();
    });
  }
}

function render() {
  const sourcePixels = timelapsePlaying ? playbackPixels : state.pixels;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fdf7ea";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < GRID_HEIGHT; y += 1) {
    for (let x = 0; x < GRID_WIDTH; x += 1) {
      const key = coordKey(x, y);
      const pixel = sourcePixels[key];
      const px = x * CELL_SIZE;
      const py = y * CELL_SIZE;
      const animation = activeAnimations.get(key);

      if (!pixel && !animation) {
        ctx.fillStyle = "#f7f2e7";
        ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        continue;
      }

      if (animation) {
        const elapsed = Date.now() - animation.startedAt;
        const progress = Math.min(1, elapsed / 420);
        const eased = 1 - Math.pow(1 - progress, 3);
        if (progress >= 1) {
          activeAnimations.delete(key);
          renderLoop();
        } else {
          const radius = (CELL_SIZE * 0.25) + (CELL_SIZE * 0.22) * eased;
          const dotColor = palette[animation.colorIndex]?.color || palette[0].color;
          ctx.save();
          ctx.translate(px + CELL_SIZE / 2, py + CELL_SIZE / 2);
          ctx.globalAlpha = 0.85;
          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          continue;
        }
      }

      if (pixel) {
        ctx.save();
        const color = getDisplayColor(pixel.color, pixel.plantedAt);
        ctx.fillStyle = color;
        ctx.fillRect(px + 1, py + 1, CELL_SIZE - 2, CELL_SIZE - 2);
        if (pixel.gardener === currentGardenerId) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = "rgba(255, 224, 84, 0.7)";
          ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
          ctx.strokeRect(px + 2, py + 2, CELL_SIZE - 4, CELL_SIZE - 4);
        }
        ctx.restore();
      }
    }
  }

  drawGuideLines();
  renderMinimap();
}

function renderMinimap() {
  const width = minimapCanvas.width;
  const height = minimapCanvas.height;
  const cellWidth = width / GRID_WIDTH;
  const cellHeight = height / GRID_HEIGHT;
  const sourcePixels = timelapsePlaying ? playbackPixels : state.pixels;

  minimapCtx.clearRect(0, 0, width, height);
  minimapCtx.fillStyle = "#fdf7ea";
  minimapCtx.fillRect(0, 0, width, height);

  Object.entries(sourcePixels).forEach(([key, pixel]) => {
    const [x, y] = key.split(",").map(Number);
    minimapCtx.fillStyle = getDisplayColor(pixel.color, pixel.plantedAt);
    minimapCtx.fillRect(x * cellWidth, y * cellHeight, Math.max(1, cellWidth), Math.max(1, cellHeight));
  });
}

function buildTimelineFromPixels() {
  return Object.entries(state.pixels)
    .map(([key, pixel]) => {
      const [x, y] = key.split(",").map(Number);
      return { ...pixel, x, y };
    })
    .filter((item) => Number.isFinite(item.x) && Number.isFinite(item.y))
    .sort((a, b) => a.plantedAt - b.plantedAt);
}

function getCellFromEvent(event) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor(((event.clientX - rect.left) / rect.width) * GRID_WIDTH);
  const y = Math.floor(((event.clientY - rect.top) / rect.height) * GRID_HEIGHT);
  return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
}

function showTooltip(event, pixel) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  tooltip.innerHTML = pixel ? `<strong>${formatAge(pixel.plantedAt)}</strong><br />${pixel.gardener === currentGardenerId ? "당신이 심은 픽셀입니다." : "다른 정원사가 심은 픽셀입니다."}` : "빈 칸입니다. 클릭하면 씨앗을 심을 수 있어요.";
  tooltip.classList.add("visible");
  tooltip.style.left = `${x}px`;
  tooltip.style.top = `${y}px`;
}

function hideTooltip() {
  tooltip.classList.remove("visible");
}

function plantPixel(x, y) {
  if (timelapsePlaying) {
    feedback.textContent = "타임랩스 재생 중에는 새로 심을 수 없어요.";
    return;
  }

  const key = coordKey(x, y);
  if (state.pixels[key]) {
    feedback.textContent = "이미 심어진 칸이에요. 다른 빈 칸을 골라보세요.";
    return;
  }

  const now = Date.now();
  const cooldownMs = state.config.cooldownMs;
  if (cooldownMs > 0 && lastPlantedAt && now - lastPlantedAt < cooldownMs) {
    const remaining = cooldownMs - (now - lastPlantedAt);
    feedback.textContent = `쿨다운 중입니다. ${formatDuration(remaining)} 뒤 다시 심을 수 있어요.`;
    return;
  }

  const pixel = {
    color: currentColorIndex,
    plantedAt: now,
    gardener: currentGardenerId
  };
  state.pixels[key] = pixel;
  state.history.push({ ...pixel, x, y });
  lastPlantedAt = now;
  localStorage.setItem(LAST_PLANTED_KEY, String(now));
  activeAnimations.set(key, { startedAt: now, colorIndex: currentColorIndex });
  saveState();
  updateStats();
  renderLoop();
  feedback.textContent = `${palette[currentColorIndex].name} 씨앗이 피어났어요.`;
}

function applyMode(mode) {
  const nextCooldown = mode === "formal" ? FORMAL_COOLDOWN_MS : DEFAULT_COOLDOWN_MS;
  state.config.cooldownMs = nextCooldown;
  saveState();
  updateStats();
  feedback.textContent = mode === "formal" ? "정식 모드로 전환됐어요. 하루 1픽셀 제한이 적용됩니다." : "테스트 모드로 전환됐어요. 자유롭게 심을 수 있습니다.";
}

function stopTimelapse() {
  if (timelapseTimer) {
    clearTimeout(timelapseTimer);
    timelapseTimer = null;
  }
  timelapsePlaying = false;
  timelapseButton.textContent = "타임랩스 재생";
  feedback.textContent = "타임랩스 재생을 마쳤어요. 현재 정원 상태를 다시 확인해보세요.";
  render();
}

function startTimelapse() {
  const timeline = state.history.length > 0 ? [...state.history] : buildTimelineFromPixels();
  if (timeline.length === 0) {
    feedback.textContent = "아직 심어진 픽셀이 없어서 재생할 수 없어요.";
    return;
  }

  if (timelapseTimer) {
    clearTimeout(timelapseTimer);
    timelapseTimer = null;
  }

  timelapsePlaying = true;
  timelapseIndex = 0;
  playbackPixels = {};
  timelapseButton.textContent = "타임랩스 정지";
  feedback.textContent = "정원의 성장 과정을 재생 중입니다.";
  render();

  const sortedTimeline = [...timeline].sort((a, b) => a.plantedAt - b.plantedAt);
  const step = () => {
    if (!timelapsePlaying) {
      return;
    }
    if (timelapseIndex >= sortedTimeline.length) {
      stopTimelapse();
      return;
    }
    const event = sortedTimeline[timelapseIndex];
    playbackPixels[coordKey(event.x, event.y)] = {
      color: event.color,
      plantedAt: event.plantedAt,
      gardener: event.gardener
    };
    timelapseIndex += 1;
    render();
    timelapseTimer = setTimeout(step, TIMELAPSE_STEP_MS);
  };

  step();
}

canvas.addEventListener("click", (event) => {
  const cell = getCellFromEvent(event);
  if (!cell) return;
  plantPixel(cell.x, cell.y);
});

canvas.addEventListener("mousemove", (event) => {
  const cell = getCellFromEvent(event);
  if (!cell) {
    hideTooltip();
    return;
  }
  const key = coordKey(cell.x, cell.y);
  const pixel = (timelapsePlaying ? playbackPixels : state.pixels)[key];
  if (pixel) {
    showTooltip(event, pixel);
  } else {
    hideTooltip();
  }
});

canvas.addEventListener("mouseleave", hideTooltip);

modeSelect.addEventListener("change", (event) => {
  applyMode(event.target.value);
});

resetButton.addEventListener("click", () => {
  if (window.confirm("정원을 비우고 처음부터 다시 시작할까요?")) {
    state.pixels = {};
    state.history = [];
    playbackPixels = {};
    lastPlantedAt = 0;
    if (timelapseTimer) {
      clearTimeout(timelapseTimer);
      timelapseTimer = null;
    }
    timelapsePlaying = false;
    timelapseButton.textContent = "타임랩스 재생";
    localStorage.removeItem(LAST_PLANTED_KEY);
    saveState();
    updateStats();
    render();
    feedback.textContent = "정원이 초기화됐어요. 다시 씨앗을 심어보세요.";
  }
});

timelapseButton.addEventListener("click", () => {
  if (timelapsePlaying) {
    timelapsePlaying = false;
    if (timelapseTimer) {
      clearTimeout(timelapseTimer);
      timelapseTimer = null;
    }
    timelapseButton.textContent = "타임랩스 재생";
    feedback.textContent = "타임랩스 재생을 중단했어요.";
    render();
    return;
  }
  startTimelapse();
});

toggleGuideButton.addEventListener("click", () => {
  showGuide = !showGuide;
  toggleGuideButton.textContent = showGuide ? "밑그림 가이드 끄기" : "밑그림 가이드 켜기";
  render();
});

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY) {
    loadState();
    updateStats();
    render();
  }
});

if (channel) {
  channel.addEventListener("message", (event) => {
    if (event.data?.type === "state-update") {
      state.pixels = event.data.payload.pixels;
      state.history = Array.isArray(event.data.payload.history) ? event.data.payload.history : [];
      state.config = event.data.payload.config;
      updateStats();
      render();
    }
  });
}

loadState();
renderPalette();
modeSelect.value = state.config.cooldownMs === FORMAL_COOLDOWN_MS ? "formal" : "test";
updateStats();
render();
