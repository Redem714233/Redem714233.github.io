import Link from 'next/link';
import { getAllPosts, PostMetadata } from '@/lib/posts';

export default function BlogPage() {
  let posts: PostMetadata[] = [];
  try {
    posts = getAllPosts();
  } catch (error) {
    console.error('Failed to load posts:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-6 group"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回主页
          </Link>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100">
            技术博客
          </h1>
        </div>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <p className="text-gray-600 dark:text-gray-300">
              博客文章加载中...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6"
              >
                <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  {post.date}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
