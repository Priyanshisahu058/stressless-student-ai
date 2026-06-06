# StressLess Student AI — Deployment Guide

## GitHub Pages Deployment (Recommended)

### Step 1: Prepare Repository

```bash
# Verify .gitignore has config.js listed
cat .gitignore | grep config.js
# Should output: config.js
```

### Step 2: Commit and Push

```bash
git init  # (if not already a git repo)
git remote add origin https://github.com/Priyanshisahu058/stressless-student-ai.git

# Stage all files EXCEPT config.js (it's gitignored automatically)
git add .
git status  # Verify config.js is NOT listed

git commit -m "feat: initial StressLess Student AI deployment"
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Choose **main** branch, **/ (root)** folder
5. Click **Save**
6. Your site will be live at: `https://priyanshisahu058.github.io/stressless-student-ai`

### Step 4: Verify Deployment

- Visit your GitHub Pages URL
- The API key banner will appear (expected — users configure their own key)
- All non-AI features (mood, journal, wellness score) work without a key
- AI features activate when users add their key to `config.js` locally

---

## Local Development Setup

### Option A: VS Code Live Server
1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Open the project folder in VS Code
3. Right-click `index.html` → "Open with Live Server"

### Option B: Python (Built-in)
```bash
cd "path/to/stressless-student-ai"
python -m http.server 8000
# Open http://localhost:8000
```

### Option C: Node.js serve
```bash
npx serve .
```

### Option D: Node.js http-server
```bash
npx http-server . -p 8000
```

---

## API Key Configuration

1. Get a free API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Open `config.js` in a text editor
3. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual key:
```js
const GEMINI_API_KEY = 'AIza...your-actual-key...';
```
4. **NEVER commit this file** — it's protected by `.gitignore`
5. Refresh the app — the API key banner should disappear

---

## Environment Variables for CI/CD

If you want to inject the API key via GitHub Actions (advanced):

```yaml
# .github/workflows/deploy.yml
name: Deploy to Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Inject API Key
        run: echo "const GEMINI_API_KEY = '${{ secrets.GEMINI_API_KEY }}';" > config.js
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

> ⚠️ Only use this if you are the only user of your deployment. For public deployments, let users provide their own keys.

---

## Troubleshooting

| Issue | Solution |
|:--|:--|
| API key banner persists | Check `config.js` has valid key (not placeholder) |
| Charts not rendering | Ensure Chart.js CDN loads (check network tab) |
| Fonts not loading | Check internet connection for Google Fonts |
| Data not persisting | Check browser's localStorage isn't blocked |
| CORS errors | Serve via HTTP server, not `file://` protocol |
| Gemini 401 error | API key is invalid or expired |
| Gemini 429 error | Rate limit exceeded — wait and retry |

---

## Browser Support

| Browser | Minimum Version |
|:--|:--|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |
| Mobile Chrome | 90+ |
| Mobile Safari | 14+ |

---

## Performance Optimization

- All assets served from CDN (Chart.js, Google Fonts)
- No build step required
- localStorage for instant data access (no API latency)
- Gemini responses cached in chat history
- CSS animations use `transform` and `opacity` (GPU-accelerated)
- `prefers-reduced-motion` respected for low-power devices
