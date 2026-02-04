import { useTranslation } from 'react-i18next';
import { SearchInput, UserCard, SubmissionList, LanguageSwitcher, ErrorMessage } from './components';
import { useUserQuery } from './hooks';
import './i18n';

/**
 * 主应用组件
 */
function App() {
  const { t } = useTranslation();
  const { loading, error, users, submissions, queryUsers, clearError } = useUserQuery();

  return (
    &lt;div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors"&gt;
      {/* 头部 */}
      &lt;header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700"&gt;
        &lt;div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between"&gt;
          &lt;h1 className="text-xl font-bold text-gray-900 dark:text-white"&gt;
            {t('common.appName')}
          &lt;/h1&gt;
          &lt;LanguageSwitcher /&gt;
        &lt;/div&gt;
      &lt;/header&gt;

      {/* 主内容 */}
      &lt;main className="max-w-4xl mx-auto px-4 py-6"&gt;
        {/* 搜索区域 */}
        &lt;section className="mb-8"&gt;
          &lt;h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4"&gt;
            {t('user.title')}
          &lt;/h2&gt;
          &lt;SearchInput onSearch={queryUsers} loading={loading} /&gt;
        &lt;/section&gt;

        {/* 错误提示 */}
        {error && (
          &lt;section className="mb-6"&gt;
            &lt;ErrorMessage message={error} onRetry={clearError} /&gt;
          &lt;/section&gt;
        )}

        {/* 加载状态 */}
        {loading && (
          &lt;div className="flex items-center justify-center py-12"&gt;
            &lt;div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"&gt;&lt;/div&gt;
          &lt;/div&gt;
        )}

        {/* 用户列表和提交记录 */}
        {!loading && users.length > 0 && (
          &lt;div className="space-y-6"&gt;
            {users.map((user) => (
              &lt;section
                key={user.handle}
                className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden
                           bg-white dark:bg-gray-800"
              &gt;
                {/* 用户信息 */}
                &lt;div className="p-4 border-b border-gray-200 dark:border-gray-700"&gt;
                  &lt;UserCard
                    user={user}
                    submissionCount={submissions.get(user.handle)?.length || 0}
                  /&gt;
                &lt;/div&gt;

                {/* 提交记录 */}
                &lt;div className="p-4"&gt;
                  &lt;h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3"&gt;
                    {t('submission.title')}
                  &lt;/h3&gt;
                  &lt;SubmissionList
                    handle={user.handle}
                    submissions={submissions.get(user.handle) || []}
                  /&gt;
                &lt;/div&gt;
              &lt;/section&gt;
            ))}
          &lt;/div&gt;
        )}

        {/* 空状态 */}
        {!loading && users.length === 0 && !error && (
          &lt;div className="text-center py-16"&gt;
            &lt;div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800
                            flex items-center justify-center"&gt;
              &lt;svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              &gt;
                &lt;path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                /&gt;
              &lt;/svg&gt;
            &lt;/div&gt;
            &lt;p className="text-gray-500 dark:text-gray-400"&gt;
              {t('common.noData')}
            &lt;/p&gt;
          &lt;/div&gt;
        )}
      &lt;/main&gt;

      {/* 页脚 */}
      &lt;footer className="border-t border-gray-200 dark:border-gray-700 mt-auto"&gt;
        &lt;div className="max-w-4xl mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400"&gt;
          Data from{' '}
          &lt;a
            href="https://codeforces.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          &gt;
            Codeforces
          &lt;/a&gt;
        &lt;/div&gt;
      &lt;/footer&gt;
    &lt;/div&gt;
  );
}

export default App;
