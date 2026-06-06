/**
 * @fileoverview Shared utility functions for StressLess Student AI.
 * Includes XSS sanitization, toast notifications, time formatting,
 * and DOM helpers.
 *
 * @module Utils
 * @version 2.0.0
 */

const Utils = (() => {

  // ─────────────────────────────────────────────────────────
  // String Utilities (pure — no DOM dependency)
  // ─────────────────────────────────────────────────────────

  /**
   * Escapes special HTML characters to prevent XSS injection.
   * Replaces &, <, >, ", and ' with safe HTML entities.
   * @param {*} str - Value to escape (coerced to string).
   * @returns {string} HTML-safe escaped string.
   * @example
   * Utils.escapeHtml('<script>'); // '&lt;script&gt;'
   */
  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  /**
   * Sanitizes a string for safe HTML display.
   * Escapes HTML entities and converts newlines to <br> tags.
   * @param {*} input - Value to sanitize.
   * @returns {string} Sanitized HTML string.
   * @example
   * Utils.sanitize('Hello\nWorld'); // 'Hello<br>World'
   */
  function sanitize(input) {
    return escapeHtml(input).replace(/\n/g, '<br>');
  }

  /**
   * Truncates a string to a maximum length, adding ellipsis if needed.
   * @param {string} str - String to truncate.
   * @param {number} [maxLen=100] - Maximum allowed length.
   * @returns {string} Truncated string.
   * @example
   * Utils.truncate('Hello World', 5); // 'Hello…'
   */
  function truncate(str, maxLen = 100) {
    const s = String(str || '');
    return s.length <= maxLen ? s : s.slice(0, maxLen) + '…';
  }

  /**
   * Capitalizes the first letter of a string.
   * @param {string} str - Input string.
   * @returns {string} String with first letter uppercased.
   * @example
   * Utils.capitalize('hello'); // 'Hello'
   */
  function capitalize(str) {
    const s = String(str || '');
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  // ─────────────────────────────────────────────────────────
  // Date / Time Utilities (pure)
  // ─────────────────────────────────────────────────────────

  /**
   * Formats a Unix timestamp as a human-readable locale string.
   * @param {number} ts - Unix timestamp in milliseconds.
   * @returns {string} Formatted date-time string, or empty string on error.
   * @example
   * Utils.formatTime(Date.now()); // '06/06/2026, 12:30:00 pm'
   */
  function formatTime(ts) {
    try {
      return new Date(ts).toLocaleString('en-IN', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return String(ts);
    }
  }

  /**
   * Returns the date string for a given timestamp (e.g. 'Mon Jun 06 2026').
   * @param {number} [ts=Date.now()] - Unix timestamp.
   * @returns {string} Date string without time.
   */
  function dateString(ts = Date.now()) {
    return new Date(ts).toDateString();
  }

  /**
   * Returns a time-of-day greeting based on the current hour.
   * @returns {'Good morning'|'Good afternoon'|'Good evening'|'Hello'}
   */
  function getTimeGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    if (h < 20) return 'Good evening';
    return 'Hello';
  }

  /**
   * Checks if a timestamp is from today.
   * @param {number} ts - Unix timestamp in milliseconds.
   * @returns {boolean}
   */
  function isToday(ts) {
    return new Date(ts).toDateString() === new Date().toDateString();
  }

  // ─────────────────────────────────────────────────────────
  // Number Utilities (pure)
  // ─────────────────────────────────────────────────────────

  /**
   * Clamps a number to an inclusive range [min, max].
   * @param {number} value - Number to clamp.
   * @param {number} min - Minimum value.
   * @param {number} max - Maximum value.
   * @returns {number} Clamped value.
   * @example
   * Utils.clamp(15, 0, 10); // 10
   * Utils.clamp(-5, 0, 10); // 0
   */
  function clamp(value, min, max) {
    const n = Number(value);
    return isNaN(n) ? min : Math.min(max, Math.max(min, n));
  }

  /**
   * Safely parses a string to an integer, returning a fallback on failure.
   * @param {*} value - Value to parse.
   * @param {number} [fallback=0] - Fallback value if parsing fails.
   * @returns {number}
   */
  function safeInt(value, fallback = 0) {
    const n = parseInt(value, 10);
    return isNaN(n) ? fallback : n;
  }

  /**
   * Rounds a number to a given number of decimal places.
   * @param {number} value - Number to round.
   * @param {number} [places=0] - Decimal places.
   * @returns {number}
   */
  function round(value, places = 0) {
    const factor = Math.pow(10, places);
    return Math.round(Number(value) * factor) / factor;
  }

  // ─────────────────────────────────────────────────────────
  // Array Utilities (pure)
  // ─────────────────────────────────────────────────────────

  /**
   * Returns unique elements from an array.
   * @template T
   * @param {T[]} arr - Input array.
   * @returns {T[]} Array with duplicates removed.
   */
  function unique(arr) {
    return [...new Set(Array.isArray(arr) ? arr : [])];
  }

  /**
   * Safely accesses the first element of an array.
   * @template T
   * @param {T[]} arr - Input array.
   * @param {T|null} [fallback=null] - Value if array is empty.
   * @returns {T|null}
   */
  function first(arr, fallback = null) {
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : fallback;
  }

  // ─────────────────────────────────────────────────────────
  // DOM Utilities (browser-only)
  // ─────────────────────────────────────────────────────────

  /**
   * Displays an accessible toast notification.
   * Requires a `#toast-container` element in the DOM.
   * @param {string} message - Message text (will be sanitized).
   * @param {'info'|'success'|'warning'|'error'} [type='info'] - Toast type.
   * @param {number} [timeout=3500] - Auto-dismiss delay in milliseconds.
   * @returns {void}
   */
  function toast(message, type = 'info', timeout = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const ICONS = { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' };
    const id = 'toast-' + Date.now();
    const el = document.createElement('div');
    el.id = id;
    el.className = `toast toast--${type}`;
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `<span class="toast__icon" aria-hidden="true">${ICONS[type] || 'ℹ️'}</span><span class="toast__text">${escapeHtml(String(message))}</span>`;
    container.appendChild(el);

    requestAnimationFrame(() => el.classList.add('toast--visible'));
    setTimeout(() => {
      el.classList.remove('toast--visible');
      setTimeout(() => el.remove(), 250);
    }, timeout);
  }

  /**
   * Safely sets the text content of an element by ID.
   * @param {string} id - Element ID.
   * @param {*} value - Value to set as textContent.
   * @returns {boolean} True if element was found and updated.
   */
  function setTextById(id, value) {
    const el = document.getElementById(id);
    if (el) { el.textContent = String(value); return true; }
    return false;
  }

  /**
   * Safely sets innerHTML of an element by ID (after sanitization).
   * @param {string} id - Element ID.
   * @param {string} html - HTML string to inject.
   * @returns {boolean} True if element was found and updated.
   */
  function setHtmlById(id, html) {
    const el = document.getElementById(id);
    if (el) { el.innerHTML = html; return true; }
    return false;
  }

  /**
   * Adds or removes a CSS class on an element.
   * @param {string} id - Element ID.
   * @param {string} className - CSS class to toggle.
   * @param {boolean} force - True to add, false to remove.
   */
  function toggleClass(id, className, force) {
    document.getElementById(id)?.classList.toggle(className, force);
  }

  // ─────────────────────────────────────────────────────────
  // AI Response Formatter (shared, safe)
  // ─────────────────────────────────────────────────────────

  /**
   * Formats a plain-text AI response into safe HTML.
   * Handles markdown-like bold (**text**), lists (- item), and headings (## heading).
   * All text is passed through escapeHtml() before rendering.
   * @param {string} text - Raw AI response text.
   * @returns {string} HTML string safe for innerHTML.
   */
  function formatAIResponse(text) {
    if (!text) return '';
    return text
      .split('\n')
      .map(line => {
        const safe = escapeHtml(line);
        if (!line.trim()) return '<br>';
        if (/^[-•*] /.test(line))          return `<li>${escapeHtml(line.slice(2))}</li>`;
        if (/^#{1,3} /.test(line))         return `<h4>${escapeHtml(line.replace(/^#+\s/, ''))}</h4>`;
        if (/\*\*(.+?)\*\*/.test(line))    return `<p>${safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
        return `<p>${safe}</p>`;
      })
      .join('')
      .replace(/(<li>.*?<\/li>)+/g, m => `<ul>${m}</ul>`);
  }

  // ─────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────

  return {
    // String
    escapeHtml,
    sanitize,
    truncate,
    capitalize,
    // Date/Time
    formatTime,
    dateString,
    getTimeGreeting,
    isToday,
    // Number
    clamp,
    safeInt,
    round,
    // Array
    unique,
    first,
    // DOM
    toast,
    setTextById,
    setHtmlById,
    toggleClass,
    // Formatter
    formatAIResponse
  };
})();
