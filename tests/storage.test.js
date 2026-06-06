/**
 * @fileoverview Tests for Storage abstraction layer (js/storage.js) and Utils (js/utils.js).
 * Tests: Storage.get/set/remove/clear, Utils pure functions.
 * Storage tests require localStorage (browser environment).
 *
 * @module tests/storage.test
 */

(function (TestRunner) {

  // ═══════════════════════════════════════════════════════════
  // STORAGE TESTS
  // ═══════════════════════════════════════════════════════════

  const suite = 'Storage';

  TestRunner.test(suite, 'Storage.set returns true on success', () => {
    const ok = Storage.set('test_key', 'hello');
    TestRunner.assert(ok === true, 'set() should return true on success');
    Storage.remove('test_key');
  });

  TestRunner.test(suite, 'Storage.get retrieves stored string', () => {
    Storage.set('test_str', 'world');
    const val = Storage.get('test_str');
    TestRunner.assert(val === 'world', `Expected "world", got "${val}"`);
    Storage.remove('test_str');
  });

  TestRunner.test(suite, 'Storage.get retrieves stored number', () => {
    Storage.set('test_num', 42);
    const val = Storage.get('test_num');
    TestRunner.assert(val === 42, `Expected 42, got ${val}`);
    Storage.remove('test_num');
  });

  TestRunner.test(suite, 'Storage.get retrieves stored array', () => {
    Storage.set('test_arr', [1, 2, 3]);
    const val = Storage.get('test_arr');
    TestRunner.assert(Array.isArray(val), 'Expected an array');
    TestRunner.assert(val.length === 3, `Expected length 3, got ${val.length}`);
    TestRunner.assert(val[0] === 1, `Expected val[0]=1, got ${val[0]}`);
    Storage.remove('test_arr');
  });

  TestRunner.test(suite, 'Storage.get retrieves stored object', () => {
    Storage.set('test_obj', { name: 'Priya', score: 95 });
    const val = Storage.get('test_obj');
    TestRunner.assert(typeof val === 'object' && val !== null, 'Expected an object');
    TestRunner.assert(val.name === 'Priya', `Expected name="Priya", got "${val.name}"`);
    TestRunner.assert(val.score === 95, `Expected score=95, got ${val.score}`);
    Storage.remove('test_obj');
  });

  TestRunner.test(suite, 'Storage.get returns fallback for missing key', () => {
    const val = Storage.get('nonexistent_key_xyz', 'default');
    TestRunner.assert(val === 'default', `Expected "default" fallback, got "${val}"`);
  });

  TestRunner.test(suite, 'Storage.get returns null fallback by default', () => {
    const val = Storage.get('nonexistent_key_abc');
    TestRunner.assert(val === null, `Expected null fallback, got ${val}`);
  });

  TestRunner.test(suite, 'Storage.get returns array fallback', () => {
    const val = Storage.get('nonexistent_array_key', []);
    TestRunner.assert(Array.isArray(val) && val.length === 0,
      `Expected empty array fallback, got ${JSON.stringify(val)}`);
  });

  TestRunner.test(suite, 'Storage.remove deletes a key', () => {
    Storage.set('test_remove', 'delete_me');
    Storage.remove('test_remove');
    const val = Storage.get('test_remove', null);
    TestRunner.assert(val === null, 'After remove, get should return null');
  });

  TestRunner.test(suite, 'Storage.set overwrites existing value', () => {
    Storage.set('test_overwrite', 'original');
    Storage.set('test_overwrite', 'updated');
    const val = Storage.get('test_overwrite');
    TestRunner.assert(val === 'updated', `Expected "updated", got "${val}"`);
    Storage.remove('test_overwrite');
  });

  TestRunner.test(suite, 'Storage.set stores boolean true', () => {
    Storage.set('test_bool', true);
    const val = Storage.get('test_bool');
    TestRunner.assert(val === true, `Expected true, got ${val}`);
    Storage.remove('test_bool');
  });

  TestRunner.test(suite, 'Storage.set stores boolean false', () => {
    Storage.set('test_bool_f', false);
    const val = Storage.get('test_bool_f');
    TestRunner.assert(val === false, `Expected false, got ${val}`);
    Storage.remove('test_bool_f');
  });

  TestRunner.test(suite, 'Storage.set stores null', () => {
    Storage.set('test_null', null);
    const val = Storage.get('test_null', 'fallback');
    // null gets stored as JSON "null", which parses back to null
    TestRunner.assert(val === null, `Expected null, got ${val}`);
    Storage.remove('test_null');
  });

  TestRunner.test(suite, 'Storage: sls_ prefix does not leak into raw localStorage', () => {
    Storage.set('prefix_test', 'value');
    const raw = localStorage.getItem('prefix_test'); // Without prefix
    const withPrefix = localStorage.getItem('sls_prefix_test'); // With prefix
    TestRunner.assert(raw === null, 'Key without prefix should not exist');
    TestRunner.assert(withPrefix !== null, 'Key with prefix should exist');
    Storage.remove('prefix_test');
  });

  TestRunner.test(suite, 'Storage.clear removes all sls_ keys', () => {
    Storage.set('clear_a', 1);
    Storage.set('clear_b', 2);
    Storage.set('clear_c', 3);
    Storage.clear();
    TestRunner.assert(Storage.get('clear_a') === null, 'clear_a should be gone');
    TestRunner.assert(Storage.get('clear_b') === null, 'clear_b should be gone');
    TestRunner.assert(Storage.get('clear_c') === null, 'clear_c should be gone');
  });

  // ═══════════════════════════════════════════════════════════
  // UTILS TESTS (pure functions only — no DOM)
  // ═══════════════════════════════════════════════════════════

  const uSuite = 'Utils';

  // ── escapeHtml ───────────────────────────────────────────

  TestRunner.test(uSuite, 'escapeHtml: escapes < and >', () => {
    const r = Utils.escapeHtml('<script>');
    TestRunner.assert(r === '&lt;script&gt;', `Expected "&lt;script&gt;", got "${r}"`);
  });

  TestRunner.test(uSuite, 'escapeHtml: escapes &', () => {
    const r = Utils.escapeHtml('A & B');
    TestRunner.assert(r === 'A &amp; B', `Expected "A &amp; B", got "${r}"`);
  });

  TestRunner.test(uSuite, 'escapeHtml: escapes double quotes', () => {
    const r = Utils.escapeHtml('"hello"');
    TestRunner.assert(r === '&quot;hello&quot;', `Expected "&quot;hello&quot;", got "${r}"`);
  });

  TestRunner.test(uSuite, 'escapeHtml: escapes single quotes', () => {
    const r = Utils.escapeHtml("it's");
    TestRunner.assert(r === 'it&#39;s', `Expected "it&#39;s", got "${r}"`);
  });

  TestRunner.test(uSuite, 'escapeHtml: plain text unchanged', () => {
    const r = Utils.escapeHtml('Hello World');
    TestRunner.assert(r === 'Hello World', `Plain text should be unchanged, got "${r}"`);
  });

  TestRunner.test(uSuite, 'escapeHtml: XSS payload neutralised', () => {
    const r = Utils.escapeHtml('<img src=x onerror=alert(1)>');
    TestRunner.assert(!r.includes('<img'), 'XSS payload should not contain <img');
    TestRunner.assert(!r.includes('onerror'), 'XSS payload should not contain onerror');
  });

  TestRunner.test(uSuite, 'escapeHtml: number coerced to string', () => {
    const r = Utils.escapeHtml(42);
    TestRunner.assert(r === '42', `Number should be coerced to "42", got "${r}"`);
  });

  TestRunner.test(uSuite, 'escapeHtml: empty string returns empty string', () => {
    const r = Utils.escapeHtml('');
    TestRunner.assert(r === '', `Empty string should return empty, got "${r}"`);
  });

  // ── truncate ─────────────────────────────────────────────

  TestRunner.test(uSuite, 'truncate: short string unchanged', () => {
    const r = Utils.truncate('Hello', 100);
    TestRunner.assert(r === 'Hello', `Short string should be unchanged, got "${r}"`);
  });

  TestRunner.test(uSuite, 'truncate: long string gets ellipsis', () => {
    const r = Utils.truncate('Hello World', 5);
    TestRunner.assert(r === 'Hello…', `Expected "Hello…", got "${r}"`);
  });

  TestRunner.test(uSuite, 'truncate: exact length not truncated', () => {
    const r = Utils.truncate('Hello', 5);
    TestRunner.assert(r === 'Hello', `Exact length should not be truncated, got "${r}"`);
  });

  // ── clamp ────────────────────────────────────────────────

  TestRunner.test(uSuite, 'clamp: value within range unchanged', () => {
    const r = Utils.clamp(5, 0, 10);
    TestRunner.assert(r === 5, `clamp(5, 0, 10) should be 5, got ${r}`);
  });

  TestRunner.test(uSuite, 'clamp: value below min returns min', () => {
    const r = Utils.clamp(-5, 0, 10);
    TestRunner.assert(r === 0, `clamp(-5, 0, 10) should be 0, got ${r}`);
  });

  TestRunner.test(uSuite, 'clamp: value above max returns max', () => {
    const r = Utils.clamp(15, 0, 10);
    TestRunner.assert(r === 10, `clamp(15, 0, 10) should be 10, got ${r}`);
  });

  TestRunner.test(uSuite, 'clamp: NaN returns min', () => {
    const r = Utils.clamp(NaN, 0, 10);
    TestRunner.assert(r === 0, `clamp(NaN, 0, 10) should return min=0, got ${r}`);
  });

  // ── capitalize ───────────────────────────────────────────

  TestRunner.test(uSuite, 'capitalize: lowercases rest', () => {
    const r = Utils.capitalize('hello');
    TestRunner.assert(r === 'Hello', `Expected "Hello", got "${r}"`);
  });

  TestRunner.test(uSuite, 'capitalize: empty string returns empty', () => {
    const r = Utils.capitalize('');
    TestRunner.assert(r === '', `Empty string should return empty, got "${r}"`);
  });

  // ── round ────────────────────────────────────────────────

  TestRunner.test(uSuite, 'round: rounds to nearest integer', () => {
    TestRunner.assert(Utils.round(3.6) === 4, 'round(3.6) should be 4');
    TestRunner.assert(Utils.round(3.4) === 3, 'round(3.4) should be 3');
  });

  TestRunner.test(uSuite, 'round: rounds to 1 decimal place', () => {
    const r = Utils.round(3.567, 1);
    TestRunner.assert(r === 3.6, `round(3.567, 1) should be 3.6, got ${r}`);
  });

  // ── unique ───────────────────────────────────────────────

  TestRunner.test(uSuite, 'unique: removes duplicates', () => {
    const r = Utils.unique([1, 2, 2, 3, 3, 3]);
    TestRunner.assert(r.length === 3, `Expected 3 unique items, got ${r.length}`);
  });

  TestRunner.test(uSuite, 'unique: empty array returns empty', () => {
    const r = Utils.unique([]);
    TestRunner.assert(r.length === 0, 'Empty array should return empty unique');
  });

  // ── inRange (via Validation) ─────────────────────────────

  TestRunner.test(uSuite, 'inRange: value in range is true', () => {
    TestRunner.assert(Validation.inRange(5, 0, 10) === true, 'inRange(5, 0, 10) should be true');
  });

  TestRunner.test(uSuite, 'inRange: value at min boundary is true', () => {
    TestRunner.assert(Validation.inRange(0, 0, 10) === true, 'inRange(0, 0, 10) should be true');
  });

  TestRunner.test(uSuite, 'inRange: value at max boundary is true', () => {
    TestRunner.assert(Validation.inRange(10, 0, 10) === true, 'inRange(10, 0, 10) should be true');
  });

  TestRunner.test(uSuite, 'inRange: value below min is false', () => {
    TestRunner.assert(Validation.inRange(-1, 0, 10) === false, 'inRange(-1, 0, 10) should be false');
  });

  TestRunner.test(uSuite, 'inRange: value above max is false', () => {
    TestRunner.assert(Validation.inRange(11, 0, 10) === false, 'inRange(11, 0, 10) should be false');
  });

  TestRunner.test(uSuite, 'inRange: NaN is false', () => {
    TestRunner.assert(Validation.inRange(NaN, 0, 10) === false, 'inRange(NaN) should be false');
  });

  // ── isNonEmpty (via Validation) ──────────────────────────

  TestRunner.test(uSuite, 'isNonEmpty: non-empty string is true', () => {
    TestRunner.assert(Validation.isNonEmpty('hello') === true, '"hello" should be non-empty');
  });

  TestRunner.test(uSuite, 'isNonEmpty: empty string is false', () => {
    TestRunner.assert(Validation.isNonEmpty('') === false, 'Empty string should fail');
  });

  TestRunner.test(uSuite, 'isNonEmpty: whitespace-only string is false', () => {
    TestRunner.assert(Validation.isNonEmpty('   ') === false, 'Whitespace string should fail');
  });

  TestRunner.test(uSuite, 'isNonEmpty: number is false (not a string)', () => {
    TestRunner.assert(Validation.isNonEmpty(42) === false, 'Number should fail isNonEmpty');
  });

})(TestRunner);
