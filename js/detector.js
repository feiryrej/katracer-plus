// detector.js — face-api.js model loading and detection loop

const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/';

export async function loadModels() {
  const fa = window.faceapi;
  await Promise.all([
    fa.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
    fa.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  ]);
}

/**
 * Run one detection pass on the video element.
 * Returns { emotion, confidence, expressions } or null if no face found.
 */
export async function detectOnce(videoEl) {
  const fa = window.faceapi;
  const result = await fa
    .detectSingleFace(videoEl, new fa.TinyFaceDetectorOptions({ scoreThreshold: 0.4 }))
    .withFaceExpressions();

  if (!result) return null;

  const expressions = result.expressions;
  const emotion = expressions.asSortedArray()[0];

  return {
    emotion:     emotion.expression,   // e.g. 'happy'
    confidence:  emotion.probability,  // 0–1
    expressions: expressions.asSortedArray(),
    detection:   result.detection,
  };
}

/**
 * Draw a minimal bounding box on the overlay canvas.
 */
export function drawDetection(canvasEl, detection, accentColor) {
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  if (!detection) return;

  const { x, y, width, height } = detection.box;
  ctx.strokeStyle = accentColor || '#0d0d0d';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
}
