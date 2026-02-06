import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface TagInputProps {
  onSearch: (handles: string[]) => void;
  loading: boolean;
  recentUsers?: string[];
  onAddRecentUser?: (handle: string) => void;
  onRemoveRecentUser?: (handle: string) => void;
  onClearRecentUsers?: () => void;
  initialTags?: string[];
}

/**
 * 标签式用户输入组件
 * 支持回车生成标签，可批量输入多个用户名
 * 支持最近使用用户快速添加
 * 支持键盘方向键选择历史用户
 */
export function TagInput({ 
  onSearch, 
  loading, 
  recentUsers = [],
  onAddRecentUser,
  onRemoveRecentUser,
  onClearRecentUsers,
  initialTags = [],
}: TagInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const recentItemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 初始标签自动填充
  useEffect(() => {
    if (initialTags.length > 0 && tags.length === 0) {
      setTags(initialTags.slice(0, 10));
    }
  }, [initialTags]);

  // 点击外部关闭最近使用面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 添加标签
  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && tags.length < 10) {
      setTags((prev) => {
        if (prev.includes(trimmed)) return prev;
        return [...prev, trimmed];
      });
    }
    setInputValue('');
  };

  // 从最近使用添加标签
  const addTagFromRecent = (handle: string) => {
    addTag(handle);
    // 保持下拉框显示，方便连续选择
    setShowRecent(true);
    // 使用 setTimeout 确保在状态更新后聚焦
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // 删除标签
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 保存搜索历史并执行搜索
  const saveAndSearch = (handles: string[]) => {
    onSearch(handles);
    // 记录到最近使用
    handles.forEach(handle => onAddRecentUser?.(handle));
    // 保留输入框内容，便于用户继续编辑或重新搜索
    setShowRecent(false);
  };

  // 处理键盘事件
  // 回车：添加标签
  // Shift+回车：执行搜索
  // 方向键：选择历史用户
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+回车：执行搜索
        handleSearch();
      } else {
        // 普通回车：添加标签或选择高亮的历史用户
        if (highlightedIndex >= 0 && highlightedIndex < availableRecentUsers.length) {
          addTagFromRecent(availableRecentUsers[highlightedIndex]);
          setHighlightedIndex(-1);
        } else if (inputValue.trim()) {
          addTag(inputValue);
        } else if (tags.length > 0) {
          // 输入框为空但有标签时，直接搜索
          saveAndSearch(tags);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (availableRecentUsers.length > 0) {
        setHighlightedIndex(prev => 
          prev < availableRecentUsers.length - 1 ? prev + 1 : 0
        );
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (availableRecentUsers.length > 0) {
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : availableRecentUsers.length - 1
        );
      }
    } else if (e.key === 'Escape') {
      // ESC 关闭历史面板并重置高亮
      setHighlightedIndex(-1);
      setShowRecent(false);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 输入框为空时按退格，删除最后一个标签
      removeTag(tags.length - 1);
    } else if (e.key === ',' || e.key === ' ') {
      // 逗号或空格也生成标签
      e.preventDefault();
      addTag(inputValue);
    }
  };

  // 处理输入（检测逗号或空格）
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 如果包含逗号或空格，分割并添加标签
    if (value.includes(',') || value.includes(' ')) {
      const parts = value.split(/[,\s]+/).filter(Boolean);
      parts.forEach((part) => addTag(part));
    } else {
      setInputValue(value);
    }
  };

  // 点击搜索
  const handleSearch = () => {
    const trimmedInput = inputValue.trim();
    if (trimmedInput) {
      // 如果有输入值但还没添加到 tags，先添加
      if (!tags.includes(trimmedInput)) {
        setTags([...tags, trimmedInput]);
      }
      // 立即搜索（包含当前输入值）
      const allHandles = [...tags, trimmedInput];
      saveAndSearch(allHandles);
      setInputValue('');
    } else if (tags.length > 0) {
      // 只有标签时直接搜索
      saveAndSearch(tags);
    }
  };

  // 清空所有标签
  const clearAll = () => {
    setTags([]);
    setInputValue('');
    inputRef.current?.focus();
  };

  // 过滤掉已在标签中的历史用户
  const availableRecentUsers = recentUsers.filter(
    user => !tags.some(tag => tag.toLowerCase() === user.toLowerCase())
  );

  // 当可用历史用户变化时，重置高亮索引
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [availableRecentUsers.length]);

  // 当聚焦时显示历史面板
  useEffect(() => {
    if (isFocused) {
      setShowRecent(true);
    }
  }, [isFocused]);

  // 滚动高亮项到可视区域
  useEffect(() => {
    if (highlightedIndex >= 0 && recentItemsRef.current[highlightedIndex]) {
      recentItemsRef.current[highlightedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [highlightedIndex]);

  return (
    <div ref={containerRef} className="w-full space-y-3 relative">
      {/* 标签输入框 */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[52px] px-3 py-2 rounded-xl border-2 transition-all cursor-text
                   flex flex-wrap items-center gap-2 relative z-10
                   ${isFocused 
                     ? 'border-blue-400 bg-white dark:bg-gray-800 shadow-sm ring-4 ring-blue-500/10' 
                     : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600'}
                   ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {tags.map((tag, index) => (
          <span
            key={`${tag}-${index}`}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg
                       bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300
                       text-sm font-medium animate-in fade-in zoom-in duration-200"
          >
            {tag}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeTag(index);
              }}
              disabled={loading}
              className="ml-0.5 w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800
                         flex items-center justify-center transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        ))}
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={tags.length === 0 ? t('user.placeholder') : ''}
          disabled={loading}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-gray-900 dark:text-gray-100
                     placeholder:text-gray-400 disabled:cursor-not-allowed"
        />

        {/* 右侧操作按钮 */}
        <div className="flex items-center gap-1 ml-auto">
          {tags.length > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearAll();
              }}
              disabled={loading}
              className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300
                         transition-colors"
            >
              {t('user.clear')}
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleSearch();
            }}
            disabled={loading || (tags.length === 0 && !inputValue.trim())}
            className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600
                       text-white text-sm font-medium rounded-lg
                       transition-colors disabled:cursor-not-allowed"
          >
            {loading ? t('common.loading') : t('common.search')}
          </button>
        </div>
      </div>

      {/* 最近使用下拉面板 */}
      {showRecent && availableRecentUsers.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
                        rounded-xl border border-gray-200 dark:border-gray-700 
                        shadow-lg dark:shadow-gray-900/50 z-20 overflow-hidden">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
              最近使用
            </span>
            {onClearRecentUsers && (
              <button
                type="button"
                onClick={() => {
                  onClearRecentUsers();
                  setShowRecent(false);
                }}
                className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
              >
                清空
              </button>
            )}
          </div>
          
          {/* 历史用户标签云 */}
          <div className="max-h-[180px] overflow-y-auto p-3">
            <div className="flex flex-wrap gap-2">
              {availableRecentUsers.map((user, index) => {
                const isHighlighted = index === highlightedIndex;
                return (
                  <div
                    key={`${user}-${index}`}
                    ref={el => { recentItemsRef.current[index] = el; }}
                    className={`group inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                               text-sm font-medium transition-all cursor-pointer
                               ${isHighlighted
                                 ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-500/50'
                                 : 'bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-300'
                               }`}
                  >
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addTagFromRecent(user);
                      }}
                      className="flex-1"
                    >
                      {user}
                    </button>
                    {onRemoveRecentUser && (
                      <button
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onRemoveRecentUser(user);
                        }}
                        className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ml-0.5
                                   ${isHighlighted
                                     ? 'hover:bg-blue-400 text-white'
                                     : 'hover:bg-gray-300 dark:hover:bg-gray-600'
                                   }`}
                        title="删除"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-500 dark:text-gray-400">
          {t('user.inputHint')} · {t('user.added')} {tags.length}/10 {t('user.users')}
        </p>
        <p className="hidden sm:block text-gray-400 dark:text-gray-500 text-xs">
          {t('user.keyboardHint')}
        </p>
      </div>
    </div>
  );
}
