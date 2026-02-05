import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CFSubmission } from '../types';
import { getSubmissionUrl, formatTime, getDifficultyColor } from '../utils';
import { VerdictMap } from '../types';
import { RatingDistribution, RatingFilterTags } from './RatingDistribution';

interface SubmissionListProps {
  submissions: CFSubmission[];
  resultFilter?: 'all' | 'accepted' | 'rejected';
  ratingRange?: { min: number | null; max: number | null } | null;
  onResultFilterChange?: (filter: 'all' | 'accepted' | 'rejected') => void;
  onRatingRangeChange?: (range: { min: number | null; max: number | null } | null) => void;
  hideFilterPanel?: boolean; // 是否隐藏筛选面板（用于固定面板场景）
}

type ResultFilterType = 'all' | 'accepted' | 'rejected';

/**
 * 提交记录筛选面板组件
 * 可独立使用，支持固定在顶部
 */
export function SubmissionFilterPanel({ 
  submissions,
  resultFilter: externalResultFilter,
  ratingRange: externalRatingRange,
  onResultFilterChange,
  onRatingRangeChange,
}: SubmissionListProps) {
  const { t } = useTranslation();
  
  // 内部状态（如果没有外部控制）
  const [internalResultFilter, setInternalResultFilter] = useState<ResultFilterType>('all');
  const [internalRatingRange, setInternalRatingRange] = useState<{ min: number | null; max: number | null } | null>(null);
  
  // 使用外部或内部状态
  const resultFilter = externalResultFilter ?? internalResultFilter;
  const ratingRange = externalRatingRange ?? internalRatingRange;
  
  const setResultFilter = (filter: ResultFilterType) => {
    if (onResultFilterChange) {
      onResultFilterChange(filter);
    } else {
      setInternalResultFilter(filter);
    }
  };
  
  const setRatingRange = (range: { min: number | null; max: number | null } | null) => {
    if (onRatingRangeChange) {
      onRatingRangeChange(range);
    } else {
      setInternalRatingRange(range);
    }
  };

  // 统计数据
  const acceptedCount = submissions.filter((s) => s.verdict === 'OK').length;
  const rejectedCount = submissions.filter((s) => s.verdict !== 'OK').length;

  const resultFilterOptions: { key: ResultFilterType; label: string; count: number }[] = [
    { key: 'all', label: t('filter.all'), count: submissions.length },
    { key: 'accepted', label: t('filter.accepted'), count: acceptedCount },
    { key: 'rejected', label: t('filter.rejected'), count: rejectedCount },
  ];

  // 计算筛选后的数量
  const filteredCount = useMemo(() => {
    return submissions.filter((sub) => {
      if (resultFilter === 'accepted' && sub.verdict !== 'OK') return false;
      if (resultFilter === 'rejected' && sub.verdict === 'OK') return false;
      if (ratingRange && ratingRange.min !== null && ratingRange.max !== null) {
        const rating = sub.problem.rating;
        if (rating === undefined || rating === null || rating < ratingRange.min || rating > ratingRange.max) return false;
      }
      return true;
    }).length;
  }, [submissions, resultFilter, ratingRange]);

  if (submissions.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Rating 分布统计 */}
      <RatingDistribution 
        submissions={submissions} 
        filteredCount={filteredCount}
        onRatingRangeSelect={(min, max) => setRatingRange(min !== null ? { min, max } : null)}
        selectedRange={ratingRange}
        resultFilter={resultFilter}
      />

      {/* Rating 筛选标签 */}
      <RatingFilterTags 
        selectedRange={ratingRange} 
        onClear={() => setRatingRange(null)} 
      />

      {/* 结果筛选选项卡 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {resultFilterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setResultFilter(option.key)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                       ${resultFilter === option.key
                         ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                         : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                       }`}
          >
            <span>{option.label}</span>
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                             ${resultFilter === option.key
                               ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                               : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                             }`}
            >
              {option.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * 提交记录列表组件
 * 支持按结果和 Rating 筛选
 */
export function SubmissionList({ 
  submissions,
  resultFilter: externalResultFilter,
  ratingRange: externalRatingRange,
  onResultFilterChange,
  onRatingRangeChange,
  hideFilterPanel = false,
}: SubmissionListProps) {
  const { t } = useTranslation();
  
  // 内部状态（如果没有外部控制）
  const [internalResultFilter, setInternalResultFilter] = useState<ResultFilterType>('all');
  const [internalRatingRange, setInternalRatingRange] = useState<{ min: number | null; max: number | null } | null>(null);
  
  // 使用外部或内部状态
  const resultFilter = externalResultFilter ?? internalResultFilter;
  const ratingRange = externalRatingRange ?? internalRatingRange;
  
  const setResultFilter = (filter: ResultFilterType) => {
    if (onResultFilterChange) {
      onResultFilterChange(filter);
    } else {
      setInternalResultFilter(filter);
    }
  };
  
  const setRatingRange = (range: { min: number | null; max: number | null } | null) => {
    if (onRatingRangeChange) {
      onRatingRangeChange(range);
    } else {
      setInternalRatingRange(range);
    }
  };

  // 筛选提交记录
  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      // 结果筛选
      if (resultFilter === 'accepted' && sub.verdict !== 'OK') return false;
      if (resultFilter === 'rejected' && sub.verdict === 'OK') return false;
      
      // Rating 筛选
      if (ratingRange && ratingRange.min !== null && ratingRange.max !== null) {
        const rating = sub.problem.rating;
        if (rating === undefined || rating === null || rating < ratingRange.min || rating > ratingRange.max) return false;
      }
      
      return true;
    });
  }, [submissions, resultFilter, ratingRange]);

  // 统计数据
  const acceptedCount = submissions.filter((s) => s.verdict === 'OK').length;
  const rejectedCount = submissions.filter((s) => s.verdict !== 'OK').length;

  const resultFilterOptions: { key: ResultFilterType; label: string; count: number }[] = [
    { key: 'all', label: t('filter.all'), count: submissions.length },
    { key: 'accepted', label: t('filter.accepted'), count: acceptedCount },
    { key: 'rejected', label: t('filter.rejected'), count: rejectedCount },
  ];

  if (submissions.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        {t('submission.noSubmissions')}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 筛选面板 */}
      {!hideFilterPanel && (
        <>
          {/* Rating 分布统计 */}
          <RatingDistribution 
            submissions={submissions} 
            filteredCount={filteredSubmissions.length}
            onRatingRangeSelect={(min, max) => setRatingRange(min !== null ? { min, max } : null)}
            selectedRange={ratingRange}
            resultFilter={resultFilter}
          />

          {/* Rating 筛选标签 */}
          <RatingFilterTags 
            selectedRange={ratingRange} 
            onClear={() => setRatingRange(null)} 
          />

          {/* 结果筛选选项卡 */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {resultFilterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => setResultFilter(option.key)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                           ${resultFilter === option.key
                             ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                             : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                           }`}
              >
                <span>{option.label}</span>
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                                 ${resultFilter === option.key
                                   ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                                   : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                                 }`}
                >
                  {option.count}
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* 提交记录列表 */}
      <div className="space-y-2">
        {filteredSubmissions.length > 0 ? (
          filteredSubmissions.map((sub) => (
            <SubmissionItem key={sub.id} submission={sub} />
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            {t('filter.noResults')}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 单个提交记录项
 */
function SubmissionItem({ submission }: { submission: CFSubmission }) {
  const { t } = useTranslation();
  const { problem, verdict, creationTimeSeconds, id, contestId } = submission;
  
  const isAccepted = verdict === 'OK';
  const verdictKey = verdict ? VerdictMap[verdict] || 'rejected' : 'testing';
  const difficultyColor = getDifficultyColor(problem.rating);

  return (
    <a
      href={getSubmissionUrl(contestId, id)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750
                 transition-colors group"
    >
      <div
        className={`w-3 h-3 rounded-full shrink-0 ${
          isAccepted
            ? 'bg-green-500'
            : verdict === 'TESTING'
            ? 'bg-yellow-500 animate-pulse'
            : 'bg-red-500'
        }`}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {problem.contestId && `${problem.contestId}${problem.index} - `}
            {problem.name}
          </span>
          {problem.rating !== undefined && problem.rating !== null && (
            <span
              className="px-1.5 py-0.5 text-xs rounded font-medium shrink-0"
              style={{
                backgroundColor: `${difficultyColor}20`,
                color: difficultyColor,
              }}
            >
              {problem.rating}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
          <span className={isAccepted ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
            {t(`submission.${verdictKey}`)}
          </span>
          <span>•</span>
          <span>{formatTime(creationTimeSeconds)}</span>
          <span>•</span>
          <span className="truncate">{submission.programmingLanguage}</span>
        </div>
      </div>
    </a>
  );
}
