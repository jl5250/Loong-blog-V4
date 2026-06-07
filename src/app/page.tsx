import { InkParticles } from "@/components/ink/InkParticles";
import { formatDate } from "@/lib/format";
import { Swiper } from "@/components/ui/Swiper";
import { HorizontalScroll } from "@/components/ui/HorizontalScroll";
import { InkAnimals } from "@/components/ui/InkAnimals";
import { getArticlePaging, getRecommendedArticleList } from "@/api/article";
import { getSwiperList } from "@/api/swiper";
import { getLatestComments } from "@/api/comment";
import { getThemeConfig } from "@/api/config";
import { getRecordList } from "@/api/record";
import { getTagList } from "@/api/tag";
import { getCateList } from "@/api/cate";
import Link from "next/link";

export const revalidate = 60;

export default async function Home() {
  // Fetch data
  const [swiperRes, themeRes, articlesRes, hotRes, recordsRes, commentsRes, tagsRes, catesRes] = await Promise.allSettled([
    getSwiperList(),
    getThemeConfig(),
    getArticlePaging(1, 4),
    getRecommendedArticleList(),
    getRecordList(1, 5),
    getLatestComments(1, 5),
    getTagList(),
    getCateList(),
  ]);

  const swiperData = swiperRes.status === "fulfilled" ? swiperRes.value.data ?? [] : [];
  const themeValue = themeRes.status === "fulfilled" ? themeRes.value.data?.value : null;
  const covers: string[] = (themeValue as any)?.covers ?? [];
  const articles = articlesRes.status === "fulfilled" ? articlesRes.value.data?.result ?? [] : [];
  const hotArticles = hotRes.status === "fulfilled" ? hotRes.value.data ?? [] : [];
  const records: any[] = recordsRes.status === "fulfilled" ? ((recordsRes.value.data as any)?.result ?? (Array.isArray(recordsRes.value.data) ? recordsRes.value.data : [])) : [];
  const comments: any[] = commentsRes.status === "fulfilled" ? ((commentsRes.value.data as any)?.result ?? (Array.isArray(commentsRes.value.data) ? commentsRes.value.data : [])) : [];
  const tags: any[] = tagsRes.status === "fulfilled" ? ((tagsRes.value.data as any)?.result ?? (Array.isArray(tagsRes.value.data) ? tagsRes.value.data : [])) : [];
  const cates: any[] = catesRes.status === "fulfilled" ? ((catesRes.value.data as any)?.result ?? (Array.isArray(catesRes.value.data) ? catesRes.value.data : [])) : [];

  // Pick a cover from theme covers array using article id as seed
  function articleCover(cover: string | undefined | null, id?: number): string {
    if (cover) return `url(${cover})`;
    if (covers.length > 0 && id) {
      return `url(${covers[Math.abs(id) % covers.length]})`;
    }
    return "linear-gradient(135deg, var(--bg-surface-raised-hex), var(--bg-surface-hex))";
  }

  // Build swiper slides from API data
  const swiperSlides = swiperData.length > 0 ? swiperData.slice(0, 5).map((s) => ({
    title: s.title,
    description: s.description || "",
    tag: s.title.slice(0, 4),
    image: s.image,
  })) : articles.slice(0, 3).map((a) => ({
    title: a.title,
    description: a.description || "",
    tag: a.cateList?.[0]?.name || "文章",
    image: a.cover || "",
  }));

  return (
    <>
      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6">
          <InkParticles />

          <h1 className="font-calligraphy text-[clamp(4rem,13vw,10rem)] leading-[1] mb-3 animate-fade-reveal text-shadow-glow" style={{ animationDelay: "0.3s" }}>
            墨·<span className="text-accent">Loong</span>
          </h1>
          <p className="font-sans font-extralight text-[clamp(.8rem,1.3vw,1rem)] text-text-muted tracking-[.5em] uppercase animate-fade-reveal" style={{ animationDelay: "1s" }}>
            INK CYBER — LITERATI IN THE MACHINE AGE
          </p>
          <p className="font-sans font-light text-base text-text-muted mt-10 animate-fade-reveal" style={{ animationDelay: "1.6s" }}>
            吾生也有涯，而知也无涯<span className="inline-block w-[2px] h-[1.1em] bg-accent ml-1 align-text-bottom animate-pulse" />
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 flex flex-col items-center gap-1.5 animate-fade-reveal" style={{ animationDelay: "2.8s" }}>
            <div className="w-[22px] h-[34px] border-2 border-text-muted rounded-[10px] relative">
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[2px] h-[7px] bg-accent rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* ===== Swiper ===== */}
        <section className="sn">
          <div className="sn-inner">
            <div className="sn-hdr">
              <h2><span className="text-accent">精选推荐</span><span className="en">FEATURED</span></h2>
              <hr />
            </div>
            <Swiper slides={swiperSlides} />
          </div>
        </section>

        {/* ===== Featured Articles (Horizontal) ===== */}
        <section className="sn">
          <div className="sn-inner">
            <div className="sn-hdr">
              <h2><span className="text-accent2">精选文章</span><span className="en">CURATED</span></h2>
              <hr />
            </div>
            <HorizontalScroll className="flex gap-5 pb-3">
              {articles.length > 0 ? articles.map((a) => (
                <Link key={a.id} href={`/article/${a.id}`}
                  className="min-w-[280px] max-md:min-w-[75vw] max-w-[380px] w-full flex-shrink-0 snap-start rounded-2xl border border-border bg-bg-card overflow-hidden transition-all duration-400 hover:-translate-y-1.5 hover:border-accent hover:shadow-[0_16px_48px_var(--glow-soft)] relative flex flex-col self-stretch">
                  <div
                    className="h-[180px] flex-shrink-0 relative overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: articleCover(a.cover, a.id), backgroundSize: "cover" }}
                    role="img"
                  >
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
              )) : (
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

        {/* ===== Latest Articles ===== */}
        <section className="sn">
          <div className="sn-inner">
            <div className="sn-hdr">
              <h2><span className="text-gold">最新文章</span><span className="en">LATEST</span></h2>
              <hr />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {articles.length > 0 ? articles.map((a) => (
                <Link key={a.id} href={`/article/${a.id}`}
                  className="border border-border rounded-2xl overflow-hidden bg-bg-card transition-all duration-400 hover:-translate-y-1 hover:border-accent2 hover:shadow-[0_12px_40px_var(--glow-soft)] relative flex flex-col group">
                  <div
                    className="h-[200px] flex-shrink-0 relative overflow-hidden bg-cover bg-center"
                    style={{ backgroundImage: articleCover(a.cover, a.id) }}
                  >
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
              )) : (
                <div className="col-span-2 text-center py-16 border border-dashed border-border rounded-2xl">
                  <p className="font-kai text-text-muted">暂无文章</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== Timeline ===== */}
        <section className="sn">
          <div className="sn-inner">
            <div className="sn-hdr">
              <h2><span className="text-accent">最新动态</span><span className="en">RECENT</span></h2>
              <hr />
            </div>
            <div className="tl-v">
              {records.length > 0 ? records.map((r, i) => (
                <div key={r.id ?? i} className="tl-item">
                  <div className="tl-dot" />
                  <div className="tl-date font-sans">{formatDate(r.createTime)}</div>
                  <div className="tl-text">{r.content}</div>
                </div>
              )) : (
                <p className="font-kai text-text-muted text-center py-8">暂无动态</p>
              )}
            </div>
          </div>
        </section>

        {/* ===== Latest Comments ===== */}
        <section className="sn">
          <div className="sn-inner">
            <div className="sn-hdr">
              <h2><span className="text-accent2">最新评论</span><span className="en">COMMENTS</span></h2>
              <hr />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {comments.length > 0 ? comments.slice(0, 3).map((c, i) => {
                const colors = ["accent", "accent2", "gold"];
                const color = colors[i % colors.length];
                return (
                  <Link key={c.id} href={`/article/${c.articleId}#comments`} className="block border border-border rounded-xl p-4 bg-bg-card transition-all hover:border-accent2 hover:-translate-y-0.5">
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[.6rem] font-bold flex-shrink-0 text-white"
                        style={{ background: `linear-gradient(135deg, var(--${color}-hex), var(--${color}-hex)88)` }}
                      >
                        {c.name?.[0] ?? "?"}
                      </div>
                      <div>
                        <div className="text-sm font-bold">{c.name}</div>
                        <div className="font-sans text-[.55rem] text-text-muted">{formatDate(c.createTime)}</div>
                      </div>
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed mb-2 line-clamp-2">{c.content}</p>
                    {(c as any).articleTitle && (
                      <span className="font-sans text-[.6rem] text-accent2">
                        发表于「{(c as any).articleTitle}」
                      </span>
                    )}
                  </Link>
                );
              }) : (
                <div className="col-span-3 text-center py-8">
                  <p className="font-kai text-xs text-text-muted">暂无评论</p>
                </div>
              )}
            </div>
          </div>
        </section>

      </main>

      {/* ===== Ink Animals (sticky, above footer) ===== */}
      <div className="ink-wrap">
        <div className="msk" />
        <InkAnimals />
      </div>
    </>
  );
}
