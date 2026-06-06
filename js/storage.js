/**
 * StressLess Student AI - Storage Module
 * Centralized LocalStorage abstraction with namespacing and error handling.
 */

const Storage = (() => {
  const NS = 'stressless_';

  function key(name) {
    return NS + name;
  }

  function get(name, defaultValue = null) {
    try {
      const raw = localStorage.getItem(key(name));
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch (e) {
      console.warn('Storage.get error:', e);
      return defaultValue;
    }
  }

  function set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Storage.set error (quota exceeded?):', e);
      return false;
    }
  }

  function remove(name) {
    try {
      localStorage.removeItem(key(name));
    } catch (e) {
      console.warn('Storage.remove error:', e);
    }
  }

  function append(name, item) {
    const arr = get(name, []);
    arr.push(item);
    return set(name, arr);
  }

  function getAll(name) {
    return get(name, []);
  }

  /** Get items from the last N days */
  function getRecent(name, days = 7) {
    const all = get(name, []);
    const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
    return all.filter(item => item.timestamp && item.timestamp >= cutoff);
  }

  return { get, set, remove, append, getAll, getRecent };
})();
