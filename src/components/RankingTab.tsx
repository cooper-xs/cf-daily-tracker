import { useTranslation } from 'react-i18next';

export type RankingDimension = 
  | 'solveCount' 
  | 'acRate' 
  | 'avgRating' 
  | 'activeDays' 
  | 'nightOwl' 
  | 'speed' 
  | 'totalScore';

interface DimensionConfig {
  key: RankingDimension;
  emoji: string;
}

interface RankingTabProps {
  activeDimension: RankingDimension;
  onChange: (dimension: RankingDimension) => void;
  userCount: number;
}

const dimensions: DimensionConfig[] = [
  { key: 'solveCount', emoji: '📝' },
  { key: 'totalScore', emoji: '💎' },
  { key: 'acRate', emoji: '⚡' },
  { key: 'avgRating', emoji: '🎯' },
  { key: 'activeDays', emoji: '🔥' },
  { key: 'nightOwl', emoji: '🦉' },
  { key: 'speed', emoji: '🚀' },
];

/**
 * 排名维度切换 Tab
 */
export function RankingTab({ activeDimension, onChange, userCount }: RankingTabProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* 标题栏 */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">👑</span>
            <h2 className="font-bold text-gray-900 dark:text-white">
              {t('ranking.title')}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              ({t('ranking.peopleCount', { count: userCount })})
            </span>
          </div>
        </div>
      </div>

      {/* 维度切换 Tab */}
      <div className="p-2 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 min-w-max">
          {dimensions.map((dim) => (
            <button
              key={dim.key}
              onClick={() => onChange(dim.key)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all min-w-[64px] ${
                activeDimension === dim.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="text-lg">{dim.emoji}</span>
              <span>{t(`ranking.titles.${dim.key}`)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 当前维度说明 */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          {t('ranking.currentDimension')}：
          <span className="font-medium text-blue-600 dark:text-blue-400 ml-1">
            {t(`ranking.dimensions.${activeDimension}`)}
          </span>
        </p>
      </div>
    </div>
  );
}

export { dimensions };
