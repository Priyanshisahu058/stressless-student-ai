// Stress Triggers UI & helper
const StressTriggers = (() => {
  const DEFAULT_TRIGGERS = ['Deadlines', 'Mock Tests', 'Parent Pressure', 'Time Management', 'Health', 'Sleep', 'Comparisons'];
  let selected = new Set();

  function init(){
    renderChips();
    renderHistory();
    const btn = document.getElementById('analyze-triggers-btn'); if (btn) btn.disabled = true;
  }

  function renderChips(){
    const container = document.getElementById('trigger-chips');
    if (!container) return;
    container.innerHTML = '';
    DEFAULT_TRIGGERS.forEach(t => {
      const el = document.createElement('button');
      el.className = 'trigger-chip';
      el.type = 'button';
      el.textContent = t;
      el.addEventListener('click', ()=> toggleTrigger(t, el));
      container.appendChild(el);
    });
  }

  function toggleTrigger(t, el){
    if (selected.has(t)) { selected.delete(t); el.classList.remove('trigger-chip--selected'); }
    else { selected.add(t); el.classList.add('trigger-chip--selected'); }
    const btn = document.getElementById('analyze-triggers-btn'); if (btn) btn.disabled = selected.size===0 && !document.getElementById('custom-trigger')?.value;
  }

  async function analyzeTriggers(){
    const custom = document.getElementById('custom-trigger')?.value?.trim();
    const exam = document.getElementById('trigger-exam-type')?.value || '';
    const triggers = Array.from(selected);
    if (custom) triggers.push(custom);

    const resultEl = document.getElementById('trigger-analysis-result');
    if (resultEl) {
      resultEl.innerHTML = `<div class="ai-loading"><div class="loading-pulse"></div><div class="loading-sub">Analyzing your triggers...</div></div>`;
      resultEl.classList.remove('hidden');
    }

    const analysis = await GeminiService.analyzeTriggers(triggers, exam);
    if (analysis === null){
      resultEl.innerHTML = `<div class="ai-error">AI features require an API key. Open <code>config.js</code> to configure. <div class="ai-error-tip">You can still use non-AI features.</div></div>`;
      return;
    }

    resultEl.innerHTML = `<div class="ai-response-card"><div class="ai-response-body">${Utils.sanitize(analysis)}</div></div>`;

    // Save session
    const history = Storage.get('trigger_sessions', []);
    history.unshift({ id: 't_'+Date.now(), triggers, exam, analysis, timestamp: Date.now() });
    Storage.set('trigger_sessions', history.slice(0,50));
    renderHistory();
  }

  function renderHistory(){
    const container = document.getElementById('trigger-history'); if (!container) return;
    const history = Storage.get('trigger_sessions', []);
    container.innerHTML = history.slice(0,6).map(h => `
      <div class="trigger-history-item"><span class="thi-date">${Utils.formatTime(h.timestamp)}</span>
        <div>${h.triggers.map(t=>`<span class="tag">${Utils.escapeHtml(t)}</span>`).join('')}</div>
      </div>`).join('');
  }

  function formatAIResponse(text){
    return Utils.sanitize(text).replace(/\n/g,'<br>');
  }

  return { init, analyzeTriggers, formatAIResponse };
})();
