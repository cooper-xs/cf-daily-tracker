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

// Rating 区间定义（分数由高到低排序）
const RATING_RANGES = [
  { min: 3000, max: 5000, label: 'Legendary Grandmaster', color: '#ff0000' },
  { min: 2600, max: 2999, label: 'International Grandmaster', color: '#ff0000' },
  { min: 2400, max: 2599, label: 'Grandmaster', color: '#ff0000' },
  { min: 2300, max: 2399, label: 'International Master', color: '#ff8c00' },
  { min: 2100, max: 2299, label: 'Master', color: '#ff8c00' },
  { min: 1900, max: 2099, label: 'Candidate Master', color: '#aa00aa' },
  { min: 1600, max: 1899, label: 'Expert', color: '#0000ff' },
  { min: 1400, max: 1599, label: 'Specialist', color: '#03a89e' },
  { min: 1200, max: 1399, label: 'Pupil', color: '#008000' },
  { min: 800, max: 1199, label: 'Newbie', color: '#808080' },
];

// 未定分题目区间
const UNRATED_RANGE = { min: -1, max: -1, label: 'Unrated', color: '#9ca3af' };

/**
 * 获取题目的唯一标识
 */
function getProblemKey(sub: CFSubmission): string {
  return `${sub.problem.contestId || 'unknown'}-${sub.problem.index}`;
}

/**
 * Rating 分布统计组件
 * 展示用户在不同 Rating 区间的做题情况
 * 支持按通过性筛选显示
 * 通过的题目会去重统计
 */
export function RatingDistribution({ 
  submissions, 
  filteredCount,
  onRatingRangeSelect,
  selectedRange,
  resultFilter = 'all',
}: RatingDistributionProps) {
  const { t } = useTranslation();

  // 统计每个区间的通过情况（通过的题目去重）
  const { distribution, unratedData, totalUniqueSolved } = useMemo(() => {
    let totalUnique = 0;
    
    // 统计有分值的区间
    const dist = RATING_RANGES.map(range => {
      // 该区间所有提交
      const rangeSubs = submissions.filter(sub => {
        const rating = sub.problem.rating;
        if (rating === undefined || rating === null) return false;
        return rating >= range.min && rating <= range.max;
      });

      // 已通过和未通过（去重前）
      const allSolved = rangeSubs.filter(sub => sub.verdict === 'OK');
      const failed = rangeSubs.filter(sub => sub.verdict !== 'OK');
      
      // 通过的题目去重：每个题目只算一次
      const uniqueSolvedKeys = new Set<string>();
      allSolved.forEach(sub => {
        uniqueSolvedKeys.add(getProblemKey(sub));
      });
      const uniqueSolved = uniqueSolvedKeys.size;
      totalUnique += uniqueSolved;

      return {
        ...range,
        solved: uniqueSolved, // 去重后的通过数
        solvedCount: allSolved.length, // 原始通过提交数（用于参考）
        failed: failed.length,
        attempted: rangeSubs.length,
      };
    }).filter(d => d.attempted > 0); // 只显示有做题记录的区间

    // 统计未定分题目
    const unratedSubs = submissions.filter(sub => {
      const rating = sub.problem.rating;
      return rating === undefined || rating === null;
    });
    const unratedSolved = unratedSubs.filter(sub => sub.verdict === 'OK');
    const unratedFailed = unratedSubs.filter(sub => sub.verdict !== 'OK');
    const unratedUniqueSolvedKeys = new Set<string>();
    unratedSolved.forEach(sub => {
      unratedUniqueSolvedKeys.add(getProblemKey(sub));
    });
    const unratedUniqueSolved = unratedUniqueSolvedKeys.size;
    totalUnique += unratedUniqueSolved;

    const unratedData = unratedSubs.length > 0 ? {
      ...UNRATED_RANGE,
      solved: unratedUniqueSolved,
      solvedCount: unratedSolved.length,
      failed: unratedFailed.length,
      attempted: unratedSubs.length,
    } : null;

    return { distribution: dist, unratedData, totalUniqueSolved: totalUnique };
  }, [submissions]);

  // 找出最大值用于计算百分比（必须在所有 hooks 之后，return 之前）
  const maxValue = useMemo(() => {
    if (distribution.length === 0) return 1;
    if (resultFilter === 'accepted') {
      return Math.max(...distribution.map((d: { solved: number }) => d.solved), 1);
    } else if (resultFilter === 'rejected') {
      return Math.max(...distribution.map((d: { failed: number }) => d.failed), 1);
    }
    return Math.max(...distribution.map((d: { attempted: number }) => d.attempted), 1);
  }, [distribution, resultFilter]);

  // 显示标题
  const totalCount = submissions.length;
  const displayCount = filteredCount !== undefined ? filteredCount : totalCount;
  const showFiltered = filteredCount !== undefined && filteredCount !== totalCount;

  return (
    <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
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
      
      {/* 去重提示 */}
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-3">
        💡 {t('rating.deduplicateHint', { count: totalUniqueSolved })}
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
                          width: `${Math.max((item.attempted / maxValue) * 100, item.attempted > 0 ? 4 : 0)}%`,
                          backgroundColor: item.color + '30',
                          zIndex: 1,
                        }}
                      />
                      {/* 通过部分 - 难度对应的颜色 */}
                      <div
                        className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.max((item.solved / maxValue) * 100, item.solved > 0 ? 4 : 0)}%`,
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
                            {item.attempted}
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
                          width: `${Math.max((item.solved / maxValue) * 100, item.solved > 0 ? 4 : 0)}%`,
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
                          width: `${Math.max((item.failed / maxValue) * 100, item.failed > 0 ? 4 : 0)}%`,
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

        {/* 未定分题目 */}
        {unratedData && (
          <button
            onClick={() => {
              const isSelected = selectedRange?.min === -1 && selectedRange?.max === -1;
              if (isSelected && onRatingRangeSelect) {
                onRatingRangeSelect(null, null);
              } else if (onRatingRangeSelect) {
                onRatingRangeSelect(-1, -1);
              }
            }}
            className={`w-full text-left group ${onRatingRangeSelect ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-center gap-3">
              {/* 段位标签 */}
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: unratedData.color }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 w-12 shrink-0">
                —
              </span>

              {/* 进度条 */}
              <div className="flex-1 h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative">
                {resultFilter === 'all' ? (
                  <>
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max((unratedData.attempted / maxValue) * 100, unratedData.attempted > 0 ? 4 : 0)}%`,
                        backgroundColor: unratedData.color + '40',
                        zIndex: 1,
                      }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max((unratedData.solved / maxValue) * 100, unratedData.solved > 0 ? 4 : 0)}%`,
                        backgroundColor: unratedData.color,
                        zIndex: 2,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-2 z-10">
                      <span className="text-xs font-medium text-white dark:text-white drop-shadow-sm">
                        {unratedData.solved}/{unratedData.attempted}
                      </span>
                    </div>
                  </>
                ) : resultFilter === 'accepted' ? (
                  <>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max((unratedData.solved / maxValue) * 100, unratedData.solved > 0 ? 4 : 0)}%`,
                        backgroundColor: '#22c55e',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-2">
                      <span className="text-xs font-medium text-green-700 dark:text-green-300">
                        {unratedData.solved} AC
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.max((unratedData.failed / maxValue) * 100, unratedData.failed > 0 ? 4 : 0)}%`,
                        backgroundColor: '#ef444480',
                      }}
                    />
                    <div className="absolute inset-0 flex items-center px-2">
                      <span className="text-xs font-medium text-red-700 dark:text-red-300">
                        {unratedData.failed} WA
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* 统计信息 */}
              <div className="text-right shrink-0 w-24">
                {resultFilter === 'all' ? (
                  <>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{unratedData.solved}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">/{unratedData.attempted}</span>
                  </>
                ) : resultFilter === 'accepted' ? (
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">{unratedData.solved}</span>
                ) : (
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">{unratedData.failed}</span>
                )}
              </div>
            </div>
          </button>
        )}
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
  const { t } = useTranslation();
  if (!selectedRange || selectedRange.min === null || selectedRange.max === null) return null;

  // 检查是否是未定分筛选
  const isUnrated = selectedRange.min === -1 && selectedRange.max === -1;
  
  if (isUnrated) {
    return (
      <div className="mb-3 flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">{t('filter.filterLabel')}: </span>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
          style={{
            backgroundColor: UNRATED_RANGE.color + '20',
            color: UNRATED_RANGE.color,
          }}
        >
          {UNRATED_RANGE.label}
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

  const range = RATING_RANGES.find(r => r.min === selectedRange.min && r.max === selectedRange.max);
  if (!range) return null;

  return (
    <div className="mb-3 flex items-center gap-2">
      <span className="text-sm text-gray-500 dark:text-gray-400">{t('filter.filterLabel')}: </span>
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

export { RATING_RANGES, UNRATED_RANGE };
