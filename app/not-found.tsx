"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useLanguage } from "@/components/ui/language-provider";
import { t } from "@/lib/i18n";

export default function NotFound() {
  const { lang } = useLanguage();

  return (
    <Container>
      <div className="py-20 text-center">
        <div className="text-7xl mb-4">🌲</div>
        <h1 className="text-5xl font-bold gradient-text mb-2">404</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">{t(lang, "notFoundTitle")}</p>
        <p className="text-sm text-[var(--muted)]">{t(lang, "notFoundDesc")}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-lg border border-[var(--accent)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--glow)] hover:shadow-[0_0_16px_var(--glow)] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          {t(lang, "notFoundBack")}
        </Link>
      </div>
    </Container>
  );
}
