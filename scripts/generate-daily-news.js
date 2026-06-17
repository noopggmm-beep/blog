/**
 * 每日十大新闻自动采集 & 双语生成脚本 v3
 *
 * 英文 RSS 采集 → 英文原文 + 中文翻译（带重试）
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

const COLUMNS = {
  international: {
    tag: "国际十大新闻", slug: "global-top10",
    titleZH: (d) => `国际十大新闻（${d}）`, titleEN: (d) => `Top 10 World News — ${d}`,
    descZH: "每日国际要闻深度分析，洞察全球格局变化。", descEN: "Daily world news analysis.",
  },
  china: {
    tag: "国内十大新闻", slug: "china-top10",
    titleZH: (d) => `国内十大新闻（${d}）`, titleEN: (d) => `Top 10 China News — ${d}`,
    descZH: "每日国内要闻汇总，把握中国发展脉搏。", descEN: "Daily China news highlights.",
  },
  tech: {
    tag: "科技创新", slug: "tech-top10",
    titleZH: (d) => `科技创新十大突破（${d}）`, titleEN: (d) => `Top 10 Tech Breakthroughs — ${d}`,
    descZH: "前沿科技动态与创新洞察。", descEN: "Frontier tech breakthroughs.",
  },
  ip: {
    tag: "知识产权", slug: "ip-top10",
    titleZH: (d) => `知识产权十大事件（${d}）`, titleEN: (d) => `Top 10 IP Events — ${d}`,
    descZH: "专利分析与知识产权战略洞察。", descEN: "Patent analysis and IP strategy.",
  },
};

const FEEDS = {
  international: [
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", name: "BBC World" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", name: "The New York Times" },
    { url: "https://feeds.npr.org/1004/rss.xml", name: "NPR" },
  ],
  china: [
    { url: "https://feeds.bbci.co.uk/news/world/asia/china/rss.xml", name: "BBC China" },
    { url: "https://www.scmp.com/rss/91/feed", name: "South China Morning Post" },
  ],
  tech: [
    { url: "https://www.technologyreview.com/feed/", name: "MIT Technology Review" },
    { url: "https://www.sciencedaily.com/rss/top/technology.xml", name: "Science Daily" },
    { url: "https://feeds.arstechnica.com/arstechnica/science", name: "Ars Technica" },
  ],
  ip: [
    { url: "https://ipwatchdog.com/feed/", name: "IP Watchdog" },
    { url: "https://patentlyo.com/feed", name: "Patently-O" },
  ],
};

function today() { return new Date().toISOString().slice(0, 10); }

const BLOCK = [
  "discount", "coupon", "promo code", "% off", "buy now", "shop", "deal on",
  "for $", "under $", "on sale", "best price", "clearance", "flash sale",
  "killed", "dead", "death", "dies", "attack", "bombing", "casualties",
  "massacre", "murder", "execution", "torture", "shooting",
  "sex", "sexual", "rape", "abuse", "scandal", "riot",
  "detains", "crackdown", "arrests", "leak exposes",
  "Best ", " vs ", "unboxing", "hands-on",
];

function isBlocked(t) { return BLOCK.some(k => t.toLowerCase().includes(k)); }

function filterRecent(items, d = 7) {
  const cut = Date.now() - d * 86400000;
  return items.filter(i => { if(!i.pubDate) return true; const t = new Date(i.pubDate).getTime(); return !isNaN(t) && t > cut; });
}

function dedup(items, n = 10) {
  const s = new Set(); const r = [];
  for(const i of items) { const k = i.title.slice(0,50); if(!s.has(k)){ s.add(k); r.push(i); if(r.length>=n) break; } }
  return r;
}

async function fetchFeed(url, name) {
  try {
    const f = await parser.parseURL(url);
    if(!f||!f.items) return [];
    return f.items.slice(0,15).map(i => ({
      title: (i.title||"").replace(/<[^>]*>/g,"").trim(),
      link: i.link||"", source: name,
      description: (i.contentSnippet||i.content||i.summary||"").replace(/<[^>]*>/g,"").trim().slice(0,300),
      pubDate: i.pubDate||"",
    }));
  } catch(e) {
    console.error(`    ⚠️ ${name}: ${e.message.slice(0,60)}`);
    return [];
  }
}

// 翻译带重试（最多5次，指数退避）
async function translateWithRetry(text, to, maxRetries = 5) {
  if (!text || text.length < 3) return text;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const result = await translate(text, { to });
      return result.text || text;
    } catch (e) {
      const wait = Math.min(3000 * Math.pow(2, attempt), 30000);
      if (attempt < maxRetries - 1) {
        process.stdout.write(`⏳`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        process.stdout.write(`❌`);
        return text; // 最终回退
      }
    }
  }
  return text;
}

function genMDX(col, items, lang) {
  const now = new Date(); const ds = today();
  const dl = lang==="zh" ? `${now.getMonth()+1}月${now.getDate()}日` : now.toLocaleDateString("en-US",{month:"long",day:"numeric"});
  const title = lang==="zh" ? col.titleZH(dl) : col.titleEN(dl);
  const desc = lang==="zh" ? col.descZH : col.descEN;
  const emoji = ["🔴","🟠","🟡","🟢","🔵","🟣","⚫","🟤","🔴","🟠"];
  const srcLabel = lang==="zh" ? "来源" : "Source";
  const linkLabel = lang==="zh" ? "阅读原文" : "Read more";

  const items_ = items.map((item,i) => {
    const d = item.pubDate ? new Date(item.pubDate).toLocaleDateString(lang==="zh"?"zh-CN":"en-US") : "";
    return `## ${i+1}. ${emoji[i]} ${item.title}\n\n${item.description||""}\n\n> 📍 ${srcLabel}：${item.source}${item.link?` | [${linkLabel}](${item.link})`:""}${d?` | ${d}`:""}`;
  }).join("\n\n");

  const srcList = [...new Set(items.map(i=>i.source))].slice(0,5).join(lang==="zh"?"、":", ");
  const note = lang==="zh"
    ? `> 📅 ${dl}  |  采集自 ${srcList}  | 共 ${items.length} 条`
    : `> 📅 ${dl}  |  From ${srcList} | Top ${items.length}`;

  return `---
title: "${title}"
description: "${desc}"
date: "${ds}"
tags: ["${col.tag}"]
---

${note}

${items_}

---
*${lang==="zh"?"本文由自动化脚本每日从主流媒体采集并翻译生成。":"Auto-generated daily from mainstream media RSS feeds."}*
`;
}

async function main() {
  console.log(`📰 ${today()} 新闻采集\n`);
  const keys = Object.keys(COLUMNS);
  let total = 0;

  for (const key of keys) {
    const col = COLUMNS[key];
    const feeds = FEEDS[key];
    console.log(`\n📡 ${col.tag} (${feeds.length} 源)...`);

    // 抓取
    const results = await Promise.all(feeds.map(f => fetchFeed(f.url, f.name)));
    const all = results.flat();
    const filtered = filterRecent(all, 7).filter(i => !isBlocked(i.title));
    const top10 = dedup(filtered, 10);
    if (!top10.length) { console.log("    ⚠️ 无内容"); continue; }
    console.log(`    ✅ ${all.length}→${filtered.length}→Top${top10.length}`);

    // 英文版（原文）
    const enMDX = genMDX(col, top10, "en");
    if(!fs.existsSync(EN_CONTENT_DIR)) fs.mkdirSync(EN_CONTENT_DIR,{recursive:true});
    fs.writeFileSync(path.join(EN_CONTENT_DIR,`${today()}-${col.slug}.mdx`), enMDX, "utf-8");
    console.log(`    📄 EN ${col.slug}.mdx`);

    // 中文版（翻译）
    console.log(`    🌐 翻译中文...`);
    const zhItems = [];
    for (let i = 0; i < top10.length; i++) {
      const item = top10[i];
      process.stdout.write(`      ${i+1}/${top10.length} `);
      const zhTitle = await translateWithRetry(item.title, "zh-CN");
      process.stdout.write("·");
      const zhDesc = await translateWithRetry(item.description, "zh-CN");
      zhItems.push({ ...item, title: zhTitle, description: zhDesc });
      console.log(" ✓");
      await new Promise(r => setTimeout(r, 800)); // 800ms 间隔避免限流
    }

    fs.writeFileSync(path.join(CONTENT_DIR,`${today()}-${col.slug}.mdx`), genMDX(col, zhItems, "zh"), "utf-8");
    console.log(`    📄 中文 ${col.slug}.mdx`);
    total += 2;
  }
  console.log(`\n🎉 完成！共 ${total} 篇`);
}

function cleanup(d=30) {
  const cut = Date.now() - d*86400000;
  [CONTENT_DIR, EN_CONTENT_DIR].forEach(dir => {
    if(!fs.existsSync(dir)) return;
    fs.readdirSync(dir).filter(f=>f.endsWith(".mdx")).forEach(f=>{
      const fp = path.join(dir,f);
      if(fs.statSync(fp).mtimeMs < cut && f.match(/^\d{4}-\d{2}-\d{2}-/)) {
        fs.unlinkSync(fp); console.log(`  🗑️ ${f}`);
      }
    });
  });
}

main().then(()=>{console.log("\n🧹 清理30天..."); cleanup(30);}).catch(e=>{console.error("❌",e.message); process.exit(1);});
