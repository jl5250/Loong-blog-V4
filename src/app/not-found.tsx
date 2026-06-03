import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md px-8">
        {/* Large ink splash */}
        <div className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-radial from-accent/10 from-10% via-accent/5 via-40% to-transparent to-70%" />
        <h1 className="font-calligraphy text-6xl mb-4 text-text-body/70">
          不知所踪
        </h1>
        <p className="font-serif text-text-muted mb-8">
          此页如墨滴入水，消散无踪
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-3 rounded-full border border-accent text-accent font-sans text-sm hover:bg-accent hover:text-white transition-colors"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
