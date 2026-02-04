# CF 今日打卡 | Codeforces Daily Tracker

📊 查询 Codeforces 用户今日做题记录的工具

## 功能

- 🔍 批量查询用户今日提交记录
- 📈 显示用户 Rating、段位、今日提交数
- 🏷️ 题目难度标识（颜色区分）
- 🌐 中英文切换
- 🌙 自动跟随系统暗色模式

## 技术栈

- React 18 + TypeScript
- Tailwind CSS
- Vite
- i18next（国际化）

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建
npm run build
```

## API 说明

本项目使用 [Codeforces API](https://codeforces.com/apiHelp)，遵循以下限制：
- 每 2 秒最多 5 次请求
- 开发时通过 Vite Proxy 解决 CORS

## 时区

- 使用 UTC+8（北京时间）定义"今日"

## License

MIT
