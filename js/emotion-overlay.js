// emotion-overlay.js — mini cam widget on trace page

import { loadModels, detectOnce } from './detector.js';
import { EMOTIONS } from './emotions.js';

let currentEmotion = null;
let running = false;
let stream  = null;

export function getCurrentEmotion() { return currentEmotion; }

export async function startEmotionOverlay() {
  const video = document.getElementById('emotion-video');
  const label = document.getElementById('emotion-label');
  if (!video) return;
  label.textContent = 'Starting cam...';
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    video.srcObject = stream;
    await new Promise(r => { video.onloadedmetadata = r; });
    label.textContent = 'Loading models...';
    await loadModels();
    label.textContent = 'Detecting...';
    running = true;
    loop(video, label);
  } catch { label.textContent = 'Cam unavailable'; }
}

export function stopEmotionOverlay() {
  running = false;
  if (stream) stream.getTracks().forEach(t => t.stop());
  stream = null;
  currentEmotion = null;
}

async function loop(video, label) {
  if (!running) return;
  const result = await detectOnce(video);
  if (result) {
    const key  = result.emotion;
    const data = EMOTIONS[key] || EMOTIONS.neutral;
    currentEmotion = { key, data, confidence: result.confidence };
    label.textContent      = `${data.jp} ${data.en}`;
    label.style.background = data.colors.acc;
    label.style.color      = data.colors.bg;

    const epJp   = document.getElementById('ep-jp');
    const epEn   = document.getElementById('ep-en');
    const epCues = document.getElementById('ep-cues');
    const epDesc = document.getElementById('ep-desc');
    if (epJp)   epJp.textContent   = data.jp;
    if (epEn)   epEn.textContent   = data.en;
    if (epCues) epCues.innerHTML   = (data.facialCues || []).map(c => `<li>${c}</li>`).join('');
    if (epDesc) epDesc.textContent = data.description || '';
  } else {
    label.textContent      = 'No face';
    label.style.background = '';
    label.style.color      = '';
  }
  setTimeout(() => requestAnimationFrame(() => loop(video, label)), 600);
}
