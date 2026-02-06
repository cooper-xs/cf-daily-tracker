interface RankBadgeProps {
  rank: number;
  title: string;
  emoji: string;
}

/**
 * 排名徽章组件
 * 根据名次显示不同样式
 */
export function RankBadge({ rank, title, emoji }: RankBadgeProps) {
  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700';
      case 2:
        return 'bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600';
      case 3:
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700';
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800';
    }
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return `${rank}.`;
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getRankStyle(rank)}`}
    >
      <span>{getRankEmoji(rank)}</span>
      <span className="hidden sm:inline">{emoji}</span>
      <span className="truncate max-w-[80px] sm:max-w-[100px]">{title}</span>
    </div>
  );
}

/**
 * 获取趣味头衔 key
 */
export function getFunTitleKey(dimension: string, rank: number, total: number): string {
  // 根据排名占总人数的比例选择头衔
  const ratio = rank / total;
  let level: string;
  if (ratio <= 0.15) level = '1';
  else if (ratio <= 0.35) level = '2';
  else if (ratio <= 0.6) level = '3';
  else level = '4';
  
  return `ranking.funTitles.${dimension}_${level}`;
}
