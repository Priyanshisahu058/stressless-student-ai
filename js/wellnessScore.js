/**
 * StressLess Student AI - Wellness Score Engine
 */

const WellnessScore = (() => {
  
  /** Calculate wellness score from inputs (0-100) */
  function calculate(data) {
    const { mood, sleep, water, studyHours, stressLevel } = data;
    
    // Weighted scoring
    const moodScore = (mood / 5) * 25;                    // 25 pts max
    const sleepScore = Math.min(sleep / 8, 1) * 20;       // 20 pts max (8h = full)
    const waterScore = Math.min(water / 8, 1) * 15;       // 15 pts max (8 glasses = full)
    const studyScore = Math.min(studyHours / 8, 1) * 20;  // 20 pts max (8h = full)
    const stressScore = ((10 - stressLevel) / 10) * 20;   // 20 pts max (low stress = good)
    
    const total = Math.round(moodScore + sleepScore + waterScore + studyScore + stressScore);
    return Utils.clamp(total, 0, 100);
  }

  /** Get wellness label based on score */
  function getLabel(score) {
    if (score >= 80) return { label: 'Excellent! 🌟', class: 'score--excellent' };
    if (score >= 60) return { label: 'Good 😊', class: 'score--good' };
    if (score >= 40) return { label: 'Fair 😐', class: 'score--fair' };
    if (score >= 20) return { label: 'Needs Care 😟', class: 'score--low' };
    return { label: 'Critical — Rest Now 🛑', class: 'score--critical' };
  }

  /** Get improvement suggestions based on inputs */
  function getSuggestions(data) {
    const suggestions = [];
    const { mood, sleep, water, studyHours, stressLevel } = data;
    
    if (sleep < 7) suggestions.push('💤 Aim for 7-8 hours of sleep for better focus and memory consolidation.');
    if (water < 6) suggestions.push('💧 Drink at least 8 glasses of water daily. Dehydration increases fatigue.');
    if (stressLevel > 6) suggestions.push('🧘 High stress detected. Try 10 minutes of meditation or box breathing today.');
    if (studyHours > 10) suggestions.push('⚠️ Studying 10+ hours can cause burnout. Add proper breaks (Pomodoro technique).');
    if (studyHours < 3) suggestions.push('📚 Try to maintain at least 3-4 focused study hours daily for steady progress.');
    if (mood <= 2) suggestions.push('💙 Your mood seems low. Consider reaching out to a friend or using the Calm Mode.');
    
    if (suggestions.length === 0) {
      suggestions.push('🎉 You\'re doing great! Keep maintaining this healthy balance.');
    }
    
    return suggestions;
  }

  function init() {
    const form = document.getElementById('wellness-form');
    if (!form) return;
    
    // Range input live value updates
    ['wellness-stress', 'wellness-mood'].forEach(id => {
      const input = document.getElementById(id);
      const display = document.getElementById(`${id}-display`);
      if (input && display) {
        input.addEventListener('input', () => {
          display.textContent = input.value;
        });
      }
    });
    
    renderWellnessHistory();
  }

  function logWellness() {
    const mood = parseInt(document.getElementById('wellness-mood')?.value || 3);
    const sleep = parseFloat(document.getElementById('wellness-sleep')?.value || 7);
    const water = parseInt(document.getElementById('wellness-water')?.value || 6);
    const studyHours = parseFloat(document.getElementById('wellness-study')?.value || 5);
    const stressLevel = parseInt(document.getElementById('wellness-stress')?.value || 5);

    // Validation
    if (isNaN(sleep) || sleep < 0 || sleep > 24) {
      Utils.toast('Please enter valid sleep hours (0-24)', 'warning');
      return;
    }
    if (isNaN(water) || water < 0 || water > 20) {
      Utils.toast('Please enter valid water intake (0-20 glasses)', 'warning');
      return;
    }

    const data = { mood, sleep, water, studyHours, stressLevel };
    const score = calculate(data);
    const labelData = getLabel(score);
    const suggestions = getSuggestions(data);

    const entry = {
      id: Utils.uuid(),
      timestamp: Date.now(),
      todayKey: Utils.todayKey(),
      ...data,
      score
    };

    Storage.append('wellness_history', entry);

    // Display result
    renderScoreResult(score, labelData, suggestions);
    renderWellnessHistory();
    Utils.toast('✅ Wellness logged!', 'success');
    if (typeof Dashboard !== 'undefined') Dashboard.refresh();
  }

  function renderScoreResult(score, labelData, suggestions) {
    const resultEl = document.getElementById('wellness-result');
    if (!resultEl) return;

    resultEl.innerHTML = `
      <div class="wellness-score-display ${labelData.class}" role="region" aria-label="Your wellness score">
        <div class="score-circle" style="--score-color: ${Utils.scoreColor(score)}">
          <span class="score-number" aria-label="Score: ${score} out of 100">${score}</span>
          <span class="score-max">/100</span>
        </div>
        <div class="score-info">
          <h3 class="score-label">${labelData.label}</h3>
          <p class="score-date">Logged: ${Utils.formatDate(Date.now())}</p>
        </div>
      </div>
      <div class="wellness-suggestions" aria-label="Wellness suggestions">
        <h4>💡 Personalized Suggestions</h4>
        <ul>
          ${suggestions.map(s => `<li>${Utils.sanitize(s)}</li>`).join('')}
        </ul>
      </div>
    `;
    
    resultEl.classList.remove('hidden');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Animate score circle
    setTimeout(() => resultEl.querySelector('.score-circle')?.classList.add('animated'), 100);
  }

  function renderWellnessHistory() {
    const container = document.getElementById('wellness-history');
    if (!container) return;

    const history = Storage.getRecent('wellness_history', 7);
    
    if (history.length === 0) {
      container.innerHTML = '<p class="empty-state">No wellness data yet. Log your first entry! 💪</p>';
      return;
    }

    container.innerHTML = [...history].reverse().map(entry => {
      const labelData = getLabel(entry.score);
      return `
        <div class="wellness-history-item" role="article">
          <div class="whi-left">
            <span class="whi-date">${Utils.formatDate(entry.timestamp)}</span>
            <span class="whi-label ${labelData.class}">${labelData.label}</span>
          </div>
          <div class="whi-score" style="color: ${Utils.scoreColor(entry.score)}">${entry.score}</div>
        </div>`;
    }).join('');
  }

  function getScoresForWeek() {
    const history = Storage.getRecent('wellness_history', 7);
    const labels = Utils.last7DayLabels();
    const dayMap = {};
    
    history.forEach(entry => {
      const day = new Date(entry.timestamp).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      dayMap[day] = entry.score;
    });
    
    return {
      labels,
      scores: labels.map(label => dayMap[label] || null),
      average: history.length > 0 ? Math.round(history.reduce((s, e) => s + e.score, 0) / history.length) : 0
    };
  }

  return { init, logWellness, calculate, getScoresForWeek, getLabel };
})();
