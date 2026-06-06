/**
 * StressLess Student AI - Journal Module
 * Fixed: real streak calculation, empty-entry validation, aria improvements.
 */
const Journal = (() => {
  const PROMPTS = [
    'What is one thing that went well today in your studies?',
    'What is one challenge you faced today, and how did you respond to it?',
    'What is one thing you are grateful for right now?'
  ];

  function init() {
    renderPrompts();
    renderHistory();
  }

  function renderPrompts() {
    const container = document.getElementById('journal-prompts');
    if (!container) return;
    container.innerHTML = '';
    PROMPTS.forEach((prompt, i) => {
      const id = `journal-answer-${i}`;
      const div = document.createElement('div');
      div.className = 'form-group';
      div.innerHTML = `
        <label class="form-label" for="${id}">${Utils.escapeHtml(prompt)}</label>
        <textarea
          id="${id}"
          class="form-textarea"
          placeholder="Write your thoughts here…"
          rows="3"
          maxlength="1000"
          aria-required="false"
          aria-describedby="${id}-count"
        ></textarea>
        <div id="${id}-count" class="char-count" aria-live="polite" aria-atomic="true">0 / 1000</div>`;
      container.appendChild(div);

      const ta = div.querySelector('textarea');
      const counter = div.querySelector('.char-count');
      ta.addEventListener('input', () => {
        counter.textContent = `${ta.value.length} / 1000`;
      });
    });

    // Set today's date label
    const dateEl = document.getElementById('journal-date');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }
  }

  function saveEntry() {
    const answers = PROMPTS.map((_, i) => {
      const el = document.getElementById(`journal-answer-${i}`);
      return el ? el.value.trim() : '';
    });

    // Validation: at least one prompt answered
    if (answers.every(a => !a)) {
      Utils.toast('Please answer at least one prompt before saving.', 'warning');
      document.getElementById('journal-answer-0')?.focus();
      return;
    }

    const entry = {
      id:        'j_' + Date.now(),
      timestamp: Date.now(),
      date:      new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
      prompts:   PROMPTS,
      answers
    };

    const history = Storage.get('journal_entries', []) || [];
    history.unshift(entry);
    Storage.set('journal_entries', history.slice(0, 365)); // Keep 1 year

    Utils.toast('Journal entry saved! 📝', 'success');

    // Update streak display
    const streakEl = document.getElementById('journal-streak');
    if (streakEl) streakEl.textContent = `🔥 ${calcStreak(history)}-day streak`;

    // Clear form
    PROMPTS.forEach((_, i) => {
      const el = document.getElementById(`journal-answer-${i}`);
      if (el) el.value = '';
      const counter = document.getElementById(`journal-answer-${i}-count`);
      if (counter) counter.textContent = '0 / 1000';
    });

    renderHistory();
  }

  /** Real consecutive-day streak calculation */
  function calcStreak(entries) {
    if (!entries || !entries.length) return 0;
    const uniqueDays = [...new Set(
      entries.map(e => new Date(e.timestamp).toDateString())
    )].map(d => new Date(d)).sort((a, b) => b - a);

    // Check if today or yesterday is included (otherwise streak is broken)
    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const mostRecent = uniqueDays[0].toDateString();
    if (mostRecent !== today && mostRecent !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const diffDays = Math.round((uniqueDays[i - 1] - uniqueDays[i]) / 86400000);
      if (diffDays === 1) streak++;
      else break;
    }
    return streak;
  }

  function renderHistory() {
    const container = document.getElementById('journal-history');
    if (!container) return;

    const history = Storage.get('journal_entries', []) || [];

    // Update streak
    const streakEl = document.getElementById('journal-streak');
    if (streakEl) {
      const s = calcStreak(history);
      streakEl.textContent = s > 0 ? `🔥 ${s}-day streak` : 'Start your streak today!';
    }

    if (!history.length) {
      container.innerHTML = `<p class="empty-state">No journal entries yet. Your reflections will appear here.</p>`;
      return;
    }

    container.innerHTML = '';
    history.slice(0, 30).forEach(entry => {
      const details = document.createElement('details');
      details.className = 'journal-entry';
      details.setAttribute('aria-label', `Journal entry from ${entry.date}`);

      const answeredCount = entry.answers.filter(a => a).length;
      const preview = entry.answers.find(a => a) || '';

      details.innerHTML = `
        <summary class="journal-entry-summary">
          <span class="je-date">${Utils.escapeHtml(entry.date)}</span>
          <span class="je-meta">${answeredCount} of ${PROMPTS.length} prompts answered</span>
          <span class="je-preview">${Utils.escapeHtml(preview.slice(0, 60))}${preview.length > 60 ? '…' : ''}</span>
        </summary>
        <div class="journal-entry-body">
          ${entry.prompts.map((p, i) => entry.answers[i] ? `
            <div class="journal-qa">
              <div class="journal-question">${Utils.escapeHtml(p)}</div>
              <div class="journal-answer">${Utils.sanitize(entry.answers[i])}</div>
            </div>` : '').join('')}
        </div>`;
      container.appendChild(details);
    });
  }

  return { init, saveEntry };
})();
