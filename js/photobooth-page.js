// photobooth-page.js — drives page-photobooth

import { loadModels, detectOnce, drawDetection } from './detector.js';
import { startCamera, stopCamera, syncOverlaySize } from './camera.js';
import { EMOTIONS, FACEAPI_MAP } from './emotions.js';

const videoEl   = document.getElementById('pb-video');
const overlayEl = document.getElementById('pb-overlay');
let running = false, camStream = null;
let currentKey = 'neutral', currentConf = 0;
let fps = 0, frameCount = 0, lastTime = performance.now();
const pbHistory = [];

const _orig = window.navigate;
window.navigate = function(pageId) {
  _orig(pageId);
  if (pageId === 'page-photobooth') startPB();
  else stopPB();
};

async function startPB() {
  setStatus('STARTING CAMERA...');
  try {
    camStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    videoEl.srcObject = camStream;
    await new Promise(r => { videoEl.onloadedmetadata = r; });
    syncOverlaySize(videoEl, overlayEl);
    setStatus('LOADING MODELS...');
    await loadModels();
    setStatus('SCANNING...');
    running = true;
    document.getElementById('pb-capture-btn').disabled = false;
    loop();
  } catch (err) { setStatus('ERROR: ' + err.message); }
}

function stopPB() {
  running = false;
  document.getElementById('pb-capture-btn').disabled = true;
  if (camStream) { camStream.getTracks().forEach(t => t.stop()); camStream = null; }
}

async function loop() {
  if (!running) return;
  const result = await detectOnce(videoEl);
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) { fps = frameCount; frameCount = 0; lastTime = now; }

  if (result) {
    currentKey  = FACEAPI_MAP[result.emotion] || 'neutral';
    currentConf = result.confidence;
    drawDetection(overlayEl, result.detection, EMOTIONS[currentKey]?.colors.acc || '#0d0d0d');
    updateUI(currentKey, currentConf);
    setStatus('SCANNING...');
    document.getElementById('pb-capture-btn').disabled = false;
  } else {
    drawDetection(overlayEl, null, null);
    setStatus('NO FACE DETECTED');
  }
  document.getElementById('pb-fps').textContent  = `FPS ${fps}`;
  document.getElementById('pb-conf').textContent = `CONF ${Math.round(currentConf * 100)}%`;
  requestAnimationFrame(loop);
}

function updateUI(key, confidence) {
  const data = EMOTIONS[key];
  if (!data) return;

  const page = document.getElementById('page-photobooth');
  page.style.setProperty('--kc-em-bg',  data.colors.bg);
  page.style.setProperty('--kc-em-acc', data.colors.acc);
  page.style.setProperty('--kc-em-mid', data.colors.mid);

  document.getElementById('kc-header-emotion-tag').textContent = data.cluster;
  document.getElementById('pb-jp').textContent  = data.jp;
  document.getElementById('pb-en').textContent  = data.en;

  const pct = Math.round(confidence * 100);
  document.getElementById('pb-intensity-fill').style.width = pct + '%';
  document.getElementById('pb-intensity-label').textContent = `INTENSITY: ${pct}%`;

  document.getElementById('pb-cues').innerHTML =
    (data.facialCues || []).map(c => `<li>${c}</li>`).join('');
  document.getElementById('pb-cluster').textContent = data.cluster;
  document.getElementById('pb-states').innerHTML =
    data.states.map(s => `<span class="kc-state-chip">${s}</span>`).join('');
  document.getElementById('pb-sub-emotions').innerHTML =
    data.subEmotions.map(s => `
      <div class="kc-sub-emotion-item">
        <div class="kc-sub-emotion-name">${s.name.toUpperCase()} <span class="kc-sub-emotion-jp">${s.jp}</span></div>
        <div class="kc-sub-emotion-desc">${s.desc}</div>
      </div>`).join('');
  document.getElementById('pb-desc').textContent   = data.description;
  document.getElementById('pb-action').textContent = data.action;

  if (!pbHistory.length || pbHistory[pbHistory.length - 1].jp !== data.jp) {
    pbHistory.push({ jp: data.jp, acc: data.colors.acc, bg: data.colors.bg });
    if (pbHistory.length > 12) pbHistory.shift();
    document.getElementById('pb-history').innerHTML = pbHistory
      .map(h => `<div class="kc-history-dot" style="background:${h.acc};color:${h.bg}">${h.jp}</div>`)
      .join('');
  }
}

function setStatus(t) { document.getElementById('pb-cam-status').textContent = t; }

document.getElementById('pb-capture-btn').addEventListener('click', () => {
  const data = EMOTIONS[currentKey];
  if (!data) return;
  const FRAME_W = 640, FRAME_H = 480, BORDER = 24, FOOTER = 110;
  const canvas = document.getElementById('pb-snap-canvas');
  canvas.width = FRAME_W; canvas.height = FRAME_H + FOOTER;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = data.colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(videoEl, 0, 0, FRAME_W, FRAME_H);
  ctx.strokeStyle = data.colors.acc; ctx.lineWidth = BORDER;
  ctx.strokeRect(BORDER/2, BORDER/2, FRAME_W-BORDER, FRAME_H-BORDER);
  const cs = 40; ctx.fillStyle = data.colors.acc;
  [[0,0],[FRAME_W-cs,0],[0,FRAME_H-cs],[FRAME_W-cs,FRAME_H-cs]].forEach(([x,y]) => ctx.fillRect(x,y,cs,cs));
  ctx.fillRect(0, FRAME_H, FRAME_W, FOOTER);
  ctx.fillStyle = data.colors.bg;
  ctx.font = 'bold 52px "Noto Sans JP", sans-serif'; ctx.textBaseline = 'top'; ctx.textAlign = 'left';
  ctx.fillText(data.jp, 20, FRAME_H + 12);
  ctx.font = '700 18px "Space Mono", monospace';
  ctx.fillText(`${data.en.toUpperCase()} / ${data.cluster}`, 20, FRAME_H + 68);
  ctx.font = '400 13px "Space Mono", monospace'; ctx.textAlign = 'right';
  ctx.fillText(`${Math.round(currentConf*100)}% CONFIDENCE`, FRAME_W-16, FRAME_H+68);
  ctx.fillText('かなトレース · Emotion Photobooth', FRAME_W-16, FRAME_H+FOOTER-18);
  document.getElementById('pb-snap-modal').classList.add('open');
  document.getElementById('pb-snap-download').onclick = () => {
    const a = document.createElement('a');
    a.download = `kana-${data.en.toLowerCase()}-${Date.now()}.png`;
    a.href = canvas.toDataURL('image/png'); a.click();
  };
});
