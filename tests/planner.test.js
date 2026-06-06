/**
 * @fileoverview Tests for Study Wellness Planner validation logic.
 * Tests validatePlannerInput() from js/validation.js.
 * No DOM, no network — pure unit tests.
 *
 * @module tests/planner.test
 */

(function (TestRunner) {
  const suite = 'Study Wellness Planner';

  // ── validatePlannerInput() ───────────────────────────────

  TestRunner.test(suite, 'validatePlannerInput: valid JEE input passes', () => {
    const r = Validation.validatePlannerInput({
      examType: 'JEE', daysRemaining: 30, stressLevel: 5, studyHours: 6, sleepHours: 7
    });
    TestRunner.assert(r.valid === true, 'Valid JEE input should pass');
    TestRunner.assert(r.error === null, 'No error expected');
  });

  TestRunner.test(suite, 'validatePlannerInput: all valid exam types pass', () => {
    const exams = ['JEE', 'NEET', 'CUET', 'CAT', 'GATE', 'UPSC', 'Board Exams', 'Other'];
    exams.forEach(exam => {
      const r = Validation.validatePlannerInput({ examType: exam, daysRemaining: 30 });
      TestRunner.assert(r.valid === true, `Exam type "${exam}" should be valid`);
    });
  });

  TestRunner.test(suite, 'validatePlannerInput: empty exam type fails', () => {
    const r = Validation.validatePlannerInput({ examType: '' });
    TestRunner.assert(r.valid === false, 'Empty exam type should fail');
    TestRunner.assert(typeof r.error === 'string', 'Should return an error message');
  });

  TestRunner.test(suite, 'validatePlannerInput: null exam type fails', () => {
    const r = Validation.validatePlannerInput({ examType: null });
    TestRunner.assert(r.valid === false, 'Null exam type should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: undefined exam type fails', () => {
    const r = Validation.validatePlannerInput({});
    TestRunner.assert(r.valid === false, 'Missing exam type should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: invalid exam type fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'SAT' });
    TestRunner.assert(r.valid === false, '"SAT" is not a valid exam type');
    TestRunner.assert(r.error.includes('Invalid exam type'), 'Error should mention invalid exam type');
  });

  TestRunner.test(suite, 'validatePlannerInput: days 1 (min) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'JEE', daysRemaining: 1 });
    TestRunner.assert(r.valid === true, '1 day remaining should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: days 365 (max) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'JEE', daysRemaining: 365 });
    TestRunner.assert(r.valid === true, '365 days remaining should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: days 0 fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'JEE', daysRemaining: 0 });
    TestRunner.assert(r.valid === false, '0 days remaining should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: days 366 fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'JEE', daysRemaining: 366 });
    TestRunner.assert(r.valid === false, '366 days should exceed max');
  });

  TestRunner.test(suite, 'validatePlannerInput: stress 1 (min) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'NEET', stressLevel: 1 });
    TestRunner.assert(r.valid === true, 'Stress=1 should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: stress 10 (max) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'NEET', stressLevel: 10 });
    TestRunner.assert(r.valid === true, 'Stress=10 should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: stress 0 fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'NEET', stressLevel: 0 });
    TestRunner.assert(r.valid === false, 'Stress=0 should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: stress 11 fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'NEET', stressLevel: 11 });
    TestRunner.assert(r.valid === false, 'Stress=11 should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: study 0 (min) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'CAT', studyHours: 0 });
    TestRunner.assert(r.valid === true, 'studyHours=0 should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: study 16 (max) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'CAT', studyHours: 16 });
    TestRunner.assert(r.valid === true, 'studyHours=16 should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: study 17 fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'CAT', studyHours: 17 });
    TestRunner.assert(r.valid === false, 'studyHours=17 should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: sleep 4 (min) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'GATE', sleepHours: 4 });
    TestRunner.assert(r.valid === true, 'sleepHours=4 should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: sleep 12 (max) passes', () => {
    const r = Validation.validatePlannerInput({ examType: 'GATE', sleepHours: 12 });
    TestRunner.assert(r.valid === true, 'sleepHours=12 should be valid');
  });

  TestRunner.test(suite, 'validatePlannerInput: sleep 3 fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'GATE', sleepHours: 3 });
    TestRunner.assert(r.valid === false, 'sleepHours=3 should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: sleep 13 fails', () => {
    const r = Validation.validatePlannerInput({ examType: 'GATE', sleepHours: 13 });
    TestRunner.assert(r.valid === false, 'sleepHours=13 should fail');
  });

  TestRunner.test(suite, 'validatePlannerInput: defaults are valid', () => {
    // Only providing examType — all other fields should default to valid values
    const r = Validation.validatePlannerInput({ examType: 'UPSC' });
    TestRunner.assert(r.valid === true, 'Default values with valid exam should pass');
  });

  // ── VALID_EXAM_TYPES constant ────────────────────────────

  TestRunner.test(suite, 'VALID_EXAM_TYPES contains 8 items', () => {
    TestRunner.assert(
      Validation.VALID_EXAM_TYPES.length === 8,
      `Expected 8 exam types, got ${Validation.VALID_EXAM_TYPES.length}`
    );
  });

  TestRunner.test(suite, 'VALID_EXAM_TYPES includes JEE and NEET', () => {
    TestRunner.assert(Validation.VALID_EXAM_TYPES.includes('JEE'),  'Should include JEE');
    TestRunner.assert(Validation.VALID_EXAM_TYPES.includes('NEET'), 'Should include NEET');
    TestRunner.assert(Validation.VALID_EXAM_TYPES.includes('UPSC'), 'Should include UPSC');
  });

})(TestRunner);
