import { useTranslation } from 'react-i18next';
import type { CFSubmission } from '../types';
import { VerdictMap } from '../types';
import { getSubmissionUrl, formatTime, getDifficultyColor } from '../utils';

interface SubmissionListProps {
  submissions: CFSubmission[];
}

/**
 * 提交记录列表组件
 */
export function SubmissionList({ submissions }: SubmissionListProps) {
  const { t } = useTranslation();

  if (submissions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        {t('submission.noSubmissions')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {submissions.map((sub) => (
        <SubmissionItem key={sub.id} submission={sub} />
      ))}
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
