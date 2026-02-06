import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'light' | 'dark' | 'system';

interface UseThemeReturn {
  theme: ThemeMode;
  effectiveTheme: 'light' | 'dark';
  setTheme: (mode: ThemeMode) => void;
}

const STORAGE_KEY = 'cf_tracker_theme';

// 获取初始主题（避免在渲染中读取 localStorage）
function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      return saved;
    }
  } catch {
    // 忽略存储错误
  }
  return 'dark';
}

/**
 * 主题管理 Hook
 * 支持 light、dark、system 三种模式，默认 dark
 */
export function useTheme(): UseThemeReturn {
  // 使用懒加载初始化避免 SSR 问题
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light');

  // 初始化系统主题（使用 requestAnimationFrame 避免同步 setState）
  useEffect(() => {
    const updateSystemTheme = () => {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setSystemTheme(isDark ? 'dark' : 'light');
    };
    
    updateSystemTheme();
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
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
