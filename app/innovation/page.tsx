import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PostList } from "@/components/posts/post-list";
import { getPostsByTag } from "@/lib/posts";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Tech Innovation",
  description: "Frontier tech insights and trends",
};

export default async function InnovationPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "zh") as Lang;
  const posts = getPostsByTag("科技创新");

  return (
    <Container>
      <div className="py-12 sm:py-16">
        <section className="hero-bg relative overflow-hidden rounded-xl mb-12">
          <div className="relative z-[1] py-16 px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--accent)]" />
              <span className="text-3xl">🚀</span>
              <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[var(--accent)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="gradient-text">{t(lang, "colInnovation")}</span>
            </h1>
            <p className="mt-3 text-[var(--muted)] max-w-lg mx-auto">
              {t(lang, "colInnovationDesc")} · {t(lang, "colPostsCount", { count: posts.length })}
            </p>
          </div>
        </section>
        <PostList posts={posts} />
      </div>
    </Container>
  );
}
