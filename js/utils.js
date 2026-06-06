/**
 * StressLess Student AI - Utility Functions
 * Shared helpers used across all modules.
 */

const Utils = (() => {

  /** Sanitize user input to prevent XSS — use textContent for display */
  function sanitize(str) {
    if (typeof str !== 'string') return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
  }

  /** Format a timestamp to a readable date string */
  function formatDate(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  }

  /** Format time from timestamp */
  function formatTime(timestamp) {
    const d = new Date(timestamp);
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  }

  /** Get today's date string (YYYY-MM-DD) for deduplication */
  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  /** Generate a simple UUID */
  function uuid() {
    return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  /** Show a toast notification */
  function toast(message, type = 'success', duration = 3500) {
    const existing = document.getElementById('toast-container');
    if (!existing) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    toast.innerHTML = `<span class="toast__icon">${icons[type] || 'ℹ️'}</span><span class="toast__msg">${sanitize(message)}</span>`;
    
    document.getElementById('toast-container').appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('toast--visible'));
    
    setTimeout(() => {
      toast.classList.remove('toast--visible');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  /** Clamp a number between min and max */
  function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  }

  /** Interpolate between two colors */
  function scoreColor(score) {
    if (score >= 75) return '#2DD4BF';
    if (score >= 50) return '#6C63FF';
    if (score >= 25) return '#F59E0B';
    return '#EF4444';
  }

  /** Get last 7 day labels */
  function last7DayLabels() {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' }));
    }
    return labels;
  }

  /** Debounce a function */
  function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  /** Show/hide loading spinner on a button */
  function setButtonLoading(btn, loading, text = 'Loading...') {
    if (loading) {
      btn.dataset.originalText = btn.textContent;
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${text}`;
    } else {
      btn.disabled = false;
      btn.textContent = btn.dataset.originalText || 'Submit';
    }
  }

  return {
    sanitize, formatDate, formatTime, todayKey, uuid,
    toast, clamp, scoreColor, last7DayLabels, debounce, setButtonLoading
  };
})();
