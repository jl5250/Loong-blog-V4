import type { Metadata } from "next";
import { getArticlePaging } from "@/api/article";
import { extractFromSettled } from "@/lib/api-helpers";
import type { Article } from "@/types/article";
import type { Tag } from "@/types/tag";
import type { Cate } from "@/types/cate";
import type { Web } from "@/types/web";
import type { Comment } from "@/types/comment";

export const revalidate = 60;
import { getTagList } from "@/api/tag";
import { getCateList } from "@/api/cate";
import { getLinkList } from "@/api/web";
import { getLatestComments } from "@/api/comment";
import Link from "next/link";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "数据",
  alternates: { canonical: "https://loongblog.fun/data" },
};

export default async function DataPage() {
  const results = await Promise.allSettled([
    getArticlePaging(1, 100),
    getTagList(),
    getCateList(),
    getLinkList(),
    getLatestComments(1, 100),
  ]);

  const articleData = results[0].status === "fulfilled" ? results[0].value.data : null;
  const articles: Article[] = articleData?.result ?? [];
  const totalArticles = articleData?.total ?? articles.length;

  const tagList: Tag[] = extractFromSettled(results[1]);

  const cateList: Cate[] = extractFromSettled(results[2]);
  const realCates = cateList.filter((c) => c.type === "cate");
  const cateCounts = realCates.map((c) => ({ name: c.name, count: c.count ?? 0 }));

  const links: Web[] = extractFromSettled(results[3]);

  const comments: Comment[] = extractFromSettled(results[4]);

  const tagCount = tagList.length;
  const cateCount = realCates.length;
  const totalViews = articles.reduce((sum, a) => sum + (a.view || 0), 0);

  // Group by month for archive
  const archive: Record<string, typeof articles> = {};
  for (const a of articles) {
    const d = new Date(Number(a.createTime));
    const key = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    if (!archive[key]) archive[key] = [];
    archive[key].push(a);
  }
  const sortedMonths = Object.keys(archive).sort((a, b) => b.localeCompare(a));

  // Category distribution colors
  const pieColors = ["#ff4757", "#00d2d3", "#ecca6a", "#4a90ff", "#ff6b81", "#7bed9f", "#e8e0d5"];
  const maxCount = Math.max(...cateCounts.map((c) => c.count ?? 0), 1);

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">数</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">数据</h1>
          <p className="font-kai text-text-muted">Statistics · 站点数据</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10">
          {[
            { label: "文章总计", value: String(totalArticles), color: "#ff4757", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838.838-2.872a2 2 0 0 1 .506-.854z"/></svg> },
            { label: "评论总计", value: String(comments.length), color: "#00d2d3", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg> },
            { label: "分类总计", value: String(cateCount), color: "#ecca6a", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/><path d="M11 12h4"/><path d="M11 16h7"/><path d="M11 20h10"/></svg> },
            { label: "友链总计", value: String(links.length), color: "#4a90ff", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> },
          ].map((s) => (
            <div key={s.label} className="border border-border rounded-2xl p-6 bg-bg-surface hover:border-accent/30 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xl" style={{ color: s.color }}>{s.icon}</span>
                <span className="text-3xl font-serif font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
              <div className="text-xs text-text-muted font-sans">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Category pie chart (CSS bar chart) */}
        {cateCounts.length > 0 && (
          <div className="border border-border rounded-2xl p-8 bg-bg-surface mb-10">
            <h2 className="font-serif font-bold text-lg mb-6 flex items-center gap-3"><span className="w-1 h-5 bg-accent rounded" />分类占比</h2>

            {/* Visual bar chart */}
            <div className="space-y-4 mb-6">
              {cateCounts.map((c, i) => {
                const pct = maxCount > 0 ? ((c.count ?? 0) / maxCount) * 100 : 0;
                const color = pieColors[i % pieColors.length];
                return (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-kai text-text-body">{c.name}</span>
                      <span className="font-sans text-xs text-text-muted">{c.count ?? 0} 篇</span>
                    </div>
                    <div className="h-2.5 bg-border/30 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pie-like donut using conic-gradient */}
            {cateCounts.length > 0 && (
              <div className="flex flex-col items-center pt-4 border-t border-border">
                <div className="w-48 h-48 rounded-full mb-4"
                  style={{
                    background: `conic-gradient(${cateCounts.map((c, i) => {
                      const total = cateCounts.reduce((s, x) => s + (x.count ?? 0), 0);
                      const pct = total > 0 ? ((c.count ?? 0) / total) * 100 : 0;
                      const startPct = cateCounts.slice(0, i).reduce((s, x) => s + ((x.count ?? 0) / total) * 100, 0);
                      return `${pieColors[i % pieColors.length]} ${startPct}% ${startPct + pct}%`;
                    }).join(", ")})`,
                  }}
                />
                <div className="flex flex-wrap justify-center gap-4">
                  {cateCounts.map((c, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-sans text-text-muted">
                      <span className="w-3 h-3 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                      {c.name} ({c.count ?? 0})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Article archive */}
        <div className="border border-border rounded-2xl p-8 bg-bg-surface">
          <h2 className="font-serif font-bold text-lg mb-6 flex items-center gap-3"><span className="w-1 h-5 bg-accent2 rounded" />文章归档</h2>
          {sortedMonths.length > 0 ? (
            <div className="space-y-5">
              {sortedMonths.map((month) => (
                <div key={month}>
                  <h3 className="font-serif font-bold text-sm mb-3 text-text-muted">{month} <span className="text-xs font-sans text-text-muted/40">({archive[month].length} 篇)</span></h3>
                  <div className="space-y-1 pl-4 border-l-2 border-border/40">
                    {archive[month].map((a) => (
                      <Link key={a.id} href={`/article/${a.id}`}
                        className="flex items-center justify-between py-1.5 px-3 rounded-lg hover:bg-bg-card transition-colors group">
                        <span className="font-kai text-sm text-text-body group-hover:text-accent transition-colors line-clamp-1">{a.title}</span>
                        <span className="font-sans text-[.6rem] text-text-muted/40 ml-4 flex-shrink-0">{formatDate(a.createTime)}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-kai text-text-muted text-center py-8">暂无文章</p>
          )}
        </div>
      </div>
    </main>
  );
}
