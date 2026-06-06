/**
 * StressLess Student AI - Mood Tracker
 * Fixed: aria-pressed toggled correctly, updateHeaderMood exposed via App.
 */
const MoodTracker = (() => {
  const MOODS = [
    { id: 'happy',   label: 'Happy',   emoji: '😊', color: '#2DD4BF' },
    { id: 'focused', label: 'Focused', emoji: '🧠', color: '#22C55E' },
    { id: 'okay',    label: 'Okay',    emoji: '🙂', color: '#6C63FF' },
    { id: 'stressed',label: 'Stressed',emoji: '😰', color: '#F59E0B' },
    { id: 'anxious', label: 'Anxious', emoji: '😟', color: '#EF4444' },
    { id: 'burnout', label: 'Burnout', emoji: '😩', color: '#FF7A7A' }
  ];

  let selected = null;

  function init() {
    renderGrid();
    renderHistory();
    const note = document.getElementById('mood-note');
    if (note) note.value = '';
    const noteSection = document.getElementById('mood-note-section');
    if (noteSection) noteSection.classList.add('hidden');
    const btn = document.getElementById('log-mood-btn');
    if (btn) btn.disabled = true;
    selected = null;
  }

  function renderGrid() {
    const grid = document.getElementById('mood-grid');
    if (!grid) return;
    grid.innerHTML = '';

    MOODS.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'mood-btn';
      btn.setAttribute('type', 'button');
      btn.setAttribute('aria-pressed', 'false');
      btn.setAttribute('aria-label', `Select mood: ${m.label}`);
      btn.style.setProperty('--mood-color', m.color);
      btn.innerHTML = `
        <div class="mood-emoji" aria-hidden="true">${m.emoji}</div>
        <div class="mood-label">${m.label}</div>`;

      btn.addEventListener('click', () => selectMood(m, btn));
      grid.appendChild(btn);
    });
  }

  function selectMood(m, clickedBtn) {
    selected = m;

    // Update aria-pressed on ALL mood buttons
    document.querySelectorAll('#mood-grid .mood-btn').forEach(b => {
      b.classList.remove('mood-btn--selected');
      b.setAttribute('aria-pressed', 'false');
    });
    clickedBtn.classList.add('mood-btn--selected');
    clickedBtn.setAttribute('aria-pressed', 'true');

    const noteSection = document.getElementById('mood-note-section');
    if (noteSection) noteSection.classList.remove('hidden');

    const logBtn = document.getElementById('log-mood-btn');
    if (logBtn) logBtn.disabled = false;

    // Announce to screen readers
    const announcer = document.getElementById('mood-announcer');
    if (announcer) announcer.textContent = `${m.label} selected.`;
  }

  function logMood() {
    if (!selected) {
      Utils.toast('Please select a mood first.', 'warning');
      document.querySelector('#mood-grid .mood-btn')?.focus();
      return;
    }

    const noteEl = document.getElementById('mood-note');
    const note   = noteEl ? noteEl.value.trim().slice(0, 500) : '';

    // Validate note length
    if (note.length > 500) {
      Utils.toast('Note too long (max 500 characters).', 'warning');
      return;
    }

    const entry = {
      id:        'm_' + Date.now(),
      moodId:    selected.id,
      label:     selected.label,
      emoji:     selected.emoji,
      color:     selected.color,
      note,
      timestamp: Date.now()
    };

    const history = Storage.get('mood_entries', []) || [];
    history.unshift(entry);
    Storage.set('mood_entries', history.slice(0, 500));

    Utils.toast(`${selected.emoji} ${selected.label} mood logged!`, 'success');

    // Reset UI
    if (noteEl) noteEl.value = '';
    const noteSection = document.getElementById('mood-note-section');
    if (noteSection) noteSection.classList.add('hidden');
    const logBtn = document.getElementById('log-mood-btn');
    if (logBtn) logBtn.disabled = true;

    document.querySelectorAll('#mood-grid .mood-btn').forEach(b => {
      b.classList.remove('mood-btn--selected');
      b.setAttribute('aria-pressed', 'false');
    });
    selected = null;

    renderHistory();

    // Update header mood badge
    if (typeof App !== 'undefined' && App.updateHeaderMood) {
      App.updateHeaderMood();
    }

    // Refresh dashboard if active
    if (typeof Dashboard !== 'undefined' && Dashboard.refresh) {
      Dashboard.refresh();
    }
  }

  function renderHistory() {
    const list = document.getElementById('mood-history');
    if (!list) return;

    const history = Storage.get('mood_entries', []) || [];

    if (!history.length) {
      list.innerHTML = `<p class="empty-state">No mood logs yet. Track your first mood above! 😊</p>`;
      return;
    }

    list.innerHTML = '';
    history.slice(0, 10).forEach(e => {
      const el = document.createElement('div');
      el.className = 'mood-history-item';
      el.setAttribute('role', 'article');
      el.setAttribute('aria-label', `Mood: ${e.label} logged on ${Utils.formatTime(e.timestamp)}`);
      el.innerHTML = `
        <div class="mhi-emoji" aria-hidden="true">${Utils.escapeHtml(e.emoji)}</div>
        <div class="mhi-details">
          <div class="mhi-label">${Utils.escapeHtml(e.label)}</div>
          <div class="mhi-time">${Utils.formatTime(e.timestamp)}</div>
          ${e.note ? `<div class="mhi-note">${Utils.sanitize(e.note)}</div>` : ''}
        </div>`;
      list.appendChild(el);
    });
  }

  function getLatestMoodData() {
    const history = Storage.get('mood_entries', []) || [];
    return history.length ? history[0] : null;
  }

  return { init, logMood, getLatestMoodData };
})();
