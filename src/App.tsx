import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TagInput, UserCard, SubmissionList, SubmissionFilterPanel, LanguageSwitcher, ThemeSwitcher, ErrorMessage, DateRangePicker } from './components';
import { useUserQuery, useTheme } from './hooks';
import './i18n';
import type { CFUser } from './types';

/**
 * 回到顶部按钮组件
 */
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 rounded-full bg-blue-500 hover:bg-blue-600 
                 text-white shadow-lg hover:shadow-xl transition-all duration-300 
                 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400"
      aria-label="Back to top"
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}

/**
 * 用户 Tab 组件
 */
interface UserTabsProps {
  users: CFUser[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

function UserTabs({ users, activeIndex, onSelect }: UserTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-x-auto scrollbar-hide">
      {users.map((user, index) => (
        <button
          key={user.handle}
          onClick={() => onSelect(index)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                     ${activeIndex === index
                       ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                       : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                     }`}
        >
          <img
            src={user.avatar}
            alt={user.handle}
            className="w-5 h-5 rounded-full"
          />
          <span>{user.handle}</span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeIndex === index ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'}`}>
            {user.rating}
          </span>
        </button>
      ))}
    </div>
  );
}

/**
 * 精简用户信息面板（吸顶时使用，不可展开）
 */
interface CompactUserPanelProps {
  user: CFUser;
  submissionCount: number;
}

function CompactUserPanel({ user, submissionCount }: CompactUserPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 px-4 py-3">
        <img src={user.avatar} alt={user.handle} className="w-10 h-10 rounded-full" />
        <div>
          <div className="font-semibold text-gray-900 dark:text-white">{user.handle}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span className="font-medium" style={{ color: getRatingColor(user.rating) }}>
              {user.rank} · {user.rating}
            </span>
            <span>·</span>
            <span>{submissionCount} submissions</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * 可折叠的筛选面板
 */
interface CollapsibleFilterPanelProps {
  submissions: any[];
  resultFilter: 'all' | 'accepted' | 'rejected';
  ratingRange: { min: number | null; max: number | null } | null;
  onResultFilterChange: (filter: 'all' | 'accepted' | 'rejected') => void;
  onRatingRangeChange: (range: { min: number | null; max: number | null } | null) => void;
  isExpanded: boolean;
  onToggle: () => void;
}

function CollapsibleFilterPanel({ 
  submissions, 
  resultFilter, 
  ratingRange, 
  onResultFilterChange, 
  onRatingRangeChange,
  isExpanded,
  onToggle,
}: CollapsibleFilterPanelProps) {
  const { t } = useTranslation();

  // 计算筛选后的数量
  const filteredCount = submissions.filter((sub) => {
    if (resultFilter === 'accepted' && sub.verdict !== 'OK') return false;
    if (resultFilter === 'rejected' && sub.verdict === 'OK') return false;
    if (ratingRange && ratingRange.min !== null && ratingRange.max !== null) {
      const rating = sub.problem.rating;
      if (rating === undefined || rating === null || rating < ratingRange.min || rating > ratingRange.max) return false;
    }
    return true;
  }).length;

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* 折叠状态：精简筛选状态 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">{resultFilter === 'all' ? t('filter.all') : resultFilter === 'accepted' ? t('filter.accepted') : t('filter.rejected')}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              resultFilter === 'accepted' ? 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400' :
              resultFilter === 'rejected' ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400' :
              'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
            }`}>
              {filteredCount}
            </span>
          </div>
          {ratingRange && (
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 dark:text-gray-400">Rating: {ratingRange.min}-{ratingRange.max}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={onToggle}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <span>{t('filter.adjust')}</span>
          <svg 
            className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* 展开状态：完整筛选面板 */}
      <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4">
          <SubmissionFilterPanel
            submissions={submissions}
            resultFilter={resultFilter}
            ratingRange={ratingRange}
            onResultFilterChange={onResultFilterChange}
            onRatingRangeChange={onRatingRangeChange}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 获取 Rating 对应的颜色
 */
function getRatingColor(rating: number): string {
  if (rating < 1200) return '#808080';
  if (rating < 1400) return '#008000';
  if (rating < 1600) return '#03a89e';
  if (rating < 1900) return '#0000ff';
  if (rating < 2100) return '#aa00aa';
  if (rating < 2400) return '#ff8c00';
  return '#ff0000';
}

/**
 * 主应用组件
 */
function App() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { loading, error, users, submissions, startDate, endDate, queryStartDate, queryEndDate, setDateRange, queryUsersByHandles, clearError } = useUserQuery();
  
  // 当前选中的用户索引
  const [activeUserIndex, setActiveUserIndex] = useState(0);
  // 筛选面板是否展开（默认收起）
  const [isFilterPanelExpanded, setIsFilterPanelExpanded] = useState(false);
  // 是否显示固定头部
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  
  // 筛选状态（提升到 App 层级，方便固定面板共享）
  const [resultFilter, setResultFilter] = useState<'all' | 'accepted' | 'rejected'>('all');
  const [ratingRange, setRatingRange] = useState<{ min: number | null; max: number | null } | null>(null);

  // 当用户列表变化时，重置选中索引和筛选
  useEffect(() => {
    setActiveUserIndex(0);
    setIsFilterPanelExpanded(false);
    setResultFilter('all');
    setRatingRange(null);
  }, [users.map(u => u.handle).join(',')]);

  // 监听滚动，控制固定头部显示
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyHeader(window.scrollY > 200);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 当前选中的用户
  const activeUser = users[activeUserIndex];
  const activeSubmissions = activeUser ? (submissions.get(activeUser.handle) || []) : [];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* 固定顶部导航 */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <img
              src="/avatar.png"
              alt="logo"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="text-sm sm:text-base">{t('common.appName')}</span>
          </h1>
          <div className="flex items-center gap-2">
            <ThemeSwitcher theme={theme} onChange={setTheme} />
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('user.title')}
          </h2>

          {/* 日期范围选择 */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('date.dateRange')}
            </h3>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onChange={setDateRange}
            />
          </div>

          {/* 标签式用户输入 */}
          <TagInput onSearch={queryUsersByHandles} loading={loading} />
        </section>

        {error && (
          <section className="mb-6">
            <ErrorMessage message={error} onRetry={clearError} />
          </section>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* 用户 Tab 切换（多人查询时显示） */}
        {!loading && users.length > 1 && (
          <section className="mb-4">
            <UserTabs 
              users={users} 
              activeIndex={activeUserIndex} 
              onSelect={setActiveUserIndex} 
            />
          </section>
        )}

        {/* 固定用户信息 & 筛选面板（滚动后显示） */}
        {!loading && users.length > 0 && showStickyHeader && (
          <div className="fixed top-16 left-0 right-0 z-40 shadow-lg">
            <div className="max-w-4xl mx-auto px-4">
              {/* 吸顶时只显示精简用户信息（不可展开） */}
              <CompactUserPanel
                user={activeUser}
                submissionCount={activeSubmissions.length}
              />
              <CollapsibleFilterPanel
                submissions={activeSubmissions}
                resultFilter={resultFilter}
                ratingRange={ratingRange}
                onResultFilterChange={setResultFilter}
                onRatingRangeChange={setRatingRange}
                isExpanded={isFilterPanelExpanded}
                onToggle={() => setIsFilterPanelExpanded(!isFilterPanelExpanded)}
              />
            </div>
          </div>
        )}

        {/* 占位的空白，防止固定头部出现时内容跳动 */}
        {!loading && users.length > 0 && showStickyHeader && (
          <div className={`transition-all duration-300 ${
            isFilterPanelExpanded ? 'h-[420px]' : 'h-28'
          }`} />
        )}

        {/* 用户提交记录 */}
        {!loading && users.length > 0 && (
          <section className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
            {/* 非固定状态的用户信息 */}
            {!showStickyHeader && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <UserCard
                  user={activeUser}
                  submissionCount={activeSubmissions.length}
                  startDate={queryStartDate || startDate}
                  endDate={queryEndDate || endDate}
                />
              </div>
            )}

            {/* 非固定状态的筛选面板 */}
            {!showStickyHeader && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <SubmissionFilterPanel
                  submissions={activeSubmissions}
                  resultFilter={resultFilter}
                  ratingRange={ratingRange}
                  onResultFilterChange={setResultFilter}
                  onRatingRangeChange={setRatingRange}
                />
              </div>
            )}

            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                {t('submission.title')}
              </h3>
              <SubmissionList
                submissions={activeSubmissions}
                resultFilter={resultFilter}
                ratingRange={ratingRange}
                onResultFilterChange={setResultFilter}
                onRatingRangeChange={setRatingRange}
                hideFilterPanel={true}
              />
            </div>
          </section>
        )}

        {!loading && users.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800
                            flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400">
              {t('common.noData')}
            </p>
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto bg-white dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* 数据源 */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <span>Data from</span>
            <a
              href="https://codeforces.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Codeforces
            </a>
          </div>

          {/* GitHub 链接 */}
          <div className="flex items-center justify-center mb-4">
            <a
              href="https://github.com/cooper-xs/cf-daily-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 
                         text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 
                         transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>View on GitHub</span>
            </a>
          </div>

          {/* 署名 */}
          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center justify-center gap-1 flex-wrap">
              <span>Made with</span>
              <span className="text-red-500 animate-pulse">❤️</span>
              <span>by</span>
              <a
                href="https://github.com/cooper-xs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
              >
                @cooper-xs
              </a>
              <span>·</span>
              <span className="font-medium text-gray-600 dark:text-gray-300">@yume</span>
              <span>·</span>
              <span className="font-medium bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">@TARS</span>
              <span>🤖</span>
            </span>
          </div>
        </div>
      </footer>

      {/* 回到顶部按钮 */}
      <BackToTopButton />
    </div>
  );
}

export default App;
