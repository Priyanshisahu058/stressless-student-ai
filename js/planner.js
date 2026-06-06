/**
 * StressLess Student AI - Study Wellness Planner
 * Fixed: input validation, error handling, plan persistence.
 */
const Planner = (() => {
  const EXAMS = ['JEE', 'NEET', 'CUET', 'CAT', 'GATE', 'UPSC', 'Board Exams', 'Other'];

  function init() {
    populateExamSelect();
    renderSavedPlan();
  }

  function populateExamSelect() {
    const select = document.getElementById('planner-exam-select');
    if (!select) return;
    select.innerHTML = '<option value="">— Select your exam —</option>';
    EXAMS.forEach(e => {
      const opt = document.createElement('option');
      opt.value = e;
      opt.textContent = e;
      select.appendChild(opt);
    });
  }

  async function generatePlan() {
    // ── Validation ──────────────────────────────────────────
    const examEl = document.getElementById('planner-exam-select');
    const exam   = examEl ? examEl.value.trim() : '';
    if (!exam) {
      Utils.toast('Please select your exam first.', 'warning');
      examEl?.focus();
      return;
    }

    const daysEl    = document.getElementById('planner-days');
    const stressEl  = document.getElementById('planner-stress');
    const studyEl   = document.getElementById('planner-study-hours');
    const sleepEl   = document.getElementById('planner-sleep-hours');

    const days        = Math.max(1, Math.min(365, parseInt(daysEl?.value)  || 30));
    const stressLevel = Math.max(1, Math.min(10,  parseInt(stressEl?.value) || 5));
    const studyHours  = Math.max(1, Math.min(16,  parseInt(studyEl?.value)  || 6));
    const sleepHours  = Math.max(4, Math.min(12,  parseInt(sleepEl?.value)  || 7));

    const resultEl = document.getElementById('planner-result');
    if (!resultEl) return;

    resultEl.innerHTML = `
      <div class="ai-loading" aria-live="polite">
        <div class="loading-pulse"></div>
        <p>Creating your personalized plan…</p>
        <p class="loading-sub">Tailoring for ${Utils.escapeHtml(exam)}</p>
      </div>`;

    const generateBtn = document.getElementById('generate-plan-btn');
    if (generateBtn) generateBtn.disabled = true;

    try {
      const plan = await GeminiService.generatePlan({
        examType: exam, daysRemaining: days,
        stressLevel, studyHours, sleepHours
      });

      const planText = plan || _fallbackPlan(exam, days, studyHours, sleepHours);

      // Save plan to storage
      Storage.set('saved_plan', {
        examType:  exam,
        timestamp: Date.now(),
        content:   planText
      });

      resultEl.innerHTML = `
        <div class="ai-response-card">
          <div class="ai-response-header">
            <span class="ai-badge">📅 Your Wellness Plan — ${Utils.escapeHtml(exam)}</span>
            <button class="btn btn--outline btn--small" id="download-plan-btn" aria-label="Download your wellness plan as a text file">
              ⬇ Download
            </button>
          </div>
          <div class="ai-response-body" id="plan-content">${formatPlan(planText)}</div>
        </div>`;

      document.getElementById('download-plan-btn')?.addEventListener('click', () => downloadPlan(planText, exam));
      resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    } catch (e) {
      resultEl.innerHTML = `
        <div class="ai-response-card">
          <div class="ai-response-header"><span class="ai-badge">⚠️ Error</span></div>
          <div class="ai-response-body"><p>Could not generate plan. Please try again.</p></div>
        </div>`;
      Utils.toast('Plan generation failed. Please try again.', 'error');
    } finally {
      if (generateBtn) generateBtn.disabled = false;
    }
  }

  function _fallbackPlan(exam, days, studyHours, sleepHours) {
    return `**${exam} Wellness Plan** (${days} days remaining)\n\n` +
      `**Daily Schedule:**\n` +
      `- Morning: 10 min mindfulness + light stretching\n` +
      `- Study: ${studyHours}h in 45-min Pomodoro blocks (10-min breaks)\n` +
      `- Afternoon: Revision + practice problems\n` +
      `- Evening: 20-min walk or relaxation\n` +
      `- Night: ${sleepHours}h sleep — non-negotiable!\n\n` +
      `**Stress Strategies:**\n` +
      `- 4-7-8 breathing before study sessions\n` +
      `- Journal one reflection each night\n` +
      `- Weekly full revision day\n\n` +
      `**Remember:** Consistency beats intensity. Progress over perfection! 💙`;
  }

  function formatPlan(text) {
    return text.split('\n').map(line => {
      const safe = Utils.escapeHtml(line);
      if (!line.trim()) return '<br>';
      if (/^[-•*] /.test(line))   return `<li>${Utils.escapeHtml(line.slice(2))}</li>`;
      if (/^\*\*(.+)\*\*$/.test(line)) return `<h4>${Utils.escapeHtml(line.slice(2, -2))}</h4>`;
      if (/^#{1,3} /.test(line))  return `<h4>${Utils.escapeHtml(line.replace(/^#+\s/, ''))}</h4>`;
      return `<p>${safe}</p>`;
    }).join('').replace(/(<li>.*?<\/li>)+/g, m => `<ul>${m}</ul>`);
  }

  function downloadPlan(text, exam) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `StressLess-${exam.replace(/\s+/g, '-')}-Plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    Utils.toast('Plan downloaded! 📄', 'success');
  }

  function renderSavedPlan() {
    const saved = Storage.get('saved_plan', null);
    if (!saved) return;
    const resultEl = document.getElementById('planner-result');
    if (!resultEl) return;

    const age = Date.now() - saved.timestamp;
    const ageDays = Math.floor(age / 86400000);
    const ageText = ageDays === 0 ? 'today' : ageDays === 1 ? 'yesterday' : `${ageDays} days ago`;

    resultEl.innerHTML = `
      <div class="ai-response-card">
        <div class="ai-response-header">
          <span class="ai-badge">📅 Saved Plan — ${Utils.escapeHtml(saved.examType)}</span>
          <span class="ai-time">Generated ${ageText}</span>
        </div>
        <div class="ai-response-body">${formatPlan(saved.content)}</div>
      </div>`;
  }

  return { init, generatePlan };
})();
