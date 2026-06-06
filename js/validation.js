/**
 * @fileoverview Pure validation functions for StressLess Student AI.
 * These functions have ZERO DOM dependency — they accept plain values
 * and return { valid: boolean, error: string | null }.
 * This makes them fully unit-testable without a browser environment.
 *
 * @module Validation
 * @version 2.0.0
 */

const Validation = (() => {

  // ─────────────────────────────────────────────────────────
  // Constants
  // ─────────────────────────────────────────────────────────

  /** Valid mood identifiers */
  const VALID_MOODS = ['happy', 'focused', 'okay', 'stressed', 'anxious', 'burnout'];

  /** Valid exam types for the planner */
  const VALID_EXAM_TYPES = ['JEE', 'NEET', 'CUET', 'CAT', 'GATE', 'UPSC', 'Board Exams', 'Other'];

  /** Wellness slider bounds */
  const BOUNDS = {
    sleep:  { min: 4,  max: 12  },
    water:  { min: 0,  max: 12  },
    study:  { min: 0,  max: 16  },
    stress: { min: 1,  max: 10  },
    days:   { min: 1,  max: 365 }
  };

  // ─────────────────────────────────────────────────────────
  // Helpers
  // ─────────────────────────────────────────────────────────

  /**
   * Creates a standardised validation result object.
   * @param {boolean} valid - Whether validation passed.
   * @param {string|null} [error=null] - Error message when invalid.
   * @returns {{ valid: boolean, error: string|null }}
   */
  function result(valid, error = null) {
    return { valid: Boolean(valid), error: valid ? null : String(error) };
  }

  /**
   * Checks if a numeric value falls within an inclusive range.
   * @param {number} value - The number to check.
   * @param {number} min - Minimum inclusive value.
   * @param {number} max - Maximum inclusive value.
   * @returns {boolean}
   */
  function inRange(value, min, max) {
    return typeof value === 'number' && !isNaN(value) && value >= min && value <= max;
  }

  /**
   * Checks if a string is non-empty after trimming.
   * @param {*} value - Value to check.
   * @returns {boolean}
   */
  function isNonEmpty(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  // ─────────────────────────────────────────────────────────
  // Mood Validation
  // ─────────────────────────────────────────────────────────

  /**
   * Validates a mood selection.
   * @param {string|null|undefined} moodId - The mood identifier to validate.
   * @param {string} [note=''] - Optional note attached to the mood log.
   * @returns {{ valid: boolean, error: string|null }}
   * @example
   * Validation.validateMood('happy');          // { valid: true, error: null }
   * Validation.validateMood(null);             // { valid: false, error: 'No mood selected.' }
   * Validation.validateMood('happy', 'x'.repeat(501)); // { valid: false, error: 'Note too long ...' }
   */
  function validateMood(moodId, note = '') {
    if (!moodId) {
      return result(false, 'No mood selected. Please choose how you are feeling.');
    }
    if (!VALID_MOODS.includes(String(moodId).toLowerCase())) {
      return result(false, `Invalid mood: "${moodId}". Must be one of: ${VALID_MOODS.join(', ')}.`);
    }
    if (note && String(note).length > 500) {
      return result(false, 'Note is too long. Please keep it under 500 characters.');
    }
    return result(true);
  }

  // ─────────────────────────────────────────────────────────
  // Journal Validation
  // ─────────────────────────────────────────────────────────

  /**
   * Validates a journal entry submission.
   * At least one answer must be non-empty, and each must respect the max length.
   * @param {string[]} answers - Array of 3 answer strings (one per prompt).
   * @returns {{ valid: boolean, error: string|null }}
   * @example
   * Validation.validateJournalEntry(['', '', '']);   // { valid: false, error: 'Answer at least one prompt.' }
   * Validation.validateJournalEntry(['Great day']); // { valid: true, error: null }
   */
  function validateJournalEntry(answers) {
    if (!Array.isArray(answers)) {
      return result(false, 'Journal answers must be an array.');
    }
    const filled = answers.filter(a => isNonEmpty(String(a || '')));
    if (filled.length === 0) {
      return result(false, 'Please answer at least one prompt before saving.');
    }
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] && String(answers[i]).length > 1000) {
        return result(false, `Answer ${i + 1} is too long. Please keep it under 1000 characters.`);
      }
    }
    return result(true);
  }

  // ─────────────────────────────────────────────────────────
  // Planner Validation
  // ─────────────────────────────────────────────────────────

  /**
   * Validates input for the Study Wellness Planner.
   * @param {Object} input - Planner input data.
   * @param {string} input.examType - Selected exam (e.g. 'JEE', 'NEET').
   * @param {number} [input.daysRemaining=30] - Days until exam (1–365).
   * @param {number} [input.stressLevel=5] - Current stress level (1–10).
   * @param {number} [input.studyHours=6] - Daily study hours (0–16).
   * @param {number} [input.sleepHours=7] - Daily sleep hours (4–12).
   * @returns {{ valid: boolean, error: string|null }}
   * @example
   * Validation.validatePlannerInput({ examType: 'JEE', daysRemaining: 30 }); // valid
   * Validation.validatePlannerInput({ examType: '' }); // { valid: false, error: 'Please select your exam type.' }
   */
  function validatePlannerInput(input = {}) {
    const { examType, daysRemaining = 30, stressLevel = 5, studyHours = 6, sleepHours = 7 } = input;

    if (!isNonEmpty(examType)) {
      return result(false, 'Please select your exam type before generating a plan.');
    }
    if (!VALID_EXAM_TYPES.includes(examType)) {
      return result(false, `Invalid exam type: "${examType}". Must be one of: ${VALID_EXAM_TYPES.join(', ')}.`);
    }
    if (!inRange(Number(daysRemaining), BOUNDS.days.min, BOUNDS.days.max)) {
      return result(false, `Days remaining must be between ${BOUNDS.days.min} and ${BOUNDS.days.max}.`);
    }
    if (!inRange(Number(stressLevel), BOUNDS.stress.min, BOUNDS.stress.max)) {
      return result(false, `Stress level must be between ${BOUNDS.stress.min} and ${BOUNDS.stress.max}.`);
    }
    if (!inRange(Number(studyHours), BOUNDS.study.min, BOUNDS.study.max)) {
      return result(false, `Study hours must be between ${BOUNDS.study.min} and ${BOUNDS.study.max}.`);
    }
    if (!inRange(Number(sleepHours), BOUNDS.sleep.min, BOUNDS.sleep.max)) {
      return result(false, `Sleep hours must be between ${BOUNDS.sleep.min} and ${BOUNDS.sleep.max}.`);
    }
    return result(true);
  }

  // ─────────────────────────────────────────────────────────
  // Wellness Score Validation
  // ─────────────────────────────────────────────────────────

  /**
   * Validates input values for the Wellness Score Engine.
   * @param {Object} input - Wellness input data.
   * @param {number} input.sleep - Sleep hours (4–12).
   * @param {number} input.water - Water glasses (0–12).
   * @param {number} input.study - Study hours (0–16).
   * @param {number} input.stress - Stress level (1–10).
   * @returns {{ valid: boolean, error: string|null }}
   * @example
   * Validation.validateWellnessInput({ sleep: 8, water: 6, study: 6, stress: 4 }); // valid
   * Validation.validateWellnessInput({ sleep: 2 }); // { valid: false, error: 'Sleep hours must be between 4 and 12.' }
   */
  function validateWellnessInput(input = {}) {
    const { sleep, water, study, stress } = input;

    if (!inRange(Number(sleep), BOUNDS.sleep.min, BOUNDS.sleep.max)) {
      return result(false, `Sleep hours must be between ${BOUNDS.sleep.min} and ${BOUNDS.sleep.max}.`);
    }
    if (!inRange(Number(water), BOUNDS.water.min, BOUNDS.water.max)) {
      return result(false, `Water intake must be between ${BOUNDS.water.min} and ${BOUNDS.water.max} glasses.`);
    }
    if (!inRange(Number(study), BOUNDS.study.min, BOUNDS.study.max)) {
      return result(false, `Study hours must be between ${BOUNDS.study.min} and ${BOUNDS.study.max}.`);
    }
    if (!inRange(Number(stress), BOUNDS.stress.min, BOUNDS.stress.max)) {
      return result(false, `Stress level must be between ${BOUNDS.stress.min} and ${BOUNDS.stress.max}.`);
    }
    return result(true);
  }

  // ─────────────────────────────────────────────────────────
  // Chat Validation
  // ─────────────────────────────────────────────────────────

  /**
   * Validates a chat message before sending.
   * @param {string} message - The message text.
   * @param {number} [maxLength=2000] - Maximum allowed length.
   * @returns {{ valid: boolean, error: string|null }}
   */
  function validateChatMessage(message, maxLength = 2000) {
    if (!isNonEmpty(message)) {
      return result(false, 'Message cannot be empty.');
    }
    if (String(message).length > maxLength) {
      return result(false, `Message too long. Maximum ${maxLength} characters allowed.`);
    }
    return result(true);
  }

  // ─────────────────────────────────────────────────────────
  // Trigger Validation
  // ─────────────────────────────────────────────────────────

  /**
   * Validates stress trigger selections.
   * @param {string[]} selectedIds - Array of selected trigger IDs.
   * @param {number} [min=1] - Minimum number of triggers required.
   * @returns {{ valid: boolean, error: string|null }}
   */
  function validateTriggerSelection(selectedIds, min = 1) {
    if (!Array.isArray(selectedIds) || selectedIds.length < min) {
      return result(false, `Please select at least ${min} stress trigger before analyzing.`);
    }
    return result(true);
  }

  // ─────────────────────────────────────────────────────────
  // Wellness Score Calculator (pure, no DOM)
  // ─────────────────────────────────────────────────────────

  /** Mood ID to score mapping */
  const MOOD_SCORE_MAP = {
    happy: 100, focused: 90, okay: 70, neutral: 60,
    stressed: 35, anxious: 30, burnout: 15
  };

  /** Score weights (must sum to 1.0) */
  const WEIGHTS = { mood: 0.30, sleep: 0.25, water: 0.15, study: 0.15, stress: 0.15 };

  /**
   * Calculates a wellness score (0–100) from input values.
   * Pure function — no side effects, no DOM access.
   * @param {Object} input - Input values.
   * @param {string} [input.moodId='neutral'] - Mood identifier.
   * @param {number} [input.sleep=7] - Sleep hours (4–12).
   * @param {number} [input.water=6] - Water glasses (0–12).
   * @param {number} [input.study=6] - Study hours (0–16).
   * @param {number} [input.stress=5] - Stress level (1–10).
   * @returns {number} Wellness score clamped to 0–100.
   * @example
   * Validation.calculateWellnessScore({ moodId: 'happy', sleep: 8, water: 8, study: 6, stress: 2 }); // ~90
   */
  function calculateWellnessScore(input = {}) {
    const { moodId = 'neutral', sleep = 7, water = 6, study = 6, stress = 5 } = input;

    const moodScore  = MOOD_SCORE_MAP[moodId] ?? 50;
    const sleepScore = Math.min(100, Math.max(0, ((Number(sleep) - 4) / 4) * 100));
    const waterScore = Math.min(100, (Number(water) / 8) * 100);
    const studyScore = Math.min(100, (Number(study) / 8) * 100);
    const stressScore = Math.max(0, ((10 - Number(stress)) / 9) * 100);

    const total = Math.round(
      moodScore   * WEIGHTS.mood   +
      sleepScore  * WEIGHTS.sleep  +
      waterScore  * WEIGHTS.water  +
      studyScore  * WEIGHTS.study  +
      stressScore * WEIGHTS.stress
    );

    return Math.min(100, Math.max(0, total));
  }

  /**
   * Returns a wellness level label for a given score.
   * @param {number} score - Score 0–100.
   * @returns {{ label: string, color: string, emoji: string }}
   */
  function getWellnessLevel(score) {
    if (score >= 80) return { label: 'Excellent',   color: '#2DD4BF', emoji: '🌟' };
    if (score >= 60) return { label: 'Good',        color: '#6C63FF', emoji: '👍' };
    if (score >= 40) return { label: 'Fair',        color: '#F59E0B', emoji: '⚠️' };
    return              { label: 'Needs Care', color: '#EF4444', emoji: '💙' };
  }

  /**
   * Calculates the real consecutive-day journal streak.
   * Pure function — accepts an array of entries with timestamps.
   * @param {Array<{timestamp: number}>} entries - Journal entries sorted newest-first.
   * @returns {number} Number of consecutive days with at least one entry.
   * @example
   * Validation.calculateStreak([]); // 0
   */
  function calculateStreak(entries) {
    if (!Array.isArray(entries) || entries.length === 0) return 0;

    const uniqueDays = [...new Set(
      entries.map(e => new Date(e.timestamp).toDateString())
    )].map(d => new Date(d)).sort((a, b) => b - a);

    const today     = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const mostRecent = uniqueDays[0].toDateString();

    if (mostRecent !== today && mostRecent !== yesterday) return 0;

    let streak = 1;
    for (let i = 1; i < uniqueDays.length; i++) {
      const diffDays = Math.round((uniqueDays[i - 1] - uniqueDays[i]) / 86400000);
      if (diffDays === 1) streak++;
      else break;
    }
    return streak;
  }

  // ─────────────────────────────────────────────────────────
  // Expose public API
  // ─────────────────────────────────────────────────────────

  return {
    // Validation functions
    validateMood,
    validateJournalEntry,
    validatePlannerInput,
    validateWellnessInput,
    validateChatMessage,
    validateTriggerSelection,
    // Pure business logic
    calculateWellnessScore,
    getWellnessLevel,
    calculateStreak,
    // Exposed constants
    VALID_MOODS,
    VALID_EXAM_TYPES,
    MOOD_SCORE_MAP,
    WEIGHTS,
    BOUNDS,
    // Helpers (useful for tests)
    inRange,
    isNonEmpty
  };
})();
