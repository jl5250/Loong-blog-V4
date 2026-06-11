import type { Metadata } from "next";
import { getTagArticles, getTagList } from "@/api/tag";
import { extractFromSettled } from "@/lib/api-helpers";
import type { Article } from "@/types/article";
import type { Tag } from "@/types/tag";
import Link from "next/link";
import { formatDate } from "@/lib/format";

export async function generateMetadata(props: { params: Promise<{ id: number }> }): Promise<Metadata> {
  const params = await props.params;
  try {
    const tagRes = await getTagList();
    const tags = tagRes.data ?? [];
    const tag = tags.find((t) => t.id === Number(params.id));
    return {
      title: tag ? `标签 · ${tag.name}` : "标签",
      description: tag ? `${tag.name} 相关文章 — Loong·Blog` : "标签文章列表",
      alternates: { canonical: `https://loongblog.fun/tag/${params.id}` },
    };
  } catch {
    return {
      title: "标签",
      alternates: { canonical: `https://loongblog.fun/tag/${params.id}` },
    };
  }
}

export default async function TagPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const tagId = Number(params.id);

  const [articleRes, tagRes] = await Promise.allSettled([
    getTagArticles(tagId),
    getTagList(),
  ]);

  const articles: Article[] = extractFromSettled(articleRes);
  const tags: Tag[] = extractFromSettled(tagRes);
  const tag = tags.find((t) => t.id === tagId);

  return (
    <main className="flex-1 pt-28 md:pt-32 pb-20 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <span className="font-calligraphy text-5xl md:text-6xl text-text-muted/10 mb-2 block">签</span>
        <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">
          {tag?.name || "标签"}
        </h1>
        <p className="font-kai text-text-muted text-sm">
          Tag · {tag ? `${tag.name}（${articles.length} 篇）` : `标签 ID: ${tagId}`}
        </p>
      </div>

      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((a) => (
            <Link key={a.id} href={`/article/${a.id}`}
              className="block p-5 sm:p-6 rounded-2xl border border-border bg-bg-surface hover:border-accent2/40 hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif font-bold text-base sm:text-lg mb-1.5 line-clamp-1">{a.title}</h2>
                  {a.description && (
                    <p className="text-xs sm:text-sm text-text-muted line-clamp-2 leading-relaxed">{a.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-3 text-xs text-text-muted font-sans">
                    <span>{formatDate(a.createTime)}</span>
                    <span>{a.view ?? 0} 浏览</span>
                    {a.cateList?.[0] && (
                      <span className="text-accent2">{a.cateList[0].name}</span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <span className="font-calligraphy text-5xl text-text-muted/10 mb-4 block">空</span>
          <p className="font-kai text-text-muted">暂无文章</p>
        </div>
      )}
    </main>
  );
}
