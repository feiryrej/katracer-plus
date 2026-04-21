<div align="center">

<img src="assets/images/logo.png" alt="Katracer Logo" width="120" />

# かなトレース
Kana Handwriting Practice<br>
Trace Hiragana, Katakana & JLPT Vocabulary, One Stroke at a Time

[**Technical Paper »**](https://drive.google.com/file/d/1xZnKCNjFqYkBxLtdDU1YNwnDbUTTzqNK/view?usp=sharing)

[Report Bug](https://github.com/feiryrej/nani-level/issues)
·
[Request Feature](https://github.com/feiryrej/nani-level/pulls)
</div>

---

## Demo



---

## Overview

Katracer is a browser-based Japanese kana handwriting practice tool. Users select a hiragana or katakana character or a JLPT-leveled vocabulary word and trace it freehand on an interactive canvas. Each tracing can be saved to a personal gallery stored in the browser's `localStorage`, letting learners build a visual record of their progress over time.

This repository is the code companion to the technical report *"Katracer: A Browser-Based Kana Handwriting Practice Application"* submitted to the Polytechnic University of the Philippines for Human-Computer Interaction (April 2026).

---

## Background

Mastering the Japanese writing system requires repeated, deliberate practice of stroke order and character form. Most digital tools focus on recognition (flashcards, quizzes) rather than production. Katracer addresses this gap by providing a low-friction, aesthetically engaging canvas environment where learners can practice writing kana characters and JLPT vocabulary directly in the browser, no installation required.

### Key Features

- **Trace Mode** — Freehand canvas drawing with a pink-style brush; ghost character overlay guides stroke placement
- **Hiragana & Katakana** — Full 46-character sets with romaji labels, row groupings, and contextual word suggestions per character
- **Word Mode** — JLPT N5–N1 vocabulary words for advanced tracing practice, with level selector and random shuffle
- **Gallery** — Saved tracings organized by script (hiragana / katakana / words); individual delete and full clear supported
- **Dark / Light Theme** — Toggle between themes; ghost character opacity adapts automatically
- **Background Music** — Optional ambient BGM with a toggle button
- **Custom Cursor** — Smooth animated cursor ring with canvas-aware styling
- **Falling Petals** — Ambient petal animation for an immersive aesthetic

---

## Application Snapshots

### Home Page
#### Light Mode
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/02304af9-e440-4a39-85e4-cdd354d53073" />

#### Dark Mode
<img width="1919" height="910" alt="image" src="https://github.com/user-attachments/assets/6dc69b18-40da-44e9-b408-b7136fa1c995" />

### Trace Mode
#### Light Mode
- Hiragana
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/937b1b60-5770-4663-bc22-8b71a1976c37" />

- Katakana
<img width="1919" height="909" alt="image" src="https://github.com/user-attachments/assets/3e553e78-56b7-4066-8e6c-8897bb851f19" />

- Words
<img width="1918" height="909" alt="image" src="https://github.com/user-attachments/assets/c99f9de2-eddf-4b05-a560-aa05080e29a0" />

#### Dark Mode
- Hiragana
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/4c3b0957-06c5-4ab0-b1b1-7045a821f808" />

- Katakana
<img width="1919" height="907" alt="image" src="https://github.com/user-attachments/assets/8314c820-4bcb-45d3-a641-0078ac0051fb" />

- Words
<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/f769aad3-88a1-47ca-8918-2c9a24a83ccd" />

### Gallery
#### Light Mode
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/73957935-e84a-40d7-a921-1e51f59754f5" />
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/d0de5e32-cb67-4fa1-8643-6a626d313810" />
<img width="1919" height="905" alt="image" src="https://github.com/user-attachments/assets/824bc562-2781-4a0f-a393-1db8dc15e44c" />



#### Dark Mode
<img width="1919" height="906" alt="image" src="https://github.com/user-attachments/assets/ed389b88-1879-49e4-bd5f-d8a90b625e8e" />
<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/b5c5978d-1b21-4c73-855e-b3a82ce4809e" />
<img width="1919" height="901" alt="image" src="https://github.com/user-attachments/assets/08a6bbab-6bf8-4347-8f93-b663f1355499" />


---

## System Architecture

Katracer is a fully static, client-side web application — no backend or build step required.

**`index.html`** defines the three-page layout (Home, Trace, Gallery) and loads all assets.

**`js/data.js`** contains the complete hiragana and katakana datasets, each character annotated with romaji, row group, and example vocabulary words.

**`js/vocab.js`** holds the JLPT N1–N5 vocabulary lists used in Word Mode.

**`js/trace.js`** manages the canvas: ribbon-style drawing, ghost character rendering, character/word selection, and save-to-gallery logic.

**`js/app.js`** handles navigation transitions, dark mode, music, the custom cursor, petal animation, and gallery rendering.

---

## Project Structure

```
katracer/
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   ├── cursor.png
│   │   ├── moon.png / sun.png
│   │   ├── note.png / notes.png
│   │   └── light.jpg / dark.jpg
│   └── sounds/
│       └── bgm.mp3
├── css/
│   └── style.css
├── js/
│   ├── data.js       # Hiragana & katakana datasets
│   ├── vocab.js      # JLPT N1–N5 vocabulary
│   ├── trace.js      # Canvas drawing & character logic
│   └── app.js        # UI, navigation, theme, gallery
└── index.html
```

---

## Setup and Usage

No installation or build step needed — Katracer runs entirely in the browser.

### Run Locally

1. **Clone the repository**
   ```bash
   git clone https://github.com/<your-username>/katracer.git
   cd katracer
   ```

2. **Open in browser**

   Simply open `index.html` in any modern browser:
   ```bash
   # macOS / Linux
   open index.html

   # Windows
   start index.html
   ```

   Or serve it with any static file server:
   ```bash
   npx serve .
   ```

> No dependencies, no build tools, no API keys required.

---

## How to Use

| Step | Action |
|------|--------|
| 1 | Click **Start Tracing** from the home page |
| 2 | Select **Hiragana**, **Katakana**, or **Words** tab |
| 3 | Pick a character (or select a JLPT level in Word Mode) |
| 4 | Trace the ghost character on the canvas |
| 5 | Click **Save** to store your tracing in the Gallery |
| 6 | Visit **My Gallery** to review all saved tracings |

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
      <td><img src="https://github.com/user-attachments/assets/8caf5539-c233-4cc0-a203-36226d033474" width="48" style="border-radius:50%" /></td>
      <td><a href="https://github.com/feiryrej">feiryrej</a></td>
      <td><strong>Developer & Researcher</strong>: Full development of Katracer, including UI/UX design, canvas drawing engine, kana dataset curation, JLPT vocabulary integration, gallery system, theme and audio features, and technical report writing.</td>
    </tr>
  </tbody>
</table>

---

## References

Japan Foundation. (2023). *Japanese-Language Proficiency Test (JLPT): About the JLPT*. https://www.jlpt.jp/e/about/levelsummary.html

Mdn Web Docs. (2024). *Canvas API*. Mozilla. https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API

Nielsen, J. (1994). *Usability engineering*. Morgan Kaufmann.

Norman, D. A. (2013). *The design of everyday things* (Revised ed.). Basic Books.

[[Back to top](#かなトレース--katracer)]
