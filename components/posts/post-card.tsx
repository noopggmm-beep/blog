import Link from "next/link";
import { TagBadge } from "@/components/ui/tag-badge";
import { formatDate } from "@/lib/utils";
import type { PostMeta } from "@/types/post";

export function PostCard({ post }: { post: PostMeta }) {
  return (
    <article className="group glass glass-hover p-6 cursor-pointer">
      <Link href={`/posts/${post.slug}`} className="block space-y-3">
        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-[var(--muted)] font-mono">
          <time dateTime={post.frontmatter.date}>
            {formatDate(post.frontmatter.date)}
          </time>
          <span className="text-[var(--border)]">│</span>
          <span>{post.readingTime} min read</span>
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold leading-snug text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors duration-200">
          {post.frontmatter.title}
        </h2>

        {/* Description */}
        {post.frontmatter.description && (
          <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2">
            {post.frontmatter.description}
          </p>
        )}
      </Link>

      {/* Tags */}
      {post.frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-[var(--border)]">
          {post.frontmatter.tags.map((tag) => (
            <TagBadge key={tag} tag={tag} />
          ))}
        </div>
      )}

      {/* Decorative corner glow on hover */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[var(--glow)] to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </article>
  );
}
