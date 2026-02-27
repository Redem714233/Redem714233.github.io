# 博客开发工作记录

## ✅ 已完成的功能（2025年当前日期）

### 1. 博客系统基础
- ✅ Next.js 15 + TypeScript 项目搭建
- ✅ Markdown 文章解析（gray-matter + remark + rehype）
- ✅ 动态路由系统（/blog/[slug]）
- ✅ 两篇技术文章发布：
  - GEEPAFS GPU 能效优化
  - LLM 安全性与指令遵循

### 2. 视觉设计优化
- ✅ 学习 Lee Robinson (leerob.io) 的设计风格
- ✅ 优雅的链接悬停效果（半透明下划线 + 平滑过渡）
- ✅ 代码块样式优化（圆角 + 阴影 + 深色背景）
- ✅ 表格渐变表头 + 悬停动画
- ✅ 引用块背景优化
- ✅ 深色模式完美适配

### 3. 功能组件
- ✅ 阅读进度条（顶部蓝紫渐变）
- ✅ 目录侧边栏（左侧固定，自动高亮当前标题）
- ✅ KaTeX 数学公式渲染支持
- ✅ GitHub Flavored Markdown（表格支持）
- ✅ Giscus 评论系统集成
  - Repo ID: R_kgDORZ_S1g
  - Category ID: DIC_kwDORZ_S1s4C3WJy
  - 评论存储在 GitHub Discussions

### 4. 部署
- ✅ GitHub Pages 自动部署
- ✅ 网站地址：https://redem714233.github.io/

---

## 📋 待实现功能（按优先级排序）

### 优先级 1：卡片式文章列表 ⭐⭐⭐
**当前状态**：博客列表页是纯文本链接
**目标效果**：
- 网格布局（桌面 2 列，移动端 1 列）
- 每个卡片包含：
  - 文章封面图（可选，无图则显示渐变背景）
  - 标题
  - 摘要（前 150 字）
  - 标签
  - 发布日期
  - 阅读时间估算
- 悬停效果：卡片上浮 + 阴影加深

**需要修改的文件**：
- `app/blog/page.tsx` - 博客列表页
- `app/globals.css` - 卡片样式
- `lib/posts.ts` - 添加摘要提取函数

**需要准备**：
- 可选：每篇文章��封面图（800x450）
- 如果没有图片，使用渐变色背景

---

### 优先级 2：导航栏滚动透明效果 ⭐⭐⭐
**当前状态**：导航栏固定白色/深色
**目标效果**：
- 页面顶部时：导航栏透明，文字白色
- 向下滚动后：导航栏变实色，文字变色
- 平滑过渡动画（300ms）
- 添加阴影效果

**需要修改的文件**：
- `components/Header.tsx` - 添加滚动监听
- `app/globals.css` - 透明样式

**需要准备**：无

---

### 优先级 3：可自定义主题色调 ⭐⭐
**当前状态**：固定蓝色主题
**目标效果**：
- 页面右下角浮动按钮（🎨 图标）
- 点击弹出色调选择器
- 拖动滑块实时改变网站主色调
- ���调范围：蓝(250) → 紫(280) → 粉(330) → 绿(150) → 橙(30)
- 保存到 localStorage

**需要创建的文件**：
- `components/ThemeCustomizer.tsx` - 主题选择器组件
- 修改 `app/globals.css` - 使用 CSS 变量 `hsl(var(--hue), 70%, 50%)`

**技术实现**：
```css
:root {
  --hue: 250; /* 默认蓝色 */
}
.text-primary {
  color: hsl(var(--hue), 70%, 50%);
}
```

**需要准备**：无

---

### 优先级 4：图片点击放大功能 ⭐⭐
**当前状态**：文章图片无法放大查看
**目标效果**：
- 点击图片全屏显示
- 黑色半透明背景（rgba(0,0,0,0.9)）
- 支持左右切换（如果有多张图）
- 支持缩放、拖动
- ESC 或点击背景关闭

**技术方案**：
- 使用 `react-medium-image-zoom` 库
- 或自己实现 Lightbox 组件

**需要修改的文件**：
- `app/blog/[slug]/page.tsx` - 添加图片处理
- 或创建 `components/ImageGallery.tsx`

**需要准备**：无

---

### 优先级 5：首页 Banner 轮播 ⭐
**当前状态**：主页静态 Hero 区域
**目标效果**：
- 全屏或半屏轮播区域
- 3-5 张背景图自动切换（5 秒间隔）
- 淡入淡出过渡效果
- 左右箭头手动切换
- 底部圆点指示器
- 每张图可叠加文字（标题、副标题、CTA 按钮）

**需要创建的文件**：
- `components/HeroBanner.tsx` - 轮播组件
- `public/images/banners/` - 存放轮播图片

**需要准备**：
- 3-5 张高质量横向图片（1920x1080 或 1920x600）
- 主题：技术、代码、抽象科技风
- 或使用 Unsplash API 自动获取

---

## 🎨 设计参考

### 已学习的博客
1. **Lee Robinson (leerob.io)**
   - 极简设计
   - 优雅的链接样式（已应用）
   - 内容优先

2. **emohe.cn（阿涛的小破站）**
   - Astro 框架
   - 可自定义主题色调系���
   - 响应式 Banner 高度
   - 平滑过渡动画

3. **rlightz7if.github.io**
   - Hexo + Materialize CSS
   - 轮播封面设计
   - Material Design 风格
   - 图片画廊支持

---

## 📁 项目结构

```
D:/study/SUSTech/github.io/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx          # 文章详情页（已集成评论）
│   │   ├── page.tsx               # 博客列表页（待优化为卡片式）
│   │   └── posts/
│   │       ├── geepafs-gpu-energy-optimization.md
│   │       └── llm-safety-instruction-following.md
│   ├── layout.tsx                 # 根布局（含 KaTeX CSS）
│   ├── page.tsx                   # 主页（待添加 Banner 轮播）
│   └── globals.css                # 全局样式（已优化）
├── components/
│   ├── Header.tsx                 # 导航栏（待添加滚动透明效果）
│   ├── Comments.tsx               # Giscus 评论组件（已配置）
│   ├── ReadingProgress.tsx        # 阅读进度条
│   ├── TableOfContents.tsx        # 目录侧边栏
│   └── AnimatedSection.tsx        # 动画组件
├── lib/
│   ├── posts.ts                   # 文章数据处理
│   └── markdown.ts                # Markdown 转 HTML
├── public/
│   └── images/                    # 图片资源（待添加）
├── GISCUS_SETUP.md                # Giscus 配置指南
└── package.json
```

---

## 🔧 技术栈

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS + @tailwindcss/typography
- **Markdown**：gray-matter + unified + remark + rehype
- **数学公式**：KaTeX (remark-math + rehype-katex)
- **评论系统**：Giscus (GitHub Discussions)
- **部署**：GitHub Pages

---

## 📝 下次开发建议

### 第一步：卡片式文章列表（最实用）
1. 修改 `app/blog/page.tsx`
2. 添加卡片样式到 `app/globals.css`
3. 可选：添加文章封面图到 frontmatter

### 第二步：导航栏滚动效果（简单但效果好）
1. 修改 `components/Header.tsx`
2. 添加 `useEffect` 监听滚动
3. 添加透明样式

### 第三步：主题色调自定义（有趣的功能）
1. 创建 `components/ThemeCustomizer.tsx`
2. 修改 CSS 使用 HSL 变量
3. 添加 localStorage 持久化

---

## 🐛 已知问题

- 无

---

## 📞 联系方式

- GitHub: https://github.com/Redem714233
- 网站: https://redem714233.github.io/

---

## 📅 更新日志

### 2025-02-XX（今天）
- ✅ 修复 404 链接，替换为实际论文链接
- ✅ 目录从右侧移到左侧
- ✅ 添加 KaTeX 数学公式支持
- ✅ 集成 Giscus 评论系统
- ✅ 优化视觉设计（学习 Lee Robinson）
- ✅ 学习 emohe.cn 和 rlightz7if.github.io 的设计
- 📋 规划未来功能开发

---

**下次开发时，直接告诉我："继续开发博客"，我会从这个文档继续工作！**
