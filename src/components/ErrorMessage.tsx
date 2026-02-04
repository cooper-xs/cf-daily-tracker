import { useTranslation } from 'react-i18next';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * 错误提示组件
 */
export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  const { t } = useTranslation();

  return (
    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div className="flex items-center gap-3">
        <svg
          className="w-5 h-5 text-red-500 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-red-700 dark:text-red-400 font-medium">{t('common.error')}</p>
          <p className="text-red-600 dark:text-red-300 text-sm mt-1">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-300
                       bg-red-100 dark:bg-red-800/50 rounded-md
                       hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
          >
            {t('common.retry')}
          </button>
        )}
      </div>
    </div>
  );
}
