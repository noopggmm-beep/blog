import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PostList } from "@/components/posts/post-list";
import { getPostsByTag } from "@/lib/posts";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = { title: "Top 10 World News", description: "Daily world news in-depth analysis" };

export default async function InternationalNewsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "zh") as Lang;
  const posts = getPostsByTag("国际十大新闻", lang);

  return (
    <Container>
      <div className="py-12 sm:py-16">
        <section className="hero-bg relative overflow-hidden rounded-xl mb-12">
          <div className="relative z-[1] py-16 px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--gradient-2)]" />
              <span className="text-3xl">🌍</span>
              <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[var(--gradient-2)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              <span className="gradient-text">{t(lang, "colIntlNews")}</span>
            </h1>
            <p className="mt-3 text-[var(--muted)] max-w-lg mx-auto">
              {t(lang, "colIntlNewsDesc")} · {t(lang, "colPostsCount", { count: posts.length })}
            </p>
          </div>
        </section>
        <PostList posts={posts} />
        <div className="text-center mt-8">
          <Link href="/tags/国际十大新闻" className="inline-flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            📂 {lang === "zh" ? "历史新闻" : "History"} →
          </Link>
        </div>
      </div>
    </Container>
  );
}
