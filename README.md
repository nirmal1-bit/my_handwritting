# ✍️ Assignment Maker

A beautiful, browser-based handwriting assignment generator. Paste your text, tweak the settings, and download a realistic handwritten PDF — no server required.

![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow) ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

## Features

- **Realistic Handwriting** — Renders text using a custom handwriting font on lined paper
- **Live Preview** — See your pages before downloading
- **PDF Export** — Download multi-page A4 PDFs via html2pdf.js
- **Rich Controls** — Fine-tune every aspect of the output:
  - Typography: font size, letter/word spacing, ink color & opacity
  - Layout: line spacing, top margin, text tilt/slant
  - Paper: background color, texture (grain/parchment/clean), brightness, contrast, border radius
  - Lines & Margins: toggle & color-pick margin lines and ruled lines
  - Header: date/page box, date only, or none — plus an optional title
- **Presets** — One-click themes: Notebook, Exam Paper, Clean Sheet, Vintage
- **Modern UI** — Glass-morphism dark theme, collapsible sidebar, iOS-style toggles, toast notifications
- **Responsive** — Works on desktop, tablet, and mobile

## Usage

1. Open `index.html` in any modern browser (no build step needed).
2. Paste or type your assignment text in the sidebar textarea.
3. Adjust settings or pick a preset.
4. Click **Generate** to render the preview.
5. Click **Download PDF** to save as a multi-page A4 PDF.

## Project Structure

```
├── index.html              Main entry point
├── assets/
│   └── fonts/
│       └── MyHandwriting.ttf   Custom handwriting font
├── css/
│   ├── style.css           Global styles, page styles, toast, loading
│   ├── controls.css        Sidebar & control panel styles
│   ├── page.css            Additional page-level styles
│   └── responsive.css      Mobile & tablet breakpoints
├── js/
│   ├── app.js              App initialization
│   ├── generator.js        Page generation & rendering logic
│   ├── pdf.js              PDF download via html2pdf.js
│   ├── controls.js         Control panel logic & preset system
│   └── utils.js            Text measurement, word wrap, helpers
└── README.md
```

## Tech Stack

- **Vanilla HTML / CSS / JS** — no frameworks or build tools
- **html2pdf.js** (CDN) — client-side PDF generation

## License

MIT — feel free to use, modify, and share.
# my_handwritting
