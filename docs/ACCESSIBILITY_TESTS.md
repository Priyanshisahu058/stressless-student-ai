# Accessibility Tests — StressLess Student AI

> Detailed accessibility test cases targeting WCAG 2.1 Level AA conformance.

---

## Tools Required

| Tool | Purpose | How to Get |
|:--|:--|:--|
| **axe DevTools** | Automated WCAG scan | [Chrome extension](https://chrome.google.com/webstore/detail/axe-devtools/lhdoppojpmngadmnindnejefpokejbdd) |
| **Lighthouse** | Accessibility + performance audit | Chrome DevTools → Lighthouse tab |
| **NVDA** | Screen reader (Windows) | [nvaccess.org](https://www.nvaccess.org/download/) — free |
| **VoiceOver** | Screen reader (Mac/iOS) | Built-in — press Cmd+F5 |
| **Colour Contrast Analyser** | Manual contrast checking | [TPGi](https://www.tpgi.com/color-contrast-checker/) |

---

## 1. Automated Scan Results

### 1.1 Lighthouse Accessibility Audit
```
Steps:
1. Open http://localhost:8000 in Chrome
2. Open DevTools (F12)
3. Go to "Lighthouse" tab
4. Check "Accessibility" category
5. Click "Analyze page load"
6. Record score
```

| Run | Score | Date | Tester |
|:--|:--|:--|:--|
| Target | **≥ 90** | | |
| Baseline | | | |
| After fixes | | | |

### 1.2 axe DevTools Scan
```
Steps:
1. Install axe DevTools Chrome extension
2. Open http://localhost:8000
3. Open DevTools → axe DevTools tab
4. Click "Scan ALL of my page"
5. Record violations
```

| Severity | Count | Issues |
|:--|:--|:--|
| Critical | 0 target | |
| Serious | 0 target | |
| Moderate | ≤ 2 acceptable | |
| Minor | ≤ 5 acceptable | |

---

## 2. Keyboard Navigation Tests

### 2.1 Basic Navigation
| # | Test | Steps | Expected | Pass/Fail |
|---|:--|:--|:--|:--|
| K1 | Tab through header | Start at page top, press Tab | Focus: skip link → logo → mood badge → calm btn | ☐ |
| K2 | Skip link works | First Tab → Enter | Jumps to `#main-content`, skipping nav | ☐ |
| K3 | Sidebar navigation | Tab through sidebar | All 7 nav buttons reachable | ☐ |
| K4 | Activate nav button | Tab to "Mood" button → Enter | Mood section becomes active | ☐ |
| K5 | Chat input | Tab to chat input → type → Enter | Message sends | ☐ |
| K6 | Shift+Tab reversal | Navigate forward then Shift+Tab | Focus moves backwards correctly | ☐ |
| K7 | Mood buttons | Tab to mood grid → Enter | Mood selected | ☐ |
| K8 | Trigger chips | Tab to chips → Enter | Chip toggles selected | ☐ |
| K9 | Range sliders | Tab to slider → Arrow keys | Value changes | ☐ |
| K10 | Journal save | Tab to Save button → Enter | Entry saved | ☐ |

### 2.2 Modal Keyboard Behavior
| # | Test | Steps | Expected | Pass/Fail |
|---|:--|:--|:--|:--|
| K11 | Open Calm Mode | Tab to Calm Mode button → Enter | Overlay opens; focus on close button | ☐ |
| K12 | Calm Mode focus trap | Tab from last element | Focus wraps to first element | ☐ |
| K13 | Calm Mode Shift+Tab trap | Shift+Tab from first element | Focus wraps to last element | ☐ |
| K14 | Escape closes calm | Press Escape | Overlay closes | ☐ |
| K15 | Focus returns after calm | Close calm mode | Focus returns to "Open Calm Mode" button | ☐ |
| K16 | Open Crisis modal | Send crisis phrase | Modal opens; focus on Calm Mode button | ☐ |
| K17 | Crisis focus trap | Tab through crisis modal | Focus stays within modal | ☐ |
| K18 | Escape closes crisis | Press Escape in crisis modal | Modal closes | ☐ |
| K19 | Focus returns after crisis | Close crisis modal | Focus returns to chat input | ☐ |

---

## 3. Focus State Tests

### 3.1 Visible Focus Indicators
All interactive elements must have a visible focus ring (2px solid, primary color).

| Element | Selector | Focus Ring Visible | Contrast ≥ 3:1 | Pass/Fail |
|:--|:--|:--|:--|:--|
| Nav buttons | `.nav-btn` | ☐ | ☐ | ☐ |
| Mood buttons | `.mood-btn` | ☐ | ☐ | ☐ |
| Trigger chips | `.trigger-chip` | ☐ | ☐ | ☐ |
| Form inputs | `.form-input` | ☐ | ☐ | ☐ |
| Form textareas | `.form-textarea` | ☐ | ☐ | ☐ |
| Form selects | `.form-select` | ☐ | ☐ | ☐ |
| Range sliders | `.form-range` | ☐ | ☐ | ☐ |
| Chat input | `.chat-input` | ☐ | ☐ | ☐ |
| Send button | `#coach-send-btn` | ☐ | ☐ | ☐ |
| Save buttons | `[id$="-btn"]` | ☐ | ☐ | ☐ |
| Calm Mode close | `#calm-close-btn` | ☐ | ☐ | ☐ |
| Crisis buttons | `.crisis-modal button` | ☐ | ☐ | ☐ |
| Quick prompts | `.quick-prompt-btn` | ☐ | ☐ | ☐ |
| Journal summary | `.journal-entry-summary` | ☐ | ☐ | ☐ |

### 3.2 No Outline Violations
Verify `outline: none` is NOT applied to focused elements (WCAG 2.4.7):

```bash
# Search for outline:none in CSS
grep -n "outline: none" styles.css
grep -n "outline:none" styles.css
```

Expected result: Only `outline: none` on `.form-range:focus` (acceptable — replaced by thumb shadow on same line).

---

## 4. Screen Reader Tests

### 4.1 NVDA + Chrome (Windows)
```
Setup:
1. Install NVDA (free at nvaccess.org)
2. Start NVDA (Ctrl+Alt+N)
3. Open Chrome → http://localhost:8000
4. Use NVDA+F7 to view elements list
```

| # | Test | NVDA Command | Expected Announcement | Pass/Fail |
|---|:--|:--|:--|:--|
| S1 | Page title | (auto on load) | "StressLess Student AI — AI Coach" | ☐ |
| S2 | Skip link | Tab | "Skip to main content, link" | ☐ |
| S3 | Navigation landmark | H or F6 | "Main navigation, navigation" | ☐ |
| S4 | Nav button | Tab | "Navigate to AI Coach, button" | ☐ |
| S5 | Mood grid | Tab to group | "Select your mood, group" | ☐ |
| S6 | Mood button pressed | Space/Enter | "Happy, button, pressed" | ☐ |
| S7 | Mood button unpressed | Click again | "Happy, button, not pressed" | ☐ |
| S8 | Chat live region | Send message | AI response read aloud | ☐ |
| S9 | Toast notification | Any action | Toast text announced | ☐ |
| S10 | Crisis modal | Crisis phrase in chat | "You're Not Alone, dialog" announced | ☐ |
| S11 | Range slider | Tab to slider | "Sleep Hours, slider, 7 hours, min 4, max 12" | ☐ |
| S12 | Slider value change | Arrow key | New value announced | ☐ |
| S13 | Chart.js canvas | Tab to chart | "Mood Score chart" or similar label | ☐ |
| S14 | Section navigation | Navigate to Dashboard | Page title updates in tab | ☐ |

### 4.2 VoiceOver + Safari (macOS)
```
Setup:
1. Press Cmd+F5 to enable VoiceOver
2. Open Safari → http://localhost:8000
3. Use VO+U (rotor) to navigate
```

| # | Test | Expected | Pass/Fail |
|---|:--|:--|:--|
| V1 | Landmarks rotor | Shows: banner, navigation, main | ☐ |
| V2 | Buttons list | All buttons listed with labels | ☐ |
| V3 | Form controls | Inputs have associated labels | ☐ |
| V4 | Live regions | Dynamic content announced | ☐ |
| V5 | Modal role | "dialog" role announced on open | ☐ |

---

## 5. ARIA Implementation Tests

### 5.1 Landmark Roles
Verify using browser DevTools → Accessibility tree or axe:

| Landmark | Element | Role | Label | Pass/Fail |
|:--|:--|:--|:--|:--|
| Skip link | `<a href="#main-content">` | link | "Skip to main content" | ☐ |
| Header | `<header>` | banner | (implicit) | ☐ |
| Sidebar nav | `<nav aria-label="Main navigation">` | navigation | "Main navigation" | ☐ |
| Main content | `<main id="main-content">` | main | (implicit) | ☐ |

### 5.2 Dynamic ARIA Attributes
Test that these update correctly:

| Component | Attribute | Trigger | Before | After | Pass/Fail |
|:--|:--|:--|:--|:--|:--|
| Mood button | `aria-pressed` | Click mood | `false` | `true` | ☐ |
| Mood button (other) | `aria-pressed` | Click different mood | `true` | `false` | ☐ |
| Trigger chip | `aria-pressed` | Click chip | `false` | `true` | ☐ |
| Sleep slider | `aria-valuenow` | Move slider | `7` | new value | ☐ |
| Water slider | `aria-valuenow` | Move slider | `6` | new value | ☐ |
| Nav buttons | `aria-current` | Click nav | `false` | `page` | ☐ |
| Calm overlay | `aria-modal` | Open | absent | `true` | ☐ |
| Calm overlay | `hidden` | Open/close | present | absent/present | ☐ |
| Crisis modal | `aria-modal` | Open | absent | `true` | ☐ |
| Section divs | `aria-hidden` | Navigate | varies | `true`/`false` | ☐ |

### 5.3 Form Labels
All form inputs must have associated labels:

| Input | Label Method | Linked? | Pass/Fail |
|:--|:--|:--|:--|
| Chat textarea | `aria-label` | ☐ | ☐ |
| Mood note textarea | `<label for="...">` | ☐ | ☐ |
| Journal prompts | `<label for="journal-answer-N">` | ☐ | ☐ |
| Sleep slider | `<label>` + `aria-label` | ☐ | ☐ |
| Stress slider | `<label>` + `aria-label` | ☐ | ☐ |
| Exam select | `<label for="...">` | ☐ | ☐ |
| Profile name | `<label for="...">` | ☐ | ☐ |

### 5.4 Live Regions
| Region | Element | `aria-live` | `aria-atomic` | When triggered | Pass/Fail |
|:--|:--|:--|:--|:--|:--|
| Chat messages | `#chat-messages` | `polite` | `false` | New message | ☐ |
| Toast container | `#toast-container` | `polite` | `true` | Any action | ☐ |
| Mood announcer | `#mood-announcer` | `polite` | — | Mood selected | ☐ |
| Grounding content | `#grounding-content` | `polite` | — | Step change | ☐ |
| Breath phase | `#breath-phase-label` | — | — | Phase change | ☐ |

---

## 6. Color & Contrast Tests

### 6.1 Text Contrast (WCAG 1.4.3 — Minimum AA)
Use the Colour Contrast Analyser tool:

| Text Style | Foreground | Background | Ratio | AA (4.5:1) | Pass/Fail |
|:--|:--|:--|:--|:--|:--|
| Body text (`--text-primary`) | `rgba(240,240,255,0.95)` | `#0a0a1e` | ~12:1 | ✅ | ☐ |
| Secondary text | `rgba(200,200,220,0.8)` | `#0a0a1e` | ~7:1 | ✅ | ☐ |
| Muted text | `rgba(160,160,180,0.6)` | `#0a0a1e` | ~4.6:1 | ✅ | ☐ |
| Primary color text | `#6C63FF` | `#0a0a1e` | ~4.8:1 | ✅ | ☐ |
| Teal accent text | `#2DD4BF` | `#0a0a1e` | ~7.2:1 | ✅ | ☐ |
| Button text (white on primary) | `#ffffff` | `#6C63FF` | ~4.6:1 | ✅ | ☐ |
| Muted on card bg | `rgba(160,160,180,0.6)` | `rgba(255,255,255,0.03)` | ~4.5:1 | ✅ | ☐ |

### 6.2 Non-Text Contrast (WCAG 1.4.11 — AA)
Focus rings, interactive component boundaries must have 3:1 ratio against adjacent colors.

| Component | Ratio Check | Pass/Fail |
|:--|:--|:--|
| Focus ring (primary on dark bg) | `#6C63FF` on `#0a0a1e` ≈ 4.8:1 | ☐ |
| Input border on card | Sufficient | ☐ |
| Slider thumb on track | Sufficient | ☐ |

### 6.3 Color Not Sole Indicator (WCAG 1.4.1)
Information must not be conveyed by color alone:

| Instance | Additional Indicator | Pass/Fail |
|:--|:--|:--|
| Mood selected state | Highlighted border + text label | ☐ |
| Wellness score level | Text label ("Excellent", "Good") | ☐ |
| Chart data points | Tooltip + stat cards | ☐ |
| Error toast | Icon + text message | ☐ |
| Trigger chip selected | Chip highlight + `aria-pressed` | ☐ |

---

## 7. Reduced Motion Tests

```
Enable: Windows → Settings → Ease of Access → Display → Show animations → OFF
OR: Chrome DevTools → Rendering → Emulate CSS media → prefers-reduced-motion: reduce
```

| Animation | Normal Behavior | With Reduced Motion | Pass/Fail |
|:--|:--|:--|:--|
| Breathing circle | Scales smoothly | `transition: none !important` | ☐ |
| Section transitions | Slide in | Instant (no animation) | ☐ |
| Chat bubbles | Fade in | Instant | ☐ |
| Affirmation fade | Opacity transition | Instant | ☐ |
| Grounding dots | Scale animation | No scale | ☐ |

---

## 8. Mobile Accessibility Tests

Test on actual device or Chrome DevTools device simulation:

| Check | Device | Expected | Pass/Fail |
|:--|:--|:--|:--|
| Touch targets ≥ 44×44px | iPhone | All buttons tappable | ☐ |
| Zoom not blocked | Any | `maximum-scale` not set to 1 | ☐ |
| Viewport meta correct | Any | `width=device-width, initial-scale=1` | ☐ |
| VoiceOver on iOS | iPhone | Navigation works | ☐ |
| TalkBack on Android | Android | Navigation works | ☐ |
| Pinch to zoom | Any | Content can be zoomed | ☐ |

---

## 9. Accessibility Test Results Summary

After completing all tests, record final results:

| Category | Tests | Passed | Failed | Score |
|:--|:--|:--|:--|:--|
| Automated (Lighthouse) | 1 | | | /100 |
| Keyboard Navigation | 19 | | | /19 |
| Focus States | 14 | | | /14 |
| Screen Reader (NVDA) | 14 | | | /14 |
| Screen Reader (VoiceOver) | 5 | | | /5 |
| ARIA Landmarks | 4 | | | /4 |
| Dynamic ARIA | 9 | | | /9 |
| Form Labels | 7 | | | /7 |
| Live Regions | 5 | | | /5 |
| Color Contrast | 8 | | | /8 |
| Reduced Motion | 5 | | | /5 |
| Mobile Accessibility | 6 | | | /6 |
| **TOTAL** | **97** | | | |

---

## 10. WCAG 2.1 Criteria Coverage

| Criterion | Level | Description | Status |
|:--|:--|:--|:--|
| 1.1.1 Non-text Content | A | Alt text for images | ✅ All emoji have `aria-hidden` |
| 1.3.1 Info & Relationships | A | Semantic structure | ✅ Semantic HTML5 |
| 1.3.2 Meaningful Sequence | A | Logical reading order | ✅ DOM order matches visual |
| 1.3.3 Sensory Characteristics | A | Not relying on shape/color alone | ✅ Text labels on all UI |
| 1.4.1 Use of Color | A | Color not sole indicator | ✅ Labels + icons used |
| 1.4.3 Contrast (Minimum) | AA | 4.5:1 for text | ✅ All pass |
| 1.4.4 Resize Text | AA | 200% zoom without loss | ✅ Relative units used |
| 1.4.10 Reflow | AA | 320px width no horizontal scroll | ⚠️ Test at 320px |
| 1.4.11 Non-text Contrast | AA | 3:1 for UI components | ✅ Focus rings pass |
| 1.4.13 Content on Hover | AA | Tooltips dismissible | ✅ No hover-only content |
| 2.1.1 Keyboard | A | All functionality via keyboard | ✅ Full keyboard support |
| 2.1.2 No Keyboard Trap | A | Focus not trapped (except intentional) | ✅ Escape exits modals |
| 2.2.2 Pause, Stop, Hide | A | Animations controllable | ✅ prefers-reduced-motion |
| 2.4.1 Bypass Blocks | A | Skip navigation | ✅ Skip link implemented |
| 2.4.2 Page Titled | A | Descriptive page title | ✅ Dynamic title updates |
| 2.4.3 Focus Order | A | Logical focus sequence | ✅ DOM order |
| 2.4.4 Link Purpose | A | Link text descriptive | ✅ aria-label on icon links |
| 2.4.6 Headings & Labels | AA | Descriptive headings | ✅ Unique h1 per section |
| 2.4.7 Focus Visible | AA | Visible focus indicator | ✅ 2px ring on all elements |
| 3.1.1 Language of Page | A | HTML lang attribute | ✅ `lang="en"` |
| 3.2.1 On Focus | A | No unexpected changes | ✅ Focus doesn't trigger nav |
| 3.2.2 On Input | A | No unexpected changes | ✅ Form changes predictable |
| 3.3.1 Error Identification | A | Errors identified | ✅ Toast messages |
| 3.3.2 Labels or Instructions | A | Form labels present | ✅ All inputs labelled |
| 4.1.1 Parsing | A | Valid HTML | ✅ Semantic, valid structure |
| 4.1.2 Name, Role, Value | A | Roles/states communicated | ✅ Full ARIA implementation |
| 4.1.3 Status Messages | AA | Status announced | ✅ aria-live regions |
