import { useTranslation } from 'react-i18next';
import type { CFUser } from '../types';
import { RankBadge, getFunTitleKey } from './RankBadge';

interface UserRankingCardProps {
  user: CFUser;
  rank: number;
  totalUsers: number;
  value: number;
  valueLabel: string;
  dimension: string;
  comparison?: {
    diff: number;
    isBetter: boolean;
  } | null;
  isPK?: boolean;
}

/**
 * 用户排名卡片组件
 */
export function UserRankingCard({
  user,
  rank,
  totalUsers,
  value,
  valueLabel,
  dimension,
  comparison,
  isPK = false,
}: UserRankingCardProps) {
  const { t } = useTranslation();
  const funTitleKey = getFunTitleKey(dimension, rank, totalUsers);
  const funTitle = t(funTitleKey);
  
  // 获取段位颜色
  const getRatingColor = (rating: number): string => {
    if (rating < 1200) return '#808080';
    if (rating < 1400) return '#008000';
    if (rating < 1600) return '#03a89e';
    if (rating < 1900) return '#0000ff';
    if (rating < 2100) return '#aa00aa';
    if (rating < 2400) return '#ff8c00';
    return '#ff0000';
  };

  const rankColor = getRatingColor(user.rating);

  // 格式化数值
  const formatValue = (val: number, dim: string): string => {
    if (dim === 'acRate') return `${val.toFixed(1)}%`;
    if (dim === 'speed') return `${val.toFixed(0)}min`;
    return val.toString();
  };

  return (
    <div
      className={`relative p-4 rounded-xl border transition-all duration-300 ${
        rank === 1
          ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-300 dark:border-yellow-700 shadow-lg'
          : rank === 2
          ? 'bg-gray-50/50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-600'
          : rank === 3
          ? 'bg-orange-50/50 dark:bg-orange-900/10 border-orange-300 dark:border-orange-700'
          : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
      } ${isPK ? 'flex-1' : 'w-full'}`}
    >
      {/* 排名标记 */}
      <div className="absolute -top-2 -left-2">
        <RankBadge rank={rank} title={funTitle} emoji="" />
      </div>

      {/* 用户头像和信息 */}
      <div className="flex items-center gap-3 mt-3 mb-4">
        <img
          src={user.avatar}
          alt={user.handle}
          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2"
          style={{ borderColor: rankColor }}
        />
        <div className="flex-1 min-w-0">
          <h3
            className="font-bold text-base sm:text-lg truncate"
            style={{ color: rankColor }}
          >
            {user.handle}
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 capitalize">
            {user.rank?.replace(/-/g, ' ') || 'unrated'} · {user.rating}
          </p>
        </div>
      </div>

      {/* 数值展示 */}
      <div className="text-center py-3 border-t border-b border-gray-100 dark:border-gray-700">
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {formatValue(value, dimension)}
        </div>
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
          {valueLabel}
        </div>
      </div>

      {/* 对比信息 */}
      {comparison && (
        <div className="mt-3 flex items-center justify-center gap-1 text-sm">
          <span
            className={`font-medium ${
              comparison.isBetter
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {comparison.isBetter ? '+' : '-'}
            {formatValue(comparison.diff, dimension)}
          </span>
          <span className="text-gray-400 dark:text-gray-500">
            {comparison.isBetter ? t('ranking.ahead') : t('ranking.behind')}
          </span>
        </div>
      )}

      {/* 进度条（占总排名比例） */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
          <span>{t('ranking.rank')}</span>
          <span>{rank} / {totalUsers}</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              rank === 1
                ? 'bg-yellow-500'
                : rank === 2
                ? 'bg-gray-400'
                : rank === 3
                ? 'bg-orange-400'
                : 'bg-blue-500'
            }`}
            style={{ width: `${((totalUsers - rank + 1) / totalUsers) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
