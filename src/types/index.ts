/**
 * Codeforces API 类型定义
 */

// 用户信息
export interface CFUser {
  handle: string;
  email?: string;
  vkId?: string;
  openId?: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  city?: string;
  organization?: string;
  contribution: number;
  rank: string;
  rating: number;
  maxRank: string;
  maxRating: number;
  lastOnlineTimeSeconds: number;
  registrationTimeSeconds: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

// 题目信息
export interface CFProblem {
  contestId?: number;
  problemsetName?: string;
  index: string;
  name: string;
  type: string;
  points?: number;
  rating?: number;
  tags: string[];
}

// 提交记录
export interface CFSubmission {
  id: number;
  contestId?: number;
  creationTimeSeconds: number;
  relativeTimeSeconds: number;
  problem: CFProblem;
  author: {
    contestId?: number;
    members: { handle: string; name?: string }[];
    participantType: string;
    ghost?: boolean;
    room?: number;
    startTimeSeconds?: number;
  };
  programmingLanguage: string;
  verdict?: 'OK' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'PRESENTATION_ERROR' | 'IDLENESS_LIMIT_EXCEEDED' | 'SECURITY_VIOLATED' | 'CRASHED' | 'INPUT_PREPARATION_CRASHED' | 'CHALLENGED' | 'SKIPPED' | 'TESTING' | 'REJECTED';
  testset: string;
  passedTestCount: number;
  timeConsumedMillis: number;
  memoryConsumedBytes: number;
  points?: number;
}

// API 响应
export interface CFApiResponse<T> {
  status: 'OK' | 'FAILED';
  comment?: string;
  result?: T;
}

// 提交结果状态映射
export const VerdictMap: Record<string, string> = {
  OK: 'accepted',
  WRONG_ANSWER: 'wrongAnswer',
  TIME_LIMIT_EXCEEDED: 'timeLimit',
  MEMORY_LIMIT_EXCEEDED: 'memoryLimit',
  RUNTIME_ERROR: 'runtimeError',
  COMPILATION_ERROR: 'compilationError',
  PRESENTATION_ERROR: 'presentationError',
  IDLENESS_LIMIT_EXCEEDED: 'idlenessLimit',
  SECURITY_VIOLATED: 'securityViolated',
  CRASHED: 'crashed',
  INPUT_PREPARATION_CRASHED: 'inputPreparationCrashed',
  CHALLENGED: 'challenged',
  SKIPPED: 'skipped',
  TESTING: 'testing',
  REJECTED: 'rejected',
};

// Codeforces 段位颜色映射
export const RankColors: Record<string, string> = {
  newbie: '#808080',
  pupil: '#008000',
  specialist: '#03a89e',
  expert: '#0000ff',
  'candidate master': '#aa00aa',
  master: '#ff8c00',
  'international master': '#ff8c00',
  grandmaster: '#ff0000',
  'international grandmaster': '#ff0000',
  'legendary grandmaster': '#ff0000',
};
