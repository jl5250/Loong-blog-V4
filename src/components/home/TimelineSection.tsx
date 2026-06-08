import { formatDate } from "@/lib/format";
import { getRecordList } from "@/api/record";
import { extractFromSettled } from "@/lib/api-helpers";

export default async function TimelineSection() {
  const recordsRes = await Promise.allSettled([getRecordList(1, 5)]);
  const records = extractFromSettled(recordsRes[0]);

  return (
    <section className="sn" style={{ contentVisibility: "auto", containIntrinsicSize: "0 400px" }}>
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
  );
}
