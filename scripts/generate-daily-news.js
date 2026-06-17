/**
 * 每日十大新闻自动采集 & 双语生成脚本
 *
 * 从免费 RSS 源采集 → 自动翻译 → 生成中英文双语 MDX
 * 用法: node scripts/generate-daily-news.js
 */

const fs = require("fs");
const path = require("path");
const Parser = require("rss-parser");
const { translate } = require("@vitalets/google-translate-api");

const parser = new Parser({
  timeout: 15000,
  headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsBot/1.0)" },
});

const CONTENT_DIR = path.join(__dirname, "..", "content", "posts");
const EN_CONTENT_DIR = path.join(CONTENT_DIR, "en");

// ===== RSS 新闻源配置 =====
const RSS_SOURCES = {
  international: {
    tag: "国际十大新闻",
    slug: "global-top10",
    titleZH: (d) => `国际十大新闻（${d}）`,
    titleEN: (d) => `Top 10 World News — ${d}`,
    descZH: "每日国际要闻深度分析，洞察全球格局变化。",
    descEN: "Daily world news in-depth analysis and global insights.",
  },
  china: {
    tag: "国内十大新闻",
    slug: "china-top10",
    titleZH: (d) => `国内十大新闻（${d}）`,
    titleEN: (d) => `Top 10 China News — ${d}`,
    descZH: "每日国内要闻汇总，把握中国发展脉搏。",
    descEN: "Daily China news highlights and development insights.",
  },
  tech: {
    tag: "科技创新",
    slug: "tech-top10",
    titleZH: (d) => `科技创新十大突破（${d}）`,
    titleEN: (d) => `Top 10 Tech Breakthroughs — ${d}`,
    descZH: "前沿科技动态与创新洞察。",
    descEN: "Frontier tech breakthroughs and innovation insights.",
  },
  ip: {
    tag: "知识产权",
    slug: "ip-top10",
    titleZH: (d) => `知识产权十大事件（${d}）`,
    titleEN: (d) => `Top 10 IP Events — ${d}`,
    descZH: "专利分析与知识产权战略洞察。",
    descEN: "Patent analysis and IP strategy insights.",
  },
};

// 每个栏目的 RSS 源
const FEEDS = {
  international: [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://feeds.npr.org/1004/rss.xml",
    "https://www3.nhk.or.jp/nhkworld/en/news/rss.xml",
  ],
  china: [
    "https://feeds.bbci.co.uk/news/world/asia/china/rss.xml",
    "https://www.scmp.com/rss/91/feed",
  ],
  tech: [
    "https://www.wired.com/feed/rss",
    "https://feeds.arstechnica.com/arstechnica/index",
    "https://www.theverge.com/rss/index.xml",
    "https://www.technologyreview.com/feed/",
  ],
  ip: [
    "https://ipwatchdog.com/feed/",
    "https://patentlyo.com/feed",
  ],
};

// ===== 工具函数 =====
function today() {
  return new Date().toISOString().slice(0, 10);
}
function dateRange() {
  const t = new Date();
  const w = new Date(t);
  w.setDate(t.getDate() - 6);
  const zh = `${w.getMonth() + 1}月${w.getDate()}日—${t.getMonth() + 1}月${t.getDate()}日`;
  const en = `${w.toISOString().slice(0, 10)} – ${t.toISOString().slice(0, 10)}`;
  return { zh, en };
}

// 翻译文本（带重试）
async function translateText(text, to) {
  if (!text || text.length < 3) return text;
  try {
    const result = await translate(text, { to });
    return result.text || text;
  } catch (e) {
    console.error(`      ⚠️ 翻译失败: ${e.message.slice(0, 60)}`);
    return text; // fallback to original
  }
}

// 获取单个 RSS 源
async function fetchFeed(feedUrl) {
  try {
    const feed = await parser.parseURL(feedUrl);
    if (!feed || !feed.items) return [];
    return feed.items.slice(0, 15).map((item) => ({
      title: (item.title || "").replace(/<[^>]*>/g, "").trim(),
      link: item.link || "",
      description: (item.contentSnippet || item.content || item.summary || "")
        .replace(/<[^>]*>/g, "")
        .trim()
        .slice(0, 300),
      pubDate: item.pubDate || "",
    }));
  } catch (e) {
    console.error(`    ⚠️ RSS 获取失败: ${e.message.slice(0, 80)}`);
    return [];
  }
}

// 过滤低质量/促销内容
const SPAM_KEYWORDS = [
  "discount", "coupon", "promo code", "% off", "sitewide", "save on",
  "best deals", "deal on", "deals on", "up to $", "verified",
  "折扣码", "优惠券", "促销码",
];

function isSpam(title) {
  const lower = title.toLowerCase();
  return SPAM_KEYWORDS.some((kw) => lower.includes(kw));
}

// 只保留最近 7 天的新闻
function filterRecent(items, days = 7) {
  const cutoff = Date.now() - days * 86400000;
  return items.filter((item) => {
    if (!item.pubDate) return true; // 无日期的保留
    const d = new Date(item.pubDate).getTime();
    return !isNaN(d) && d > cutoff;
  });
}

// 去重取 Top N
function deduplicate(items, n = 10) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = item.title.slice(0, 50);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
      if (result.length >= n) break;
    }
  }
  return result;
}

// 在翻译前限制文本长度，避免 API 过载
function truncForTranslation(items) {
  return items.map((item) => ({
    ...item,
    title: item.title.slice(0, 150),
    description: item.description.slice(0, 200),
  }));
}

// ===== 主流程 =====
async function main() {
  console.log(`📰 开始采集 ${today()} 新闻...\n`);

  const columns = Object.keys(RSS_SOURCES);
  let totalCreated = 0;

  for (const key of columns) {
    const col = RSS_SOURCES[key];
    const feeds = FEEDS[key];
    console.log(`\n📡 采集 ${col.tag} (${feeds.length} 个源)...`);

    // 并行抓取
    const results = await Promise.all(feeds.map((url) => fetchFeed(url)));
    const allItems = results.flat();
    const recent = filterRecent(allItems, 7).filter((item) => !isSpam(item.title));
    const top10 = deduplicate(recent, 10);

    if (top10.length === 0) {
      console.log(`    ⚠️ 无内容，跳过`);
      continue;
    }
    console.log(`    ✅ ${allItems.length} 条 → 去重后 Top ${top10.length}`);

    // 截断长文本用于翻译
    const toTranslate = truncForTranslation(top10);

    // 生成英文版（原文）
    const enItems = top10;
    const enMDX = generateMDX(col, enItems, "en");
    if (!fs.existsSync(EN_CONTENT_DIR)) fs.mkdirSync(EN_CONTENT_DIR, { recursive: true });
    const enPath = path.join(EN_CONTENT_DIR, `${today()}-${col.slug}.mdx`);
    fs.writeFileSync(enPath, enMDX, "utf-8");
    console.log(`    📄 [EN] ${col.slug}.mdx`);

    // 翻译为中文
    console.log(`    🌐 翻译为中文...`);
    const zhItems = [];
    for (let i = 0; i < toTranslate.length; i++) {
      const item = toTranslate[i];
      process.stdout.write(`      ${i + 1}/${toTranslate.length}...`);
      const zhTitle = await translateText(item.title, "zh-CN");
      const zhDesc = await translateText(item.description, "zh-CN");
      zhItems.push({ ...item, title: zhTitle, description: zhDesc });
      console.log(" ✓");
      // 短暂延迟避免频率限制
      await new Promise((r) => setTimeout(r, 200));
    }

    const zhMDX = generateMDX(col, zhItems, "zh");
    const zhPath = path.join(CONTENT_DIR, `${today()}-${col.slug}.mdx`);
    fs.writeFileSync(zhPath, zhMDX, "utf-8");
    console.log(`    📄 [中文] ${col.slug}.mdx`);

    totalCreated += 2;
  }

  console.log(`\n🎉 完成！共生成 ${totalCreated} 篇文章`);
  console.log(`📁 content/posts/ (中文) 和 content/posts/en/ (英文)`);
}

// ===== 生成 MDX =====
function generateMDX(col, items, lang) {
  const now = new Date();
  const dateStr = today();
  const dayLabel = lang === "zh" ? `${now.getMonth() + 1}月${now.getDate()}日` : now.toLocaleDateString("en-US", { month: "long", day: "numeric" });
  const title = lang === "zh" ? col.titleZH(dayLabel) : col.titleEN(dayLabel);
  const desc = lang === "zh" ? col.descZH : col.descEN;
  const emojis = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "🟤", "🔴", "🟠"];

  const newsItems = items
    .map((item, i) => {
      const emoji = emojis[i];
      const dateStr = item.pubDate
        ? new Date(item.pubDate).toLocaleDateString(lang === "zh" ? "zh-CN" : "en-US")
        : "";
      if (lang === "zh") {
        return `## ${i + 1}. ${emoji} ${item.title}

${item.description || ""}

> 📍 原文来源${item.link ? ` | [阅读原文](${item.link})` : ""}${dateStr ? ` | ${dateStr}` : ""}`;
      } else {
        return `## ${i + 1}. ${emoji} ${item.title}

${item.description || ""}

> 📍 Source${item.link ? ` | [Read more](${item.link})` : ""}${dateStr ? ` | ${dateStr}` : ""}`;
      }
    })
    .join("\n\n");

  const note =
    lang === "zh"
      ? `> 📅 ${dayLabel}  |  🤖 自动采集 + 机器翻译 | 共 ${items.length} 条`
      : `> 📅 ${dayLabel}  |  🤖 Auto-collected via RSS | Top ${items.length}`;

  return `---
title: "${title}"
description: "${desc}"
date: "${dateStr}"
tags: ["${col.tag}"]
---

${note}

${newsItems}

---

*${lang === "zh" ? "本文由自动化脚本每日采集并翻译生成。" : "Auto-generated daily from public RSS feeds."}*
`;
}

// 自动删除 30 天以前的新闻
function cleanupOldPosts(maxDays = 30) {
  const cutoff = Date.now() - maxDays * 86400000;
  [CONTENT_DIR, EN_CONTENT_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter((f) => f.endsWith(".mdx"))
      .forEach((f) => {
        const filePath = path.join(dir, f);
        const stat = fs.statSync(filePath);
        if (stat.mtimeMs < cutoff) {
          // 保留 hello-world 和手工撰写的文章（不含日期前缀）
          if (!f.match(/^\d{4}-\d{2}-\d{2}-/)) return;
          fs.unlinkSync(filePath);
          console.log(`  🗑️  已删除过期: ${f}`);
        }
      });
  });
}

main().then(() => {
  console.log("\n🧹 清理 90 天前的旧新闻...");
  cleanupOldPosts(90);
}).catch((e) => {
  console.error("❌ 失败:", e.message);
  process.exit(1);
});
