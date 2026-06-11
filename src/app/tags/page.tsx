import type { Metadata } from "next";
import { getTagList } from "@/api/tag";
import { getCateList } from "@/api/cate";
import { extractFromSettled } from "@/lib/api-helpers";
import type { Tag } from "@/types/tag";
import type { Cate } from "@/types/cate";

export const revalidate = 300;
import Link from "next/link";

export const metadata: Metadata = {
  title: "标签云",
  alternates: { canonical: "https://loongblog.fun/tags" },
};

export default async function TagsPage() {
  const [tagRes, cateRes] = await Promise.allSettled([
    getTagList(),
    getCateList(),
  ]);

  const tags: Tag[] = extractFromSettled(tagRes);
  const allCates: Cate[] = extractFromSettled(cateRes);
  const cates = allCates.filter((c) => c.type === "cate");

  return (
    <main className="flex-1 pt-28 md:pt-32 pb-20 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto">
      <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4">标签云</h1>
      <p className="font-kai text-text-muted mb-8">Tag Cloud · 以印章排列</p>

      {/* Categories first */}
      {cates.length > 0 && (
        <div className="mb-12">
          <h2 className="font-serif font-bold text-lg text-text-muted mb-4">分类 · Categories</h2>
          <div className="flex flex-wrap gap-3">
            {cates.map((c, i) => (
              <span key={i} className="px-4 py-2 rounded-full border border-accent2/40 text-accent2 font-serif text-sm">
                {c.name}
                <span className="ml-2 text-xs opacity-60">{c.count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags cloud */}
      {tags.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {tags.map((tag) => {
            const count = tag.count ?? 0;
            const size = count > 12 ? "text-xl px-6 py-3" : count > 8 ? "text-base px-5 py-2.5" : count > 5 ? "text-sm px-4 py-2" : "text-xs px-3 py-1.5";
            return (
              <Link key={tag.id} href={`/tag/${tag.id}`}
                className={`inline-block rounded-full border border-border text-text-muted hover:border-accent2 hover:text-accent2 transition-all duration-300 font-serif ${size} cursor-pointer hover:-translate-y-1 hover:shadow-lg`}>
                {tag.name}
                <span className="ml-2 opacity-60 text-xs">{count}</span>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="font-kai text-text-muted">暂无标签</p>
        </div>
      )}
    </main>
  );
}
