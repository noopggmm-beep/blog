"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="w-8 h-8 rounded-md border border-[var(--border)]"
        aria-label="切换主题"
      />
    );
  }

  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      onClick={() => setTheme(nextTheme)}
      className="relative w-8 h-8 rounded-md border border-[var(--border)] flex items-center justify-center transition-all duration-300 hover:border-[var(--accent)] hover:shadow-[0_0_12px_var(--glow)] cursor-pointer hover:bg-[var(--glow)]"
      aria-label={`切换到${nextTheme === "dark" ? "暗色" : "亮色"}模式`}
      title={`切换到${nextTheme === "dark" ? "暗色" : "亮色"}模式`}
    >
      {/* Sun icon */}
      <svg
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "dark"
            ? "scale-0 opacity-0 absolute"
            : "scale-100 opacity-100 rotate-0"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      {/* Moon icon */}
      <svg
        className={`h-4 w-4 transition-all duration-300 ${
          theme === "dark"
            ? "scale-100 opacity-100 rotate-0"
            : "scale-0 opacity-0 absolute"
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </button>
  );
}
