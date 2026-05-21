// SM-2 spaced repetition algorithm (simplified Anki-style)
// Ratings: 1 = Again, 2 = Hard, 3 = Good, 4 = Easy

const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;
const EASE_BONUS = { 1: -0.20, 2: -0.15, 3: 0.0, 4: 0.15 };
const INTERVAL_MULTIPLIER = { 1: 0, 2: 1.2, 3: 1.0, 4: 1.3 };

export function createSrsState(cardId) {
  return {
    cardId,
    repetitions: 0,
    easeFactor: DEFAULT_EASE,
    interval: 0,        // days until next review
    nextReview: null,   // ISO date string, null = new card
    lastReview: null,
  };
}

export function scheduleReview(srsState, rating) {
  const state = { ...srsState };

  if (rating >= 3) {
    // Correct recall
    if (state.repetitions === 0) {
      state.interval = 1;
    } else if (state.repetitions === 1) {
      state.interval = 6;
    } else {
      state.interval = Math.round(state.interval * state.easeFactor * INTERVAL_MULTIPLIER[rating] || 1);
    }
    state.repetitions += 1;
  } else {
    // Forgotten — reset
    state.repetitions = 0;
    state.interval = 0; // Due again today
  }

  state.easeFactor = Math.max(
    MIN_EASE,
    state.easeFactor + (EASE_BONUS[rating] || 0)
  );

  const today = new Date();
  state.lastReview = today.toISOString().split('T')[0];

  if (state.interval > 0) {
    const next = new Date(today);
    next.setDate(next.getDate() + state.interval);
    state.nextReview = next.toISOString().split('T')[0];
  } else {
    state.nextReview = null; // due now
  }

  return state;
}

export function isDue(srsState) {
  if (!srsState || srsState.nextReview === null) return true;
  const today = new Date().toISOString().split('T')[0];
  return srsState.nextReview <= today;
}

export function getDueCount(srsMap) {
  if (!srsMap) return 0;
  return Object.values(srsMap).filter(isDue).length;
}
