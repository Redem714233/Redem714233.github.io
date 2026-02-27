import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { Header } from '@/components/Header';

const projects = [
  {
    title: '项目示例 1',
    description: '这是一个示例项目描述，展示你的技术栈和实现细节',
    tags: ['React', 'TypeScript', 'Next.js'],
    link: 'https://github.com/Redem714233',
    demo: '#',
  },
  {
    title: '项目示例 2',
    description: '另一个精彩的项目，解决了某个实际问题',
    tags: ['Node.js', 'PostgreSQL', 'Docker'],
    link: 'https://github.com/Redem714233',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center">
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Hi, I'm Redem
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            全栈开发者 / 技术爱好者
          </p>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            专注于构建优雅的 Web 应用和分享技术见解
          </p>
        </section>

        {/* Projects Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
            精选项目
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              最新博客
            </h2>
            <Link
              href="/blog"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              查看全部 →
            </Link>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <p className="text-gray-500 dark:text-gray-400">
              博客功能即将上线...
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-600 dark:text-gray-400">
          <p>© 2026 Redem714233. Built with Next.js & Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}
