import { cookies } from "next/headers";
import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { t } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "About",
  description: "Patent Attorney and IP Expert",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("lang")?.value || "zh") as Lang;

  const timelineData = [
    { period: t(lang, "exp1Period"), title: t(lang, "exp1Title"), org: t(lang, "exp1Org"), desc: t(lang, "exp1Desc"), highlight: true },
    { period: t(lang, "exp2Period"), title: t(lang, "exp2Title"), org: t(lang, "exp2Org"), desc: t(lang, "exp2Desc"), highlight: false },
    { period: t(lang, "exp3Period"), title: t(lang, "exp3Title"), org: t(lang, "exp3Org"), desc: t(lang, "exp3Desc"), highlight: false },
    { period: t(lang, "exp4Period"), title: t(lang, "exp4Title"), org: t(lang, "exp4Org"), desc: t(lang, "exp4Desc"), highlight: false },
    { period: t(lang, "exp5Period"), title: t(lang, "exp5Title"), org: t(lang, "exp5Org"), desc: t(lang, "exp5Desc"), highlight: false },
    { period: t(lang, "exp6Period"), title: t(lang, "exp6Title"), org: t(lang, "exp6Org"), desc: t(lang, "exp6Desc"), highlight: false },
  ];

  const eduData = [
    { period: t(lang, "edu1Period"), degree: t(lang, "edu1Degree"), major: t(lang, "edu1Major"), school: t(lang, "edu1School") },
    { period: t(lang, "edu2Period"), degree: t(lang, "edu2Degree"), major: t(lang, "edu2Major"), school: t(lang, "edu2School") },
    { period: t(lang, "edu3Period"), degree: t(lang, "edu3Degree"), major: t(lang, "edu3Major"), school: t(lang, "edu3School") },
  ];

  return (
    <Container>
      <div className="py-12 sm:py-16">
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">{t(lang, "aboutTitle")}</span>
          </h1>
          <p className="mt-2 text-[var(--muted)]">{t(lang, "aboutSubtitle")}</p>
        </div>
        <div className="space-y-12">
          <section className="glass p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent)]" />
              {t(lang, "aboutBioTitle")}
            </h2>
            <div className="space-y-3 text-[var(--muted)] leading-relaxed">
              <p>{t(lang, "aboutBio1", { name: "noopggmm" })}</p>
              <p>{t(lang, "aboutBio2")}</p>
              <p>{t(lang, "aboutBio3")}</p>
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent)]" />
              {t(lang, "aboutExpTitle")}
            </h2>
            <div className="space-y-4">
              {timelineData.map((item, idx) => (
                <div key={idx} className="glass glass-hover p-5 sm:p-6 relative pl-8">
                  <div className={`absolute left-4 top-6 w-2.5 h-2.5 rounded-full ring-2 ring-[var(--glow)] ${item.highlight ? 'bg-[var(--accent)]' : 'bg-[var(--accent-2)]'}`} />
                  {idx < timelineData.length - 1 && <div className="absolute left-[1.15rem] top-10 bottom-0 w-px bg-[var(--border)]" />}
                  <span className="text-xs font-mono text-[var(--accent)]">{item.period}</span>
                  <h3 className="text-base font-semibold mt-1">{item.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{item.org}</p>
                  <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent-2)]" />
              {t(lang, "aboutEduTitle")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {eduData.map((item, idx) => (
                <div key={idx} className="glass p-4 text-center">
                  <div className="text-2xl font-bold gradient-text">{item.degree}</div>
                  <div className="text-sm font-medium mt-2">{item.major}</div>
                  <div className="text-xs text-[var(--muted)] mt-1">{item.school}</div>
                  <div className="text-xs text-[var(--muted)] mt-0.5">{item.period}</div>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent)]" />
              {t(lang, "aboutContactTitle")}
            </h2>
            <div className="glass p-5 sm:p-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] text-[var(--muted)] text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                {t(lang, "aboutContactRole")}
              </span>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
