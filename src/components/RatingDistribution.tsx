import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CFSubmission } from '../types';

interface RatingDistributionProps {
  submissions: CFSubmission[];
  onRatingRangeSelect?: (min: number | null, max: number | null) => void;
  selectedRange: { min: number | null; max: number | null } | null;
}

// Rating 区间定义
const RATING_RANGES = [
  { min: 0, max: 1199, label: 'Newbie', color: '#808080' },
  { min: 1200, max: 1399, label: 'Pupil', color: '#008000' },
  { min: 1400, max: 1599, label: 'Specialist', color: '#03a89e' },
  { min: 1600, max: 1899, label: 'Expert', color: '#0000ff' },
  { min: 1900, max: 2099, label: 'Candidate Master', color: '#aa00aa' },
  { min: 2100, max: 2299, label: 'Master', color: '#ff8c00' },
  { min: 2300, max: 2399, label: 'International Master', color: '#ff8c00' },
  { min: 2400, max: 2599, label: 'Grandmaster', color: '#ff0000' },
  { min: 2600, max: 2999, label: 'International Grandmaster', color: '#ff0000' },
  { min: 3000, max: 5000, label: 'Legendary Grandmaster', color: '#ff0000' },
];

/**
 * Rating 分布统计组件
 * 展示用户在不同 Rating 区间的做题情况
 */
export function RatingDistribution({ 
  submissions, 
  onRatingRangeSelect,
  selectedRange 
}: RatingDistributionProps) {
  const { t } = useTranslation();

  // 统计每个区间的通过情况
  const distribution = useMemo(() => {
    return RATING_RANGES.map(range => {
      const rangeSubs = submissions.filter(sub => {
        const rating = sub.problem.rating;
        if (!rating) return false;
        return rating >= range.min && rating <= range.max;
      });

      const solved = rangeSubs.filter(sub => sub.verdict === 'OK');
      const attempted = rangeSubs.length;

      return {
        ...range,
        solved: solved.length,
        attempted,
      };
    }).filter(d => d.attempted > 0); // 只显示有做题记录的区间
  }, [submissions]);

  if (distribution.length === 0) {
    return null;
  }

  // 找出最大值用于计算百分比
  const maxAttempted = Math.max(...distribution.map(d => d.attempted));

  return (
    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {t('rating.distribution')}
      </h4>
      <div className="space-y-2">
        {distribution.map((item) => {
          const isSelected = selectedRange?.min === item.min && selectedRange?.max === item.max;
          const percentage = maxAttempted > 0 ? (item.attempted / maxAttempted) * 100 : 0;
          const solveRate = item.attempted > 0 ? Math.round((item.solved / item.attempted) * 100) : 0;

          return (
            <button
              key={item.label}
              onClick={() => {
                if (isSelected && onRatingRangeSelect) {
                  onRatingRangeSelect(null, null);
                } else if (onRatingRangeSelect) {
                  onRatingRangeSelect(item.min, item.max);
                }
              }}
              className={`w-full text-left group ${onRatingRangeSelect ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center gap-3">
                {/* 段位标签 */}
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">
                  {item.min}
                </span>

                {/* 进度条 */}
                <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                  <div
                    className="h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max(percentage, 8)}%`,
                      backgroundColor: item.color + '40',
                    }}
                  >
                    {item.attempted >= 3 && (
                      <span className="text-xs font-medium" style={{ color: item.color }}>
                        {item.attempted}
                      </span>
                    )}
                  </div>
                  {item.attempted < 3 && (
                    <span className="absolute inset-0 flex items-center px-2 text-xs text-gray-600 dark:text-gray-400"
                    >
                      {item.attempted}题
                    </span>
                  )}
                </div>

                {/* 统计信息 */}
                <div className="text-right shrink-0 w-20">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {item.solved}</span>
                  <span className="text-xs text-gray-400 dark:text-gray-500">/{item.attempted}</span>
                  <span className={`ml-1.5 text-xs ${solveRate >= 50 ? 'text-green-500' : 'text-gray-400'}`}>
                    {solveRate}%
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Rating 筛选标签
 */
interface RatingFilterTagsProps {
  selectedRange: { min: number | null; max: number | null } | null;
  onClear: () => void;
}

export function RatingFilterTags({ selectedRange, onClear }: RatingFilterTagsProps) {
  if (!selectedRange || !selectedRange.min || !selectedRange.max) return null;

  const range = RATING_RANGES.find(r => r.min === selectedRange.min && r.max === selectedRange.max);
  if (!range) return null;

  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">筛选: </span>
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
        style={{
          backgroundColor: range.color + '20',
          color: range.color,
        }}
      >
        {range.label} ({range.min}-{range.max})
        <button
          onClick={onClear}
          className="ml-1 w-4 h-4 rounded-full hover:bg-black/10 flex items-center justify-center"
        >
          ×
        </button>
      </span>
    </div>
  );
}

export { RATING_RANGES };
