/**
 * StressLess Student AI - Calm Mode
 * 4-7-8 breathing, 5-4-3-2-1 grounding, rotating affirmations.
 * Fixed: grounding exercise, focus trap, interval stacking.
 */
const CalmMode = (() => {
  const AFFIRMATIONS = [
    "I am capable of handling whatever comes my way. 💙",
    "This exam does not define my worth or my future.",
    "I have prepared well. I trust myself.",
    "Every breath brings me calm and clarity.",
    "I am stronger than I feel right now.",
    "Challenges help me grow. I embrace them.",
    "My best is always enough. I give my best today.",
    "I have overcome difficult things before.",
    "I am not alone. Support surrounds me.",
    "Progress, not perfection. One step at a time.",
    "My mind is sharp. My body is strong.",
    "Stress is temporary. My resilience is permanent.",
    "I choose peace over panic. I breathe and reset.",
    "Great things take time. I am patient with myself.",
    "Tum kar sakte ho! You've got this! 🌟"
  ];

  const GROUNDING_STEPS = [
    { count: 5, sense: 'SEE',   icon: '👁️', text: 'Name <strong>5 things</strong> you can <em>see</em> around you right now.' },
    { count: 4, sense: 'TOUCH', icon: '✋', text: 'Notice <strong>4 things</strong> you can <em>touch</em>. Feel their texture.' },
    { count: 3, sense: 'HEAR',  icon: '👂', text: 'Listen for <strong>3 things</strong> you can <em>hear</em> right now.' },
    { count: 2, sense: 'SMELL', icon: '👃', text: 'Notice <strong>2 things</strong> you can <em>smell</em>.' },
    { count: 1, sense: 'TASTE', icon: '👅', text: 'Notice <strong>1 thing</strong> you can <em>taste</em>.' }
  ];

  // 4-7-8 breathing phases
  const PHASES = [
    { name: 'Inhale',  duration: 4, instruction: 'Breathe in slowly through your nose...' },
    { name: 'Hold',    duration: 7, instruction: 'Hold gently. Stay calm...' },
    { name: 'Exhale',  duration: 8, instruction: 'Release slowly through your mouth...' }
  ];

  let breathTimeout     = null;
  let affirmInterval    = null;
  let groundingStep     = 0;
  let affirmIdx         = 0;
  let breathPhase       = 0;
  let isOpen            = false;
  let previousFocus     = null;

  /* ── Public: open ── */
  function open(source = 'manual') {
    if (isOpen) return; // Guard: prevent stacking
    isOpen = true;

    previousFocus = document.activeElement;

    const overlay = document.getElementById('calm-overlay');
    if (!overlay) return;
    overlay.removeAttribute('hidden');
    overlay.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';

    Storage.set('calm_sessions', (Storage.get('calm_sessions', 0)) + 1);

    breathPhase = 0;
    groundingStep = 0;
    affirmIdx = Math.floor(Math.random() * AFFIRMATIONS.length);

    startBreathing();
    startAffirmations();
    renderGroundingStep();

    // Focus first focusable element
    const closeBtn = document.getElementById('calm-close-btn');
    if (closeBtn) setTimeout(() => closeBtn.focus(), 50);

    // Trap focus inside overlay
    overlay.addEventListener('keydown', handleFocusTrap);
    document.addEventListener('keydown', handleEscape);
  }

  /* ── Public: close ── */
  function close() {
    if (!isOpen) return;
    isOpen = false;

    const overlay = document.getElementById('calm-overlay');
    if (overlay) {
      overlay.setAttribute('hidden', '');
      overlay.removeEventListener('keydown', handleFocusTrap);
    }
    document.removeEventListener('keydown', handleEscape);
    document.body.style.overflow = '';

    stopBreathing();
    stopAffirmations();

    // Return focus to trigger element
    if (previousFocus && previousFocus.focus) {
      try { previousFocus.focus(); } catch (e) {}
    }
  }

  /* ── Escape key ── */
  function handleEscape(e) {
    if (e.key === 'Escape') close();
  }

  /* ── Focus trap ── */
  function handleFocusTrap(e) {
    if (e.key !== 'Tab') return;
    const overlay = document.getElementById('calm-overlay');
    if (!overlay) return;

    const focusable = Array.from(overlay.querySelectorAll(
      'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ));
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
    }
  }

  /* ── 4-7-8 Breathing ── */
  function startBreathing() {
    stopBreathing();
    runPhase();
  }

  function runPhase() {
    const phase = PHASES[breathPhase % PHASES.length];
    const circle      = document.getElementById('breath-circle');
    const phaseLabel  = document.getElementById('breath-phase-label');
    const instruction = document.getElementById('breath-instruction');
    const timerEl     = document.getElementById('breath-timer');

    if (phaseLabel)  phaseLabel.textContent  = phase.name;
    if (instruction) instruction.textContent = phase.instruction;

    // Animate circle scale
    if (circle) {
      circle.style.transform  = phase.name === 'Inhale' ? 'scale(1.35)' : 'scale(1)';
      circle.style.transition = `transform ${phase.duration}s ease-in-out`;
    }

    // Countdown
    let remaining = phase.duration;
    if (timerEl) timerEl.textContent = remaining;

    const tick = setInterval(() => {
      remaining--;
      if (timerEl) timerEl.textContent = Math.max(0, remaining);
      if (remaining <= 0) clearInterval(tick);
    }, 1000);

    breathTimeout = setTimeout(() => {
      clearInterval(tick);
      breathPhase++;
      runPhase();
    }, phase.duration * 1000);
  }

  function stopBreathing() {
    if (breathTimeout) { clearTimeout(breathTimeout); breathTimeout = null; }
  }

  /* ── Affirmations ── */
  function startAffirmations() {
    stopAffirmations();
    showAffirmation();
    affirmInterval = setInterval(showAffirmation, 6000);
  }

  function showAffirmation() {
    const el = document.getElementById('affirmation-text');
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(6px)';
    setTimeout(() => {
      el.textContent = AFFIRMATIONS[affirmIdx % AFFIRMATIONS.length];
      affirmIdx++;
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 300);
  }

  function stopAffirmations() {
    if (affirmInterval) { clearInterval(affirmInterval); affirmInterval = null; }
  }

  /* ── 5-4-3-2-1 Grounding ── */
  function renderGroundingStep() {
    const container = document.getElementById('grounding-content');
    if (!container) return;

    if (groundingStep >= GROUNDING_STEPS.length) {
      container.innerHTML = `
        <div class="grounding-complete" role="status" aria-live="polite">
          <div class="grounding-complete-icon" aria-hidden="true">🌟</div>
          <h3>Well Done!</h3>
          <p>You've completed the grounding exercise.<br>Notice how you feel more present and calm.</p>
          <button class="btn btn--teal" onclick="CalmMode.restartGrounding()" aria-label="Restart the 5-4-3-2-1 grounding exercise">
            ↺ Restart Exercise
          </button>
        </div>`;
      return;
    }

    const step = GROUNDING_STEPS[groundingStep];
    const dotsHTML = GROUNDING_STEPS.map((_, i) => `
      <div class="gp-dot ${i < groundingStep ? 'gp-dot--done' : i === groundingStep ? 'gp-dot--active' : ''}"
           aria-label="Step ${i + 1} ${i < groundingStep ? 'complete' : i === groundingStep ? 'current' : 'upcoming'}">
      </div>`).join('');

    container.innerHTML = `
      <div class="grounding-step" aria-live="polite">
        <div class="grounding-number" aria-hidden="true">${step.count}</div>
        <div class="grounding-sense-icon" aria-hidden="true">${step.icon}</div>
        <p class="grounding-instruction">${step.text}</p>
        <div class="grounding-progress" role="progressbar" aria-valuenow="${groundingStep + 1}" aria-valuemin="1" aria-valuemax="${GROUNDING_STEPS.length}" aria-label="Step ${groundingStep + 1} of ${GROUNDING_STEPS.length}">
          ${dotsHTML}
        </div>
        <button class="btn btn--primary" onclick="CalmMode.nextStep()" aria-label="${groundingStep < GROUNDING_STEPS.length - 1 ? 'Next grounding step' : 'Finish grounding exercise'}">
          ${groundingStep < GROUNDING_STEPS.length - 1 ? 'Next Step →' : 'Finish ✓'}
        </button>
      </div>`;
  }

  function nextStep() {
    groundingStep++;
    renderGroundingStep();
  }

  function restartGrounding() {
    groundingStep = 0;
    renderGroundingStep();
  }

  return { open, close, nextStep, restartGrounding };
})();
