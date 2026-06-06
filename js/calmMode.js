/**
 * StressLess Student AI - Emergency Calm Mode Module
 * Guided breathing, grounding exercises, and positive affirmations.
 */

const CalmMode = (() => {
  const AFFIRMATIONS = [
    "I am capable of handling whatever comes my way. 💙",
    "This exam does not define my worth or my future.",
    "I have prepared well. I trust myself.",
    "Every breath I take brings me calm and clarity.",
    "I am stronger than I feel right now.",
    "Challenges make me grow. I embrace them.",
    "My best is always enough. I give my best today.",
    "I have overcome difficult things before. I can do it again.",
    "I am not alone. Support is all around me.",
    "Progress, not perfection. One step at a time.",
    "My mind is sharp. My body is strong. I am ready.",
    "Stress is temporary. My resilience is permanent.",
    "I choose peace over panic. I breathe and reset.",
    "Great things take time. I am patient with myself.",
    "Today's struggles are tomorrow's strengths."
  ];

  const GROUNDING_STEPS = [
    { count: 5, sense: 'SEE', icon: '👁️', instruction: 'Name <strong>5 things</strong> you can <em>see</em> around you right now.' },
    { count: 4, sense: 'TOUCH', icon: '✋', instruction: 'Notice <strong>4 things</strong> you can <em>touch</em>. Feel their texture.' },
    { count: 3, sense: 'HEAR', icon: '👂', instruction: 'Listen for <strong>3 things</strong> you can <em>hear</em>.' },
    { count: 2, sense: 'SMELL', icon: '👃', instruction: 'Notice <strong>2 things</strong> you can <em>smell</em>.' },
    { count: 1, sense: 'TASTE', icon: '👅', instruction: 'Notice <strong>1 thing</strong> you can <em>taste</em>.' }
  ];

  let breathingInterval = null;
  let affirmationInterval = null;
  let groundingStep = 0;
  let currentAffirmationIndex = 0;

  function open(trigger = 'manual') {
    const overlay = document.getElementById('calm-overlay');
    if (!overlay) return;
    
    overlay.removeAttribute('hidden');
    overlay.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    
    // Log calm mode usage
    Storage.append('calm_sessions', {
      timestamp: Date.now(),
      trigger
    });
    
    startBreathing();
    startAffirmations();
    resetGrounding();
    
    // Focus management
    document.getElementById('calm-close-btn')?.focus();
    
    // Trap focus inside overlay
    trapFocus(overlay);
  }

  function close() {
    const overlay = document.getElementById('calm-overlay');
    if (!overlay) return;
    
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
    
    stopBreathing();
    stopAffirmations();
  }

  // ── Breathing Exercise (4-7-8 technique) ──
  const PHASES = [
    { name: 'Inhale', duration: 4000, instruction: 'Breathe in slowly...', scale: 1.3 },
    { name: 'Hold', duration: 7000, instruction: 'Hold gently...', scale: 1.3 },
    { name: 'Exhale', duration: 8000, instruction: 'Release slowly...', scale: 1 }
  ];
  let breathPhase = 0;
  let breathTimeout = null;

  function startBreathing() {
    breathPhase = 0;
    runBreathPhase();
  }

  function runBreathPhase() {
    const circle = document.getElementById('breath-circle');
    const label = document.getElementById('breath-phase-label');
    const instruction = document.getElementById('breath-instruction');
    const timer = document.getElementById('breath-timer');
    
    if (!circle) return;
    
    const phase = PHASES[breathPhase % PHASES.length];
    
    if (label) label.textContent = phase.name;
    if (instruction) instruction.textContent = phase.instruction;
    
    // Animate circle
    circle.style.transform = `scale(${phase.scale})`;
    circle.style.transition = `transform ${phase.duration}ms ease-in-out`;
    
    // Countdown timer
    let countdown = phase.duration / 1000;
    if (timer) timer.textContent = countdown;
    
    const countInterval = setInterval(() => {
      countdown--;
      if (timer) timer.textContent = Math.max(0, countdown);
    }, 1000);
    
    breathTimeout = setTimeout(() => {
      clearInterval(countInterval);
      breathPhase++;
      runBreathPhase();
    }, phase.duration);
  }

  function stopBreathing() {
    if (breathTimeout) clearTimeout(breathTimeout);
  }

  // ── Affirmations ──
  function startAffirmations() {
    showAffirmation();
    affirmationInterval = setInterval(showAffirmation, 6000);
  }

  function showAffirmation() {
    const el = document.getElementById('affirmation-text');
    if (!el) return;
    
    el.classList.remove('affirmation--visible');
    setTimeout(() => {
      el.textContent = AFFIRMATIONS[currentAffirmationIndex % AFFIRMATIONS.length];
      el.classList.add('affirmation--visible');
      currentAffirmationIndex++;
    }, 300);
  }

  function stopAffirmations() {
    if (affirmationInterval) clearInterval(affirmationInterval);
  }

  // ── 5-4-3-2-1 Grounding ──
  function resetGrounding() {
    groundingStep = 0;
    showGroundingStep();
  }

  function showGroundingStep() {
    const container = document.getElementById('grounding-content');
    if (!container) return;
    
    if (groundingStep >= GROUNDING_STEPS.length) {
      container.innerHTML = `
        <div class="grounding-complete">
          <span class="grounding-complete-icon" aria-hidden="true">🌟</span>
          <h3>Well Done!</h3>
          <p>You've completed the grounding exercise. Notice how you feel more present and calm.</p>
          <button class="btn btn--teal" onclick="CalmMode.resetGrounding()" aria-label="Restart grounding exercise">
            Restart Exercise
          </button>
        </div>`;
      return;
    }
    
    const step = GROUNDING_STEPS[groundingStep];
    container.innerHTML = `
      <div class="grounding-step" aria-live="polite">
        <div class="grounding-number">${step.count}</div>
        <span class="grounding-sense-icon" aria-hidden="true">${step.icon}</span>
        <p class="grounding-instruction">${step.instruction}</p>
        <div class="grounding-progress">
          ${GROUNDING_STEPS.map((s, i) => `
            <div class="gp-dot ${i < groundingStep ? 'gp-dot--done' : i === groundingStep ? 'gp-dot--active' : ''}" 
                 aria-label="Step ${i + 1} ${i < groundingStep ? 'complete' : i === groundingStep ? 'current' : 'upcoming'}"></div>
          `).join('')}
        </div>
        <button class="btn btn--primary mt-2" onclick="CalmMode.nextGroundingStep()" aria-label="Continue to next grounding step">
          ${groundingStep < GROUNDING_STEPS.length - 1 ? 'Next Step →' : 'Finish ✓'}
        </button>
      </div>`;
  }

  function nextGroundingStep() {
    groundingStep++;
    showGroundingStep();
  }

  // ── Focus Trap ──
  function trapFocus(element) {
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element.addEventListener('keydown', function handler(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
      // Remove handler when overlay closes
      if (element.hasAttribute('hidden')) element.removeEventListener('keydown', handler);
    });
  }

  return { open, close, resetGrounding, nextGroundingStep };
})();
