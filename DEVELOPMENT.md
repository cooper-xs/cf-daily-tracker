# Codeforces 做题记录追踪网站开发实践文档

**项目名称**: 别让我逮到你 (I'm watching you)  
**作者**: Cooper (cooper-xs)  
**开发时间**: 2026年2月5日  
**在线地址**: https://im-watching-you.vercel.app  
**GitHub**: https://github.com/cooper-xs/cf-daily-tracker

---

## 统计摘要

### 项目概况

| 指标 | 数据 |
|------|------|
| **开发周期** | 2 小时 58 分钟 |
| **开始时间** | 2026-02-05 00:20 GMT+8 |
| **结束时间** | 2026-02-05 03:18 GMT+8 |
| **代码产出** | ~3,500+ 行 |
| **Git 提交** | 32 次 |
| **新建组件** | 9 个 |

### 使用的 AI 模型

- **模型**: Kimi K2.5 (kimi-coding/k2p5)
- **类型**: 代码专用模型
- **上下文窗口**: 262k tokens
- **实际使用**: ~183k input tokens

### 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | React 18 + TypeScript |
| 样式方案 | Tailwind CSS |
| 构建工具 | Vite |
| 国际化 | i18next |
| 部署平台 | Vercel |
| CI/CD | GitHub Actions |

### 功能完成度

| 模块 | 完成状态 |
|------|----------|
| 用户查询 | ✅ 100% |
| 日期选择 | ✅ 100% |
| 难度分布 | ✅ 100% |
| 筛选功能 | ✅ 100% |
| 国际化 | ✅ 100% |
| 主题切换 | ✅ 100% |
| 部署上线 | ✅ 100% |

---

## 一、项目背景与需求分析

### 1.1 初始需求
用户希望开发一个网站，用于查询 Codeforces 平台上用户的做题记录，核心功能包括：
- 根据用户 ID 查询今日/指定日期范围的做题记录
- 展示题目难度、提交时间、通过状态
- 支持批量查询多个用户
- 后期支持订阅和推送功能

### 1.2 技术选型讨论
经过分析，确定以下技术方案：

| 技术栈 | 选择 | 原因 |
|--------|------|------|
| 前端框架 | React 18 + TypeScript | 类型安全，生态成熟 |
| 样式方案 | Tailwind CSS | 快速开发，暗色模式支持 |
| 构建工具 | Vite | 快速热更新，配置简单 |
| 国际化 | i18next | 支持中英文切换 |
| 部署平台 | Vercel | 免费，全球 CDN，自动部署 |

**关键决策**:
- 时区使用 UTC+8（北京时间）
- 默认暗色主题
- MVP 版本先验证需求，后期再加后端

---

## 二、开发过程详录

### 2.1 第一阶段：项目初始化

**遇到的问题**: Codeforces API 文档被 Cloudflare 拦截
**解决方案**: 直接基于已有知识开始开发，使用 `user.status` 和 `user.info` 端点

**核心实现**:
```typescript
// API 限流处理 - 每 2 秒最多 5 次请求
class RequestQueue {
  private queue: (() => void)[] = [];
  private lastRequestTime = 0;
  private readonly minInterval = 400; // 400ms 间隔
  
  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    // 实现请求队列，确保不触发限流
  }
}
```

### 2.2 第二阶段：核心功能开发

#### 2.2.1 用户输入优化
**初始方案**: 普通输入框，逗号分隔  
**优化后**: 标签式输入 (TagInput)
- 回车生成标签
- Shift+回车执行查询
- 退格删除标签
- 支持逗号/空格快速分隔

**键盘交互设计**:
```
⏎ 添加标签
⇧+⏎ 执行查询  
⌫ 删除最后一个标签
```

#### 2.2.2 日期范围选择
**功能迭代**:
1. 初始只支持"今日"
2. 增加日期选择器
3. 添加快捷选项（今天/昨天/最近一周/最近30天）
4. 修复日期状态同步问题

**关键修复**:
- 使用 `queryStartDate` 和 `queryEndDate` 记录查询时的日期，避免修改选择器后影响已查询结果

### 2.3 第三阶段：数据可视化

#### 2.3.1 难度分布统计 (Rating Distribution)
**需求**: 展示用户在不同 Rating 区间的做题情况

**实现细节**:
- 按 Codeforces 段位划分区间（Newbie 到 Legendary Grandmaster）
- 进度条颜色对应段位颜色
- 通过的题目去重统计（同一题目多次通过只算一次）

**去重逻辑**:
```typescript
const uniqueSolvedKeys = new Set<string>();
allSolved.forEach(sub => {
  uniqueSolvedKeys.add(`${sub.problem.contestId}-${sub.problem.index}`);
});
const uniqueSolved = uniqueSolvedKeys.size;
```

#### 2.3.2 筛选功能
**两层筛选机制**:
1. **结果筛选**: 全部 / 通过 / 未通过
2. **难度筛选**: 点击难度区间标签筛选

**筛选状态联动**:
- 显示筛选后/总计数量（如 3/97）
- 全部模式下进度条显示通过/未通过堆叠
- 通过/未通过模式下显示对应颜色进度条

### 2.4 第四阶段：国际化与主题

#### 2.4.1 i18n 实现
**支持语言**:
- 中文 (zh-CN)
- 英文 (en)

**翻译覆盖范围**:
- 所有 UI 文本
- 键盘提示符号
- 统计信息提示

#### 2.4.2 主题切换
**三种模式**:
- ☀️ 浅色
- 🌙 深色（默认）
- 🖥️ 跟随系统

**技术实现**:
```css
@custom-variant dark (&:where(.dark, .dark *));
```

### 2.5 第五阶段：Bug 修复与优化

#### 2.5.1 Rating 为 0 时的处理
**问题**: JavaScript 中 `0` 是 falsy 值，`!rating` 会误判  
**修复**: 使用 `rating === undefined || rating === null` 判断

#### 2.5.2 CORS 解决方案
**开发环境**: Vite Proxy
```typescript
server: {
  proxy: {
    '/api/cf': {
      target: 'https://codeforces.com',
      changeOrigin: true,
    }
  }
}
```

**生产环境**: Vercel Edge Function
```typescript
// api/cf/[[...path]].ts
export default async function handler(request: Request) {
  const response = await fetch(targetUrl);
  return new Response(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  });
}
```

---

## 三、Git 提交记录

```
911b4d0 feat: 添加页脚作者链接
f42a866 feat: 难度分布中去重统计通过的题目
eb1d723 chore: 简化 CI/CD，部署由 Vercel 自动处理
00d71f3 chore: 完善项目工程配置，准备部署
8ae48ae fix: 修复 rating 为 0 时的筛选和显示问题
cd8bc3d feat: 优化难度分布显示
a610e9b style: 全部模式下进度条使用难度对应颜色
a5c008c fix: 完善中英文切换 + 添加键盘符号提示
f387d01 style: 简化键盘提示，移除逗号/空格分隔说明
0246df8 fix: 从 tags 中提取分数标签 (*数字) 显示
3ef0143 feat: 网站重命名为 "别让我逮到你" (I'm watching you)
714f1ae fix: 用户卡片显示查询时的日期范围，而非实时日期
... (其他提交)
```

---

## 四、部署过程

### 4.1 GitHub 配置
**遇到的问题**: GitHub CLI 认证失败  
**解决方案**: 使用 Personal Access Token 登录

```bash
# 获取 Token
# 1. 访问 https://github.com/settings/tokens/new
# 2. 勾选 repo 权限
# 3. 生成并复制 token

# 登录
echo "your-token" | gh auth login --with-token

# 创建仓库并推送
git branch -m master
gh repo create cf-daily-tracker --public --source=. --push
```

### 4.2 Vercel 部署
**步骤**:
1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库 `cooper-xs/cf-daily-tracker`
3. 框架选择 **Vite**
4. 自动识别构建配置
5. 点击 Deploy

**生产地址**: https://im-watching-you.vercel.app

---

## 五、技术亮点

### 5.1 请求限流队列
自定义队列确保不超过 Codeforces API 限制（2秒5次请求）

### 5.2 数据去重策略
在难度分布中对通过的题目按题目 ID 去重，更真实反映用户水平

### 5.3 响应式设计
- 移动端适配
- 暗色模式自动切换
- 多语言实时切换

### 5.4 性能优化
- 使用 `useMemo` 缓存筛选结果
- Vercel Edge Function 缓存 API 响应
- 组件懒加载

---

## 六、经验总结

### 6.1 开发经验
1. **先 MVP 后优化** - 快速验证核心功能再迭代细节
2. **类型安全** - TypeScript 避免了很多运行时错误
3. **状态管理** - 区分"当前选择"和"查询时状态"很重要

### 6.2 遇到的问题与解决
| 问题 | 原因 | 解决方案 |
|------|------|----------|
| API CORS | 浏览器安全限制 | Vercel Edge Function 代理 |
| Rating 0 判断错误 | JS falsy 值 | 使用 === null/undefined |
| 日期状态不同步 | 闭包问题 | 记录查询时的日期快照 |
| 部署权限错误 | Vercel 团队协作问题 | 删除项目重新创建 |

### 6.3 最佳实践
- 使用 `vercel.json` 配置路由和头部
- 使用 GitHub Actions 做 CI 检查
- 使用 i18n key 而不是硬编码文本

---

## 七、后续可优化方向

1. **后端服务**: 添加数据库缓存，减少 API 调用
2. **实时推送**: WebSocket 通知新提交
3. **数据分析**: 更多维度的统计图表
4. **用户系统**: 支持登录保存查询历史
5. **PWA**: 支持离线查看缓存数据

---

## 附录

### A. 项目结构
```
cf-daily-tracker/
├── api/cf/[[...path]].ts     # Vercel Edge Function
├── .github/workflows/ci.yml   # CI 配置
├── public/
│   └── avatar.png            # 网站 Logo
├── src/
│   ├── api/                  # API 封装
│   ├── components/           # React 组件
│   ├── hooks/                # 自定义 Hooks
│   ├── i18n/                 # 国际化配置
│   ├── types/                # TypeScript 类型
│   └── utils/                # 工具函数
├── vercel.json               # Vercel 配置
└── README.md
```

### B. 参考资源
- [Codeforces API](https://codeforces.com/apiHelp)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite](https://vitejs.dev)
- [Vercel](https://vercel.com)

---

**文档生成时间**: 2026-02-05  
**文档版本**: v1.0
