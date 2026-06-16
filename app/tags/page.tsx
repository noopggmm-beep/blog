import { cookies } from "next/headers";
import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAllTags } from "@/lib/posts";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = { title: "Tags", description: "Browse all article tags" };

export default async function TagsPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "zh") as Lang;
  const tags = getAllTags(lang);

  if (tags.length === 0) {
    return (
      <Container>
        <div className="py-20 text-center text-[var(--muted)]">
          <div className="text-5xl mb-4">🏷️</div>
          <p>{t(lang, "tagsNoTags")}</p>
        </div>
      </Container>
    );
  }

  const maxCount = tags[0]?.count || 1;

  return (
    <Container>
      <div className="py-12 sm:py-16">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">{t(lang, "tagsTitle")}</span>
          </h1>
          <p className="mt-2 text-[var(--muted)]">{t(lang, "tagsCount", { count: tags.length })}</p>
        </div>
        <div className="glass p-8">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {tags.map((tag) => {
              const scale = 0.75 + (tag.count / maxCount) * 0.6;
              const size = Math.round(14 * scale);
              return (
                <Link
                  key={tag.name}
                  href={`/tags/${tag.name}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)] hover:shadow-[0_0_12px_var(--glow)] transition-all duration-200"
                  style={{ fontSize: `${size}px` }}
                >
                  <span>#{tag.name}</span>
                  <span className="text-[var(--muted)] text-xs">({tag.count})</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </Container>
  );
}
