"use client";

import { useLanguage } from "./language-provider";

export function LanguageToggle() {
  const { lang, toggleLang } = useLanguage();

  return (
    <button
      onClick={toggleLang}
      className="px-2 py-1 text-xs font-medium rounded-md border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)] transition-all duration-200 cursor-pointer whitespace-nowrap"
      aria-label={lang === "zh" ? "Switch to English" : "切换到中文"}
      title={lang === "zh" ? "Switch to English" : "切换到中文"}
    >
      {lang === "zh" ? "EN" : "中"}
    </button>
  );
}
