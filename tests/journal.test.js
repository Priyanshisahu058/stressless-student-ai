/**
 * @fileoverview Tests for Reflection Journal validation and streak logic.
 * Tests validateJournalEntry() and calculateStreak() from js/validation.js.
 * No DOM, no network — pure unit tests.
 *
 * @module tests/journal.test
 */

(function (TestRunner) {
  const suite = 'Reflection Journal';

  // ── Helper ────────────────────────────────────────────────

  /**
   * Creates a fake journal entry timestamp for N days ago.
   * @param {number} daysAgo - Number of days in the past (0 = today).
   * @returns {{timestamp: number}}
   */
  function entryDaysAgo(daysAgo) {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(12, 0, 0, 0); // noon to avoid DST edge cases
    return { timestamp: d.getTime() };
  }

  // ── validateJournalEntry() ───────────────────────────────

  TestRunner.test(suite, 'validateJournalEntry: all three answered passes', () => {
    const r = Validation.validateJournalEntry(['Answer 1', 'Answer 2', 'Answer 3']);
    TestRunner.assert(r.valid === true, 'All answers filled should pass');
    TestRunner.assert(r.error === null, 'No error expected');
  });

  TestRunner.test(suite, 'validateJournalEntry: one answer passes', () => {
    const r = Validation.validateJournalEntry(['', '', 'At least this one']);
    TestRunner.assert(r.valid === true, 'One answer should be sufficient');
  });

  TestRunner.test(suite, 'validateJournalEntry: first answer only passes', () => {
    const r = Validation.validateJournalEntry(['Only first']);
    TestRunner.assert(r.valid === true, 'First answer provided should pass');
  });

  TestRunner.test(suite, 'validateJournalEntry: all empty fails', () => {
    const r = Validation.validateJournalEntry(['', '', '']);
    TestRunner.assert(r.valid === false, 'All empty answers should fail');
    TestRunner.assert(typeof r.error === 'string', 'Should return an error message');
    TestRunner.assert(r.error.toLowerCase().includes('answer') || r.error.toLowerCase().includes('prompt'),
      'Error should mention answering a prompt');
  });

  TestRunner.test(suite, 'validateJournalEntry: whitespace-only answers fail', () => {
    const r = Validation.validateJournalEntry(['   ', '\t', '\n']);
    TestRunner.assert(r.valid === false, 'Whitespace-only answers should fail');
  });

  TestRunner.test(suite, 'validateJournalEntry: non-array input fails', () => {
    const r = Validation.validateJournalEntry('not an array');
    TestRunner.assert(r.valid === false, 'Non-array input should fail');
  });

  TestRunner.test(suite, 'validateJournalEntry: null input fails', () => {
    const r = Validation.validateJournalEntry(null);
    TestRunner.assert(r.valid === false, 'null answers should fail');
  });

  TestRunner.test(suite, 'validateJournalEntry: answer within 1000 chars passes', () => {
    const r = Validation.validateJournalEntry(['a'.repeat(1000), '', '']);
    TestRunner.assert(r.valid === true, '1000-char answer should pass');
  });

  TestRunner.test(suite, 'validateJournalEntry: answer over 1000 chars fails', () => {
    const r = Validation.validateJournalEntry(['a'.repeat(1001), '', '']);
    TestRunner.assert(r.valid === false, '1001-char answer should fail');
    TestRunner.assert(r.error.includes('too long'), 'Error should mention too long');
  });

  TestRunner.test(suite, 'validateJournalEntry: mixed filled and empty passes', () => {
    const r = Validation.validateJournalEntry(['Good day today', '', '']);
    TestRunner.assert(r.valid === true, 'First answer filled, others empty should pass');
  });

  TestRunner.test(suite, 'validateJournalEntry: empty array fails', () => {
    const r = Validation.validateJournalEntry([]);
    TestRunner.assert(r.valid === false, 'Empty array should fail');
  });

  // ── calculateStreak() ────────────────────────────────────

  TestRunner.test(suite, 'calculateStreak: empty array returns 0', () => {
    const streak = Validation.calculateStreak([]);
    TestRunner.assert(streak === 0, `Empty entries should give streak 0, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: null returns 0', () => {
    const streak = Validation.calculateStreak(null);
    TestRunner.assert(streak === 0, `null entries should give streak 0, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: entry today returns 1', () => {
    const streak = Validation.calculateStreak([entryDaysAgo(0)]);
    TestRunner.assert(streak === 1, `Entry today should give streak 1, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: entry yesterday returns 1', () => {
    const streak = Validation.calculateStreak([entryDaysAgo(1)]);
    TestRunner.assert(streak === 1, `Entry yesterday should give streak 1, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: 2 consecutive days returns 2', () => {
    const entries = [entryDaysAgo(0), entryDaysAgo(1)];
    const streak = Validation.calculateStreak(entries);
    TestRunner.assert(streak === 2, `2 consecutive days should give streak 2, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: 5 consecutive days returns 5', () => {
    const entries = [0,1,2,3,4].map(d => entryDaysAgo(d));
    const streak = Validation.calculateStreak(entries);
    TestRunner.assert(streak === 5, `5 consecutive days should give streak 5, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: gap breaks streak', () => {
    // Today and 2 days ago (no entry yesterday) → streak = 1
    const entries = [entryDaysAgo(0), entryDaysAgo(2)];
    const streak = Validation.calculateStreak(entries);
    TestRunner.assert(streak === 1, `Gap in streak should reset to 1, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: old entries only returns 0', () => {
    // Only entries from 3 days ago — streak is broken
    const entries = [entryDaysAgo(3), entryDaysAgo(4)];
    const streak = Validation.calculateStreak(entries);
    TestRunner.assert(streak === 0, `Old entries only should give streak 0, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: multiple entries same day count as one day', () => {
    // Two entries today should still only count as 1 day
    const entries = [
      { timestamp: new Date().setHours(9, 0, 0, 0) },
      { timestamp: new Date().setHours(21, 0, 0, 0) }
    ];
    const streak = Validation.calculateStreak(entries);
    TestRunner.assert(streak === 1, `Multiple entries same day should count as 1, got ${streak}`);
  });

  TestRunner.test(suite, 'calculateStreak: returns a non-negative integer', () => {
    const streak = Validation.calculateStreak([entryDaysAgo(0), entryDaysAgo(1), entryDaysAgo(2)]);
    TestRunner.assert(Number.isInteger(streak) && streak >= 0, `Streak must be non-negative integer, got ${streak}`);
  });

})(TestRunner);
