import type { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/format";

const API = process.env.NEXT_PUBLIC_PROJECT_API || "http://localhost:9003/api";

async function getResumeData() {
  try {
    const res = await fetch(`${API}/page_config/name/resume`, { next: { revalidate: 60 } });
    const json = await res.json();
    return json?.data?.value ?? null;
  } catch {
    return null;
  }
}

export const metadata: Metadata = { title: "简历" };

export default async function ResumePage() {
  const data = await getResumeData();
  if (!data) {
    return <main className="flex-1 flex items-center justify-center min-h-[60vh]"><p className="font-kai text-text-muted">暂无简历数据</p></main>;
  }

  const { personalInfo, skills, workExperience, projects, education, advantages, links } = data;

  return (
    <main className="flex-1 pt-24 sm:pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">简历</h1>
          <p className="font-kai text-text-muted text-sm">Resume</p>
        </div>

        {/* Personal Info */}
        {personalInfo && (
          <div className="border border-border rounded-2xl p-8 bg-bg-surface mb-8 text-center">
            {personalInfo.avatar && (
              <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden border-2 border-border">
                <img src={personalInfo.avatar} alt="个人头像" className="w-full h-full object-cover" />
              </div>
            )}
            <h2 className="font-serif font-bold text-2xl">{personalInfo.name}</h2>
            <p className="font-kai text-text-muted text-sm mt-1">{personalInfo.title}</p>
            <div className="flex justify-center gap-4 mt-4 text-xs font-sans text-text-muted flex-wrap">
              {personalInfo.location && <span>📍 {personalInfo.location}</span>}
              {personalInfo.contact?.email && <span>📧 {personalInfo.contact.email}</span>}
              {personalInfo.contact?.phone && <span>📞 {personalInfo.contact.phone}</span>}
            </div>
            {links && (
              <div className="flex justify-center gap-3 mt-4">
                {links.github && <Link href={links.github} className="text-xs font-sans text-accent2 hover:underline">GitHub</Link>}
                {links.csdn && <Link href={links.csdn} className="text-xs font-sans text-accent2 hover:underline">CSDN</Link>}
                {links.project && <Link href={links.project} className="text-xs font-sans text-accent2 hover:underline">Project</Link>}
              </div>
            )}
          </div>
        )}

        {/* Advantages */}
        {advantages?.length > 0 && (
          <div className="border border-border rounded-2xl p-8 bg-bg-surface mb-8">
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-3"><span className="w-1 h-5 bg-accent rounded" />优势</h3>
            <div className="flex flex-wrap gap-2">
              {advantages.map((a: string, i: number) => (
                <span key={i} className="px-3 py-1.5 text-xs rounded-full border border-accent/30 text-accent/80 font-sans">{a}</span>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div className="border border-border rounded-2xl p-8 bg-bg-surface mb-8">
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-3"><span className="w-1 h-5 bg-accent2 rounded" />技能</h3>
            <ul className="space-y-3">
              {skills.map((s: string, i: number) => (
                <li key={i} className="text-sm text-text-muted leading-relaxed flex gap-3">
                  <span className="text-accent2 mt-1 flex-shrink-0">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Work Experience */}
        {workExperience?.length > 0 && (
          <div className="border border-border rounded-2xl p-8 bg-bg-surface mb-8">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-3"><span className="w-1 h-5 bg-gold rounded" />工作经历</h3>
            <div className="space-y-6">
              {workExperience.map((exp: { company: string; position: string; period: string; responsibilities?: string[] }, i: number) => (
                <div key={i} className="pl-4 border-l-2 border-border">
                  <h4 className="font-serif font-bold text-base">{exp.company}</h4>
                  <p className="font-sans text-xs text-text-muted mb-2">{exp.position} · {exp.period}</p>
                  {exp.responsibilities?.map((r: string, j: number) => (
                    <p key={j} className="text-sm text-text-muted leading-relaxed mb-1">{r}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div className="border border-border rounded-2xl p-8 bg-bg-surface mb-8">
            <h3 className="font-serif font-bold text-lg mb-6 flex items-center gap-3"><span className="w-1 h-5 bg-accent rounded" />项目</h3>
            <div className="space-y-6">
              {projects.map((proj: { name: string; role?: string; period?: string; description?: string | string[]; techStack?: string[] }, i: number) => (
                <div key={i} className="p-5 rounded-xl border border-border hover:border-accent/40 transition-colors">
                  <h4 className="font-serif font-bold text-base mb-1">{proj.name}</h4>
                  {proj.role && <p className="font-sans text-xs text-accent2 mb-2">{proj.role} · {proj.period}</p>}
                  {Array.isArray(proj.description) ? proj.description.map((d: string, j: number) => (
                    <p key={j} className="text-sm text-text-muted leading-relaxed mb-1">{d}</p>
                  )) : proj.description ? (
                    <p className="text-sm text-text-muted leading-relaxed mb-1">{proj.description}</p>
                  ) : null}
                  {proj.techStack && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {typeof proj.techStack === 'string'
                        ? <span className="text-xs px-2 py-0.5 rounded bg-bg-card border border-border font-sans text-text-muted">{proj.techStack}</span>
                        : Object.entries(proj.techStack).map(([k, v]) => (
                            <span key={k} className="text-xs px-2 py-0.5 rounded bg-bg-card border border-border font-sans text-text-muted">{v as string}</span>
                          ))
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && (
          <div className="border border-border rounded-2xl p-8 bg-bg-surface mb-8">
            <h3 className="font-serif font-bold text-lg mb-4 flex items-center gap-3"><span className="w-1 h-5 bg-accent2 rounded" />教育</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-bg-surface-raised flex items-center justify-center font-serif font-bold text-lg text-accent2">学</div>
              <div>
                <h4 className="font-serif font-bold text-base">{education.school}</h4>
                <p className="font-sans text-xs text-text-muted">{education.major} · {education.degree} · {education.period}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
