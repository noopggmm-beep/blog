import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PostList } from "@/components/posts/post-list";
import { getAllTags, getPostsByTag } from "@/lib/posts";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

interface TagPageProps {
  params: Promise<{ tag: string }>;
}

export async function generateStaticParams() {
  const zhTags = getAllTags("zh");
  const enTags = getAllTags("en");
  return [...zhTags, ...enTags].map((tag) => ({ tag: tag.name }));
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  return { title: `#${tag}`, description: `Posts tagged "${tag}"` };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "zh") as Lang;
  const posts = getPostsByTag(tag, lang);
  if (posts.length === 0) notFound();

  return (
    <Container>
      <div className="py-12 sm:py-16">
        <div className="mb-10">
          <p className="text-sm text-[var(--muted)] mb-2">
            <a href="/tags" className="hover:text-[var(--accent)] transition-colors">
              {t(lang, "tagsAllTags")}
            </a>
          </p>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-[var(--muted)]">#</span>
            <span className="gradient-text">{tag}</span>
          </h1>
          <p className="mt-2 text-[var(--muted)]">{t(lang, "tagsPostsCount", { count: posts.length })}</p>
        </div>
        <PostList posts={posts} />
      </div>
    </Container>
  );
}
