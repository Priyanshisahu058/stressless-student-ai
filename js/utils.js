// Utilities: sanitization, toasts, formatters
const Utils = (() => {
  function escapeHtml(str=""){
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  function sanitizeHtml(input){
    // Basic sanitization: escape and allow newlines -> <br>
    return escapeHtml(input).replace(/\n/g,'<br>');
  }

  function formatTime(ts){
    try {
      const d = new Date(ts);
      return d.toLocaleString();
    } catch (e) { return ''+ts; }
  }

  // Accessible toast notifications
  function toast(message, type='info', timeout=3000){
    const container = document.getElementById('toast-container');
    if (!container) return;
    const id = 'toast-'+Date.now();
    const el = document.createElement('div');
    el.id = id;
    el.className = 'toast toast-'+type;
    el.setAttribute('role','status');
    el.setAttribute('aria-live','polite');
    el.innerHTML = Utils_sanitize(message);
    container.appendChild(el);
    setTimeout(()=>{ el.classList.add('toast--visible'); }, 20);
    setTimeout(()=>{ el.classList.remove('toast--visible'); setTimeout(()=>el.remove(),200); }, timeout);
  }

  // Small helper alias to use inside this module
  function Utils_sanitize(v){ return sanitizeHtml(String(v)); }

  // Expose
  return { sanitize: sanitizeHtml, escapeHtml, formatTime, toast };
})();
