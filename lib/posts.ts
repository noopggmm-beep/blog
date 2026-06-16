import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta, TagCount } from "@/types/post";
import type { Lang } from "@/lib/i18n";

function getPostsDir(lang: Lang): string {
  const base = path.join(process.cwd(), "content", "posts");
  if (lang === "en") {
    const enDir = path.join(base, "en");
    if (fs.existsSync(enDir)) return enDir;
  }
  return base;
}

function readPostFiles(lang: Lang): { slug: string; raw: string }[] {
  const dir = getPostsDir(lang);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ""),
    raw: fs.readFileSync(path.join(dir, filename), "utf-8"),
  }));
}

function parsePost(file: { slug: string; raw: string }): Post {
  const { data, content } = matter(file.raw);
  const stats = readingTime(content);

  return {
    slug: file.slug,
    frontmatter: {
      title: data.title || file.slug,
      description: data.description || "",
      date: data.date || new Date().toISOString().slice(0, 10),
      tags: data.tags || [],
      coverImage: data.coverImage,
      draft: data.draft ?? false,
    },
    content,
    readingTime: Math.ceil(stats.minutes),
  };
}

// Cache per language
const cache: Record<string, Post[]> = {};

function getAllPostsInternal(lang: Lang): Post[] {
  const cacheKey = lang;
  if (cache[cacheKey]) return cache[cacheKey];

  const files = readPostFiles(lang);
  cache[cacheKey] = files.map(parsePost).sort((a, b) => {
    if (a.frontmatter.date > b.frontmatter.date) return -1;
    if (a.frontmatter.date < b.frontmatter.date) return 1;
    return 0;
  });
  return cache[cacheKey];
}

export function getAllPosts(lang: Lang = "zh"): Post[] {
  return getAllPostsInternal(lang).filter(
    (p) => !p.frontmatter.draft || process.env.NODE_ENV === "development"
  );
}

export function getAllPostsMeta(lang: Lang = "zh"): PostMeta[] {
  return getAllPosts(lang).map(({ slug, frontmatter, readingTime }) => ({
    slug,
    frontmatter,
    readingTime,
  }));
}

export function getPostBySlug(slug: string, lang: Lang = "zh"): Post | undefined {
  return getAllPosts(lang).find((p) => p.slug === slug);
}

export function getAllTags(lang: Lang = "zh"): TagCount[] {
  const tagMap = new Map<string, number>();

  for (const post of getAllPosts(lang)) {
    for (const tag of post.frontmatter.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string, lang: Lang = "zh"): PostMeta[] {
  return getAllPostsMeta(lang).filter((p) =>
    p.frontmatter.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getPaginatedPosts(
  page: number,
  perPage: number,
  lang: Lang = "zh"
): { posts: PostMeta[]; totalPages: number } {
  const all = getAllPostsMeta(lang);
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const posts = all.slice(start, start + perPage);

  return { posts, totalPages };
}
