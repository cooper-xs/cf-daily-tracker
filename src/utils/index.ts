/**
 * 工具函数
 */

/**
 * 格式化时间戳为本地时间字符串
 */
export function formatTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  return date.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 解析用户输入，提取用户名列表
 * @param input 用户输入（逗号、空格或换行分隔）
 * @param maxCount 最大数量限制
 * @returns 用户名列表
 */
export function parseHandles(input: string, maxCount = 10): string[] {
  return input
    .split(/[,，\s\n]+/)
    .map(h => h.trim())
    .filter(h => h.length > 0)
    .slice(0, maxCount);
}

/**
 * 获取题目链接
 */
export function getProblemUrl(contestId: number | undefined, index: string): string {
  if (!contestId) return '#';
  return `https://codeforces.com/contest/${contestId}/problem/${index}`;
}

/**
 * 获取提交链接
 */
export function getSubmissionUrl(contestId: number | undefined, submissionId: number): string {
  if (!contestId) return '#';
  return `https://codeforces.com/contest/${contestId}/submission/${submissionId}`;
}

/**
 * 获取用户主页链接
 */
export function getUserUrl(handle: string): string {
  return `https://codeforces.com/profile/${encodeURIComponent(handle)}`;
}

/**
 * 获取难度颜色
 */
export function getDifficultyColor(rating: number | undefined): string {
  if (rating === undefined || rating === null) return '#808080';
  if (rating < 1200) return '#808080'; // Newbie
  if (rating < 1400) return '#008000'; // Pupil
  if (rating < 1600) return '#03a89e'; // Specialist
  if (rating < 1900) return '#0000ff'; // Expert
  if (rating < 2100) return '#aa00aa'; // Candidate Master
  if (rating < 2300) return '#ff8c00'; // Master
  if (rating < 2400) return '#ff8c00'; // International Master
  if (rating < 2600) return '#ff0000'; // Grandmaster
  if (rating < 3000) return '#ff0000'; // International Grandmaster
  return '#ff0000'; // Legendary Grandmaster
}

/**
 * 获取难度标签
 */
export function getDifficultyLabel(rating: number | undefined): string {
  if (rating === undefined || rating === null) return 'Unrated';
  if (rating < 1200) return 'Newbie';
  if (rating < 1400) return 'Pupil';
  if (rating < 1600) return 'Specialist';
  if (rating < 1900) return 'Expert';
  if (rating < 2100) return 'Candidate Master';
  if (rating < 2300) return 'Master';
  if (rating < 2400) return 'International Master';
  if (rating < 2600) return 'Grandmaster';
  if (rating < 3000) return 'International Grandmaster';
  return 'Legendary Grandmaster';
}

/**
 * 本地存储键名
 */
const STORAGE_KEYS = {
  SEARCH_HISTORY: 'cf_tracker_search_history',
};

/**
 * 获取搜索历史
 */
export function getSearchHistory(): string[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * 添加搜索历史
 */
export function addSearchHistory(handles: string[]): void {
  try {
    const history = getSearchHistory();
    const newHistory = [...new Set([...handles, ...history])].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(newHistory));
  } catch {
    // 忽略存储错误
  }
}

/**
 * 清除搜索历史
 */
export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY);
  } catch {
    // 忽略存储错误
  }
}
