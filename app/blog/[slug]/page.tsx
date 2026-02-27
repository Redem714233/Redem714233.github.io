import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';

export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const post = getPostBySlug(slug);
    const contentHtml = await markdownToHtml(post.content);

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <article className="max-w-4xl mx-auto px-4 py-16">
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8 group"
          >
            <svg
              className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回博客列表
          </Link>

          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100">
              {post.title}
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 mb-4">
              <time>{post.date}</time>
            </div>
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
          </header>

          <div
            className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-50
              prose-p:text-gray-800 dark:prose-p:text-gray-200 prose-p:leading-relaxed
              prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-medium
              prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold
              prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:font-mono prose-code:text-sm
              prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100
              prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:border-blue-500
              prose-li:text-gray-800 dark:prose-li:text-gray-200
              prose-table:text-gray-800 dark:prose-table:text-gray-200
              prose-th:text-gray-900 dark:prose-th:text-gray-100 prose-th:font-semibold
              prose-td:text-gray-800 dark:prose-td:text-gray-200"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <Link
              href="/blog"
              className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline group"
            >
              <svg
                className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              返回博客列表
            </Link>
          </div>
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
