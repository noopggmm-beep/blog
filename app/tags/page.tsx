import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { getAllTags } from "@/lib/posts";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "标签",
  description: `浏览 ${SITE.title} 的所有文章标签`,
};

export default function TagsPage() {
  const tags = getAllTags();

  if (tags.length === 0) {
    return (
      <Container>
        <div className="py-20 text-center text-[var(--muted)]">
          <div className="text-5xl mb-4">🏷️</div>
          <p>暂无标签</p>
        </div>
      </Container>
    );
  }

  const maxCount = tags[0]?.count || 1;

  return (
    <Container>
      <div className="py-12 sm:py-16">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">标签云</span>
          </h1>
          <p className="mt-2 text-[var(--muted)]">共 {tags.length} 个标签</p>
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
