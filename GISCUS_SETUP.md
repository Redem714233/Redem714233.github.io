# Giscus 评论系统配置指南

## 📋 配置步骤

### 1. 启用 GitHub Discussions

1. 访问仓库：https://github.com/Redem714233/Redem714233.github.io
2. 点击 **Settings** 标签
3. 向下滚动到 **Features** 区域
4. 勾选 ✅ **Discussions**

### 2. 安装 Giscus App

1. 访问：https://github.com/apps/giscus
2. 点击 **Install**
3. 选择仓库：`Redem714233/Redem714233.github.io`
4. 点击 **Install & Authorize**

### 3. 获取配置参数

1. 访问：https://giscus.app/zh-CN
2. 在 **仓库** 输入框填写：`Redem714233/Redem714233.github.io`
3. 等待验证通过（显示绿色勾号）
4. **Discussion 分类** 选择：`Announcements`
5. 向下滚动，复制生成的配置中的两个参数：
   - `data-repo-id="R_xxxxx"`
   - `data-category-id="DIC_xxxxx"`

### 4. 更新代码

打开 `components/Comments.tsx`，替换以下两行：

```typescript
script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // 替换为实际的 repo-id
script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // 替换为实际的 category-id
```

### 5. 提交并部署

```bash
git add .
git commit -m "Configure Giscus comment system"
git push origin main
```

## ✅ 完成后

- 访客可以在每篇博客文章底部看到评论区
- 需要 GitHub 账号登录才能评论
- 所有评论存储在你的 GitHub Discussions 中
- 支持 Markdown、代码高亮、表情符号

## 🎨 自定义主题

评论区会自动适配网站的深色/浅色模式（`preferred_color_scheme`）。

如果需要固定主题，修改 `Comments.tsx` 中的：
```typescript
script.setAttribute('data-theme', 'light'); // 或 'dark'
```
