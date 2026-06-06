/**
 * StressLess Student AI - Crisis Detector
 * Fixed: expanded patterns, focus trap, cooldown, severity levels.
 */
const CrisisDetector = (() => {

  const CRISIS_PATTERNS = [
    /suicid/i, /kill myself/i, /want to die/i, /end my life/i,
    /harm myself/i, /self.harm/i, /hurt myself/i,
    /can'?t go on/i, /no reason to live/i, /not worth living/i,
    /end it all/i, /ending it/i, /ending everything/i,
    /better off without me/i, /everyone would be better/i,
    /don'?t want to wake up/i, /wish i was dead/i, /i am worthless/i
  ];

  const HIGH_STRESS_PATTERNS = [
    /panic attack/i, /can'?t breathe/i, /breaking down/i,
    /complete failure/i, /life is over/i, /failed everyone/i,
    /no future/i, /hopeless/i, /giving up/i, /can'?t do this/i,
    /exhausted completely/i, /losing my mind/i, /going crazy/i,
    /dropping out/i, /ruined everything/i
  ];

  let lastTriggerTime = 0;
  const COOLDOWN_MS   = 60000; // 1 minute between crisis modals
  let previousFocus   = null;

  function analyze(text) {
    if (!text || typeof text !== 'string') return { level: 'ok' };
    if (CRISIS_PATTERNS.some(r => r.test(text)))      return { level: 'crisis' };
    const stressCount = HIGH_STRESS_PATTERNS.filter(r => r.test(text)).length;
    if (stressCount >= 2) return { level: 'high_stress' };
    if (stressCount === 1) return { level: 'elevated' };
    return { level: 'ok' };
  }

  async function checkAndHandle(text) {
    const result = analyze(text);

    if (result.level === 'crisis' || result.level === 'high_stress') {
      const now = Date.now();
      if (now - lastTriggerTime < COOLDOWN_MS) {
        // Cooldown active — still return crisis response but don't show modal again
        const response = result.level === 'crisis'
          ? await GeminiService.handleCrisis(text).catch(() => null)
          : null;
        return { detected: true, level: result.level, response };
      }

      lastTriggerTime = now;
      openCrisisModal(result.level);

      // Log event (no PII)
      const events = Storage.get('crisis_events', []) || [];
      events.unshift({ timestamp: now, level: result.level });
      Storage.set('crisis_events', events.slice(0, 50));

      if (result.level === 'crisis') {
        const response = await GeminiService.handleCrisis(text).catch(() => null);
        return { detected: true, level: 'crisis', response };
      }
      return { detected: true, level: 'high_stress', response: null };
    }

    return { detected: false, level: result.level, response: null };
  }

  function openCrisisModal(level = 'crisis') {
    const modal = document.getElementById('crisis-modal');
    if (!modal) return;

    previousFocus = document.activeElement;

    const isCrisis = level === 'crisis';

    const titleEl = document.getElementById('crisis-modal-title');
    const bodyEl  = document.getElementById('crisis-modal-body');

    if (titleEl) titleEl.textContent = isCrisis ? '💙 You\'re Not Alone' : '🌟 Let\'s Take a Breath';

    if (bodyEl) {
      bodyEl.innerHTML = isCrisis
        ? `<p>We noticed you might be going through something very difficult. Your feelings are valid — you matter deeply.</p>
           <div class="crisis-resources" role="list" aria-label="Crisis helplines">
             <div class="resource-card" role="listitem"><span aria-hidden="true">📞</span>
               <div><strong>iCall (TISS)</strong><br><a href="tel:9152987821" class="crisis-tel">9152987821</a> — Mon–Sat, 8AM–10PM</div>
             </div>
             <div class="resource-card" role="listitem"><span aria-hidden="true">📞</span>
               <div><strong>Vandrevala Foundation</strong><br><a href="tel:18002662345" class="crisis-tel">1860-2662-345</a> — 24/7</div>
             </div>
             <div class="resource-card" role="listitem"><span aria-hidden="true">📞</span>
               <div><strong>NIMHANS</strong><br><a href="tel:08046110007" class="crisis-tel">080-46110007</a></div>
             </div>
           </div>
           <p class="crisis-msg">Please reach out to someone you trust — a friend, family member, or counsellor. 💙</p>`
        : `<p>Exam pressure can feel overwhelming. That's completely valid — you are not alone in this.</p>
           <p>Let's try a quick breathing exercise together to help you feel calmer and more centered.</p>
           <p>If you need to talk to someone: <strong><a href="tel:9152987821" class="crisis-tel">iCall: 9152987821</a></strong></p>`;
    }

    modal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus the calm button
    const calmBtn = document.getElementById('crisis-calm-btn');
    if (calmBtn) setTimeout(() => calmBtn.focus(), 50);

    // Focus trap
    modal.addEventListener('keydown', handleFocusTrap);
    document.addEventListener('keydown', handleEscapeKey);
  }

  function closeCrisisModal() {
    const modal = document.getElementById('crisis-modal');
    if (!modal) return;
    modal.setAttribute('hidden', '');
    modal.removeEventListener('keydown', handleFocusTrap);
    document.removeEventListener('keydown', handleEscapeKey);
    document.body.style.overflow = '';

    if (previousFocus && previousFocus.focus) {
      try { previousFocus.focus(); } catch (e) {}
    }
  }

  function handleEscapeKey(e) {
    if (e.key === 'Escape') closeCrisisModal();
  }

  function handleFocusTrap(e) {
    if (e.key !== 'Tab') return;
    const modal    = document.getElementById('crisis-modal');
    if (!modal) return;
    const focusable = Array.from(modal.querySelectorAll(
      'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])'
    ));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  return { checkAndHandle, openCrisisModal, closeCrisisModal, analyze };
})();
