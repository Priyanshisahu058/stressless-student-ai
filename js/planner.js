/**
 * StressLess Student AI - Study Wellness Planner Module
 */

const Planner = (() => {

  const EXAM_TYPES = [
    'JEE Main/Advanced', 'NEET UG', 'CUET', 'CAT', 'GATE',
    'UPSC CSE', 'Class 10 Boards', 'Class 12 Boards', 'NDA', 'CLAT', 'Other'
  ];

  function init() {
    populateExamTypes();
  }

  function populateExamTypes() {
    const select = document.getElementById('planner-exam-type');
    if (!select) return;
    
    EXAM_TYPES.forEach(exam => {
      const option = document.createElement('option');
      option.value = exam;
      option.textContent = exam;
      select.appendChild(option);
    });
  }

  async function generatePlan() {
    const examType = document.getElementById('planner-exam-type')?.value || '';
    const daysRemaining = parseInt(document.getElementById('planner-days')?.value || 30);
    const stressLevel = parseInt(document.getElementById('planner-stress')?.value || 5);
    const studyHours = parseFloat(document.getElementById('planner-study-hours')?.value || 6);
    const sleepHours = parseFloat(document.getElementById('planner-sleep-hours')?.value || 7);

    // Validation
    if (!examType) {
      Utils.toast('Please select your exam type', 'warning');
      return;
    }
    if (daysRemaining < 1 || daysRemaining > 730) {
      Utils.toast('Please enter a valid number of days (1-730)', 'warning');
      return;
    }
    if (studyHours < 1 || studyHours > 18) {
      Utils.toast('Please enter valid study hours (1-18)', 'warning');
      return;
    }

    const planData = { examType, daysRemaining, stressLevel, studyHours, sleepHours };

    // Show loading state
    const resultEl = document.getElementById('planner-result');
    resultEl.innerHTML = `
      <div class="ai-loading" aria-live="polite">
        <div class="loading-pulse"></div>
        <p>🧠 StressLess AI is crafting your personalized wellness plan...</p>
        <p class="loading-sub">This may take a moment</p>
      </div>`;
    resultEl.classList.remove('hidden');
    resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    const btn = document.getElementById('generate-plan-btn');
    Utils.setButtonLoading(btn, true, 'Generating...');

    try {
      const plan = await GeminiService.generateWellnessPlan(planData);
      
      // Save plan
      Storage.append('wellness_plans', {
        id: Utils.uuid(),
        timestamp: Date.now(),
        todayKey: Utils.todayKey(),
        ...planData,
        plan: plan.slice(0, 5000) // Limit stored size
      });

      resultEl.innerHTML = `
        <div class="ai-response-card plan-card" role="region" aria-label="Your personalized wellness plan">
          <div class="ai-response-header">
            <span class="ai-badge">🤖 StressLess AI Plan</span>
            <div class="plan-meta">
              <span class="tag">${Utils.sanitize(examType)}</span>
              <span class="tag">${daysRemaining} days left</span>
              <span class="tag">Stress: ${stressLevel}/10</span>
            </div>
          </div>
          <div class="ai-response-body plan-body">${StressTriggers.formatAIResponse(plan)}</div>
          <div class="plan-footer">
            <button class="btn btn--outline btn--small" onclick="Planner.downloadPlan()" aria-label="Save plan as text">
              📥 Save Plan
            </button>
          </div>
        </div>`;

      Utils.toast('✅ Your wellness plan is ready!', 'success');
    } catch (e) {
      resultEl.innerHTML = `<div class="ai-error">
        <p>⚠️ Unable to generate AI plan. Please verify your Gemini API key in config.js</p>
        <p>General tip: For ${Utils.sanitize(examType)}, study in 45-min blocks, take 10-min breaks, sleep 7-8 hours, and stay hydrated. 💙</p>
      </div>`;
    }

    Utils.setButtonLoading(btn, false);
  }

  function downloadPlan() {
    const planBody = document.querySelector('.plan-body');
    if (!planBody) return;
    
    const planText = planBody.innerText;
    const examType = document.getElementById('planner-exam-type')?.value || 'Exam';
    
    const blob = new Blob([`StressLess Student AI - Wellness Plan\n${examType}\nGenerated: ${new Date().toLocaleString('en-IN')}\n\n${planText}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellness-plan-${examType.replace(/\s+/g, '-')}-${Utils.todayKey()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    Utils.toast('📥 Plan saved!', 'success');
  }

  return { init, generatePlan, downloadPlan };
})();
