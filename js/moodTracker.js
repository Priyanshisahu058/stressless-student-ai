// Mood Tracker: render moods, save to Storage, expose API
const MoodTracker = (() => {
  const MOODS = [
    { id: 'happy', label: 'Happy', emoji: '😊', color: '#2DD4BF' },
    { id: 'okay', label: 'Okay', emoji: '🙂', color: '#6C63FF' },
    { id: 'stressed', label: 'Stressed', emoji: '😰', color: '#F59E0B' },
    { id: 'anxious', label: 'Anxious', emoji: '😟', color: '#EF4444' },
    { id: 'burnout', label: 'Burnout', emoji: '😩', color: '#FF7A7A' },
    { id: 'focused', label: 'Focused', emoji: '🧠', color: '#22C55E' }
  ];

  let selected = null;

  function init(){
    renderGrid();
    renderHistory();
    const note = document.getElementById('mood-note');
    if (note) note.value = '';
    const btn = document.getElementById('log-mood-btn');
    if (btn) btn.disabled = true;
  }

  function renderGrid(){
    const grid = document.getElementById('mood-grid');
    if (!grid) return;
    grid.innerHTML = '';
    MOODS.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'mood-btn';
      btn.setAttribute('aria-pressed','false');
      btn.innerHTML = `<div class="mood-emoji" aria-hidden="true">${m.emoji}</div><div class="mood-label">${m.label}</div>`;
      btn.addEventListener('click', ()=>{
        selected = m;
        document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('mood-btn--selected'));
        btn.classList.add('mood-btn--selected');
        const noteSection = document.getElementById('mood-note-section');
        if (noteSection) noteSection.classList.remove('hidden');
        const logBtn = document.getElementById('log-mood-btn'); if (logBtn) logBtn.disabled = false;
      });
      grid.appendChild(btn);
    });
  }

  function logMood(){
    if (!selected) return Utils.toast('Select a mood first','warning');
    const note = document.getElementById('mood-note')?.value?.trim() || '';
    const entry = { id: 'm_'+Date.now(), moodId: selected.id, label: selected.label, emoji: selected.emoji, note, timestamp: Date.now() };
    const history = Storage.get('mood_entries', []);
    history.unshift(entry);
    Storage.set('mood_entries', history.slice(0, 200));
    Utils.toast('Mood logged','success');
    renderHistory();
    App.updateHeaderMood?.();
  }

  function renderHistory(){
    const list = document.getElementById('mood-history');
    if (!list) return;
    const history = Storage.get('mood_entries', []);
    list.innerHTML = '';
    history.slice(0,10).forEach(e => {
      const el = document.createElement('div'); el.className = 'mood-history-item';
      el.innerHTML = `<div class="mhi-emoji">${Utils.escapeHtml(e.emoji)}</div>
        <div class="mhi-details"><div class="mhi-label">${Utils.escapeHtml(e.label)}</div>
        <div class="mhi-time">${Utils.formatTime(e.timestamp)}</div>
        ${e.note?`<div class="mhi-note">${Utils.sanitize(e.note)}</div>`:''}
        </div>`;
      list.appendChild(el);
    });
  }

  function getLatestMoodData(){
    const history = Storage.get('mood_entries', []);
    return history && history.length ? history[0] : null;
  }

  return { init, logMood, getLatestMoodData };
})();
