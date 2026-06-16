"use client";

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from "react";
import type { Lang } from "@/lib/i18n";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "zh",
  setLang: () => {},
  toggleLang: () => {},
});

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

function getInitialLang(): Lang {
  if (typeof window === "undefined") return "zh";
  const cookie = getCookie("lang");
  if (cookie === "en" || cookie === "zh") return cookie;
  // Detect browser language
  const nav = navigator.language.toLowerCase();
  return nav.startsWith("zh") ? "zh" : "en";
}

export function LanguageProvider({ children, initialLang }: { children: ReactNode; initialLang?: Lang }) {
  const [lang, setLangState] = useState<Lang>(initialLang || "zh");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!initialLang) {
      setLangState(getInitialLang());
    }
    setMounted(true);
  }, [initialLang]);

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    setCookie("lang", newLang);
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "zh" ? "en" : "zh");
  }, [lang, setLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  return ctx;
}

export function useT() {
  const { lang } = useLanguage();
  return { lang };
}
