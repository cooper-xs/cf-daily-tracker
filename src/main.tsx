import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 🎮 开发者控制台彩蛋
console.log(
  '%c🤖 别让我逮到你! %cI\'m watching you...',
  'color: #22d3ee; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(34, 211, 238, 0.3);',
  'color: #3b82f6; font-size: 16px; font-style: italic;'
);

console.log(
  '%c%s',
  'color: #10b981; font-size: 12px;',
  `
    ╭────────────────────────────────────╮
    │  🎯 Codeforces Daily Tracker v1.0.0 │
    │                                    │
    │  📝 今天刷题了吗？                 │
    │  💪 Rating 涨了吗？                │
    │  🔥 连续打卡几天了？               │
    │                                    │
    │  GitHub: @cooper-xs               │
    │  Made with ❤️ by @cooper-xs · @yume · @TARS 🤖 │
    ╰────────────────────────────────────╯
  `
);

console.log(
  '%c💡 小提示: %c试试查询多个用户，看看谁今天最卷！',
  'color: #f59e0b; font-size: 14px; font-weight: bold;',
  'color: #6b7280; font-size: 12px;'
);

// 🔍 检测开发者工具
if (typeof window !== 'undefined') {
  const devtools = { open: false };
  const threshold = 160;
  
  setInterval(() => {
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    
    if (widthThreshold || heightThreshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.log(
          '%c👀 被发现了！',
          'color: #ef4444; font-size: 20px; font-weight: bold;'
        );
        console.log(
          '%c既然你打开了控制台...要不要来 GitHub 给我们点个 ⭐？',
          'color: #8b5cf6; font-size: 14px;'
        );
        console.log(
          '%chttps://github.com/cooper-xs/cf-daily-tracker',
          'color: #3b82f6; font-size: 12px; text-decoration: underline; cursor: pointer;'
        );
      }
    } else {
      devtools.open = false;
    }
  }, 1000);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
