import type { Metadata } from "next";
import { getArticlePaging } from "@/api/article";
import Link from "next/link";

export const metadata: Metadata = { title: "标签" };

export default async function TagPage(props: { params: Promise<{ id: number }> }) {
  const params = await props.params;
  const res = await getArticlePaging(1, 20);
  const articles = res.data?.result ?? [];

  return (
    <main className="flex-1 pt-32 pb-20 px-8 max-w-5xl mx-auto">
      <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4">标签</h1>
      <p className="font-kai text-text-muted mb-12">Tag · 标签 ID: {params.id}</p>
      {articles.length > 0 ? (
        <div className="space-y-4">
          {articles.map((a) => (
            <Link key={a.id} href={`/article/${a.id}`}
              className="block p-6 rounded-2xl border border-border bg-bg-surface hover:border-accent2/40 transition-all">
              <h2 className="font-serif font-bold text-lg">{a.title}</h2>
              <p className="text-sm text-text-muted mt-2 line-clamp-2">{a.description}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border rounded-2xl">
          <p className="font-kai text-text-muted">暂无文章</p>
        </div>
      )}
    </main>
  );
}
