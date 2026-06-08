import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@copa_quiz_scores';

export type QuizScoreRecord = {
  best: number;
  attempts: number;
  lastScore: number;
};

export type QuizScoresMap = Record<string, QuizScoreRecord>;

export async function loadQuizScores(): Promise<QuizScoresMap> {
  const stored = await AsyncStorage.getItem(STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored) as QuizScoresMap;
  } catch {
    return {};
  }
}

export async function saveQuizScore(
  quizId: string,
  score: number,
  total: number
): Promise<{ record: QuizScoreRecord; isNewRecord: boolean }> {
  const all = await loadQuizScores();
  const current = all[quizId] ?? { best: 0, attempts: 0, lastScore: 0 };
  const isNewRecord = score > current.best;

  const record: QuizScoreRecord = {
    best: Math.max(current.best, score),
    attempts: current.attempts + 1,
    lastScore: score,
  };

  all[quizId] = record;
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(all));

  return { record, isNewRecord };
}
