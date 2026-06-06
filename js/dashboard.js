/**
 * StressLess Student AI - Progress Dashboard Module
 * Renders Chart.js visualizations and wellness summaries.
 */

const Dashboard = (() => {
  let moodChart = null;
  let wellnessChart = null;

  function init() {
    renderStatCards();
    renderMoodChart();
    renderWellnessChart();
    renderWeeklySummary();
  }

  function refresh() {
    renderStatCards();
    if (moodChart) {
      updateMoodChart();
    }
    if (wellnessChart) {
      updateWellnessChart();
    }
  }

  function renderStatCards() {
    // Journal streak
    const journalStats = Journal.getJournalStats();
    const streakEl = document.getElementById('dashboard-streak');
    if (streakEl) streakEl.textContent = journalStats.streak;

    // Total mood logs
    const moodHistory = Storage.getAll('mood_history');
    const moodCountEl = document.getElementById('dashboard-mood-count');
    if (moodCountEl) moodCountEl.textContent = moodHistory.length;

    // Average wellness score (last 7 days)
    const wellnessData = WellnessScore.getScoresForWeek();
    const avgEl = document.getElementById('dashboard-avg-score');
    if (avgEl) avgEl.textContent = wellnessData.average || '–';

    // Days logged this week
    const weekMoods = Storage.getRecent('mood_history', 7);
    const uniqueDays = new Set(weekMoods.map(m => m.todayKey)).size;
    const daysEl = document.getElementById('dashboard-days-tracked');
    if (daysEl) daysEl.textContent = `${uniqueDays}/7`;
  }

  function renderMoodChart() {
    const canvas = document.getElementById('mood-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = Utils.last7DayLabels();
    const data = MoodTracker.getMoodScoresForWeek();

    const ctx = canvas.getContext('2d');
    moodChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Mood Score',
          data,
          borderColor: '#6C63FF',
          backgroundColor: 'rgba(108, 99, 255, 0.12)',
          pointBackgroundColor: data.map(d => d !== null ? '#6C63FF' : 'transparent'),
          pointBorderColor: '#6C63FF',
          pointRadius: 6,
          pointHoverRadius: 8,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          spanGaps: true
        }]
      },
      options: getChartOptions('Mood Score (1–5)', 0, 5, true)
    });
  }

  function renderWellnessChart() {
    const canvas = document.getElementById('wellness-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const wellnessData = WellnessScore.getScoresForWeek();

    const ctx = canvas.getContext('2d');
    wellnessChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: wellnessData.labels,
        datasets: [{
          label: 'Wellness Score',
          data: wellnessData.scores,
          backgroundColor: wellnessData.scores.map(s =>
            s === null ? 'rgba(255,255,255,0.05)'
            : s >= 75 ? 'rgba(45, 212, 191, 0.7)'
            : s >= 50 ? 'rgba(108, 99, 255, 0.7)'
            : s >= 25 ? 'rgba(245, 158, 11, 0.7)'
            : 'rgba(239, 68, 68, 0.7)'
          ),
          borderColor: wellnessData.scores.map(s =>
            s === null ? 'transparent'
            : s >= 75 ? '#2DD4BF'
            : s >= 50 ? '#6C63FF'
            : s >= 25 ? '#F59E0B'
            : '#EF4444'
          ),
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: getChartOptions('Wellness Score (0–100)', 0, 100, false)
    });
  }

  function updateMoodChart() {
    if (!moodChart) return;
    moodChart.data.datasets[0].data = MoodTracker.getMoodScoresForWeek();
    moodChart.update();
  }

  function updateWellnessChart() {
    if (!wellnessChart) return;
    const wellnessData = WellnessScore.getScoresForWeek();
    wellnessChart.data.datasets[0].data = wellnessData.scores;
    wellnessChart.data.datasets[0].backgroundColor = wellnessData.scores.map(s =>
      s === null ? 'rgba(255,255,255,0.05)'
      : s >= 75 ? 'rgba(45, 212, 191, 0.7)'
      : s >= 50 ? 'rgba(108, 99, 255, 0.7)'
      : s >= 25 ? 'rgba(245, 158, 11, 0.7)'
      : 'rgba(239, 68, 68, 0.7)'
    );
    wellnessChart.update();
  }

  function getChartOptions(yLabel, yMin, yMax, showPoints) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { intersect: false, mode: 'index' },
      plugins: {
        legend: {
          labels: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 12 } }
        },
        tooltip: {
          backgroundColor: 'rgba(15, 15, 35, 0.95)',
          titleColor: '#fff',
          bodyColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(108,99,255,0.4)',
          borderWidth: 1,
          padding: 12,
          callbacks: {
            label: ctx => ctx.raw !== null ? `${yLabel.split('(')[0].trim()}: ${ctx.raw}` : 'No data'
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } }
        },
        y: {
          min: yMin,
          max: yMax,
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: 'rgba(255,255,255,0.6)', font: { size: 11 } },
          title: { display: true, text: yLabel, color: 'rgba(255,255,255,0.5)', font: { size: 11 } }
        }
      }
    };
  }

  async function renderWeeklySummary() {
    const container = document.getElementById('weekly-summary');
    if (!container) return;

    const moodHistory = Storage.getRecent('mood_history', 7);
    const wellnessData = WellnessScore.getScoresForWeek();
    const journalStats = Journal.getJournalStats();

    if (moodHistory.length === 0 && wellnessData.average === 0) {
      container.innerHTML = '<p class="empty-state">Start tracking your mood and wellness to see your weekly summary here! 📊</p>';
      return;
    }

    const avgMood = moodHistory.length > 0
      ? (moodHistory.reduce((s, m) => s + m.score, 0) / moodHistory.length).toFixed(1)
      : 0;

    container.innerHTML = `
      <div class="ai-loading" aria-live="polite">
        <div class="loading-pulse"></div>
        <p>Generating your weekly insights...</p>
      </div>`;

    try {
      const summary = await GeminiService.getWeeklySummary({
        avgMood: avgMood,
        avgScore: wellnessData.average,
        journalCount: journalStats.thisWeek,
        moodDays: new Set(moodHistory.map(m => m.todayKey)).size
      });

      container.innerHTML = `
        <div class="ai-response-card" role="region" aria-label="Weekly AI Summary">
          <div class="ai-response-header">
            <span class="ai-badge">🤖 Weekly Insights</span>
            <span class="ai-time">${Utils.formatDate(Date.now())}</span>
          </div>
          <div class="ai-response-body">${StressTriggers.formatAIResponse(summary)}</div>
        </div>`;
    } catch (e) {
      container.innerHTML = `
        <div class="summary-stats-grid" role="list">
          <div class="summary-stat" role="listitem">
            <span class="ss-label">Avg Mood</span>
            <span class="ss-value">${avgMood}/5</span>
          </div>
          <div class="summary-stat" role="listitem">
            <span class="ss-label">Avg Wellness</span>
            <span class="ss-value">${wellnessData.average}/100</span>
          </div>
          <div class="summary-stat" role="listitem">
            <span class="ss-label">Journal Entries</span>
            <span class="ss-value">${journalStats.thisWeek}</span>
          </div>
          <div class="summary-stat" role="listitem">
            <span class="ss-label">Days Tracked</span>
            <span class="ss-value">${new Set(moodHistory.map(m => m.todayKey)).size}/7</span>
          </div>
        </div>`;
    }
  }

  return { init, refresh };
})();
