import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@meg_progress';
const SRS_KEY = '@meg_flashcards_srs';

// ── Progress state ────────────────────────────────────────────────

const defaultProgress = {
  answers: [],           // { questionId, topicNumber, correct, timestamp }
  sessions: [],           // { date, type, questionsAnswered, correct, minutes }
  streak: 0,
  lastStudyDate: null,
  topicAccuracy: {},      // { topicNumber: { attempted, correct } }
};

export async function loadProgress() {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...defaultProgress, topicAccuracy: {} };
    return JSON.parse(raw);
  } catch {
    return { ...defaultProgress, topicAccuracy: {} };
  }
}

export async function saveProgress(progress) {
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export async function logAnswer(questionId, topicNumber, correct) {
  const p = await loadProgress();
  p.answers.push({
    questionId,
    topicNumber,
    correct,
    timestamp: new Date().toISOString(),
  });

  if (!p.topicAccuracy[topicNumber]) {
    p.topicAccuracy[topicNumber] = { attempted: 0, correct: 0 };
  }
  p.topicAccuracy[topicNumber].attempted += 1;
  if (correct) p.topicAccuracy[topicNumber].correct += 1;

  await saveProgress(p);
}

export async function logSession(type, questionsAnswered, correct) {
  const p = await loadProgress();
  const today = new Date().toISOString().split('T')[0];

  p.sessions.push({ date: today, type, questionsAnswered, correct });

  // Streak logic
  if (p.lastStudyDate) {
    const last = new Date(p.lastStudyDate);
    const now = new Date(today);
    const diffDays = Math.round((now - last) / (1000 * 60 * 60 * 24));
    if (diffDays === 1) {
      p.streak += 1;
    } else if (diffDays > 1) {
      p.streak = 1;
    }
  } else {
    p.streak = 1;
  }
  p.lastStudyDate = today;

  await saveProgress(p);
  return p;
}

export async function getTopicAccuracy(topicNumber) {
  const p = await loadProgress();
  const ta = p.topicAccuracy[topicNumber];
  if (!ta || ta.attempted === 0) return null;
  return { attempted: ta.attempted, correct: ta.correct, pct: Math.round((ta.correct / ta.attempted) * 100) };
}

export async function getAllTopicAccuracy() {
  const p = await loadProgress();
  const result = {};
  for (const [tn, ta] of Object.entries(p.topicAccuracy)) {
    result[parseInt(tn)] = {
      attempted: ta.attempted,
      correct: ta.correct,
      pct: Math.round((ta.correct / ta.attempted) * 100),
    };
  }
  return result;
}

export async function getWeakAreas(topN = 3) {
  const all = await getAllTopicAccuracy();
  const entries = Object.entries(all)
    .map(([tn, d]) => ({ topicNumber: parseInt(tn), ...d }))
    .filter(d => d.attempted >= 5)
    .sort((a, b) => a.pct - b.pct);
  return entries.slice(0, topN);
}

// ── SRS state ─────────────────────────────────────────────────────

export async function loadSrsState() {
  try {
    const raw = await AsyncStorage.getItem(SRS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function saveSrsState(srsMap) {
  await AsyncStorage.setItem(SRS_KEY, JSON.stringify(srsMap));
}

export async function updateSrsCard(cardId, srsState) {
  const map = await loadSrsState();
  map[cardId] = srsState;
  await saveSrsState(map);
}
