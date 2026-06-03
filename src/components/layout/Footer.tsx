"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_PROJECT_API || "http://localhost:9003/api";

function calcRunTime(startTs: number) {
  const start = new Date(startTs);
  const now = new Date();
  const diff = now.getTime() - start.getTime();
  const days = Math.floor(diff / 86400000);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  return { years, months, days: remainingDays };
}

export function Footer() {
  const pathname = usePathname();
  // xue 页面是沉浸式全屏体验，有自己的页脚
  if (pathname === "/xue") return null;

  const [rt, setRt] = useState({ years: 0, months: 0, days: 0 });

  useEffect(() => {
    fetch(`${API}/web_config/name/web`)
      .then((r) => r.json())
      .then((d) => {
        const ts = d?.data?.value?.create_time;
        if (ts) setRt(calcRunTime(Number(ts)));
      })
      .catch(() => setRt(calcRunTime(Date.now() - 365 * 86400000)));
  }, []);

  return (
    <footer className="relative z-31 border-t border-border text-center pt-8 pb-24 px-4 max-md:pb-20">
      <p className="font-calligraphy text-lg text-text-muted/30 mb-5">
        天地一逆旅，同悲万古尘
      </p>
      <div className="flex justify-center gap-x-5 gap-y-2 flex-wrap mb-3 max-w-md mx-auto">
        {[
          { label: "首页", href: "/" },
          { label: "文章", href: "/cate/1" },
          { label: "数据", href: "/data" },
          { label: "说说", href: "/record" },
          { label: "标签", href: "/tags" },
          { label: "设备", href: "/equipment" },
          { label: "足迹", href: "/footprint" },
          { label: "留言墙", href: "/wall/all" },
          { label: "谦友", href: "/xue" },
          { label: "友链", href: "/friend" },
          { label: "关于", href: "/my" },
        ].map((l) => (
          <Link
            key={l.label}
            href={l.href}
            className="font-sans text-xs text-text-muted/60 no-underline transition-colors hover:text-accent"
          >
            {l.label}
          </Link>
        ))}
      </div>
      <p className="font-sans text-xs text-text-muted/35 pt-3 mt-3 border-t border-border/50">
        基于开源项目{" "}
        <a
          href="https://github.com/LiuYuYang01/ThriveX-Admin"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:text-accent2 transition-colors no-underline"
        >
          ThriveX
        </a>{" "}
        构建
      </p>
      <p className="font-sans text-xs text-text-muted/25 mt-1">豫ICP备2020031040号-1</p>
      <p className="font-sans text-xs text-text-muted/40 mt-1">
        已运行 {rt.years} 年 {rt.months} 个月 {rt.days} 天
      </p>
    </footer>
  );
}
