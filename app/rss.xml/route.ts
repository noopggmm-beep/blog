import { Feed } from "feed";
import { getAllPosts } from "@/lib/posts";
import { SITE } from "@/lib/constants";

export async function GET() {
  const feed = new Feed({
    title: SITE.title,
    description: SITE.description,
    id: SITE.url,
    link: SITE.url,
    language: "zh-CN",
    favicon: `${SITE.url}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, ${SITE.author}`,
    author: {
      name: SITE.author,
      email: SITE.email,
    },
    feedLinks: {
      rss2: `${SITE.url}/rss.xml`,
    },
  });

  const posts = getAllPosts();

  for (const post of posts) {
    feed.addItem({
      title: post.frontmatter.title,
      id: `${SITE.url}/posts/${post.slug}`,
      link: `${SITE.url}/posts/${post.slug}`,
      description: post.frontmatter.description,
      date: new Date(post.frontmatter.date),
    });
  }

  return new Response(feed.rss2(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
