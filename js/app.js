// ===== CUSTOM CURSOR =====
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;

document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  dot.style.left = mx + "px";
  dot.style.top = my + "px";
});
(function animRing() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(animRing);
})();
document.addEventListener("mousedown", () =>
  document.body.classList.add("clicking"),
);
document.addEventListener("mouseup", () =>
  document.body.classList.remove("clicking"),
);
const traceCanvas = document.getElementById("trace-canvas");
traceCanvas.addEventListener("mouseenter", () =>
  document.body.classList.add("on-canvas"),
);
traceCanvas.addEventListener("mouseleave", () =>
  document.body.classList.remove("on-canvas"),
);

// ===== NAVIGATION =====
let currentPage = "page-home";
const topControls = document.getElementById("top-controls");
function navigate(pageId) {
  if (pageId === currentPage) return;
  playSound("sfx-click");
  const out = document.getElementById(currentPage);
  const inn = document.getElementById(pageId);
  out.classList.remove("active");
  out.classList.add("exit-left");
  inn.classList.add("active");
  out.addEventListener(
    "transitionend",
    () => out.classList.remove("exit-left"),
    { once: true },
  );
  currentPage = pageId;
  topControls.style.display = pageId === "page-home" ? "flex" : "none";
  if (pageId === "page-trace") initTrace();
  if (pageId === "page-gallery") renderGallery();
}

// ===== DARK MODE =====
const themeBtn = document.getElementById("theme-btn");
let darkMode = false;
themeBtn.innerHTML = `<img src="assets/images/moon.png" alt="Dark Mode" />`;
themeBtn.addEventListener("click", () => {
  darkMode = !darkMode;
  document.body.classList.toggle("dark", darkMode);
  themeBtn.innerHTML = darkMode
    ? `<img src="assets/images/sun.png" alt="Light Mode" />`
    : `<img src="assets/images/moon.png" alt="Dark Mode" />`;
  if (currentPage === "page-trace" && typeof drawGhost === "function")
    drawGhost();
});

// ===== MUSIC =====
const bgMusic = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
let musicOn = false;
musicBtn.innerHTML = `<img src="assets/images/note.png" alt="Music Off" />`;
musicBtn.addEventListener("click", () => {
  musicOn = !musicOn;
  musicOn ? bgMusic.play().catch(() => {}) : bgMusic.pause();
  musicBtn.innerHTML = musicOn
    ? `<img src="assets/images/notes.png" alt="Music On" />`
    : `<img src="assets/images/note.png" alt="Music Off" />`;
  musicBtn.classList.toggle("playing", musicOn);
});
function playSound(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(() => {});
}

// ===== PETALS =====
const PETALS = ["✿", "❀", "✾", "❁", "🌸", "🌺", "♡"];
const petalBox = document.getElementById("petals-container");
function spawnPetal() {
  const p = document.createElement("div");
  p.className = "petal";
  p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  p.style.left = Math.random() * 100 + "vw";
  p.style.fontSize = 0.8 + Math.random() * 1.1 + "rem";
  p.style.opacity = 0.3 + Math.random() * 0.35;
  const dur = 7 + Math.random() * 10;
  p.style.animationDuration = dur + "s";
  p.style.animationDelay = Math.random() * 4 + "s";
  petalBox.appendChild(p);
  setTimeout(() => p.remove(), (dur + 5) * 1000);
}
setInterval(spawnPetal, 900);
for (let i = 0; i < 10; i++) spawnPetal();

// ===== GALLERY =====
let galleryScript = "hiragana";

function showGalleryScript(script, btn) {
  galleryScript = script;
  document
    .querySelectorAll("#page-gallery .tab-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  renderGallery();
}

function renderGallery() {
  const grid = document.getElementById("gallery-grid");
  const empty = document.getElementById("gallery-empty");
  grid.innerHTML = "";
  let count = 0;

  if (galleryScript === "words") {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith("tracing_words_")) continue;
      if (key.endsWith("_emotion") || key.endsWith("_photo")) continue;
      const word = key.replace("tracing_words_", "");
      const data = localStorage.getItem(key);
      count++;
      const cell = document.createElement("div");
      cell.className = "gallery-cell";
      cell.innerHTML = `
        <div class="gc-char" style="font-size:1.1rem">${word}</div>
        <img class="gc-img" src="${data}" alt="${word}" data-key="${key}" data-char="${word}" />
        ${emotionBadgeHTML(key)}
        <button class="gc-retrace" onclick="navigate('page-trace'); setTimeout(()=>selectWordByKanji('${word}'),500)">✒ Retrace</button>
        <button class="gc-delete" onclick="deleteTracing('words','${word}', this)">✕</button>
      `;
      grid.appendChild(cell);
    }
  } else {
    const pool = galleryScript === "hiragana" ? HIRAGANA : KATAKANA;
    pool.forEach((item) => {
      const key = `tracing_${galleryScript}_${item.char}`;
      const data = localStorage.getItem(key);
      if (!data) return;
      count++;
      const cell = document.createElement("div");
      cell.className = "gallery-cell";
      cell.innerHTML = `
        <div class="gc-char">${item.char}</div>
        <img class="gc-img" src="${data}" alt="${item.romaji}" data-key="${key}" data-char="${item.char}" />
        <div class="gc-romaji">${item.romaji}</div>
        ${emotionBadgeHTML(key)}
        <button class="gc-retrace" onclick="navigate('page-trace'); setTimeout(()=>selectCharByChar('${item.char}','${galleryScript}'),500)">✒ Retrace</button>
        <button class="gc-delete"  onclick="deleteTracing('${galleryScript}','${item.char}', this)">✕</button>
      `;
      grid.appendChild(cell);
    });
  }

  empty.style.display = count === 0 ? "block" : "none";

  grid.querySelectorAll('.gc-emotion-badge').forEach(badge => {
    badge.addEventListener('click', () => openEmotionModal(badge.dataset.emotionKey));
  });
  grid.querySelectorAll('.gc-img').forEach(img => {
    img.addEventListener('click', () => openGalleryPhotoModal(img.dataset.key, img.dataset.char, img.src));
  });
}

function emotionBadgeHTML(storageKey) {
  const raw = localStorage.getItem(storageKey + '_emotion');
  if (!raw) return '';
  try {
    const { key } = JSON.parse(raw);
    const data = window.EMOTION_DATA && window.EMOTION_DATA[key];
    if (!data) return '';
    return `<div class="gc-emotion-badge" data-emotion-key="${key}" style="background:${data.colors.acc};color:${data.colors.bg}">${data.jp} ${data.en}</div>`;
  } catch { return ''; }
}

function openEmotionModal(key) {
  const data = window.EMOTION_DATA && window.EMOTION_DATA[key];
  if (!data) return;
  document.getElementById('em-jp').textContent   = data.jp;
  document.getElementById('em-en').textContent   = data.en;
  document.getElementById('em-desc').textContent = data.description;
  document.getElementById('em-cues').innerHTML   = data.facialCues.map(c => `<li>${c}</li>`).join('');
  document.getElementById('em-states').innerHTML = data.states.map(s => `<span class="em-state-chip">${s}</span>`).join('');
  const modal = document.getElementById('emotion-modal');
  modal.style.setProperty('--em-acc', data.colors.acc);
  modal.style.setProperty('--em-bg',  data.colors.bg);
  modal.classList.add('open');
}

function openGalleryPhotoModal(storageKey, char, tracingSrc) {
  document.getElementById('gpm-char').textContent = char;
  document.getElementById('gpm-tracing').src = tracingSrc;
  const photo = localStorage.getItem(storageKey + '_photo');
  const photoCol = document.getElementById('gpm-photo-col');
  if (photo) { document.getElementById('gpm-photo').src = photo; photoCol.style.display = ''; }
  else photoCol.style.display = 'none';
  const badge = document.getElementById('gpm-emotion-badge');
  const raw = localStorage.getItem(storageKey + '_emotion');
  if (raw) {
    try {
      const { key } = JSON.parse(raw);
      const data = window.EMOTION_DATA && window.EMOTION_DATA[key];
      if (data) { badge.textContent = `${data.jp}  ${data.en}`; badge.style.background = data.colors.acc; badge.style.color = data.colors.bg; badge.style.display = 'inline-block'; }
    } catch { badge.style.display = 'none'; }
  } else badge.style.display = 'none';
  document.getElementById('gallery-photo-modal').classList.add('open');
}

function deleteTracing(script, char, btn) {
  const key = `tracing_${script}_${char}`;
  localStorage.removeItem(key);
  localStorage.removeItem(key + '_emotion');
  localStorage.removeItem(key + '_photo');
  btn.closest(".gallery-cell").remove();
  const grid = document.getElementById("gallery-grid");
  if (!grid.children.length)
    document.getElementById("gallery-empty").style.display = "block";
}

function clearGallery() {
  if (galleryScript === "words") {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tracing_words_")) localStorage.removeItem(key);
    }
  } else {
    const pool = galleryScript === "hiragana" ? HIRAGANA : KATAKANA;
    pool.forEach((item) => {
      const key = `tracing_${galleryScript}_${item.char}`;
      localStorage.removeItem(key);
      localStorage.removeItem(key + '_emotion');
      localStorage.removeItem(key + '_photo');
    });
  }
  renderGallery();
}

// helper: select a char by value when navigating from gallery
function selectCharByChar(char, script) {
  const pool = script === "hiragana" ? HIRAGANA : KATAKANA;
  const item = pool.find((c) => c.char === char);
  if (!item) return;
  const btns = document.querySelectorAll(".char-pick-btn");
  btns.forEach((b) => {
    if (b.textContent === char) selectChar(item, b);
  });
}
