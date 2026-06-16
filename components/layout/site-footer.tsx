"use client";

import Link from "next/link";
import { Container } from "@/components/ui/container";
import { useLanguage } from "@/components/ui/language-provider";
import { t } from "@/lib/i18n";

export function SiteFooter() {
  const { lang } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] relative z-[1] glass rounded-none border-b-0">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-sm text-[var(--muted)]">
          <p>&copy; {year} noopggmm. {t(lang, "footerRights")}</p>
          <div className="flex items-center gap-4">
            <Link
              href="/rss.xml"
              className="hover:text-[var(--accent)] transition-colors"
            >
              {t(lang, "footerRSS")}
            </Link>
            <a
              href="https://github.com/noopggmm-beep"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[var(--accent)] transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
