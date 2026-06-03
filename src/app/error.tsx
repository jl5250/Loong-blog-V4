"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-8">
        {/* Ink splash decoration */}
        <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-radial from-accent/20 to-transparent animate-pulse" />
        <h1 className="font-serif font-bold text-2xl mb-4 text-accent">
          出错了
        </h1>
        <p className="font-serif text-text-muted mb-8">
          墨迹未干，再试一次？
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 rounded-full border border-accent text-accent font-sans text-sm hover:bg-accent hover:text-white transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  );
}
