import { useState } from 'react';
import { ArrowRight, Volume2 } from 'lucide-react';
import { PROFESSIONS } from '../data/professions';
import { speakEnglishWord } from '../utils/speech';
import { ResilientImage } from './ResilientImage';
import type { AppPage } from './Header';

interface VocabularyPageProps {
  onNavigate: (page: AppPage) => void;
}

export function VocabularyPage({ onNavigate }: VocabularyPageProps) {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [speechNote, setSpeechNote] = useState<string>('');

  const handleSpeak = (id: string, word: string) => {
    setSpeechNote('');
    speakEnglishWord(word, {
      onStart: () => setSpeakingId(id),
      onEnd: () => setSpeakingId(null),
      onUnavailable: (msg) => {
        setSpeakingId(null);
        setSpeechNote(msg);
      },
    });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e5ddf0] pb-6">
        <div>
          <p className="text-sm font-bold text-[#6b21a8]">
            Phần 1 · Thẻ hình ảnh và âm thanh từ vựng
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#1e1b24]">
            Từ Vựng Chủ Đề Nghề Nghiệp
          </h1>
          <p className="mt-2 max-w-2xl text-base text-[#4b4458]">
            Bấm nút nghe để làm quen phát âm của từng từ vựng nghề nghiệp cùng
            hình ảnh minh họa trước khi làm bài tập.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('exercises')}
          className="inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[#6b21a8] px-5 py-2.5 text-base font-bold text-white transition-colors hover:bg-[#581c87]"
        >
          <span>Chuyển sang Bài tập</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {speechNote && (
        <div
          role="status"
          className="mt-4 rounded-lg border border-[#e5ddf0] bg-[#f7f4fb] px-4 py-3 text-sm text-[#4c1d95]"
        >
          {speechNote}
        </div>
      )}

      <section className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PROFESSIONS.map((item, index) => {
          const isSpeaking = speakingId === item.id;
          return (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e5ddf0] bg-white p-5"
            >
              <div>
                <div className="flex items-center justify-between text-sm text-[#5b5369]">
                  <span className="font-bold text-[#6b21a8] tabular-nums">
                    0{index + 1}. {item.word}
                  </span>
                  <span className="italic">{item.phonetic}</span>
                </div>

                <div className="mt-4 flex h-60 w-full items-center justify-center overflow-hidden rounded-xl border border-[#efeaf5] bg-[#faf8fb] p-3">
                  <ResilientImage
                    src={item.image}
                    alt={item.imageAlt}
                    fallbackTitle={item.word}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-2xl font-bold text-[#1e1b24]">
                    {item.word}
                  </h2>
                  <p className="mt-1 text-lg text-[#4b4458]">
                    {item.vietnamese}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#efeaf5] pt-4">
                <button
                  type="button"
                  onClick={() => handleSpeak(item.id, item.word)}
                  className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors ${
                    isSpeaking
                      ? 'border-[#6b21a8] bg-[#6b21a8] text-white'
                      : 'border-[#d4c7e8] bg-[#faf8fb] text-[#4c1d95] hover:bg-[#f3eff7]'
                  }`}
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {isSpeaking
                      ? 'Đang phát âm...'
                      : `Nghe phát âm "${item.word}"`}
                  </span>
                </button>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
