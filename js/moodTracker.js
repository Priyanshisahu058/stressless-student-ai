/**
 * StressLess Student AI - Mood Tracker Module
 */

const MoodTracker = (() => {
  const MOODS = [
    { id: 'happy', emoji: '😊', label: 'Happy', score: 5, color: '#2DD4BF' },
    { id: 'neutral', emoji: '😐', label: 'Neutral', score: 3, color: '#6C63FF' },
    { id: 'sad', emoji: '😢', label: 'Sad', score: 2, color: '#60A5FA' },
    { id: 'stressed', emoji: '😰', label: 'Stressed', score: 1, color: '#F59E0B' },
    { id: 'anxious', emoji: '😟', label: 'Anxious', score: 1, color: '#EF4444' },
    { id: 'burnedout', emoji: '😵', label: 'Burned Out', score: 1, color: '#9CA3AF' }
  ];

  let selectedMood = null;

  function init() {
    renderMoodGrid();
    renderMoodHistory();
    updateTodayMoodDisplay();
  }

  function renderMoodGrid() {
    const grid = document.getElementById('mood-grid');
    if (!grid) return;
    
    grid.innerHTML = MOODS.map(mood => `
      <button 
        class="mood-btn" 
        data-mood="${mood.id}"
        data-score="${mood.score}"
        aria-label="Log mood: ${mood.label}"
        aria-pressed="false"
        style="--mood-color: ${mood.color}"
      >
        <span class="mood-emoji" aria-hidden="true">${mood.emoji}</span>
        <span class="mood-label">${mood.label}</span>
      </button>
    `).join('');

    grid.querySelectorAll('.mood-btn').forEach(btn => {
      btn.addEventListener('click', () => selectMood(btn));
    });
  }

  function selectMood(btn) {
    // Deselect previous
    document.querySelectorAll('.mood-btn').forEach(b => {
      b.classList.remove('mood-btn--selected');
      b.setAttribute('aria-pressed', 'false');
    });
    
    btn.classList.add('mood-btn--selected');
    btn.setAttribute('aria-pressed', 'true');
    selectedMood = btn.dataset.mood;
    
    document.getElementById('log-mood-btn').disabled = false;
    document.getElementById('mood-note-section').classList.remove('hidden');
    document.getElementById('mood-note-section').focus();
  }

  function logMood() {
    if (!selectedMood) {
      Utils.toast('Please select a mood first', 'warning');
      return;
    }
    
    const note = document.getElementById('mood-note')?.value?.trim() || '';
    const moodData = MOODS.find(m => m.id === selectedMood);
    
    const entry = {
      id: Utils.uuid(),
      timestamp: Date.now(),
      todayKey: Utils.todayKey(),
      mood: selectedMood,
      emoji: moodData.emoji,
      label: moodData.label,
      score: moodData.score,
      note: note.slice(0, 500) // Limit note length
    };
    
    Storage.append('mood_history', entry);
    
    // Clear selection
    document.querySelectorAll('.mood-btn').forEach(b => {
      b.classList.remove('mood-btn--selected');
      b.setAttribute('aria-pressed', 'false');
    });
    selectedMood = null;
    if (document.getElementById('mood-note')) document.getElementById('mood-note').value = '';
    document.getElementById('log-mood-btn').disabled = true;
    document.getElementById('mood-note-section').classList.add('hidden');
    
    Utils.toast(`${moodData.emoji} Mood logged! Keep tracking your journey.`, 'success');
    renderMoodHistory();
    updateTodayMoodDisplay();
    
    // Check for stress/crisis indicators
    if (note && (moodData.id === 'burnedout' || moodData.id === 'anxious' || moodData.id === 'stressed')) {
      CrisisDetector.checkAndHandle(note);
    }
    
    // Refresh dashboard if visible
    if (typeof Dashboard !== 'undefined') Dashboard.refresh();
  }

  function renderMoodHistory() {
    const container = document.getElementById('mood-history');
    if (!container) return;
    
    const history = Storage.getRecent('mood_history', 7);
    
    if (history.length === 0) {
      container.innerHTML = '<p class="empty-state">No mood entries yet. Log your first mood above! 🌟</p>';
      return;
    }
    
    const sorted = [...history].reverse();
    container.innerHTML = sorted.map(entry => `
      <div class="mood-history-item" role="article" aria-label="Mood on ${Utils.formatDate(entry.timestamp)}">
        <span class="mhi-emoji" aria-hidden="true">${entry.emoji}</span>
        <div class="mhi-details">
          <span class="mhi-label">${Utils.sanitize(entry.label)}</span>
          <span class="mhi-time">${Utils.formatDate(entry.timestamp)} • ${Utils.formatTime(entry.timestamp)}</span>
          ${entry.note ? `<p class="mhi-note">${Utils.sanitize(entry.note)}</p>` : ''}
        </div>
      </div>
    `).join('');
  }

  function updateTodayMoodDisplay() {
    const el = document.getElementById('today-mood-display');
    if (!el) return;
    
    const today = Utils.todayKey();
    const todayMoods = Storage.getAll('mood_history').filter(m => m.todayKey === today);
    
    if (todayMoods.length > 0) {
      const last = todayMoods[todayMoods.length - 1];
      el.textContent = `Today: ${last.emoji} ${last.label}`;
    } else {
      el.textContent = 'No mood logged today';
    }
  }

  function getLatestMoodData() {
    const history = Storage.getAll('mood_history');
    return history.length > 0 ? history[history.length - 1] : null;
  }

  function getMoodScoresForWeek() {
    const history = Storage.getRecent('mood_history', 7);
    const dayMap = {};
    const labels = Utils.last7DayLabels();
    
    // Group by day — take last mood of each day
    history.forEach(entry => {
      const day = new Date(entry.timestamp).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      dayMap[day] = entry.score;
    });
    
    return labels.map(label => dayMap[label] || null);
  }

  return { init, logMood, getMoodScoresForWeek, getLatestMoodData, MOODS };
})();
