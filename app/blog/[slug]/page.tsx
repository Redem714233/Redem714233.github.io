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
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline mb-8"
          >
            ← 返回博客列表
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
              prose-headings:text-gray-800 dark:prose-headings:text-gray-100
              prose-p:text-gray-700 dark:prose-p:text-gray-300
              prose-a:text-blue-600 dark:prose-a:text-blue-400
              prose-strong:text-gray-800 dark:prose-strong:text-gray-100
              prose-code:text-gray-800 dark:prose-code:text-gray-100
              prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900
              prose-table:text-gray-700 dark:prose-table:text-gray-300"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </article>
      </div>
    );
  } catch (error) {
    notFound();
  }
}
