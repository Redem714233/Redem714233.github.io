export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          技术博客
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <p className="text-gray-600 dark:text-gray-300">
            博客文章即将发布，敬请期待...
          </p>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            你可以在这里分享技术心得、项目经验、学习笔记等内容
          </p>
        </div>
      </div>
    </div>
  );
}
