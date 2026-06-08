import type { Metadata } from "next";
import { getFootprintList } from "@/api/footprint";
import { formatDate } from "@/lib/format";
import { FootprintMap } from "@/components/ui/FootprintMap";
import { FootprintGallery } from "./FootprintGallery";
import { extractResult } from "@/lib/api-helpers";
import type { Footprint } from "@/types/footprint";

export const revalidate = 300;
export const metadata: Metadata = { title: "足迹" };

export default async function FootprintPage() {
  const res = await getFootprintList();
  const footprints = extractResult<Footprint>(res);

  return (
    <main className="flex-1">
      {/* Map */}
      <section className="pt-24 pb-6">
        <div className="text-center mb-6 px-4">
          <span className="font-calligraphy text-5xl md:text-6xl text-text-muted/10 mb-2 block">足</span>
          <h1 className="font-serif font-bold text-2xl md:text-3xl text-text-body mb-1">足迹</h1>
          <p className="font-kai text-text-muted text-sm">Footprint · 行万里路</p>
        </div>
        <FootprintMap items={footprints} />
      </section>

      {/* Timeline */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {footprints.length > 0 ? (
          <div className="relative pl-10">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border/60" />
            {footprints.map((f, i) => {
              const images = Array.isArray(f.images) ? f.images : null;
              const dot = i % 2 === 0 ? "var(--accent-hex)" : "var(--accent2-hex)";
              return (
                <div key={f.id} className="relative pb-10 last:pb-0 group">
                  <div className="absolute left-[11px] top-6 w-[17px] h-[17px] rounded-full border-[3px] border-bg-primary group-hover:scale-125 transition-transform" style={{ background: dot }} />
                  <div className="border border-border rounded-2xl overflow-hidden bg-bg-surface hover:border-accent2/30 transition-all duration-300">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-48 h-36 md:h-auto flex-shrink-0 bg-bg-card relative overflow-hidden">
                        {images && images[0] ? (
                          <img src={images[0]} alt={f.title} loading="lazy" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/5 to-accent2/5">
                            <span className="font-calligraphy text-3xl text-text-muted/15">📍</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 p-5 flex flex-col">
                        <h3 className="font-serif font-bold text-base mb-1 text-text-body">{f.title || "未命名足迹"}</h3>
                        {f.address && <p className="font-sans text-[.6rem] text-accent2/80 mb-2">📍 {f.address}</p>}
                        {f.content && <p className="font-kai text-sm text-text-muted leading-relaxed line-clamp-2 flex-1">{f.content}</p>}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                          <span className="font-sans text-[.55rem] text-text-muted">{formatDate(f.createTime)}</span>
                          {images && images.length > 0 && <FootprintGallery images={images} title={f.title} />}
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
            <p className="font-kai text-text-muted">暂无足迹</p>
          </div>
        )}
      </section>
    </main>
  );
}
