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

  const handleShortcut = (days: number) => {
    const now = new Date();
    // 使用 UTC+8
    const utc8Now = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    
    if (days === 0) {
      // 今天
      const dateStr = utc8Now.toISOString().split('T')[0];
      onStartDateChange(dateStr);
      onEndDateChange(dateStr);
    } else if (days === 1) {
      // 昨天
      const yesterday = new Date(utc8Now.getTime() - 24 * 60 * 60 * 1000);
      const dateStr = yesterday.toISOString().split('T')[0];
      onStartDateChange(dateStr);
      onEndDateChange(dateStr);
    } else {
      // 近 N 天
      const start = new Date(utc8Now.getTime() - days * 24 * 60 * 60 * 1000);
      const startStr = start.toISOString().split('T')[0];
      const endStr = utc8Now.toISOString().split('T')[0];
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
            className="px-3 py-1.5 text-sm rounded-md border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       hover:bg-gray-50 dark:hover:bg-gray-700
                       transition-colors"
          >
            {shortcut.label}
          </button>
        ))}
      </div>

      {/* 日期选择 */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t('date.startDate')}
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            max={endDate}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-colors"
          />
        </div>

        <span className="text-gray-400 pt-6">~</span>

        <div className="flex-1">
          <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">
            {t('date.endDate')}
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            min={startDate}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-500
                       transition-colors"
          />
        </div>
      </div>
    </div>
  );
}
