import test from 'node:test';
import assert from 'node:assert/strict';
import {
  AUDIO_COLUMN_ORDER,
  IMAGE_COLUMN_ORDER,
  LISTENING_QUESTIONS,
} from '../data/professions';
import {
  calculateTotalProgress,
  evaluateAudioMatching,
  evaluateListeningQuiz,
  hasNoParallelMatches,
} from './exerciseLogic';

test('each listening question provides exactly 3 unique image choices including target', () => {
  assert.equal(LISTENING_QUESTIONS.length, 5);
  for (const q of LISTENING_QUESTIONS) {
    assert.equal(q.choiceIds.length, 3);
    assert.equal(new Set(q.choiceIds).size, 3);
    assert.equal(q.choiceIds.includes(q.targetId), true);
  }
});

test('evaluateListeningQuiz scores answered audio-to-picture questions accurately', () => {
  const res = evaluateListeningQuiz({
    'listen-1': 'builder',
    'listen-2': 'waiter',
    'listen-3': 'pupil',
  });
  assert.equal(res.answeredCount, 3);
  assert.equal(res.correctCount, 2);
  assert.equal(res.total, 5);
  assert.equal(res.results['listen-1'], true);
  assert.equal(res.results['listen-2'], true);
  assert.equal(res.results['listen-3'], false);
});

test('image column is shuffled with zero parallel matches against audio column', () => {
  assert.equal(
    hasNoParallelMatches(AUDIO_COLUMN_ORDER, IMAGE_COLUMN_ORDER),
    true,
  );
  assert.equal(
    hasNoParallelMatches(AUDIO_COLUMN_ORDER, AUDIO_COLUMN_ORDER),
    false,
  );
});

test('evaluateAudioMatching counts exact audio-to-image pairs', () => {
  const res = evaluateAudioMatching({
    builder: 'builder',
    waiter: 'waiter',
    vet: 'teacher',
    pupil: 'pupil',
    teacher: 'vet',
  });
  assert.equal(res.pairedCount, 5);
  assert.equal(res.correctCount, 3);
  assert.equal(res.results.builder, true);
  assert.equal(res.results.vet, false);
});

test('calculateTotalProgress aggregates Bài 1 and Bài 2 out of 10', () => {
  const progress = calculateTotalProgress({
    listeningCorrect: 5,
    matchingChecked: true,
    matchingCorrect: 5,
  });
  assert.equal(progress.totalScore, 10);
  assert.equal(progress.maxScore, 10);
  assert.equal(progress.percentage, 100);
  assert.match(progress.feedbackMessage, /Xuất sắc/);
});
