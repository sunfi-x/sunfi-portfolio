"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Quicksand } from "next/font/google";
import type { Profile, Project } from "@/sanity/lib/types";

const quicksand = Quicksand({ subsets: ["latin"] });

interface ResumeClientProps {
  profile: Profile | null;
  projects: Project[];
}

export function ResumeClient({ profile, projects }: ResumeClientProps) {
  const [copied, setCopied] = useState(false);

  const name = profile?.name ?? "Khondoker Sazzad Sunfi";
  const tagline = profile?.tagline ?? "Data Science | Machine Learning | AI";
  const email = profile?.email ?? "sunfisazzad@gmail.com";
  const location = profile?.location ?? "Dhaka, Bangladesh";
  const bio =
    profile?.bio ??
    "Data Scientist and AI Engineer with a strong background in developing scalable machine learning models and intelligent systems.";
  const experience = profile?.experience ?? [];
  const education = profile?.education ?? [];
  const skills = profile?.skills ?? [];
  const resumeUrl = profile?.resumeUrl ?? "/cv.pdf";
  const socialLinks = profile?.socialLinks ?? [];
  const featuredProjects = projects.slice(0, 3);

  const handleCopyMarkdown = () => {
    const text = `# ${name}\n${tagline}\n\n## Contact\n${email} | ${location}\n\n## Summary\n${bio}\n\n## Experience\n${experience.map(e => `### ${e.role} @ ${e.company}\n${e.period}\n${e.responsibilities?.join('\n')}`).join('\n\n')}\n\n## Education\n${education.map(e => `### ${e.degree}\n${e.institution} | ${e.period}`).join('\n\n')}\n\n## Skills\n${skills.map(s => `**${s.category}:** ${s.items.join(', ')}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={quicksand.className} style={{ background: '#0a0a0a', minHeight: '100vh', color: '#ffffff' }}>
      {/* ─── Top Bar ───────────────────────────────────────────────────────────── */}
      <div 
        className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 border-b border-[#1a1a1a] bg-[#0a0a0a] sticky top-0 z-50 gap-4 md:gap-0"
      >
        <div style={{ color: '#555', fontSize: '12px', letterSpacing: '0.1em', fontWeight: 500 }}>
          <Link href="/" className="hover:text-white transition-colors">HOME</Link> / <span className="text-gray-300">RESUME</span>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button
            onClick={handleCopyMarkdown}
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#ffffff',
              fontSize: '12px',
              letterSpacing: '0.1em',
              padding: '10px 20px',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            className="uppercase hover:bg-white hover:text-black"
          >
            {copied ? "COPIED ✔" : "COPY MARKDOWN"}
          </button>
          
          <a
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: 'transparent',
              border: '1px solid #333',
              color: '#ffffff',
              fontSize: '12px',
              letterSpacing: '0.1em',
              padding: '10px 20px',
              textAlign: 'center',
              display: 'block',
              transition: 'all 0.3s ease',
              width: '100%'
            }}
            className="uppercase hover:bg-white hover:text-black"
          >
            DOWNLOAD PDF
          </a>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* ─── Left Panel (Sticky) ────────────────────────────────────────────────── */}
        <div 
          className="w-full md:w-[300px] md:min-w-[300px] md:sticky md:top-[85px] md:h-[calc(100vh-85px)] overflow-y-auto scrollbar-none"
          style={{
            background: '#0a0a0a',
            borderRight: '1px solid #1a1a1a',
            padding: '40px 24px',
          }}
        >
          {/* Photo */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-[140px] h-[140px] mb-6 overflow-hidden rounded-lg">
              <Image 
                src="/sazzadsunfi.jpg" 
                alt={name}
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
              {name}
            </h2>
            <p style={{ fontSize: '12px', color: '#888888', fontStyle: 'italic' }}>
              {tagline}
            </p>
          </div>

          <div className="space-y-10">
            {/* Contact */}
            <section>
              <h3 style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#ffffff', marginBottom: '16px' }} className="uppercase font-bold">
                CONTACT
              </h3>
              <div style={{ color: '#777777', fontSize: '13px' }} className="space-y-3">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase">Email</span>
                  <a href={`mailto:${email}`} className="hover:text-white transition-colors">{email}</a>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-500 uppercase">Location</span>
                  <span>{location}</span>
                </div>
                {socialLinks.map(s => (
                  <div key={s._key} className="flex flex-col gap-1">
                    <span className="text-[10px] text-gray-500 uppercase">{s.platform}</span>
                    <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                      {s.url.replace(/^https?:\/\/(www\.)?/, '')}
                    </a>
                  </div>
                ))}
              </div>
            </section>

            <div style={{ borderTop: '1px solid #1a1a1a' }} />

            {/* Education */}
            {education.length > 0 && (
              <section>
                <h3 style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#ffffff', marginBottom: '16px' }} className="uppercase font-bold">
                  EDUCATION
                </h3>
                <div className="space-y-6">
                  {education.map((edu) => (
                    <div key={edu._key}>
                      <h4 style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>
                        {edu.degree}
                      </h4>
                      <p style={{ color: '#777777', fontSize: '13px', marginBottom: '2px' }}>{edu.institution}</p>
                      <p style={{ color: '#555', fontSize: '11px' }}>{edu.period}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div style={{ borderTop: '1px solid #1a1a1a' }} />

            {/* Language (Mock or from data if available) */}
            <section>
              <h3 style={{ fontSize: '10px', letterSpacing: '0.2em', color: '#ffffff', marginBottom: '16px' }} className="uppercase font-bold">
                LANGUAGE
              </h3>
              <div style={{ color: '#777777', fontSize: '13px' }} className="space-y-2">
                <div className="flex justify-between">
                  <span>English</span>
                  <span className="text-gray-500">Fluent</span>
                </div>
                <div className="flex justify-between">
                  <span>Bengali</span>
                  <span className="text-gray-500">Native</span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ─── Right Panel (Scrollable) ────────────────────────────────────────── */}
        <div 
          className="flex-1 md:h-[calc(100vh-85px)] md:overflow-y-auto scrollbar-none"
          style={{
            background: '#111111',
            padding: '48px 56px',
          }}
        >
          {/* Header */}
          <div className="text-center mb-16">
            <h1 style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }} className="uppercase tracking-tight">
              {name}
            </h1>
            <p style={{ fontSize: '16px', color: '#888888', marginBottom: '16px' }}>
              {tagline}
            </p>
            <div style={{ color: '#666666', fontSize: '13px' }} className="flex justify-center gap-4 flex-wrap">
              <span>{email}</span>
              <span>|</span>
              <span>{location}</span>
              {socialLinks.map(s => (
                <React.Fragment key={s._key}>
                  <span>|</span>
                  <a href={s.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{s.platform}</a>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="space-y-16 max-w-3xl mx-auto">
            {/* Professional Summary */}
            <section>
              <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '20px' }} className="uppercase font-bold">
                PROFESSIONAL SUMMARY
              </h3>
              <p style={{ color: '#888888', fontSize: '14px', lineHeight: 1.8 }}>
                {bio}
              </p>
            </section>

            {/* Experience */}
            {experience.length > 0 && (
              <section>
                <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px' }} className="uppercase font-bold">
                  EXPERIENCE
                </h3>
                <div className="space-y-10">
                  {experience.map((exp) => (
                    <div key={exp._key} className="relative pl-8">
                      {/* Timeline Dot */}
                      <div 
                        className="absolute left-0 top-1.5 w-2 h-2 rounded-full" 
                        style={{ background: '#ffffff', border: '2px solid #111', zIndex: 1 }}
                      />
                      {/* Timeline Line */}
                      <div 
                        className="absolute left-[3.5px] top-3 bottom-[-40px] w-[1px]" 
                        style={{ background: '#2a2a2a' }}
                      />
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                        <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700 }}>
                          {exp.role}
                        </h4>
                        <span style={{ color: '#555', fontSize: '11px' }} className="uppercase tracking-widest font-bold">
                          {exp.period}
                        </span>
                      </div>
                      <h5 style={{ color: '#888888', fontSize: '14px', marginBottom: '12px', fontWeight: 500 }}>
                        {exp.company}
                      </h5>
                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="space-y-2">
                          {exp.responsibilities.map((r, i) => (
                            <li key={i} style={{ color: '#888888', fontSize: '14px', lineHeight: 1.7 }} className="flex gap-3">
                              <span style={{ color: '#444' }}>•</span>
                              {r}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Key Projects */}
            {featuredProjects.length > 0 && (
              <section>
                <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px' }} className="uppercase font-bold">
                  KEY PROJECTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredProjects.map((p) => (
                    <div key={p._id} className="border border-[#222] p-6 rounded-lg hover:border-[#333] transition-colors">
                      <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>
                        <Link href={`/projects/${p.slug}`} className="hover:underline underline-offset-4">{p.title}</Link>
                      </h4>
                      <p style={{ color: '#888888', fontSize: '13px', lineHeight: 1.6, marginBottom: '12px' }}>
                        {p.shortDescription}
                      </p>
                      {p.techStack && (
                        <div className="flex flex-wrap gap-2">
                          {p.techStack.slice(0, 3).map(t => (
                            <span key={t} style={{ color: '#555', fontSize: '10px' }} className="uppercase tracking-widest">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills (Badges) */}
            {skills.length > 0 && (
              <section>
                <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px' }} className="uppercase font-bold">
                  SKILLS
                </h3>
                <div className="space-y-8">
                  {skills.map((cat) => (
                    <div key={cat._key}>
                      <h4 style={{ color: '#ffffff', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
                        {cat.category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {cat.items.map((skill) => (
                          <span
                            key={skill}
                            style={{
                              background: '#1a1a1a',
                              border: '1px solid #2a2a2a',
                              color: '#999999',
                              borderRadius: '4px',
                              padding: '3px 12px',
                              fontSize: '12px',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
