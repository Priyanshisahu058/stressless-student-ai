# Testing Documentation — StressLess Student AI

> Comprehensive manual and automated testing guide for all features, browsers, devices, and security.

---

## Table of Contents
1. [How to Run Tests](#how-to-run-tests)
2. [Mood Tracker Tests](#1-mood-tracker)
3. [AI Wellness Coach Tests](#2-ai-wellness-coach)
4. [Stress Trigger Analysis Tests](#3-stress-trigger-analysis)
5. [Reflection Journal Tests](#4-reflection-journal)
6. [Wellness Score Engine Tests](#5-wellness-score-engine)
7. [Study Wellness Planner Tests](#6-study-wellness-planner)
8. [Emergency Calm Mode Tests](#7-emergency-calm-mode)
9. [Dashboard Tests](#8-progress-dashboard)
10. [Crisis Detection Tests](#9-crisis-detection)
11. [Browser Compatibility](#10-browser-compatibility-testing)
12. [Responsive / Device Testing](#11-responsive--device-testing)
13. [Accessibility Testing](#12-accessibility-testing)
14. [Security Testing](#13-security-testing)
15. [Offline / PWA Testing](#14-offline--pwa-testing)
16. [Test Results Log](#15-test-results-log)

---

## How to Run Tests

### Setup
```bash
# Clone repository
git clone https://github.com/Priyanshisahu058/stressless-student-ai.git
cd stressless-student-ai

# Configure API key (optional — app works without it)
# Open config.js and replace placeholder with your Gemini key

# Start local server (required — file:// won't work)
python -m http.server 8000
# OR
npx serve .
```

Open **http://localhost:8000** in your browser.

### Optional Tools
| Tool | Purpose | Install |
|:--|:--|:--|
| axe DevTools | Automated accessibility scan | Chrome extension |
| Lighthouse | Performance + a11y audit | Chrome DevTools → Lighthouse |
| NVDA | Screen reader testing (Windows) | [nvaccess.org](https://www.nvaccess.org) |
| VoiceOver | Screen reader testing (Mac/iOS) | Built-in (Cmd+F5) |

---

## 1. Mood Tracker

### 1.1 Log Each Mood Option
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Navigate to Mood Tracker tab | Mood grid shows 6 emoji buttons | ☐ |
| 2 | Click **Happy** (😊) | Button highlights; note section appears | ☐ |
| 3 | Click **Focused** (🧠) | Previous selection clears; Focused selected | ☐ |
| 4 | Click **Okay** (🙂) | Okay selected | ☐ |
| 5 | Click **Stressed** (😰) | Stressed selected | ☐ |
| 6 | Click **Anxious** (😟) | Anxious selected | ☐ |
| 7 | Click **Burnout** (😩) | Burnout selected | ☐ |
| 8 | Click **Log Mood** | Toast: "Burnout mood logged!" | ☐ |

### 1.2 Verify History Storage
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Log 3 different moods | History list updates after each log | ☐ |
| 2 | Check history section | Shows latest mood at top | ☐ |
| 3 | Verify timestamp | Each entry shows date and time | ☐ |
| 4 | Add a note, log mood | Note visible in history entry | ☐ |
| 5 | Log 11+ moods | Only latest 10 shown in history | ☐ |

### 1.3 Verify Persistence After Refresh
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Log a mood with note | Entry appears in history | ☐ |
| 2 | Press F5 to refresh | Page reloads | ☐ |
| 3 | Navigate to Mood tab | Previous entries still visible | ☐ |
| 4 | Open DevTools → Application → localStorage | Key `sls_mood_entries` contains entries | ☐ |

### 1.4 Validation Tests
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Click Log Mood without selecting | Toast warning: "Please select a mood first" | ☐ |
| 2 | Select mood; type 501 chars in note | Input capped at 500 characters | ☐ |
| 3 | Select mood; click Log | Header badge updates with new mood emoji | ☐ |

### 1.5 Accessibility
| Check | Expected | Pass/Fail |
|:--|:--|:--|
| `aria-pressed` on selected button | `aria-pressed="true"` in DOM | ☐ |
| `aria-pressed` on unselected | `aria-pressed="false"` in DOM | ☐ |
| Screen reader announces selection | VoiceOver/NVDA reads mood name | ☐ |

---

## 2. AI Wellness Coach

### 2.1 Test Valid Prompts
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | With API key: type "I'm stressed about JEE" | Typing indicator → AI response | ☐ |
| 2 | Click "Exam Stress" quick prompt | Prompt auto-sends; AI responds | ☐ |
| 3 | Click "Burnout Help" quick prompt | AI gives burnout-specific advice | ☐ |
| 4 | Click "Mock Test Fail" quick prompt | AI responds with coping strategies | ☐ |
| 5 | Press Enter to send | Message sends (not new line) | ☐ |
| 6 | Press Shift+Enter | New line added; NOT sent | ☐ |

### 2.2 Test Empty Input Validation
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Click Send with empty input | Nothing happens (no error needed) | ☐ |
| 2 | Type spaces only, click Send | Nothing sent | ☐ |
| 3 | Type 2001 characters | Toast: "Message too long (max 2000)" | ☐ |

### 2.3 Test API Failure Fallback
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Remove/leave config.js as placeholder | Yellow API key banner appears at top | ☐ |
| 2 | Send any message without API key | Fallback response shown (not error crash) | ☐ |
| 3 | Go offline (DevTools → Network → Offline) | Send message → fallback response | ☐ |
| 4 | Invalid API key (wrong format) | Fallback response; no app crash | ☐ |

### 2.4 Chat History
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Send 3 messages, refresh page | Chat history reloads | ☐ |
| 2 | Click Clear Chat | Confirm dialog → chat cleared | ☐ |
| 3 | Last 50 messages kept | 51st message: oldest drops off | ☐ |

---

## 3. Stress Trigger Analysis

### 3.1 Test Multiple Trigger Selection
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Navigate to Triggers tab | 12 trigger chips visible | ☐ |
| 2 | Click "📚 Exam Pressure" | Chip highlights; `aria-pressed="true"` | ☐ |
| 3 | Click "⏰ Time Management" | Second chip highlights | ☐ |
| 4 | Click highlighted chip again | Chip deselects; `aria-pressed="false"` | ☐ |
| 5 | Select 3 triggers, click Analyze | Loading → AI analysis card appears | ☐ |

### 3.2 Test Custom Trigger Input
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Type in custom trigger field | Analyze button becomes enabled | ☐ |
| 2 | Click Analyze with custom trigger | Analysis includes custom trigger | ☐ |

### 3.3 Verify Recommendations Generation
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | With API key: analyze 2 triggers | AI coping strategies returned | ☐ |
| 2 | Without API key: analyze triggers | Fallback response shown | ☐ |
| 3 | Click Analyze with no trigger selected | Button disabled; cannot click | ☐ |
| 4 | Network error during analysis | Error card shown; button re-enables | ☐ |
| 5 | After analysis completes | Trigger history appears below | ☐ |

---

## 4. Reflection Journal

### 4.1 Save Entries
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Navigate to Journal tab | 3 textarea prompts visible | ☐ |
| 2 | Leave all blank; click Save | Warning toast: "answer at least one" | ☐ |
| 3 | Fill 1 prompt; click Save | Success toast; entry in history | ☐ |
| 4 | Fill all 3 prompts; click Save | Entry saved; form clears | ☐ |
| 5 | Type in textarea | Character counter updates "X / 1000" | ☐ |

### 4.2 Verify Streak Calculations
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Save first journal entry today | Streak shows "🔥 1-day streak" | ☐ |
| 2 | Check localStorage | Key `sls_journal_entries` has entry | ☐ |
| 3 | Save entry on day 2 | Streak shows "🔥 2-day streak" | ☐ |
| 4 | Skip a day, save on day 4 | Streak resets to "🔥 1-day streak" | ☐ |
| 5 | No entries yet | Shows "Start your streak today!" | ☐ |

### 4.3 Verify History Retrieval
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Save 3 entries | All appear as `<details>` accordions | ☐ |
| 2 | Click on an entry | Expands to show answers | ☐ |
| 3 | Click again | Collapses | ☐ |
| 4 | Refresh page | All entries still present | ☐ |
| 5 | Max entries shown | 30 entries displayed; older archived | ☐ |

---

## 5. Wellness Score Engine

### 5.1 Test Minimum Values
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Set all sliders to minimum | Sleep=4h, Water=0g, Study=0h, Stress=10/10 | ☐ |
| 2 | No mood logged | Score calculated with 50 default mood | ☐ |
| 3 | Click Log Wellness | Score shown (likely 0–25, "Needs Care") | ☐ |

### 5.2 Test Maximum Values
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Log "Happy" mood first | Mood score = 100 | ☐ |
| 2 | Set all sliders to optimal | Sleep=8h, Water=8g, Study=8h, Stress=1/10 | ☐ |
| 3 | Click Log Wellness | Score = 90–100, "Excellent 🌟" | ☐ |

### 5.3 Verify Score Calculations
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Log with average values | Score 40–70 range | ☐ |
| 2 | Increase sleep from 5→8 | Score increases | ☐ |
| 3 | Decrease stress from 8→3 | Score increases | ☐ |
| 4 | Breakdown bars displayed | 5 colored bars (Mood, Sleep, Hydration, Study, Calm) | ☐ |

### 5.4 Verify Recommendations
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Set sleep=4h, log | Sleep tip appears in suggestions | ☐ |
| 2 | Set stress=9, log | Stress coping tip appears | ☐ |
| 3 | Set water=2, log | Hydration tip appears | ☐ |
| 4 | All optimal values | Generic positive tips shown | ☐ |
| 5 | Log wellness | Dashboard refreshes automatically | ☐ |

---

## 6. Study Wellness Planner

### 6.1 Validate All Inputs
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Click Generate without selecting exam | Toast warning; focus moves to select | ☐ |
| 2 | Select exam; leave all sliders | Defaults applied (30 days, stress 5, etc.) | ☐ |
| 3 | Stress slider: move 1→10 | Label updates "X/10" in real time | ☐ |

### 6.2 Generate Plans
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Select JEE; click Generate | Loading indicator → plan card | ☐ |
| 2 | Plan card appears | Download button visible | ☐ |
| 3 | Click Download | `.txt` file downloads with plan content | ☐ |
| 4 | Refresh page | Previously generated plan reloads | ☐ |
| 5 | Generate fails (offline) | Fallback plan shown; button re-enables | ☐ |

### 6.3 Test Different Exam Types
| Exam | Test | Pass/Fail |
|:--|:--|:--|
| JEE | Generate plan | ☐ |
| NEET | Generate plan | ☐ |
| CUET | Generate plan | ☐ |
| CAT | Generate plan | ☐ |
| GATE | Generate plan | ☐ |
| UPSC | Generate plan | ☐ |
| Board Exams | Generate plan | ☐ |
| Other | Generate plan | ☐ |

---

## 7. Emergency Calm Mode

### 7.1 Verify Breathing Exercise
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Click Calm Mode button | Full-screen overlay opens | ☐ |
| 2 | Watch phase label | Cycles: "Inhale → Hold → Exhale" | ☐ |
| 3 | Watch timer | Counts down 4s, 7s, 8s correctly | ☐ |
| 4 | Watch circle animation | Expands on inhale; contracts on exhale | ☐ |
| 5 | Open twice rapidly | Only ONE overlay (no stacking) | ☐ |

### 7.2 Verify Affirmations
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Open Calm Mode | Affirmation text visible | ☐ |
| 2 | Wait 6 seconds | New affirmation fades in smoothly | ☐ |
| 3 | Rotate through 15 | All 15 affirmations cycle | ☐ |

### 7.3 Grounding Exercise
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Scroll to Grounding section | "5 things you SEE" shown with icon | ☐ |
| 2 | Click Next Step | Advances to "4 things you TOUCH" | ☐ |
| 3 | Progress dots | Dots fill as steps complete | ☐ |
| 4 | Complete all 5 steps | "Well Done! 🌟" completion screen | ☐ |
| 5 | Click Restart | Resets to step 1 | ☐ |

### 7.4 Verify Modal Functionality
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Open Calm Mode | Focus moves to close button | ☐ |
| 2 | Press Tab repeatedly | Focus cycles within overlay only | ☐ |
| 3 | Press Shift+Tab | Focus cycles backwards within overlay | ☐ |
| 4 | Press Escape | Overlay closes; focus returns to trigger | ☐ |
| 5 | Click × close button | Overlay closes | ☐ |
| 6 | Scroll behind overlay | Body scroll locked | ☐ |

---

## 8. Progress Dashboard

### 8.1 Verify Charts Render
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Navigate to Dashboard with no data | Charts empty; stat cards show "–" | ☐ |
| 2 | Log 3 moods; open Dashboard | Mood line chart shows actual scores | ☐ |
| 3 | Log 2 wellness scores; open Dashboard | Wellness bar chart shows colored bars | ☐ |
| 4 | Navigate away and back 3 times | No chart duplication (no overlapping) | ☐ |
| 5 | Check chart colors | Low score = red, mid = purple, high = teal | ☐ |

### 8.2 Verify Analytics Update
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Log a mood from Mood tab | Dashboard mood count increments | ☐ |
| 2 | Log wellness from Wellness tab | Dashboard avg score updates | ☐ |
| 3 | Save journal entry | Dashboard streak card updates | ☐ |
| 4 | Check Days Tracked | Shows unique days with mood logs | ☐ |

### 8.3 Verify Stored Data Loads Correctly
| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Log data; refresh; open Dashboard | All stats preserved | ☐ |
| 2 | With API key: open Dashboard | Weekly AI summary loads | ☐ |
| 3 | Without API key: open Dashboard | Stats grid shown with tip to add key | ☐ |
| 4 | Corrupt localStorage manually | App handles gracefully, no crash | ☐ |

---

## 9. Crisis Detection

| Step | Action | Expected Result | Pass/Fail |
|:--|:--|:--|:--|
| 1 | Type "I want to die" in chat | Crisis modal appears with helplines | ☐ |
| 2 | Type "I'm having a panic attack, complete failure" | High-stress modal appears | ☐ |
| 3 | Crisis modal: Tab through | Focus stays trapped inside modal | ☐ |
| 4 | Press Escape | Modal closes; focus returns to chat | ☐ |
| 5 | Click phone numbers | `tel:` link activates | ☐ |
| 6 | Trigger twice within 60s | Second trigger skips modal (cooldown) | ☐ |
| 7 | "Open Calm Mode" button | Crisis modal closes → Calm Mode opens | ☐ |
| 8 | "I'm okay for now" | Crisis modal closes | ☐ |

---

## 10. Browser Compatibility Testing

Test all core features in each browser:

### Chrome (latest)
| Feature | Result | Notes |
|:--|:--|:--|
| App loads | ☐ Pass / ☐ Fail | |
| Glassmorphism backdrop-filter | ☐ Pass / ☐ Fail | |
| Chart.js renders | ☐ Pass / ☐ Fail | |
| Gemini API calls | ☐ Pass / ☐ Fail | |
| Service Worker registers | ☐ Pass / ☐ Fail | |
| localStorage works | ☐ Pass / ☐ Fail | |
| Calm Mode animation | ☐ Pass / ☐ Fail | |
| Focus traps work | ☐ Pass / ☐ Fail | |

### Microsoft Edge (latest)
| Feature | Result | Notes |
|:--|:--|:--|
| App loads | ☐ Pass / ☐ Fail | |
| Glassmorphism backdrop-filter | ☐ Pass / ☐ Fail | |
| Chart.js renders | ☐ Pass / ☐ Fail | |
| Gemini API calls | ☐ Pass / ☐ Fail | |
| Service Worker registers | ☐ Pass / ☐ Fail | |
| localStorage works | ☐ Pass / ☐ Fail | |
| Calm Mode animation | ☐ Pass / ☐ Fail | |
| Focus traps work | ☐ Pass / ☐ Fail | |

### Mozilla Firefox (latest)
| Feature | Result | Notes |
|:--|:--|:--|
| App loads | ☐ Pass / ☐ Fail | Backdrop-filter may need `backdrop-filter` flag |
| Chart.js renders | ☐ Pass / ☐ Fail | |
| Gemini API calls | ☐ Pass / ☐ Fail | |
| Service Worker registers | ☐ Pass / ☐ Fail | |
| localStorage works | ☐ Pass / ☐ Fail | |
| Scrollbar styling | ☐ Pass / ☐ Fail | Uses scrollbar-width instead of ::-webkit |
| Focus traps work | ☐ Pass / ☐ Fail | |

### Browser Support Matrix
| Feature | Chrome 90+ | Edge 90+ | Firefox 88+ | Safari 14+ |
|:--|:--|:--|:--|:--|
| `backdrop-filter` | ✅ | ✅ | ✅ (with flag pre-v103) | ✅ |
| `color-mix()` | ✅ | ✅ | ✅ v113+ | ✅ v16.4+ |
| CSS Grid | ✅ | ✅ | ✅ | ✅ |
| Service Workers | ✅ | ✅ | ✅ | ✅ |
| Chart.js 4.x | ✅ | ✅ | ✅ | ✅ |
| `localStorage` | ✅ | ✅ | ✅ | ✅ |

---

## 11. Responsive / Device Testing

### Mobile — 375px (iPhone SE)
| Check | Expected | Pass/Fail |
|:--|:--|:--|
| Bottom navigation visible | 7 icons in mobile nav bar | ☐ |
| Sidebar hidden | No sidebar visible | ☐ |
| No horizontal scroll | Page fits 375px wide | ☐ |
| Mood grid | 2-column layout | ☐ |
| Chat interface | Fills height correctly | ☐ |
| Touch targets | Buttons ≥ 44×44px | ☐ |
| Toast messages | Above bottom nav (80px offset) | ☐ |
| Forms | Single column layout | ☐ |
| Calm Mode overlay | Full screen, scrollable | ☐ |

### Tablet — 768px (iPad)
| Check | Expected | Pass/Fail |
|:--|:--|:--|
| Sidebar hidden, mobile nav shown | Correct layout switch | ☐ |
| Stats grid | 2-column | ☐ |
| Forms | Single column | ☐ |
| Charts | Single column stack | ☐ |
| No overflow | No horizontal scroll | ☐ |

### Desktop — 1440px
| Check | Expected | Pass/Fail |
|:--|:--|:--|
| Sidebar visible | 240px left sidebar | ☐ |
| Mobile nav hidden | No bottom bar | ☐ |
| Charts side-by-side | Two-column on wide screens | ☐ |
| Stats grid | 4-column | ☐ |
| Max content width | Content readable, not too wide | ☐ |

### Device-Specific Tests
| Device | Viewport | Expected | Pass/Fail |
|:--|:--|:--|:--|
| iPhone SE | 375×667 | Mobile layout, no scroll | ☐ |
| iPhone 14 | 390×844 | Mobile layout | ☐ |
| Samsung Galaxy S21 | 360×800 | Mobile layout | ☐ |
| iPad | 768×1024 | Tablet layout | ☐ |
| iPad Pro | 1024×1366 | Desktop-like layout | ☐ |
| Laptop | 1280×800 | Full desktop layout | ☐ |
| Desktop | 1440×900 | Full desktop layout | ☐ |

---

## 12. Accessibility Testing

See [ACCESSIBILITY_TESTS.md](ACCESSIBILITY_TESTS.md) for the complete accessibility test suite.

### Quick Checklist
| Check | Tool | Expected | Pass/Fail |
|:--|:--|:--|:--|
| Lighthouse accessibility score | Chrome DevTools | ≥ 90 | ☐ |
| Zero critical axe violations | axe DevTools | 0 critical | ☐ |
| Keyboard-only navigation | No mouse | All features usable | ☐ |
| Skip link works | Tab from address bar | Skip link appears; Enter skips nav | ☐ |
| All modals focus-trapped | Tab key in modal | Focus stays inside | ☐ |
| Escape closes overlays | Escape key | All overlays close | ☐ |
| `aria-pressed` toggles | DOM inspector | Updates on click | ☐ |
| Live regions announced | NVDA/VoiceOver | Dynamic updates read aloud | ☐ |
| Reduced motion | OS setting | Animations paused | ☐ |
| High contrast | OS setting | Borders/text remain visible | ☐ |

---

## 13. Security Testing

### 13.1 Input Sanitization & XSS Prevention
| Test | Input | Expected | Pass/Fail |
|:--|:--|:--|:--|
| XSS in chat | `<script>alert(1)</script>` | Escaped; no alert fires | ☐ |
| XSS in journal | `<img src=x onerror=alert(1)>` | Escaped; no alert fires | ☐ |
| XSS in mood note | `"><script>alert(1)</script>` | Escaped in history display | ☐ |
| HTML in trigger | `<b>bold</b>` | Shown as literal text | ☐ |
| SQL injection pattern | `'; DROP TABLE--` | Treated as plain text | ☐ |

### 13.2 Validation Checks
| Test | Action | Expected | Pass/Fail |
|:--|:--|:--|:--|
| Chat length limit | 2001 character message | Toast: "Message too long" | ☐ |
| Mood note limit | 501 characters | Capped at 500 | ☐ |
| Journal length | 1001 characters | Capped at 1000 per prompt | ☐ |
| Planner: no exam | Generate without selecting | Toast warning; no API call | ☐ |
| Wellness: range clamping | Slider at boundaries | Values clamped to valid range | ☐ |

### 13.3 Safe API Handling
| Test | Condition | Expected | Pass/Fail |
|:--|:--|:--|:--|
| No API key | config.js has placeholder | Banner shown; fallback responses | ☐ |
| Invalid API key | Wrong key format | Fallback response; no crash | ☐ |
| API timeout | Slow network | Loading indicator; fallback on error | ☐ |
| 429 rate limit | Too many requests | Error caught; fallback shown | ☐ |
| Network offline | DevTools offline mode | Fallback response; no crash | ☐ |

### 13.4 API Key Security
| Check | How to Verify | Expected | Pass/Fail |
|:--|:--|:--|:--|
| Key not in repo | `git log -p \| grep GEMINI` | No key found | ☐ |
| config.js gitignored | `git status` after editing config.js | File NOT listed | ☐ |
| Key not in HTML | View page source | No key in source | ☐ |
| Key not in any JS | Search repo files | Only `config.js` (local) | ☐ |

---

## 14. Offline / PWA Testing

| Test | Steps | Expected | Pass/Fail |
|:--|:--|:--|:--|
| Service Worker registers | DevTools → Application → Service Workers | `stressless-v2` active | ☐ |
| App loads offline | Enable offline in DevTools → reload | App loads from cache | ☐ |
| Chat works offline | Send message while offline | Fallback response shown | ☐ |
| Data persists | Log data → close browser → reopen | All data present | ☐ |
| New SW activates | Change `CACHE_VERSION` → reload | New SW takes over | ☐ |

---

## 15. Test Results Log

Use this table to log your test session results:

| Date | Tester | Browser | Device | Sections Tested | Issues Found | Overall |
|:--|:--|:--|:--|:--|:--|:--|
| | | Chrome | Desktop | All | None | ☐ Pass |
| | | Edge | Desktop | All | | |
| | | Firefox | Desktop | All | | |
| | | Chrome | Mobile 375px | All | | |
| | | Safari | iPhone | All | | |

### Known Issues / Limitations
1. **Chart.js canvas** — Not natively accessible to screen readers; stat card numbers provide text alternative
2. **Dark theme only** — No light mode; `prefers-color-scheme: light` not supported
3. **Emoji on Windows 7** — Some emoji may not render; degraded but functional

---

## Test Coverage Summary

| Module | Unit Tests | Integration Tests | Manual Tests | Coverage |
|:--|:--|:--|:--|:--|
| Storage | — | — | ✅ | Manual |
| Utils (sanitization) | — | — | ✅ | Manual |
| Gemini Service | — | — | ✅ | Manual |
| Crisis Detector | — | — | ✅ | Manual |
| Mood Tracker | — | — | ✅ | Manual |
| Stress Triggers | — | — | ✅ | Manual |
| Journal | — | — | ✅ | Manual |
| Wellness Score | — | — | ✅ | Manual |
| Planner | — | — | ✅ | Manual |
| Calm Mode | — | — | ✅ | Manual |
| Dashboard | — | — | ✅ | Manual |
| App (routing) | — | — | ✅ | Manual |

> **Note:** Automated unit tests (Jest/Vitest) and E2E tests (Playwright/Cypress) are recommended future additions. The current static architecture (no build step) makes manual testing the primary method.
