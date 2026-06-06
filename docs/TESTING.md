# Testing Documentation — StressLess Student AI

## How to Run Tests

This is a static web app with no automated test suite. All testing is manual.

**Setup:**
```bash
python -m http.server 8000
# Open http://localhost:8000
```

---

## 1. AI Wellness Coach

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 1.1 | Send a message | Type in chat, press Enter or Send | AI response appears with typing indicator first |
| 1.2 | Quick prompts | Click any quick prompt button | Prompt populates and sends automatically |
| 1.3 | Without API key | Leave config.js as placeholder | API key banner appears; fallback response shown |
| 1.4 | With valid API key | Set real key in config.js | Real Gemini response returned |
| 1.5 | Long message | Type 2001+ characters | Toast warns "Message too long" |
| 1.6 | Clear chat | Click clear chat button | Confirmation dialog → chat cleared |
| 1.7 | Chat persists | Send messages, reload page | Previous chat history loads |
| 1.8 | Enter key sends | Press Enter (not Shift+Enter) | Message sends |
| 1.9 | Shift+Enter newline | Press Shift+Enter | New line added, not sent |

---

## 2. Daily Mood Tracker

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 2.1 | Log mood | Click emoji, optionally add note, click Log | Toast confirms; entry appears in history |
| 2.2 | aria-pressed | Click mood button | `aria-pressed="true"` on selected, `false` on others |
| 2.3 | Note section toggle | Select mood | Note section slides into view |
| 2.4 | Header badge updates | Log mood | Header mood badge shows new emoji + label |
| 2.5 | No mood selected | Click Log without selecting | Toast warning; focus moved to first mood button |
| 2.6 | Note length limit | Type 501+ characters | Input capped at 500 |
| 2.7 | History shows 10 | Log 11+ moods | Only latest 10 shown |
| 2.8 | History persists | Log mood, reload | History survives page reload |

---

## 3. Stress Trigger Analysis

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 3.1 | Select triggers | Click chips | Chips highlight; `aria-pressed="true"` set |
| 3.2 | Deselect trigger | Click selected chip again | Chip unselects; `aria-pressed="false"` |
| 3.3 | No trigger selected | Click Analyze without selection | Analyze button disabled |
| 3.4 | Analyze with triggers | Select 2+, click Analyze | Loading indicator → AI response card |
| 3.5 | Button re-enables after | Wait for analysis to complete | Button becomes clickable again |
| 3.6 | Error recovery | Disconnect internet, analyze | Error card shown; button re-enabled |
| 3.7 | History logged | Analyze triggers | Entry appears in trigger history below |

---

## 4. Reflection Journal

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 4.1 | Save empty entry | Click Save with no text | Toast warning; focus on first textarea |
| 4.2 | Save partial entry | Answer 1 of 3 prompts | Entry saved with 1 answered |
| 4.3 | Char counter updates | Type in textarea | Counter shows "X / 1000" |
| 4.4 | Streak: first day | Save entry day 1 | "🔥 1-day streak" displayed |
| 4.5 | Streak: consecutive | Save entry on 2 consecutive days | Streak increments correctly |
| 4.6 | Streak: broken | Skip a day | Streak resets to 0 |
| 4.7 | History accordions | Save entry, scroll down | Entry appears as collapsible `<details>` |
| 4.8 | History expands | Click on journal entry | Answers visible; click again collapses |
| 4.9 | Form clears after save | Save entry | All textareas empty; counters reset to 0 |

---

## 5. Wellness Score Engine

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 5.1 | Score calculated | Move all sliders, click Log | Score 0–100 displayed with colored level |
| 5.2 | aria-valuenow | Move slider | `aria-valuenow` attribute updates in DOM |
| 5.3 | Slider display | Move sleep slider to 8 | "8h" label updates in real time |
| 5.4 | Personalized tips | Log low sleep (4h) | Sleep-specific tip appears in suggestions |
| 5.5 | Breakdown bars | Log wellness | 5 colored progress bars shown with percentages |
| 5.6 | History shown | Log 2+ times | History items appear below form |
| 5.7 | Dashboard refreshes | Log wellness | Dashboard charts update automatically |

---

## 6. Study Wellness Planner

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 6.1 | No exam selected | Click Generate without exam | Toast warning; focus on select element |
| 6.2 | Generate plan | Select JEE, fill fields, Generate | Loading → AI plan card with Download button |
| 6.3 | Download plan | Click Download button | `.txt` file downloads |
| 6.4 | Plan persists | Generate plan, reload | Previously generated plan reloads |
| 6.5 | Button re-enables | Wait for plan generation | Button clickable again after completion |
| 6.6 | Stress slider label | Move stress slider | "X/10" label updates |

---

## 7. Emergency Calm Mode

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 7.1 | Opens correctly | Click Calm Mode button | Full-screen overlay appears; focus on close button |
| 7.2 | Breathing animation | Open calm mode | Circle scales; phase label cycles Inhale→Hold→Exhale |
| 7.3 | Timer counts down | Watch breathing timer | Counts down from 4/7/8 correctly |
| 7.4 | Affirmation rotates | Wait 6 seconds | New affirmation fades in |
| 7.5 | Grounding exercise | Open calm mode → see grounding card | "5 things you SEE" shown with Next button |
| 7.6 | Grounding steps | Click Next through all 5 | Progress dots fill; "Well Done" on step 5 |
| 7.7 | Grounding restart | Complete all steps, click Restart | Resets to step 1 |
| 7.8 | Focus trap | Tab through overlay | Focus stays within overlay |
| 7.9 | Escape closes | Press Escape | Overlay closes; focus returns to trigger |
| 7.10 | Guard re-open | Click Open twice rapidly | Only one overlay (no interval stacking) |

---

## 8. Progress Dashboard

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 8.1 | Stat cards show data | Log moods + wellness, go to Dashboard | Cards show real counts |
| 8.2 | Mood chart real data | Log 3 different moods | Line chart shows varying scores (not flat 3) |
| 8.3 | Wellness chart | Log wellness scores | Bar chart shows color-coded bars |
| 8.4 | No chart duplication | Navigate away and back 3x | Charts render once, no overlap |
| 8.5 | Weekly summary (no key) | Without API key | Stats grid shown with tip to add key |
| 8.6 | Weekly summary (with key) | With API key configured | AI-generated weekly summary shown |
| 8.7 | Dashboard refresh | Log mood, then open Dashboard | Charts updated with new data |

---

## 9. Crisis Detection

| # | Test Case | Steps | Expected Result |
|---|:--|:--|:--|
| 9.1 | Crisis phrase | Type "I want to die" in chat | Crisis modal appears with helplines |
| 9.2 | High stress phrase | Type "I'm having a panic attack, complete failure" | Modal appears with calming message |
| 9.3 | Clickable helplines | See crisis modal | Phone numbers are clickable tel: links |
| 9.4 | Focus trap in modal | Tab through crisis modal | Focus stays within modal |
| 9.5 | Escape closes modal | Press Escape | Modal closes; focus returns to chat |
| 9.6 | Cooldown | Trigger twice within 1 minute | Second trigger does NOT show modal again |
| 9.7 | Open Calm Mode | Click "Open Calm Mode" in crisis modal | Crisis modal closes; Calm Mode opens |
| 9.8 | Normal message | Type "I'm stressed about JEE" | No crisis modal; normal AI response |

---

## 10. Accessibility Testing

| # | Check | Tool | Target |
|---|:--|:--|:--|
| 10.1 | Lighthouse score | Chrome DevTools → Lighthouse | 90+ |
| 10.2 | No axe violations | axe DevTools extension | 0 critical violations |
| 10.3 | Keyboard only | Unplug mouse, navigate app | All features usable |
| 10.4 | Skip link works | Tab from browser bar | "Skip to main content" appears, Enter skips nav |
| 10.5 | Modal focus trap | Open crisis/calm modal, Tab | Focus stays inside |
| 10.6 | Escape closes overlays | Press Escape | Calm/crisis closes |
| 10.7 | aria-pressed toggles | Select/deselect mood + trigger | DOM attribute updates confirmed |
| 10.8 | Live region announcements | NVDA/VoiceOver + send chat message | Response announced |
| 10.9 | Reduced motion | Enable in OS → open calm mode | Breathing animation paused |
| 10.10 | High contrast mode | Enable in OS | Borders and text remain visible |

---

## 11. Mobile / Responsive Testing

| Viewport | Test | Expected |
|:--|:--|:--|
| 375px (iPhone SE) | All sections | Bottom nav visible, no horizontal scroll |
| 390px (iPhone 14) | Chat interface | Chat fills available height |
| 768px (iPad) | Layout | Sidebar hidden; mobile nav shown |
| 1024px | Dashboard | Charts in single column |
| 1280px+ | Full layout | Sidebar visible; full two-column where applicable |

---

## 12. Offline / PWA Testing

| # | Test | Expected |
|---|:--|:--|
| 12.1 | SW registers | Open DevTools → Application → Service Workers | `stressless-v2` registered |
| 12.2 | App loads offline | Go offline in DevTools → reload | App loads from cache |
| 12.3 | API fails gracefully | Go offline → send chat message | Fallback response shown |
| 12.4 | localStorage persists | Log data, close browser, reopen | All data still present |

---

## 13. Security Testing

| # | Check | Expected |
|---|:--|:--|
| 13.1 | config.js not in repo | `git log -- config.js` | No commits containing the file |
| 13.2 | XSS in journal | Enter `<script>alert(1)</script>` in journal | Escaped, not executed |
| 13.3 | XSS in chat | Enter `<img src=x onerror=alert(1)>` | Escaped, not executed |
| 13.4 | Input length cap | Type 2001 chars in chat | Capped at 2000 with toast warning |
| 13.5 | API key in source | Search GitHub repo for key | No API key found in any committed file |
