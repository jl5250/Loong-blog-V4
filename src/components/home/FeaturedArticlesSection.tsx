import { formatDate } from "@/lib/format";
import { HorizontalScroll } from "@/components/ui/HorizontalScroll";
import { getArticlePaging } from "@/api/article";
import { getThemeConfig } from "@/api/config";
import { getArticleCover, extractCovers, ArticleCoverImage } from "@/lib/article-cover";
import { extractFromSettled } from "@/lib/api-helpers";
import type { Article } from "@/types/article";
import Link from "next/link";

export default async function FeaturedArticlesSection() {
  const [articlesRes, themeRes] = await Promise.allSettled([
    getArticlePaging(1, 4),
    getThemeConfig(),
  ]);

  const articles = extractFromSettled(articlesRes);
  const themeValue = themeRes.status === "fulfilled" ? themeRes.value.data?.value : null;
  const covers = extractCovers(themeValue);

  return (
    <section className="sn" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}>
      <div className="sn-inner">
        <div className="sn-hdr">
          <h2><span className="text-accent2">精选文章</span><span className="en">CURATED</span></h2>
          <hr />
        </div>
        <HorizontalScroll className="flex gap-5 pb-3">
          {articles.length > 0 ? articles.map((a) => {
            const cover = getArticleCover(a.cover, a.id, a.title, covers);
            return (
              <Link key={a.id} href={`/article/${a.id}`}
                className="min-w-[280px] max-md:min-w-[85vw] max-w-[380px] w-full flex-shrink-0 snap-start rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-400 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_16px_48px_var(--glow-soft)] relative flex flex-col self-stretch">
                <div className="h-[180px] flex-shrink-0 relative overflow-hidden bg-cover bg-center">
                  <ArticleCoverImage cover={cover} className="w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-radial from-accent/5 to-transparent opacity-70" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card), transparent 50%)" }} />
                  <span className="absolute top-3.5 left-3.5 px-2.5 py-0.5 rounded-full text-[.6rem] border border-accent2 text-accent2 bg-black/50 backdrop-blur-sm">
                    {a.cateList?.[0]?.name || "文章"}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-serif font-bold text-sm md:text-base mb-1.5 leading-tight line-clamp-2">{a.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed flex-1 line-clamp-2 mb-0">{a.description}</p>
                  <div className="flex items-center gap-2.5 text-[.65rem] text-text-muted mt-auto pt-2.5 border-t border-border">
                    <span>{formatDate(a.createTime)}</span>
                    <span className="text-accent2 ml-auto">{a.view ?? 0} 浏览</span>
                    <span className="text-[.55rem] text-accent opacity-0 group-hover:opacity-70 rotate-[5deg] transition-opacity font-calligraphy border border-accent rounded-[3px] px-1 py-[1px] leading-tight ml-1">印</span>
                  </div>
                </div>
              </Link>
            );
          }) : (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="min-w-[340px] max-w-[380px] flex-shrink-0 snap-start rounded-2xl border border-border bg-bg-card overflow-hidden">
                <div className="h-[180px] bg-gradient-to-br from-bg-surface-raised to-bg-surface" />
                <div className="p-4">
                  <div className="h-4 w-3/4 bg-bg-surface-raised rounded mb-2" />
                  <div className="h-3 w-full bg-bg-surface-raised rounded" />
                </div>
              </div>
            ))
          )}
        </HorizontalScroll>
        <p className="text-center text-[.6rem] text-text-muted tracking-widest mt-1 font-sans">← 左右滑动 →</p>
      </div>
    </section>
  );
}
