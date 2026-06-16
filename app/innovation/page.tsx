import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PostList } from "@/components/posts/post-list";
import { getPostsByTag } from "@/lib/posts";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "科技创新",
  description: "关注前沿科技动态，洞察技术发展趋势",
};

export default function InnovationPage() {
  const posts = getPostsByTag("科技创新");

  return (
    <Container>
      <div className="py-12 sm:py-16">
        {/* Header */}
        <section className="hero-bg relative overflow-hidden rounded-xl mb-12">
          <div className="relative z-[1] py-16 px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--accent)]" />
              <span className="text-3xl">🚀</span>
              <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[var(--accent)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="gradient-text">科技创新</span>
            </h1>
            <p className="mt-3 text-[var(--muted)] max-w-lg mx-auto">
              关注前沿科技动态，洞察技术发展趋势 · 共 {posts.length} 篇文章
            </p>
          </div>
        </section>

        <PostList posts={posts} />
      </div>
    </Container>
  );
}
