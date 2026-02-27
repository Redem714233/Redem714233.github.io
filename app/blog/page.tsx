import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          技术博客
        </h1>

        {posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
            <p className="text-gray-600 dark:text-gray-300">
              博客文章即将发布，敬请期待...
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
