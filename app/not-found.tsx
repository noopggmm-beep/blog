import Link from "next/link";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container>
      <div className="py-20 text-center">
        <div className="text-7xl mb-4">🌲</div>
        <h1 className="text-5xl font-bold gradient-text mb-2">404</h1>
        <p className="mt-4 text-lg text-[var(--muted)]">
          迷失在数据的森林里了...
        </p>
        <p className="text-sm text-[var(--muted)]">
          你寻找的页面不存在或已被移除
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-lg border border-[var(--accent)] text-[var(--accent)] text-sm font-medium hover:bg-[var(--glow)] hover:shadow-[0_0_16px_var(--glow)] transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
          </svg>
          返回首页
        </Link>
      </div>
    </Container>
  );
}
