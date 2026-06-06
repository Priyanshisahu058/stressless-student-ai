// Planner: populate exams & generate plan
const Planner = (() => {
  const EXAMS = ['JEE Main/Advanced','NEET UG','CUET','CAT','GATE','UPSC CSE','Class 12 Boards','Class 10 Boards','Other'];

  function init(){
    const select = document.getElementById('planner-exam-type'); if (!select) return;
    select.innerHTML = '<option value="">Select your exam...</option>' + EXAMS.map(e=>`<option>${e}</option>`).join('');
  }

  async function generatePlan(){
    const examType = document.getElementById('planner-exam-type')?.value;
    const days = Number(document.getElementById('planner-days')?.value||30);
    const studyHours = Number(document.getElementById('planner-study-hours')?.value||4);
    const sleepHours = Number(document.getElementById('planner-sleep-hours')?.value||7);
    const stress = Number(document.getElementById('planner-stress')?.value||5);

    const resultEl = document.getElementById('planner-result');
    if (resultEl){ resultEl.classList.remove('hidden'); resultEl.innerHTML = `<div class="ai-loading"><div class="loading-pulse"></div><div class="loading-sub">Generating plan...</div></div>`; }

    const plan = await GeminiService.generatePlan({ examType, days, studyHours, sleepHours, stress });
    if (plan === null){
      if (resultEl) resultEl.innerHTML = `<div class="ai-error">AI features require an API key. Configure <code>config.js</code> to enable.</div>`;
      return;
    }

    if (resultEl) resultEl.innerHTML = `<div class="ai-response-card"><div class="ai-response-body">${Utils.sanitize(plan)}</div></div>`;
  }

  return { init, generatePlan };
})();
