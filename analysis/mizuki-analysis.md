# Mizuki 博客主题分析

## 项目概览
- **名称**: Mizuki (みずき)
- **框架**: Astro 5.15.3
- **Stars**: 1,213 ⭐
- **描述**: 下一代 Material Design 3 博客主题
- **在线演示**: https://mizuki.mysqil.com/
- **文档**: https://docs.mizuki.mysqil.com/

## 核心特性

### 🎨 设计系统
1. **Material Design 3** 设计语言
2. **明暗主题切换** + 系统偏好检测
3. **可自定义主题色彩**
4. **动态横幅轮播**
5. **全屏背景图片**（支持轮播、透明度、模糊效果）
6. **流畅动画**（基于 Swup.js）
7. **响应式设计**（自动分辨率适配）

### 📝 内容管理

#### Frontmatter 格式
```yaml
---
title: 文章标题
published: 2023-09-09
description: 文章描述
image: ./cover.jpg          # 封面图片（相对路径）
tags: [标签1, 标签2]
category: 前端
draft: false
pinned: false               # 置顶功能
comment: true
lang: zh-CN
---
```

**关键点**：
- ✅ 支持文章封面图（`image` 字段）
- ✅ 图片使用相对路径（`./cover.jpg`）
- ✅ 支持置顶文章（`pinned: true`）
- ✅ 支持草稿模式（`draft: true`）

### 🖼️ 图片处理策略

#### 1. 文章封面图
- **位置**: 与文章 Markdown 文件同目录
- **引用方式**: `image: ./cover.jpg`
- **优势**:
  - 图片和文章放在一起，便于管理
  - 相对路径，移动文章时图片自动跟随
  - Astro 自动优化图片

#### 2. 全局图片资源
- **位置**: `src/assets/` 或 `public/`
- **用途**:
  - Banner 背景图
  - 默认封面图
  - 网站 Logo、Favicon

#### 3. 图片优化
- **PhotoSwipe 集成**: 图片点击放大
- **懒加载**: 性能优化
- **响应式图片**: 自动适配不同设备

### 🚀 特色功能

#### 1. 代码内容分离（可选）
```env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
CONTENT_DIR=./content
```
- 代码和内容分离到不同仓库
- 内容更新自动触发部署
- 适合团队协作

#### 2. 特色页面
- **追番页面**: 追踪动画观看进度（B站集成）
- **友链页面**: 精美卡片展示
- **日记页面**: 类似社交媒体的瞬间分享
- **归档页面**: 时间线视图
- **关于页面**: 可自定义

#### 3. 搜索功能
- 基于 **Pagefind** 的高级搜索
- 支持全文搜索
- 无需后端服务

#### 4. SEO 优化
- IndexNow API 集成
- 自动生成 Sitemap
- 完善的 Meta 标签

### 🛠️ 技术栈

```json
{
  "框架": "Astro 5.15.3",
  "样式": "Tailwind CSS",
  "动画": "Swup.js",
  "代码高亮": "Expressive Code",
  "数学公式": "KaTeX",
  "图片画廊": "PhotoSwipe",
  "搜索": "Pagefind",
  "评论": "Twikoo",
  "字体": "JetBrains Mono"
}
```

## 对我们项目的启发

### 1. 图片管理策略 ⭐⭐⭐

**Mizuki 的方式**：
```
src/content/posts/
├── my-first-post/
│   ├── index.md
│   └── cover.jpg        # 封面图和文章在一起
└── another-post/
    ├── index.md
    └── banner.png
```

**Frontmatter**：
```yaml
image: ./cover.jpg       # 相对路径
```

**优势**：
- ✅ 图片和文章放在一起，便于管理
- ✅ 移动文章时图片自动跟随
- ✅ 清晰的文件组织结构

**我们可以采用**：
- 将每篇文章改为文件夹结构
- 图片放在文章文件夹内
- 使用相对路径引用

### 2. 置顶功能 ⭐⭐

```yaml
pinned: true  # 重要文章置顶
```

**实现逻辑**：
```typescript
posts.sort((a, b) => {
  // 置顶文章优先
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  // 同级别按日期排序
  return new Date(b.date) - new Date(a.date);
});
```

### 3. 图片优化 ⭐⭐⭐

**PhotoSwipe 集成**：
- 点击图片放大查看
- 支持手势缩放
- 画廊模式

**懒加载**：
- 提升首屏加载速度
- 节省带宽

### 4. 草稿模式 ⭐

```yaml
draft: true  # 开发环境可见，生产环境隐藏
```

### 5. 多语言支持 ⭐

```yaml
lang: zh-CN  # 单篇文章可以指定语言
```

## 实现建议

### 优先级 1：图片封面支持 ⭐⭐⭐

**当前状态**：使用渐变背景
**改进方向**：
1. 在 Markdown frontmatter 添加 `coverImage` 字段
2. 支持相对路径（`./cover.jpg`）
3. 添加默认占位图
4. 使用 Next.js Image 组件优化

**实现步骤**：
```typescript
// lib/posts.ts
export interface PostMetadata {
  // ... 现有字段
  coverImage?: string;  // 新增
}

// app/blog/page.tsx
{post.coverImage ? (
  <Image
    src={post.coverImage}
    alt={post.title}
    width={600}
    height={400}
    className="object-cover"
  />
) : (
  <div className="bg-gradient-primary" />
)}
```

### 优先级 2：置顶功能 ⭐⭐

```typescript
// lib/posts.ts
export interface PostMetadata {
  pinned?: boolean;  // 新增
}

// 排序逻辑
posts.sort((a, b) => {
  if (a.pinned && !b.pinned) return -1;
  if (!a.pinned && b.pinned) return 1;
  return new Date(b.date).getTime() - new Date(a.date).getTime();
});
```

### 优先级 3：图片点击放大 ⭐⭐

使用 `yet-another-react-lightbox` 或类似库：
```bash
npm install yet-another-react-lightbox
```

### 优先级 4：草稿模式 ⭐

```typescript
export interface PostMetadata {
  draft?: boolean;
}

// 生产环境过滤草稿
if (process.env.NODE_ENV === 'production') {
  posts = posts.filter(post => !post.draft);
}
```

## 总结

**Mizuki 的核心优势**：
1. ✅ 完善的图片管理系统
2. ✅ Material Design 3 设计语言
3. ✅ 丰富的特色功能（追番、友链、日记）
4. ✅ 优秀的性能优化
5. ✅ 代码内容分离架构

**我们可以借鉴**：
1. 图片封面支持（相对路径）
2. 置顶功能
3. 图片点击放大
4. 草稿模式
5. 更好的文件组织结构

**不需要照搬**：
- Astro 框架（我们用 Next.js）
- 追番页面（不是所有人都需要）
- 代码内容分离（小型博客不需要）
