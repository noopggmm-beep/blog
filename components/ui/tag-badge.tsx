import Link from "next/link";

export function TagBadge({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tags/${tag}`}
      className="inline-block px-2.5 py-0.5 text-xs font-medium rounded-full bg-[var(--glow)] text-[var(--accent)] border border-[rgba(45,212,191,0.2)] hover:bg-[rgba(45,212,191,0.18)] hover:border-[var(--accent)] transition-all duration-200"
    >
      #{tag}
    </Link>
  );
}
