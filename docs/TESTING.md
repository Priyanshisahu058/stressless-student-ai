# Testing & Accessibility

This document contains manual test cases, accessibility checklist, and guidance for automated tests.

Manual Test Cases

- Mood Tracker
  - Open app, navigate to Mood Tracker.
  - Select a mood, add an optional note, and click 'Log Mood'. Verify entry appears in history and header updates.
  - Attempt to submit without selecting a mood — expect warning.

- AI Coach
  - Type a quick prompt and send. If no API key is configured, app shows an API notice and simulated response is used.
  - Trigger a crisis phrase (e.g., "I want to kill myself") and verify crisis modal appears.

- Stress Triggers
  - Select multiple trigger chips and click Analyze. Verify analysis appears and stored in history.

- Journal
  - Fill prompts and save. Verify streak and history.

- Wellness Score
  - Change sliders/inputs and click Calculate & Log Score. Verify score category and history saved.

- Planner
  - Fill fields and Generate Plan. Verify AI plan or API prompt.

- Calm Mode
  - Open Calm Mode and verify breathing animation, timers, and affirmations rotate.

Accessibility Checklist

- [x] Skip to main content link is present and keyboard-accessible.
- [x] All interactive elements have ARIA labels where context is needed.
- [x] Focus outlines are visible (use `:focus-visible`).
- [x] Color contrast: glass theme aims for good contrast; verify with Lighthouse.
- [x] Chat and dynamic content use `aria-live` regions for screen readers.

Automated Testing Suggestions

- Unit tests for `js/storage.js` and `js/utils.js` using Jest.
- Integration tests using Playwright to validate navigation and critical flows (mood log, journal save, calm mode).

