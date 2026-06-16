import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PostList } from "@/components/posts/post-list";
import { getPostsByTag } from "@/lib/posts";

export const metadata: Metadata = {
  title: "国际十大新闻",
  description: "每日国际十大新闻深度分析，洞察全球格局变化",
};

export default function InternationalNewsPage() {
  const posts = getPostsByTag("国际十大新闻");

  return (
    <Container>
      <div className="py-12 sm:py-16">
        {/* Header */}
        <section className="hero-bg relative overflow-hidden rounded-xl mb-12">
          <div className="relative z-[1] py-16 px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--gradient-2)]" />
              <span className="text-3xl">🌍</span>
              <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[var(--gradient-2)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="gradient-text">国际十大新闻</span>
            </h1>
            <p className="mt-3 text-[var(--muted)] max-w-lg mx-auto">
              每日国际要闻深度分析，洞察全球格局变化 · 共 {posts.length} 篇
            </p>
          </div>
        </section>

        <PostList posts={posts} />
      </div>
    </Container>
  );
}
