"use client";

import gsap from "gsap";
import { useRef, useState, useEffect } from "react";

const SONGS = [
  { name: "丑八怪", icon: "🎭", album: "意外" },
  { name: "演员", icon: "🎬", album: "绅士" },
  { name: "绅士", icon: "🎩", album: "绅士" },
  { name: "你还要我怎样", icon: "💔", album: "意外" },
  { name: "刚刚好", icon: "⚖️", album: "初学者" },
  { name: "动物世界", icon: "🦁", album: "动物世界" },
  { name: "天外来物", icon: "🛸", album: "天外来物" },
  { name: "无数", icon: "♾️", album: "无数" },
  { name: "陪你去流浪", icon: "🌙", album: "尘" },
  { name: "像风一样", icon: "🍃", album: "怪咖" },
  { name: "病态", icon: "🖤", album: "尘" },
  { name: "这么久没见", icon: "⏳", album: "无数" },
];

const LYRIC_DATA = [
  "你还要我怎样 要怎样",
  "我后来都会选择绕过那条街",
  "其实台下的观众就我一个",
  "我能送你回家吗 可能外面要下雨了",
  "我害怕你的消息 不经意被谁提起",
  "像风一样 你靠近云都下降",
  "我好像在哪儿见过你",
  "我宁愿 留在你方圆几里",
  "我们的爱情 到这刚刚好",
  "所以 你好 再见",
];

const PHOTO_SLOTS = [
  { icon: "🎤", label: "开场沸腾" },
  { icon: "🦁", label: "兽王降临" },
  { icon: "🌟", label: "万人合唱" },
  { icon: "💫", label: "感动瞬间" },
  { icon: "🎵", label: "安可曲" },
  { icon: "👑", label: "下次再见" },
];

const TIMELINE_DATA = [
  { year: "2020", title: "《天外来物》专辑发行", desc: "以科幻为主题，探讨在快节奏生活中保留内心的纯净善良。" },
  { year: "2023", title: "三巡 · 天外来物全面升级", desc: "实景搭建巨型宇宙飞船、欲望之塔。以「唱」+「演」结合推动剧情。" },
  { year: "2024", title: "「万兽之王」概念诞生", desc: "延续星际执行官0717身份设定，以「兽性觉醒」对抗机械文明。" },
  { year: "2026", title: "四巡 · 万兽之王震撼登场", desc: "93米宽巨型四面台，5600㎡环形冰屏，1080组灯光。三幕叙事。" },
];

// Scroll Policy: This page is a Level 2 narrative page.
// It uses container-scoped wheel handling, NOT global wheel capture.
// All listeners/timers/tweens must be torn down on route exit.
const XUE_SCROLL_POLICY = {
  level: "level-2",
  narrative: true,
  allowGlobalWheelCapture: false,
  allowLenisLifecycleControl: false,
} as const;

export default function XuePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const [photos, setPhotos] = useState<(string | null)[]>(Array(6).fill(null));
  const fileRef = useRef<HTMLInputElement>(null);
  const photoIdxRef = useRef(0);
  const panelIdxRef = useRef(0);
  const ticking = useRef(false);

  // Level 2 narrative: container-scoped wheel navigation (NOT global capture)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const panels = container.querySelectorAll<HTMLElement>(".snap-section");
    if (panels.length < 2) return;

    const onWheel = (e: WheelEvent) => {
      if (ticking.current) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(panelIdxRef.current + dir, panels.length - 1));
      if (next === panelIdxRef.current) return;

      e.preventDefault();
      panelIdxRef.current = next;
      ticking.current = true;

      gsap.to(container, {
        scrollTop: panels[next].offsetTop,
        duration: 0.6,
        ease: "power3.inOut",
        onComplete: () => { ticking.current = false; },
      });
    };

    container.addEventListener("wheel", onWheel, { passive: false });

    // Cleanup: remove listener + kill any in-progress tween
    return () => {
      container.removeEventListener("wheel", onWheel);
      ticking.current = false;
      gsap.killTweensOf(container);
    };
  }, []);

  // 3D portrait mouse follow + sparkles — with full teardown on route exit
  useEffect(() => {
    const portrait = portraitRef.current?.querySelector(".portrait-img") as HTMLElement;
    const glow = portraitRef.current?.querySelector(".portrait-glow") as HTMLElement;
    const sparkles: HTMLDivElement[] = [];

    if (portrait) {
      gsap.to(portrait, { y: -8, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" });
      const onMove = (e: MouseEvent) => {
        const rect = portraitRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        gsap.to(portrait, { rotationY: (x - 0.5) * 14, rotationX: (0.5 - y) * 10, duration: 0.5, ease: "power2.out", overwrite: "auto" });
        if (glow) gsap.to(glow, { opacity: 0.5, x: (x - 0.5) * 25, y: (0.5 - y) * 25, duration: 0.6, ease: "power2.out" });
      };
      const onLeave = () => {
        gsap.to(portrait, { rotationY: 0, rotationX: 0, duration: 0.6, ease: "power3.out" });
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.5 });
      };
      const el = portraitRef.current;
      el?.addEventListener("mousemove", onMove);
      el?.addEventListener("mouseleave", onLeave);

      // sparkles
      for (let i = 0; i < 20; i++) {
        const s = document.createElement("div");
        s.style.cssText = `position:absolute;width:2px;height:2px;background:#b8860b;border-radius:50%;opacity:0;left:${Math.random() * 100}%;top:${Math.random() * 100}%;pointer-events:none;z-index:2`;
        portrait.appendChild(s);
        sparkles.push(s);
        gsap.to(s, { opacity: Math.random() * 0.5 + 0.2, scale: Math.random() * 2 + 0.5, duration: 2 + Math.random() * 4, repeat: -1, yoyo: true, delay: Math.random() * 6, ease: "sine.inOut" });
      }

      // Cleanup: remove listeners, kill tweens, remove sparkle DOM nodes
      return () => {
        el?.removeEventListener("mousemove", onMove);
        el?.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf(portrait);
        if (glow) gsap.killTweensOf(glow);
        sparkles.forEach((s) => {
          gsap.killTweensOf(s);
          s.remove();
        });
      };
    }
  }, []);

  const addPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setPhotos((prev) => {
        const next = [...prev];
        const idx = photoIdxRef.current;
        if (idx < next.length) next[idx] = url;
        photoIdxRef.current = Math.min(idx + 1, next.length - 1);
        return next;
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handlePhotoClick = (i: number) => {
    if (!photos[i]) { photoIdxRef.current = i; fileRef.current?.click(); }
  };

  return (
    <>
    <style>{`.snap-section { min-height: 100vh; } .snap-section:first-child { padding-top: 64px; } .snap-section:last-child { padding-bottom: 80px; }`}</style>
    <div ref={containerRef} style={{ position: "fixed", inset: 0, zIndex: 1, overflow: "hidden", background: "#faf6f0", color: "#2c1810" }}>
      {/* ═══ Hero ═══ */}
      <section className="snap-section relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #faf6f0, #f0e6d3 30%, #e8dcc8 60%, #d4c5a9)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 20% 30%, rgba(184,134,11,0.06), transparent 50%), radial-gradient(circle at 80% 70%, rgba(139,26,26,0.04), transparent 50%)" }} />
        <div className="absolute w-[80vmin] h-[80vmin] border-2 border-[rgba(184,134,11,0.08)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute w-[55vmin] h-[55vmin] border border-[rgba(184,134,11,0.12)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 text-4xl opacity-[0.08] tracking-[2rem] pointer-events-none select-none">👑 👑 👑</div>

        <div ref={portraitRef}
          className="absolute right-[3%] top-1/2 -translate-y-1/2 z-[2]"
          style={{ width: "clamp(180px, 28vw, 400px)", height: "clamp(230px, 36vw, 500px)", perspective: "1200px" }}>
          <div className="absolute inset-[-6px] border border-[rgba(184,134,11,0.15)] rounded-[22px] pointer-events-none" />
          <div className="portrait-img relative w-full h-full rounded-[18px] overflow-hidden" style={{ transformStyle: "preserve-3d", boxShadow: "0 20px 60px rgba(184,134,11,0.2), 0 0 0 1px rgba(184,134,11,0.1)" }}>
            <img src="https://img.alicdn.com/imgextra/i1/2251059038/O1CN01nJMJJl2GdSlWbl8La_!!2251059038.jpg_q60.jpg_.webp" alt="薛之谦" className="w-full h-full object-cover" style={{ objectPosition: "center 25%" }} />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(245,240,232,0.3), transparent 40%)" }} />
            <div className="portrait-glow absolute top-[-30%] left-[-30%] w-[160%] h-[160%] opacity-0 pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(184,134,11,0.15), transparent 50%)" }} />
          </div>
        </div>

        <div className="relative z-[3] max-w-[640px] px-4 sm:px-8 max-md:text-center max-md:mx-auto max-md:pt-20">
          <div className="flex items-center gap-3 mb-4 max-md:justify-center">
            <div className="w-10 h-0.5 bg-[#b8860b]" />
            <span className="text-[0.7rem] tracking-[0.3em] text-[#5c4033] font-medium">✦ 2026 四巡 · 万兽之王</span>
          </div>
          <h1 className="font-serif text-[clamp(2.5rem,8vw,6rem)] font-black leading-tight mb-4">
            <span className="text-[#b8860b]" style={{ textShadow: "2px 2px 0 rgba(184,134,11,0.1)" }}>薛之谦</span>
          </h1>
          <p className="text-[clamp(0.8rem,1.2vw,1rem)] text-[#6b4c3b] leading-8 tracking-[0.08em] max-w-[450px] max-md:mx-auto">
            以音乐为剑，以舞台为王。<br />万兽之王 · 承蒙关照
          </p>
          <div className="flex gap-3 mt-5 max-md:justify-center max-md:flex-wrap">
            {["01 深渊 · 觉醒", "02 兽笼 · 挣脱", "03 王冠 · 加冕"].map((a) => (
              <span key={a} className="px-4 py-1.5 border border-[rgba(184,134,11,0.2)] rounded-full text-[0.7rem] tracking-[0.1em] text-[#5c4033] bg-[rgba(184,134,11,0.04)]">{a}</span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[3] flex flex-col items-center gap-2">
          <span className="text-[0.55rem] tracking-[0.3em] text-[#6b4c3b]">向下滚动</span>
          <div className="w-px h-9" style={{ background: "linear-gradient(to bottom, #b8860b, transparent)" }} />
        </div>
      </section>

      {/* ═══ Photos ═══ */}
      <section className="snap-section px-4 sm:px-6 py-16 md:py-20" style={{ background: "#faf6f0" }}>
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-center font-serif text-[clamp(1.3rem,3vw,2.2rem)] font-bold mb-2">📸 我的万兽之王记忆</h2>
          <p className="text-center text-[0.8rem] text-[#6b4c3b] mb-6 tracking-[0.1em]">点击空白处上传你的演唱会现场照片</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {PHOTO_SLOTS.map((s, i) => (
              <div key={i} onClick={() => handlePhotoClick(i)}
                className="aspect-square max-h-[260px] rounded-xl overflow-hidden relative cursor-pointer bg-white border border-[#e8dcc8] flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:border-[rgba(184,134,11,0.3)] hover:shadow-[0_8px_30px_rgba(184,134,11,0.08)]">
                {photos[i] ? (
                  <>
                    <img src={photos[i]} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute bottom-2 left-2 text-[0.5rem] px-2 py-0.5 rounded-full bg-white/80 text-[#2c1810]">{s.label}</div>
                  </>
                ) : (
                  <>
                    <span className="text-2xl opacity-[0.15]">{s.icon}</span>
                    <span className="text-[0.65rem] text-[#6b4c3b] opacity-[0.3]">{s.label}</span>
                  </>
                )}
              </div>
            ))}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={addPhoto} />
        </div>
      </section>

      {/* ═══ Three Acts ═══ */}
      <section className="snap-section px-4 sm:px-6 py-16 md:py-20" style={{ background: "#f5f0e8" }}>
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-serif text-[clamp(1.4rem,3vw,2.3rem)] font-bold">三幕 · 王者叙事</h2>
            <p className="text-[0.8rem] text-[#6b4c3b] mt-1 tracking-[0.15em]">从深渊到王冠，一场关于觉醒与加冕的音乐史诗</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-10 h-px bg-[#b8860b]" /><div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" /><div className="w-10 h-px bg-[#b8860b]" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ icon: "⛓️", num: "第一幕 · 深渊", title: "困于兽笼，静待觉醒", desc: "暗黑锁链白发造型，巨型机械兽笼中挣扎。欲望与困兽的交织。" },
              { icon: "🦁", num: "第二幕 · 兽笼", title: "挣脱束缚，野性释放", desc: "残破黑金礼服+Joker半面面具，狮首升降台从舞台中央升起。" },
              { icon: "👑", num: "第三幕 · 王冠", title: "终成王者，加冕重生", desc: "银色0717星际铠甲，全息投影王冠降临。天外来物感动收尾。" },
            ].map((act, i) => (
              <div key={i} className="p-6 sm:p-7 rounded-[18px] text-center bg-white border border-[#e8dcc8] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(184,134,11,0.08)] hover:border-[rgba(184,134,11,0.2)]">
                <div className="text-3xl mb-3">{act.icon}</div>
                <div className="inline-block px-3 py-0.5 rounded-full text-[0.65rem] font-semibold tracking-[0.1em] mb-3"
                  style={{ background: i === 0 ? "rgba(139,26,26,0.08)" : i === 1 ? "rgba(184,134,11,0.1)" : "rgba(92,64,51,0.08)", color: i === 0 ? "#8b1a1a" : i === 1 ? "#b8860b" : "#5c4033" }}>
                  {act.num}
                </div>
                <h3 className="font-serif text-[1.05rem] font-bold mb-2">{act.title}</h3>
                <p className="text-[0.85rem] text-[#6b4c3b] leading-relaxed">{act.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Stats + Timeline ═══ */}
      <section className="snap-section px-4 sm:px-6 py-16 md:py-20" style={{ background: "#faf6f0" }}>
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-[clamp(1.4rem,3vw,2.3rem)] font-bold">巡演规模</h2>
            <p className="text-[0.8rem] text-[#6b4c3b] mt-1 tracking-[0.15em]">史无前例的沉浸式音乐盛宴</p>
            <div className="flex items-center justify-center gap-3 mt-4">
              <div className="w-10 h-px bg-[#b8860b]" /><div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" /><div className="w-10 h-px bg-[#b8860b]" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {[{ num: "5000", label: "㎡ 巨型四面台" }, { num: "5600", label: "㎡ 环形 LED 冰屏" }, { num: "1080", label: "组智能动态灯光" }, { num: "93", label: "米宽 × 36米高舞台" }].map((s, i) => (
              <div key={i} className="p-4 sm:p-5 text-center bg-white border border-[#e8dcc8] rounded-xl">
                <div className="font-serif text-[1.5rem] sm:text-[1.8rem] font-black text-[#b8860b]"><span className="stat-num" data-target={s.num}>{s.num}</span></div>
                <div className="text-[0.7rem] text-[#6b4c3b] mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="max-w-[600px] mx-auto">
            <h3 className="font-serif text-[clamp(1.1rem,2vw,1.6rem)] font-bold text-center mb-6">进化之路</h3>
            {TIMELINE_DATA.map((item, i) => (
              <div key={i} className="flex items-start gap-4 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#b8860b] border-[3px] border-[#faf6f0] shrink-0" style={{ boxShadow: "0 0 0 3px rgba(184,134,11,0.15)" }} />
                  {i < TIMELINE_DATA.length - 1 && <div className="w-px flex-1 bg-[#e8dcc8]" />}
                </div>
                <div className="pb-5">
                  <span className="text-[0.65rem] text-[#b8860b] font-semibold tracking-[0.1em]">{item.year}</span>
                  <h4 className="font-serif font-bold text-[0.95rem] mt-0.5">{item.title}</h4>
                  <p className="text-[0.8rem] text-[#6b4c3b] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Songs + Lyrics ═══ */}
      <section className="snap-section px-4 sm:px-6 py-16 md:py-20" style={{ background: "#f5f0e8" }}>
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-serif text-[clamp(1.3rem,3vw,2rem)] font-bold">经典曲目</h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="w-10 h-px bg-[#b8860b]" /><div className="w-1.5 h-1.5 bg-[#b8860b] rotate-45" /><div className="w-10 h-px bg-[#b8860b]" />
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-10">
            {SONGS.map((s, i) => (
              <div key={i} className="p-3 text-center border border-[rgba(184,134,11,0.08)] rounded-xl bg-white/50 hover:border-[rgba(184,134,11,0.2)] hover:bg-white transition-all duration-300 cursor-default">
                <div className="text-xl mb-1">{s.icon}</div>
                <h4 className="text-[0.8rem] font-bold truncate">{s.name}</h4>
                <p className="text-[0.6rem] text-[#6b4c3b] truncate">《{s.album}》</p>
              </div>
            ))}
          </div>

          <div className="lyrics-section text-center max-w-[600px] mx-auto">
            <h3 className="font-serif text-[clamp(1rem,2vw,1.5rem)] font-bold mb-6">那些刻在心底的歌词</h3>
            {LYRIC_DATA.map((l, i) => (
              <div key={i} className="lyric-line font-serif text-[clamp(0.85rem,2vw,1.2rem)] leading-[2.4] py-0.5 transition-all duration-300" style={{ color: "#6b4c3b", opacity: 0.06 }}>
                「{l}」
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ End Screen ═══ */}
      <footer className="snap-section flex flex-col items-center justify-center px-6 bg-white relative overflow-hidden"
        style={{ minHeight: "100vh" }}>
        {/* Decorative rings */}
        <div className="absolute w-[50vmin] h-[50vmin] border border-[rgba(184,134,11,0.06)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute w-[35vmin] h-[35vmin] border border-[rgba(184,134,11,0.04)] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

        <div className="relative z-[1] text-center max-w-lg mx-auto">
          {/* Crown */}
          <div className="text-5xl mb-6 opacity-20">👑</div>

          {/* Title */}
          <h2 className="font-serif text-[clamp(1.5rem,3vw,2.2rem)] font-bold text-[#2c1810] mb-3">
            感谢聆听
          </h2>
          <p className="font-serif text-[clamp(0.9rem,1.5vw,1.1rem)] text-[#6b4c3b] leading-8 tracking-[0.08em] mb-6">
            「万兽之王」巡演仍在继续<br />
            感谢薛之谦带来如此震撼的音乐盛宴
          </p>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-px bg-[#e8dcc8]" />
            <div className="w-2 h-2 rounded-full bg-[#b8860b]/30" />
            <div className="w-12 h-px bg-[#e8dcc8]" />
          </div>

          {/* Stats mini */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { num: "50+", label: "城市" },
              { num: "100+", label: "场次" },
              { num: "500万+", label: "观众" },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-[clamp(1rem,2vw,1.4rem)] font-black text-[#b8860b]">{s.num}</div>
                <div className="text-[0.6rem] text-[#6b4c3b] mt-0.5 tracking-[0.1em]">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-[0.75rem] text-[#6b4c3b] leading-7 tracking-[0.15em] mb-4">
            承蒙关照 · 最好的薛之谦
          </p>

          {/* Heart */}
          <p className="text-[0.8rem] text-[#6b4c3b] tracking-[0.1em]">
            Made with <span className="text-[#c0392b] inline-block animate-pulse">♥</span> by 谦友
          </p>

          {/* Decoration */}
          <div className="mt-6 text-[0.5rem] tracking-[0.3em] text-[#b8860b]/30">
            ✦ 世间万物 不及你一曲 ✦
          </div>
        </div>
      </footer>
    </div>
    </>);
}
