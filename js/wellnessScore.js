/**
 * StressLess Student AI - Wellness Score Engine
 * Fixed: aria-valuenow updates, personalized suggestions, input range clamping.
 */
const WellnessScore = (() => {
  const WEIGHTS = { mood: 0.30, sleep: 0.25, water: 0.15, study: 0.15, stress: 0.15 };

  const SUGGESTIONS = {
    sleep:  ['Try to sleep at the same time each night.', 'Avoid screens 30 min before bed.', 'Aim for 7–8 hours of sleep.'],
    water:  ['Keep a water bottle at your study desk.', 'Set hourly reminders to drink water.', 'Start each morning with a full glass of water.'],
    stress: ['Try 4-7-8 breathing before study sessions.', 'Use the Emergency Calm Mode when overwhelmed.', 'Journal daily to process stress.'],
    mood:   ['Log your mood daily to spot patterns.', 'Talk to someone you trust about how you feel.', 'Celebrate small wins — they add up!'],
    study:  ['Break study into 45-min focused blocks.', 'Review notes within 24 hours of learning.', 'Plan your toughest subjects for peak-focus hours.']
  };

  function init() {
    bindSliders();
    renderHistory();
  }

  function bindSliders() {
    const sliders = [
      { id: 'sleep-slider',   display: 'sleep-val',   unit: 'h', min: 4, max: 12 },
      { id: 'water-slider',   display: 'water-val',   unit: 'g', min: 0, max: 12 },
      { id: 'study-slider',   display: 'study-val',   unit: 'h', min: 0, max: 16 },
      { id: 'stress-slider',  display: 'stress-val',  unit: '/10', min: 1, max: 10 }
    ];

    sliders.forEach(({ id, display, unit, min, max }) => {
      const slider  = document.getElementById(id);
      const display_el = document.getElementById(display);
      if (!slider) return;

      const update = () => {
        const val = parseInt(slider.value);
        if (display_el) display_el.textContent = val + unit;
        // Update aria-valuenow
        slider.setAttribute('aria-valuenow', val);
        const valueText = `${val}${unit}`;
        slider.setAttribute('aria-valuetext', valueText);
      };

      slider.addEventListener('input', update);
      update(); // Initialize
    });
  }

  function calculate() {
    // Read and clamp all values
    const moodMap  = { happy: 100, focused: 90, okay: 70, neutral: 60, stressed: 35, anxious: 30, burnout: 15 };
    const moodEntry = MoodTracker ? MoodTracker.getLatestMoodData() : null;
    const moodScore = moodEntry ? (moodMap[moodEntry.moodId] ?? 50) : 50;

    const sleepRaw  = clamp(parseInt(document.getElementById('sleep-slider')?.value)  || 7, 4, 12);
    const waterRaw  = clamp(parseInt(document.getElementById('water-slider')?.value)  || 6, 0, 12);
    const studyRaw  = clamp(parseInt(document.getElementById('study-slider')?.value)  || 6, 0, 16);
    const stressRaw = clamp(parseInt(document.getElementById('stress-slider')?.value) || 5, 1, 10);

    // Normalize to 0–100
    const sleepScore  = Math.min(100, ((sleepRaw - 4) / 4) * 100);         // 4h=0, 8h=100
    const waterScore  = Math.min(100, (waterRaw / 8) * 100);               // 8g=100
    const studyScore  = Math.min(100, (studyRaw / 8) * 100);               // 8h=100
    const stressScore = Math.max(0, ((10 - stressRaw) / 9) * 100);         // lower stress = higher score

    const total = Math.round(
      moodScore   * WEIGHTS.mood   +
      sleepScore  * WEIGHTS.sleep  +
      waterScore  * WEIGHTS.water  +
      studyScore  * WEIGHTS.study  +
      stressScore * WEIGHTS.stress
    );

    // Save
    const entry = {
      id: 'w_' + Date.now(),
      timestamp: Date.now(),
      score: total,
      breakdown: { mood: moodScore, sleep: sleepScore, water: waterScore, study: studyScore, stress: stressScore }
    };
    const history = Storage.get('wellness_entries', []) || [];
    history.unshift(entry);
    Storage.set('wellness_entries', history.slice(0, 365));

    renderResult(total, entry.breakdown, sleepRaw, waterRaw, stressRaw);
    renderHistory();

    if (typeof Dashboard !== 'undefined' && Dashboard.refresh) Dashboard.refresh();
  }

  function clamp(v, min, max) { return Math.min(max, Math.max(min, isNaN(v) ? min : v)); }

  function getLevel(score) {
    if (score >= 80) return { label: 'Excellent',  color: '#2DD4BF', emoji: '🌟' };
    if (score >= 60) return { label: 'Good',       color: '#6C63FF', emoji: '👍' };
    if (score >= 40) return { label: 'Fair',       color: '#F59E0B', emoji: '⚠️' };
    return              { label: 'Needs Care',  color: '#EF4444', emoji: '💙' };
  }

  function getPersonalizedSuggestions(breakdown, sleepRaw, waterRaw, stressRaw) {
    const tips = [];

    if (sleepRaw < 6)      tips.push(SUGGESTIONS.sleep[0]);
    else if (sleepRaw < 7) tips.push(SUGGESTIONS.sleep[2]);

    if (waterRaw < 5)      tips.push(SUGGESTIONS.water[0]);
    if (stressRaw >= 7)    tips.push(SUGGESTIONS.stress[0]);
    if (stressRaw >= 8)    tips.push(SUGGESTIONS.stress[1]);

    if (breakdown.mood < 50)  tips.push(SUGGESTIONS.mood[0]);
    if (breakdown.study < 40) tips.push(SUGGESTIONS.study[0]);

    // Always give at least 2 tips
    if (tips.length < 2) {
      const allTips = Object.values(SUGGESTIONS).flat();
      while (tips.length < 2) {
        const t = allTips[Math.floor(Math.random() * allTips.length)];
        if (!tips.includes(t)) tips.push(t);
      }
    }

    return tips.slice(0, 3);
  }

  function renderResult(score, breakdown, sleepRaw, waterRaw, stressRaw) {
    const resultEl = document.getElementById('wellness-result');
    if (!resultEl) return;

    const level   = getLevel(score);
    const tips    = getPersonalizedSuggestions(breakdown, sleepRaw, waterRaw, stressRaw);
    const tipsHTML = tips.map(t => `<li>${Utils.escapeHtml(t)}</li>`).join('');

    resultEl.innerHTML = `
      <div class="wellness-score-display" aria-label="Your wellness score is ${score} out of 100, rated ${level.label}">
        <div class="wsd-score" style="color:${level.color}" aria-hidden="true">${score}</div>
        <div class="wsd-label">
          <span class="wsd-level" style="color:${level.color}">${level.emoji} ${level.label}</span>
          <span class="wsd-sub">out of 100</span>
        </div>
      </div>
      <div class="wellness-breakdown" aria-label="Score breakdown">
        ${renderBar('Mood',    breakdown.mood,    '#6C63FF')}
        ${renderBar('Sleep',   breakdown.sleep,   '#2DD4BF')}
        ${renderBar('Hydration', breakdown.water, '#22C55E')}
        ${renderBar('Study',   breakdown.study,   '#F59E0B')}
        ${renderBar('Calm',    breakdown.stress,  '#8B85FF')}
      </div>
      <div class="wellness-tips">
        <h4>💡 Personalised Tips for You</h4>
        <ul>${tipsHTML}</ul>
      </div>`;

    Utils.toast(`Wellness score: ${score}/100 — ${level.label} ${level.emoji}`, 'success');
  }

  function renderBar(label, value, color) {
    const pct = Math.round(value);
    return `
      <div class="wb-row">
        <span class="wb-label">${label}</span>
        <div class="wb-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${label}: ${pct}%">
          <div class="wb-fill" style="width:${pct}%;background:${color}"></div>
        </div>
        <span class="wb-pct">${pct}%</span>
      </div>`;
  }

  function renderHistory() {
    const container = document.getElementById('wellness-history');
    if (!container) return;

    const history = Storage.get('wellness_entries', []) || [];
    if (!history.length) {
      container.innerHTML = '<p class="empty-state">Log your wellness to see history here.</p>';
      return;
    }

    container.innerHTML = '';
    history.slice(0, 7).forEach(entry => {
      const level = getLevel(entry.score);
      const div   = document.createElement('div');
      div.className = 'wellness-history-item';
      div.setAttribute('role', 'article');
      div.setAttribute('aria-label', `Wellness score ${entry.score} on ${Utils.formatTime(entry.timestamp)}`);
      div.innerHTML = `
        <div class="whi-score" style="color:${level.color}">${entry.score}</div>
        <div class="whi-details">
          <div class="whi-level" style="color:${level.color}">${level.emoji} ${level.label}</div>
          <div class="whi-time">${Utils.formatTime(entry.timestamp)}</div>
        </div>`;
      container.appendChild(div);
    });
  }

  return { init, calculate };
})();
