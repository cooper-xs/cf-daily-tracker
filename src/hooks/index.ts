import { useState, useEffect, useCallback } from 'react';
import type { CFUser, CFSubmission } from '../types';
import { getUserInfo, getUsersTodaySubmissions, getUsersSubmissionsByDateRange } from '../api/codeforces';
import { parseHandles, addSearchHistory } from '../utils';

interface QueryState {
  loading: boolean;
  error: string | null;
  users: CFUser[];
  submissions: Map<string, CFSubmission[]>;
  startDate: string;
  endDate: string;
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
  });

  const setDateRange = useCallback((startDate: string, endDate: string) => {
    setState(prev => ({ ...prev, startDate, endDate }));
  }, []);

  const queryUsers = useCallback(async (input: string) => {
    const handles = parseHandles(input);
    if (handles.length === 0) {
      setState(prev => ({ ...prev, error: '请输入至少一个用户名' }));
      return;
    }

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
      if (state.startDate === state.endDate && state.startDate === getTodayString()) {
        // 如果是今天，使用今日查询函数（兼容旧逻辑）
        submissions = await getUsersTodaySubmissions(handles);
      } else {
        // 使用日期范围查询
        submissions = await getUsersSubmissionsByDateRange(handles, state.startDate, state.endDate);
      }
      
      // 保存搜索历史
      addSearchHistory(handles);

      setState(prev => ({
        ...prev,
        loading: false,
        error: null,
        users,
        submissions,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '查询失败',
      }));
    }
  }, [state.startDate, state.endDate]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    setDateRange,
    queryUsers,
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
