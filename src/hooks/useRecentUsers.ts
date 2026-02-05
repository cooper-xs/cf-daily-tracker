import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'cf_tracker_recent_users';
const MAX_RECENT_USERS = 20;

/**
 * 管理最近使用过的用户 ID
 */
export function useRecentUsers() {
  const [recentUsers, setRecentUsers] = useState<string[]>([]);

  // 从 localStorage 加载
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentUsers(parsed.slice(0, MAX_RECENT_USERS));
        }
      }
    } catch {
      // 忽略解析错误
    }
  }, []);

  // 同步到 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentUsers));
    } catch {
      // 忽略存储错误
    }
  }, [recentUsers]);

  /**
   * 添加用户到最近使用列表
   * - 已存在的会移到最前面
   * - 最多保留20个
   */
  const addRecentUser = useCallback((handle: string) => {
    const trimmed = handle.trim();
    if (!trimmed) return;

    setRecentUsers((prev) => {
      // 移除已存在的（避免重复）
      const filtered = prev.filter((u) => u.toLowerCase() !== trimmed.toLowerCase());
      // 添加到最前面
      return [trimmed, ...filtered].slice(0, MAX_RECENT_USERS);
    });
  }, []);

  /**
   * 批量添加用户
   */
  const addRecentUsers = useCallback((handles: string[]) => {
    const validHandles = handles.map((h) => h.trim()).filter(Boolean);
    if (validHandles.length === 0) return;

    setRecentUsers((prev) => {
      // 移除将要添加的已存在项
      const lowerNew = validHandles.map((h) => h.toLowerCase());
      const filtered = prev.filter((u) => !lowerNew.includes(u.toLowerCase()));
      // 新添加的放前面，保持原有顺序
      return [...validHandles, ...filtered].slice(0, MAX_RECENT_USERS);
    });
  }, []);

  /**
   * 移除某个历史记录
   */
  const removeRecentUser = useCallback((handle: string) => {
    setRecentUsers((prev) => {
      return prev.filter((u) => u.toLowerCase() !== handle.toLowerCase());
    });
  }, []);

  /**
   * 清空所有历史记录
   */
  const clearRecentUsers = useCallback(() => {
    setRecentUsers([]);
  }, []);

  return {
    recentUsers,
    addRecentUser,
    addRecentUsers,
    removeRecentUser,
    clearRecentUsers,
  };
}
