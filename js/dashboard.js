// Dashboard: charts and stats
const Dashboard = (() => {
  let moodChart = null, wellnessChart = null;

  function init(){
    renderStats();
    initCharts();
  }

  function renderStats(){
    const journalCount = (Storage.get('journal_entries',[])||[]).length;
    const moodCount = (Storage.get('mood_entries',[])||[]).length;
    const wellness = Storage.get('wellness_entries',[])||[];
    const avg = wellness.length? Math.round(wellness.reduce((s,w)=>s+w.score,0)/wellness.length) : '–';
    const days = new Set((Storage.get('mood_entries',[])||[]).map(m=>new Date(m.timestamp).toDateString())).size;
    document.getElementById('dashboard-streak').textContent = journalCount||'–';
    document.getElementById('dashboard-mood-count').textContent = moodCount||'–';
    document.getElementById('dashboard-avg-score').textContent = avg;
    document.getElementById('dashboard-days-tracked').textContent = days||'–';

    // Weekly AI summary (simulated)
    const weekly = document.getElementById('weekly-summary'); if (weekly) weekly.innerHTML = '<p>Weekly insights are available when Gemini API key is configured.</p>';
  }

  function initCharts(){
    try {
      const moodCtx = document.getElementById('mood-chart');
      const wellnessCtx = document.getElementById('wellness-chart');
      const moods = Storage.get('mood_entries',[]).slice(0,7).reverse();
      const wellness = Storage.get('wellness_entries',[]).slice(0,7).reverse();
      const labels = moods.map(m=>new Date(m.timestamp).toLocaleDateString());
      const moodScores = moods.map((m,i)=>3); // placeholder
      const wellnessScores = wellness.map(w=>w.score);

      if (moodCtx && window.Chart){
        moodChart = new Chart(moodCtx, { type: 'line', data: { labels, datasets: [{ label: 'Mood', data: moodScores, borderColor: '#6C63FF', backgroundColor: 'rgba(108,99,255,0.12)', tension:0.4 }] }, options: { responsive:true, maintainAspectRatio:false } });
      }
      if (wellnessCtx && window.Chart){
        wellnessChart = new Chart(wellnessCtx, { type: 'bar', data: { labels: wellness.map(w=>new Date(w.timestamp).toLocaleDateString()), datasets:[{ label:'Wellness', data: wellnessScores, backgroundColor:'#2DD4BF' }] }, options:{ responsive:true, maintainAspectRatio:false } });
      }
    } catch(e){ console.warn('Charts init error',e); }
  }

  function refresh(){ renderStats(); if (moodChart) moodChart.update(); if (wellnessChart) wellnessChart.update(); }

  return { init, refresh };
})();
