/**
 * @fileoverview Tests for Mood Tracker validation and business logic.
 * Tests validateMood() from js/validation.js.
 * No DOM, no network — pure unit tests.
 *
 * @module tests/moodTracker.test
 */

(function (TestRunner) {
  const suite = 'Mood Tracker';

  // ── validateMood() ───────────────────────────────────────

  TestRunner.test(suite, 'validateMood: valid mood "happy" passes', () => {
    const r = Validation.validateMood('happy');
    TestRunner.assert(r.valid === true, 'Expected valid=true for "happy"');
    TestRunner.assert(r.error === null,  'Expected no error for "happy"');
  });

  TestRunner.test(suite, 'validateMood: valid mood "burnout" passes', () => {
    const r = Validation.validateMood('burnout');
    TestRunner.assert(r.valid === true, 'Expected valid=true for "burnout"');
  });

  TestRunner.test(suite, 'validateMood: all 6 valid moods pass', () => {
    const moods = ['happy', 'focused', 'okay', 'stressed', 'anxious', 'burnout'];
    moods.forEach(m => {
      const r = Validation.validateMood(m);
      TestRunner.assert(r.valid === true, `Expected "${m}" to be valid`);
    });
  });

  TestRunner.test(suite, 'validateMood: null input fails', () => {
    const r = Validation.validateMood(null);
    TestRunner.assert(r.valid === false, 'Expected valid=false for null');
    TestRunner.assert(typeof r.error === 'string', 'Expected error message');
  });

  TestRunner.test(suite, 'validateMood: undefined input fails', () => {
    const r = Validation.validateMood(undefined);
    TestRunner.assert(r.valid === false, 'Expected valid=false for undefined');
  });

  TestRunner.test(suite, 'validateMood: empty string fails', () => {
    const r = Validation.validateMood('');
    TestRunner.assert(r.valid === false, 'Expected valid=false for empty string');
  });

  TestRunner.test(suite, 'validateMood: invalid mood ID fails', () => {
    const r = Validation.validateMood('elated');
    TestRunner.assert(r.valid === false, 'Expected valid=false for unknown mood');
    TestRunner.assert(r.error.includes('Invalid mood'), 'Error should mention "Invalid mood"');
  });

  TestRunner.test(suite, 'validateMood: note within 500 chars passes', () => {
    const r = Validation.validateMood('happy', 'Feeling great!');
    TestRunner.assert(r.valid === true, 'Note within limit should pass');
  });

  TestRunner.test(suite, 'validateMood: note over 500 chars fails', () => {
    const longNote = 'a'.repeat(501);
    const r = Validation.validateMood('happy', longNote);
    TestRunner.assert(r.valid === false, 'Note over 500 chars should fail');
    TestRunner.assert(r.error.includes('too long'), 'Error should mention "too long"');
  });

  TestRunner.test(suite, 'validateMood: note exactly 500 chars passes', () => {
    const note = 'b'.repeat(500);
    const r = Validation.validateMood('happy', note);
    TestRunner.assert(r.valid === true, '500-char note should pass');
  });

  TestRunner.test(suite, 'validateMood: no note argument passes', () => {
    const r = Validation.validateMood('okay');
    TestRunner.assert(r.valid === true, 'No note should default to passing');
  });

  // ── VALID_MOODS constant ─────────────────────────────────

  TestRunner.test(suite, 'VALID_MOODS contains 6 items', () => {
    TestRunner.assert(Validation.VALID_MOODS.length === 6, `Expected 6 moods, got ${Validation.VALID_MOODS.length}`);
  });

  TestRunner.test(suite, 'VALID_MOODS includes happy, stressed, burnout', () => {
    ['happy', 'stressed', 'burnout'].forEach(m => {
      TestRunner.assert(Validation.VALID_MOODS.includes(m), `VALID_MOODS should include "${m}"`);
    });
  });

  // ── MOOD_SCORE_MAP ───────────────────────────────────────

  TestRunner.test(suite, 'MOOD_SCORE_MAP: happy=100, burnout=15', () => {
    TestRunner.assert(Validation.MOOD_SCORE_MAP['happy']   === 100, 'happy should score 100');
    TestRunner.assert(Validation.MOOD_SCORE_MAP['burnout'] === 15,  'burnout should score 15');
  });

  TestRunner.test(suite, 'MOOD_SCORE_MAP: stressed < okay', () => {
    TestRunner.assert(Validation.MOOD_SCORE_MAP['stressed'] < Validation.MOOD_SCORE_MAP['okay'],
      'stressed should score less than okay');
  });

  TestRunner.test(suite, 'MOOD_SCORE_MAP: focused > stressed', () => {
    TestRunner.assert(Validation.MOOD_SCORE_MAP['focused'] > Validation.MOOD_SCORE_MAP['stressed'],
      'focused should score higher than stressed');
  });

})(TestRunner);
