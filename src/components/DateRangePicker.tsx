import { useTranslation } from 'react-i18next';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

/**
 * 日期范围选择组件
 * 支持 UTC+8 时区，粒度为日
 */
export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}: DateRangePickerProps) {
  const { t } = useTranslation();

  // 快捷选项：今天、昨天、近7天、近30天
  const shortcuts = [
    { label: t('date.today'), days: 0 },
    { label: t('date.yesterday'), days: 1 },
    { label: t('date.last7Days'), days: 7 },
    { label: t('date.last30Days'), days: 30 },
  ];

  // 获取 UTC+8 的当前日期
  const getUTC8Date = () => {
    const now = new Date();
    return new Date(now.getTime() + 8 * 60 * 60 * 1000);
  };

  // 将 UTC+8 日期转为 YYYY-MM-DD 字符串
  const toDateString = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const handleShortcut = (days: number) => {
    const utc8Now = getUTC8Date();
    
    if (days === 0) {
      // 今天
      const dateStr = toDateString(utc8Now);
      onStartDateChange(dateStr);
      onEndDateChange(dateStr);
    } else if (days === 1) {
      // 昨天
      const yesterday = new Date(utc8Now.getTime() - 24 * 60 * 60 * 1000);
      const dateStr = toDateString(yesterday);
      onStartDateChange(dateStr);
      onEndDateChange(dateStr);
    } else {
      // 近 N 天
      const start = new Date(utc8Now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
      const startStr = toDateString(start);
      const endStr = toDateString(utc8Now);
      onStartDateChange(startStr);
      onEndDateChange(endStr);
    }
  };

  return (
    <div className="space-y-3">
      {/* 快捷选项 */}
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((shortcut) => (
          <button
            key={shortcut.days}
            type="button"
            onClick={() => handleShortcut(shortcut.days)}
            className="px-3 py-1.5 text-sm rounded-full border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700
                       hover:text-blue-600 dark:hover:text-blue-400
                       transition-all active:scale-95"
          >
            {shortcut.label}
          </button>
        ))}
      </div>

      {/* 日期选择 - 美化版 */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
            {t('date.startDate')}
          </label>
          <div className="relative group">
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              max={endDate}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400
                         hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600
                         transition-all cursor-pointer
                         [color-scheme:light] dark:[color-scheme:dark]"
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800/50 transition-colors" />
          </div>
        </div>

        <div className="pt-6">
          <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 ml-1">
            {t('date.endDate')}
          </label>
          <div className="relative group">
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              min={startDate}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                         bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400
                         hover:bg-white dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600
                         transition-all cursor-pointer
                         [color-scheme:light] dark:[color-scheme:dark]"
            />
            <div className="absolute inset-0 rounded-xl pointer-events-none border-2 border-transparent group-hover:border-blue-200 dark:group-hover:border-blue-800/50 transition-colors" />
          </div>
        </div>
      </div>

      {/* 显示当前选择范围 */}
      <div className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800/50 px-3 py-2 rounded-lg inline-block">
        {startDate === endDate ? startDate : `${startDate} ~ ${endDate}`}
      </div>
    </div>
  );
}
