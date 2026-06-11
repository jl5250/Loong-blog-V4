import type { Metadata } from "next";
import { getArticlePaging } from "@/api/article";
import { getTagList } from "@/api/tag";
import Link from "next/link";

export async function generateMetadata(props: { params: Promise<{ id: number }> }): Promise<Metadata> {
  const params = await props.params;
  try {
    const tagRes = await getTagList();
    const tags = tagRes.data ?? [];
    const tag = tags.find((t) => t.id === Number(params.id));
    return {
      title: tag ? `标签 · ${tag.name}` : "标签",
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

  const [articleRes, tagRes] = await Promise.all([
    getArticlePaging(1, 20, undefined, undefined, tagId),
    getTagList(),
  ]);

  const articles = articleRes.data?.result ?? [];
  const tags = tagRes.data ?? [];
  const tag = tags.find((t) => t.id === tagId);

  return (
    <main className="flex-1 pt-32 pb-20 px-8 max-w-5xl mx-auto">
      <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4">
        {tag?.name || "标签"}
      </h1>
      <p className="font-kai text-text-muted mb-12">
        Tag · {tag ? `${tag.name}（${tag.count ?? articles.length} 篇）` : `标签 ID: ${tagId}`}
      </p>
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
