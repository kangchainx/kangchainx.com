# Portfolio Architect: Chris Kang [中文翻译] (Chris Kang 的作品集)

Minimalist, high-end personal portfolio built with a focus on performance and aesthetics.

## 技术栈 [Tech Stack]

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Library**: React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Native CSS Transitions & View Transition API
- **Icons**: Phosphor Icons
- **Language**: TypeScript

## 设计美学 [Design Aesthetic]

遵循 **"Code Lover"** 风格：
- 🌓 **双主题支持**: 完美的深色 (#030303) 与浅色 (#fdfdfd) 模式切换。
- 🐶 **趣味交互**: 包含 "Woof!" 音效文字反馈与物理倾倒动画的法斗主题开关。
- ✨ **精致动效**: 
    - 滚动时自动变形的**胶囊导航岛**。
    - 基于 View Transition API 的**原生圆形扩散**转场。
    - 模拟滚轮的平滑章节跳转。
    - 极致丝滑的 CSS 物理弹簧过渡。

## 运行 [Getting Started]

```bash
npm install
npm run dev
```

## 核心特性 [Core Features]

- 🚀 **性能第一**: 移除 Framer Motion，全面转向原生 CSS 与 API，极致轻量。
- 🎨 **自适应导航**: 
    - 首屏：全宽面板。
    - 滚动：悬浮胶囊 + 自动出现的一键回顶箭头。
- 📱 **响应式设计**: 完美适配各种屏幕尺寸。
- 💾 **状态持久化**: 主题偏好自动保存至 LocalStorage。

## 目录结构 [Directory Structure]

```
src/
├── app/
│   ├── globals.css      # 全局样式与 View Transition 动画定义
│   ├── layout.tsx       # 应用布局
│   └── page.tsx         # 主页面逻辑（包含所有交互与组件）
├── components/          # 独立组件 (SocialIcon, Typewriter 等)
└── lib/                 # 工具函数 (cn, utils)
public/
├── avator/              # 头像资源
└── icons/               # 图标资源 (bulldog.png)
```

Designed & Built by Chris Kang.
