// Lightweight Storage abstraction with safe JSON handling
const Storage = (() => {
  const prefix = 'sls_';
  function safeParse(v, fallback) {
    try { return JSON.parse(v); } catch (e) { return fallback; }
  }
  function get(key, fallback=null) {
    try {
      const raw = localStorage.getItem(prefix+key);
      if (raw === null) return fallback;
      return safeParse(raw, fallback);
    } catch (e) { return fallback; }
  }
  function set(key, value) {
    try { localStorage.setItem(prefix+key, JSON.stringify(value)); return true; } catch (e) { return false; }
  }
  function remove(key) { try { localStorage.removeItem(prefix+key); } catch (e) {} }
  function clear() { try { Object.keys(localStorage).forEach(k => { if (k.startsWith(prefix)) localStorage.removeItem(k); }); } catch (e) {} }
  return { get, set, remove, clear };
})();
