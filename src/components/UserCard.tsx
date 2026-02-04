import { useTranslation } from 'react-i18next';
import type { CFUser } from '../types';
import { RankColors, getUserUrl } from '../utils';

interface UserCardProps {
  user: CFUser;
  submissionCount: number;
}

/**
 * 用户信息卡片组件
 */
export function UserCard({ user, submissionCount }: UserCardProps) {
  const { t } = useTranslation();
  const rankColor = RankColors[user.rank] || '#808080';

  return (
    &lt;div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 transition-colors"&gt;
      &lt;div className="flex items-center gap-4"&gt;
        &lt;img
          src={user.avatar}
          alt={user.handle}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: rankColor }}
        /&gt;
        &lt;div className="flex-1 min-w-0"&gt;
          &lt;a
            href={getUserUrl(user.handle)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold truncate hover:underline"
            style={{ color: rankColor }}
          &gt;
            {user.handle}
          &lt;/a&gt;
          &lt;p className="text-sm text-gray-500 dark:text-gray-400 capitalize"&gt;
            {user.rank.replace(/-/g, ' ')}
          &lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;

      &lt;div className="mt-3 grid grid-cols-3 gap-2 text-center"&gt;
        &lt;div className="p-2 rounded bg-gray-50 dark:bg-gray-700"&gt;
          &lt;p className="text-xs text-gray-500 dark:text-gray-400"&gt;{t('user.rating')}&lt;/p&gt;
          &lt;p className="text-lg font-bold" style={{ color: rankColor }}&gt;{user.rating}&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="p-2 rounded bg-gray-50 dark:bg-gray-700"&gt;
          &lt;p className="text-xs text-gray-500 dark:text-gray-400"&gt;{t('user.maxRating')}&lt;/p&gt;
          &lt;p className="text-lg font-bold text-gray-700 dark:text-gray-300"&gt;{user.maxRating}&lt;/p&gt;
        &lt;/div&gt;
        &lt;div className="p-2 rounded bg-gray-50 dark:bg-gray-700"&gt;
          &lt;p className="text-xs text-gray-500 dark:text-gray-400"&gt;{t('common.today')}&lt;/p&gt;
          &lt;p className={`text-lg font-bold ${submissionCount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}&gt;
            {submissionCount}
          &lt;/p&gt;
        &lt;/div&gt;
      &lt;/div&gt;
    &lt;/div&gt;
  );
}
