/**
 * @fileoverview Tests for Wellness Score Engine — pure calculation and validation.
 * Tests calculateWellnessScore(), validateWellnessInput(), getWellnessLevel() from js/validation.js.
 * No DOM, no network — pure unit tests.
 *
 * @module tests/wellnessScore.test
 */

(function (TestRunner) {
  const suite = 'Wellness Score Engine';

  // ── validateWellnessInput() ──────────────────────────────

  TestRunner.test(suite, 'validateWellnessInput: valid values pass', () => {
    const r = Validation.validateWellnessInput({ sleep: 8, water: 6, study: 6, stress: 4 });
    TestRunner.assert(r.valid === true, 'Valid wellness input should pass');
    TestRunner.assert(r.error === null, 'No error expected for valid input');
  });

  TestRunner.test(suite, 'validateWellnessInput: min boundary values pass', () => {
    const r = Validation.validateWellnessInput({ sleep: 4, water: 0, study: 0, stress: 1 });
    TestRunner.assert(r.valid === true, 'Min boundary values should be valid');
  });

  TestRunner.test(suite, 'validateWellnessInput: max boundary values pass', () => {
    const r = Validation.validateWellnessInput({ sleep: 12, water: 12, study: 16, stress: 10 });
    TestRunner.assert(r.valid === true, 'Max boundary values should be valid');
  });

  TestRunner.test(suite, 'validateWellnessInput: sleep below min (3h) fails', () => {
    const r = Validation.validateWellnessInput({ sleep: 3, water: 6, study: 6, stress: 4 });
    TestRunner.assert(r.valid === false, 'Sleep < 4 should fail');
    TestRunner.assert(r.error.toLowerCase().includes('sleep'), 'Error should mention sleep');
  });

  TestRunner.test(suite, 'validateWellnessInput: sleep above max (13h) fails', () => {
    const r = Validation.validateWellnessInput({ sleep: 13, water: 6, study: 6, stress: 4 });
    TestRunner.assert(r.valid === false, 'Sleep > 12 should fail');
  });

  TestRunner.test(suite, 'validateWellnessInput: stress above max (11) fails', () => {
    const r = Validation.validateWellnessInput({ sleep: 8, water: 6, study: 6, stress: 11 });
    TestRunner.assert(r.valid === false, 'Stress > 10 should fail');
    TestRunner.assert(r.error.toLowerCase().includes('stress'), 'Error should mention stress');
  });

  TestRunner.test(suite, 'validateWellnessInput: negative water fails', () => {
    const r = Validation.validateWellnessInput({ sleep: 8, water: -1, study: 6, stress: 4 });
    TestRunner.assert(r.valid === false, 'Negative water should fail');
  });

  TestRunner.test(suite, 'validateWellnessInput: study above 16 fails', () => {
    const r = Validation.validateWellnessInput({ sleep: 8, water: 6, study: 17, stress: 4 });
    TestRunner.assert(r.valid === false, 'Study > 16 should fail');
  });

  // ── calculateWellnessScore() ─────────────────────────────

  TestRunner.test(suite, 'calculateWellnessScore: returns a number', () => {
    const score = Validation.calculateWellnessScore({ moodId: 'okay', sleep: 7, water: 6, study: 6, stress: 5 });
    TestRunner.assert(typeof score === 'number', 'Score should be a number');
    TestRunner.assert(!isNaN(score), 'Score should not be NaN');
  });

  TestRunner.test(suite, 'calculateWellnessScore: score is 0–100', () => {
    const score = Validation.calculateWellnessScore({ moodId: 'happy', sleep: 8, water: 8, study: 8, stress: 1 });
    TestRunner.assert(score >= 0 && score <= 100, `Score ${score} should be in 0–100 range`);
  });

  TestRunner.test(suite, 'calculateWellnessScore: optimal inputs give high score (≥80)', () => {
    const score = Validation.calculateWellnessScore({ moodId: 'happy', sleep: 8, water: 8, study: 8, stress: 1 });
    TestRunner.assert(score >= 80, `Optimal inputs should give ≥80, got ${score}`);
  });

  TestRunner.test(suite, 'calculateWellnessScore: poor inputs give low score (<40)', () => {
    const score = Validation.calculateWellnessScore({ moodId: 'burnout', sleep: 4, water: 0, study: 0, stress: 10 });
    TestRunner.assert(score < 40, `Poor inputs should give <40, got ${score}`);
  });

  TestRunner.test(suite, 'calculateWellnessScore: score increases with better sleep', () => {
    const s1 = Validation.calculateWellnessScore({ moodId: 'okay', sleep: 5, water: 6, study: 6, stress: 5 });
    const s2 = Validation.calculateWellnessScore({ moodId: 'okay', sleep: 8, water: 6, study: 6, stress: 5 });
    TestRunner.assert(s2 > s1, `Better sleep (8h vs 5h) should increase score: ${s1} → ${s2}`);
  });

  TestRunner.test(suite, 'calculateWellnessScore: score decreases with higher stress', () => {
    const s1 = Validation.calculateWellnessScore({ moodId: 'okay', sleep: 7, water: 6, study: 6, stress: 3 });
    const s2 = Validation.calculateWellnessScore({ moodId: 'okay', sleep: 7, water: 6, study: 6, stress: 9 });
    TestRunner.assert(s1 > s2, `Lower stress (3 vs 9) should give higher score: ${s1} vs ${s2}`);
  });

  TestRunner.test(suite, 'calculateWellnessScore: happy mood scores higher than burnout (same other values)', () => {
    const base = { sleep: 7, water: 6, study: 6, stress: 5 };
    const s1 = Validation.calculateWellnessScore({ ...base, moodId: 'happy' });
    const s2 = Validation.calculateWellnessScore({ ...base, moodId: 'burnout' });
    TestRunner.assert(s1 > s2, `Happy (${s1}) should score higher than burnout (${s2})`);
  });

  TestRunner.test(suite, 'calculateWellnessScore: default values produce valid score', () => {
    const score = Validation.calculateWellnessScore();
    TestRunner.assert(score >= 0 && score <= 100, `Default call should return valid score, got ${score}`);
  });

  TestRunner.test(suite, 'calculateWellnessScore: score is an integer', () => {
    const score = Validation.calculateWellnessScore({ moodId: 'okay', sleep: 7, water: 6, study: 6, stress: 5 });
    TestRunner.assert(Number.isInteger(score), `Score should be an integer, got ${score}`);
  });

  // ── getWellnessLevel() ───────────────────────────────────

  TestRunner.test(suite, 'getWellnessLevel: 90 → Excellent', () => {
    const { label } = Validation.getWellnessLevel(90);
    TestRunner.assert(label === 'Excellent', `Score 90 should be "Excellent", got "${label}"`);
  });

  TestRunner.test(suite, 'getWellnessLevel: 70 → Good', () => {
    const { label } = Validation.getWellnessLevel(70);
    TestRunner.assert(label === 'Good', `Score 70 should be "Good", got "${label}"`);
  });

  TestRunner.test(suite, 'getWellnessLevel: 50 → Fair', () => {
    const { label } = Validation.getWellnessLevel(50);
    TestRunner.assert(label === 'Fair', `Score 50 should be "Fair", got "${label}"`);
  });

  TestRunner.test(suite, 'getWellnessLevel: 20 → Needs Care', () => {
    const { label } = Validation.getWellnessLevel(20);
    TestRunner.assert(label === 'Needs Care', `Score 20 should be "Needs Care", got "${label}"`);
  });

  TestRunner.test(suite, 'getWellnessLevel: boundary 80 → Excellent', () => {
    const { label } = Validation.getWellnessLevel(80);
    TestRunner.assert(label === 'Excellent', `Score 80 should be "Excellent", got "${label}"`);
  });

  TestRunner.test(suite, 'getWellnessLevel: returns color and emoji', () => {
    const level = Validation.getWellnessLevel(85);
    TestRunner.assert(typeof level.color === 'string' && level.color.startsWith('#'),
      'Level should include a hex color');
    TestRunner.assert(typeof level.emoji === 'string' && level.emoji.length > 0,
      'Level should include an emoji');
  });

  // ── WEIGHTS constant ─────────────────────────────────────

  TestRunner.test(suite, 'WEIGHTS sum to 1.0', () => {
    const total = Object.values(Validation.WEIGHTS).reduce((s, w) => s + w, 0);
    TestRunner.assert(Math.abs(total - 1.0) < 0.001, `Weights should sum to 1.0, got ${total}`);
  });

  TestRunner.test(suite, 'WEIGHTS: mood has highest weight', () => {
    const { mood, sleep, water, study, stress } = Validation.WEIGHTS;
    TestRunner.assert(mood >= sleep && mood >= water && mood >= study && mood >= stress,
      'Mood should have the highest weight');
  });

})(TestRunner);
