"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/ui/language-provider";

export function RefreshButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { lang } = useLanguage();

  async function handleRefresh() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/refresh", { method: "POST" });
    } catch (e) {
      // API might not be available in static export
    }
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleRefresh}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)] transition-all duration-200 cursor-pointer disabled:opacity-50"
      title={lang === "zh" ? "刷新全部内容" : "Refresh all content"}
    >
      <svg
        className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
      {loading
        ? lang === "zh"
          ? "更新中..."
          : "Updating..."
        : lang === "zh"
        ? "刷新"
        : "Refresh"}
    </button>
  );
}
