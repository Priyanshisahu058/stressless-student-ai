/**
 * StressLess Student AI - Crisis Detector Module
 * Scans text for signs of severe distress and triggers appropriate responses.
 */

const CrisisDetector = (() => {

  // Keywords indicating severe distress
  const CRISIS_KEYWORDS = [
    'want to die', 'end my life', 'no point', 'give up on life', 'hurt myself',
    'can\'t go on', 'useless', 'worthless', 'hate myself', 'nobody cares',
    'disappear forever', 'ending it', 'no reason to live', 'self harm',
    'suicidal', 'kill myself'
  ];

  // Keywords indicating high exam stress (not crisis, but needs intervention)
  const HIGH_STRESS_KEYWORDS = [
    'panic attack', 'can\'t breathe', 'complete failure', 'waste of time',
    'parents will disown', 'life is over', 'failed everyone', 'no future',
    'breakdown', 'can\'t handle', 'giving up', 'dropping out',
    'total disaster', 'ruined everything', 'hopeless', 'losing my mind',
    'going crazy', 'can\'t do this anymore', 'exhausted completely'
  ];

  let crisisHandled = false;

  /** Check text for crisis or high-stress indicators */
  function analyze(text) {
    if (!text || typeof text !== 'string') return { level: 'none', matched: [] };
    
    const lower = text.toLowerCase();
    
    const crisisMatched = CRISIS_KEYWORDS.filter(kw => lower.includes(kw));
    if (crisisMatched.length > 0) {
      return { level: 'crisis', matched: crisisMatched };
    }
    
    const stressMatched = HIGH_STRESS_KEYWORDS.filter(kw => lower.includes(kw));
    if (stressMatched.length >= 2) {
      return { level: 'high_stress', matched: stressMatched };
    }
    if (stressMatched.length === 1) {
      return { level: 'elevated', matched: stressMatched };
    }
    
    return { level: 'none', matched: [] };
  }

  /** Show crisis intervention modal */
  async function showCrisisModal(level, message = '') {
    // Prevent showing multiple crisis modals
    if (crisisHandled) return;
    crisisHandled = true;

    const modal = document.getElementById('crisis-modal');
    if (!modal) return;

    const isCrisis = level === 'crisis';
    
    document.getElementById('crisis-modal-title').textContent = isCrisis
      ? '💙 You\'re Not Alone'
      : '🌟 Let\'s Take a Breath';
    
    document.getElementById('crisis-modal-body').innerHTML = isCrisis
      ? `<p>We noticed you might be going through something very difficult right now. Your feelings are completely valid, and you matter deeply.</p>
         <div class="crisis-resources">
           <h4>Immediate Support (India)</h4>
           <div class="resource-card"><span>📞</span><div><strong>iCall</strong><br>9152987821 (Mon-Sat, 8AM-10PM)</div></div>
           <div class="resource-card"><span>📞</span><div><strong>Vandrevala Foundation</strong><br>1860-2662-345 (24/7)</div></div>
           <div class="resource-card"><span>📞</span><div><strong>NIMHANS</strong><br>080-46110007</div></div>
         </div>
         <p class="crisis-msg">Please reach out to someone you trust — a friend, family member, or counselor. You deserve support. 💙</p>`
      : `<p>Exam pressure can feel overwhelming sometimes. That's completely normal and valid. You're not alone in this journey.</p>
         <p>Let's try something together right now to help you feel calmer and more centered.</p>`;

    modal.removeAttribute('hidden');
    modal.setAttribute('aria-modal', 'true');
    document.getElementById('crisis-calm-btn').focus();

    // Log for internal tracking (no PII)
    Storage.append('crisis_events', {
      timestamp: Date.now(),
      level,
      todayKey: Utils.todayKey()
    });

    setTimeout(() => { crisisHandled = false; }, 60000); // Reset after 1 min
  }

  /** Check and handle a message */
  async function checkAndHandle(text) {
    const result = analyze(text);
    
    if (result.level === 'crisis') {
      showCrisisModal('crisis', text);
      const response = await GeminiService.handleCrisis(text);
      return { detected: true, level: 'crisis', response };
    }
    
    if (result.level === 'high_stress') {
      showCrisisModal('high_stress', text);
      return { detected: true, level: 'high_stress', response: null };
    }
    
    return { detected: false, level: result.level, response: null };
  }

  /** Close the crisis modal */
  function closeCrisisModal() {
    const modal = document.getElementById('crisis-modal');
    if (modal) modal.setAttribute('hidden', '');
  }

  return { analyze, checkAndHandle, closeCrisisModal, showCrisisModal };
})();
