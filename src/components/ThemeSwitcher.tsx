import type { ThemeMode } from '../hooks/useTheme';

interface ThemeSwitcherProps {
  theme: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

/**
 * 主题切换组件
 * 仅图标按钮，更紧凑
 */
export function ThemeSwitcher({ theme, onChange }: ThemeSwitcherProps) {
  const options: { key: ThemeMode; icon: string; label: string }[] = [
    { key: 'light', icon: '☀️', label: '浅色' },
    { key: 'dark', icon: '🌙', label: '深色' },
    { key: 'system', icon: '🖥️', label: '跟随系统' },
  ];

  return (
    <div className="flex items-center gap-0.5 p-1 bg-gray-100/80 dark:bg-gray-800/80 rounded-full border border-gray-200 dark:border-gray-700">
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => onChange(option.key)}
          title={option.label}
          className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-all
                     ${theme === option.key
                       ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 shadow-sm'
                       : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-700/50'
                     }`}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}
