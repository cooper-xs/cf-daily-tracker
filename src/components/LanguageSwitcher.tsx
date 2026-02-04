import { useTranslation } from 'react-i18next';

/**
 * 语言切换组件
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'zh-CN', label: '中文' },
    { code: 'en', label: 'English' },
  ];

  return (
    <div className="flex gap-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          className={`px-2 py-1 text-sm rounded transition-colors ${
            i18n.language === lang.code
              ? 'bg-blue-500 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
}
