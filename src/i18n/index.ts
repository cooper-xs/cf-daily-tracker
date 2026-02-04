import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 中文翻译
const zhCN = {
  common: {
    appName: 'CF 今日打卡',
    search: '查询',
    loading: '加载中...',
    error: '错误',
    retry: '重试',
    noData: '暂无数据',
    today: '今日',
    yesterday: '昨日',
  },
  user: {
    title: '用户查询',
    placeholder: '输入 Codeforces 用户名（多个用逗号分隔）',
    inputHint: '支持批量查询，最多 10 个用户',
    rating: 'Rating',
    rank: '段位',
    maxRating: '最高 Rating',
  },
  submission: {
    title: '今日提交记录',
    problem: '题目',
    verdict: '结果',
    time: '提交时间',
    language: '语言',
    accepted: '通过',
    rejected: '未通过',
    wrongAnswer: '答案错误',
    timeLimit: '超时',
    memoryLimit: '超内存',
    runtimeError: '运行错误',
    compilationError: '编译错误',
    noSubmissions: '今日暂无提交记录',
  },
  problem: {
    difficulty: '难度',
    tags: '标签',
    rating: '分数',
  },
  errors: {
    apiLimit: '请求过于频繁，请稍后再试',
    userNotFound: '用户不存在',
    networkError: '网络错误',
    unknownError: '未知错误',
  },
};

// 英文翻译
const enUS = {
  common: {
    appName: 'CF Daily Tracker',
    search: 'Search',
    loading: 'Loading...',
    error: 'Error',
    retry: 'Retry',
    noData: 'No data',
    today: 'Today',
    yesterday: 'Yesterday',
  },
  user: {
    title: 'User Search',
    placeholder: 'Enter Codeforces handle(s), comma separated',
    inputHint: 'Supports batch search, max 10 users',
    rating: 'Rating',
    rank: 'Rank',
    maxRating: 'Max Rating',
  },
  submission: {
    title: "Today's Submissions",
    problem: 'Problem',
    verdict: 'Verdict',
    time: 'Time',
    language: 'Language',
    accepted: 'Accepted',
    rejected: 'Rejected',
    wrongAnswer: 'Wrong Answer',
    timeLimit: 'Time Limit Exceeded',
    memoryLimit: 'Memory Limit Exceeded',
    runtimeError: 'Runtime Error',
    compilationError: 'Compilation Error',
    noSubmissions: 'No submissions today',
  },
  problem: {
    difficulty: 'Difficulty',
    tags: 'Tags',
    rating: 'Rating',
  },
  errors: {
    apiLimit: 'Too many requests, please try again later',
    userNotFound: 'User not found',
    networkError: 'Network error',
    unknownError: 'Unknown error',
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      'zh': { translation: zhCN },
      'en': { translation: enUS },
      'en-US': { translation: enUS },
    },
    fallbackLng: 'zh-CN',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
