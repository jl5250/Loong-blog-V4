import Link from "next/link";

/**
 * Approximate site start date (from web_config create_time: 1547568000000 = 2019-01-15)
 */
function getRunTime() {
  const start = new Date(1547568000000);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const days = Math.floor(diff / 86400000);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  return { years, months, days: remainingDays };
}

export function Footer() {
  const rt = getRunTime();

  return (
    <footer className="relative z-31 border-t border-border text-center pt-6 pb-20 px-6 max-md:pb-16">
      <p className="font-calligraphy text-xl text-text-muted/30 mb-5">
        天地一逆旅，同悲万古尘
      </p>
      <div className="flex justify-center gap-4 flex-wrap mb-2">
        {["首页", "文章", "标签", "关于", "足迹", "友链"].map((label) => (
          <Link
            key={label}
            href="#"
            className="font-sans text-[.7rem] text-text-muted no-underline transition-colors hover:text-accent"
          >
            {label}
          </Link>
        ))}
      </div>
      <p className="font-sans text-[.6rem] text-text-muted/35 pt-2 mt-2 border-t border-border">
        ThriveX v4 · 墨·赛博 Ink Cyber
      </p>
      <p className="font-sans text-[.6rem] text-text-muted/25 mt-1">豫ICP备2020031040号-1</p>
      <p className="font-sans text-[.6rem] text-text-muted/40 mt-1">
        已运行 {rt.years} 年 {rt.months} 个月 {rt.days} 天
      </p>
    </footer>
  );
}
