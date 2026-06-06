# StressLess Student AI 🧠💙

> **AI-powered Mental Wellness Companion for Indian Exam Students**

A production-ready platform helping students preparing for **NEET, JEE, CUET, CAT, GATE, UPSC**, and board exams manage stress, track mood, and build emotional resilience — powered by **Google Gemini 1.5 Flash**.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-GitHub_Pages-brightgreen?style=for-the-badge)](https://priyanshisahu058.github.io/stressless-student-ai)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)
[![Gemini AI](https://img.shields.io/badge/Powered_by-Gemini_1.5_Flash-orange?style=for-the-badge)](https://aistudio.google.com)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG_AA-success?style=for-the-badge)](docs/ACCESSIBILITY.md)

---

## 🎯 Problem Statement

Students preparing for India's most competitive exams face a mental health crisis that rarely gets addressed:

| Challenge | Impact |
|:--|:--|
| Chronic stress from syllabus pressure | Burnout, sleep disorders |
| Anxiety about mock scores & results | Performance anxiety loops |
| Family & peer expectations | Self-doubt, isolation |
| 10–14 hour study days | Physical and emotional exhaustion |
| Fear of failure | Depression risk, dropout |

**StressLess Student AI** provides an accessible, privacy-first, AI-powered companion that helps students track, understand, and manage their mental wellness — available 24/7, right in the browser.

---

## ✨ Features

| Feature | Description |
|:--|:--|
| 🤖 **AI Wellness Coach** | Real-time chat with Gemini 1.5 Flash — empathetic, exam-aware support |
| 😊 **Daily Mood Tracker** | 6-state emoji logging with notes and 10-entry history |
| ⚡ **Stress Trigger Analysis** | 12 triggers + AI-powered coping strategies |
| ✏️ **Reflection Journal** | 3 daily prompts, real streak tracking, 365-entry history |
| 💚 **Wellness Score Engine** | 0–100 weighted score with personalized improvement tips |
| 📅 **Study Wellness Planner** | AI-generated 7-day plan per exam type, downloadable |
| 🌊 **Emergency Calm Mode** | 4-7-8 breathing + 5-4-3-2-1 grounding + affirmations |
| 📊 **Progress Dashboard** | Real Chart.js visualizations with weekly AI summary |
| 🚨 **Crisis Detector** | 30+ pattern matching, focus-trapped modal, clickable helplines |

---

## 🏗️ Architecture

```
stressless-student-ai/
├── index.html              # SPA shell — semantic HTML5, ARIA-complete
├── styles.css              # Design system — glassmorphism, 1400+ lines
├── app.js                  # Orchestrator — navigation, chat, events
├── config.js               # 🔒 API key (gitignored — never committed)
├── sw.js                   # Service Worker — PWA offline support
├── .gitignore              # Protects secrets
├── docs/
│   ├── deployment-guide.md
│   ├── TESTING.md
│   └── ACCESSIBILITY.md
└── js/
    ├── storage.js          # localStorage abstraction with try/catch
    ├── utils.js            # XSS sanitization, toasts, formatters
    ├── gemini.js           # Real Gemini 1.5 Flash API integration
    ├── crisisDetector.js   # 30+ crisis patterns, focus trap, cooldown
    ├── moodTracker.js      # Mood logging, aria-pressed, history
    ├── stressTriggers.js   # Chip selection, AI analysis, error handling
    ├── journal.js          # Real streak calc, validation, history
    ├── wellnessScore.js    # Weighted score, personalized tips, aria
    ├── planner.js          # Validated input, plan persistence, download
    ├── calmMode.js         # Breathing, grounding, focus trap
    └── dashboard.js        # Chart.js charts, real data, weekly AI summary
```

**Pattern:** IIFE modules loaded via `<script>` tags in dependency order. No build step required — works on GitHub Pages as-is.

**Data flow:** All user data stored in `localStorage` under the `sls_` namespace. No server-side data storage. API calls go directly to Gemini's REST API.

---

## 🔐 Security

| Measure | Implementation |
|:--|:--|
| API Key Protection | `config.js` in `.gitignore` — never committed |
| XSS Prevention | `Utils.escapeHtml()` on all user input before display |
| Input Validation | Length limits, type checks in every module |
| Content Sanitization | `Utils.sanitize()` for HTML contexts |
| Safe API Calls | Try/catch around all Gemini calls, fallback responses |
| Gemini Safety Settings | `BLOCK_MEDIUM_AND_ABOVE` for harassment/hate speech |
| No Data Exfiltration | All data stays in browser localStorage |
| Rate Limiting | Message length cap (2000 chars), crisis modal cooldown |

---

## ♿ Accessibility — WCAG AA

- ✅ Semantic HTML5 (`<main>`, `<nav>`, `<aside>`, `<section>`, `<article>`)
- ✅ Skip-to-content link
- ✅ Full ARIA: `role`, `aria-label`, `aria-live`, `aria-pressed`, `aria-modal`, `aria-current`
- ✅ Focus traps in all modals (crisis, calm mode)
- ✅ Escape-to-close all overlays with focus return
- ✅ `aria-pressed` dynamically toggled on mood/trigger buttons
- ✅ `aria-valuenow` updated on range sliders
- ✅ Visible `:focus-visible` rings on all interactive elements
- ✅ `prefers-reduced-motion` support
- ✅ `prefers-contrast: high` support
- ✅ Minimum 4.5:1 contrast for body text

See [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) for full details.

---

## 🚀 Quick Start

### 1. Get a Gemini API Key (free)
Visit [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey) → Create API Key

### 2. Clone & Configure
```bash
git clone https://github.com/Priyanshisahu058/stressless-student-ai.git
cd stressless-student-ai
```

Open `config.js` and replace the placeholder:
```js
const GEMINI_API_KEY = 'AIza...your-actual-key...';
```

### 3. Run Locally
```bash
# Option A — Python (built-in)
python -m http.server 8000

# Option B — Node.js
npx serve .
```

Open **http://localhost:8000**

> ⚠️ Must serve via HTTP — not `file://` — for Service Worker and API to work.

---

## 🌐 Deploy to GitHub Pages

```bash
# config.js is gitignored — safe to push
git add .
git commit -m "Deploy StressLess Student AI"
git push origin main
```

Then: **GitHub repo → Settings → Pages → Source: main / root**

See [docs/deployment-guide.md](docs/deployment-guide.md) for full instructions.

---

## 🧪 Testing

See [docs/TESTING.md](docs/TESTING.md) for:
- Manual feature test cases (all 9 modules)
- Accessibility checklist
- Mobile/responsive testing
- Edge cases and offline testing

---

## 📞 Crisis Helplines (India)

| Helpline | Number | Hours |
|:--|:--|:--|
| **iCall** (TISS) | [9152987821](tel:9152987821) | Mon–Sat, 8AM–10PM |
| **Vandrevala Foundation** | [1860-2662-345](tel:18002662345) | 24/7 |
| **NIMHANS** | [080-46110007](tel:08046110007) | Office hours |

---

## 👩‍💻 Author

**Priyanshi Sahu** — [@Priyanshisahu058](https://github.com/Priyanshisahu058)

---

## 📄 License

MIT License — see [LICENSE](LICENSE).

---

*Because your mental health matters as much as your rank.* 💙
