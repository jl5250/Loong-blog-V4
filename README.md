# 墨·赛博 Ink Cyber

基于开源项目 [ThriveX](https://github.com/LiuYuYang01/ThriveX-Admin) 二次开发的个人品牌博客。

> **墨·赛博 (Ink Cyber)** — 将中国传统水墨意境与赛博朋克科技视觉融合的设计语言。  
> 用墨色的流动性平衡科技的冷硬感，让博客既有人文温度又有现代感。

---

## 技术栈

| 层面 | 技术 |
|------|------|
| 框架 | Next.js 16.2.6 (App Router), React 19.2.4 |
| 样式 | Tailwind CSS v4, CSS Custom Properties 主题系统 |
| 动画 | GSAP 3.15 + ScrollTrigger, Lenis 1.3.23 平滑滚动 |
| 状态 | Zustand 5 + persist 中间件 |
| 字体 | 自托管子集字体（Noto Serif SC, LXGW WenKai, Noto Sans SC） |
| 地图 | 高德地图 (AMap) JS API 2.0 |
| 代码高亮 | highlight.js |
| Markdown | react-markdown + rehype-raw + remark-gfm |
| 后端 API | Spring Boot 2.7 (端口 9003) |
| 音乐 API | Netease Cloud Music 代理 (端口 4000) |

## 与原项目 ThriveX v3 的对比改进

本项目基于 ThriveX v3（Next.js + Spring Boot）重构，不是简单复制，而是在保留核心功能的基础上做了以下改进：

### 技术升级

| 项目 | ThriveX v3 | Ink Cyber (本分支) |
|------|-----------|-------------------|
| Next.js | 15 | **16.2.6** |
| React | 18 | **19.2.4** |
| 样式方案 | SCSS + Tailwind | **纯 Tailwind CSS v4** |
| 状态管理 | Zustand | **Zustand + persist 持久化** |
| 滚动方案 | 原生 | **Lenis 平滑滚动 + GSAP ScrollTrigger** |
| 图片查看 | react-photo-view | **自研 ImageViewer (零依赖)** |
| 地图 | 高德地图 | **高德地图 + 错误容灾** |
| 字体 | Google Fonts CDN | **自托管子集字体 (零外部请求)** |

### 架构改进

- **Pages Router → App Router**：从旧版路由迁移到 Next.js 16 App Router，支持布局嵌套、流式加载
- **服务端组件优先**：静态页面预渲染，API 数据在服务端获取，减少客户端请求
- **ISR 增量静态生成**：/my、/resume 等动态页面使用 ISR 策略
- **CSS 变量主题系统**：完全通过 CSS Custom Properties 控制暗色/亮色主题，无运行时切换
- **状态持久化**：音乐播放列表、当前歌曲、评论用户信息通过 zustand persist 写入 localStorage，刷新不丢失

### 功能增强

- **音乐播放器**：接入网易云音乐 API，支持每日推荐、播放列表、扫码登录、键盘快捷键
- **评论系统**：完整的发布/回复流程，QQ 邮箱自动获取头像，审核可见性控制
- **说说页面**：时间轴布局，图片画廊，无限滚动加载
- **足迹地图**：高德地图交互标记 + 图片预览
- **搜索功能**：关键词高亮、搜索建议、骨架屏加载
- **移动端适配**：抽屉式导航栏，响应式网格，触摸友好的交互
- **数据页面**：文章/评论/分类/友链统计，分类占比图表
- **阅读进度条 + 目录**：文章详情页的阅读进度指示和自动高亮目录

### 设计体系

- **墨·赛博** 设计语言贯穿全站：墨水粒子动画、书法字体标题、印章/水墨装饰元素
- 自托盘中日韩字体子集（~60KB 每个），零外部字体请求
- 统一的暗色/亮色主题，无缝切换

### 性能优化

- MusicPlayer 动态导入（`next/dynamic` + `ssr: false`），不阻塞首屏
- 自研 ImageViewer 替换 react-photo-view，节省 440KB
- 图片 `loading="lazy"` 延迟加载
- 滚动系统优化：HorizontalScroll 拦截 wheel 事件后暂停 Lenis，解决拖拽冲突
- 删除 react-photo-view、react-masonry-css 等冗余依赖

### Bug 修复

- 修复 wall 页面"加载更多"重复卡片的翻页问题
- 修复导航栏高亮不匹配（`mark` 字段与 URL 路径不一致）
- 修复 data 页面分类统计错误（混入导航项的问题）
- 修复 `releasePointerCapture` DOMException（react-photo-view 及拖拽交互）
- 修复 Turbopack 中可选链 `?.` 与三元表达式 `?:` 的解析崩溃
- 修复 React 19 中 `useRef<T>()` 缺少初始值的 TS 错误

---

## 项目结构

```
├── public/fonts/          # 自托管子集字体
├── scripts/               # 字体下载/子集化/调试工具
├── src/
│   ├── api/               # API 请求封装（article, comment, wall, music, rss...）
│   ├── app/               # Next.js App Router 页面
│   │   ├── article/       # 文章详情（含目录 TOC、评论）
│   │   ├── data/          # 站点数据统计
│   │   ├── equipment/     # 设备展示
│   │   ├── fishpond/      # RSS 鱼塘
│   │   ├── footprint/     # 足迹地图 + 时间轴
│   │   ├── friend/        # 友链
│   │   ├── music/         # 音乐播放器
│   │   ├── my/            # 关于我
│   │   ├── record/        # 说说/闪念
│   │   ├── search/        # 搜索
│   │   ├── tags/          # 标签云
│   │   └── wall/          # 留言墙
│   ├── components/        # 公共组件
│   │   ├── article/       # 文章渲染、评论
│   │   ├── layout/        # 头部、底部、FAB
│   │   ├── music/         # 播放器
│   │   ├── scroll/        # Lenis 滚动、ScrollReveal
│   │   ├── ui/            # ImageViewer, Swiper, HorizontalScroll, 墨韵动物
│   │   └── transitions/   # 页面过渡动画
│   ├── stores/            # Zustand 状态（music, author, config）
│   ├── styles/            # 设计令牌 CSS
│   └── types/             # TypeScript 类型定义
```

## 快速开始

### 前置要求

- Node.js >= 20
- 后端服务运行在 `localhost:9003`（Spring Boot）
- （可选）网易云音乐 API 代理运行在 `localhost:4000`

### 安装

```bash
npm install
```

### 配置

复制环境变量文件并修改：

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_PROJECT_API=http://localhost:9003/api
NEXT_PUBLIC_MUSIC_API=http://localhost:4000
NEXT_PUBLIC_CACHING_TIME=0
```

### 开发

```bash
npm run dev
# 或
npx next dev -p 3000
```

### 构建

```bash
npm run build
```

构建时会自动执行字体子集化 + Next.js 编译。

---

## 页面路由

| 路由 | 类型 | 说明 |
|------|------|------|
| `/` | 静态 | 首页（Hero + 精选 + 最新 + 动态 + 评论） |
| `/article/[id]` | 动态 | 文章详情（Hero 封面 + Markdown + TOC + 评论） |
| `/cate/[id]` | 动态 | 分类文章列表 |
| `/tag/[id]` | 动态 | 标签文章列表 |
| `/tags` | 静态 | 标签云 |
| `/data` | 静态 | 站点数据统计 |
| `/record` | 静态 | 说说/闪念时间轴 |
| `/footprint` | 静态 | 足迹地图 |
| `/equipment` | 静态 | 设备展示 |
| `/fishpond` | 静态 | RSS 鱼塘 |
| `/friend` | 静态 | 友链 |
| `/wall/[cate]` | 动态 | 留言墙（按分类） |
| `/my` | ISR | 关于我 |
| `/resume` | ISR | 简历 |
| `/search` | 静态 | 搜索 |
| `/music` | 静态 | 音乐（开发中） |

---

## 开发回顾（2026 年 6 月 2 日 — 6 月 3 日）

```
Jun 2-3: 3 commits (solo), 15.9k LOC, 100% feat. Streak: 2d
```

### 概览

| 指标 | 数值 |
|--------|-------|
| 功能交付 | 2 个（Ink Cyber 博客 + 评论/搜索/移动端适配） |
| 提交次数 | 3 |
| 贡献者 | 1 |
| 原始代码：新增 | 15,887 行 |
| 原始代码：净增 | +15,386 行 |
| 测试覆盖率 | 0%（待补充） |
| 活跃天数 | 2 |
| AI 辅助提交 | 3 次（100%） |

### 提交记录

1. `49297f6` — 2026-06-02 — Initial commit from Create Next App
2. `f24427e` — 2026-06-03 — feat: complete Ink Cyber blog with all pages and fixes（220 文件，8,009 行）
3. `ce48429` — 2026-06-03 — feat: comments, mobile nav, image viewer, search, and responsive polish（29 文件，909 行）

### 做得好的地方

- 从零到一交付了一个完整的、风格统一的博客
- 对反馈响应迅速（地图切换、图片查看器替换）
- 设计语言一致性保持得很好

### 可以提升的地方

- 测试覆盖率为 0%，需要补充集成测试
- 提交粒度偏粗，建议按功能模块拆分提交
- 需要配置 CI 流程

---

## License

基于 [AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.html) 开源。

基于开源项目 [ThriveX](https://github.com/LiuYuYang01/ThriveX-Admin) 构建。
