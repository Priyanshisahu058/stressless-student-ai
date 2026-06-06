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

> Full test suite: **[docs/TESTING.md](docs/TESTING.md)** | Accessibility tests: **[docs/ACCESSIBILITY_TESTS.md](docs/ACCESSIBILITY_TESTS.md)**

### Features Tested

| Module | Test Coverage |
|:--|:--|
| 🤖 AI Wellness Coach | Valid prompts, empty input, API failure fallback, chat persistence |
| 😊 Mood Tracker | All 6 moods, history storage, persistence after refresh |
| ⚡ Stress Trigger Analysis | Multi-select, custom input, recommendations, error recovery |
| ✏️ Reflection Journal | Save entries, streak calculation, history retrieval, validation |
| 💚 Wellness Score Engine | Min/max values, score calculation, personalized recommendations |
| 📅 Study Wellness Planner | Input validation, all 8 exam types, plan generation + download |
| 🌊 Emergency Calm Mode | Breathing exercise, affirmations, grounding, modal/focus trap |
| 📊 Progress Dashboard | Charts render, analytics update, stored data loads correctly |
| 🚨 Crisis Detection | Pattern matching, focus trap, cooldown, helpline links |

### Testing Procedure

```bash
# 1. Clone the repository
git clone https://github.com/Priyanshisahu058/stressless-student-ai.git
cd stressless-student-ai

# 2. Start local server (required for Service Worker + API)
python -m http.server 8000

# 3. Open in browser
# http://localhost:8000

# 4. Run Lighthouse audit
# Chrome DevTools → Lighthouse → Accessibility → Analyze page load

# 5. Run axe scan
# Install axe DevTools Chrome extension → Scan ALL of my page
```

### Manual Test Cases

#### Mood Tracker
- [ ] Log each of the 6 mood options (Happy, Focused, Okay, Stressed, Anxious, Burnout)
- [ ] Verify `aria-pressed` toggles on selection
- [ ] Add a note and verify it appears in history
- [ ] Verify history shows latest 10 entries
- [ ] Verify persistence after page refresh (check `sls_mood_entries` in localStorage)
- [ ] Verify header badge updates after logging

#### AI Wellness Coach
- [ ] Test valid prompts with API key configured
- [ ] Test each quick prompt button (Exam Stress, Burnout Help, Mock Test Fail)
- [ ] Test empty input — nothing should send
- [ ] Test 2001+ character message — toast warning expected
- [ ] Test API failure fallback (remove key from config.js — fallback response shown)
- [ ] Test offline mode (DevTools → Network → Offline — fallback response)
- [ ] Verify Enter sends, Shift+Enter adds newline
- [ ] Verify chat history persists after refresh

#### Stress Trigger Analysis
- [ ] Select multiple trigger chips — verify highlight and `aria-pressed`
- [ ] Deselect a chip — verify it unhighlights
- [ ] Analyze button disabled with no selection
- [ ] Test custom trigger input field enables button
- [ ] Verify AI recommendations generated (with API key)
- [ ] Verify fallback shown without API key
- [ ] Test error recovery — button re-enables after failure

#### Reflection Journal
- [ ] Save entry with all 3 prompts answered
- [ ] Save entry with only 1 prompt — succeeds
- [ ] Save with no prompts — warning toast expected
- [ ] Verify character counter updates (X / 1000)
- [ ] Verify 1-day streak after first entry
- [ ] Verify streak increments on consecutive days
- [ ] Verify streak resets after missing a day
- [ ] Verify history entries appear as expandable accordions
- [ ] Verify history persists after refresh

#### Wellness Score Engine
- [ ] Set all sliders to minimum — "Needs Care" score expected
- [ ] Set all sliders to optimal + log Happy mood — "Excellent" score expected
- [ ] Verify breakdown bars render for all 5 categories
- [ ] Verify personalized tip for low sleep (set to 4h)
- [ ] Verify personalized tip for high stress (set to 9/10)
- [ ] Verify `aria-valuenow` updates on slider move
- [ ] Verify Dashboard updates after logging

#### Study Wellness Planner
- [ ] Generate without exam selection — toast warning
- [ ] Generate for JEE — plan card appears
- [ ] Generate for NEET, CAT, UPSC — all work
- [ ] Download button creates `.txt` file
- [ ] Refresh page — previously generated plan reloads
- [ ] Test offline — fallback plan shown, button re-enables

#### Emergency Calm Mode
- [ ] Open overlay — focus moves to close button
- [ ] Breathing timer counts down: 4s → 7s → 8s → repeats
- [ ] Circle animates — expands on inhale, contracts on exhale
- [ ] Affirmation changes every 6 seconds
- [ ] Grounding: "5 things SEE" → Next → "4 things TOUCH" → ... → Well Done
- [ ] Grounding restart button resets to step 1
- [ ] Tab key stays within overlay (focus trap)
- [ ] Escape closes overlay
- [ ] Focus returns to trigger button on close
- [ ] Opening twice does NOT stack intervals

#### Dashboard
- [ ] Navigate with no data — charts empty, stat cards show "–"
- [ ] Log moods — mood line chart shows real scores (not flat)
- [ ] Log wellness — bar chart updates with colors
- [ ] Navigate away and back 3x — NO chart duplication
- [ ] Streak card shows correct streak count
- [ ] Weekly AI summary generates (with API key)

### Browser Testing Results

| Feature | Chrome | Edge | Firefox |
|:--|:--|:--|:--|
| App loads correctly | ✅ | ✅ | ✅ |
| Glassmorphism effects | ✅ | ✅ | ✅ |
| Chart.js renders | ✅ | ✅ | ✅ |
| Gemini API calls | ✅ | ✅ | ✅ |
| Service Worker | ✅ | ✅ | ✅ |
| localStorage | ✅ | ✅ | ✅ |
| Calm Mode animation | ✅ | ✅ | ✅ |
| Focus traps | ✅ | ✅ | ✅ |
| aria-pressed toggles | ✅ | ✅ | ✅ |
| Range slider styling | ✅ | ✅ | ⚠️ (Firefox uses scrollbar-width) |

### Responsive Testing

| Viewport | Device | Layout | Tested |
|:--|:--|:--|:--|
| 375px | iPhone SE / Mobile | Bottom nav, 2-col mood grid, single-col forms | ☐ |
| 390px | iPhone 14 | Bottom nav, full-height chat | ☐ |
| 768px | iPad / Tablet | Mobile nav, single-col charts | ☐ |
| 1024px | iPad Pro | Sidebar appears, 2-col stats | ☐ |
| 1280px | Laptop | Full sidebar, 4-col stats | ☐ |
| 1440px | Desktop | Full layout, side-by-side charts | ☐ |

**Key checks at 375px:**
- [ ] No horizontal scrollbar
- [ ] All buttons ≥ 44×44px touch targets
- [ ] Bottom navigation visible above content
- [ ] Toasts appear above bottom nav (80px offset)
- [ ] Calm Mode overlay fills full screen

### Accessibility Checklist

> Full 97-item test suite: [docs/ACCESSIBILITY_TESTS.md](docs/ACCESSIBILITY_TESTS.md)

**Keyboard Navigation**
- [ ] All interactive elements reachable by Tab
- [ ] Skip link appears on first Tab → Enter skips to main content
- [ ] Escape closes Calm Mode and Crisis Modal
- [ ] Focus trapped inside open modals (Tab cycles within)
- [ ] Focus returns to trigger element on modal close

**Screen Reader**
- [ ] All buttons have descriptive `aria-label`
- [ ] Decorative emoji have `aria-hidden="true"`
- [ ] Chat responses announced via `aria-live="polite"`
- [ ] Toast messages announced
- [ ] Modal roles announced (`role="dialog"`, `aria-modal="true"`)

**ARIA Attributes**
- [ ] `aria-pressed` toggles on mood buttons
- [ ] `aria-pressed` toggles on trigger chips
- [ ] `aria-valuenow` updates on range sliders
- [ ] `aria-current="page"` on active nav button
- [ ] `aria-hidden` on inactive sections

**Visual**
- [ ] `:focus-visible` ring visible on all interactive elements
- [ ] Minimum 4.5:1 contrast on all text
- [ ] No color as sole indicator of state
- [ ] `prefers-reduced-motion` disables all animations
- [ ] `prefers-contrast: high` increases border opacity

**Lighthouse Accessibility Score Target: ≥ 90**

### Security Validation Checklist

**Input Sanitization**
- [ ] `<script>alert(1)</script>` in chat — escaped, not executed
- [ ] `<img src=x onerror=alert(1)>` in journal — escaped
- [ ] `"><script>alert(1)</script>` in mood note — escaped in history
- [ ] All user input passes through `Utils.escapeHtml()` before DOM insertion

**XSS Prevention**
- [ ] `Utils.sanitize()` used for all HTML rendering contexts
- [ ] No `innerHTML` assignment from raw user input
- [ ] Chat AI responses rendered with `Utils.escapeHtml()` + safe formatter

**Validation Checks**
- [ ] Chat message capped at 2000 characters
- [ ] Mood notes capped at 500 characters
- [ ] Journal entries capped at 1000 characters each
- [ ] Planner requires exam selection before API call
- [ ] Trigger analysis requires at least 1 trigger selected
- [ ] Wellness score values clamped to valid ranges

**Safe API Handling**
- [ ] All Gemini API calls wrapped in try/catch
- [ ] Fallback responses returned on any failure
- [ ] Loading buttons re-enabled in `finally` blocks
- [ ] API key never logged to console
- [ ] Gemini safety settings `BLOCK_MEDIUM_AND_ABOVE` configured

**API Key Security**
- [ ] `config.js` in `.gitignore` — confirm with `git status`
- [ ] No key in any committed file — confirm with `git log -p | grep AIza`
- [ ] Key not visible in browser source (only loaded at runtime)
- [ ] Key never sent to any server except `generativelanguage.googleapis.com`

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
