import type { Metadata } from "next";
import { getFootprintList } from "@/api/footprint";
import { formatDate } from "@/lib/format";

export const revalidate = 300;
import { FootprintMap } from "@/components/ui/FootprintMap";
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
  const footprints = Array.isArray(res.data) ? res.data : [];

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-accent/3 blur-[120px]" />
        <div className="absolute top-1/3 right-0 w-72 h-72 rounded-full bg-accent2/4 blur-[80px]" />
        <div className="absolute bottom-1/4 left-0 w-64 h-64 rounded-full bg-accent/3 blur-[80px]" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">足</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">足迹</h1>
          <p className="font-kai text-text-muted">Footprint · 行万里路</p>
        </div>

        {footprints.length > 0 ? (
          <>
            {/* Map */}
            <div className="mb-12 rounded-2xl overflow-hidden border border-border">
              <FootprintMap items={footprints} />
            </div>

            {/* Timeline list */}
            <div className="relative pl-10">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60" />

              {footprints.map((f, i) => {
                const images = parseImages(f.images);
                const dotColor = i % 2 === 0 ? "var(--accent-hex)" : "var(--accent2-hex)";
                return (
                  <div key={f.id} className="relative pb-12 last:pb-0 group">
                    {/* Timeline dot */}
                    <div
                      className="absolute left-[11px] top-7 w-[17px] h-[17px] rounded-full border-[3px] border-bg-primary shadow-[0_0_0_3px_var(--border-color)] group-hover:scale-125 transition-transform"
                      style={{
                        background: dotColor,
                        "--border-color": "rgba(255,255,255,0.08)",
                      } as React.CSSProperties}
                    />

                    {/* Card */}
                    <div className="border border-border rounded-2xl overflow-hidden bg-bg-surface hover:border-accent2/30 transition-all duration-300">
                      <div className="flex flex-col md:flex-row">
                        {/* Image / thumbnail */}
                        <div className="md:w-52 h-40 md:h-auto flex-shrink-0 bg-bg-card relative overflow-hidden">
                          {images && images.length > 0 ? (
                            <img
                              src={images[0]}
                              alt={f.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="font-calligraphy text-4xl text-text-muted/15">📍</span>
                            </div>
                          )}
                          {images && images.length > 1 && (
                            <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[.5rem] font-sans px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                              +{images.length}
                            </span>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 p-5 flex flex-col">
                          <h3 className="font-serif font-bold text-base mb-1 text-text-body">
                            {f.title || "未命名足迹"}
                          </h3>
                          {f.address && (
                            <div className="flex items-center gap-1.5 mb-2">
                              <span className="text-[.5rem] text-accent2 font-sans">📍</span>
                              <span className="font-sans text-[.6rem] text-accent2/80">{f.address}</span>
                            </div>
                          )}
                          {f.content && (
                            <p className="font-kai text-sm text-text-muted leading-relaxed line-clamp-2 flex-1">
                              {f.content}
                            </p>
                          )}

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                            <span className="font-sans text-[.55rem] text-text-muted">
                              {formatDate(f.createTime)}
                            </span>
                            <div className="flex items-center gap-2">
                              {images && images.length > 0 && (
                                <FootprintGallery images={images} title={f.title} />
                              )}
                              {f.position && (
                                <span className="font-sans text-[.5rem] text-text-muted/40">
                                  {f.position}
                                </span>
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
          </>
        ) : (
          <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-bg-surface">
            <span className="font-calligraphy text-6xl text-text-muted/10">空</span>
            <p className="font-kai text-text-muted mt-4">暂无足迹 · 世界那么大，我想去看看</p>
          </div>
        )}
      </div>
    </main>
  );
}
