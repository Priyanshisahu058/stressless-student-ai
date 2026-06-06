# Accessibility Documentation — StressLess Student AI

## Conformance Target

**WCAG 2.1 Level AA** — the international standard for web accessibility.

---

## What Is Implemented

### Semantic HTML Structure
| Element | Usage |
|:--|:--|
| `<main>` | Single main content area with `id="main-content"` |
| `<nav>` | Sidebar navigation with `aria-label="Main navigation"` |
| `<aside>` | Sidebar container |
| `<header>` | App header bar |
| `<section>` | Each feature section with `aria-labelledby` pointing to heading |
| `<article>` | Individual chat bubbles, mood history items |
| `<details>`/`<summary>` | Journal history entries (natively keyboard-accessible) |

### Skip Link
A "Skip to main content" link is the **first focusable element** in `<body>`. It is visually hidden until focused, then slides into view. This allows keyboard and screen reader users to skip the sidebar navigation.

### ARIA Roles & Labels
| Component | ARIA Implementation |
|:--|:--|
| Sidebar nav | `role="navigation"`, `aria-label="Main navigation"` |
| Chat messages | `aria-live="polite"`, `aria-atomic="false"` |
| Mood buttons | `role="group"` on container, `aria-pressed` on each button (toggled on click) |
| Trigger chips | `aria-pressed` toggled on selection/deselection |
| Range sliders | `aria-valuemin`, `aria-valuemax`, `aria-valuenow` (updated on `input` event) |
| Modals | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| Toast container | `aria-live="polite"`, `aria-atomic="true"` |
| Progress bars | `role="progressbar"`, `aria-valuenow`, `aria-label` |
| Crisis modal | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="crisis-modal-title"` |
| Calm overlay | `role="dialog"`, `aria-modal="true"`, `aria-labelledby="calm-title"` |

### Focus Management
- **Crisis Modal**: Focus moves to "Open Calm Mode" button on open. Escape and close button return focus to the trigger element.
- **Calm Mode Overlay**: Focus moves to close button on open. Escape returns focus to the trigger.
- **Focus Traps**: Tab/Shift+Tab cycles within the active modal; cannot Tab out.
- **Focus Visible**: `:focus-visible` shows 2px solid primary-color outline with 3px offset on all interactive elements.

### Keyboard Navigation
| Key | Action |
|:--|:--|
| `Tab` | Move forward through interactive elements |
| `Shift+Tab` | Move backward |
| `Enter` / `Space` | Activate buttons |
| `Escape` | Close any open modal/overlay |
| `Arrow keys` | Operate range sliders |

### Screen Reader Support
- All decorative emoji have `aria-hidden="true"`
- All icon-only buttons have `aria-label`
- Dynamic content updates use `aria-live` regions
- Section navigation announced via `document.title` updates
- Error messages announced via live region

### Color & Contrast
| Text Type | Ratio | WCAG AA |
|:--|:--|:--|
| Primary text on bg | ~12:1 | ✅ Pass |
| Secondary text on bg | ~7:1 | ✅ Pass |
| Muted text on bg | ~4.6:1 | ✅ Pass (just above AA minimum) |
| Primary accent (#6C63FF) on dark | ~4.8:1 | ✅ Pass |

### Motion & Display Preferences
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations and transitions disabled */
  .breath-circle { transition: none !important; }
}

@media (prefers-contrast: high) {
  /* Increased border opacity and text contrast */
}
```

### Form Accessibility
- All form inputs have associated `<label>` elements
- Required fields marked with `aria-required="true"`
- Character counters linked via `aria-describedby`
- Validation errors surfaced via `Utils.toast()` which uses `aria-live`
- Select options have `background` set for OS-level theming

---

## Known Limitations

1. **Chart.js charts** — Canvas-based charts are not natively accessible to screen readers. Stat cards (Streak, Mood Count, Avg Score, Days Tracked) provide the same data as text.
2. **Emoji in UI** — Emoji mood buttons convey meaning visually and via text labels; screen readers read the text label, not the emoji.
3. **No light mode** — The app is dark-theme only. Users with `prefers-color-scheme: light` will still see the dark theme.

---

## Testing Recommendations

### Automated
- [axe DevTools](https://www.deque.com/axe/) browser extension
- Lighthouse Accessibility audit (target: 90+)

### Manual
- **NVDA + Chrome** (Windows): Test all interactive elements
- **VoiceOver + Safari** (macOS/iOS): Test modal dialogs and live regions
- **Keyboard-only navigation**: Tab through every section without a mouse

### Checklist
- [ ] All interactive elements reachable by keyboard
- [ ] All modals focus-trapped and Escape-dismissible
- [ ] Live regions announce dynamic updates
- [ ] All form errors surfaced to screen readers
- [ ] Charts have text-based data alternatives in stat cards
- [ ] Color not sole means of conveying information
