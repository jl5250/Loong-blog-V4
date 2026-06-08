import { formatDate } from "@/lib/format";
import { getLatestComments } from "@/api/comment";
import { extractFromSettled } from "@/lib/api-helpers";
import Link from "next/link";

export default async function CommentsSection() {
  const commentsRes = await Promise.allSettled([getLatestComments(1, 5)]);
  const comments = extractFromSettled(commentsRes[0]);
  const colors = ["accent", "accent2", "gold"];

  return (
    <section className="sn" style={{ contentVisibility: "auto", containIntrinsicSize: "0 300px" }}>
      <div className="sn-inner">
        <div className="sn-hdr">
          <h2><span className="text-accent2">最新评论</span><span className="en">COMMENTS</span></h2>
          <hr />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {comments.length > 0 ? comments.slice(0, 3).map((c, i) => {
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
                {c.articleTitle && (
                  <span className="font-sans text-[.6rem] text-accent2">
                    发表于「{c.articleTitle}」
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
  );
}
