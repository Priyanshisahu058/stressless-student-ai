/**
 * StressLess Student AI - Stress Triggers
 * Fixed: error handling for API, aria-pressed on chips, null-ref on resultEl.
 */
const StressTriggers = (() => {
  const TRIGGERS = [
    { id: 'exam_pressure',   label: '📚 Exam Pressure' },
    { id: 'time_management', label: '⏰ Time Management' },
    { id: 'mock_scores',     label: '📉 Mock Test Scores' },
    { id: 'family_expect',   label: '👨‍👩‍👧 Family Expectations' },
    { id: 'peer_comparison', label: '🤝 Peer Comparison' },
    { id: 'fear_failure',    label: '😨 Fear of Failure' },
    { id: 'sleep_issues',    label: '😴 Sleep Problems' },
    { id: 'health',          label: '🏃 Health & Energy' },
    { id: 'distractions',    label: '📱 Distractions' },
    { id: 'self_doubt',      label: '💭 Self Doubt' },
    { id: 'result_anxiety',  label: '📋 Result Anxiety' },
    { id: 'burnout',         label: '🔥 Burnout' }
  ];

  let selected = new Set();

  function init() {
    renderChips();
    const resultEl = document.getElementById('trigger-analysis-result');
    if (resultEl) resultEl.innerHTML = '';
    selected.clear();
    updateAnalyzeBtn();
  }

  function renderChips() {
    const container = document.getElementById('trigger-chips');
    if (!container) return;
    container.innerHTML = '';
    container.setAttribute('role', 'group');
    container.setAttribute('aria-label', 'Select your stress triggers');

    TRIGGERS.forEach(t => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'trigger-chip';
      btn.dataset.id = t.id;
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', `Stress trigger: ${t.label.replace(/^\S+\s/, '')}`);
      btn.textContent = t.label;

      btn.addEventListener('click', () => toggleTrigger(t, btn));
      container.appendChild(btn);
    });
  }

  function toggleTrigger(t, btn) {
    if (selected.has(t.id)) {
      selected.delete(t.id);
      btn.classList.remove('trigger-chip--selected');
      btn.setAttribute('aria-pressed', 'false');
    } else {
      selected.add(t.id);
      btn.classList.add('trigger-chip--selected');
      btn.setAttribute('aria-pressed', 'true');
    }
    updateAnalyzeBtn();
  }

  function updateAnalyzeBtn() {
    const btn = document.getElementById('analyze-triggers-btn');
    if (!btn) return;
    btn.disabled = selected.size === 0;
    btn.setAttribute('aria-label',
      selected.size === 0
        ? 'Select at least one trigger to analyze'
        : `Analyze ${selected.size} selected trigger${selected.size > 1 ? 's' : ''}`
    );
  }

  async function analyzeTriggers() {
    const resultEl = document.getElementById('trigger-analysis-result');
    if (!resultEl) return;

    if (selected.size === 0) {
      Utils.toast('Please select at least one trigger.', 'warning');
      return;
    }

    const triggerLabels = TRIGGERS
      .filter(t => selected.has(t.id))
      .map(t => t.label.replace(/^\S+\s/, '')); // strip emoji

    const examTypeEl = document.getElementById('exam-select');
    const examType   = examTypeEl ? examTypeEl.value : '';

    // Save to history
    const entry = {
      id: 'tr_' + Date.now(),
      timestamp: Date.now(),
      triggers: triggerLabels,
      examType
    };
    const history = Storage.get('trigger_history', []) || [];
    history.unshift(entry);
    Storage.set('trigger_history', history.slice(0, 50));

    resultEl.innerHTML = `
      <div class="ai-loading" aria-live="polite">
        <div class="loading-pulse"></div>
        <p>Analyzing your triggers…</p>
        <p class="loading-sub">Getting personalized coping strategies</p>
      </div>`;

    const analyzeBtn = document.getElementById('analyze-triggers-btn');
    if (analyzeBtn) analyzeBtn.disabled = true;

    try {
      const analysis = await GeminiService.analyzeTriggers(triggerLabels, examType);

      if (!analysis) {
        resultEl.innerHTML = `
          <div class="ai-response-card">
            <div class="ai-response-header">
              <span class="ai-badge">💡 Coping Strategies</span>
            </div>
            <div class="ai-response-body">
              <p>To get AI-powered analysis, please add your Gemini API key to <code>config.js</code>.</p>
              <p>General tip: Focus on one trigger at a time. Small consistent actions beat overwhelming efforts.</p>
            </div>
          </div>`;
      } else {
        resultEl.innerHTML = `
          <div class="ai-response-card">
            <div class="ai-response-header">
              <span class="ai-badge">🤖 AI Analysis</span>
              <span class="ai-time">${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <div class="ai-response-body">${formatResponse(analysis)}</div>
          </div>`;
      }

      renderHistory();
    } catch (e) {
      resultEl.innerHTML = `
        <div class="ai-response-card">
          <div class="ai-response-header"><span class="ai-badge">⚠️ Error</span></div>
          <div class="ai-response-body"><p>Could not analyze triggers. Please try again.</p></div>
        </div>`;
      Utils.toast('Analysis failed. Please try again.', 'error');
    } finally {
      updateAnalyzeBtn();
    }
  }

  function formatResponse(text) {
    if (!text) return '';
    return text
      .split('\n')
      .map(line => {
        const safe = Utils.escapeHtml(line);
        if (!line.trim()) return '<br>';
        if (/^[-•*] /.test(line))   return `<li>${Utils.escapeHtml(line.slice(2))}</li>`;
        if (/^\*\*(.+)\*\*/.test(line)) return `<p><strong>${safe.replace(/\*\*/g, '')}</strong></p>`;
        if (/^#{1,3} /.test(line))  return `<h4>${Utils.escapeHtml(line.replace(/^#+\s/, ''))}</h4>`;
        return `<p>${safe}</p>`;
      })
      .join('')
      .replace(/(<li>.*?<\/li>)+/g, m => `<ul>${m}</ul>`);
  }

  function renderHistory() {
    const container = document.getElementById('trigger-history');
    if (!container) return;

    const history = Storage.get('trigger_history', []) || [];
    if (!history.length) {
      container.innerHTML = '<p class="empty-state">Your trigger history will appear here.</p>';
      return;
    }

    container.innerHTML = '';
    history.slice(0, 5).forEach(entry => {
      const div = document.createElement('div');
      div.className = 'trigger-history-item';
      const tagHTML = entry.triggers
        .map(t => `<span class="tag">${Utils.escapeHtml(t)}</span>`).join(' ');
      div.innerHTML = `
        <span class="thi-date">${Utils.formatTime(entry.timestamp)}${entry.examType ? ` · ${Utils.escapeHtml(entry.examType)}` : ''}</span>
        <div>${tagHTML}</div>`;
      container.appendChild(div);
    });
  }

  return { init, analyzeTriggers };
})();
