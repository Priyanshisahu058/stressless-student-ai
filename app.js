/**
 * StressLess Student AI - Main Application Orchestrator
 * Handles routing, navigation, and module initialization.
 */

const App = (() => {

  // All navigation sections
  const SECTIONS = [
    { id: 'coach', label: 'AI Coach', icon: '🤖', init: initCoach },
    { id: 'mood', label: 'Mood', icon: '😊', init: () => MoodTracker.init() },
    { id: 'triggers', label: 'Triggers', icon: '⚡', init: () => StressTriggers.init() },
    { id: 'journal', label: 'Journal', icon: '✏️', init: () => Journal.init() },
    { id: 'wellness', label: 'Wellness', icon: '💚', init: () => WellnessScore.init() },
    { id: 'planner', label: 'Planner', icon: '📅', init: () => Planner.init() },
    { id: 'dashboard', label: 'Dashboard', icon: '📊', init: () => Dashboard.init() }
  ];

  let currentSection = 'coach';
  let chatHistory = [];

  function init() {
    buildNav();
    bindGlobalEvents();
    checkApiKey();
    navigateTo('coach');
    updateHeaderMood();

    // Service Worker for PWA (optional, non-blocking)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }

  function buildNav() {
    const sidebar = document.getElementById('sidebar-nav');
    const mobileNav = document.getElementById('mobile-nav');

    const sidebarHTML = SECTIONS.map(s => `
      <li>
        <button 
          class="nav-btn" 
          data-section="${s.id}"
          aria-current="false"
          aria-label="Navigate to ${s.label}"
          id="nav-${s.id}"
        >
          <span class="nav-icon" aria-hidden="true">${s.icon}</span>
          <span class="nav-label">${s.label}</span>
        </button>
      </li>
    `).join('');

    const mobileHTML = SECTIONS.map(s => `
      <button 
        class="mobile-nav-btn" 
        data-section="${s.id}"
        aria-current="false"
        aria-label="${s.label}"
        id="mobile-nav-${s.id}"
      >
        <span class="mobile-nav-icon" aria-hidden="true">${s.icon}</span>
        <span class="mobile-nav-label">${s.label}</span>
      </button>
    `).join('');

    if (sidebar) sidebar.innerHTML = sidebarHTML;
    if (mobileNav) mobileNav.innerHTML = mobileHTML;

    // Bind nav clicks
    document.querySelectorAll('[data-section]').forEach(btn => {
      btn.addEventListener('click', () => navigateTo(btn.dataset.section));
    });
  }

  function navigateTo(sectionId) {
    currentSection = sectionId;

    // Update sections visibility
    document.querySelectorAll('.app-section').forEach(section => {
      section.classList.toggle('hidden', section.id !== `section-${sectionId}`);
      section.setAttribute('aria-hidden', section.id !== `section-${sectionId}`);
    });

    // Update nav active state
    document.querySelectorAll('[data-section]').forEach(btn => {
      const isActive = btn.dataset.section === sectionId;
      btn.classList.toggle('nav-btn--active', isActive);
      btn.classList.toggle('mobile-nav-btn--active', isActive);
      btn.setAttribute('aria-current', isActive ? 'page' : 'false');
    });

    // Initialize section
    const sectionDef = SECTIONS.find(s => s.id === sectionId);
    if (sectionDef?.init) {
      try {
        sectionDef.init();
      } catch (e) {
        console.warn(`Error initializing section ${sectionId}:`, e);
      }
    }

    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update page title for accessibility
    document.title = `${sectionDef?.label || sectionId} — StressLess Student AI`;
  }

  // ── AI Coach ──
  function initCoach() {
    const userData = Storage.get('user_profile', {});
    renderWelcomeMessage(userData);
    loadChatHistory();
  }

  function renderWelcomeMessage(userData) {
    const greeting = getTimeGreeting();
    const welcomeEl = document.getElementById('coach-welcome');
    if (welcomeEl && chatHistory.length === 0) {
      welcomeEl.textContent = `${greeting}! I'm StressLess AI, your personal wellness companion. How are you feeling today? 💙`;
    }
  }

  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 20) return 'Good evening';
    return 'Hello';
  }

  function loadChatHistory() {
    const history = Storage.get('coach_chat', []);
    chatHistory = history;
    const container = document.getElementById('chat-messages');
    if (!container) return;
    
    container.innerHTML = '';
    chatHistory.forEach(msg => appendChatBubble(msg.role, msg.content, false));
    scrollChatToBottom();
  }

  async function sendCoachMessage() {
    const input = document.getElementById('coach-input');
    const message = input?.value?.trim();
    if (!message) return;
    if (message.length > 2000) {
      Utils.toast('Message too long (max 2000 characters)', 'warning');
      return;
    }

    input.value = '';
    input.style.height = 'auto';

    // Check for crisis
    const crisisResult = await CrisisDetector.checkAndHandle(message);
    
    appendChatBubble('user', message);
    saveChatMessage('user', message);
    
    // Show typing indicator
    const typingId = showTypingIndicator();

    try {
      let response;
      
      if (crisisResult.level === 'crisis' && crisisResult.response) {
        response = crisisResult.response;
      } else {
        const userData = Storage.get('user_profile', {});
        const latestMood = MoodTracker.getLatestMoodData();
        const context = {
          exam: userData.examType || '',
          mood: latestMood?.label || '',
          triggers: ''
        };
        response = await GeminiService.getWellnessCoaching(message, context);
      }

      hideTypingIndicator(typingId);

      if (response === null) {
        // API key not set
        showApiKeyPrompt();
        return;
      }

      appendChatBubble('assistant', response);
      saveChatMessage('assistant', response);

    } catch (e) {
      hideTypingIndicator(typingId);
      appendChatBubble('assistant', "I'm having a moment of silence 🙏 Please try again in a bit. In the meantime, try the Calm Mode for immediate support. 💙");
    }
  }

  function appendChatBubble(role, content, save = true) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `chat-bubble chat-bubble--${role}`;
    bubble.setAttribute('role', 'article');
    bubble.setAttribute('aria-label', `${role === 'user' ? 'You' : 'StressLess AI'}: ${content.slice(0, 50)}...`);

    const avatar = document.createElement('div');
    avatar.className = 'chat-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const body = document.createElement('div');
    body.className = 'chat-body';

    const text = document.createElement('div');
    text.className = 'chat-text';

    if (role === 'assistant') {
      // Format AI response with safe HTML (inline — no external dependency)
      text.innerHTML = _formatResponse(content);
    } else {
      text.textContent = content;
    }

    const time = document.createElement('span');
    time.className = 'chat-time';
    time.textContent = Utils.formatTime(Date.now());

    body.appendChild(text);
    body.appendChild(time);
    bubble.appendChild(avatar);
    bubble.appendChild(body);
    container.appendChild(bubble);

    // Animate in
    requestAnimationFrame(() => bubble.classList.add('chat-bubble--visible'));
    scrollChatToBottom();
  }

  function saveChatMessage(role, content) {
    const history = Storage.get('coach_chat', []);
    history.push({ role, content: content.slice(0, 2000), timestamp: Date.now() });
    // Keep last 50 messages
    if (history.length > 50) history.splice(0, history.length - 50);
    Storage.set('coach_chat', history);
  }

  function showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    if (!container) return null;
    
    const id = 'typing-' + Date.now();
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble chat-bubble--assistant typing-bubble';
    bubble.id = id;
    bubble.setAttribute('aria-label', 'StressLess AI is typing');
    bubble.setAttribute('aria-live', 'polite');
    bubble.innerHTML = `
      <div class="chat-avatar" aria-hidden="true">🤖</div>
      <div class="chat-body">
        <div class="typing-dots" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
      </div>`;
    container.appendChild(bubble);
    requestAnimationFrame(() => bubble.classList.add('chat-bubble--visible'));
    scrollChatToBottom();
    return id;
  }

  function hideTypingIndicator(id) {
    if (id) document.getElementById(id)?.remove();
  }

  function scrollChatToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function clearChat() {
    if (!confirm('Clear all chat history?')) return;
    Storage.set('coach_chat', []);
    chatHistory = [];
    const container = document.getElementById('chat-messages');
    if (container) container.innerHTML = '';
    initCoach();
    Utils.toast('Chat cleared', 'info');
  }

  // ── API Key Setup ──
  function checkApiKey() {
    let apiKey;
    try {
      apiKey = typeof GEMINI_API_KEY !== 'undefined' ? GEMINI_API_KEY : null;
    } catch (e) {
      apiKey = null;
    }

    const banner = document.getElementById('api-key-banner');
    if (!apiKey || apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
      if (banner) banner.removeAttribute('hidden');
    } else {
      if (banner) banner.setAttribute('hidden', '');
    }
  }

  function showApiKeyPrompt() {
    const banner = document.getElementById('api-key-banner');
    if (banner) banner.removeAttribute('hidden');
  }

  // ── Header Mood ──
  function updateHeaderMood() {
    const latestMood = MoodTracker.getLatestMoodData();
    const el = document.getElementById('header-mood');
    if (el) {
      el.textContent = latestMood ? `${latestMood.emoji} ${latestMood.label}` : '— Log Mood';
      el.title = latestMood ? `Last logged: ${Utils.formatTime(latestMood.timestamp)}` : 'No mood logged today';
    }
  }

  // ── User Profile ──
  function saveUserProfile() {
    const name = document.getElementById('profile-name')?.value?.trim().slice(0, 50) || '';
    const exam = document.getElementById('profile-exam')?.value || '';
    Storage.set('user_profile', { name, examType: exam, savedAt: Date.now() });
    Utils.toast('Profile saved! 👋', 'success');

    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl && name) greetingEl.textContent = `Hello, ${Utils.sanitize(name)}!`;
  }

  function loadUserProfile() {
    const profile = Storage.get('user_profile', {});
    const nameInput = document.getElementById('profile-name');
    const examInput = document.getElementById('profile-exam');
    const greetingEl = document.getElementById('user-greeting');

    if (nameInput && profile.name) nameInput.value = profile.name;
    if (examInput && profile.examType) examInput.value = profile.examType;
    if (greetingEl && profile.name) greetingEl.textContent = `Hello, ${Utils.sanitize(profile.name)}!`;
  }

  // ── Global Event Bindings ──
  function bindGlobalEvents() {
    // Coach input auto-resize + Enter to send
    const coachInput = document.getElementById('coach-input');
    if (coachInput) {
      coachInput.addEventListener('input', () => {
        coachInput.style.height = 'auto';
        coachInput.style.height = Math.min(coachInput.scrollHeight, 120) + 'px';
      });
      coachInput.addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          sendCoachMessage();
        }
      });
    }

    // Quick prompts
    document.querySelectorAll('.quick-prompt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const coachInput = document.getElementById('coach-input');
        if (coachInput) {
          coachInput.value = btn.dataset.prompt;
          coachInput.dispatchEvent(new Event('input'));
          sendCoachMessage();
        }
      });
    });

    // Calm Mode open/close
    document.getElementById('calm-mode-btn')?.addEventListener('click', () => CalmMode.open('manual'));
    document.getElementById('calm-close-btn')?.addEventListener('click', () => CalmMode.close());
    document.getElementById('crisis-calm-btn')?.addEventListener('click', () => {
      CrisisDetector.closeCrisisModal();
      CalmMode.open('crisis');
    });
    document.getElementById('crisis-close-btn')?.addEventListener('click', () => CrisisDetector.closeCrisisModal());

    // Close overlays on Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        CalmMode.close();
        CrisisDetector.closeCrisisModal();
      }
    });

    // Mood log button
    document.getElementById('log-mood-btn')?.addEventListener('click', () => MoodTracker.logMood());

    // Triggers analyze
    document.getElementById('analyze-triggers-btn')?.addEventListener('click', () => StressTriggers.analyzeTriggers());
    document.getElementById('custom-trigger')?.addEventListener('input', () => {
      const btn = document.getElementById('analyze-triggers-btn');
      if (btn) btn.disabled = false;
    });

    // Journal save
    document.getElementById('save-journal-btn')?.addEventListener('click', () => Journal.saveEntry());

    // Wellness log
    document.getElementById('log-wellness-btn')?.addEventListener('click', () => WellnessScore.calculate());

    // Planner generate
    document.getElementById('generate-plan-btn')?.addEventListener('click', () => Planner.generatePlan());

    // Coach send button
    document.getElementById('coach-send-btn')?.addEventListener('click', () => sendCoachMessage());
    document.getElementById('clear-chat-btn')?.addEventListener('click', clearChat);

    // Profile save
    document.getElementById('save-profile-btn')?.addEventListener('click', saveUserProfile);
    loadUserProfile();

    // Header mood refresh on focus
    window.addEventListener('focus', updateHeaderMood);
  }

  // ── Response formatter (shared, safe) ──
  function _formatResponse(text) {
    if (!text) return '';
    return text
      .split('\n')
      .map(line => {
        const safe = Utils.escapeHtml(line);
        if (!line.trim()) return '<br>';
        if (/^[-•*] /.test(line))         return `<li>${Utils.escapeHtml(line.slice(2))}</li>`;
        if (/^#{1,3} /.test(line))        return `<h4>${Utils.escapeHtml(line.replace(/^#+\s/, ''))}</h4>`;
        if (/\*\*(.+?)\*\*/.test(line))   return `<p>${safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
        return `<p>${safe}</p>`;
      })
      .join('')
      .replace(/(<li>.*?<\/li>)+/g, m => `<ul>${m}</ul>`);
  }

  return { init, navigateTo, sendCoachMessage, updateHeaderMood };
})();

// ── Bootstrap ──
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
