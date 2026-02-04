import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SearchInputProps {
  onSearch: (input: string) => void;
  loading: boolean;
}

/**
 * 用户搜索输入组件
 */
export function SearchInput({ onSearch, loading }: SearchInputProps) {
  const { t } = useTranslation();
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t('user.placeholder')}
            disabled={loading}
            className="w-full px-4 py-3 pr-24 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-colors"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5
                       bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400
                       text-white font-medium rounded-md
                       transition-colors disabled:cursor-not-allowed"
          >
            {loading ? t('common.loading') : t('common.search')}
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t('user.inputHint')}
        </p>
      </div>
    </form>
  );
}
