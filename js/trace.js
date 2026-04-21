// ===== TRACE MODULE =====
let traceScript = 'hiragana';
let selectedChar = null;
let isDrawing = false;
let lastX = 0, lastY = 0;
let ribbonHue = 0;

const canvas = document.getElementById('trace-canvas');
const ctx    = canvas.getContext('2d');

// ── Ribbon drawing ──
function setRibbonStyle() {
  ribbonHue = (ribbonHue + 1.5) % 60;
  const r = 210 + Math.sin(ribbonHue * 0.1) * 22;
  const g = 80  + Math.sin(ribbonHue * 0.15) * 18;
  const b = 110 + Math.sin(ribbonHue * 0.08) * 18;
  ctx.strokeStyle = `rgb(${r|0},${g|0},${b|0})`;
  ctx.lineWidth   = 7;
  ctx.lineCap     = 'round';
  ctx.lineJoin    = 'round';
  ctx.shadowColor = `rgba(${r|0},${g|0},${b|0},0.5)`;
  ctx.shadowBlur  = 12;
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width  / rect.width;
  const sy = canvas.height / rect.height;
  const src = e.touches ? e.touches[0] : e;
  return { x: (src.clientX - rect.left) * sx, y: (src.clientY - rect.top) * sy };
}

canvas.addEventListener('pointerdown', e => {
  isDrawing = true;
  const { x, y } = getPos(e);
  lastX = x; lastY = y;
  playSound('sfx-stroke');
});
canvas.addEventListener('pointermove', e => {
  if (!isDrawing) return;
  const { x, y } = getPos(e);
  setRibbonStyle();
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.quadraticCurveTo(lastX, lastY, (lastX + x) / 2, (lastY + y) / 2);
  ctx.stroke();
  lastX = x; lastY = y;
});
canvas.addEventListener('pointerup',    () => { isDrawing = false; ctx.shadowBlur = 0; });
canvas.addEventListener('pointerleave', () => { isDrawing = false; ctx.shadowBlur = 0; });

// ── Ghost character ──
function drawGhost() {
  ctx.save();
  const len = selectedChar ? [...selectedChar.char].length : 1;
  const fontSize = Math.min(230, Math.floor((canvas.width * 0.88) / len));
  ctx.font = `${fontSize}px "Noto Sans JP", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = document.body.classList.contains('dark')
    ? 'rgba(232,160,180,0.12)' : 'rgba(201,116,143,0.22)';
  ctx.fillText(selectedChar.char, canvas.width / 2, canvas.height / 2 + 10);
  ctx.restore();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGhost();
}

// ── Word suggestions ──
function renderWords() {
  const list = document.getElementById('ws-list');
  list.innerHTML = '';
  (selectedChar.words || []).forEach(w => {
    const card = document.createElement('div');
    card.className = 'ws-card';
    card.innerHTML = `<span class="ws-word">${w.w}</span><span class="ws-romaji">${w.r}</span><span class="ws-meaning">${w.m}</span>`;
    list.appendChild(card);
  });
}

// ── Save tracing ──
function saveTracing() {
  const key = `tracing_${traceScript}_${selectedChar.char}`;
  localStorage.setItem(key, canvas.toDataURL('image/png'));
  playSound('sfx-save');
  showSaveToast();
}

function showSaveToast() {
  let t = document.getElementById('save-toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'save-toast';
    document.body.appendChild(t);
  }
  t.textContent = '✿ Saved to your gallery! ♡';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2200);
}

// ── Character picker ──
function setTraceScript(script, btn) {
  traceScript = script;
  document.querySelectorAll('#page-trace .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('word-mode-controls').style.display = script === 'words' ? 'flex' : 'none';
  document.getElementById('trace-char-picker').style.display  = script === 'words' ? 'none' : '';
  buildPicker();
}

function buildPicker() {
  if (traceScript === 'words') { loadWordLevel(); return; }
  const pool = traceScript === 'hiragana' ? HIRAGANA : KATAKANA;
  const picker = document.getElementById('trace-char-picker');
  picker.innerHTML = '';
  pool.forEach((item, i) => {
    const btn = document.createElement('button');
    btn.className = 'char-pick-btn' + (i === 0 ? ' selected' : '');
    btn.textContent = item.char;
    btn.title = item.romaji;
    btn.onclick = () => selectChar(item, btn);
    picker.appendChild(btn);
  });
  selectChar(pool[0], picker.querySelector('.char-pick-btn'));
}

function selectChar(item, btn) {
  selectedChar = item;
  document.querySelectorAll('.char-pick-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('trace-display').textContent = item.char;
  document.getElementById('trace-romaji').textContent  = item.romaji;
  document.getElementById('trace-group').textContent   =
    `${traceScript === 'hiragana' ? 'Hiragana' : 'Katakana'} · ${item.group}`;
  clearCanvas();
  renderWords();
}

function initTrace() { buildPicker(); }


// ── Word Mode ──
let wordPool = [];
let currentWordIndex = 0;

function loadWordLevel() {
  const lvl = document.getElementById('word-level-select').value;
  wordPool = [...(JLPT_VOCAB[lvl] || [])].sort(() => Math.random() - 0.5);
  currentWordIndex = 0;
  showCurrentWord();
}

function nextWord() {
  currentWordIndex = (currentWordIndex + 1) % wordPool.length;
  showCurrentWord();
}

function showCurrentWord() {
  if (!wordPool.length) return;
  const word = wordPool[currentWordIndex];
  selectedChar = { char: word.k, romaji: word.r, group: 'Word', words: [] };
  document.getElementById('trace-display').textContent = word.k;
  document.getElementById('trace-romaji').textContent  = word.r;
  document.getElementById('trace-group').textContent   = `JLPT N${6 - parseInt(document.getElementById('word-level-select').value)} · Word`;
  document.getElementById('ws-list').innerHTML = '';
  clearCanvas();
}
