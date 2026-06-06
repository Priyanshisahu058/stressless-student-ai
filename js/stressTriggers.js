/**
 * StressLess Student AI - Stress Trigger Analysis Module
 */

const StressTriggers = (() => {
  const PREDEFINED_TRIGGERS = [
    { id: 'exam_pressure', icon: '📚', label: 'Exam Pressure' },
    { id: 'mock_scores', icon: '📉', label: 'Poor Mock Scores' },
    { id: 'time_management', icon: '⏰', label: 'Time Management' },
    { id: 'family_expectations', icon: '👨‍👩‍👧', label: 'Family Expectations' },
    { id: 'result_anxiety', icon: '📋', label: 'Result Anxiety' },
    { id: 'lack_preparation', icon: '😟', label: 'Lack of Preparation' },
    { id: 'burnout', icon: '🔥', label: 'Burnout' },
    { id: 'peer_comparison', icon: '👥', label: 'Peer Comparison' },
    { id: 'financial_stress', icon: '💰', label: 'Financial Stress' },
    { id: 'health_issues', icon: '🏥', label: 'Health Issues' },
    { id: 'social_isolation', icon: '🏠', label: 'Social Isolation' },
    { id: 'tech_distractions', icon: '📱', label: 'Tech Distractions' }
  ];

  let selectedTriggers = new Set();

  function init() {
    renderTriggerChips();
    renderTriggerHistory();
  }

  function renderTriggerChips() {
    const container = document.getElementById('trigger-chips');
    if (!container) return;
    
    container.innerHTML = PREDEFINED_TRIGGERS.map(trigger => `
      <button 
        class="trigger-chip" 
        data-id="${trigger.id}"
        aria-pressed="false"
        aria-label="Select trigger: ${trigger.label}"
      >
        <span aria-hidden="true">${trigger.icon}</span>
        ${trigger.label}
      </button>
    `).join('');

    container.querySelectorAll('.trigger-chip').forEach(chip => {
      chip.addEventListener('click', () => toggleTrigger(chip));
    });
  }

  function toggleTrigger(chip) {
    const id = chip.dataset.id;
    if (selectedTriggers.has(id)) {
      selectedTriggers.delete(id);
      chip.classList.remove('trigger-chip--selected');
      chip.setAttribute('aria-pressed', 'false');
    } else {
      selectedTriggers.add(id);
      chip.classList.add('trigger-chip--selected');
      chip.setAttribute('aria-pressed', 'true');
    }
    
    updateAnalyzeBtn();
  }

  function updateAnalyzeBtn() {
    const btn = document.getElementById('analyze-triggers-btn');
    if (btn) {
      btn.disabled = selectedTriggers.size === 0 && !document.getElementById('custom-trigger')?.value?.trim();
    }
  }

  async function analyzeTriggers() {
    const customInput = document.getElementById('custom-trigger')?.value?.trim() || '';
    const examType = document.getElementById('trigger-exam-type')?.value || 'competitive exam';
    
    const allTriggers = [
      ...Array.from(selectedTriggers).map(id => {
        const t = PREDEFINED_TRIGGERS.find(p => p.id === id);
        return t ? t.label : id;
      }),
      ...(customInput ? [customInput.slice(0, 100)] : [])
    ];

    if (allTriggers.length === 0) {
      Utils.toast('Please select at least one trigger', 'warning');
      return;
    }

    // Save trigger entry
    const entry = {
      id: Utils.uuid(),
      timestamp: Date.now(),
      todayKey: Utils.todayKey(),
      triggers: allTriggers,
      examType
    };
    Storage.append('trigger_history', entry);

    // Show loading
    const resultsEl = document.getElementById('trigger-analysis-result');
    resultsEl.innerHTML = `
      <div class="ai-loading" aria-live="polite" aria-label="AI analyzing your triggers">
        <div class="loading-pulse"></div>
        <p>StressLess AI is analyzing your triggers...</p>
      </div>`;
    resultsEl.classList.remove('hidden');
    resultsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const btn = document.getElementById('analyze-triggers-btn');
    Utils.setButtonLoading(btn, true, 'Analyzing...');
    
    try {
      const analysis = await GeminiService.analyzeStressTriggers(allTriggers, examType);
      
      resultsEl.innerHTML = `
        <div class="ai-response-card" role="region" aria-label="AI Trigger Analysis">
          <div class="ai-response-header">
            <span class="ai-badge">🤖 StressLess AI</span>
            <span class="ai-time">${Utils.formatTime(Date.now())}</span>
          </div>
          <div class="ai-response-body">${formatAIResponse(analysis)}</div>
          <div class="trigger-tags" aria-label="Selected triggers">
            ${allTriggers.map(t => `<span class="tag">${Utils.sanitize(t)}</span>`).join('')}
          </div>
        </div>`;

      // Crisis check on analysis context
      CrisisDetector.checkAndHandle(allTriggers.join(' '));
    } catch (e) {
      resultsEl.innerHTML = `<div class="ai-error">
        <p>⚠️ AI analysis unavailable. Please check your API key in config.js</p>
        <p class="ai-error-tip">Tip: ${PREDEFINED_TRIGGERS.find(t => selectedTriggers.has(t.id))?.label || 'Your triggers'} are common among exam students. You're not alone! 💙</p>
      </div>`;
    }
    
    Utils.setButtonLoading(btn, false);
    renderTriggerHistory();
  }

  function formatAIResponse(text) {
    // Convert markdown-like formatting to HTML safely
    return text
      .split('\n')
      .map(line => {
        const safe = Utils.sanitize(line);
        if (line.startsWith('## ')) return `<h3>${safe.replace('## ', '')}</h3>`;
        if (line.startsWith('# ')) return `<h3>${safe.replace('# ', '')}</h3>`;
        if (line.startsWith('**') && line.endsWith('**')) return `<strong>${safe.slice(2, -2)}</strong>`;
        if (line.startsWith('- ') || line.startsWith('• ')) return `<li>${safe.slice(2)}</li>`;
        if (line.startsWith('* ')) return `<li>${safe.slice(2)}</li>`;
        if (line.trim() === '') return '<br>';
        return `<p>${safe}</p>`;
      })
      .join('')
      .replace(/<li>/g, '<ul><li>').replace(/<\/li>\s*<p>/g, '</li></ul><p>');
  }

  function renderTriggerHistory() {
    const container = document.getElementById('trigger-history');
    if (!container) return;
    
    const history = Storage.getRecent('trigger_history', 14);
    
    if (history.length === 0) {
      container.innerHTML = '<p class="empty-state">No trigger sessions yet.</p>';
      return;
    }
    
    container.innerHTML = [...history].reverse().slice(0, 5).map(entry => `
      <div class="trigger-history-item">
        <span class="thi-date">${Utils.formatDate(entry.timestamp)}</span>
        <div class="trigger-tags">
          ${entry.triggers.map(t => `<span class="tag">${Utils.sanitize(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  return { init, analyzeTriggers, formatAIResponse };
})();
