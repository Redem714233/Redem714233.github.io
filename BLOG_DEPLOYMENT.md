# 博客部署指南

## 📦 安装依赖

```bash
npm install
```

这会安装以下新增的依赖：
- `gray-matter`: 解析 markdown frontmatter
- `remark`: markdown 处理器
- `remark-html`: 将 markdown 转换为 HTML
- `@tailwindcss/typography`: Tailwind 的排版插件（用于美化文章样式）

## 🚀 本地开发

```bash
npm run dev
```

访问 http://localhost:3000/blog 查看博客列表

## 📝 添加新文章

1. 在 `app/blog/posts/` 目录下创建新的 `.md` 文件
2. 文件名将作为 URL slug（如 `my-post.md` → `/blog/my-post`）
3. 文件开头必须包含 frontmatter：

```markdown
---
title: "文章标题"
date: "2025-02-27"
tags: ["标签1", "标签2"]
description: "文章简介"
---

# 文章内容

这里是正文...
```

## 🌐 部署到 GitHub Pages

```bash
npm run deploy
```

这会：
1. 构建静态网站（`next build`）
2. 导出静态文件到 `out/` 目录
3. 创建 `.nojekyll` 文件（禁用 Jekyll）
4. 推送到 `gh-pages` 分支

## 📂 项目结构

```
.
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   ├── page.tsx          # 文章详情页
│   │   │   └── not-found.tsx     # 404 页面
│   │   ├── posts/                # 博客文章（markdown）
│   │   │   ├── geepafs-gpu-energy-optimization.md
│   │   │   └── llm-safety-instruction-following.md
│   │   └── page.tsx              # 博客列表页
├── lib/
│   ├── posts.ts                  # 文章读取逻辑
│   └── markdown.ts               # markdown 转 HTML
└── package.json
```

## ✅ 当前已有文章

1. **GEEPAFS：GPU 能效优化的论文复现与实践**
   - 文件：`geepafs-gpu-energy-optimization.md`
   - 日期：2025-11-18
   - 标签：GPU, DVFS, 能效优化, CUDA, 系统优化

2. **大语言模型的安全性与指令遵循：两篇论文的深度解读**
   - 文件：`llm-safety-instruction-following.md`
   - 日期：2025-07-27
   - 标签：LLM, AI Safety, Fine-tuning, Instruction Following

## 🎨 样式说明

文章使用 Tailwind Typography 插件渲染，支持：
- 标题层级（h1-h6）
- 代码块（带语法高亮）
- 表格
- 列表
- 引用
- 链接
- 深色模式

## 🔧 故障排查

### 问题：文章不显示

检查：
1. markdown 文件是否在 `app/blog/posts/` 目录
2. frontmatter 格式是否正确
3. 文件扩展名是否为 `.md`

### 问题：样式不正确

检查：
1. 是否安装了 `@tailwindcss/typography`
2. `tailwind.config.ts` 是否包含 typography 插件
3. 重新构建：`npm run build`

### 问题：部署失败

检查：
1. 是否安装了 `gh-pages`：`npm install -D gh-pages`
2. GitHub 仓库设置中是否启用了 GitHub Pages
3. 分支是否设置为 `gh-pages`

## 📚 参考资料

- [Next.js 文档](https://nextjs.org/docs)
- [Tailwind Typography](https://tailwindcss.com/docs/typography-plugin)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [remark](https://github.com/remarkjs/remark)
