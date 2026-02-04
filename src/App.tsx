import { useTranslation } from 'react-i18next';
import { TagInput, UserCard, SubmissionList, LanguageSwitcher, ThemeSwitcher, ErrorMessage, DateRangePicker } from './components';
import { useUserQuery, useTheme } from './hooks';
import './i18n';

/**
 * 主应用组件
 */
function App() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { loading, error, users, submissions, startDate, endDate, setDateRange, queryUsersByHandles, clearError } = useUserQuery();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <img 
              src="/avatar.png" 
              alt="logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <span className="hidden sm:inline">{t('common.appName')}</span>
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

        {!loading && users.length > 0 && (
          <div className="space-y-6">
            {users.map((user) => (
              <section
                key={user.handle}
                className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden
                           bg-white dark:bg-gray-800"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <UserCard
                    user={user}
                    submissionCount={submissions.get(user.handle)?.length || 0}
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {t('submission.title')}
                  </h3>
                  <SubmissionList
                    submissions={submissions.get(user.handle) || []}
                  />
                </div>
              </section>
            ))}
          </div>
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

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Data from{' '}
          <a
            href="https://codeforces.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Codeforces
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
