import { Swiper } from "@/components/ui/Swiper";
import { getSwiperList } from "@/api/swiper";
import { getRecommendedArticleList } from "@/api/article";
import { extractFromSettled } from "@/lib/api-helpers";
import { normalizeCoverUrl } from "@/lib/article-cover";
import type { Swiper as SwiperType } from "@/types/swiper";
import type { Article } from "@/types/article";

export default async function SwiperSection() {
  const [swiperRes, hotRes] = await Promise.allSettled([
    getSwiperList(),
    getRecommendedArticleList(),
  ]);

  const swiperData = extractFromSettled(swiperRes) as SwiperType[];
  const hotArticles = extractFromSettled(hotRes);

  const slides = swiperData.length > 0
    ? swiperData.slice(0, 5).map((s) => ({
        title: s.title,
        description: s.description || "",
        tag: s.title.slice(0, 4),
        image: s.image,
      }))
    : hotArticles.slice(0, 3).map((a: Article) => ({
        title: a.title,
        description: a.description || "",
        tag: a.cateList?.[0]?.name || "文章",
        image: normalizeCoverUrl(a.cover),
      }));

  return (
    <section className="sn" style={{ contentVisibility: "auto", containIntrinsicSize: "0 500px" }}>
      <div className="sn-inner">
        <div className="sn-hdr">
          <h2><span className="text-accent">精选推荐</span><span className="en">FEATURED</span></h2>
          <hr />
        </div>
        <Swiper slides={slides} />
      </div>
    </section>
  );
}
