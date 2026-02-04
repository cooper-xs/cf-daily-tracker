import { useTranslation } from 'react-i18next';
import type { CFSubmission } from '../types';
import { VerdictMap, getProblemUrl, getSubmissionUrl, formatTime, getDifficultyColor } from '../utils';

interface SubmissionListProps {
  handle: string;
  submissions: CFSubmission[];
}

/**
 * 提交记录列表组件
 */
export function SubmissionList({ handle, submissions }: SubmissionListProps) {
  const { t } = useTranslation();

  if (submissions.length === 0) {
    return (
      &lt;div className="p-4 text-center text-gray-500 dark:text-gray-400"&gt;
        {t('submission.noSubmissions')}
      &lt;/div&gt;
    );
  }

  return (
    &lt;div className="space-y-2"&gt;
      {submissions.map((sub) => (
        &lt;SubmissionItem key={sub.id} submission={sub} /&gt;
      ))}
    &lt;/div&gt;
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
    &lt;a
      href={getSubmissionUrl(contestId, id)}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700
                 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750
                 transition-colors group"
    &gt;
      {/* 状态指示器 */}
      &lt;div
        className={`w-3 h-3 rounded-full shrink-0 ${
          isAccepted
            ? 'bg-green-500'
            : verdict === 'TESTING'
            ? 'bg-yellow-500 animate-pulse'
            : 'bg-red-500'
        }`}
      /&gt;

      {/* 题目信息 */}
      &lt;div className="flex-1 min-w-0"&gt;
        &lt;div className="flex items-center gap-2"&gt;
          &lt;span className="font-medium truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"&gt;
            {problem.contestId && `${problem.contestId}${problem.index} - `}
            {problem.name}
          &lt;/span&gt;
          {problem.rating && (
            &lt;span
              className="px-1.5 py-0.5 text-xs rounded font-medium shrink-0"
              style={{
                backgroundColor: `${difficultyColor}20`,
                color: difficultyColor,
              }}
            &gt;
              {problem.rating}
            &lt;/span&gt;
          )}
        &lt;/div&gt;
        &lt;div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400"&gt;
          &lt;span className={isAccepted ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}&gt;
            {t(`submission.${verdictKey}`)}
          &lt;/span&gt;
          &lt;span&gt;•&lt;/span&gt;
          &lt;span&gt;{formatTime(creationTimeSeconds)}&lt;/span&gt;
          &lt;span&gt;•&lt;/span&gt;
          &lt;span className="truncate"&gt;{submission.programmingLanguage}&lt;/span&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/a&gt;
  );
}
