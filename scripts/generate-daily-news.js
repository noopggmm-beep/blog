/**
 * 每日十大新闻自动生成脚本
 * 每天运行一次，为四个栏目生成当天新闻 MDX 文件
 *
 * 用法: node scripts/generate-daily-news.js
 */

const fs = require("fs");
const path = require("path");

const CONTENT_DIR = path.join(__dirname, "..", "content", "posts");
const EN_CONTENT_DIR = path.join(CONTENT_DIR, "en");

// 今天的日期
const today = new Date();
const dateStr = today.toISOString().slice(0, 10); // "2026-06-16"
const weekStart = new Date(today);
weekStart.setDate(today.getDate() - 6);
const weekStartStr = weekStart.toISOString().slice(0, 10);
const monthDay = `${today.getMonth() + 1}月${today.getDate()}日`;
const dateRange =
  today.getMonth() === weekStart.getMonth()
    ? `${weekStart.getMonth() + 1}月${weekStart.getDate()}日—${monthDay}`
    : `${weekStart.getMonth() + 1}月${weekStart.getDate()}日—${monthDay}`;

// 确保目录存在
[CONTENT_DIR, EN_CONTENT_DIR].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 四个栏目的模板
const columns = [
  {
    tag: "国际十大新闻",
    tagEn: "World News",
    slugPrefix: "global-top10",
    emoji: "🌍",
    emojiItems: ["🔥", "🛢️", "🇫🇷", "🇮🇱", "🇺🇦", "🇰🇷", "🇬🇧", "🚀", "🦠", "🇰🇵"],
    titleZH: (d) => `国际十大新闻（${d}）`,
    titleEN: (d) => `Top 10 World News (${d})`,
    descZH: "每日国际要闻深度分析，洞察全球格局变化。",
    descEN: "Daily world news in-depth analysis and global insights.",
  },
  {
    tag: "国内十大新闻",
    tagEn: "China News",
    slugPrefix: "china-top10",
    emoji: "🇨🇳",
    emojiItems: ["🚀", "⚛️", "⚡", "🚢", "🏗️", "✈️", "🌾", "⚖️", "🏫", "📄"],
    titleZH: (d) => `国内十大新闻（${d}）`,
    titleEN: (d) => `Top 10 China News (${d})`,
    descZH: "每日国内要闻汇总，把握中国发展脉搏。",
    descEN: "Daily China news highlights and development insights.",
  },
  {
    tag: "科技创新",
    tagEn: "Tech Innovation",
    slugPrefix: "tech-top10",
    emoji: "🚀",
    emojiItems: ["⚛️", "🔬", "🤖", "🚀", "💾", "💎", "🔬", "🌊", "☀️", "🧠"],
    titleZH: (d) => `科技创新十大突破（${d}）`,
    titleEN: (d) => `Top 10 Tech Innovation Breakthroughs (${d})`,
    descZH: "前沿科技动态与创新洞察。",
    descEN: "Frontier tech breakthroughs and innovation insights.",
  },
  {
    tag: "知识产权",
    tagEn: "IP Strategy",
    slugPrefix: "ip-top10",
    emoji: "⚖️",
    emojiItems: ["⚖️", "📊", "🔗", "🇬🇧", "🇫🇷", "🧬", "🏛️", "🚀", "📱", "🔬"],
    titleZH: (d) => `知识产权十大事件（${d}）`,
    titleEN: (d) => `Top 10 IP Events (${d})`,
    descZH: "专利分析与知识产权战略洞察。",
    descEN: "Patent analysis and IP strategy insights.",
  },
];

// 生成新闻条目模板
function generateNewsItems(column, lang) {
  const items = [];
  for (let i = 0; i < 10; i++) {
    const emoji = column.emojiItems[i] || "📌";
    if (lang === "zh") {
      items.push(`## ${i + 1}. ${emoji} [请在此填入新闻标题]

[请在此填入新闻摘要，包括关键事实、数据和影响分析。]

**来源**：[请填写信息来源]`);
    } else {
      items.push(`## ${i + 1}. ${emoji} [Insert news headline here]

[Insert news summary here, including key facts, data, and impact analysis.]

**Source**: [Insert news source]`);
    }
  }
  return items.join("\n\n");
}

// 生成中文文章
function generateZHPost(column) {
  const slug = `${dateStr}-${column.slugPrefix}`;
  const items = generateNewsItems(column, "zh");

  return `---
title: "${column.titleZH(dateRange)}"
description: "${column.descZH}"
date: "${dateStr}"
tags: ["${column.tag}"]
---

> 📅 统计周期：${dateRange}  |  每日更新 · AI 辅助生成 · 请以权威媒体为准

${items}

---

*本文由自动化脚本每日生成，新闻内容请根据实际情况编辑更新。*
`;
}

// 生成英文文章
function generateENPost(column) {
  const slug = `${dateStr}-${column.slugPrefix}`;
  const items = generateNewsItems(column, "en");

  return `---
title: "${column.titleEN(dateRange)}"
description: "${column.descEN}"
date: "${dateStr}"
tags: ["${column.tag}"]
---

> 📅 Period: ${weekStartStr} – ${dateStr}  |  Auto-generated daily · Verify with authoritative sources

${items}

---

*This article is auto-generated daily. Please edit with actual news content.*
`;
}

// 删除旧的当日文章（如果存在）
function removeOldPosts(slugPattern) {
  [CONTENT_DIR, EN_CONTENT_DIR].forEach((dir) => {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir)
      .filter((f) => f.startsWith(slugPattern))
      .forEach((f) => fs.unlinkSync(path.join(dir, f)));
  });
}

// 主流程
console.log(`📰 生成 ${dateStr} 每日新闻...\n`);

let createdCount = 0;

columns.forEach((col) => {
  const slugPattern = `${dateStr}-${col.slugPrefix}`;

  // 删除旧文件
  removeOldPosts(slugPattern);

  // 中文版
  const zhPath = path.join(CONTENT_DIR, `${slugPattern}.mdx`);
  fs.writeFileSync(zhPath, generateZHPost(col), "utf-8");
  console.log(`  ✅ [中文] ${col.tag}: ${slugPattern}.mdx`);

  // 英文版
  const enPath = path.join(EN_CONTENT_DIR, `${slugPattern}.mdx`);
  fs.writeFileSync(enPath, generateENPost(col), "utf-8");
  console.log(`  ✅ [EN]   ${col.tagEn}: ${slugPattern}.mdx`);

  createdCount += 2;
});

console.log(`\n🎉 完成！共生成 ${createdCount} 篇文章（4 中文 + 4 英文）`);
console.log(`📁 位置: content/posts/ 和 content/posts/en/`);
console.log(`\n⚠️  请编辑文章填入真实新闻内容后提交。`);
