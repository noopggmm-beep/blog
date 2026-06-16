import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { TagBadge } from "@/components/ui/tag-badge";
import { BackToTop } from "@/components/ui/back-to-top";
import { mdxComponents } from "@/components/mdx/mdx-components";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import { compileMdx } from "@/lib/markdown";
import { formatDate } from "@/lib/utils";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { SITE } from "@/lib/constants";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const zhPosts = getAllPosts("zh");
  const enPosts = getAllPosts("en");
  return [...zhPosts, ...enPosts].map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug) || getPostBySlug(slug, "en");
  if (!post) return { title: "Not Found" };
  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    openGraph: {
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      type: "article",
      publishedTime: post.frontmatter.date,
      tags: post.frontmatter.tags,
      url: `${SITE.url}/posts/${post.slug}`,
      ...(post.frontmatter.coverImage ? { images: [{ url: post.frontmatter.coverImage }] } : {}),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "zh") as Lang;

  const post = getPostBySlug(slug, lang);
  if (!post) notFound();

  const content = await compileMdx(post.content);

  return (
    <Container>
      <article className="py-12 sm:py-16">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-6 h-px bg-[var(--accent)]" />
            <span className="text-xs font-mono text-[var(--accent)] uppercase tracking-wider">
              {t(lang, "postArticle")}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
            <span className="gradient-text">{post.frontmatter.title}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-5 text-sm text-[var(--muted)] font-mono">
            <time dateTime={post.frontmatter.date}>{formatDate(post.frontmatter.date)}</time>
            <span className="text-[var(--border)]">│</span>
            <span>{post.readingTime} {t(lang, "postMinRead")}</span>
            <span className="text-[var(--border)]">│</span>
            <span>noopggmm</span>
          </div>
          {post.frontmatter.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5 pt-4 border-t border-[var(--border)]">
              {post.frontmatter.tags.map((tag) => <TagBadge key={tag} tag={tag} />)}
            </div>
          )}
        </header>
        <div className="prose dark:prose-invert max-w-none">{content}</div>
        <div className="mt-16 pt-8 border-t border-[var(--border)]">
          <a href="/" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            {t(lang, "postBackHome")}
          </a>
        </div>
      </article>
      <BackToTop />
    </Container>
  );
}
