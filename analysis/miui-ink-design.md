# miui.ink 设计分析

## 网站概览
- **网站名称**: 风月琉璃
- **主题**: WordPress Oyiso 主题
- **风格**: 日系动漫风格，温馨浪漫

## 首页设计特点

### 1. 全屏 Banner
```html
<section class="home1-bannar">
  <div class="imgbox">
    <img src="https://cdn.miui.ink/img/api-100/yuri/59649097_p0.webp" alt="">
    <div class="nav-news">
      <h1>千乐铃音の<span>BLOG</span></h1>
      <p>我在等风，也在等你。</p>
    </div>
  </div>
  <!-- 波浪动画 -->
  <div class="waves-box">
    <svg class="waves">...</svg>
  </div>
</section>
```

**特点**：
- 全屏高质量动漫插画作为 Banner
- 文字叠加在图片上（标题 + 副标题）
- 底部有 SVG 波浪动画过渡
- 图片来源：CDN 托管的动漫插画

### 2. 图片使用策略

#### 文章封面图
从文章列表页面分析：
```
https://miui.ink/wp-content/uploads/2025/11/97083888_p0-300x194.webp
https://miui.ink/wp-content/uploads/2025/11/94394808_p0-300x169.webp
https://miui.ink/wp-content/uploads/2025/11/97941568_p0-300x197.webp
```

**图片特点**：
- **格式**: WebP（现代化、高压缩比）
- **尺寸**: 300px 宽度（缩略图）
- **比例**: 不固定（16:9、4:3 混合）
- **内容**: 高质量动漫插画（来自 Pixiv）
- **命名**: 使用 Pixiv 作品 ID（如 97083888_p0）
- **后缀**: 带查询参数（?1, ?2）用于缓存控制

#### 默认封面
```
https://miui.ink/wp-content/themes/oyiso/assets/images/cover-post.jpg
```
- 当文章没有自定义封面时使用主题默认图

### 3. 图片来源分析

**主要来源**：
1. **Pixiv 插画**：高质量二次元插画
2. **自定义上传**：个人摄影、截图
3. **主题默认图**：占位图

**图片风格**：
- 日系动漫风格为主
- 色彩鲜艳、画面精美
- 多为人物插画、风景插画

### 4. 卡片设计（推测）

虽然首页主要展示 Banner 和动态内容，但从文章列表页可以看出：
- 每个文章卡片都有封面图
- 图片占据卡片顶部
- 图片下方是标题、摘要、元信息

## 设计亮点

### ✨ 视觉冲击力
- 全屏高质量插画 Banner
- 精美的动漫风格图片
- 波浪动画增加动态感

### ✨ 图片优化
- 使用 WebP 格���（体积小、质量高）
- CDN 加速（cdn.miui.ink）
- 响应式尺寸（300px 缩略图）

### ✨ 主题一致性
- 所有图片都是日系动漫风格
- 色调温暖、浪漫
- 与网站名称"风月琉璃"相呼应

## 对我们博客的启发

### 1. 添加首页 Banner
```tsx
// 可以实现类似的全屏 Banner
<section className="hero-banner relative h-screen">
  <img
    src="/images/banner.jpg"
    className="w-full h-full object-cover"
  />
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="text-center text-white">
      <h1 className="text-5xl font-bold">Redem's Blog</h1>
      <p className="text-xl mt-4">全栈开发者 & AI 研究者</p>
    </div>
  </div>
  {/* 波浪动画 */}
  <div className="waves">...</div>
</section>
```

### 2. 优化文章封面图
- **当前状态**: 使用渐变背景
- **改进方向**:
  - 支持自定义封面图（在 frontmatter 中添加 `coverImage` 字段）
  - 使用 WebP 格式
  - 固定比例（建议 16:9）
  - 添加默认占位图

### 3. 图片资源建议
- 使用 Unsplash API 获取高质量免费图片
- 或使用 Pixabay、Pexels 等免费图库
- 为技术博客选择科技感、现代感的图片

### 4. 图片懒加载和优化
```tsx
// Next.js Image 组件自动优化
import Image from 'next/image';

<Image
  src={post.coverImage}
  alt={post.title}
  width={600}
  height={400}
  className="object-cover"
  loading="lazy"
/>
```

## 实现优先级

1. **高优先级** ⭐⭐⭐
   - 为现有文章添加封面图支持
   - 添加默认占位图
   - 优化图片显示比例（统一 16:9）

2. **中优先级** ⭐⭐
   - 实现首页 Banner
   - 添加波浪动画效果
   - 图片懒加载优化

3. **低优先级** ⭐
   - 集成 Unsplash API
   - 图片点击放大（Lightbox）
   - 图片 CDN 加速
