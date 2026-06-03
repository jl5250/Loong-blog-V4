/**
 * Music API — external Netease Cloud Music API proxy (port 4000)
 * Supports QR login and anonymous access
 */

const BASE = typeof window !== "undefined"
  ? "/api/music"
  : (process.env.NEXT_PUBLIC_MUSIC_API || "http://localhost:4000");

export interface MusicTrack {
  id: number;
  name: string;
  ar: { id: number; name: string }[];
  al: { id: number; name: string; picUrl: string };
  dt: number;
}

let _cookie = "";

/** Store cookie (called from client after QR login) */
export function setMusicCookie(cookie: string) {
  _cookie = cookie;
  if (typeof window !== "undefined") {
    try { localStorage.setItem("music_cookie", cookie); } catch {}
  }
}

/** Load persisted cookie on init */
export function getStoredCookie(): string {
  if (typeof window === "undefined") return "";
  try { return localStorage.getItem("music_cookie") || ""; } catch { return ""; }
}

async function api(path: string): Promise<any> {
  const cookie = _cookie || getStoredCookie();
  const headers: Record<string, string> = {};
  if (cookie) headers["Cookie"] = cookie;
  const r = await fetch(`${BASE}${path}`, { headers });
  // Persist cookie from response
  const setCookie = r.headers.get("set-cookie");
  if (setCookie && !_cookie) {
    _cookie = setCookie;
    try { localStorage.setItem("music_cookie", setCookie); } catch {}
  }
  return r.json();
}

/** Get QR login key */
export async function getQRKey(): Promise<string> {
  const j = await api(`/login/qr/key?timestamp=${Date.now()}`);
  return j?.data?.unikey || "";
}

/** Create QR code image URL */
export async function createQR(key: string): Promise<string> {
  const j = await api(`/login/qr/create?key=${key}&qrimg=true&timestamp=${Date.now()}`);
  return j?.data?.qrimg || "";
}

/** Check QR login status. Returns { code, cookie? } */
export async function checkQR(key: string): Promise<{ code: number; cookie?: string }> {
  const j = await api(`/login/qr/check?key=${key}&timestamp=${Date.now()}`);
  return { code: j?.code || 800, cookie: j?.cookie };
}

/** Daily recommended songs */
export async function getDailySongs(): Promise<MusicTrack[]> {
  try { const j = await api("/recommend/songs"); return j?.data?.dailySongs ?? []; } catch { return []; }
}

/** Song playback URL */
export async function getSongUrl(id: number): Promise<string> {
  try { const j = await api(`/song/url?id=${id}`); return j?.data?.[0]?.url ?? ""; } catch { return ""; }
}
