// ===== CUSTOM CURSOR =====
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.addEventListener('mousedown', () => document.body.classList.add('clicking'));
document.addEventListener('mouseup',   () => document.body.classList.remove('clicking'));
const traceCanvas = document.getElementById('trace-canvas');
traceCanvas.addEventListener('mouseenter', () => document.body.classList.add('on-canvas'));
traceCanvas.addEventListener('mouseleave', () => document.body.classList.remove('on-canvas'));

// ===== NAVIGATION =====
let currentPage = 'page-home';
const topControls = document.getElementById('top-controls');
function navigate(pageId) {
  if (pageId === currentPage) return;
  playSound('sfx-click');
  const out = document.getElementById(currentPage);
  const inn = document.getElementById(pageId);
  out.classList.remove('active');
  out.classList.add('exit-left');
  inn.classList.add('active');
  out.addEventListener('transitionend', () => out.classList.remove('exit-left'), { once: true });
  currentPage = pageId;
  topControls.style.display = pageId === 'page-home' ? 'flex' : 'none';
  if (pageId === 'page-trace')   initTrace();
  if (pageId === 'page-gallery') renderGallery();
}

// ===== DARK MODE =====
const themeBtn = document.getElementById('theme-btn');
let darkMode = false;
themeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  document.body.classList.toggle('dark', darkMode);
  themeBtn.textContent = darkMode ? '☀️' : '🌙';
  if (currentPage === 'page-trace' && typeof drawGhost === 'function') drawGhost();
});

// ===== MUSIC =====
const bgMusic  = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-btn');
let musicOn = false;
musicBtn.addEventListener('click', () => {
  musicOn = !musicOn;
  musicOn ? bgMusic.play().catch(()=>{}) : bgMusic.pause();
  musicBtn.textContent = musicOn ? '🎶' : '🎵';
  musicBtn.classList.toggle('playing', musicOn);
});
function playSound(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.currentTime = 0;
  el.play().catch(() => {});
}

// ===== PETALS =====
const PETALS = ['✿','❀','✾','❁','🌸','🌺','♡'];
const petalBox = document.getElementById('petals-container');
function spawnPetal() {
  const p = document.createElement('div');
  p.className = 'petal';
  p.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.fontSize = (0.8 + Math.random() * 1.1) + 'rem';
  p.style.opacity  = 0.3 + Math.random() * 0.35;
  const dur = 7 + Math.random() * 10;
  p.style.animationDuration = dur + 's';
  p.style.animationDelay    = Math.random() * 4 + 's';
  petalBox.appendChild(p);
  setTimeout(() => p.remove(), (dur + 5) * 1000);
}
setInterval(spawnPetal, 900);
for (let i = 0; i < 10; i++) spawnPetal();

// ===== GALLERY =====
let galleryScript = 'hiragana';

function showGalleryScript(script, btn) {
  galleryScript = script;
  document.querySelectorAll('#page-gallery .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderGallery();
}

function renderGallery() {
  const grid  = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  grid.innerHTML = '';
  let count = 0;

  if (galleryScript === 'words') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key.startsWith('tracing_words_')) continue;
      const word = key.replace('tracing_words_', '');
      const data = localStorage.getItem(key);
      count++;
      const cell = document.createElement('div');
      cell.className = 'gallery-cell';
      cell.innerHTML = `
        <div class="gc-char" style="font-size:1.1rem">${word}</div>
        <img class="gc-img" src="${data}" alt="${word}" />
        <button class="gc-delete" onclick="deleteTracing('words','${word}', this)">✕</button>
      `;
      grid.appendChild(cell);
    }
  } else {
    const pool = galleryScript === 'hiragana' ? HIRAGANA : KATAKANA;
    pool.forEach(item => {
      const key  = `tracing_${galleryScript}_${item.char}`;
      const data = localStorage.getItem(key);
      if (!data) return;
      count++;
      const cell = document.createElement('div');
      cell.className = 'gallery-cell';
      cell.innerHTML = `
        <div class="gc-char">${item.char}</div>
        <img class="gc-img" src="${data}" alt="${item.romaji}" />
        <div class="gc-romaji">${item.romaji}</div>
        <button class="gc-retrace" onclick="navigate('page-trace'); setTimeout(()=>selectCharByChar('${item.char}','${galleryScript}'),500)">✒ Retrace</button>
        <button class="gc-delete"  onclick="deleteTracing('${galleryScript}','${item.char}', this)">✕</button>
      `;
      grid.appendChild(cell);
    });
  }

  empty.style.display = count === 0 ? 'block' : 'none';
}

function deleteTracing(script, char, btn) {
  localStorage.removeItem(`tracing_${script}_${char}`);
  btn.closest('.gallery-cell').remove();
  const grid = document.getElementById('gallery-grid');
  if (!grid.children.length) document.getElementById('gallery-empty').style.display = 'block';
}

function clearGallery() {
  if (galleryScript === 'words') {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.startsWith('tracing_words_')) localStorage.removeItem(key);
    }
  } else {
    const pool = galleryScript === 'hiragana' ? HIRAGANA : KATAKANA;
    pool.forEach(item => localStorage.removeItem(`tracing_${galleryScript}_${item.char}`));
  }
  renderGallery();
}

// helper: select a char by value when navigating from gallery
function selectCharByChar(char, script) {
  const pool = script === 'hiragana' ? HIRAGANA : KATAKANA;
  const item = pool.find(c => c.char === char);
  if (!item) return;
  const btns = document.querySelectorAll('.char-pick-btn');
  btns.forEach(b => { if (b.textContent === char) selectChar(item, b); });
}
