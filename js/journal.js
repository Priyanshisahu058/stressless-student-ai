// Journal: prompts, save entries, streak
const Journal = (() => {
  const PROMPTS = [
    "What went well today?",
    "What was challenging and why?",
    "One thing I can improve tomorrow",
  ];

  function init(){
    renderPrompts();
    renderHistory();
  }

  function renderPrompts(){
    const container = document.getElementById('journal-prompts'); if (!container) return;
    container.innerHTML = '';
    PROMPTS.forEach((p,i)=>{
      const el = document.createElement('div'); el.className = 'journal-prompt-card';
      el.innerHTML = `<label class="journal-prompt-label">${Utils.escapeHtml(p)}</label>
        <textarea id="journal-p-${i}" class="journal-textarea" placeholder="Write your thoughts..."></textarea>`;
      container.appendChild(el);
    });
  }

  function saveEntry(){
    const answers = PROMPTS.map((p,i)=>document.getElementById('journal-p-'+i)?.value?.trim()||'');
    const entry = { id: 'j_'+Date.now(), date: new Date().toISOString(), answers, timestamp: Date.now() };
    const history = Storage.get('journal_entries', []);
    history.unshift(entry);
    Storage.set('journal_entries', history.slice(0,200));
    Utils.toast('Journal saved','success');
    renderHistory();
  }

  function renderHistory(){
    const container = document.getElementById('journal-history'); if (!container) return;
    const history = Storage.get('journal_entries', []);
    container.innerHTML = history.slice(0,8).map(h => `
      <details class="journal-entry"><summary class="journal-entry-summary"><div class="je-mood">✍️</div>
        <div class="je-preview">${Utils.sanitize(h.answers[0]||'No preview')}</div>
        <div class="je-date">${Utils.formatTime(h.timestamp)}</div></summary>
        <div class="journal-entry-body">${h.answers.map(a=>`<div class="je-section"><div class="je-icon">📝</div><div><strong>Response</strong><p>${Utils.sanitize(a)}</p></div></div>`).join('')}</div></details>`).join('');

    // Update streak
    const streakEl = document.getElementById('journal-streak'); if (streakEl) streakEl.textContent = history.length>0? history.length : 0;
  }

  return { init, saveEntry };
})();
