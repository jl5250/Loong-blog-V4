import type { Metadata } from "next";

export const metadata: Metadata = { title: "音乐" };

export default function MusicPage() {
  return (
    <main className="flex-1 pt-32 pb-20 px-8 max-w-5xl mx-auto text-center">
      <div className="border border-dashed border-border rounded-2xl p-16 bg-bg-surface">
        <span className="font-calligraphy text-5xl text-text-muted/20">♪</span>
        <h1 className="font-serif font-bold text-3xl mt-6 mb-2">音乐</h1>
        <p className="font-kai text-text-muted">施工中 · 敬请期待</p>
        <div className="mt-8 inline-block w-16 h-1 bg-accent/40 rounded-full" />
      </div>
    </main>
  );
}
