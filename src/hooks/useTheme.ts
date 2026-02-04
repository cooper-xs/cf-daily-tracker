import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark'; // 实际应用的主题（system 会被解析）
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'cf_tracker_theme';

/**
 * 主题管理 Hook
 * 支持 light、dark、system 三种模式，默认 dark
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeMode>('dark');
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // 初始化时从 localStorage 读取
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        setThemeState(saved);
      } else {
        // 默认 dark
        setThemeState('dark');
      }
    } catch {
      setThemeState('dark');
    }
  }, []);

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemTheme(mediaQuery.matches ? 'dark' : 'light');

    const handler = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light');
    };
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // 应用主题到 document
  useEffect(() => {
    const effectiveTheme = theme === 'system' ? systemTheme : theme;
    
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme, systemTheme]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // 忽略存储错误
    }
  }, []);

  const effectiveTheme = theme === 'system' ? systemTheme : theme;

  return { theme, effectiveTheme, setTheme };
}
