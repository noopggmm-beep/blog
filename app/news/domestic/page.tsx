import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PostCard } from "@/components/posts/post-card";
import { getPostsByTagGroupedByDate } from "@/lib/posts";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = { title: "Top 10 China News", description: "Daily China news highlights" };

function formatGroupDate(dateStr: string, lang: Lang) {
  const d = new Date(dateStr);
  return lang === "zh" ? `${d.getMonth() + 1}月${d.getDate()}日` : d.toLocaleDateString("en-US", { month: "long", day: "numeric" });
}

export default async function DomesticNewsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "zh") as Lang;
  const { recent, older } = getPostsByTagGroupedByDate("国内十大新闻", lang, 7);

  return (
    <Container>
      <div className="py-12 sm:py-16">
        <section className="hero-bg relative overflow-hidden rounded-xl mb-10">
          <div className="relative z-[1] py-12 px-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--gradient-3)]" />
              <span className="text-3xl">🇨🇳</span>
              <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[var(--gradient-3)]" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight"><span className="gradient-text">{t(lang, "colDomNews")}</span></h1>
            <p className="mt-3 text-[var(--muted)]">{t(lang, "colDomNewsDesc")}</p>
          </div>
        </section>
        {recent.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted)]"><div className="text-5xl mb-4">📡</div><p className="text-lg">{lang === "zh" ? "暂无近期新闻" : "No recent news"}</p></div>
        ) : (
          <div className="space-y-10">
            {recent.map((group) => (
              <section key={group.date}>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 sticky top-14 z-10 py-2 bg-[var(--bg)]/80 backdrop-blur-sm">
                  <span className="w-1.5 h-5 rounded-full bg-[var(--accent)]" />
                  {formatGroupDate(group.date, lang)}
                  <span className="text-sm font-normal text-[var(--muted)]">({group.posts.length} {lang === "zh" ? "条" : "items"})</span>
                </h2>
                <div className="space-y-4">{group.posts.map((post) => <PostCard key={post.slug} post={post} />)}</div>
              </section>
            ))}
          </div>
        )}
        {older.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t border-[var(--border)]">
            <Link href="/tags/国内十大新闻" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass glass-hover text-sm">
              <span className="text-xl">📂</span><span>{lang === "zh" ? "历史新闻" : "History"}</span>
              <span className="text-[var(--muted)]">({older.length} {lang === "zh" ? "篇" : "posts"})</span>
              <span className="text-[var(--accent)]">→</span>
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
