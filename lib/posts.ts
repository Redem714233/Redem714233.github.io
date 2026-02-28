import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'app/blog/posts');

export interface PostMetadata {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  excerpt?: string;
  readingTime?: number;
  coverImage?: string;
}

export interface Post extends PostMetadata {
  content: string;
}

// 计算阅读时间（基于字数）
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const chineseChars = content.match(/[\u4e00-\u9fa5]/g)?.length || 0;
  const englishWords = content.match(/[a-zA-Z]+/g)?.length || 0;
  const totalWords = chineseChars + englishWords;
  return Math.ceil(totalWords / wordsPerMinute);
}

// 提取文章摘要（前150字）
function extractExcerpt(content: string): string {
  const plainText = content
    .replace(/^---[\s\S]*?---/, '') // 移除 frontmatter
    .replace(/```[\s\S]*?```/g, '') // 移除代码块
    .replace(/`[^`]*`/g, '') // 移除行内代码
    .replace(/#{1,6}\s/g, '') // 移除标题标记
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 移除链接，保留文字
    .replace(/[*_~]/g, '') // 移除格式标记
    .replace(/\n+/g, ' ') // 替换换行为空格
    .trim();

  return plainText.length > 150 ? plainText.slice(0, 150) + '...' : plainText;
}

export function getAllPosts(): PostMetadata[] {
  try {
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Posts directory not found: ${postsDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    const allPostsData = fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => {
        const slug = fileName.replace(/\.md$/, '');
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          slug,
          title: data.title,
          date: data.date,
          tags: data.tags || [],
          description: data.description || '',
          excerpt: data.description || extractExcerpt(content),
          readingTime: calculateReadingTime(content),
          coverImage: data.coverImage || undefined,
        };
      });

    return allPostsData.sort((a, b) => (a.date < b.date ? 1 : -1));
  } catch (error) {
    console.error('Error reading posts:', error);
    return [];
  }
}

export function getPostBySlug(slug: string): Post {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date,
    tags: data.tags || [],
    description: data.description || '',
    content,
  };
}

export function getAllPostSlugs() {
  try {
    if (!fs.existsSync(postsDirectory)) {
      return [];
    }

    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames
      .filter((fileName) => fileName.endsWith('.md'))
      .map((fileName) => ({
        slug: fileName.replace(/\.md$/, ''),
      }));
  } catch (error) {
    console.error('Error reading post slugs:', error);
    return [];
  }
}
