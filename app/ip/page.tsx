import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PostList } from "@/components/posts/post-list";
import { getPostsByTag } from "@/lib/posts";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "知识产权",
  description: "专利分析、商标保护、知识产权战略 — 专业视角的知识产权洞察",
};

export default function IPPage() {
  const posts = getPostsByTag("知识产权");

  return (
    <Container>
      <div className="py-12 sm:py-16">
        {/* Header */}
        <section className="hero-bg relative overflow-hidden rounded-xl mb-12">
          <div className="relative z-[1] py-16 px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--accent-2)]" />
              <span className="text-3xl">⚖️</span>
              <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[var(--accent-2)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="gradient-text">知识产权</span>
            </h1>
            <p className="mt-3 text-[var(--muted)] max-w-lg mx-auto">
              专利分析 · 商标保护 · 知识产权战略 · 共 {posts.length} 篇文章
            </p>
          </div>
        </section>

        <PostList posts={posts} />
      </div>
    </Container>
  );
}
