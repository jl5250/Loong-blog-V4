import type { Metadata } from "next";
import type { Character, Goal, Project } from "@/types/my";

const API = process.env.NEXT_PUBLIC_PROJECT_API || "http://localhost:9003/api";

async function getMyPageData() {
  try {
    const res = await fetch(`${API}/page_config/name/my`, { next: { revalidate: 120 } });
    const json = await res.json();
    return json?.data?.value ?? null;
  } catch { return null; }
}

export const metadata: Metadata = {
  title: "关于我",
  alternates: { canonical: "https://loongblog.fun/my" },
};

export default async function MyPage() {
  const data = await getMyPageData();
  if (!data) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-[60vh]">
        <p className="font-kai text-text-muted">暂无数据</p>
      </main>
    );
  }

  const { info_one, info_two, info_style, character, goals, project, technology_stack, hometown } = data;
  const info = info_style === "info_two" ? info_two : info_one;
  const avatarUrl = info?.avatar || info?.avatar_url || "";
  const name = info?.name || info?.author || "未命名";
  const bio = info?.profession || info?.know_me || "";

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="font-calligraphy text-6xl md:text-7xl text-text-muted/10 mb-4 block">我</span>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">{name}</h1>
          <p className="font-kai text-text-muted text-sm">{bio}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="border border-border rounded-2xl p-6 bg-bg-surface text-center sticky top-28">
              <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-border">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-accent/20 to-accent2/20 flex items-center justify-center">
                    <span className="font-calligraphy text-4xl text-accent/80">{name[0] || "?"}</span>
                  </div>
                )}
              </div>
              <h2 className="font-serif font-bold text-xl">{name}</h2>
              <p className="font-sans text-sm text-text-muted mt-1">{bio}</p>
              {info?.introduction && (
                <p className="font-kai text-xs text-text-muted mt-4 leading-relaxed">{info.introduction}</p>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-2 space-y-6">
            {/* Character / Personality */}
            {character?.length > 0 && (
              <div className="border border-border rounded-2xl p-8 bg-bg-surface">
                <h2 className="font-serif font-bold text-xl mb-6 flex items-center gap-3"><span className="w-1 h-6 bg-accent rounded-full" />性格 · Character</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {character.map((c: Character, i: number) => (
                    <div key={i} className="p-4 rounded-xl border border-border/60 hover:border-accent/40 transition-colors">
                      <div className="flex items-end gap-2 mb-2">
                        <span className="text-2xl font-bold font-serif" style={{ color: c.color || "var(--accent-hex)" }}>{c.value}</span>
                        <span className="text-sm font-sans text-text-muted">{c.text1}/{c.text2}</span>
                      </div>
                      <p className="font-kai text-xs text-text-muted leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technology Stack */}
            {technology_stack?.length > 0 && (
              <div className="border border-border rounded-2xl p-8 bg-bg-surface">
                <h2 className="font-serif font-bold text-xl mb-4 flex items-center gap-3"><span className="w-1 h-6 bg-accent2 rounded-full" />技术栈</h2>
                <div className="flex flex-wrap gap-2">
                  {technology_stack.map((s: string, i: number) => (
                    <span key={i} className="px-3 py-1.5 text-sm rounded-full border border-border text-text-muted font-sans hover:border-accent2 hover:text-accent2 transition-colors">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Goals */}
            {goals?.length > 0 && (
              <div className="border border-border rounded-2xl p-8 bg-bg-surface">
                <h2 className="font-serif font-bold text-xl mb-6 flex items-center gap-3"><span className="w-1 h-6 bg-gold rounded-full" />目标 · Goals</h2>
                <div className="space-y-3">
                  {goals.map((g: Goal, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-border/60">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-sans flex-shrink-0 ${g.status === 3 ? "bg-accent2/20 text-accent2" : "bg-border/30 text-text-muted"}`}>
                        {g.status === 3 ? "✓" : i + 1}
                      </div>
                      <span className="font-kai text-sm text-text-body">{g.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {project?.length > 0 && (
              <div className="border border-border rounded-2xl p-8 bg-bg-surface">
                <h2 className="font-serif font-bold text-xl mb-6 flex items-center gap-3"><span className="w-1 h-6 bg-accent rounded-full" />项目 · Projects</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {project.map((p: Project, i: number) => (
                    <div key={i} className="p-5 rounded-xl border border-border hover:border-accent/40 transition-all">
                      {p.images?.[0] && (
                        <div className="h-32 rounded-lg overflow-hidden mb-3 bg-bg-card">
                          <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <h3 className="font-serif font-bold text-base mb-1">{p.name}</h3>
                      {Array.isArray(p.description) ? p.description.map((d: string, j: number) => (
                        <p key={j} className="font-kai text-xs text-text-muted leading-relaxed">{d}</p>
                      )) : p.description ? (
                        <p className="font-kai text-xs text-text-muted leading-relaxed">{p.description}</p>
                      ) : null}
                      {p.front?.name && <span className="font-sans text-[.6rem] text-accent2 mt-2 inline-block">{p.front.name}: {p.front.technology}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
