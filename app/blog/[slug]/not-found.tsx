import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-4">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          文章未找到
        </p>
        <Link
          href="/blog"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回博客列表
        </Link>
      </div>
    </div>
  );
}
