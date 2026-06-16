"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/ui/language-provider";
import { t } from "@/lib/i18n";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();

  useEffect(() => {
    function onScroll() {
      setVisible(window.scrollY > 400);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-8 right-8 w-10 h-10 rounded-full glass flex items-center justify-center hover:border-[var(--accent)] hover:shadow-[0_0_16px_var(--glow)] transition-all duration-300 cursor-pointer z-40 group"
      aria-label={t(lang, "backToTop")}
      title={t(lang, "backToTop")}
    >
      <svg className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
