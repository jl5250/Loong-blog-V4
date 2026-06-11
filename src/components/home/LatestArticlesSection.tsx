import { formatDate } from "@/lib/format";
import { getArticlePaging } from "@/api/article";
import { getThemeConfig } from "@/api/config";
import { getArticleCover, extractCovers, ArticleCoverImage } from "@/lib/article-cover";
import { extractFromSettled } from "@/lib/api-helpers";
import type { Article } from "@/types/article";
import Link from "next/link";

export default async function LatestArticlesSection() {
  const [articlesRes, themeRes] = await Promise.allSettled([
    getArticlePaging(2, 4),
    getThemeConfig(),
  ]);

  const articles = extractFromSettled(articlesRes);
  const themeValue = themeRes.status === "fulfilled" ? themeRes.value.data?.value : null;
  const covers = extractCovers(themeValue);

  return (
    <section className="sn" style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}>
      <div className="sn-inner">
        <div className="sn-hdr">
          <h2><span className="text-gold">最新文章</span><span className="en">LATEST</span></h2>
          <hr />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {articles.length > 0 ? articles.map((a) => {
            const cover = getArticleCover(a.cover, a.id, a.title, covers);
            return (
              <Link key={a.id} href={`/article/${a.id}`}
                className="border border-border rounded-2xl overflow-hidden bg-bg-card transition-all duration-400 hover:-translate-y-1 hover:border-accent2 hover:shadow-[0_12px_40px_var(--glow-soft)] relative flex flex-col group">
                <div className="h-[200px] flex-shrink-0 relative overflow-hidden bg-cover bg-center">
                  <ArticleCoverImage cover={cover} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent opacity-70" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card), transparent 50%)" }} />
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full text-[.6rem] border border-accent2 text-accent2 bg-black/50 backdrop-blur-sm">
                    {a.cateList?.[0]?.name || "文章"}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-base mb-1.5 leading-tight">{a.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed flex-1 line-clamp-2 mb-0">{a.description}</p>
                  <div className="flex items-center gap-2.5 text-[.65rem] text-text-muted mt-auto pt-2.5 border-t border-border">
                    <span>{formatDate(a.createTime)}</span>
                    <span>{a.config?.top ? "置顶" : `${a.view ?? 0} 浏览`}</span>
                    <span className="ml-auto text-[.55rem] text-accent opacity-0 group-hover:opacity-70 rotate-[5deg] transition-opacity font-calligraphy border border-accent rounded-[3px] px-1 py-[1px] leading-tight">印</span>
                  </div>
                </div>
              </Link>
            );
          }) : (
            <div className="col-span-2 text-center py-16 border border-dashed border-border rounded-2xl">
              <p className="font-kai text-text-muted">暂无文章</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
