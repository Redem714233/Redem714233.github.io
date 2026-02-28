# 三个优秀博客的设计分析

分析日期：2026-02-28

## 1. Lee Robinson (leerob.io)

### 设计风格
- **极简主义**：纯文本为主，几乎没有图片装饰
- **内容优先**：去除一切干扰元素，专注于文字内容
- **专业感**：简洁、克制、高效

### 核心设计元素

#### 1.1 链接样式（⭐⭐⭐ 最值得学习）
```css
.link {
  transition-property: color;
  text-decoration: underline;
  text-decoration-color: rgb(115 115 115); /* neutral-500 */
  text-decoration-thickness: 1px;
  text-underline-offset: 2.5px;
}

.link:hover {
  text-decoration-color: rgb(163 163 163); /* neutral-400 */
}

/* 深色模式 */
.dark .link:hover {
  text-decoration-color: rgb(82 82 82); /* neutral-600 */
}
```

**特点**：
- 下划线始终存在（不是悬停才出现）
- 下划线颜色比文字浅（neutral-500）
- 悬停时下划线颜色变化（不是文字颜色变化）
- `text-underline-offset: 2.5px` 让下划线与文字保持舒适距离

#### 1.2 排版
- **字体**：Stix Two Text（衬线字体，适合长文阅读）
- **字号**：
  - 标题：`text-xl md:text-2xl`（移动端 20px，桌面端 24px）
  - 正文：`text-copy`（默认大小）
- **行距**：`leading-13`（较大行距，提升可读性）
- **间距**：`my-5`（段落间距 1.25rem）

#### 1.3 颜色系统
- **背景**：纯白/纯黑（深色模式）
- **文字**：默认黑色/白色
- **链接下划线**：neutral-500 → hover: neutral-400
- **无彩色设计**：完全依赖灰度色阶

#### 1.4 布局
- **宽度**：`w-full mt-0 md:mt-16`（移动端无上边距，桌面端 4rem）
- **居中**：内容自然居中，无明显容器
- **响应式**：通过 `md:` 前缀实现断点

### 关键 CSS 类
```css
.antialiased          /* 字体抗锯齿 */
.text-copy            /* 正文样式 */
.my-5                 /* 垂直间距 */
.pl-0 space-y-1       /* 列表样式 */
.transition-colors    /* 颜色过渡动画 */
```

---

## 2. 阿涛的小破站 (emohe.cn)

### 设计风格
- **现代化**：Astro 框架 + 动态效果
- **可定制**：支持主题色调切换（HSL 色相环）
- **视觉丰富**：有背景、动画、过渡效果

### 核心设计元素

#### 2.1 主题色调系统（⭐⭐⭐ 最值得学习）
```javascript
// 从 localStorage 读取色调
const hue = localStorage.getItem("hue") || 250;
document.documentElement.style.setProperty("--hue", hue);
```

```css
:root {
  --hue: 250; /* 默认蓝色 */
  --configHue: 250;
}

/* 使用 HSL 色相环 */
.primary-color {
  color: hsl(var(--hue), 70%, 50%);
}

.primary-bg {
  background: hsl(var(--hue), 70%, 50%);
}
```

**实现原理**：
- 使用 CSS 变量 `--hue` 控制色相（0-360）
- 所有主题色都基于这个色相值生成
- 用户可以通过滑块实时改变色调
- 保存到 `localStorage` 持久化

#### 2.2 Banner 高度自适应
```css
:root {
  --bannerOffset: 15vh;
  --banner-height-home: 65vh;
  --banner-height: 35vh;
}

/* 动态计算扩展高度 */
let extend = Math.floor(window.innerHeight * 0.3);
extend -= extend % 4; /* 确保是 4 的倍数 */
document.documentElement.style.setProperty("--banner-height-extend", `${extend}px`);
```

**特点**：
- 首页 Banner 占 65vh（视口高度的 65%）
- 内页 Banner 占 35vh
- 响应式高度，适配不同屏幕

#### 2.3 深色模式切换
```javascript
switch(localStorage.getItem("theme") || "auto") {
  case "light":
    document.documentElement.classList.remove("dark");
    break;
  case "dark":
    document.documentElement.classList.add("dark");
    break;
  case "auto":
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
    break;
}
```

#### 2.4 过渡动画
```css
.transition {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

#### 2.5 响应式字体
```css
html {
  font-size: 16px; /* 桌面端 */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* 移动端 */
  }
}
```

### 技术栈
- **框架**：Astro v4.16.18
- **数学公式**：KaTeX 0.16.9
- **滚动库**：OverlayScrollbars
- **动画库**：ScrollReveal

---

## 3. 风月琉璃 (miui.ink)

### 设计风格
- **视觉冲击**：大图 Banner + 波浪动画
- **WordPress 主题**：Oyiso 主题
- **二次元风格**：动漫插画作为背景

### 核心设计元素

#### 3.1 全屏 Banner 设计（⭐⭐⭐ 最值得学习）
```html
<section class="home1-bannar">
  <div class="screen">
    <div class="imgbox">
      <img src="https://cdn.miui.ink/img/api-100/yuri/73081851_p0.webp" alt="">
      <div class="nav-news">
        <div class="text">
          <h1>千乐铃音の<span>BLOG</span></h1>
          <p>我在等风，也在等你。</p>
        </div>
      </div>
    </div>
    <!-- 波浪动画 -->
    <div class="waves-box">
      <svg class="waves" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18..." />
        </defs>
        <g class="parallax">
          <use xlink:href="#gentle-wave" x="48" y="0"/>
          <use xlink:href="#gentle-wave" x="48" y="3"/>
          <use xlink:href="#gentle-wave" x="48" y="5"/>
          <use xlink:href="#gentle-wave" x="48" y="7"/>
        </g>
      </svg>
    </div>
  </div>
</section>
```

**特点**：
- 全屏背景图（高质量动漫插画）
- 文字叠加在图片上（白色文字 + 阴影）
- 底部波浪 SVG 动画（视差效果）
- 加载动画（preloader）

#### 3.2 波浪动画实现
```css
.waves {
  position: relative;
  width: 100%;
  height: 15vh;
  margin-bottom: -7px;
  min-height: 100px;
  max-height: 150px;
}

.parallax > use {
  animation: move-forever 25s cubic-bezier(.55,.5,.45,.5) infinite;
}

.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 7s;
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 10s;
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

.parallax > use:nth-child(4) {
  animation-delay: -5s;
  animation-duration: 20s;
}

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }
  100% {
    transform: translate3d(85px, 0, 0);
  }
}
```

#### 3.3 导航栏设计
- **固定顶部**：`header.header-reveal`
- **用户信息卡片**：悬停显示头像、签名
- **搜索框**：集成在导航栏右侧
- **目录按钮**：`.toc-btn`

#### 3.4 卡片式内容区
```html
<section class="home1-newest">
  <div class="screen">
    <div class="screen-title">Feature</div>
    <div class="tab">
      <ul>
        <li>片刻</li>
        <li>评论</li>
        <li>友人帐</li>
        <div class="slider"></div> <!-- 滑动指示器 -->
      </ul>
    </div>
  </div>
</section>
```

#### 3.5 图片使用策略
- **CDN 加速**：`https://cdn.miui.ink/`
- **WebP 格式**：减小文件大小
- **默认封面**：`default-cover.jpg`（无图时使用）
- **懒加载**：`loading_img = false`

---

## 对比总结

| 特性 | leerob.io | emohe.cn | miui.ink |
|------|-----------|----------|----------|
| **设计风格** | 极简主义 | 现代简约 | 视觉丰富 |
| **图片使用** | 几乎无 | 适度 | 大量使用 |
| **主题色** | 固定灰度 | 可自定义 HSL | 固定主题 |
| **Banner** | 无 | 中等高度 | 全屏大图 |
| **动画效果** | 极少 | 适度 | 丰富 |
| **加载速度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **适合场景** | 技术博客 | 个人博客 | 展示型博客 |

---

## 推荐实现方案

### 优先级 1：卡片式文章列表
**参考**：miui.ink 的卡片布局

```tsx
// app/blog/page.tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {posts.map(post => (
    <article className="group relative overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 transition-all hover:shadow-lg hover:-translate-y-1">
      {/* 封面图或渐变背景 */}
      <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600">
        {post.coverImage && (
          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
        )}
      </div>

      {/* 内容 */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-neutral-500">
          <time>{post.date}</time>
          <span>{post.readingTime} min read</span>
        </div>

        {/* 标签 */}
        <div className="flex gap-2 mt-4">
          {post.tags.map(tag => (
            <span className="px-2 py-1 text-xs rounded-full bg-neutral-100 dark:bg-neutral-800">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  ))}
</div>
```

### 优先级 2：主题色调自定义
**参考**：emohe.cn 的 HSL 系统

```tsx
// components/ThemeCustomizer.tsx
'use client';

import { useState, useEffect } from 'react';

export default function ThemeCustomizer() {
  const [hue, setHue] = useState(250);

  useEffect(() => {
    const savedHue = localStorage.getItem('hue') || '250';
    setHue(parseInt(savedHue));
    document.documentElement.style.setProperty('--hue', savedHue);
  }, []);

  const handleChange = (value: number) => {
    setHue(value);
    document.documentElement.style.setProperty('--hue', value.toString());
    localStorage.setItem('hue', value.toString());
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button className="w-12 h-12 rounded-full bg-white dark:bg-neutral-800 shadow-lg flex items-center justify-center">
        🎨
      </button>

      {/* 弹出面板 */}
      <div className="absolute bottom-16 right-0 w-64 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-xl">
        <h3 className="text-sm font-medium mb-3">主题色调</h3>
        <input
          type="range"
          min="0"
          max="360"
          value={hue}
          onChange={(e) => handleChange(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-neutral-500 mt-2">
          <span>蓝</span>
          <span>紫</span>
          <span>粉</span>
          <span>橙</span>
          <span>绿</span>
        </div>
      </div>
    </div>
  );
}
```

```css
/* app/globals.css */
:root {
  --hue: 250; /* 默认蓝色 */
}

.text-primary {
  color: hsl(var(--hue), 70%, 50%);
}

.bg-primary {
  background-color: hsl(var(--hue), 70%, 50%);
}

.border-primary {
  border-color: hsl(var(--hue), 70%, 50%);
}

/* 渐变背景 */
.bg-gradient-primary {
  background: linear-gradient(
    135deg,
    hsl(var(--hue), 70%, 50%),
    hsl(calc(var(--hue) + 30), 70%, 50%)
  );
}
```

### 优先级 3：链接样式优化
**参考**：leerob.io 的链接设计

```css
/* app/globals.css */
.prose a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgb(115 115 115);
  text-decoration-thickness: 1px;
  text-underline-offset: 2.5px;
  transition: text-decoration-color 200ms;
}

.prose a:hover {
  text-decoration-color: rgb(163 163 163);
}

.dark .prose a:hover {
  text-decoration-color: rgb(82 82 82);
}
```

### 优先级 4：首页 Banner（可选）
**参考**：miui.ink 的全屏设计

```tsx
// components/HeroBanner.tsx
export default function HeroBanner() {
  return (
    <section className="relative h-[65vh] overflow-hidden">
      {/* 背景图 */}
      <div className="absolute inset-0">
        <img
          src="/images/banner.jpg"
          alt="Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* 文字内容 */}
      <div className="relative z-10 h-full flex items-center justify-center text-center text-white">
        <div>
          <h1 className="text-5xl font-bold mb-4">
            欢迎来到我的博客
          </h1>
          <p className="text-xl opacity-90">
            分享技术，记录生活
          </p>
        </div>
      </div>

      {/* 波浪动画（可选） */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg className="waves" viewBox="0 24 150 28" preserveAspectRatio="none">
          <defs>
            <path id="wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use href="#wave" x="48" y="0" fill="rgba(255,255,255,0.7)" />
            <use href="#wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
            <use href="#wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
            <use href="#wave" x="48" y="7" fill="#fff" />
          </g>
        </svg>
      </div>
    </section>
  );
}
```

---

## 图片使用建议

### 1. 文章封面图
- **尺寸**：1200x630（适合社交分享）
- **格式**：WebP（优先）或 JPG
- **来源**：
  - Unsplash API：`https://source.unsplash.com/1200x630/?tech,coding`
  - 本地图片：`/public/images/covers/`
  - 无图时使用渐变背景

### 2. Banner 背景图
- **尺寸**：1920x1080 或 1920x600
- **主题**：科技、代码、抽象风格
- **处理**：添加深色遮罩（`bg-black/30`）确保文字可读

### 3. 图片优化
```javascript
// next.config.js
module.exports = {
  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};
```

---

## 下一步行动

1. ✅ **立即实现**：Lee Robinson 的链接样式（5 分钟）
2. ⭐ **今天完成**：卡片式文章列表（1-2 小时）
3. ⭐ **本周完成**：主题色调自定义（2-3 小时）
4. 📅 **可选**：首页 Banner 轮播（3-4 小时）

---

**分析完成！准备好开始实现了吗？**
