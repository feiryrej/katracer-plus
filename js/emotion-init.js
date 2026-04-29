// emotion-init.js — module entry point
import { startEmotionOverlay, stopEmotionOverlay, getCurrentEmotion } from './emotion-overlay.js';
import { EMOTIONS } from './emotions.js';

window.getCurrentEmotion = getCurrentEmotion;
window.EMOTION_DATA      = EMOTIONS;

const _origNavigate = window.navigate;
window.navigate = function(pageId) {
  _origNavigate(pageId);
  if (pageId === 'page-trace') startEmotionOverlay();
  else stopEmotionOverlay();
};
