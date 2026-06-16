"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Container } from "@/components/ui/container";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LanguageToggle } from "@/components/ui/language-toggle";
import { useLanguage } from "@/components/ui/language-provider";
import { t } from "@/lib/i18n";

export function SiteHeader() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  const NAV_ITEMS = [
    { href: "/innovation", label: t(lang, "navInnovation") },
    { href: "/ip", label: t(lang, "navIP") },
    { href: "/news/international", label: t(lang, "navIntlNews") },
    { href: "/news/domestic", label: t(lang, "navDomNews") },
    { href: "/tags", label: t(lang, "navTags") },
    { href: "/about", label: t(lang, "navAbout") },
  ];

  return (
    <header className="sticky top-0 z-50 glass border-b-0 rounded-none bg-[var(--card)]">
      <Container>
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold tracking-tight gradient-text transition-opacity hover:opacity-80 shrink-0"
          >
            {t(lang, "siteTitle")}
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-0.5 overflow-x-auto">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-2.5 py-1.5 text-sm rounded-md transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? "text-[var(--accent)] bg-[var(--glow)]"
                      : "text-[var(--muted)] hover:text-[var(--fg)] hover:bg-[var(--glow)]"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-[var(--accent)]" />
                  )}
                </Link>
              );
            })}
            <div className="ml-1 pl-1 border-l border-[var(--border)] flex items-center gap-1 shrink-0">
              <LanguageToggle />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}
