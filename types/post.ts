export interface Frontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  coverImage?: string;
  draft?: boolean;
}

export interface Post {
  slug: string;
  frontmatter: Frontmatter;
  content: string;
  readingTime: number;
}

export interface PostMeta {
  slug: string;
  frontmatter: Frontmatter;
  readingTime: number;
}

export interface TagCount {
  name: string;
  count: number;
}
