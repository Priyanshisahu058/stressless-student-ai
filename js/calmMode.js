// Calm Mode: overlay with breathing, affirmations, grounding
const CalmMode = (() => {
  let breathInterval = null;
  let affirmationInterval = null;
  const AFFIRMATIONS = [
    'I am capable of handling this moment.',
    'Small steps build great progress.',
    'It is okay to pause and breathe.'
  ];

  function open(source='manual'){
    const overlay = document.getElementById('calm-overlay');
    if (!overlay) return;
    overlay.removeAttribute('hidden');
    overlay.focus();
    startBreathing();
    startAffirmations();
  }
  function close(){
    const overlay = document.getElementById('calm-overlay');
    if (!overlay) return;
    overlay.setAttribute('hidden','');
    stopBreathing();
    stopAffirmations();
  }

  function startBreathing(){
    const phaseLabel = document.getElementById('breath-phase-label');
    const timer = document.getElementById('breath-timer');
    const instruction = document.getElementById('breath-instruction');
    const circle = document.getElementById('breath-circle');
    if (!timer) return;
    let state = 0; // inhale, hold, exhale, hold
    const timings = [4,7,8,0];
    let remaining = timings[state];
    if (timer) timer.textContent = remaining;

    breathInterval = setInterval(()=>{
      remaining -= 1;
      if (remaining <= 0){ state = (state+1)%3; remaining = timings[state]; }
      if (timer) timer.textContent = remaining;
      if (phaseLabel) phaseLabel.textContent = state===0? 'Inhale' : state===1? 'Hold' : 'Exhale';
      if (instruction) instruction.textContent = state===0? 'Breathe in slowly...' : state===1? 'Hold...' : 'Breathe out slowly...';
      if (circle) circle.style.transform = state===0? 'scale(1.15)' : state===2? 'scale(0.9)' : 'scale(1)';
    },1000);
  }
  function stopBreathing(){ clearInterval(breathInterval); breathInterval = null; }

  function startAffirmations(){
    const el = document.getElementById('affirmation-text'); if (!el) return;
    let idx=0; el.textContent = AFFIRMATIONS[idx];
    affirmationInterval = setInterval(()=>{ idx = (idx+1)%AFFIRMATIONS.length; el.textContent = AFFIRMATIONS[idx]; }, 5000);
  }
  function stopAffirmations(){ clearInterval(affirmationInterval); affirmationInterval = null; }

  return { open, close };
})();
