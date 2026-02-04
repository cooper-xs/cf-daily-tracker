import { useState, useEffect, useCallback } from 'react';
import type { CFUser, CFSubmission } from '../types';
import { getUserInfo, getUsersTodaySubmissions, getUsersSubmissionsByDateRange } from '../api/codeforces';
import { parseHandles, addSearchHistory } from '../utils';

interface QueryState {
  loading: boolean;
  error: string | null;
  users: CFUser[];
  submissions: Map<string, CFSubmission[]>;
  startDate: string;  // 当前选择的开始日期
  endDate: string;    // 当前选择的结束日期
  queryStartDate: string | null;  // 查询时的开始日期（用于显示）
  queryEndDate: string | null;    // 查询时的结束日期（用于显示）
}

// 获取今日日期字符串 (YYYY-MM-DD)
function getTodayString(): string {
  const now = new Date();
  const utc8Time = new Date(now.getTime() + 8 * 60 * 60 * 1000);
  return utc8Time.toISOString().split('T')[0];
}

/**
 * 用户查询 Hook
 * 支持日期范围选择
 */
export function useUserQuery() {
  const [state, setState] = useState<QueryState>({
    loading: false,
    error: null,
    users: [],
    submissions: new Map(),
    startDate: getTodayString(),
    endDate: getTodayString(),
    queryStartDate: null,
    queryEndDate: null,
  });

  const setDateRange = useCallback((startDate: string, endDate: string) => {
    setState(prev => ({ ...prev, startDate, endDate }));
  }, []);

  // 通用的查询逻辑
  const performQuery = useCallback(async (handles: string[]) => {
    if (handles.length === 0) {
      setState(prev => ({ ...prev, error: '请输入至少一个用户名' }));
      return;
    }

    // 记录查询时使用的日期
    const queryStart = state.startDate;
    const queryEnd = state.endDate;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // 获取用户信息
      const users = await getUserInfo(handles);
      
      if (users.length === 0) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: '未找到用户',
        }));
        return;
      }

      // 获取指定日期范围内的提交记录
      let submissions: Map<string, CFSubmission[]>;
      if (queryStart === queryEnd && queryStart === getTodayString()) {
        // 如果是今天，使用今日查询函数（兼容旧逻辑）
        submissions = await getUsersTodaySubmissions(handles);
      } else {
        // 使用日期范围查询
        submissions = await getUsersSubmissionsByDateRange(handles, queryStart, queryEnd);
      }
      
      // 保存搜索历史
      addSearchHistory(handles);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        users,
        submissions,
        queryStartDate: queryStart,
        queryEndDate: queryEnd,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '查询失败',
      }));
    }
  }, [state.startDate, state.endDate]);

  // 通过字符串查询（兼容旧用法）
  const queryUsers = useCallback(async (input: string) => {
    const handles = parseHandles(input);
    await performQuery(handles);
  }, [performQuery]);

  // 通过 handles 数组查询（供 TagInput 使用）
  const queryUsersByHandles = useCallback(async (handles: string[]) => {
    await performQuery(handles);
  }, [performQuery]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    setDateRange,
    queryUsers,
    queryUsersByHandles,
    clearError,
  };
}

/**
 * 搜索历史 Hook
 */
export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    // 从本地存储加载
    try {
      const data = localStorage.getItem('cf_tracker_search_history');
      if (data) {
        setHistory(JSON.parse(data));
      }
    } catch {
      // 忽略错误
    }
  }, []);

  const clearHistory = useCallback(() => {
    localStorage.removeItem('cf_tracker_search_history');
    setHistory([]);
  }, []);

  return { history, clearHistory };
}

/**
 * 系统主题 Hook
 */
export function useSystemTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return isDark;
}

export { useTheme } from './useTheme';
export type { ThemeMode } from './useTheme';
