/**
 * StressLess Student AI - Reflection Journal Module
 */

const Journal = (() => {
  const PROMPTS = [
    { id: 'went_well', icon: '✅', label: 'What went well today?', placeholder: 'Describe your wins, big or small...' },
    { id: 'challenged', icon: '💪', label: 'What challenged me today?', placeholder: 'What was difficult? How did you respond?...' },
    { id: 'improve', icon: '🎯', label: 'What will I improve tomorrow?', placeholder: 'Set one specific intention for tomorrow...' }
  ];

  function init() {
    renderJournalPrompts();
    renderJournalHistory();
    updateStreak();
  }

  function renderJournalPrompts() {
    const container = document.getElementById('journal-prompts');
    if (!container) return;

    container.innerHTML = PROMPTS.map(prompt => `
      <div class="journal-prompt-card">
        <label for="journal-${prompt.id}" class="journal-prompt-label">
          <span aria-hidden="true">${prompt.icon}</span> ${prompt.label}
        </label>
        <textarea 
          id="journal-${prompt.id}"
          name="${prompt.id}"
          class="journal-textarea"
          placeholder="${prompt.placeholder}"
          rows="3"
          maxlength="1000"
          aria-label="${prompt.label}"
          aria-describedby="journal-${prompt.id}-count"
        ></textarea>
        <div class="char-count" id="journal-${prompt.id}-count" aria-live="polite" aria-atomic="true">0/1000</div>
      </div>
    `).join('');

    // Character count listeners
    PROMPTS.forEach(prompt => {
      const textarea = document.getElementById(`journal-${prompt.id}`);
      const counter = document.getElementById(`journal-${prompt.id}-count`);
      if (textarea && counter) {
        textarea.addEventListener('input', () => {
          counter.textContent = `${textarea.value.length}/1000`;
        });
      }
    });
  }

  function saveEntry() {
    const entries = {};
    let hasContent = false;
    
    PROMPTS.forEach(prompt => {
      const el = document.getElementById(`journal-${prompt.id}`);
      const value = el?.value?.trim() || '';
      entries[prompt.id] = value.slice(0, 1000);
      if (value) hasContent = true;
    });

    if (!hasContent) {
      Utils.toast('Please write at least one response before saving', 'warning');
      return;
    }

    const moodData = MoodTracker.getLatestMoodData();
    
    const journalEntry = {
      id: Utils.uuid(),
      timestamp: Date.now(),
      todayKey: Utils.todayKey(),
      ...entries,
      mood: moodData?.mood || null,
      moodEmoji: moodData?.emoji || null
    };

    Storage.append('journal_history', journalEntry);

    // Check for crisis indicators in journal
    const fullText = Object.values(entries).join(' ');
    CrisisDetector.checkAndHandle(fullText);

    // Clear form
    PROMPTS.forEach(prompt => {
      const el = document.getElementById(`journal-${prompt.id}`);
      if (el) {
        el.value = '';
        const counter = document.getElementById(`journal-${prompt.id}-count`);
        if (counter) counter.textContent = '0/1000';
      }
    });

    Utils.toast('✏️ Journal entry saved! Keep reflecting daily.', 'success');
    renderJournalHistory();
    updateStreak();
    if (typeof Dashboard !== 'undefined') Dashboard.refresh();
  }

  function renderJournalHistory() {
    const container = document.getElementById('journal-history');
    if (!container) return;

    const history = Storage.getRecent('journal_history', 30);

    if (history.length === 0) {
      container.innerHTML = '<p class="empty-state">Your journal is empty. Start your reflection journey! ✏️</p>';
      return;
    }

    container.innerHTML = [...history].reverse().slice(0, 10).map(entry => `
      <details class="journal-entry" aria-label="Journal entry from ${Utils.formatDate(entry.timestamp)}">
        <summary class="journal-entry-summary">
          <span class="je-date">${Utils.formatDate(entry.timestamp)}</span>
          ${entry.moodEmoji ? `<span class="je-mood" aria-label="Mood: ${entry.mood}">${entry.moodEmoji}</span>` : ''}
          <span class="je-preview">${Utils.sanitize((entry.went_well || entry.challenged || entry.improve || '').slice(0, 60))}...</span>
        </summary>
        <div class="journal-entry-body">
          ${PROMPTS.map(p => entry[p.id] ? `
            <div class="je-section">
              <span class="je-icon" aria-hidden="true">${p.icon}</span>
              <div>
                <strong>${p.label}</strong>
                <p>${Utils.sanitize(entry[p.id])}</p>
              </div>
            </div>
          ` : '').join('')}
        </div>
      </details>
    `).join('');
  }

  function updateStreak() {
    const streakEl = document.getElementById('journal-streak');
    if (!streakEl) return;

    const history = Storage.getAll('journal_history');
    const streak = calculateStreak(history);
    streakEl.textContent = streak;
    
    const streakCard = document.getElementById('streak-card');
    if (streakCard) {
      streakCard.querySelector('.streak-value').textContent = streak;
    }
  }

  function calculateStreak(history) {
    if (history.length === 0) return 0;

    const dayKeys = [...new Set(history.map(e => e.todayKey))].sort().reverse();
    
    let streak = 0;
    let current = new Date();
    current.setHours(0, 0, 0, 0);

    for (const dayKey of dayKeys) {
      const entryDate = new Date(dayKey + 'T00:00:00');
      const diff = Math.round((current - entryDate) / (1000 * 60 * 60 * 24));
      
      if (diff === streak) {
        streak++;
        current = entryDate;
      } else {
        break;
      }
    }

    return streak;
  }

  function getJournalStats() {
    const history = Storage.getAll('journal_history');
    const weekHistory = Storage.getRecent('journal_history', 7);
    return {
      total: history.length,
      thisWeek: weekHistory.length,
      streak: calculateStreak(history)
    };
  }

  return { init, saveEntry, getJournalStats };
})();
