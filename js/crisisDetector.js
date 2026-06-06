// Crisis detector: simple pattern matching and modal handling
const CrisisDetector = (() => {
  const crisisPatterns = [ /suicide/i, /kill myself/i, /want to die/i, /end my life/i, /harm myself/i, /cant go on/i, /can't go on/i, /i am worthless/i ];

  function matches(text){
    if (!text) return false;
    return crisisPatterns.some(r => r.test(text));
  }

  async function checkAndHandle(text){
    if (matches(text)){
      // Show modal and provide supportive response
      openCrisisModal();
      const response = `I'm really sorry you're feeling this way. You are not alone. If you are in immediate danger, please call emergency services. For support in India: iCall 9152987821, Vandrevala 1860-2662-345. Would you like to try Calm Mode together?`;
      return { level: 'crisis', response };
    }
    return { level: 'ok' };
  }

  function openCrisisModal(){
    const modal = document.getElementById('crisis-modal');
    const body = document.getElementById('crisis-modal-body');
    if (!modal) return;
    if (body) body.innerHTML = `<p>It sounds like you're going through a difficult time. Please consider contacting local emergency services or a helpline.</p>`;
    modal.removeAttribute('hidden');
    modal.focus();
  }
  function closeCrisisModal(){
    const modal = document.getElementById('crisis-modal');
    if (modal) modal.setAttribute('hidden','');
  }

  return { checkAndHandle, openCrisisModal, closeCrisisModal };
})();
