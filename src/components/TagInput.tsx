import { useState, useRef, type KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface TagInputProps {
  onSearch: (handles: string[]) => void;
  loading: boolean;
}

/**
 * 标签式用户输入组件
 * 支持回车生成标签，可批量输入多个用户名
 */
export function TagInput({ onSearch, loading }: TagInputProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 添加标签
  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
      setTags([...tags, trimmed]);
    }
    setInputValue('');
  };

  // 删除标签
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 处理键盘事件
  // 回车：添加标签
  // Shift+回车：执行搜索
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) {
        // Shift+回车：执行搜索
        handleSearch();
      } else {
        // 普通回车：添加标签
        if (inputValue.trim()) {
          addTag(inputValue);
        } else if (tags.length > 0) {
          // 输入框为空但有标签时，直接搜索
          onSearch(tags);
        }
      }
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
      onSearch([...tags, trimmedInput]);
      setInputValue('');
    } else if (tags.length > 0) {
      // 只有标签时直接搜索
      onSearch(tags);
    }
  };

  // 清空所有标签
  const clearAll = () => {
    setTags([]);
    setInputValue('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full space-y-3">
      {/* 标签输入框 */}
      <div
        onClick={() => inputRef.current?.focus()}
        className={`min-h-[52px] px-3 py-2 rounded-xl border-2 transition-all cursor-text
                   flex flex-wrap items-center gap-2
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
          onFocus={() => setIsFocused(true)}
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

      {/* 提示信息 */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-500 dark:text-gray-400">
          {t('user.inputHint')} · {t('user.added')} {tags.length}/10 {t('user.users')}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs">
          {t('user.keyboardHint')}
        </p>
      </div>
    </div>
  );
}
