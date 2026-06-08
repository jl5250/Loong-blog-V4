import type { Metadata } from "next";
import { getFootprintList } from "@/api/footprint";
import { formatDate } from "@/lib/format";
import dynamic from "next/dynamic";

export const revalidate = 300;

const FootprintMap = dynamic(() => import("@/components/ui/FootprintMap").then(m => m.FootprintMap), { ssr: false });
import { FootprintGallery } from "./FootprintGallery";

export const metadata: Metadata = { title: "足迹" };

function parseImages(images: unknown): string[] | null {
  if (!images) return null;
  if (Array.isArray(images)) return images;
  if (typeof images === "string") {
    try { return JSON.parse(images); } catch { return null; }
  }
  return null;
}

export default async function FootprintPage() {
  const res = await getFootprintList();
  const footprints: any[] = (res.data as any)?.result ?? (Array.isArray(res.data) ? res.data : []);

  return (
    <main className="flex-1">
      {/* ── Map Hero ── */}
      <section className="relative">
        <div className="absolute top-0 left-0 right-0 z-10 pt-24 pb-6 px-6 text-center pointer-events-none">
          <span className="font-calligraphy text-5xl md:text-6xl text-black/20 dark:text-white/20 mb-2 block">足</span>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-black dark:text-white drop-shadow-lg mb-1">足迹</h1>
          <p className="font-kai text-black/60 dark:text-white/60 text-sm drop-shadow">Footprint · 行万里路</p>
        </div>
        <FootprintMap items={footprints} />
      </section>

      {/* ── Timeline ── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        {footprints.length > 0 ? (
          <div className="relative pl-10">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60" />

            {footprints.map((f: any, i: number) => {
              const images = parseImages(f.images);
              const dotColor = i % 2 === 0 ? "var(--accent-hex)" : "var(--accent2-hex)";
              return (
                <div key={f.id} className="relative pb-10 last:pb-0 group">
                  <div
                    className="absolute left-[11px] top-6 w-[17px] h-[17px] rounded-full border-[3px] border-bg-primary group-hover:scale-125 transition-transform"
                    style={{ background: dotColor }}
                  />

                  <div className="border border-border rounded-2xl overflow-hidden bg-bg-surface hover:border-accent2/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-36 md:h-auto flex-shrink-0 bg-bg-card relative overflow-hidden">
                        {images && images.length > 0 ? (
                          <img src={images[0]} alt={f.title} loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent2/5">
                            <span className="font-calligraphy text-3xl text-text-muted/15">📍</span>
                          </div>
                        )}
                        {images && images.length > 1 && (
                          <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[.5rem] font-sans px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                            +{images.length}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 p-5 flex flex-col">
                        <h3 className="font-serif font-bold text-base mb-1 text-text-body">
                          {f.title || "未命名足迹"}
                        </h3>
                        {f.address && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-[.5rem] text-accent2">📍</span>
                            <span className="font-sans text-[.6rem] text-accent2/80">{f.address}</span>
                          </div>
                        )}
                        {f.content && (
                          <p className="font-kai text-sm text-text-muted leading-relaxed line-clamp-2 flex-1">
                            {f.content}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                          <span className="font-sans text-[.55rem] text-text-muted">
                            {formatDate(f.createTime)}
                          </span>
                          <div className="flex items-center gap-2">
                            {images && images.length > 0 && (
                              <FootprintGallery images={images} title={f.title} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-bg-surface">
            <span className="font-calligraphy text-5xl text-text-muted/10">空</span>
            <p className="font-kai text-text-muted mt-4">暂无足迹 · 世界那么大，我想去看看</p>
          </div>
        )}
      </section>
    </main>
  );
}
