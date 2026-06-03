import type { Metadata } from "next";

export const metadata: Metadata = { title: "学" };

export default function XuePage() {
  return (
    <main className="flex-1 pt-32 pb-20 px-8 max-w-5xl mx-auto text-center">
      <div className="border border-dashed border-border rounded-2xl p-16 bg-bg-surface">
        <span className="font-calligraphy text-5xl text-text-muted/20">学</span>
        <h1 className="font-serif font-bold text-3xl mt-6 mb-2">学</h1>
        <p className="font-kai text-text-muted">学海无涯 · 保留现有功能</p>
      </div>
    </main>
  );
}
