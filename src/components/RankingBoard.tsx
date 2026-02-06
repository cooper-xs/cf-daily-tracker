import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CFUser, CFSubmission } from '../types';
import { RankingTab, type RankingDimension } from './RankingTab';
import { PKCompare } from './PKCompare';

interface UserStats {
  user: CFUser;
  solveCount: number;
  acRate: number;
  avgRating: number;
  activeDays: number;
  nightOwl: number;
  speed: number;
  totalScore: number;
}

interface RankingBoardProps {
  users: CFUser[];
  submissions: Map<string, CFSubmission[]>;
  activeDimension: RankingDimension;
  onDimensionChange: (dimension: RankingDimension) => void;
}

/**
 * 排名主面板组件 - 支持折叠
 */
export function RankingBoard({
  users,
  submissions,
  activeDimension,
  onDimensionChange,
}: RankingBoardProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  // 计算所有用户的统计数据
  const userStats = useMemo(() => {
    return users.map((user) => {
      const userSubmissions = submissions.get(user.handle) || [];
      const acSubmissions = userSubmissions.filter((s) => s.verdict === 'OK');

      const solveCount = acSubmissions.length;
      const acRate = userSubmissions.length > 0 ? (acSubmissions.length / userSubmissions.length) * 100 : 0;
      const ratedAC = acSubmissions.filter((s) => s.problem.rating);
      const avgRating = ratedAC.length > 0 ? ratedAC.reduce((sum, s) => sum + (s.problem.rating || 0), 0) / ratedAC.length : 0;
      
      const uniqueDays = new Set(userSubmissions.map((s) => {
        const date = new Date(s.creationTimeSeconds * 1000);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      }));
      const activeDays = uniqueDays.size;
      
      const nightOwl = userSubmissions.filter((s) => {
        const hour = new Date(s.creationTimeSeconds * 1000).getHours();
        return hour >= 22 || hour < 6;
      }).length;
      
      const speed = calculateAvgSpeed(userSubmissions);
      const totalScore = ratedAC.reduce((sum, s) => sum + (s.problem.rating || 0), 0);

      return { user, solveCount, acRate, avgRating, activeDays, nightOwl, speed, totalScore };
    });
  }, [users, submissions]);

  const sortedStats = useMemo(() => {
    return [...userStats].sort((a, b) => b[activeDimension] - a[activeDimension]);
  }, [userStats, activeDimension]);

  // 计算榜首
  const topUser = sortedStats[0];
  const topDimensionValue = topUser?.[activeDimension] || 0;

  if (!isExpanded) {
    // 折叠状态 - 显示简洁的入口
    return (
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => setIsExpanded(true)}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/50 dark:hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">👑</span>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                {t('ranking.title')} ({users.length}{t('ranking.peopleCount', { count: users.length }).replace(/\d+/, '')})
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {topUser && (
                  <>
                    🥇 {topUser.user.handle} · {Math.round(topDimensionValue)} {t(`ranking.dimensions.${activeDimension}`)}
                  </>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-blue-600 dark:text-blue-400">{t('common.expand') || '展开'}</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* 折叠按钮 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsExpanded(false)}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {t('common.collapse') || '收起'}
        </button>
      </div>

      {/* 维度切换 Tab */}
      <RankingTab
        activeDimension={activeDimension}
        onChange={onDimensionChange}
        userCount={users.length}
      />

      {/* PK 模式 */}
      {users.length >= 2 && (
        <PKCompare users={users} submissions={submissions} />
      )}

      {/* 排行榜 - 紧凑模式 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
          <span className="font-bold text-gray-900 dark:text-white text-sm">📊 {t('ranking.leaderboard')}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{t('ranking.sortBy', { dimension: t(`ranking.dimensions.${activeDimension}`) })}</span>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {sortedStats.map((stats, index) => (
            <CompactRankingRow
              key={stats.user.handle}
              stats={stats}
              rank={index + 1}
              totalUsers={sortedStats.length}
              activeDimension={activeDimension}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 紧凑排名行组件
 */
function CompactRankingRow({
  stats,
  rank,
  activeDimension,
}: {
  stats: UserStats;
  rank: number;
  totalUsers: number;
  activeDimension: RankingDimension;
}) {
  const { t } = useTranslation();
  const { user } = stats;
  const value = stats[activeDimension];

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

  const formatValue = (val: number): string => {
    if (activeDimension === 'acRate') return `${val.toFixed(1)}%`;
    if (activeDimension === 'speed') return `${val.toFixed(0)}min`;
    return Math.round(val).toString();
  };

  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
      rank === 1 ? 'bg-yellow-50/30 dark:bg-yellow-900/5' : ''
    }`}>
      {/* 排名 */}
      <div className={`text-lg font-bold w-8 text-center ${
        rank <= 3 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'
      }`}>
        {rankEmoji}
      </div>

      {/* 头像 */}
      <img
        src={user.avatar}
        alt={user.handle}
        className="w-10 h-10 rounded-full border-2 flex-shrink-0"
        style={{ borderColor: rankColor }}
      />

      {/* 用户信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate" style={{ color: rankColor }}>{user.handle}</span>
          <span className="text-xs text-gray-400 dark:text-gray-500">{user.rating}</span>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {user.rank?.replace(/-/g, ' ') || 'unrated'}
        </div>
      </div>

      {/* 数值 */}
      <div className="text-right">
        <div className="font-bold text-gray-900 dark:text-white">{formatValue(value)}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500">{t(`ranking.dimensions.${activeDimension}`)}</div>
      </div>
    </div>
  );
}

function calculateAvgSpeed(submissions: CFSubmission[]): number {
  const acSubs = submissions.filter((s) => s.verdict === 'OK').sort((a, b) => a.creationTimeSeconds - b.creationTimeSeconds);
  if (acSubs.length < 2) return 0;

  let totalTime = 0;
  let count = 0;
  for (let i = 1; i < acSubs.length; i++) {
    const diff = (acSubs[i].creationTimeSeconds - acSubs[i - 1].creationTimeSeconds) / 60;
    if (diff > 0 && diff < 120) {
      totalTime += diff;
      count++;
    }
  }
  return count > 0 ? totalTime / count : 0;
}

export type { RankingDimension };
