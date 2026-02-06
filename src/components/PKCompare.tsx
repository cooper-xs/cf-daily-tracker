import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CFUser, CFSubmission } from '../types';
import type { RankingDimension } from './RankingTab';
import { dimensions } from './RankingTab';

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

interface PKCompareProps {
  users: CFUser[];
  submissions: Map<string, CFSubmission[]>;
}

/**
 * PK 对比模式组件
 * 并排对比两个用户的所有维度
 */
export function PKCompare({ users, submissions }: PKCompareProps) {
  const { t } = useTranslation();
  const [leftUser, setLeftUser] = useState(users[0]);
  const [rightUser, setRightUser] = useState(users[1] || users[0]);

  // 计算用户统计数据
  const calculateStats = (user: CFUser): UserStats => {
    const userSubmissions = submissions.get(user.handle) || [];
    const acSubmissions = userSubmissions.filter(s => s.verdict === 'OK');
    
    // 解题数
    const solveCount = acSubmissions.length;
    
    // 通过率
    const acRate = userSubmissions.length > 0 
      ? (acSubmissions.length / userSubmissions.length) * 100 
      : 0;
    
    // 平均难度
    const ratedAC = acSubmissions.filter(s => s.problem.rating);
    const avgRating = ratedAC.length > 0
      ? ratedAC.reduce((sum, s) => sum + (s.problem.rating || 0), 0) / ratedAC.length
      : 0;
    
    // 活跃天数
    const uniqueDays = new Set(
      userSubmissions.map(s => {
        const date = new Date(s.creationTimeSeconds * 1000);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      })
    );
    const activeDays = uniqueDays.size;
    
    // 夜猫子提交（22:00-06:00）
    const nightOwl = userSubmissions.filter(s => {
      const hour = new Date(s.creationTimeSeconds * 1000).getHours();
      return hour >= 22 || hour < 6;
    }).length;
    
    // 平均解题速度（简化计算：使用 submission id 差值估算）
    const speed = calculateAvgSpeed(userSubmissions);
    
    // 总分
    const totalScore = ratedAC.reduce((sum, s) => sum + (s.problem.rating || 0), 0);

    return {
      user,
      solveCount,
      acRate,
      avgRating,
      activeDays,
      nightOwl,
      speed,
      totalScore,
    };
  };

  // 计算平均解题速度（分钟）
  const calculateAvgSpeed = (subs: CFSubmission[]): number => {
    const acSubs = subs.filter(s => s.verdict === 'OK').sort(
      (a, b) => a.creationTimeSeconds - b.creationTimeSeconds
    );
    
    if (acSubs.length < 2) return 0;
    
    let totalTime = 0;
    let count = 0;
    
    for (let i = 1; i < acSubs.length; i++) {
      const diff = (acSubs[i].creationTimeSeconds - acSubs[i-1].creationTimeSeconds) / 60;
      if (diff > 0 && diff < 120) { // 过滤掉异常值（超过2小时的不算）
        totalTime += diff;
        count++;
      }
    }
    
    return count > 0 ? totalTime / count : 0;
  };

  const leftStats = calculateStats(leftUser);
  const rightStats = calculateStats(rightUser);

  const dimensionKeys: RankingDimension[] = [
    'solveCount', 'totalScore', 'acRate', 'avgRating', 
    'activeDays', 'nightOwl', 'speed'
  ];

  const getValue = (stats: UserStats, dim: RankingDimension): number => {
    return stats[dim];
  };

  return (
    <div className="space-y-4">
      {/* 用户选择器 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between gap-4">
          {/* 左侧用户选择 */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('ranking.challenger')}
            </label>
            <select
              value={leftUser.handle}
              onChange={(e) => {
                const user = users.find(u => u.handle === e.target.value);
                if (user) setLeftUser(user);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              {users.map(u => (
                <option key={u.handle} value={u.handle}>{u.handle} ({u.rank})</option>
              ))}
            </select>
          </div>

          {/* VS 标识 */}
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold text-red-500">{t('ranking.vs')}</span>
          </div>

          {/* 右侧用户选择 */}
          <div className="flex-1">
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              {t('ranking.opponent')}
            </label>
            <select
              value={rightUser.handle}
              onChange={(e) => {
                const user = users.find(u => u.handle === e.target.value);
                if (user) setRightUser(user);
              }}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            >
              {users.map(u => (
                <option key={u.handle} value={u.handle}>{u.handle} ({u.rank})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 对比表格 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20">
          <h3 className="font-bold text-gray-900 dark:text-white text-center">
            🏆 {t('ranking.pkTitle')}
          </h3>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {dimensionKeys.map((dim) => {
            const leftValue = getValue(leftStats, dim);
            const rightValue = getValue(rightStats, dim);
            const leftWin = leftValue > rightValue;
            const equal = Math.abs(leftValue - rightValue) < 0.01;
            const dimInfo = dimensions.find(d => d.key === dim);

            const formatValue = (val: number): string => {
              if (dim === 'acRate') return `${val.toFixed(1)}%`;
              if (dim === 'speed') return `${val.toFixed(0)}min`;
              if (dim === 'avgRating') return `${val.toFixed(0)}`;
              return val.toString();
            };

            return (
              <div key={dim} className="flex items-center px-4 py-3">
                {/* 左侧数值 */}
                <div className={`flex-1 text-right ${leftWin ? 'font-bold' : ''}`}>
                  <span className={`text-sm ${leftWin ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {formatValue(leftValue)}
                    {leftWin && ' 👑'}
                  </span>
                </div>

                {/* 维度名称 */}
                <div className="w-24 sm:w-32 text-center px-2">
                  <div className="flex flex-col items-center">
                    <span className="text-lg">{dimInfo?.emoji}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {t(`ranking.titles.${dim}`)}
                    </span>
                  </div>
                </div>

                {/* 右侧数值 */}
                <div className={`flex-1 text-left ${!leftWin && !equal ? 'font-bold' : ''}`}>
                  <span className={`text-sm ${!leftWin && !equal ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                    {!leftWin && !equal && '👑 '}
                    {formatValue(rightValue)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 总结 */}
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
          {(() => {
            let leftWins = 0;
            let rightWins = 0;
            dimensionKeys.forEach(dim => {
              const leftVal = getValue(leftStats, dim);
              const rightVal = getValue(rightStats, dim);
              if (leftVal > rightVal) leftWins++;
              else if (rightVal > leftVal) rightWins++;
            });

            const winner = leftWins > rightWins ? leftUser.handle : rightWins > leftWins ? rightUser.handle : null;

            return (
              <p className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t('ranking.result')}：{leftUser.handle} {leftWins} : {rightWins} {rightUser.handle}
                </span>
                {winner && (
                  <span className="ml-2 font-bold text-yellow-600 dark:text-yellow-400">
                    🎉 {winner} {t('ranking.wins')}
                  </span>
                )}
                {!winner && (
                  <span className="ml-2 font-bold text-blue-600 dark:text-blue-400">
                    🤝 {t('ranking.tie')}
                  </span>
                )}
              </p>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
