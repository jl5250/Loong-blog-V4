import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_PROJECT_API || "";
const SITE_URL = "https://loongblog.fun";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/tags`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/data`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/record`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/equipment`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/footprint`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/wall/all`, lastModified: now, changeFrequency: "weekly", priority: 0.4 },
    { url: `${SITE_URL}/xue`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/fishpond`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/friend`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/my`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/resume`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamic pages from API
  const dynamicPages: MetadataRoute.Sitemap = [];

  try {
    // Articles
    const articleRes = await fetch(`${BASE_URL}/article?page=1&size=200`);
    if (articleRes.ok) {
      const articleData = await articleRes.json();
      const articles = articleData?.data?.result ?? [];
      for (const a of articles) {
        if (a.id) {
          dynamicPages.push({
            url: `${SITE_URL}/article/${a.id}`,
            lastModified: new Date(a.updateTime || a.createTime || now),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }
  } catch {
    // API unavailable — continue with static pages only
  }

  try {
    // Categories
    const cateRes = await fetch(`${BASE_URL}/cate`);
    if (cateRes.ok) {
      const cateData = await cateRes.json();
      const cates = cateData?.data ?? [];
      for (const c of cates) {
        if (c.id) {
          dynamicPages.push({
            url: `${SITE_URL}/cate/${c.id}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }
  } catch {
    // continue
  }

  try {
    // Tags
    const tagRes = await fetch(`${BASE_URL}/tag`);
    if (tagRes.ok) {
      const tagData = await tagRes.json();
      const tags = tagData?.data ?? [];
      for (const t of tags) {
        if (t.id) {
          dynamicPages.push({
            url: `${SITE_URL}/tag/${t.id}`,
            lastModified: now,
            changeFrequency: "monthly",
            priority: 0.4,
          });
        }
      }
    }
  } catch {
    // continue
  }

  try {
    // Wall categories
    const wallRes = await fetch(`${BASE_URL}/wall/cate`);
    if (wallRes.ok) {
      const wallData = await wallRes.json();
      const wallCates = wallData?.data ?? [];
      for (const w of wallCates) {
        if (w.mark) {
          dynamicPages.push({
            url: `${SITE_URL}/wall/${w.mark}`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.4,
          });
        }
      }
    }
  } catch {
    // continue
  }

  return [...staticPages, ...dynamicPages];
}
