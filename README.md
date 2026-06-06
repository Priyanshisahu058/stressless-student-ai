# StressLess Student AI

StressLess Student AI is an AI-powered mental wellness tracker focused on students preparing for competitive exams and board tests. This fork adds core JavaScript modules, accessibility improvements, simulated Gemini integration (safe fallback), testing documentation, and UI/UX polish for hackathon readiness.

## What's included

- AI Wellness Coach (simulated if API key missing)
- Daily Mood Tracker
- Stress Trigger Analysis (AI-backed simulated)
- Reflection Journal
- Wellness Score Calculator & History
- Personalized Study Wellness Planner (simulated)
- Emergency Calm Mode (breathing, affirmations)
- Progress Dashboard with charts
- Crisis detection with helpful resources
- Accessibility enhancements: ARIA attributes, keyboard focus, skip link
- Security: input sanitization and client-side validation
- Testing docs and accessibility checklist

## Setup (GitHub Pages compatible)

1. Clone the repo and open `index.html` in the browser. It's a static single-page app and works without a server.
2. To enable real AI features, create a `config.js` (copy the included `config.js` example) and set `GEMINI_API_KEY` to your key from Google AI Studio.
   - Important: For production, never expose API keys in client-side code. Use a server-side proxy or functions to sign requests.

## Local development

- Open `index.html` in your browser or host with a simple static server such as `npx http-server`.

## Testing & Accessibility
See docs/TESTING.md for manual test cases, automated testing suggestions, and an accessibility checklist.

## Screenshots
(Add screenshots in the `assets/` directory and update this section before submitting.)

## Notes on Gemini integration
This release includes a `js/gemini.js` file with simulated responses to allow the app to function without an API key. For production:
- Implement server-side calls to Gemini/OpenAI style endpoints.
- Never call model APIs directly from client-side with a raw key.

## License
MIT. See LICENSE file.
