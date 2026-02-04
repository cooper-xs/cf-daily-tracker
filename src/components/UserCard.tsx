import { useTranslation } from 'react-i18next';
import type { CFUser } from '../types';
import { getUserUrl } from '../utils';
import { RankColors } from '../types';

interface UserCardProps {
  user: CFUser;
  submissionCount: number;
  startDate: string;
  endDate: string;
}

/**
 * 获取 UTC+8 今日日期字符串
 */
function getTodayString(): string {
  const now = new Date();
  const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8Time.toISOString().split('T')[0];
}

/**
 * 用户信息卡片组件
 */
export function UserCard({ user, submissionCount, startDate, endDate }: UserCardProps) {
  const { t } = useTranslation();
  const rankColor = RankColors[user.rank] || '#808080';

  // 判断是否今日
  const today = getTodayString();
  const isToday = startDate === today && endDate === today;
  
  // 日期范围标签
  const dateLabel = isToday 
    ? t('common.today') 
    : startDate === endDate 
      ? startDate 
      : `${startDate}~${endDate}`;

  return (
    <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-800 transition-colors">
      <div className="flex items-center gap-4">
        <img
          src={user.avatar}
          alt={user.handle}
          className="w-12 h-12 rounded-full border-2"
          style={{ borderColor: rankColor }}
        />
        <div className="flex-1 min-w-0">
          <a
            href={getUserUrl(user.handle)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold truncate hover:underline"
            style={{ color: rankColor }}
          >
            {user.handle}
          </a>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
            {user.rank.replace(/-/g, ' ')}
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="p-2 rounded bg-gray-50 dark:bg-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('user.rating')}</p>
          <p className="text-lg font-bold" style={{ color: rankColor }}>{user.rating}</p>
        </div>
        <div className="p-2 rounded bg-gray-50 dark:bg-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">{t('user.maxRating')}</p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-300">{user.maxRating}</p>
        </div>
        <div className="p-2 rounded bg-gray-50 dark:bg-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={dateLabel}>{dateLabel}</p>
          <p className={`text-lg font-bold ${submissionCount > 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`}>
            {submissionCount}
          </p>
        </div>
      </div>
    </div>
  );
}
