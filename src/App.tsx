import { useState } from 'react';
import { ExercisesPage } from './components/ExercisesPage';
import { Header, type AppPage } from './components/Header';
import { HomePage } from './components/HomePage';
import { VocabularyPage } from './components/VocabularyPage';
import {
  calculateTotalProgress,
  evaluateAudioMatching,
  evaluateListeningQuiz,
} from './utils/exerciseLogic';

function getInitialPage(): AppPage {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      return 'exercises';
    }
  }
  return 'home';
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>(getInitialPage);

  const [listeningSelections, setListeningSelections] = useState<
    Record<string, string>
  >({});
  const [matchingPairs, setMatchingPairs] = useState<Record<string, string>>(
    {},
  );
  const [matchingChecked, setMatchingChecked] = useState(false);

  const listeningEval = evaluateListeningQuiz(listeningSelections);
  const matchingEval = evaluateAudioMatching(matchingPairs);
  const progress = calculateTotalProgress({
    listeningCorrect: listeningEval.correctCount,
    matchingChecked,
    matchingCorrect: matchingEval.correctCount,
  });

  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectListening = (questionId: string, choiceId: string) => {
    setListeningSelections((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleUpdateMatchingPair = (audioId: string, imageId: string) => {
    setMatchingChecked(false);
    setMatchingPairs((prev) => {
      const next: Record<string, string> = {};
      for (const [existingAudio, existingImage] of Object.entries(prev)) {
        if (existingImage !== imageId && existingAudio !== audioId) {
          next[existingAudio] = existingImage;
        }
      }
      next[audioId] = imageId;
      return next;
    });
  };

  const handleClearMatchingPair = (audioId: string) => {
    setMatchingChecked(false);
    setMatchingPairs((prev) => {
      const next = { ...prev };
      delete next[audioId];
      return next;
    });
  };

  const handleResetAll = () => {
    setListeningSelections({});
    setMatchingPairs({});
    setMatchingChecked(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8fb] text-[#1e1b24]">
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        totalScore={progress.totalScore}
        maxScore={progress.maxScore}
      />

      <div className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            totalScore={progress.totalScore}
            maxScore={progress.maxScore}
          />
        )}

        {currentPage === 'vocabulary' && (
          <VocabularyPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'exercises' && (
          <ExercisesPage
            listeningSelections={listeningSelections}
            onSelectListening={handleSelectListening}
            onResetListening={() => setListeningSelections({})}
            matchingPairs={matchingPairs}
            matchingChecked={matchingChecked}
            onUpdateMatchingPair={handleUpdateMatchingPair}
            onClearMatchingPair={handleClearMatchingPair}
            onCheckMatching={() => setMatchingChecked(true)}
            onResetMatching={() => {
              setMatchingPairs({});
              setMatchingChecked(false);
            }}
            onResetAll={handleResetAll}
          />
        )}
      </div>

      <footer className="border-t border-[#e5ddf0] bg-white py-5">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 text-sm text-[#5b5369] sm:px-6">
          <span>
            Học Tiếng Anh Nghề Nghiệp · Phông chữ Times New Roman
          </span>
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => handleNavigate('home')}
              className="hover:text-[#6b21a8] hover:underline"
            >
              Trang đầu
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('vocabulary')}
              className="hover:text-[#6b21a8] hover:underline"
            >
              Từ vựng
            </button>
            <button
              type="button"
              onClick={() => handleNavigate('exercises')}
              className="hover:text-[#6b21a8] hover:underline"
            >
              Bài tập
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
