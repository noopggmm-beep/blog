import { Container } from "@/components/ui/container";
import { PostList } from "@/components/posts/post-list";
import { Pagination } from "@/components/ui/pagination";
import { BackToTop } from "@/components/ui/back-to-top";
import { getPaginatedPosts } from "@/lib/posts";
import { SITE } from "@/lib/constants";
import Link from "next/link";

interface HomePageProps {
  searchParams: Promise<{ page?: string }>;
}

const COLUMNS = [
  {
    href: "/innovation",
    icon: "🚀",
    label: "科技创新",
    desc: "前沿科技与创新洞察",
    color: "var(--accent)",
  },
  {
    href: "/ip",
    icon: "⚖️",
    label: "知识产权",
    desc: "专利分析与IP战略",
    color: "var(--accent-2)",
  },
  {
    href: "/news/international",
    icon: "🌍",
    label: "国际新闻",
    desc: "全球十大新闻分析",
    color: "var(--gradient-2)",
  },
  {
    href: "/news/domestic",
    icon: "🇨🇳",
    label: "国内新闻",
    desc: "国内十大新闻汇总",
    color: "var(--gradient-3)",
  },
];

export default async function HomePage({ searchParams }: HomePageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam || "1", 10) || 1);
  const { posts, totalPages } = getPaginatedPosts(page, SITE.postsPerPage);

  return (
    <>
      {/* Hero Section — nature + tech */}
      <section className="hero-bg relative overflow-hidden">
        {/* Mountain decorative SVG */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
          <svg
            viewBox="0 0 1440 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto opacity-[0.07] dark:opacity-[0.10]"
          >
            <path
              d="M0 200L120 150L240 170L360 100L480 140L600 60L720 120L840 80L960 130L1080 70L1200 110L1320 50L1440 90V200H0Z"
              fill="var(--gradient-1)"
            />
            <path
              d="M0 200L100 160L200 180L300 130L500 160L600 110L700 145L800 100L1000 150L1100 120L1200 140L1300 100L1440 130V200H0Z"
              fill="var(--gradient-2)"
              opacity="0.6"
            />
            <path
              d="M0 200L80 175L200 190L350 150L450 170L550 140L700 165L850 135L950 155L1150 125L1250 150L1350 130L1440 155V200H0Z"
              fill="var(--gradient-3)"
              opacity="0.4"
            />
          </svg>
        </div>

        <Container className="relative z-[1]">
          <div className="py-16 sm:py-24 text-center">
            {/* Decorative line */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="block w-8 h-px bg-gradient-to-r from-transparent to-[var(--accent)]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] glow-pulse" />
              <span className="block w-8 h-px bg-gradient-to-l from-transparent to-[var(--accent)]" />
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
              <span className="gradient-text">{SITE.title}</span>
            </h1>
            <p className="text-base sm:text-lg text-[var(--muted)] max-w-xl mx-auto leading-relaxed">
              {SITE.description}
            </p>

            {/* Column cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 max-w-2xl mx-auto">
              {COLUMNS.map((col) => (
                <Link
                  key={col.href}
                  href={col.href}
                  className="glass glass-hover p-4 rounded-xl text-center group"
                >
                  <span className="text-2xl block mb-2">{col.icon}</span>
                  <span className="text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                    {col.label}
                  </span>
                  <span className="text-xs text-[var(--muted)] block mt-0.5">
                    {col.desc}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Latest Posts Section */}
      <section className="relative z-[1]">
        <Container>
          <div className="py-8 sm:py-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-[var(--accent)]" />
                最新文章
              </h2>
              <Link
                href="/tags"
                className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
              >
                标签云 →
              </Link>
            </div>
            <PostList posts={posts} />
            <Pagination currentPage={page} totalPages={totalPages} />
          </div>
        </Container>
      </section>

      <BackToTop />
    </>
  );
}
