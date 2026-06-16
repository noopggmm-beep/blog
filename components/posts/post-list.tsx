"use client";

import { PostCard } from "./post-card";
import { useLanguage } from "@/components/ui/language-provider";
import { t } from "@/lib/i18n";
import type { PostMeta } from "@/types/post";

export function PostList({ posts }: { posts: PostMeta[] }) {
  const { lang } = useLanguage();

  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--muted)]">
        <div className="text-5xl mb-4">🌿</div>
        <p className="text-lg">{t(lang, "postNoPosts")}</p>
        <p className="text-sm mt-1">{t(lang, "postNoPostsHint")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post, index) => (
        <div key={post.slug} style={{ animationDelay: `${index * 80}ms` }}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
