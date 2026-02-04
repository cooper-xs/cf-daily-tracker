import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CFSubmission } from '../types';

interface RatingDistributionProps {
  submissions: CFSubmission[];
  filteredCount?: number; // 筛选后的数量
  onRatingRangeSelect?: (min: number | null, max: number | null) => void;
  selectedRange: { min: number | null; max: number | null } | null;
  resultFilter?: 'all' | 'accepted' | 'rejected'; // 通过性筛选状态
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
 * 支持按通过性筛选显示
 */
export function RatingDistribution({ 
  submissions, 
  filteredCount,
  onRatingRangeSelect,
  selectedRange,
  resultFilter = 'all',
}: RatingDistributionProps) {
  const { t } = useTranslation();

  // 统计每个区间的通过情况
  const distribution = useMemo(() => {
    return RATING_RANGES.map(range => {
      // 该区间所有提交
      const rangeSubs = submissions.filter(sub => {
        const rating = sub.problem.rating;
        if (rating === undefined || rating === null) return false;
        return rating >= range.min && rating <= range.max;
      });

      // 已通过和未通过
      const solved = rangeSubs.filter(sub => sub.verdict === 'OK');
      const failed = rangeSubs.filter(sub => sub.verdict !== 'OK');
      const attempted = rangeSubs.length;

      return {
        ...range,
        solved: solved.length,
        failed: failed.length,
        attempted,
      };
    }).filter(d => d.attempted > 0); // 只显示有做题记录的区间
  }, [submissions]);

  if (distribution.length === 0) {
    return null;
  }

  // 找出最大值用于计算百分比
  const maxAttempted = Math.max(...distribution.map(d => d.attempted));

  // 显示标题
  const totalCount = submissions.length;
  const displayCount = filteredCount !== undefined ? filteredCount : totalCount;
  const showFiltered = filteredCount !== undefined && filteredCount !== totalCount;

  return (
    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('rating.distribution')}
        </h4>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {showFiltered ? (
            <>
              <span className="text-blue-600 dark:text-blue-400 font-medium">{displayCount}</span>
              <span className="text-gray-400">/{totalCount}</span>
              <span className="ml-1">{t('common.results')}</span>
            </>
          ) : (
            <>{totalCount} {t('common.results')}</>
          )}
        </span>
      </div>
      <div className="space-y-2">
        {distribution.map((item) => {
          const isSelected = selectedRange?.min === item.min && selectedRange?.max === item.max;
          
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
                  {resultFilter === 'all' ? (
                    // 全部模式：堆叠进度条（通过部分用难度色，未通过用浅色背景）
                    <>
                      {/* 未通过部分 - 难度对应的浅色背景 */}
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max((item.attempted / maxAttempted) * 100, item.attempted > 0 ? 4 : 0)}%`,
                          backgroundColor: item.color + '30',
                          zIndex: 1,
                        }}
                      />
                      {/* 通过部分 - 难度对应的颜色 */}
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max((item.solved / maxAttempted) * 100, item.solved > 0 ? 4 : 0)}%`,
                          backgroundColor: item.color,
                          zIndex: 2,
                        }}
                      />
                      {/* 文字 */}
                      <div className="absolute inset-0 flex items-center px-2 z-10">
                        {item.attempted >= 2 ? (
                          <span className="text-xs font-medium text-white dark:text-white drop-shadow-sm">
                            {item.solved}/{item.attempted}
                          </span>
                        ) : (
                          <span className="text-xs text-white dark:text-white drop-shadow-sm">
                            {item.attempted}题
                          </span>
                        )}
                      </div>
                    </>
                  ) : resultFilter === 'accepted' ? (
                    // 通过模式：绿色进度条
                    <>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max((item.solved / maxAttempted) * 100, item.solved > 0 ? 8 : 0)}%`,
                          backgroundColor: '#22c55e',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-xs font-medium text-green-700 dark:text-green-300">
                          {item.solved} AC
                        </span>
                      </div>
                    </>
                  ) : (
                    // 未通过模式：红色进度条
                    <>
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max((item.failed / maxAttempted) * 100, item.failed > 0 ? 8 : 0)}%`,
                          backgroundColor: '#ef444480',
                        }}
                      />
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-xs font-medium text-red-700 dark:text-red-300">
                          {item.failed} WA
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* 统计信息 */}
                <div className="text-right shrink-0 w-24">
                  {resultFilter === 'all' ? (
                    <>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.solved}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">/{item.attempted}</span>
                      <span className={`ml-1.5 text-xs ${item.solved / item.attempted >= 0.5 ? 'text-green-500' : 'text-gray-400'}`}>
                        {Math.round((item.solved / item.attempted) * 100)}%
                      </span>
                    </>
                  ) : resultFilter === 'accepted' ? (
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{item.solved}</span>
                  ) : (
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">{item.failed}</span>
                  )}
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
  if (!selectedRange || selectedRange.min === null || selectedRange.max === null) return null;

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
