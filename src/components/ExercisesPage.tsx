import { useState } from 'react';
import {
  CheckCircle2,
  Link2,
  RotateCcw,
  Trophy,
  Volume2,
  XCircle,
} from 'lucide-react';
import {
  AUDIO_COLUMN_ORDER,
  IMAGE_COLUMN_ORDER,
  KUROMI_COVER_IMAGE,
  LISTENING_QUESTIONS,
  PROFESSIONS,
  type ProfessionItem,
} from '../data/professions';
import {
  calculateTotalProgress,
  evaluateAudioMatching,
  evaluateListeningQuiz,
} from '../utils/exerciseLogic';
import { speakEnglishWord } from '../utils/speech';
import { ResilientImage } from './ResilientImage';

export type ExerciseTab = 'listening' | 'matching' | 'summary';

interface ExercisesPageProps {
  listeningSelections: Record<string, string>;
  onSelectListening: (questionId: string, choiceId: string) => void;
  onResetListening: () => void;
  matchingPairs: Record<string, string>;
  matchingChecked: boolean;
  onUpdateMatchingPair: (audioId: string, imageId: string) => void;
  onClearMatchingPair: (audioId: string) => void;
  onCheckMatching: () => void;
  onResetMatching: () => void;
  onResetAll: () => void;
}

const IMAGE_LABELS = ['Hình A', 'Hình B', 'Hình C', 'Hình D', 'Hình E'];

export function ExercisesPage({
  listeningSelections,
  onSelectListening,
  onResetListening,
  matchingPairs,
  matchingChecked,
  onUpdateMatchingPair,
  onClearMatchingPair,
  onCheckMatching,
  onResetMatching,
  onResetAll,
}: ExercisesPageProps) {
  const [activeTab, setActiveTab] = useState<ExerciseTab>('listening');
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [speechMessage, setSpeechMessage] = useState<string>('');
  const [selectedAudioId, setSelectedAudioId] = useState<string | null>(null);
  const [matchingWarning, setMatchingWarning] = useState<string>('');

  const listeningEval = evaluateListeningQuiz(listeningSelections);
  const matchingEval = evaluateAudioMatching(matchingPairs);
  const progress = calculateTotalProgress({
    listeningCorrect: listeningEval.correctCount,
    matchingChecked,
    matchingCorrect: matchingEval.correctCount,
  });

  const professionById = Object.fromEntries(
    PROFESSIONS.map((item) => [item.id, item]),
  ) as Record<ProfessionItem['id'], ProfessionItem>;

  const playWordAudio = (key: string, word: string) => {
    setSpeechMessage('');
    speakEnglishWord(word, {
      onStart: () => setSpeakingKey(key),
      onEnd: () => setSpeakingKey(null),
      onUnavailable: (msg) => {
        setSpeakingKey(null);
        setSpeechMessage(msg);
      },
    });
  };

  const handleAudioCardClick = (audioId: ProfessionItem['id']) => {
    setMatchingWarning('');
    const item = professionById[audioId];
    playWordAudio(`match-audio-${audioId}`, item.word);
    setSelectedAudioId((prev) => (prev === audioId ? audioId : audioId));
  };

  const handleImageCardClick = (imageId: ProfessionItem['id']) => {
    if (!selectedAudioId) {
      setMatchingWarning(
        'Bé hãy bấm vào một thẻ Âm thanh ở Cột 1 để nghe trước, rồi bấm chọn hình tương ứng ở Cột 2 nhé!',
      );
      return;
    }
    setMatchingWarning('');
    onUpdateMatchingPair(selectedAudioId, imageId);
    setSelectedAudioId(null);
  };

  const handleCheckMatchingClick = () => {
    if (matchingEval.pairedCount < PROFESSIONS.length) {
      setMatchingWarning(
        `Bé mới nối được ${matchingEval.pairedCount}/${PROFESSIONS.length} cặp. Hãy nối đủ cả 5 âm thanh với 5 hình rồi bấm Kiểm tra nhé!`,
      );
      return;
    }
    setMatchingWarning('');
    onCheckMatching();
  };

  const tabs: { id: ExerciseTab; label: string }[] = [
    { id: 'listening', label: 'Bài 1: Nghe & chọn hình' },
    { id: 'matching', label: 'Bài 2: Nghe & nối hình' },
    { id: 'summary', label: 'Tổng kết điểm' },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      {/* Page Title & Live Score */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5ddf0] pb-6">
        <div>
          <p className="text-sm font-bold text-[#6b21a8]">
            Phần 2 · Thực hành nghe và nhận diện 5 hình ảnh nghề nghiệp
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#1e1b24]">
            Phần Bài Tập Nghe &amp; Nối Hình
          </h1>
          <p className="mt-2 text-base text-[#4b4458]">
            Bé bấm nút loa để nghe từ vựng tiếng Anh và chọn đúng bức hình tương
            ứng.
          </p>
        </div>

        <div className="text-right">
          <p className="text-sm text-[#5b5369]">Tổng điểm hiện tại</p>
          <p
            data-testid="overall-score"
            className="text-2xl font-bold tabular-nums text-[#6b21a8]"
          >
            {progress.totalScore} / {progress.maxScore} điểm
          </p>
        </div>
      </div>

      {/* Sub-navigation Segmented Control */}
      <div
        role="tablist"
        aria-label="Chọn dạng bài tập"
        className="mt-6 flex flex-wrap gap-2 rounded-xl border border-[#e5ddf0] bg-[#f3eff7] p-1.5"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`min-h-[44px] flex-1 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-white text-[#6b21a8] shadow-sm'
                  : 'text-[#4b4458] hover:text-[#1e1b24]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {speechMessage && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-[#e5ddf0] bg-[#f7f4fb] px-4 py-3 text-sm text-[#4c1d95]"
        >
          {speechMessage}
        </div>
      )}

      {/* BÀI 1: NGHE VÀ CHỌN HÌNH ĐÚNG GIỮA 3 HÌNH GỢI Ý */}
      {activeTab === 'listening' && (
        <section
          aria-label="Bài 1: Nghe và chọn hình đúng"
          className="mt-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold text-[#1e1b24]">
                Bài 1: Nghe và chọn hình đúng trong 3 hình gợi ý
              </h2>
              <p className="mt-1 text-base text-[#5b5369]">
                Bé hãy bấm nút nghe, sau đó chọn 1 trong 3 bức hình bên dưới
                (Đã làm:{' '}
                <span className="font-bold tabular-nums">
                  {listeningEval.answeredCount}/{listeningEval.total}
                </span>{' '}
                · Đúng:{' '}
                <span className="font-bold tabular-nums text-[#6b21a8]">
                  {listeningEval.correctCount}/{listeningEval.total}
                </span>
                )
              </p>
            </div>

            <button
              type="button"
              onClick={onResetListening}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-[#d4c7e8] bg-white px-4 py-2 text-sm font-bold text-[#4c1d95] transition-colors hover:bg-[#f3eff7]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span>Làm lại Bài 1</span>
            </button>
          </div>

          <div className="mt-6 space-y-6">
            {LISTENING_QUESTIONS.map((question, idx) => {
              const targetItem = professionById[question.targetId];
              const selectedChoiceId = listeningSelections[question.id];
              const isAnswered = Boolean(selectedChoiceId);
              const isCorrect = selectedChoiceId === question.targetId;
              const isSpeaking = speakingKey === question.id;

              return (
                <article
                  key={question.id}
                  data-testid={`listening-card-${question.id}`}
                  className="rounded-2xl border border-[#e5ddf0] bg-white p-5 sm:p-6"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#efeaf5] pb-4">
                    <div>
                      <p className="text-sm font-bold text-[#6b21a8] tabular-nums">
                        Câu hỏi 0{idx + 1} / 05
                      </p>
                      <h3 className="mt-0.5 text-xl font-bold text-[#1e1b24]">
                        Bé hãy nghe và chọn hình đúng
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        playWordAudio(question.id, targetItem.word)
                      }
                      aria-label={`Nghe từ vựng Câu hỏi 0${idx + 1}`}
                      className={`inline-flex min-h-[46px] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-xl px-5 py-2.5 text-base font-bold transition-colors ${
                        isSpeaking
                          ? 'bg-[#581c87] text-white ring-4 ring-[#6b21a8]/20'
                          : 'bg-[#6b21a8] text-white hover:bg-[#581c87]'
                      }`}
                    >
                      <Volume2 className="h-5 w-5" aria-hidden="true" />
                      <span>
                        {isSpeaking ? 'Đang phát âm...' : 'Nghe từ vựng'}
                      </span>
                    </button>
                  </div>

                  {/* 3 Picture Choices */}
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {question.choiceIds.map((choiceId, optIdx) => {
                      const choiceItem = professionById[choiceId];
                      const isThisSelected = selectedChoiceId === choiceId;
                      const isThisTarget = choiceId === question.targetId;
                      const labelChar = ['A', 'B', 'C'][optIdx];

                      let cardBorder =
                        'border-[#d4c7e8] bg-[#faf8fb] hover:border-[#6b21a8] hover:bg-[#f3eff7]';
                      if (isAnswered) {
                        if (isThisSelected && isThisTarget) {
                          cardBorder =
                            'border-[#15803d] bg-[#f0fdf4] ring-2 ring-[#15803d]/20';
                        } else if (isThisSelected && !isThisTarget) {
                          cardBorder =
                            'border-[#b91c1c] bg-[#fef2f2] ring-2 ring-[#b91c1c]/20';
                        } else if (isThisTarget) {
                          cardBorder = 'border-[#15803d] bg-white';
                        }
                      }

                      return (
                        <button
                          key={choiceId}
                          type="button"
                          onClick={() =>
                            onSelectListening(question.id, choiceId)
                          }
                          aria-label={`Chọn hình ${labelChar} (${choiceItem.word}) cho Câu hỏi 0${idx + 1}`}
                          aria-pressed={isThisSelected}
                          className={`flex flex-col items-center rounded-xl border-2 p-3 transition-colors ${cardBorder}`}
                        >
                          <div className="flex h-48 w-full items-center justify-center overflow-hidden rounded-lg bg-white p-2">
                            <ResilientImage
                              src={choiceItem.image}
                              alt={choiceItem.imageAlt}
                              fallbackTitle={`Hình ${labelChar}`}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="mt-3 flex w-full items-center justify-between px-1 text-base font-bold text-[#1e1b24]">
                            <span>Hình {labelChar}</span>
                            {isAnswered && isThisTarget && (
                              <span className="inline-flex items-center gap-1 text-sm text-[#15803d]">
                                <CheckCircle2
                                  className="h-4 w-4 shrink-0"
                                  aria-hidden="true"
                                />
                                <span>Đúng</span>
                              </span>
                            )}
                            {isAnswered &&
                              isThisSelected &&
                              !isThisTarget && (
                                <span className="inline-flex items-center gap-1 text-sm text-[#b91c1c]">
                                  <XCircle
                                    className="h-4 w-4 shrink-0"
                                    aria-hidden="true"
                                  />
                                  <span>Sai</span>
                                </span>
                              )}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div
                      role="status"
                      className={`mt-4 flex items-center gap-2.5 rounded-lg border px-4 py-3 text-base ${
                        isCorrect
                          ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#14532d]'
                          : 'border-[#fecaca] bg-[#fef2f2] text-[#7f1d1d]'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2
                          className="h-5 w-5 shrink-0"
                          aria-hidden="true"
                        />
                      ) : (
                        <XCircle
                          className="h-5 w-5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <div>
                        <span className="font-bold">
                          {isCorrect ? 'Chính xác!' : 'Chưa đúng rồi.'}
                        </span>{' '}
                        <span>
                          Từ bé vừa nghe là <strong>{targetItem.word}</strong> (
                          {targetItem.vietnamese}).
                        </span>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('matching')}
              className="min-h-[44px] rounded-lg bg-[#6b21a8] px-6 py-2.5 text-base font-bold text-white transition-colors hover:bg-[#581c87]"
            >
              Tiếp tục Bài 2: Nghe &amp; nối hình →
            </button>
          </div>
        </section>
      )}

      {/* BÀI 2: 2 CỘT - CỘT 1 FILE NGHE, CỘT 2 HÌNH ẢNH LỘN XỘN KHÔNG SONG SONG */}
      {activeTab === 'matching' && (
        <section
          aria-label="Bài 2: Nghe và nối với hình ảnh tương ứng"
          className="mt-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold text-[#1e1b24]">
                Bài 2: Nối phần nghe ở Cột 1 với hình ảnh ở Cột 2
              </h2>
              <p className="mt-1 text-base text-[#5b5369]">
                Bước 1: Bé bấm vào thẻ <strong>Âm thanh</strong> ở Cột 1 để
                nghe. Bước 2: Bấm vào bức hình tương ứng ở Cột 2 để nối lại với
                nhau.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleCheckMatchingClick}
                className="min-h-[44px] whitespace-nowrap rounded-lg bg-[#6b21a8] px-5 py-2 text-sm font-bold text-white transition-colors hover:bg-[#581c87]"
              >
                Kiểm tra bài nối
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedAudioId(null);
                  setMatchingWarning('');
                  onResetMatching();
                }}
                className="inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-lg border border-[#d4c7e8] bg-white px-4 py-2 text-sm font-bold text-[#4c1d95] transition-colors hover:bg-[#f3eff7]"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                <span>Làm lại Bài 2</span>
              </button>
            </div>
          </div>

          {matchingWarning && (
            <div
              role="alert"
              className="mt-4 rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-sm font-bold text-[#92400e]"
            >
              {matchingWarning}
            </div>
          )}

          {matchingChecked && (
            <div
              role="status"
              data-testid="matching-result-banner"
              className={`mt-4 flex items-center gap-2.5 rounded-lg border px-4 py-3 text-base font-bold ${
                matchingEval.correctCount === matchingEval.total
                  ? 'border-[#bbf7d0] bg-[#f0fdf4] text-[#14532d]'
                  : 'border-[#e5ddf0] bg-white text-[#1e1b24]'
              }`}
            >
              <CheckCircle2
                className="h-5 w-5 shrink-0 text-[#6b21a8]"
                aria-hidden="true"
              />
              <span>
                Kết quả Bài 2: Bé đã nối đúng{' '}
                <span className="tabular-nums">
                  {matchingEval.correctCount}/{matchingEval.total}
                </span>{' '}
                cặp âm thanh và hình ảnh.
              </span>
            </div>
          )}

          {/* 2-Column Side-by-Side Layout */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-8">
            {/* CỘT 1: 5 FILE NGHE */}
            <div className="space-y-4">
              <div className="border-b border-[#e5ddf0] pb-2">
                <h3 className="text-lg font-bold text-[#1e1b24] sm:text-xl">
                  Cột 1 · Phần nghe (5 từ)
                </h3>
                <p className="text-xs text-[#5b5369] sm:text-sm">
                  Bấm vào từng thẻ để nghe và chọn nối
                </p>
              </div>

              <div className="space-y-4">
                {AUDIO_COLUMN_ORDER.map((audioId, idx) => {
                  const audioItem = professionById[audioId];
                  const isSelected = selectedAudioId === audioId;
                  const pairedImageId = matchingPairs[audioId] ?? '';
                  const pairedImageIndex = pairedImageId
                    ? IMAGE_COLUMN_ORDER.indexOf(
                        pairedImageId as ProfessionItem['id'],
                      )
                    : -1;
                  const isSpeaking =
                    speakingKey === `match-audio-${audioId}`;
                  const isCorrect = matchingEval.results[audioId];

                  let borderStyle =
                    'border-[#e5ddf0] bg-white hover:border-[#c4b5fd]';
                  if (isSelected) {
                    borderStyle =
                      'border-[#6b21a8] bg-[#f7f4fb] ring-2 ring-[#6b21a8]/25';
                  } else if (matchingChecked) {
                    borderStyle = isCorrect
                      ? 'border-[#15803d] bg-[#f0fdf4]'
                      : 'border-[#b91c1c] bg-[#fef2f2]';
                  }

                  return (
                    <div
                      key={audioId}
                      data-testid={`audio-slot-${audioId}`}
                      className={`flex min-h-[140px] flex-col justify-between rounded-2xl border-2 p-4 transition-colors sm:min-h-[156px] ${borderStyle}`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-base font-bold text-[#6b21a8] tabular-nums sm:text-lg">
                          Âm thanh {idx + 1}
                        </span>
                        {pairedImageIndex !== -1 && (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 text-sm font-bold text-[#1e1b24]">
                              <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Nối → {IMAGE_LABELS[pairedImageIndex]}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => onClearMatchingPair(audioId)}
                              aria-label={`Bỏ nối Âm thanh ${idx + 1}`}
                              className="text-xs font-bold text-[#5b5369] underline hover:text-[#b91c1c]"
                            >
                              Bỏ nối
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => handleAudioCardClick(audioId)}
                          aria-label={`Nghe và chọn Âm thanh ${idx + 1}`}
                          aria-pressed={isSelected}
                          className={`flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors sm:text-base ${
                            isSelected || isSpeaking
                              ? 'bg-[#6b21a8] text-white'
                              : 'border border-[#d4c7e8] bg-[#faf8fb] text-[#4c1d95] hover:bg-[#f3eff7]'
                          }`}
                        >
                          <Volume2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                          <span>
                            {isSpeaking
                              ? 'Đang phát...'
                              : isSelected
                                ? `Đang chọn Âm thanh ${idx + 1} (Nghe lại)`
                                : `Nghe Âm thanh ${idx + 1}`}
                          </span>
                        </button>
                      </div>

                      {matchingChecked && (
                        <div
                          className={`mt-2.5 flex items-center gap-1.5 text-sm font-bold ${
                            isCorrect ? 'text-[#15803d]' : 'text-[#b91c1c]'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span>
                                Đúng ({audioItem.word} — {audioItem.vietnamese})
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle
                                className="h-4 w-4 shrink-0"
                                aria-hidden="true"
                              />
                              <span>
                                Sai — Đây là từ &ldquo;{audioItem.word}&rdquo; (
                                {audioItem.vietnamese})
                              </span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CỘT 2: 5 HÌNH ẢNH SẮP XẾP LỘN XỘN KHÔNG SONG SONG */}
            <div className="space-y-4">
              <div className="border-b border-[#e5ddf0] pb-2">
                <h3 className="text-lg font-bold text-[#1e1b24] sm:text-xl">
                  Cột 2 · Hình ảnh (Sắp xếp ngẫu nhiên)
                </h3>
                <p className="text-xs text-[#5b5369] sm:text-sm">
                  {selectedAudioId
                    ? `Đang chọn Âm thanh ${AUDIO_COLUMN_ORDER.indexOf(selectedAudioId as ProfessionItem['id']) + 1} — hãy bấm vào hình đúng bên dưới`
                    : 'Bấm vào hình tương ứng sau khi nghe ở Cột 1'}
                </p>
              </div>

              <div className="space-y-4">
                {IMAGE_COLUMN_ORDER.map((imageId, idx) => {
                  const imageItem = professionById[imageId];
                  const linkedAudioId = Object.keys(matchingPairs).find(
                    (aId) => matchingPairs[aId] === imageId,
                  );
                  const linkedAudioNumber = linkedAudioId
                    ? AUDIO_COLUMN_ORDER.indexOf(
                        linkedAudioId as ProfessionItem['id'],
                      ) + 1
                    : null;

                  return (
                    <button
                      key={imageId}
                      type="button"
                      data-testid={`image-slot-${imageId}`}
                      onClick={() => handleImageCardClick(imageId)}
                      aria-label={`Chọn ${IMAGE_LABELS[idx]} (${imageItem.word}) để nối`}
                      className={`flex min-h-[140px] w-full flex-col justify-between rounded-2xl border-2 p-3 text-left transition-colors sm:min-h-[156px] sm:p-4 ${
                        selectedAudioId
                          ? 'border-[#6b21a8] bg-[#faf8fb] hover:bg-[#f3eff7]'
                          : linkedAudioNumber
                            ? 'border-[#c4b5fd] bg-[#f7f4fb]'
                            : 'border-[#e5ddf0] bg-white hover:bg-[#faf8fb]'
                      }`}
                    >
                      <div className="flex w-full items-center justify-between gap-2 text-sm font-bold">
                        <span className="text-[#1e1b24]">{IMAGE_LABELS[idx]}</span>
                        <span className="text-[#6b21a8]">
                          {linkedAudioNumber
                            ? `Đã nối: Âm thanh ${linkedAudioNumber}`
                            : selectedAudioId
                              ? 'Bấm để nối vào đây'
                              : 'Chưa nối'}
                        </span>
                      </div>

                      <div className="mt-2 flex h-24 w-full items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 sm:h-28">
                        <ResilientImage
                          src={imageItem.image}
                          alt={imageItem.imageAlt}
                          fallbackTitle={IMAGE_LABELS[idx]}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setActiveTab('summary')}
              className="min-h-[44px] rounded-lg bg-[#6b21a8] px-6 py-2.5 text-base font-bold text-white transition-colors hover:bg-[#581c87]"
            >
              Xem Tổng kết điểm →
            </button>
          </div>
        </section>
      )}

      {/* TỔNG KẾT ĐIỂM */}
      {activeTab === 'summary' && (
        <section
          aria-label="Tổng kết kết quả bài tập"
          className="mt-8 rounded-2xl border border-[#e5ddf0] bg-white p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <div className="mx-auto aspect-square max-w-[260px] overflow-hidden rounded-2xl border border-[#e5ddf0] bg-[#f7f4fb] p-2">
                <ResilientImage
                  src={KUROMI_COVER_IMAGE}
                  alt="Kuromi chúc mừng hoàn thành bài tập"
                  fallbackTitle="Kuromi"
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="flex items-center gap-2.5 text-[#6b21a8]">
                <Trophy className="h-6 w-6" aria-hidden="true" />
                <h2 className="text-2xl font-bold text-[#1e1b24]">
                  Bảng Tổng Kết Kết Quả Học Tập
                </h2>
              </div>

              <p className="mt-3 text-lg text-[#3f384c]">
                {progress.feedbackMessage}
              </p>

              <div className="mt-6 overflow-hidden rounded-xl border border-[#e5ddf0]">
                <table className="w-full border-collapse text-left text-base">
                  <thead className="bg-[#f3eff7] text-[#1e1b24]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Phần bài tập</th>
                      <th className="px-4 py-3 font-bold">Trạng thái</th>
                      <th className="px-4 py-3 text-right font-bold">Điểm số</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#efeaf5]">
                    <tr>
                      <td className="px-4 py-3 font-bold">
                        Bài 1: Nghe &amp; chọn hình (3 gợi ý)
                      </td>
                      <td className="px-4 py-3 text-[#5b5369]">
                        Đã trả lời {listeningEval.answeredCount}/
                        {listeningEval.total} câu
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">
                        {progress.listeningScore} / 5
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3 font-bold">
                        Bài 2: Nghe &amp; nối hình (2 cột)
                      </td>
                      <td className="px-4 py-3 text-[#5b5369]">
                        {matchingChecked ? 'Đã chấm điểm' : 'Chưa nhấn kiểm tra'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">
                        {progress.matchingScore} / 5
                      </td>
                    </tr>
                    <tr className="bg-[#faf8fb]">
                      <td className="px-4 py-3.5 text-lg font-bold text-[#6b21a8]">
                        Tổng cộng
                      </td>
                      <td className="px-4 py-3.5 font-bold tabular-nums text-[#4b4458]">
                        Đạt {progress.percentage}%
                      </td>
                      <td className="px-4 py-3.5 text-right text-xl font-bold tabular-nums text-[#6b21a8]">
                        {progress.totalScore} / {progress.maxScore}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onResetAll();
                    setSelectedAudioId(null);
                    setActiveTab('listening');
                  }}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-[#6b21a8] px-5 py-2.5 text-base font-bold text-white transition-colors hover:bg-[#581c87]"
                >
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  <span>Làm lại toàn bộ bài tập</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
