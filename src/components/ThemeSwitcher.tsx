import { useTranslation } from 'react-i18next';
import type { ThemeMode } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

/**
 * 主题切换组件
 * 支持：跟随系统、浅色、深色
 */
export function ThemeSwitcher({ theme, onChange }: ThemeSwitcherProps) {
  const { t } = useTranslation();

  const options: { key: ThemeMode; icon: string }[] = [
    { key: 'system', icon: '🖥️' },
    { key: 'light', icon: '☀️' },
    { key: 'dark', icon: '🌙' },
  ];

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          title={t(`theme.${option.key}`)}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 text-sm rounded-md transition-all
                     ${theme === option.key
                       ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                       : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                     }`}
        >
          <span className="text-base">{option.icon}</span>
          <span className="hidden sm:inline">{t(`theme.${option.key}`)}</span>
        </button>
      ))}
    </div>
  );
}
