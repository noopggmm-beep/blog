"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const query = params.toString();
    router.push(query ? `/?${query}` : "/");
  }

  const pages: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  return (
    <nav
      className="flex items-center justify-center gap-1 mt-12"
      aria-label="分页导航"
    >
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm rounded-md border border-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)] hover:bg-[var(--glow)] transition-all duration-200 cursor-pointer disabled:hover:bg-transparent disabled:hover:border-[var(--border)]"
      >
        ← 上一页
      </button>

      {pages.map((p, idx) =>
        p === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-[var(--muted)]">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goToPage(p as number)}
            className={`w-9 h-9 text-sm rounded-md transition-all duration-200 cursor-pointer ${
              p === currentPage
                ? "bg-[var(--accent)] text-black font-semibold shadow-[0_0_16px_var(--glow)]"
                : "border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)]"
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm rounded-md border border-[var(--border)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--accent)] hover:bg-[var(--glow)] transition-all duration-200 cursor-pointer disabled:hover:bg-transparent disabled:hover:border-[var(--border)]"
      >
        下一页 →
      </button>
    </nav>
  );
}
