"use client";

import React, { useState } from "react";
import type { BaseResume } from "@/sanity/lib/types";
import { DownloadResumeButton } from "./DownloadResumeButton";
import { VersionSwitcher } from "./VersionSwitcher";
import { motion } from "framer-motion";
import { Quicksand } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"] });

const renderDescriptionPoints = (description: string) => {
  if (!description) return null;
  
  const lines = description
    .split(/\r?\n/)
    .map(line => line.trim().replace(/^[-•*]\s*/, ""))
    .filter(Boolean);
    
  return (
    <ul className="space-y-2 mb-4">
      {lines.map((line, i) => {
        // Match bold text with colon: **Title**: content
        const boldColonMatch = line.match(/^\*\*(.*?)\*\*:\s*(.*)$/);
        // Match plain text with colon: Title: content
        const plainColonMatch = line.match(/^(.*?):\s*(.*)$/);
        
        if (boldColonMatch) {
          const [, title, body] = boldColonMatch;
          return (
            <li key={i} style={{ color: '#888888', fontSize: '13.5px', lineHeight: 1.7, fontFamily: 'Quicksand, sans-serif' }} className="flex gap-3 !font-quicksand items-start">
              <span style={{ color: '#444' }}>•</span>
              <span>
                <strong style={{ color: 'lab(47.7841% -0.393212 -10.0268)', fontWeight: 600 }}>{title}:</strong> {body}
              </span>
            </li>
          );
        } else if (plainColonMatch) {
          const [, title, body] = plainColonMatch;
          if (title.length < 40) {
            return (
              <li key={i} style={{ color: '#888888', fontSize: '13.5px', lineHeight: 1.7, fontFamily: 'Quicksand, sans-serif' }} className="flex gap-3 !font-quicksand items-start">
                <span style={{ color: '#444' }}>•</span>
                <span>
                  <strong style={{ color: 'lab(47.7841% -0.393212 -10.0268)', fontWeight: 600 }}>{title}:</strong> {body}
                </span>
              </li>
            );
          }
        }
        
        return (
          <li key={i} style={{ color: '#888888', fontSize: '13.5px', lineHeight: 1.7, fontFamily: 'Quicksand, sans-serif' }} className="flex gap-3 !font-quicksand items-start">
            <span style={{ color: '#444' }}>•</span>
            <span>{line}</span>
          </li>
        );
      })}
    </ul>
  );
};

interface ResumeUIProps {
  resume: BaseResume;
  versions: { title: string; slug: string }[];
  currentSlug?: string;
}

export function ResumeUI({ resume, versions, currentSlug }: ResumeUIProps) {
  const { identity, professionalSummary, skills, experience, projects, education, additionalInfo } = resume;
  const [copied, setCopied] = useState(false);

  const handleCopyMarkdown = () => {
    const text = [
      `# ${identity.fullName}`,
      identity.title,
      `\n## Contact`,
      `${identity.email} | ${identity.phone} | ${identity.location}`,
      identity.linkedin && `LinkedIn: ${identity.linkedin}`,
      identity.github && `GitHub: ${identity.github}`,
      professionalSummary && `\n## Summary\n${professionalSummary}`,
      skills?.length && `\n## Skills\n${skills.map(s => `**${s.categoryName}:** ${s.technologies.join(', ')}`).join('\n')}`,
      experience?.length && `\n## Experience\n${experience.map(e => `### ${e.role} @ ${e.companyName}\n${e.responsibilities?.join('\n')}${e.achievements?.length ? '\nAchievements:\n' + e.achievements.join('\n') : ''}`).join('\n\n')}`,
      projects?.length && `\n## Projects\n${projects.map(p => `### ${p.title}\n${p.description}`).join('\n\n')}`,
      education?.length && `\n## Education\n${education.map(e => `### ${e.institution}\n${e.degree} ${e.fieldOfStudy ? 'in ' + e.fieldOfStudy : ''} | ${e.startYear} - ${e.endYear || 'Present'}`).join('\n\n')}`,
      additionalInfo?.certifications?.length && `\n## Certifications\n${additionalInfo.certifications.join('\n')}`,
      additionalInfo?.languages?.length && `\n## Languages\n${additionalInfo.languages.join('\n')}`,
      additionalInfo?.interests?.length && `\n## Interests\n${additionalInfo.interests.join('\n')}`,
    ].filter(Boolean).join('\n');

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      className={`${quicksand.className} !font-quicksand pt-16 md:pt-20`} 
      style={{ 
        background: '#000000', 
        minHeight: '100vh', 
        color: '#ffffff',
        overflowX: 'hidden',
        width: '100%',
        fontFamily: 'Quicksand, sans-serif'
      }}
    >
      
      {/* ─── TOP BAR ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center px-4 md:px-8 py-4 gap-4 md:gap-0" style={{ background: '#000000', borderBottom: '1px solid #1a1a1a', fontFamily: 'Quicksand, sans-serif' }}>
        <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
          <span style={{ color: '#555', fontSize: '12px', letterSpacing: '0.1em', fontFamily: 'Quicksand, sans-serif' }} className="hidden sm:inline">
            Home / Resume
          </span>
          <VersionSwitcher versions={versions} currentSlug={currentSlug} />
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <button 
            onClick={handleCopyMarkdown} 
            style={{
              background: 'transparent', 
              border: '1px solid #333',
              color: '#ffffff', 
              padding: '8px 16px',
              fontSize: '11px', 
              letterSpacing: '0.1em',
              cursor: 'pointer',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
              fontFamily: 'Quicksand, sans-serif'
            }}
            className="flex-1 md:flex-none hover:bg-white hover:text-black uppercase !font-quicksand"
          >
            {copied ? 'Copied ✔' : 'Copy Markdown'}
          </button>
          <div className="flex-1 md:flex-none">
            <DownloadResumeButton resume={resume} />
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row" style={{ width: '100%', fontFamily: 'Quicksand, sans-serif' }}>
        {/* ─── LEFT PANEL ────────────────────────────────────────────────────────── */}
        <div 
          className="w-full md:w-[280px] md:min-w-[280px] md:sticky md:top-[73px] md:h-[calc(100vh-73px)] overflow-y-auto scrollbar-none !font-quicksand"
          style={{
            background: '#0a0a0a',
            borderRight: '1px solid #1a1a1a',
            padding: '40px 24px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: 'Quicksand, sans-serif'
          }}
        >
          {/* Photo & Identity */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="relative w-[120px] h-[120px] mb-6 overflow-hidden rounded-lg">
              <img 
                src="/sazzadsunfi.jpg" 
                alt={identity.fullName} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h2 style={{ color: '#ffffff', fontWeight: 700, marginBottom: '4px', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand text-[24px] md:text-[18px]">
              {identity.fullName}
            </h2>
            <p style={{ color: '#777777', fontSize: '12px', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">
              {identity.title}
            </p>
            {identity.passion && (
              <p style={{ color: '#555555', fontSize: '11px', marginTop: '6px', fontStyle: 'italic', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand px-2 leading-relaxed">
                "{identity.passion}"
              </p>
            )}
          </div>

          <div className="space-y-8">
            {/* Contact Section */}
            <section>
              <h3 style={{ color: '#ffffff', fontSize: '10px', letterSpacing: '0.2em', marginBottom: '16px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Contact</h3>
              <div className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-600" style={{ fontFamily: 'Quicksand, sans-serif' }}>Email</span>
                  <span style={{ color: '#666666', fontSize: '12px', fontFamily: 'Quicksand, sans-serif' }}>{identity.email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-600" style={{ fontFamily: 'Quicksand, sans-serif' }}>Phone</span>
                  <span style={{ color: '#666666', fontSize: '12px', fontFamily: 'Quicksand, sans-serif' }}>{identity.phone}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] text-gray-600" style={{ fontFamily: 'Quicksand, sans-serif' }}>Location</span>
                  <span style={{ color: '#666666', fontSize: '12px', fontFamily: 'Quicksand, sans-serif' }}>{identity.location}</span>
                </div>
                <div className="flex gap-4 pt-2">
                  {identity.linkedin && (
                    <a href={identity.linkedin} target="_blank" rel="noreferrer" style={{ color: '#666666', fontSize: '12px', fontFamily: 'Quicksand, sans-serif' }} className="hover:text-white transition-colors !font-quicksand">LinkedIn</a>
                  )}
                  {identity.github && (
                    <a href={identity.github} target="_blank" rel="noreferrer" style={{ color: '#666666', fontSize: '12px', fontFamily: 'Quicksand, sans-serif' }} className="hover:text-white transition-colors !font-quicksand">GitHub</a>
                  )}
                </div>
              </div>
            </section>

            <div style={{ borderTop: '1px solid #1a1a1a' }} />

            {/* Education Section */}
            {education && education.length > 0 && (
              <section>
                <h3 style={{ color: '#ffffff', fontSize: '10px', letterSpacing: '0.2em', marginBottom: '16px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Education</h3>
                <div className="space-y-6">
                  {education.map((edu, i) => (
                    <div key={i}>
                      <h4 style={{ color: '#cccccc', fontSize: '13px', fontWeight: 600, marginBottom: '2px', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">{edu.institution}</h4>
                      <p style={{ color: '#666666', fontSize: '12px', marginBottom: '2px', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">{edu.degree}</p>
                      <p style={{ color: '#444444', fontSize: '11px', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">{edu.startYear} — {edu.endYear || 'Present'}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div style={{ borderTop: '1px solid #1a1a1a' }} />

            {/* Language Section (Left Panel) */}
            {additionalInfo?.languages && additionalInfo.languages.length > 0 && (
              <section>
                <h3 style={{ color: '#ffffff', fontSize: '10px', letterSpacing: '0.2em', marginBottom: '16px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Languages</h3>
                <div className="space-y-2">
                  {additionalInfo.languages.map((lang, idx) => (
                    <div key={idx} style={{ color: '#666666', fontSize: '12px', fontFamily: 'Quicksand, sans-serif' }}>
                      {lang}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>

        {/* ─── RIGHT PANEL ───────────────────────────────────────────────────────── */}
        <div 
          className="flex-1 md:h-[calc(100vh-73px)] md:overflow-y-auto scrollbar-none !font-quicksand"
          style={{
            background: '#111111',
            padding: '48px 24px md:padding: 80px 56px',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            fontFamily: 'Quicksand, sans-serif'
          }}
        >
          <div className="w-full max-w-3xl mx-auto px-4 md:px-0 pt-8 md:pt-16 pb-24">
            {/* Right Header */}
            <div className="text-center mb-16" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              <h1 style={{ fontWeight: 700, color: '#ffffff', marginBottom: '8px', fontFamily: 'Quicksand, sans-serif' }} className="tracking-tight !font-quicksand text-[28px] md:text-[clamp(24px,5vw,48px)]">
                {identity.fullName}
              </h1>
              <p style={{ fontSize: '16px', color: '#888888', marginBottom: '16px', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">
                {identity.title}
              </p>
              <div style={{ color: '#555555', fontSize: '13px', fontFamily: 'Quicksand, sans-serif' }} className="flex justify-center gap-x-4 gap-y-2 flex-wrap items-center">
                <span className="break-all" style={{ fontFamily: 'Quicksand, sans-serif' }}>{identity.email}</span>
                <span className="hidden sm:inline">|</span>
                <span style={{ fontFamily: 'Quicksand, sans-serif' }}>{identity.phone}</span>
                <span className="hidden sm:inline">|</span>
                {identity.github && (
                  <>
                    <a href={identity.github} target="_blank" rel="noreferrer" className="hover:text-white transition-colors underline underline-offset-4 !font-quicksand" style={{ fontFamily: 'Quicksand, sans-serif' }}>GitHub</a>
                    <span className="hidden sm:inline">|</span>
                  </>
                )}
                {identity.linkedin && (
                  <>
                    <a href={identity.linkedin} target="_blank" rel="noreferrer" className="hover:text-white transition-colors underline underline-offset-4 !font-quicksand" style={{ fontFamily: 'Quicksand, sans-serif' }}>LinkedIn</a>
                    <span className="hidden sm:inline">|</span>
                  </>
                )}
                <span className="text-center" style={{ fontFamily: 'Quicksand, sans-serif' }}>{identity.location}</span>
              </div>
            </div>

            <div className="space-y-16" style={{ fontFamily: 'Quicksand, sans-serif' }}>
              {/* 1. Professional Summary */}
              {professionalSummary && (
                <motion.section 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="!font-quicksand"
                >
                  <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '20px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Professional Summary</h3>
                  <p style={{ color: '#888888', fontSize: '14px', lineHeight: 1.8, fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">{professionalSummary}</p>
                </motion.section>
              )}

              {/* 2. Technical Skills (Table Format) */}
              {skills && skills.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="!font-quicksand"
                >
                  <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Technical Skills</h3>
                  <div className="border border-[#222] rounded-lg overflow-x-auto scrollbar-thin !font-quicksand" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                    <table className="w-full text-left border-collapse min-w-[500px] md:min-w-0" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                      <thead>
                        <tr style={{ background: '#1a1a1a' }}>
                          <th className="px-6 py-4 text-[11px] tracking-wider text-gray-400 font-bold border-b border-[#222]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Category</th>
                          <th className="px-6 py-4 text-[11px] tracking-wider text-gray-400 font-bold border-b border-[#222]" style={{ fontFamily: 'Quicksand, sans-serif' }}>Technologies</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#222]">
                        {skills.map((skill) => (
                          <tr key={skill.id} className="hover:bg-[#1a1a1a]/30 transition-colors">
                            <td className="px-6 py-4 text-[13px] text-white font-medium align-top w-1/3 border-r border-[#222]" style={{ fontFamily: 'Quicksand, sans-serif' }}>{skill.categoryName}</td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-2">
                                {skill.technologies.map((tech, idx) => (
                                  <span key={idx} className="text-[12px] text-gray-400" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                                    {tech}{idx < skill.technologies.length - 1 ? ',' : ''}
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.section>
              )}

              {/* 3. Experience */}
              {experience && experience.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="!font-quicksand"
                >
                  <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Experience</h3>
                  <div className="space-y-12">
                    {experience.map((exp) => (
                      <div key={exp.id} className="relative pl-8">
                        <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full" style={{ background: '#ffffff' }} />
                        <div className="absolute left-[3.5px] top-3 bottom-[-40px] w-[1px]" style={{ background: '#2a2a2a' }} />
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                          <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">{exp.role}</h4>
                          <span style={{ color: '#555', fontSize: '11px', fontFamily: 'Quicksand, sans-serif' }} className="tracking-widest font-bold !font-quicksand">
                            {exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short'}) : ''} — 
                            {exp.isCurrent ? " Present" : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short'}) : ''}
                          </span>
                        </div>
                        <div className="text-[13px] font-medium mb-4" style={{ color: '#888888', fontFamily: 'Quicksand, sans-serif' }}>{exp.companyName}</div>
                        
                        {exp.responsibilities && (
                          <div className="mb-4">
                            <h5 className="text-[11px] tracking-wider text-gray-500 mb-2 font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>Key Responsibilities:</h5>
                            <ul className="space-y-2">
                              {exp.responsibilities.map((resp, i) => {
                                // If the string contains numbered points like "1. ... 2. ...", split them
                                const points = resp.split(/\d+\.\s+/).filter(p => p.trim().length > 0);
                                if (points.length > 1) {
                                  return points.map((point, idx) => (
                                    <li key={`${i}-${idx}`} style={{ color: '#888888', fontSize: '13.5px', lineHeight: 1.7, fontFamily: 'Quicksand, sans-serif' }} className="flex gap-3 !font-quicksand">
                                      <span style={{ color: '#444' }}>•</span>
                                      {point.trim()}
                                    </li>
                                  ));
                                }
                                return (
                                  <li key={i} style={{ color: '#888888', fontSize: '13.5px', lineHeight: 1.7, fontFamily: 'Quicksand, sans-serif' }} className="flex gap-3 !font-quicksand">
                                    <span style={{ color: '#444' }}>•</span>
                                    {resp}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}

                        {exp.achievements && exp.achievements.length > 0 && (
                          <div>
                            <h5 className="text-[11px] tracking-wider text-gray-500 mb-2 font-bold" style={{ fontFamily: 'Quicksand, sans-serif' }}>Key Achievements:</h5>
                            <ul className="space-y-2">
                              {exp.achievements.map((ach, i) => {
                                const points = ach.split(/\d+\.\s+/).filter(p => p.trim().length > 0);
                                if (points.length > 1) {
                                  return points.map((point, idx) => (
                                    <li key={`${i}-${idx}`} style={{ color: '#bbbbbb', fontSize: '13.5px', lineHeight: 1.7, fontFamily: 'Quicksand, sans-serif' }} className="flex gap-3 !font-quicksand">
                                      <span style={{ color: '#ffffff' }}>★</span>
                                      {point.trim()}
                                    </li>
                                  ));
                                }
                                return (
                                  <li key={i} style={{ color: '#bbbbbb', fontSize: '13.5px', lineHeight: 1.7, fontFamily: 'Quicksand, sans-serif' }} className="flex gap-3 !font-quicksand">
                                    <span style={{ color: '#ffffff' }}>★</span>
                                    {ach}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* 4. Projects */}
              {projects && projects.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="!font-quicksand"
                >
                  <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Projects</h3>
                  <div className="space-y-12">
                    {projects.map((proj, index) => (
                      <div key={proj.id} className="relative pl-8">
                        {/* Progress Dot */}
                        <div 
                          className="absolute left-0 top-1.5 w-2 h-2 rounded-full" 
                          style={{ background: '#ffffff' }} 
                        />
                        
                        {/* Connecting Line */}
                        {index < projects.length - 1 && (
                          <div 
                            className="absolute left-[3.5px] top-3.5 bottom-[-48px] w-[1px]" 
                            style={{ background: '#2a2a2a' }} 
                          />
                        )}
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                          <h4 style={{ color: '#ffffff', fontSize: '16px', fontWeight: 700, fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">{proj.title}</h4>
                        </div>

                        {/* Github | Tech stack */}
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] mb-3 text-gray-500" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                          {proj.githubLink && (
                            <>
                              <a 
                                href={proj.githubLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ color: '#888', fontFamily: 'Quicksand, sans-serif' }} 
                                className="hover:text-white hover:underline font-bold !font-quicksand uppercase tracking-wide text-[11px]"
                              >
                                GitHub
                              </a>
                              <span className="text-[#333]">|</span>
                            </>
                          )}
                          {proj.projectLink && (
                            <>
                              <a 
                                href={proj.projectLink} 
                                target="_blank" 
                                rel="noreferrer" 
                                style={{ color: '#888', fontFamily: 'Quicksand, sans-serif' }} 
                                className="hover:text-white hover:underline !font-quicksand uppercase tracking-wide text-[11px]"
                              >
                                Live Demo
                              </a>
                              <span className="text-[#333]">|</span>
                            </>
                          )}
                          {proj.techStack && proj.techStack.length > 0 && (
                            <span style={{ color: '#666', fontFamily: 'Quicksand, sans-serif' }} className="!font-quicksand">
                              {proj.techStack.join(', ')}
                            </span>
                          )}
                        </div>

                        {/* Description (Bullet points with neon red/lab title) */}
                        {proj.description && renderDescriptionPoints(proj.description)}

                        {/* Tags */}
                        {proj.tags && proj.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {proj.tags.map((tag, idx) => (
                              <span 
                                key={idx} 
                                style={{ borderColor: '#222', color: '#666', fontFamily: 'Quicksand, sans-serif' }} 
                                className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border bg-[#111] !font-quicksand font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* 5. Additional Information */}
              {additionalInfo?.certifications && additionalInfo.certifications.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="!font-quicksand"
                >
                  <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Additional Information</h3>
                  <div className="space-y-4">
                    {additionalInfo.certifications.map((cert, idx) => (
                      <div key={idx} className="flex gap-3 text-[14px] text-gray-400" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                        <span className="text-gray-600">•</span>
                        {cert}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* 6. Interests */}
              {additionalInfo?.interests && additionalInfo.interests.length > 0 && (
                <motion.section 
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="!font-quicksand"
                >
                  <h3 style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#ffffff', borderBottom: '1px solid #222', paddingBottom: '8px', marginBottom: '24px', fontFamily: 'Quicksand, sans-serif' }} className="font-bold !font-quicksand">Interests</h3>
                  <div className="flex flex-wrap gap-x-8 gap-y-4">
                    {additionalInfo.interests.map((interest, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[14px] text-gray-400 tracking-widest !font-quicksand" style={{ fontFamily: 'Quicksand, sans-serif' }}>
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
                        {interest}
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
