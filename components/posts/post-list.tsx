import { PostCard } from "./post-card";
import type { PostMeta } from "@/types/post";

export function PostList({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-20 text-[var(--muted)]">
        <div className="text-5xl mb-4">🌿</div>
        <p className="text-lg">还没有文章</p>
        <p className="text-sm mt-1">新文章即将发布，敬请期待</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post, index) => (
        <div
          key={post.slug}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
