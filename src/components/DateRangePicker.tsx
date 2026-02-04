import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onChange: (startDate: string, endDate: string) => void;
}

// 获取 UTC+8 的当前日期字符串
function getUTC8DateString(): string {
  const now = new Date();
  const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8Time.toISOString().split('T')[0];
}

/**
 * 日期范围选择组件
 * 支持 UTC+8 时区，粒度为日
 */
export function DateRangePicker({
  startDate,
  endDate,
  onChange,
}: DateRangePickerProps) {
  const { t } = useTranslation();
  const today = getUTC8DateString();

  // 快捷选项：今天、昨天、近7天、近30天
  const shortcuts = [
    { label: t('date.today'), days: 0 },
    { label: t('date.yesterday'), days: 1 },
    { label: t('date.last7Days'), days: 7 },
    { label: t('date.last30Days'), days: 30 },
  ];

  // 判断当前选中哪个快捷选项
  const getActiveShortcut = (): number | null => {
    if (startDate === endDate) {
      if (startDate === today) return 0;
      const yesterday = new Date(new Date().getTime() + 8 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      if (startDate === yesterday) return 1;
    }
    // 近7天
    const sevenDaysAgo = new Date(new Date().getTime() + 8 * 60 * 60 * 1000 - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (startDate === sevenDaysAgo && endDate === today) return 7;
    // 近30天
    const thirtyDaysAgo = new Date(new Date().getTime() + 8 * 60 * 60 * 1000 - 29 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (startDate === thirtyDaysAgo && endDate === today) return 30;
    return null;
  };

  const activeShortcut = getActiveShortcut();

  const handleShortcut = useCallback((days: number) => {
    const utc8Now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
    const endStr = utc8Now.toISOString().split('T')[0];
    
    if (days === 0) {
      // 今天
      onChange(endStr, endStr);
    } else if (days === 1) {
      // 昨天
      const yesterday = new Date(utc8Now.getTime() - 24 * 60 * 60 * 1000);
      const startStr = yesterday.toISOString().split('T')[0];
      onChange(startStr, startStr);
    } else {
      // 近 N 天
      const start = new Date(utc8Now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
      const startStr = start.toISOString().split('T')[0];
      onChange(startStr, endStr);
    }
  }, [onChange]);

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStart = e.target.value;
    // 确保开始日期不超过结束日期
    if (newStart > endDate) {
      onChange(newStart, newStart);
    } else {
      onChange(newStart, endDate);
    }
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEnd = e.target.value;
    // 确保结束日期不早于开始日期
    if (newEnd < startDate) {
      onChange(newEnd, newEnd);
    } else {
      onChange(startDate, newEnd);
    }
  };

  return (
    <div className="space-y-3">
      {/* 快捷选项 */}
      <div className="flex flex-wrap gap-2">
        {shortcuts.map((shortcut) => {
          const isActive = 
            (shortcut.days === 0 && activeShortcut === 0) ||
            (shortcut.days === 1 && activeShortcut === 1) ||
            (shortcut.days === 7 && activeShortcut === 7) ||
            (shortcut.days === 30 && activeShortcut === 30);
          
          return (
            <button
              key={shortcut.days}
              type="button"
              onClick={() => handleShortcut(shortcut.days)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-all active:scale-95
                         ${isActive 
                           ? 'bg-blue-500 border-blue-500 text-white shadow-sm' 
                           : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-400'}`}
            >
              {shortcut.label}
            </button>
          );
        })}
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
              onChange={handleStartChange}
              max={today}
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
              onChange={handleEndChange}
              max={today}
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

    </div>
  );
}
