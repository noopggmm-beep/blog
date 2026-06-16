import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostMeta, TagCount } from "@/types/post";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readPostFiles(): { slug: string; raw: string }[] {
  if (!fs.existsSync(POSTS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => ({
    slug: filename.replace(/\.mdx$/, ""),
    raw: fs.readFileSync(path.join(POSTS_DIR, filename), "utf-8"),
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

let cached: Post[] | null = null;

function getAllPostsInternal(): Post[] {
  if (cached) return cached;
  const files = readPostFiles();
  cached = files.map(parsePost).sort((a, b) => {
    if (a.frontmatter.date > b.frontmatter.date) return -1;
    if (a.frontmatter.date < b.frontmatter.date) return 1;
    return 0;
  });
  return cached;
}

export function getAllPosts(): Post[] {
  return getAllPostsInternal().filter(
    (p) => !p.frontmatter.draft || process.env.NODE_ENV === "development"
  );
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPosts().map(({ slug, frontmatter, readingTime }) => ({
    slug,
    frontmatter,
    readingTime,
  }));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getAllTags(): TagCount[] {
  const tagMap = new Map<string, number>();

  for (const post of getAllPosts()) {
    for (const tag of post.frontmatter.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostsMeta().filter((p) =>
    p.frontmatter.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

export function getPaginatedPosts(
  page: number,
  perPage: number
): { posts: PostMeta[]; totalPages: number } {
  const all = getAllPostsMeta();
  const totalPages = Math.max(1, Math.ceil(all.length / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * perPage;
  const posts = all.slice(start, start + perPage);

  return { posts, totalPages };
}
