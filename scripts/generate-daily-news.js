/**
 * 每日十大新闻自动采集 & 生成脚本
 *
 * 从免费 RSS 源自动采集新闻，生成 MDX 文件
 * 用法: node scripts/generate-daily-news.js
 */

const fs = require("fs");
const path = require("path");
const Parser = require("rss-parser");

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
    tagEn: "World News",
    slug: "global-top10",
    feeds: [
      { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World" },
      { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "NYT World" },
      { url: "https://feeds.npr.org/1004/rss.xml", name: "NPR World" },
      { url: "https://www3.nhk.or.jp/nhkworld/en/news/rss.xml", name: "NHK World" },
    ],
    titleZH: (d) => `国际十大新闻（${d}）`,
    titleEN: (d) => `Top 10 World News (${d})`,
    descZH: "每日国际要闻深度分析，洞察全球格局变化。",
    descEN: "Daily world news in-depth analysis and global insights.",
  },
  china: {
    tag: "国内十大新闻",
    tagEn: "China News",
    slug: "china-top10",
    feeds: [
      { url: "https://www.scmp.com/rss/91/feed", name: "SCMP China" },
      { url: "http://english.news.cn/rss/world.xml", name: "Xinhua World" },
    ],
    titleZH: (d) => `国内十大新闻（${d}）`,
    titleEN: (d) => `Top 10 China News (${d})`,
    descZH: "每日国内要闻汇总，把握中国发展脉搏。",
    descEN: "Daily China news highlights and development insights.",
  },
  tech: {
    tag: "科技创新",
    tagEn: "Tech Innovation",
    slug: "tech-top10",
    feeds: [
      { url: "https://feeds.feedburner.com/TechCrunch/", name: "TechCrunch" },
      { url: "https://www.wired.com/feed/rss", name: "Wired" },
      { url: "https://feeds.arstechnica.com/arstechnica/index", name: "Ars Technica" },
      { url: "https://www.theverge.com/rss/index.xml", name: "The Verge" },
    ],
    titleZH: (d) => `科技创新十大突破（${d}）`,
    titleEN: (d) => `Top 10 Tech Innovation Breakthroughs (${d})`,
    descZH: "前沿科技动态与创新洞察。",
    descEN: "Frontier tech breakthroughs and innovation insights.",
  },
  ip: {
    tag: "知识产权",
    tagEn: "IP Strategy",
    slug: "ip-top10",
    feeds: [
      { url: "https://ipwatchdog.com/feed/", name: "IP Watchdog" },
      { url: "https://patentlyo.com/feed", name: "Patently-O" },
      { url: "https://www.iam-media.com/rss/feed", name: "IAM Media" },
    ],
    titleZH: (d) => `知识产权十大事件（${d}）`,
    titleEN: (d) => `Top 10 IP Events (${d})`,
    descZH: "专利分析与知识产权战略洞察。",
    descEN: "Patent analysis and IP strategy insights.",
  },
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

// 获取单个 RSS 源
async function fetchFeed(feedUrl, sourceName) {
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
      source: sourceName,
      pubDate: item.pubDate || item.isoDate || "",
    }));
  } catch (e) {
    console.error(`    ⚠️ 获取失败: ${sourceName} — ${e.message.slice(0, 80)}`);
    return [];
  }
}

// 去重并选 Top N
function deduplicate(items, n = 10) {
  const seen = new Set();
  const result = [];
  for (const item of items) {
    const key = item.title.slice(0, 60);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(item);
      if (result.length >= n) break;
    }
  }
  return result;
}

// ===== 生成 MDX =====

function generateMDX(column, items, lang) {
  const d = today();
  const range = dateRange();
  const title = lang === "zh" ? column.titleZH(range.zh) : column.titleEN(range.en);
  const desc = lang === "zh" ? column.descZH : column.descEN;
  const tag = column.tag;

  const emojis = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣", "⚫", "🟤", "🔴", "🟠"];

  const newsItems = items
    .map((item, i) => {
      const emoji = emojis[i];
      if (lang === "zh") {
        return `## ${i + 1}. ${emoji} ${item.title}

${item.description || "暂无摘要"}

> 📍 来源：${item.source}${item.link ? ` | [阅读原文](${item.link})` : ""}${item.pubDate ? ` | ${new Date(item.pubDate).toLocaleDateString("zh-CN")}` : ""}`;
      } else {
        return `## ${i + 1}. ${emoji} ${item.title}

${item.description || "No summary available"}

> 📍 Source: ${item.source}${item.link ? ` | [Read more](${item.link})` : ""}${item.pubDate ? ` | ${new Date(item.pubDate).toLocaleDateString("en-US")}` : ""}`;
      }
    })
    .join("\n\n");

  const note =
    lang === "zh"
      ? `> 📅 ${range.zh}  |  🤖 自动采集自 ${column.feeds.length} 个 RSS 源，去重后取 Top ${items.length}`
      : `> 📅 ${range.en}  |  🤖 Auto-collected from ${column.feeds.length} RSS sources, deduplicated Top ${items.length}`;

  return `---
title: "${title}"
description: "${desc}"
date: "${d}"
tags: ["${tag}"]
---

${note}

${newsItems}

---

*${lang === "zh" ? "本文由自动化脚本每日从公开 RSS 源采集生成。" : "This article is auto-generated daily from public RSS feeds."}*
`;
}

// ===== 主流程 =====

async function main() {
  console.log(`📰 开始采集 ${today()} 新闻...\n`);

  const columns = Object.values(RSS_SOURCES);
  let totalCreated = 0;

  for (const col of columns) {
    console.log(`\n📡 采集 ${col.tag} (${col.tagEn})...`);

    // 并行抓取所有 RSS 源
    const allFeedResults = await Promise.all(
      col.feeds.map((f) => fetchFeed(f.url, f.name))
    );

    // 合并并去重
    const allItems = allFeedResults.flat();
    const top10 = deduplicate(allItems, 10);

    console.log(`    ✅ 采集到 ${allItems.length} 条，去重后保留 ${top10.length} 条`);

    if (top10.length === 0) {
      console.log(`    ⚠️ 无内容，跳过`);
      continue;
    }

    // 保存源信息到 col
    col.feeds_list = col.feeds.map((f) => f.name);

    // 生成中文版
    const zhPath = path.join(CONTENT_DIR, `${today()}-${col.slug}.mdx`);
    fs.writeFileSync(zhPath, generateMDX(col, top10, "zh"), "utf-8");
    console.log(`    📄 [中文] ${col.slug}.mdx`);

    // 生成英文版
    if (!fs.existsSync(EN_CONTENT_DIR))
      fs.mkdirSync(EN_CONTENT_DIR, { recursive: true });
    const enPath = path.join(EN_CONTENT_DIR, `${today()}-${col.slug}.mdx`);
    fs.writeFileSync(enPath, generateMDX(col, top10, "en"), "utf-8");
    console.log(`    📄 [EN] ${col.slug}.mdx`);

    totalCreated += 2;
  }

  console.log(`\n🎉 完成！共生成 ${totalCreated} 篇文章`);
  console.log(`📁 content/posts/ 和 content/posts/en/`);
}

main().catch((e) => {
  console.error("❌ 采集失败:", e.message);
  process.exit(1);
});
