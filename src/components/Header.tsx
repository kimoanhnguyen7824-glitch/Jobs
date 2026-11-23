export type AppPage = 'home' | 'vocabulary' | 'exercises';

interface HeaderProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  totalScore: number;
  maxScore: number;
}

export function Header({
  currentPage,
  onNavigate,
  totalScore,
  maxScore,
}: HeaderProps) {
  const navItems: { id: AppPage; label: string }[] = [
    { id: 'home', label: 'Trang đầu' },
    { id: 'vocabulary', label: 'Từ vựng' },
    { id: 'exercises', label: 'Bài tập' },
  ];

  return (
    <header className="border-b border-[#e5ddf0] bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:flex-nowrap sm:gap-8 sm:px-6 sm:py-3.5">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="shrink-0 whitespace-nowrap text-left text-lg font-bold tracking-tight text-[#1e1b24] transition-colors hover:text-[#6b21a8] sm:text-xl"
        >
          Tiếng Anh Nghề Nghiệp
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav
          aria-label="Điều hướng chính"
          className="flex items-center gap-4 sm:gap-7"
        >
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={isActive ? 'page' : undefined}
                className={`shrink-0 whitespace-nowrap border-b-2 py-1 text-sm transition-colors sm:text-base ${
                  isActive
                    ? 'border-[#6b21a8] font-bold text-[#6b21a8]'
                    : 'border-transparent font-normal text-[#4b4458] hover:border-[#c4b5fd] hover:text-[#1e1b24]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden shrink-0 items-center md:flex">
          <button
            type="button"
            onClick={() => onNavigate('exercises')}
            className="shrink-0 whitespace-nowrap rounded-lg bg-[#6b21a8] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#581c87]"
          >
            Làm bài tập ({totalScore}/{maxScore})
          </button>
        </div>
      </div>
    </header>
  );
}
