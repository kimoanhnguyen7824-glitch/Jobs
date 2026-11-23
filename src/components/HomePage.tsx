import { ArrowRight, BookOpen } from 'lucide-react';
import { KUROMI_COVER_IMAGE, PROFESSIONS } from '../data/professions';
import { ResilientImage } from './ResilientImage';
import type { AppPage } from './Header';

interface HomePageProps {
  onNavigate: (page: AppPage) => void;
  totalScore: number;
  maxScore: number;
}

export function HomePage({ onNavigate, totalScore, maxScore }: HomePageProps) {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Hero Split with Kuromi Cover Illustration */}
      <section className="grid grid-cols-1 items-stretch gap-8 rounded-2xl border border-[#e5ddf0] bg-white p-6 sm:p-10 lg:grid-cols-12">
        <div className="flex flex-col justify-center lg:col-span-7">
          <p className="mb-3 text-sm font-bold text-[#6b21a8]">
            Bài học Tiếng Anh · Chủ đề Nghề nghiệp (Jobs)
          </p>

          <h1 className="max-w-2xl text-3xl font-bold leading-tight text-[#1e1b24] [text-wrap:balance] sm:text-5xl">
            Học Từ Vựng &amp; Nghe Chọn Hình cùng Kuromi
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-[#4b4458]">
            Chào mừng bé đến với trang học tập chủ đề nghề nghiệp. Toàn bộ nội
            dung dùng phông chữ Times New Roman rõ ràng, giúp bé làm quen 5 từ
            vựng quen thuộc qua hoạt động nghe âm thanh và chọn hình minh họa
            sinh động.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-sm text-[#5b5369]">
            <span className="whitespace-nowrap">5 từ vựng trọng tâm</span>
            <span aria-hidden="true">·</span>
            <span className="whitespace-nowrap">2 bài tập nghe &amp; nối hình</span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span className="whitespace-nowrap tabular-nums">
              Điểm hiện tại: {totalScore}/{maxScore}
            </span>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('exercises')}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[#6b21a8] px-6 py-3 text-base font-bold text-white transition-colors hover:bg-[#581c87]"
            >
              <span>Bắt đầu làm bài tập</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('vocabulary')}
              className="inline-flex min-h-[44px] shrink-0 items-center gap-2 whitespace-nowrap rounded-lg border border-[#d4c7e8] bg-[#faf8fb] px-5 py-3 text-base font-bold text-[#4c1d95] transition-colors hover:bg-[#f3eff7]"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              <span>Ôn tập từ vựng</span>
            </button>
          </div>
        </div>

        {/* Kuromi Image Frame on First Page */}
        <div className="flex items-center justify-center lg:col-span-5">
          <figure className="w-full overflow-hidden rounded-xl border border-[#e5ddf0] bg-[#f7f4fb] p-3">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-white">
              <ResilientImage
                src={KUROMI_COVER_IMAGE}
                alt="Hình nhân vật Kuromi dễ thương đang cầm sách học tiếng Anh"
                fallbackTitle="Kuromi học tiếng Anh"
                className="h-full w-full object-cover"
              />
            </div>
            <figcaption className="mt-3 text-center text-sm italic text-[#5b5369] [text-wrap:balance]">
              Kuromi đồng hành cùng bé chinh phục 10 câu hỏi nghe và chọn hình
            </figcaption>
          </figure>
        </div>
      </section>

      {/* 4-column Lesson Structure Strip below Hero */}
      <section
        aria-label="Thông tin bài học"
        className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        <div className="rounded-xl border border-[#e5ddf0] bg-white p-4">
          <p className="text-sm text-[#5b5369]">Số lượng từ vựng</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[#1e1b24]">
            05 từ
          </p>
        </div>
        <div className="rounded-xl border border-[#e5ddf0] bg-white p-4">
          <p className="text-sm text-[#5b5369]">Dạng bài tập</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[#1e1b24]">
            02 phần
          </p>
        </div>
        <div className="rounded-xl border border-[#e5ddf0] bg-white p-4">
          <p className="text-sm text-[#5b5369]">Tổng câu hỏi</p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-[#1e1b24]">
            10 câu
          </p>
        </div>
        <div className="rounded-xl border border-[#e5ddf0] bg-white p-4">
          <p className="text-sm text-[#5b5369]">Kiểu chữ hiển thị</p>
          <p className="mt-1 text-xl font-bold text-[#1e1b24]">
            Times New Roman
          </p>
        </div>
      </section>

      {/* Overview of the 5 Professions (Vocabulary Words Only, No Sentences) */}
      <section className="mt-10 rounded-2xl border border-[#e5ddf0] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#efeaf5] pb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#1e1b24]">
              5 Từ vựng nghề nghiệp hôm nay
            </h2>
            <p className="mt-1 text-base text-[#5b5369]">
              Làm quen tên các nghề nghiệp trước khi bước vào phần nghe và nối hình
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('vocabulary')}
            className="shrink-0 whitespace-nowrap text-base font-bold text-[#6b21a8] underline-offset-4 hover:underline"
          >
            Mở trang Từ vựng →
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PROFESSIONS.map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col rounded-xl border border-[#e5ddf0] bg-[#faf8fb] p-4"
            >
              <span className="text-xs font-bold text-[#6b21a8] tabular-nums">
                Từ số 0{idx + 1}
              </span>
              <h3 className="mt-1 text-xl font-bold text-[#1e1b24]">
                {item.word}
              </h3>
              <p className="text-sm italic text-[#5b5369]">{item.phonetic}</p>
              <p className="mt-2 text-base font-bold text-[#3f384c]">
                {item.vietnamese}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
