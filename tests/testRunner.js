/**
 * @fileoverview Lightweight in-browser test runner for StressLess Student AI.
 * No external dependencies required. Runs synchronous unit tests only.
 * Displays pass/fail results grouped by suite in the browser UI.
 *
 * @module TestRunner
 * @version 1.0.0
 */

const TestRunner = (() => {

  /** @type {Array<{suite:string, name:string, status:'pass'|'fail', error:string|null, duration:number}>} */
  const results = [];

  /** @type {string[]} Suites in registration order */
  const suiteOrder = [];

  // ─────────────────────────────────────────────────────────
  // Core API
  // ─────────────────────────────────────────────────────────

  /**
   * Registers and immediately runs a test case.
   * @param {string} suite - Name of the test suite (e.g. 'Mood Tracker').
   * @param {string} name - Descriptive test name.
   * @param {function(): void} fn - Test body. Should call assert() to validate.
   */
  function test(suite, name, fn) {
    if (!suiteOrder.includes(suite)) suiteOrder.push(suite);
    const start = performance.now();
    try {
      fn();
      const duration = performance.now() - start;
      results.push({ suite, name, status: 'pass', error: null, duration: Math.round(duration * 100) / 100 });
    } catch (e) {
      const duration = performance.now() - start;
      results.push({ suite, name, status: 'fail', error: e.message || String(e), duration: Math.round(duration * 100) / 100 });
    }
  }

  /**
   * Asserts that a condition is truthy. Throws if false.
   * @param {boolean} condition - The condition to check.
   * @param {string} [message='Assertion failed'] - Failure message.
   * @throws {Error} If condition is falsy.
   */
  function assert(condition, message = 'Assertion failed') {
    if (!condition) throw new Error(message);
  }

  /**
   * Asserts that two values are strictly equal (===).
   * @param {*} actual - The actual value.
   * @param {*} expected - The expected value.
   * @param {string} [message] - Optional failure message.
   */
  function assertEqual(actual, expected, message) {
    const msg = message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`;
    if (actual !== expected) throw new Error(msg);
  }

  /**
   * Asserts that two values are NOT equal.
   * @param {*} actual - Actual value.
   * @param {*} unexpected - Value that actual must NOT equal.
   * @param {string} [message] - Optional failure message.
   */
  function assertNotEqual(actual, unexpected, message) {
    const msg = message || `Expected value to not equal ${JSON.stringify(unexpected)}`;
    if (actual === unexpected) throw new Error(msg);
  }

  /**
   * Asserts that a function throws an error.
   * @param {function(): void} fn - Function that should throw.
   * @param {string} [message='Expected function to throw'] - Failure message.
   */
  function assertThrows(fn, message = 'Expected function to throw') {
    let threw = false;
    try { fn(); } catch (e) { threw = true; }
    if (!threw) throw new Error(message);
  }

  // ─────────────────────────────────────────────────────────
  // Results
  // ─────────────────────────────────────────────────────────

  /**
   * Returns summary statistics.
   * @returns {{ total: number, passed: number, failed: number, suites: number, duration: number }}
   */
  function getSummary() {
    const passed  = results.filter(r => r.status === 'pass').length;
    const failed  = results.filter(r => r.status === 'fail').length;
    const duration = results.reduce((s, r) => s + r.duration, 0);
    return {
      total:   results.length,
      passed,
      failed,
      suites:  suiteOrder.length,
      duration: Math.round(duration * 10) / 10
    };
  }

  /**
   * Groups results by suite name.
   * @returns {Object.<string, Array>}
   */
  function getResultsBySuite() {
    const grouped = {};
    suiteOrder.forEach(suite => { grouped[suite] = []; });
    results.forEach(r => {
      if (!grouped[r.suite]) grouped[r.suite] = [];
      grouped[r.suite].push(r);
    });
    return grouped;
  }

  /**
   * Renders test results into a DOM element.
   * @param {HTMLElement} container - Container element to render into.
   */
  function render(container) {
    if (!container) return;
    const summary = getSummary();
    const grouped = getResultsBySuite();
    const pct     = summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0;

    const statusColor = summary.failed === 0 ? '#2DD4BF' : summary.failed <= 3 ? '#F59E0B' : '#EF4444';
    const statusIcon  = summary.failed === 0 ? '✅' : '❌';

    // Summary banner
    let html = `
      <div class="tr-summary" style="border-color:${statusColor}">
        <div class="tr-summary-main">
          <span class="tr-status-icon" aria-hidden="true">${statusIcon}</span>
          <div>
            <div class="tr-summary-title">
              ${summary.failed === 0 ? 'All Tests Passed!' : `${summary.failed} Test${summary.failed > 1 ? 's' : ''} Failed`}
            </div>
            <div class="tr-summary-sub">
              ${summary.passed} passed · ${summary.failed} failed · ${summary.total} total · ${summary.suites} suites · ${summary.duration}ms
            </div>
          </div>
        </div>
        <div class="tr-progress-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="${pct}% tests passing">
          <div class="tr-progress-fill" style="width:${pct}%;background:${statusColor}"></div>
        </div>
        <div class="tr-pct" style="color:${statusColor}">${pct}% passing</div>
      </div>`;

    // Suite sections
    Object.entries(grouped).forEach(([suite, tests]) => {
      const suitePassed = tests.filter(t => t.status === 'pass').length;
      const suiteFailed = tests.filter(t => t.status === 'fail').length;
      const suiteColor  = suiteFailed === 0 ? '#2DD4BF' : '#EF4444';

      html += `
        <div class="tr-suite">
          <div class="tr-suite-header" style="border-left-color:${suiteColor}">
            <span class="tr-suite-name">${escHtml(suite)}</span>
            <span class="tr-suite-counts" style="color:${suiteColor}">
              ${suitePassed}/${tests.length} passed
            </span>
          </div>
          <div class="tr-tests">`;

      tests.forEach(t => {
        const icon = t.status === 'pass' ? '✅' : '❌';
        html += `
            <div class="tr-test tr-test--${t.status}" role="listitem">
              <span class="tr-test-icon" aria-hidden="true">${icon}</span>
              <div class="tr-test-body">
                <div class="tr-test-name">${escHtml(t.name)}</div>
                ${t.error ? `<div class="tr-test-error" role="alert">⚠️ ${escHtml(t.error)}</div>` : ''}
              </div>
              <span class="tr-test-duration">${t.duration}ms</span>
            </div>`;
      });

      html += `</div></div>`;
    });

    container.innerHTML = html;
  }

  function escHtml(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─────────────────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────────────────

  return { test, assert, assertEqual, assertNotEqual, assertThrows, getSummary, getResultsBySuite, render };
})();
