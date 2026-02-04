import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CFSubmission } from '../types';
import { getSubmissionUrl, formatTime, getDifficultyColor } from '../utils';
import { VerdictMap } from '../types';

interface SubmissionListProps {
  submissions: CFSubmission[];
}

type FilterType = 'all' | 'accepted' | 'rejected';

/**
 * 提交记录列表组件
 * 支持按结果筛选：全部、通过、未通过
 */
export function SubmissionList({ submissions }: SubmissionListProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<FilterType>('all');

  // 筛选提交记录
  const filteredSubmissions = submissions.filter((sub) => {
    if (filter === 'all') return true;
    if (filter === 'accepted') return sub.verdict === 'OK';
    if (filter === 'rejected') return sub.verdict !== 'OK';
    return true;
  });

  // 统计数据
  const acceptedCount = submissions.filter((s) => s.verdict === 'OK').length;
  const rejectedCount = submissions.filter((s) => s.verdict !== 'OK').length;

  const filterOptions: { key: FilterType; label: string; count: number }[] = [
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
      {/* 筛选选项卡 */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
        {filterOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => setFilter(option.key)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all
                       ${filter === option.key
                         ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                         : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                       }`}
          >
            <span>{option.label}</span>
            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full
                             ${filter === option.key
                               ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                               : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400'
                             }`}
            >
              {option.count}
            </span>
          </button>
        ))}
      </div>

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
          {problem.rating && (
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
