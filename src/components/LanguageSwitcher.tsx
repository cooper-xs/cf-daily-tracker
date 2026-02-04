import { useTranslation } from 'react-i18next';

/**
 * 语言切换组件
 * 紧凑的胶囊样式
 */
export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'zh-CN', label: '中', fullLabel: '中文' },
    { code: 'en', label: 'EN', fullLabel: 'English' },
  ];

  const isZh = i18n.language === 'zh-CN' || i18n.language === 'zh';
  const isEn = i18n.language === 'en' || i18n.language === 'en-US';

  return (
    <div className="flex items-center gap-0.5 p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-gray-700">
      {languages.map((lang) => {
        const isActive = lang.code === 'zh-CN' ? isZh : isEn;
        return (
          <button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            title={lang.fullLabel}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-all
                       ${isActive
                         ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                         : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                       }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
