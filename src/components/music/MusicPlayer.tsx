"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getDailySongs, getSongUrl, getQRKey, createQR, checkQR, setMusicCookie, getStoredCookie } from "@/api/music";
import { useMusicStore } from "@/stores/music";
import type { MusicListItem } from "@/types/music";

export function MusicPlayer() {
  const dailyMusicList = useMusicStore((s) => s.dailyMusicList);
  const currentMusic = useMusicStore((s) => s.currentMusic);
  const changeDailyMusicList = useMusicStore((s) => s.changeDailyMusicList);
  const changeCurrentMusic = useMusicStore((s) => s.changeCurrentMusic);
  const changeCurrentTimeStore = useMusicStore((s) => s.changeCurrentTime);
  const changeDurationStore = useMusicStore((s) => s.changeDuration);

  const [open, setOpen] = useState(false);
  const [showList, setShowList] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [urls, setUrls] = useState<Record<number, string>>({});
  const [isClient, setIsClient] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const animRef = useRef<number>(0);
  const listRef = useRef<HTMLDivElement>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrImg, setQrImg] = useState("");
  const [qrKey, setQrKey] = useState("");
  const [loggedIn, setLoggedIn] = useState(!!getStoredCookie());
  const fetchedRef = useRef(false);
  const tracksRef = useRef<MusicListItem[]>([]);
  const playIndexRef = useRef<(...args: any[]) => void>(() => {});

  // Derived
  const tracks = dailyMusicList;
  const currentIndex = tracks.findIndex((t) => t.id === currentMusic?.id);

  const track = useMemo(() => {
    if (!currentMusic?.id || currentMusic.initFlag) return null;
    return {
      id: currentMusic.id,
      title: currentMusic.name || "加载中...",
      artist: currentMusic.ar?.map((a) => a.name).join(", ") || "未知",
      url: urls[currentMusic.id] || "",
      cover: currentMusic.al?.picUrl || "",
    };
  }, [currentMusic, urls]);

  // Sync refs with latest values for use in event callbacks
  useEffect(() => { tracksRef.current = tracks; }, [tracks]);
  useEffect(() => { playIndexRef.current = playIndex; }, [playIndex]);

  // Initial load: fetch daily songs if store is empty
  useEffect(() => {
    setIsClient(true);
    if (tracks.length === 0 && !fetchedRef.current) {
      fetchedRef.current = true;
      getDailySongs().then((songs) => {
        if (songs.length > 0) {
          changeDailyMusicList(songs);
          // Auto-select first track if none selected
          const cur = useMusicStore.getState().currentMusic;
          if (!cur?.id || cur.initFlag) {
            changeCurrentMusic(songs[0]);
          }
        }
      });
    }
  }, []); // Run once on mount

  // Fetch URL for current track
  useEffect(() => {
    const id = currentMusic?.id;
    if (!id || currentMusic?.initFlag) return;
    if (!urls[id]) {
      getSongUrl(id).then((url) => {
        if (url) setUrls((prev) => ({ ...prev, [id]: url }));
      });
    }
  }, [currentMusic?.id]);

  const updateProgress = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setCurrentTime(a.currentTime);
    changeCurrentTimeStore(a.currentTime);
    if (a.ended) setPlaying(false);
    animRef.current = requestAnimationFrame(updateProgress);
  }, [changeCurrentTimeStore]);

  // Audio events when track URL changes
  useEffect(() => {
    if (!isClient) return;
    const a = audioRef.current;
    if (!a) return;

    const onLoaded = () => {
      const d = a.duration;
      setDuration(d);
      changeDurationStore(d);
      if (playing) a.play().catch(() => {});
    };
    const onEnded = () => {
      setPlaying(false);
      const tr = tracksRef.current;
      const idx = tr.findIndex((t) => t.id === currentMusic?.id);
      if (idx >= 0) {
        setTimeout(() => playIndexRef.current((idx + 1) % tr.length), 500);
      }
    };

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("ended", onEnded);

    if (track && track.url && (!a.src || !a.src.includes(track.url))) {
      a.src = track.url;
      a.load();
    }

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("ended", onEnded);
      cancelAnimationFrame(animRef.current);
    };
  }, [track?.id, track?.url]);

  const playIndex = useCallback(
    (idx: number) => {
      const t = tracks[idx];
      if (!t) return;
      changeCurrentMusic(t);
      setCurrentTime(0);
      setDuration(0);
      changeCurrentTimeStore(0);
      changeDurationStore(0);
      setPlaying(true);
      setShowList(false);
    },
    [tracks, changeCurrentMusic, changeCurrentTimeStore, changeDurationStore]
  );

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) {
      a.pause();
      cancelAnimationFrame(animRef.current);
      setPlaying(false);
    } else {
      a.play()
        .then(() => {
          setPlaying(true);
          animRef.current = requestAnimationFrame(updateProgress);
        })
        .catch(() => {});
    }
  }, [playing, updateProgress]);

  const next = useCallback(
    () => playIndex((currentIndex + 1) % tracks.length),
    [currentIndex, tracks.length, playIndex]
  );
  const prev = useCallback(
    () => playIndex((currentIndex - 1 + tracks.length) % tracks.length),
    [currentIndex, tracks.length, playIndex]
  );

  const seek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const a = audioRef.current;
      if (!a || !duration) return;
      const pct =
        (e.clientX - e.currentTarget.getBoundingClientRect().left) /
        e.currentTarget.clientWidth;
      a.currentTime = pct * duration;
      setCurrentTime(pct * duration);
      changeCurrentTimeStore(pct * duration);
    },
    [duration, changeCurrentTimeStore]
  );

  // QR Login
  const startQRLogin = useCallback(async () => {
    setShowQR(true);
    const key = await getQRKey();
    setQrKey(key);
    const qr = await createQR(key);
    setQrImg(qr);
  }, []);

  useEffect(() => {
    if (!qrKey || !showQR) return;
    const timer = setInterval(async () => {
      const { code, cookie } = await checkQR(qrKey);
      if (code === 803 && cookie) {
        setMusicCookie(cookie);
        setLoggedIn(true);
        setShowQR(false);
        clearInterval(timer);
      }
      if (code === 800) {
        clearInterval(timer);
        setShowQR(false);
      }
    }, 2000);
    return () => clearInterval(timer);
  }, [qrKey, showQR]);

  // Trap wheel in playlist
  useEffect(() => {
    const el = listRef.current;
    if (!el || !showList) return;
    const onWheel = (e: WheelEvent) => {
      const atTop = el.scrollTop === 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) return;
      e.preventDefault();
      e.stopPropagation();
      el.scrollTop += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [showList]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isClient) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setShowList(false);
      }
      if (e.key === " " && open) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isClient, open, togglePlay]);

  if (!isClient) return null;

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, "0")}`;
  };

  return (
    <>
      {track && <audio ref={audioRef} src={track.url || undefined} preload="metadata" />}

      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-6 left-6 z-91 w-12 h-12 rounded-full border border-border bg-bg-surface backdrop-blur-md cursor-pointer flex items-center justify-center text-xl max-md:left-3 max-md:bottom-3 max-md:w-10 max-md:h-10 max-md:text-base
          ${open ? "opacity-0 pointer-events-none" : "opacity-100"} hover:scale-110 hover:border-accent2`}
        title="音乐播放器"
      >
        🎵
      </button>

      <div
        className="fixed bottom-6 left-6 z-90 w-[400px] max-md:left-3 max-md:right-3 max-md:w-auto max-md:bottom-3"
        style={{
          transformOrigin: "bottom left",
          transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transform: open
            ? "scale(1) translateX(0) translateY(0)"
            : "scale(0) translateX(-100px) translateY(100px)",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl opacity-60"
          style={{ background: "linear-gradient(135deg, var(--bg-card), var(--bg-surface))" }}
        />
        <div className="relative border border-border rounded-2xl bg-bg-surface/80 backdrop-blur-2xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {showQR ? (
            <div className="p-6 relative z-1 text-center">
              <h4 className="text-sm font-bold mb-4">扫码登录</h4>
              {qrImg ? (
                <img src={qrImg} alt="QR Code" className="w-48 h-48 mx-auto mb-3 rounded-xl" />
              ) : (
                <div className="w-48 h-48 mx-auto mb-3 rounded-xl bg-bg-card flex items-center justify-center text-sm text-text-muted animate-pulse">加载中...</div>
              )}
              <p className="text-[.6rem] text-text-muted/60 mb-4">请使用网易云音乐 App 扫码</p>
              <button onClick={() => setShowQR(false)}
                className="text-xs text-text-muted/50 hover:text-accent transition-colors bg-transparent border-none cursor-pointer">取消</button>
            </div>
          ) : !showList ? (
            <div className="p-5 relative z-1">
              <div className="flex gap-3.5 items-center mb-4">
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-accent to-accent2 flex-shrink-0 overflow-hidden flex items-center justify-center text-2xl">
                  {track?.cover ? <img src={track.cover} alt={track.title} className="w-full h-full object-cover" /> : "🎵"}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold truncate">{track?.title || "加载中..."}</h4>
                  <span className="text-[.65rem] text-text-muted">{track?.artist || ""}</span>
                </div>
                <button onClick={() => setOpen(false)}
                  className="w-7 h-7 rounded-full border border-border bg-transparent cursor-pointer flex items-center justify-center text-[.7rem] text-text-muted hover:border-accent hover:text-accent flex-shrink-0">✕</button>
              </div>

              <div className="flex items-center justify-center gap-4 mb-4">
                <button onClick={prev} className="w-8 h-8 rounded-full bg-transparent cursor-pointer flex items-center justify-center text-sm text-text-muted hover:text-accent2">⏮</button>
                <button onClick={togglePlay}
                  className="w-11 h-11 rounded-full bg-accent text-white cursor-pointer flex items-center justify-center text-base transition-transform hover:scale-110">
                  {playing ? "⏸" : "▶"}</button>
                <button onClick={next} className="w-8 h-8 rounded-full bg-transparent cursor-pointer flex items-center justify-center text-sm text-text-muted hover:text-accent2">⏭</button>
              </div>

              <div className="flex items-center gap-2.5 mb-1">
                <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden cursor-pointer" onClick={seek}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--accent-hex), var(--accent2-hex))" }} />
                </div>
              </div>
              <div className="flex justify-between text-[.6rem] text-text-muted font-sans">
                <span>{fmt(currentTime)}</span>
                <span>{track?.url ? fmt(duration) : "—:—"}</span>
              </div>

              <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                <button onClick={startQRLogin}
                  className="text-[.55rem] font-sans text-text-muted/40 hover:text-accent transition-colors bg-transparent border-none cursor-pointer">
                  {loggedIn ? "✅ 已登录" : "🔑 登录"}
                </button>
                <button onClick={() => setShowList(true)}
                  className="text-xs text-text-muted/60 hover:text-accent2 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-1">
                  ☰ 列表 ({tracks.length})
                </button>
              </div>
            </div>
          ) : (
            <div className="relative z-1">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                <h4 className="text-sm font-bold">播放列表</h4>
                <button onClick={() => setShowList(false)}
                  className="text-xs text-text-muted/60 hover:text-accent2 transition-colors bg-transparent border-none cursor-pointer">收起</button>
              </div>
              <div ref={listRef} className="max-h-[320px] overflow-y-auto" style={{ overscrollBehavior: "contain" }}>
                {tracks.length > 0 ? (
                  tracks.map((t, i) => (
                    <button key={t.id} onClick={() => { if (i !== currentIndex) playIndex(i); else setShowList(false); }}
                      className={`w-full text-left px-5 py-3 flex items-center gap-3 transition-colors border-b border-border/30 last:border-0 cursor-pointer ${
                        i === currentIndex ? "bg-accent/10" : "hover:bg-bg-card"
                      }`}>
                      <span className={`w-6 text-xs font-sans flex-shrink-0 ${i === currentIndex ? "text-accent" : "text-text-muted/50"}`}>
                        {i === currentIndex ? (playing ? "▶" : "⏸") : `${i + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm truncate ${i === currentIndex ? "text-accent font-bold" : "text-text-body"}`}>{t.name || "未知"}</div>
                        <div className="text-[.6rem] text-text-muted truncate">{t.ar?.map((a) => a.name).join(", ") || ""}</div>
                      </div>
                      <span className="text-[.6rem] text-text-muted/50 flex-shrink-0">{urls[t.id!] ? "✓" : ""}</span>
                    </button>
                  ))
                ) : (
                  <div className="py-8 text-center text-text-muted/50 text-xs">暂无歌曲</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
