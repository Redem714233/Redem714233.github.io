import Link from 'next/link';
import { ProjectCard } from '@/components/ProjectCard';
import { Header } from '@/components/Header';
import { getAllPosts } from '@/lib/posts';

const projects = [
  {
    title: 'GUIAgent',
    description: '基于 FastAPI + Playwright + VLM/LLM 的网页自动化系统，支持 DOM 标注、反思重试、SSE 流式执行和结构化数据提取',
    tags: ['Python', 'FastAPI', 'Playwright', 'VLM', 'React'],
    link: 'https://github.com/Redem714233/GuiAgent',
  },
  {
    title: 'GEEPAFS - GPU 能效优化研究',
    description: '通过 DVFS 动态频率调节提升 GPU 能效的应用透明策略，RTX 4070 上能效提升 0.4%~5.4%，功耗平均降低 6%~13%，性能损失 3%~14%',
    tags: ['CUDA', 'NVML', 'GPU', 'DVFS', 'C'],
    link: 'https://github.com/Redem714233/Research-on-accelerating-computations-on-GPUs-through-DVFS',
  },
];

const skills = [
  {
    category: '前端开发',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'],
  },
  {
    category: '后端开发',
    items: ['Python', 'FastAPI', 'Node.js', 'PostgreSQL', 'Redis'],
  },
  {
    category: '系统 & 性能',
    items: ['CUDA', 'GPU 优化', 'DVFS', 'C/C++', 'Linux'],
  },
  {
    category: 'AI & ML',
    items: ['LLM', 'VLM', 'PyTorch', 'Playwright', 'Agent 开发'],
  },
];

export default function Home() {
  const recentPosts = getAllPosts().slice(0, 2);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="mb-20 text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            👋 欢迎来到我的技术空间
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Hi, I'm Redem
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            全栈开发者 / AI 研究者 / 性能优化爱好者
          </p>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            专注于构建高性能 Web 应用、AI Agent 系统和 GPU 计算优化。
            热衷于探索前沿技术，分享实践经验。
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/blog"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              阅读博客
            </Link>
            <Link
              href="https://github.com/Redem714233"
              target="_blank"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
            >
              GitHub
            </Link>
          </div>
        </section>

        {/* Skills Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 text-center">
            技术栈
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                  {skill.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skill.items.map((item, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section className="mb-20">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              精选项目
            </h2>
            <Link
              href="https://github.com/Redem714233"
              target="_blank"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              更多项目 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} />
            ))}
          </div>
        </section>

        {/* Blog Section */}
        <section className="mb-20">
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
          {recentPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {post.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                    {post.date}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                博客文章即将发布，敬请期待...
              </p>
            </div>
          )}
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-2xl p-8 md:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              让我们一起交流技术
            </h2>
            <p className="text-lg mb-8 opacity-90">
              对我的项目感兴趣？想要讨论技术问题？欢迎联系我！
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="https://github.com/Redem714233"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                GitHub
              </a>
              <a
                href="mailto:your-email@example.com"
                className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-colors font-medium border border-white/20"
              >
                Email
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 dark:text-gray-400">
              © 2025 Redem714233. Built with Next.js & Tailwind CSS
            </p>
            <div className="flex gap-6">
              <Link
                href="/blog"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                博客
              </Link>
              <a
                href="https://github.com/Redem714233"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
