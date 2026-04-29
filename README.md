<div align="center">

<img src="assets/images/logo.png" alt="Katracer Logo" width="120" />

# かなトレース+
Kana Handwriting Practice with Emotion Detection<br>
Trace Hiragana, Katakana & JLPT Vocabulary — and See How You Feel Doing It

[**Technical Paper »**](https://drive.google.com/file/d/1xZnKCNjFqYkBxLtdDU1YNwnDbUTTzqNK/view?usp=sharing)

[Report Bug](https://github.com/feiryrej/nani-level/issues)
·
[Request Feature](https://github.com/feiryrej/nani-level/pulls)

</div>

## Demo

<!-- TODO: insert demo GIF or screenshot here -->

---

## Overview

**Katracer + 感情 (Kanjou)** is a browser-based Japanese kana handwriting practice tool extended with real-time facial emotion detection. Users trace hiragana, katakana, or JLPT vocabulary words on an interactive canvas while a live webcam widget detects and displays their current emotion using [face-api.js](https://github.com/vladmandic/face-api). Each saved tracing is tagged with the detected emotion and stored in the browser's `localStorage`, letting learners build a visual record of both their writing progress and their emotional state during practice.

The emotion feature was built by fusing two separate projects:
- **Katracer** — the original kana handwriting practice app
- **Kanjou-Cam** — a standalone real-time emotion detection photobooth

This project is submitted for **COSC 402 Individual Activity: Emotion-Aware Prototype** at the Polytechnic University of the Philippines (April 2026).

---

## Why Emotion-Aware Learning?

Traditional handwriting tools focus only on correctness and repetition. This system introduces emotional awareness into the learning process, allowing users to:

- Reflect on how emotions affect writing performance
- Identify frustration, boredom, or engagement during practice
- Build a more mindful and personalized learning experience

This makes かなトレース+ feel research-worthy, not just functional — bridging human-computer interaction, affective computing, and language learning into a single browser-based tool.

---

## Background

Mastering the Japanese writing system requires repeated, deliberate practice of stroke order and character form. Most digital tools focus on recognition (flashcards, quizzes) rather than production. Katracer addresses this gap by providing a low-friction, aesthetically engaging canvas environment where learners can practice writing kana characters and JLPT vocabulary directly in the browser — no installation required.

The emotion-aware extension adds a new dimension: learners can observe how their emotional state correlates with their practice sessions, grounded in Paul Ekman's six universal emotions plus a calm/neutral baseline.

---

## Key Features

### Original Katracer Features
- **Trace Mode** — Freehand canvas drawing with a ribbon-style brush; ghost character overlay guides stroke placement
- **Hiragana & Katakana** — Full 46-character sets with romaji labels, row groupings, and contextual word suggestions
- **Word Mode** — JLPT N5–N1 vocabulary words for advanced tracing practice, with level selector and random shuffle
- **Gallery** — Saved tracings organized by script (hiragana / katakana / words); individual delete and full clear supported
- **Dark / Light Theme** — Toggle between themes; ghost character opacity adapts automatically
- **Background Music** — Optional ambient BGM with a toggle button
- **Custom Cursor** — Smooth animated cursor ring with canvas-aware styling
- **Falling Petals** — Ambient petal animation for an immersive aesthetic

### New Emotion-Aware Features
- **Live Emotion Overlay** — A mini webcam widget on the Trace page detects your face in real time and displays your current emotion (Japanese + English label) using face-api.js TinyFaceDetector
- **Emotion Tagging on Save** — When you save a tracing, the detected emotion is stored alongside it in `localStorage`
- **Emotion Badges in Gallery** — Each saved tracing shows a color-coded emotion badge reflecting the emotion at the time of saving
- **Emotion Detail Modal** — Click any badge to see the full emotion profile: Japanese name, English name, description, facial cues, and sub-emotion states
- **Gallery Photo Modal** — Click a tracing thumbnail to see the full tracing alongside the webcam snapshot and emotion badge
- **Emotion Photobooth Page** — A dedicated page (Kanjou-Cam) for real-time emotion detection with intensity meter, facial cue breakdown, sub-emotion explorer, emotion history timeline, and downloadable emotion snapshots
- **7 Emotion Classes** — Joy (喜び), Sadness (悲しみ), Anger (怒り), Fear (恐れ), Disgust (嫌悪), Surprise (驚き), Calm (平静) — mapped from face-api's output to a rich emotion data model

---

## Application Snapshots

### Home Page
<!-- TODO: insert home page screenshot -->

### Trace Page with Emotion Overlay
<!-- TODO: insert trace page screenshot showing the live emotion widget -->

### Gallery with Emotion Badges
<!-- TODO: insert gallery screenshot showing emotion-tagged tracings -->

### Emotion Detail Modal
<!-- TODO: insert emotion modal screenshot -->

### Emotion Photobooth (Kanjou-Cam)
<!-- TODO: insert photobooth page screenshot -->

---

## System Architecture

Katracer + 感情 is a fully static, client-side web application — no backend, no build step, no API keys required.

```
katracer-emotion/
├── index.html              # All pages: Home, Trace, Gallery, Photobooth
├── css/
│   └── style.css           # All styles including emotion overlay & photobooth
├── js/
│   ├── data.js             # Hiragana & katakana datasets (char, romaji, words)
│   ├── vocab.js            # JLPT N1–N5 vocabulary lists
│   ├── trace.js            # Canvas drawing, ghost character, save-to-gallery
│   ├── app.js              # Navigation, dark mode, music, gallery rendering,
│   │                       #   emotion badge HTML, gallery/emotion modals
│   ├── emotions.js         # Emotion data model: 7 emotions × (jp, en, colors,
│   │                       #   facialCues, states, subEmotions, description)
│   ├── detector.js         # face-api.js model loading & single-frame detection
│   ├── camera.js           # Webcam start/stop and overlay canvas sync
│   ├── emotion-overlay.js  # Live emotion widget on the Trace page (mini cam loop)
│   ├── emotion-init.js     # Module entry: exposes emotion globals, patches navigate()
│   └── photobooth-page.js  # Full Kanjou-Cam photobooth page logic
└── assets/
    ├── images/             # logo, cursor, moon/sun, note/notes, light/dark bg
    └── sounds/
        └── bgm.mp3         # Ambient background music
```

### How the Emotion Pipeline Works

1. **`detector.js`** loads two face-api.js models from CDN (`tinyFaceDetector` + `faceExpressionNet`) and exposes `detectOnce(videoEl)` which returns the dominant emotion and confidence score.
2. **`emotion-overlay.js`** runs a 600 ms polling loop on the Trace page, calling `detectOnce` and updating the mini overlay label and the emotion panel with the current emotion's data from `emotions.js`.
3. **`photobooth-page.js`** runs a `requestAnimationFrame` loop on the Photobooth page, calling `detectOnce` and updating the full Kanjou-Cam UI (intensity bar, facial cues, sub-emotions, history dots).
4. **`app.js`** reads `window.getCurrentEmotion()` at save time and writes `{ key, data, confidence }` to `localStorage` under `<tracing-key>_emotion`. It also reads this on gallery render to produce emotion badges and modals.
5. **`emotion-init.js`** patches `window.navigate` to start/stop the overlay when entering/leaving the Trace page, and exposes `EMOTION_DATA` and `getCurrentEmotion` globally.

---

## Setup and Usage

No installation or build step needed — runs entirely in the browser.

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/katracer-emotion.git
   cd katracer-emotion
   ```

2. **Serve with a local static server** (required for webcam + ES modules)
   ```bash
   npx serve .
   # or
   python -m http.server 8080
   ```

3. **Open in browser**
   ```
   http://localhost:3000
   ```
### Webcam Permission

The emotion overlay and photobooth require webcam access. Grant permission when the browser prompts. If the camera is unavailable, the overlay shows "Cam unavailable" and tracing still works normally without emotion tagging.

---

## How to Use

| Step | Action |
|------|--------|
| 1 | Click **Start Tracing** from the home page |
| 2 | Allow webcam access when prompted |
| 3 | Select **Hiragana**, **Katakana**, or **Words** tab |
| 4 | Pick a character or JLPT word — the emotion overlay activates automatically |
| 5 | Trace the ghost character; your current emotion is shown live in the overlay panel |
| 6 | Click **Save** — the tracing is stored with your detected emotion |
| 7 | Visit **My Gallery** to review tracings with their emotion badges |
| 8 | Click a badge to see the full emotion profile; click a tracing to see the photo modal |
| 9 | Visit **Photobooth** for the full Kanjou-Cam emotion detection experience |

---

## Emotion Classes

| face-api output | Japanese | English | Cluster |
|-----------------|----------|---------|---------|
| `happy` | 喜び | Joy | JOY |
| `sad` | 悲しみ | Sadness | SADNESS |
| `angry` | 怒り | Anger | ANGER |
| `fearful` | 恐れ | Fear | FEAR |
| `disgusted` | 嫌悪 | Disgust | DISGUST |
| `surprised` | 驚き | Surprise | SURPRISE |
| `neutral` | 平静 | Calm | CALM |

Each emotion includes: description, facial cues, intensity states, sub-emotions, and a recommended action — based on Paul Ekman's Atlas of Emotions framework.

---

## Contributors

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Avatar</th>
      <th>GitHub</th>
      <th>Contributions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Regina S. Bonifacio</td>
      <td><!-- TODO: insert avatar --></td>
      <td><a href="https://github.com/feiryrej">feiryrej</a></td>
      <td><strong>Developer & Researcher</strong>: Full development of Katracer (UI/UX, canvas engine, kana dataset, JLPT vocabulary, gallery, theme, audio) and the emotion-aware extension (face-api integration, emotion overlay, photobooth page, emotion tagging, gallery modals, emotion data model).</td>
    </tr>
  </tbody>
</table>

---

## References

Ekman, P. (2003). *Emotions revealed: Recognizing faces and feelings to improve communication and emotional life*. Times Books.

Japan Foundation. (2023). *Japanese-Language Proficiency Test (JLPT): About the JLPT*. https://www.jlpt.jp/e/about/levelsummary.html

Mdn Web Docs. (2024). *Canvas API*. Mozilla. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

Nielsen, J. (1994). *Usability engineering*. Morgan Kaufmann.

Norman, D. A. (2013). *The design of everyday things* (Revised ed.). Basic Books.

Vladmandic. (2024). *face-api.js*. GitHub. https://github.com/vladmandic/face-api

[[Back to top](#かなトレース)]
