// Wellness Score: compute and display
const WellnessScore = (() => {
  function init(){
    // bind displays
    const mood = document.getElementById('wellness-mood');
    const moodDisplay = document.getElementById('wellness-mood-display');
    const stress = document.getElementById('wellness-stress');
    const stressDisplay = document.getElementById('wellness-stress-display');
    if (mood && moodDisplay) { moodDisplay.textContent = mood.value; mood.addEventListener('input', e=>moodDisplay.textContent = e.target.value); }
    if (stress && stressDisplay) { stressDisplay.textContent = stress.value; stress.addEventListener('input', e=>stressDisplay.textContent = e.target.value); }
    renderHistory();
  }

  function calculate(values){
    // Simple heuristic combining mood(1-5), sleep, water, study, stress(1-10)
    const moodFactor = (Number(values.mood)||3)/5;
    const sleep = Math.min(9, Math.max(0, Number(values.sleep)||7))/9;
    const water = Math.min(12, Math.max(0, Number(values.water)||6))/12;
    const study = Math.min(12, Math.max(0, Number(values.study)||4))/12;
    const stress = 1 - (Math.min(10, Math.max(0, Number(values.stress)||5))/10);
    const score = Math.round(((moodFactor*0.35)+(sleep*0.2)+(water*0.15)+(study*0.15)+(stress*0.15))*100);
    return Math.max(0, Math.min(100, score));
  }

  function categorize(score){
    if (score>=85) return { label: 'Excellent', cls: 'score--excellent', color: '#22C55E' };
    if (score>=70) return { label: 'Good', cls: 'score--good', color: '#6C63FF' };
    if (score>=50) return { label: 'Fair', cls: 'score--fair', color: '#F59E0B' };
    if (score>=30) return { label: 'Low', cls: 'score--low', color: '#EF4444' };
    return { label: 'Critical', cls: 'score--critical', color: '#EF4444' };
  }

  function logWellness(){
    const values = {
      mood: document.getElementById('wellness-mood')?.value,
      sleep: document.getElementById('wellness-sleep')?.value,
      water: document.getElementById('wellness-water')?.value,
      study: document.getElementById('wellness-study')?.value,
      stress: document.getElementById('wellness-stress')?.value
    };
    const score = calculate(values);
    const meta = categorize(score);
    const resultEl = document.getElementById('wellness-result');
    if (resultEl){
      resultEl.classList.remove('hidden');
      resultEl.innerHTML = `<div class="wellness-score-display"><div class="score-circle ${meta.cls}"><div class="score-number">${score}</div></div><div><div class="score-label">${meta.label}</div><div class="score-date">${Utils.formatTime(Date.now())}</div></div></div>
        <div class="wellness-suggestions"><h4>Suggestions</h4><ul><li>Try short breaks every study block</li><li>Keep sleep & hydration consistent</li><li>Use Calm Mode when stress rises</li></ul></div>`;
    }
    const history = Storage.get('wellness_entries', []);
    history.unshift({ id: 'w_'+Date.now(), values, score, meta, timestamp: Date.now() });
    Storage.set('wellness_entries', history.slice(0,200));
    renderHistory();
    Utils.toast('Wellness logged','success');
    Dashboard.refresh?.();
  }

  function renderHistory(){
    const container = document.getElementById('wellness-history'); if (!container) return;
    const history = Storage.get('wellness_entries', []);
    container.innerHTML = history.slice(0,8).map(h => `
      <div class="wellness-history-item"><div class="whi-left"><div class="whi-label">Score</div><div class="whi-date">${Utils.formatTime(h.timestamp)}</div></div>
      <div class="whi-score">${h.score}</div></div>`).join('');
  }

  return { init, logWellness, calculate };
})();
