# StressLess Student AI 🧠💙

> **Your AI-powered Mental Wellness Companion for Exam Students**

A production-ready, hackathon-quality platform helping students preparing for **NEET, JEE, CUET, CAT, GATE, UPSC**, and board examinations manage stress, track mood, and build emotional resilience — powered by Google Gemini AI.

[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-brightgreen)](https://priyanshisahu058.github.io/stressless-student-ai)
[![License](https://img.shields.io/badge/License-MIT-blue)](#)
[![Gemini AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-orange)](#)

---

## 🌟 Live Demo

**[https://priyanshisahu058.github.io/stressless-student-ai](https://priyanshisahu058.github.io/stressless-student-ai)**

---

## 📸 Screenshots

| AI Wellness Coach | Mood Tracker | Calm Mode |
|:-:|:-:|:-:|
| ![Coach](assets/screenshots/coach.png) | ![Mood](assets/screenshots/mood.png) | ![Calm](assets/screenshots/calm.png) |

| Stress Triggers | Dashboard | Wellness Planner |
|:-:|:-:|:-:|
| ![Triggers](assets/screenshots/triggers.png) | ![Dashboard](assets/screenshots/dashboard.png) | ![Planner](assets/screenshots/planner.png) |

---

## 🎯 Problem Statement

Students preparing for competitive examinations face:
- **Chronic stress** from syllabus pressure and time constraints
- **Anxiety** about performance and results
- **Burnout** from prolonged high-intensity study
- **Emotional isolation** and lack of support
- **Fear of failure** and family expectations

**StressLess Student AI** addresses all these with an accessible, AI-powered wellness companion.

---

## ✨ Features

### 1. 🤖 AI Wellness Coach (Gemini)
- Real-time emotional support chat
- Context-aware responses (knows your exam, mood, and triggers)
- Quick prompts for common exam situations
- Crisis detection and intervention
- Fallback responses when offline

### 2. 😊 Daily Mood Tracker
Track 6 emotional states: Happy, Neutral, Sad, Stressed, Anxious, Burned Out  
- Optional mood notes
- 7-day history view
- Timestamps and patterns

### 3. ⚡ Stress Trigger Analysis
- 12 predefined triggers (exam pressure, family expectations, etc.)
- Custom trigger input
- AI-powered coping strategy analysis per trigger

### 4. ✏️ Reflection Journal
- 3 daily structured prompts
- Streak tracking (🔥 consecutive days)
- Past entries with accordion view
- Mood correlation per entry

### 5. 💚 Wellness Score Engine
- Weighted 0–100 score (mood + sleep + water + study + stress)
- Personalized improvement suggestions
- 7-day history
- Color-coded wellness levels

### 6. 📅 Study Wellness Planner
- Exam-specific (JEE, NEET, CUET, CAT, GATE, UPSC, Boards)
- AI-generated 7-day personalized plan
- Pomodoro study blocks, break schedules, sleep tips
- Download plan as text file

### 7. 🌊 Emergency Calm Mode
- **4-7-8 Breathing** animation (inhale 4s, hold 7s, exhale 8s)
- **5-4-3-2-1 Grounding** exercise (interactive, step-by-step)
- **Rotating positive affirmations** (15 curated affirmations)
- Crisis helpline numbers prominently displayed

### 8. 📊 Progress Dashboard
- Mood trend line chart (Chart.js, 7-day)
- Wellness score bar chart (color-coded)
- Stat cards: streak, mood count, avg score, days tracked
- AI weekly summary with insights

### 9. 🚨 AI Exam Crisis Detector
- Scans chat and journal for crisis keywords
- Two-level detection: **crisis** (severe) and **high_stress**
- Intervention modal with helplines
- Auto-triggers Calm Mode
- Graceful, compassionate responses

---

## 🛠️ Tech Stack

| Technology | Purpose |
|:--|:--|
| HTML5 | Semantic SPA structure |
| Vanilla CSS | Premium glassmorphism design system |
| Vanilla JavaScript | Modular ES5+ architecture |
| Google Gemini API | AI wellness coaching, analysis, planning |
| Chart.js 4.x | Analytics charts |
| localStorage | Persistent data storage |
| GitHub Pages | Static hosting |

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- A Google Gemini API key ([Get one free](https://aistudio.google.com/app/apikey))

### Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/Priyanshisahu058/stressless-student-ai.git
cd stressless-student-ai

# 2. Set up your API key
# Copy config.js template and add your key
# Open config.js in a text editor and replace YOUR_GEMINI_API_KEY_HERE

# 3. Serve locally (any of these)
npx serve .
# OR
python -m http.server 8000
# OR use VS Code Live Server extension

# 4. Open in browser
# http://localhost:8000 (or the port shown)
```

> ⚠️ **IMPORTANT**: `config.js` is in `.gitignore`. **Never commit your API key.**

---

## 📁 Project Structure

```
stressless-student-ai/
├── index.html              # Main SPA shell (all sections)
├── styles.css              # Complete design system
├── app.js                  # Main orchestrator + SPA router
├── config.js               # 🔒 API key (GITIGNORED - not committed)
├── .gitignore              # Excludes config.js and secrets
├── README.md
├── assets/
│   └── screenshots/        # App screenshots
├── docs/
│   └── deployment-guide.md # Deployment instructions
└── js/
    ├── gemini.js           # Google Gemini API service
    ├── storage.js          # LocalStorage abstraction
    ├── utils.js            # Shared utilities + toast
    ├── moodTracker.js      # Mood tracking feature
    ├── stressTriggers.js   # Stress trigger analysis
    ├── journal.js          # Reflection journal
    ├── wellnessScore.js    # Wellness score engine
    ├── planner.js          # Study wellness planner
    ├── calmMode.js         # Emergency calm mode
    ├── dashboard.js        # Progress dashboard + charts
    └── crisisDetector.js   # AI crisis detection
```

---

## 🔐 Security

- **API Key**: Stored only in `config.js` (gitignored). Never exposed in commits, logs, or public files.
- **Input Sanitization**: All user inputs are sanitized via `textContent` before display (XSS prevention).
- **Form Validation**: All forms validated before submission.
- **Data Privacy**: All data stored locally in `localStorage`. No server-side storage.
- **Safe API Calls**: Error boundaries around all Gemini calls with fallback responses.
- **Content Safety**: Gemini API configured with appropriate safety settings.

---

## ♿ Accessibility

- **Semantic HTML**: Proper `<main>`, `<nav>`, `<aside>`, `<section>`, `<article>` elements
- **ARIA Labels**: All interactive elements have descriptive `aria-label` attributes
- **ARIA Live Regions**: Dynamic content updates announced to screen readers
- **Keyboard Navigation**: Full keyboard support + focus trapping in modals
- **Skip Links**: "Skip to main content" link for screen readers
- **Color Contrast**: Minimum 4.5:1 ratio maintained
- **Focus Indicators**: Visible `:focus-visible` rings on all interactive elements
- **Reduced Motion**: Respects `prefers-reduced-motion` media query
- **High Contrast**: Adapts to `prefers-contrast: high`
- **Mobile**: Touch targets ≥ 44×44px, responsive to all screen sizes

---

## 🧪 Testing Checklists

### Feature Testing
- [ ] AI Coach: Send messages and receive responses
- [ ] AI Coach: Verify crisis detection triggers modal
- [ ] AI Coach: Test quick prompt buttons
- [ ] Mood Tracker: Log all 6 mood types
- [ ] Mood Tracker: Verify history updates
- [ ] Stress Triggers: Select multiple triggers + analyze
- [ ] Stress Triggers: Custom trigger input
- [ ] Journal: Write all 3 prompts and save
- [ ] Journal: Verify streak increments daily
- [ ] Wellness Score: Log with all fields, verify score calculates
- [ ] Wellness Score: Check suggestions are relevant
- [ ] Planner: Select exam, generate AI plan
- [ ] Planner: Download plan as text file
- [ ] Dashboard: Verify charts render with data
- [ ] Dashboard: Check stat cards update
- [ ] Calm Mode: 4-7-8 breathing animation runs
- [ ] Calm Mode: 5-4-3-2-1 grounding all steps complete
- [ ] Calm Mode: Affirmations rotate
- [ ] Crisis Modal: Trigger with crisis keywords in chat

### Accessibility Testing
- [ ] Tab through all sections without mouse
- [ ] Screen reader announces live regions
- [ ] All buttons have descriptive labels
- [ ] Crisis modal focus is trapped
- [ ] Calm mode focus is trapped
- [ ] Skip link works
- [ ] Color contrast passes WCAG AA

### Mobile Responsiveness Testing
- [ ] 375px (iPhone SE): Bottom nav visible, all features work
- [ ] 768px (Tablet): Layout adjusts
- [ ] 1024px: Charts render in single column
- [ ] 1280px+: Full sidebar layout
- [ ] Touch targets are easily tappable
- [ ] No horizontal scrolling

### Gemini Integration Testing
- [ ] With valid API key: AI responds to coach messages
- [ ] With valid API key: Trigger analysis returns AI response
- [ ] With valid API key: Planner generates AI plan
- [ ] With valid API key: Dashboard summary loads
- [ ] Without API key: Fallback responses display
- [ ] Without API key: Banner prompts user to set key
- [ ] Network error: Graceful error message shown
- [ ] Crisis message: Gemini provides appropriate crisis response

---

## 🌐 Deployment

See [deployment-guide.md](docs/deployment-guide.md) for full instructions.

**Quick Deploy to GitHub Pages:**
```bash
# Ensure config.js is in .gitignore (it is by default)
git add .
git commit -m "Deploy StressLess Student AI"
git push origin main

# Enable GitHub Pages: Settings > Pages > Source: main branch / root
```

> Note: Users of the deployed app must set their own Gemini API key locally. The app works without one (using fallback responses).

---

## 📞 Mental Health Resources (India)

| Helpline | Number | Hours |
|:--|:--|:--|
| **iCall** (TISS) | 9152987821 | Mon–Sat, 8AM–10PM |
| **Vandrevala Foundation** | 1860-2662-345 | 24/7 |
| **NIMHANS** | 080-46110007 | Office hours |
| **iCall WhatsApp** | 9152987821 | Available |

---

## 👩‍💻 Author

**Priyanshi Sahu**  
GitHub: [@Priyanshisahu058](https://github.com/Priyanshisahu058)

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

*StressLess Student AI — Because your mental health matters as much as your rank.* 💙
