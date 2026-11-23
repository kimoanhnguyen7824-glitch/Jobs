import {
  AUDIO_COLUMN_ORDER,
  IMAGE_COLUMN_ORDER,
  LISTENING_QUESTIONS,
  PROFESSIONS,
  type ProfessionItem,
} from '../data/professions';

export interface ListeningEvaluation {
  answeredCount: number;
  correctCount: number;
  total: number;
  results: Record<string, boolean>;
}

export function evaluateListeningQuiz(
  selections: Record<string, string>,
  questions = LISTENING_QUESTIONS,
): ListeningEvaluation {
  const results: Record<string, boolean> = {};
  let answeredCount = 0;
  let correctCount = 0;

  for (const q of questions) {
    const selected = selections[q.id];
    if (selected) {
      answeredCount += 1;
      const isCorrect = selected === q.targetId;
      results[q.id] = isCorrect;
      if (isCorrect) {
        correctCount += 1;
      }
    }
  }

  return {
    answeredCount,
    correctCount,
    total: questions.length,
    results,
  };
}

export interface MatchingEvaluation {
  pairedCount: number;
  correctCount: number;
  total: number;
  results: Record<string, boolean>;
}

export function evaluateAudioMatching(
  pairs: Record<string, string>,
  items: ProfessionItem[] = PROFESSIONS,
): MatchingEvaluation {
  const results: Record<string, boolean> = {};
  let pairedCount = 0;
  let correctCount = 0;

  for (const item of items) {
    const matchedImageId = pairs[item.id];
    if (matchedImageId) {
      pairedCount += 1;
      const isCorrect = matchedImageId === item.id;
      results[item.id] = isCorrect;
      if (isCorrect) {
        correctCount += 1;
      }
    } else {
      results[item.id] = false;
    }
  }

  return {
    pairedCount,
    correctCount,
    total: items.length,
    results,
  };
}

export function hasNoParallelMatches(
  col1: readonly string[] = AUDIO_COLUMN_ORDER,
  col2: readonly string[] = IMAGE_COLUMN_ORDER,
): boolean {
  if (col1.length !== col2.length || col1.length === 0) {
    return false;
  }
  const set1 = new Set(col1);
  const set2 = new Set(col2);
  if (set1.size !== col1.length || set2.size !== col2.length) {
    return false;
  }
  for (let i = 0; i < col1.length; i += 1) {
    if (!set2.has(col1[i]) || col1[i] === col2[i]) {
      return false;
    }
  }
  return true;
}

export interface TotalProgress {
  listeningScore: number;
  matchingScore: number;
  totalScore: number;
  maxScore: number;
  percentage: number;
  feedbackMessage: string;
}

export function calculateTotalProgress(params: {
  listeningCorrect: number;
  matchingChecked: boolean;
  matchingCorrect: number;
}): TotalProgress {
  const listeningScore = params.listeningCorrect;
  const matchingScore = params.matchingChecked ? params.matchingCorrect : 0;
  const maxScore = 10;
  const totalScore = listeningScore + matchingScore;
  const percentage = Math.round((totalScore / maxScore) * 100);

  let feedbackMessage =
    'Bé hãy hoàn thành cả 2 bài nghe và nối hình để xem kết quả nhé!';
  if (totalScore === maxScore) {
    feedbackMessage =
      'Xuất sắc! Kuromi chúc mừng bé đã nghe đúng cả 10/10 câu!';
  } else if (totalScore >= 8) {
    feedbackMessage =
      'Giỏi lắm! Bé đã nghe và nhận diện được hầu hết các nghề nghiệp rồi.';
  } else if (totalScore >= 5) {
    feedbackMessage =
      'Khá tốt! Bé hãy bấm nghe lại những từ chưa đúng để ghi nhớ thêm nhé.';
  } else if (totalScore > 0) {
    feedbackMessage =
      'Cố gắng lên nhé! Bé có thể xem lại phần Từ vựng và bấm nghe lại nhiều lần.';
  }

  return {
    listeningScore,
    matchingScore,
    totalScore,
    maxScore,
    percentage,
    feedbackMessage,
  };
}
