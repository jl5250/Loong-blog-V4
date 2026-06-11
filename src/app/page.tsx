import { InkParticles } from "@/components/ink/InkParticles";
import { InkAnimals } from "@/components/ui/InkAnimals";
import { Suspense } from "react";
import type { Metadata } from "next";
import SwiperSection from "@/components/home/SwiperSection";
import FeaturedArticlesSection from "@/components/home/FeaturedArticlesSection";
import LatestArticlesSection from "@/components/home/LatestArticlesSection";
import TimelineSection from "@/components/home/TimelineSection";
import CommentsSection from "@/components/home/CommentsSection";

export const revalidate = 60;

export const metadata: Metadata = {
  description: "Loong·Blog — 业余前端的技术博客与生活记录，分享前端开发、设计与生活感悟",
  alternates: { canonical: "https://loongblog.fun" },
};

/** 加载中占位 — 墨点风格骨架屏 */
function SectionSkeleton({ height = "400px" }: { height?: string }) {
  return (
    <div className="sn">
      <div className="sn-inner">
        <div className="sn-hdr">
          <div className="h-6 w-32 bg-bg-surface-raised rounded mb-2" />
          <hr />
        </div>
        <div className="animate-pulse" style={{ height }}>
          <div className="h-full bg-bg-surface-raised/30 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* ===== Hero ===== */}
        <section
          className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-6"
          style={{ contentVisibility: "auto", containIntrinsicSize: "0 100vh" }}
        >
          <InkParticles />

          <h1 className="font-calligraphy text-[clamp(2.5rem,10vw,10rem)] leading-[1] mb-3 animate-fade-reveal text-shadow-glow max-w-full overflow-wrap-break-word" style={{ animationDelay: "0.3s" }}>
            墨·<span className="text-accent">Loong</span>
          </h1>
          <p className="font-sans font-extralight text-[clamp(.8rem,1.3vw,1rem)] text-text-muted tracking-[.5em] uppercase animate-fade-reveal hidden sm:block" style={{ animationDelay: "1s" }}>
            INK CYBER — LITERATI IN THE MACHINE AGE
          </p>
          <p className="font-sans font-light text-base text-text-muted mt-10 animate-fade-reveal" style={{ animationDelay: "1.6s" }}>
            吾生也有涯，而知也无涯<span className="inline-block w-[2px] h-[1.1em] bg-accent ml-1 align-text-bottom animate-pulse" />
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 flex flex-col items-center gap-1.5 animate-fade-reveal" style={{ animationDelay: "2.8s" }}>
            <div className="w-[22px] h-[34px] border-2 border-text-muted rounded-[10px] relative">
              <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[2px] h-[7px] bg-accent rounded-full animate-bounce" />
            </div>
          </div>
        </section>

        {/* ===== Swiper (streamed) ===== */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <SwiperSection />
        </Suspense>

        {/* ===== Featured Articles (streamed) ===== */}
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <FeaturedArticlesSection />
        </Suspense>

        {/* ===== Latest Articles (streamed) ===== */}
        <Suspense fallback={<SectionSkeleton height="500px" />}>
          <LatestArticlesSection />
        </Suspense>

        {/* ===== Timeline (streamed) ===== */}
        <Suspense fallback={<SectionSkeleton height="400px" />}>
          <TimelineSection />
        </Suspense>

        {/* ===== Latest Comments (streamed) ===== */}
        <Suspense fallback={<SectionSkeleton height="300px" />}>
          <CommentsSection />
        </Suspense>

      </main>

      {/* ===== Ink Animals (sticky, above footer) ===== */}
      <div className="ink-wrap">
        <div className="msk" />
        <InkAnimals />
      </div>
    </>
  );
}
