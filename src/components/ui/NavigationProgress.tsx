"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * 全局导航进度条
 *
 * 在客户端导航（Link 点击或 router.push）时立即显示进度条，
 * 页面加载完成后自动消失。不依赖任何第三方进度条库，
 * 纯 CSS 动画实现。
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const barRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const progressRef = useRef(0);

  // 进度增长定时器
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 开始进度条
  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    progressRef.current = 0;
    setVisible(true);

    // 快速到达 60%，然后缓慢增长
    if (barRef.current) {
      barRef.current.style.width = "0%";
      barRef.current.style.opacity = "1";
    }

    // 先快速到 60%
    requestAnimationFrame(() => {
      if (barRef.current) {
        barRef.current.style.transition = "width 1.2s cubic-bezier(0.4, 0, 0.2, 1)";
        barRef.current.style.width = "60%";
      }
    });

    // 缓慢爬升到 85%
    timerRef.current = setInterval(() => {
      if (progressRef.current < 85) {
        progressRef.current += Math.random() * 8;
        if (progressRef.current > 85) progressRef.current = 85;
        if (barRef.current) {
          barRef.current.style.width = `${progressRef.current}%`;
        }
      }
    }, 400);
  };

  // 结束进度条
  const done = () => {
    if (!startedRef.current) return;
    startedRef.current = false;

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    progressRef.current = 100;
    if (barRef.current) {
      barRef.current.style.transition = "width 0.3s ease";
      barRef.current.style.width = "100%";
    }

    // 完成后淡出
    setTimeout(() => {
      if (barRef.current) {
        barRef.current.style.opacity = "0";
      }
      setTimeout(() => {
        setVisible(false);
        if (barRef.current) {
          barRef.current.style.width = "0%";
        }
      }, 300);
    }, 200);
  };

  // 监听路由变化 — 完成进度
  useEffect(() => {
    if (startedRef.current) {
      done();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 全局点击监听：捕获导航链接点击
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = (e: MouseEvent) => {
      // 查找最近的可点击链接
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // 只处理内部导航（不以 http 开头且不是锚点）
      if (
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.startsWith("javascript:")
      ) {
        return;
      }

      // 忽略下载链接和外部跳转
      if (target.hasAttribute("download") || target.hasAttribute("target")) {
        return;
      }

      // 检查是否在当前窗口导航
      const targetAttr = target.getAttribute("target");
      if (targetAttr === "_blank") return;

      start();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // 超时保护：进度条最多显示 8 秒
  useEffect(() => {
    if (!visible) return;
    const timeout = setTimeout(() => {
      if (startedRef.current) done();
    }, 8000);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <div
        ref={barRef}
        className="h-full w-0"
        style={{
          background: "linear-gradient(90deg, var(--accent-hex, #c44545), var(--accent2-hex, #53a8b6))",
          boxShadow: "0 0 8px var(--accent-hex, #c44545)",
          transition: "width 1.2s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
        }}
      />
    </div>
  );
}
