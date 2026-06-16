import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] relative z-[1] glass rounded-none border-b-0">
      <Container>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-8 text-sm text-[var(--muted)]">
          <p>&copy; {year} {SITE.author}. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/rss.xml"
              className="hover:text-[var(--accent)] transition-colors"
            >
              RSS 订阅
            </Link>
            {SITE.socialLinks.github && (
              <a
                href={SITE.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--accent)] transition-colors"
              >
                GitHub
              </a>
            )}
            <a
              href={SITE.socialLinks.email}
              className="hover:text-[var(--accent)] transition-colors"
            >
              邮件
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
