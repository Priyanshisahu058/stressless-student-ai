/**
 * StressLess Student AI - Dashboard
 * Fixed: chart duplication, real mood scores, real weekly summary, null checks.
 */
const Dashboard = (() => {
  let moodChart     = null;
  let wellnessChart = null;

  const MOOD_SCORE_MAP = {
    happy: 5, okay: 4, focused: 5, neutral: 3,
    stressed: 2, anxious: 2, burnout: 1, sad: 1
  };

  function init() {
    renderStats();
    initCharts();
    renderWeeklySummary();
  }

  function renderStats() {
    const moodEntries    = Storage.get('mood_entries',    []) || [];
    const wellnessEntries= Storage.get('wellness_entries',[]) || [];
    const journalEntries = Storage.get('journal_entries', []) || [];

    const avg = wellnessEntries.length
      ? Math.round(wellnessEntries.reduce((s, w) => s + (w.score || 0), 0) / wellnessEntries.length)
      : null;

    const uniqueDays = new Set(
      moodEntries.map(m => new Date(m.timestamp).toDateString())
    ).size;

    safeSet('dashboard-streak',      calcStreak(journalEntries));
    safeSet('dashboard-mood-count',  moodEntries.length || '–');
    safeSet('dashboard-avg-score',   avg !== null ? avg : '–');
    safeSet('dashboard-days-tracked',uniqueDays || '–');
  }

  function safeSet(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function calcStreak(entries) {
    if (!entries || !entries.length) return 0;
    const days = [...new Set(entries.map(e =>
      new Date(e.timestamp).toDateString()
    ))].map(d => new Date(d)).sort((a, b) => b - a);

    let streak = 1;
    for (let i = 1; i < days.length; i++) {
      const diff = Math.round((days[i - 1] - days[i]) / 86400000);
      if (diff === 1) streak++;
      else break;
    }
    return streak;
  }

  function getLast7Labels() {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }));
    }
    return labels;
  }

  function getMoodDataForWeek() {
    const entries  = Storage.get('mood_entries', []) || [];
    const labels   = getLast7Labels();
    const dayMap   = {};

    entries.forEach(e => {
      const label = new Date(e.timestamp).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      const score = MOOD_SCORE_MAP[e.moodId] || 3;
      // Keep the last entry per day
      dayMap[label] = score;
    });

    return { labels, data: labels.map(l => dayMap[l] ?? null) };
  }

  function getWellnessDataForWeek() {
    const entries = Storage.get('wellness_entries', []) || [];
    const labels  = getLast7Labels();
    const dayMap  = {};

    entries.forEach(e => {
      const label = new Date(e.timestamp).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
      dayMap[label] = e.score;
    });

    return { labels, data: labels.map(l => dayMap[l] ?? null) };
  }

  function destroyCharts() {
    if (moodChart)     { try { moodChart.destroy();     } catch (e) {} moodChart = null; }
    if (wellnessChart) { try { wellnessChart.destroy(); } catch (e) {} wellnessChart = null; }
  }

  function initCharts() {
    destroyCharts(); // Always destroy before re-creating to prevent duplication

    if (typeof Chart === 'undefined') return;

    const moodCtx     = document.getElementById('mood-chart');
    const wellnessCtx = document.getElementById('wellness-chart');

    const moodData     = getMoodDataForWeek();
    const wellnessData = getWellnessDataForWeek();

    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: { labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 12 } } },
        tooltip: {
          backgroundColor: 'rgba(10,10,30,0.95)',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,0.75)',
          borderColor: 'rgba(108,99,255,0.4)',
          borderWidth: 1,
          padding: 12
        }
      },
      scales: {
        x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.55)', font: { size: 11 } } },
        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: 'rgba(255,255,255,0.55)', font: { size: 11 } } }
      }
    };

    try {
      if (moodCtx) {
        moodChart = new Chart(moodCtx, {
          type: 'line',
          data: {
            labels: moodData.labels,
            datasets: [{
              label: 'Mood Score (1–5)',
              data: moodData.data,
              borderColor: '#6C63FF',
              backgroundColor: 'rgba(108,99,255,0.12)',
              pointBackgroundColor: '#6C63FF',
              pointRadius: 5,
              pointHoverRadius: 8,
              borderWidth: 2.5,
              fill: true,
              tension: 0.4,
              spanGaps: true
            }]
          },
          options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 0, max: 5 } } }
        });
      }

      if (wellnessCtx) {
        const colors = wellnessData.data.map(s =>
          s === null        ? 'rgba(255,255,255,0.05)'
          : s >= 75         ? 'rgba(45,212,191,0.75)'
          : s >= 50         ? 'rgba(108,99,255,0.75)'
          : s >= 25         ? 'rgba(245,158,11,0.75)'
          : 'rgba(239,68,68,0.75)'
        );
        wellnessChart = new Chart(wellnessCtx, {
          type: 'bar',
          data: {
            labels: wellnessData.labels,
            datasets: [{
              label: 'Wellness Score (0–100)',
              data: wellnessData.data,
              backgroundColor: colors,
              borderRadius: 8,
              borderSkipped: false
            }]
          },
          options: { ...chartDefaults, scales: { ...chartDefaults.scales, y: { ...chartDefaults.scales.y, min: 0, max: 100 } } }
        });
      }
    } catch (e) {
      console.warn('Charts error:', e);
    }
  }

  async function renderWeeklySummary() {
    const container = document.getElementById('weekly-summary');
    if (!container) return;

    const moodEntries     = Storage.get('mood_entries',    []) || [];
    const wellnessEntries = Storage.get('wellness_entries',[]) || [];
    const journalEntries  = Storage.get('journal_entries', []) || [];

    // Filter last 7 days
    const cutoff = Date.now() - 7 * 86400000;
    const weekMoods     = moodEntries.filter(e => e.timestamp >= cutoff);
    const weekWellness  = wellnessEntries.filter(e => e.timestamp >= cutoff);
    const weekJournals  = journalEntries.filter(e => e.timestamp >= cutoff);

    if (weekMoods.length === 0 && weekWellness.length === 0) {
      container.innerHTML = '<p class="empty-state">Start tracking your mood and wellness to see your weekly AI insights here! 📊</p>';
      return;
    }

    const avgMood = weekMoods.length
      ? (weekMoods.reduce((s, m) => s + (MOOD_SCORE_MAP[m.moodId] || 3), 0) / weekMoods.length).toFixed(1)
      : null;
    const avgScore = weekWellness.length
      ? Math.round(weekWellness.reduce((s, w) => s + w.score, 0) / weekWellness.length)
      : null;
    const trackedDays = new Set(weekMoods.map(m => new Date(m.timestamp).toDateString())).size;

    container.innerHTML = `<div class="ai-loading" aria-live="polite"><div class="loading-pulse"></div><p>Generating your weekly insights…</p></div>`;

    try {
      const summary = await GeminiService.weeklySummary({
        avgMood, avgScore,
        moodCount: weekMoods.length,
        journalCount: weekJournals.length,
        trackedDays
      });

      if (summary) {
        container.innerHTML = `
          <div class="ai-response-card">
            <div class="ai-response-header">
              <span class="ai-badge">🤖 Weekly AI Insights</span>
              <span class="ai-time">${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}</span>
            </div>
            <div class="ai-response-body">${formatText(summary)}</div>
          </div>`;
      } else {
        renderStatsSummary(container, avgMood, avgScore, weekJournals.length, trackedDays);
      }
    } catch (e) {
      renderStatsSummary(container, avgMood, avgScore, weekJournals.length, trackedDays);
    }
  }

  function renderStatsSummary(container, avgMood, avgScore, journalCount, trackedDays) {
    container.innerHTML = `
      <div class="summary-stats-grid" role="list">
        <div class="summary-stat" role="listitem"><span class="ss-label">Avg Mood</span><span class="ss-value">${avgMood ? avgMood + '/5' : '–'}</span></div>
        <div class="summary-stat" role="listitem"><span class="ss-label">Avg Wellness</span><span class="ss-value">${avgScore ? avgScore + '/100' : '–'}</span></div>
        <div class="summary-stat" role="listitem"><span class="ss-label">Journal Entries</span><span class="ss-value">${journalCount}</span></div>
        <div class="summary-stat" role="listitem"><span class="ss-label">Days Tracked</span><span class="ss-value">${trackedDays}/7</span></div>
      </div>
      <p class="empty-state" style="margin-top:0.75rem">Add your Gemini API key to get AI-powered weekly insights!</p>`;
  }

  function formatText(text) {
    if (!text) return '';
    return text.split('\n').map(line => {
      const safe = Utils.escapeHtml(line);
      if (/^\*\*(.+)\*\*$/.test(line)) return `<strong>${Utils.escapeHtml(line.slice(2, -2))}</strong>`;
      if (/^[-•*] /.test(line)) return `<li>${Utils.escapeHtml(line.slice(2))}</li>`;
      if (/^#{1,3} /.test(line)) return `<h4>${Utils.escapeHtml(line.replace(/^#+\s/, ''))}</h4>`;
      if (!line.trim()) return '<br>';
      return `<p>${safe}</p>`;
    }).join('').replace(/(<li>.*<\/li>)+/g, m => `<ul>${m}</ul>`);
  }

  function refresh() {
    renderStats();
    // Refresh chart data without full re-init if charts exist
    if (moodChart && wellnessChart) {
      const moodData     = getMoodDataForWeek();
      const wellnessData = getWellnessDataForWeek();
      moodChart.data.datasets[0].data     = moodData.data;
      wellnessChart.data.datasets[0].data = wellnessData.data;
      moodChart.update();
      wellnessChart.update();
    }
  }

  return { init, refresh };
})();
