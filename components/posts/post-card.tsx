"use client";

import Link from "next/link";
import { TagBadge } from "@/components/ui/tag-badge";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/components/ui/language-provider";
import { t } from "@/lib/i18n";
import type { PostMeta } from "@/types/post";

export function PostCard({ post }: { post: PostMeta }) {
  const { lang } = useLanguage();

  return (
    <article className="group glass glass-hover p-6 cursor-pointer">
      <Link href={`/posts/${post.slug}`} className="block space-y-3">
        <div className="flex items-center gap-3 text-xs text-[var(--muted)] font-mono">
          <time dateTime={post.frontmatter.date}>
            {formatDate(post.frontmatter.date)}
          </time>
          <span className="text-[var(--border)]">│</span>
          <span>{post.readingTime} {t(lang, "postMinRead")}</span>
        </div>
        <h2 className="text-lg font-semibold leading-snug text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-200">
          {post.frontmatter.title}
        </h2>
        {post.frontmatter.description && (
          <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
            {post.frontmatter.description}
          </p>
        )}
      </Link>
      {post.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[var(--border)]">
          {post.frontmatter.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--glow)] to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </article>
  );
}
