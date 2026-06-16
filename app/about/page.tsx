import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "关于",
  description: `关于 ${SITE.author} — 专利代理人、知识产权专家`,
};

const timelineData = [
  {
    period: "2019 – 至今",
    title: "知识产权总监",
    org: "尚诚知识产权 (尚诚IP)",
    desc: "全面负责尚诚IP的知识产权战略规划、团队建设和客户服务。为企业客户提供专利预警分析、专利布局规划、知识产权风险评估和应对策略等全链条服务。",
  },
  {
    period: "2016 – 2018",
    title: "知识产权中心主任",
    org: "中国电子科技集团",
    desc: "负责集团知识产权中心的建设和管理工作，统筹集团专利战略规划、核心技术专利布局、知识产权风险防控及专利运营等核心业务。",
  },
  {
    period: "2012.3 – 2014.9",
    title: "副总经理 · 专利预警分析师",
    org: "北京国之专利预警咨询中心",
    desc: "负责专利预警咨询项目的合同谈判、项目管理和最终审核。主导企业、行业、学术专利咨询项目，涵盖专利稳定性分析、专利有效性、专利授权前景、查新检索、专利侵权分析、专利挖掘和布局规划、企业专利战略制定等。",
  },
  {
    period: "2010.1 – 2012.3",
    title: "项目经理 · 专利预警分析师",
    org: "北京国之专利预警咨询中心",
    desc: "负责专利预警项目的管理和执行。包括专利咨询项目的前期调研、合同谈判、项目人员安排、项目计划制定、项目执行进度监控、项目质量把控以及最终报告撰写审核和汇报。累计负责项目合同金额超过 800 万。",
  },
  {
    period: "2008.3 – 2010.1",
    title: "审查员 · 通信发明应用处",
    org: "国家知识产权局专利审查协作中心",
    desc: "负责处内日常管理工作，协助处长进行全处人员专利审查任务审核、人员培训以及企业培训等工作。同时负责专利复审、PCT 国际检索和初步审查、GCC 等工作。",
  },
  {
    period: "2005.6 – 2008.3",
    title: "审查员 · 通信发明通信处",
    org: "国家知识产权局专利审查协作中心",
    desc: "独立承担移动通信和网络通信相关领域的专利实质审查，以及 PCT 国际检索和初步审查。",
  },
];

const eduData = [
  { period: "2002.3 – 2005.6", degree: "博士", major: "通信与信息系统", school: "北京邮电大学" },
  { period: "1999.9 – 2002.3", degree: "硕士", major: "通信与信息系统", school: "西安电子科技大学" },
  { period: "1993.9 – 1997.7", degree: "本科", major: "通信工程", school: "西安科技大学" },
];

export default function AboutPage() {
  return (
    <Container>
      <div className="py-12 sm:py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text">关于我</span>
          </h1>
          <p className="mt-2 text-[var(--muted)]">
            专利代理人 · 知识产权专家 · 科技创新思考者
          </p>
        </div>

        <div className="space-y-12">
          {/* Bio */}
          <section className="glass p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent)]" />
              个人简介
            </h2>
            <div className="space-y-3 text-[var(--muted)] leading-relaxed">
              <p>
                你好，我是 {SITE.author}，一名拥有近 20 年经验的专利代理人。拥有北京邮电大学通信与信息系统博士学位，长期深耕知识产权领域。
              </p>
              <p>
                我曾在中国电子科技集团担任知识产权中心主任，统筹集团专利战略和知识产权风险防控；之后加入尚诚知识产权（尚诚IP），全面负责知识产权服务业务。
              </p>
              <p>
                我精通专利检索、专利分析、专利挖掘和布局规划、查新检索、有效性分析、侵权分析和风险规避策略等全链条专利服务，对企业和产业层面的专利战略制定有深刻理解和丰富实战经验。
              </p>
            </div>
          </section>

          {/* Experience Timeline */}
          <section>
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent)]" />
              工作经历
            </h2>
            <div className="space-y-4">
              {timelineData.map((item, idx) => (
                <div key={idx} className="glass glass-hover p-5 sm:p-6 relative pl-8">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 top-6 w-2.5 h-2.5 rounded-full ring-2 ring-[var(--glow)] ${
                    idx === 0 ? 'bg-[var(--accent)]' : 'bg-[var(--accent-2)]'
                  }`} />
                  {idx < timelineData.length - 1 && (
                    <div className="absolute left-[1.15rem] top-10 bottom-0 w-px bg-[var(--border)]" />
                  )}

                  <span className="text-xs font-mono text-[var(--accent)]">{item.period}</span>
                  <h3 className="text-base font-semibold mt-1">{item.title}</h3>
                  <p className="text-sm text-[var(--muted)]">{item.org}</p>
                  <p className="text-sm text-[var(--muted)] mt-2 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent-2)]" />
              教育背景
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

          {/* Contact */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-[var(--accent)]" />
              联系方式
            </h2>
            <div className="glass p-5 sm:p-6 flex flex-wrap gap-4 text-sm">
              <a
                href={`mailto:${SITE.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--glow)] transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {SITE.email}
              </a>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-[var(--border)] text-[var(--muted)]">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                13161351026
              </span>
            </div>
          </section>
        </div>
      </div>
    </Container>
  );
}
