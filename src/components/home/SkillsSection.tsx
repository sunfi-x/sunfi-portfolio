"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Zap } from "lucide-react";
import type { Skill } from "@/sanity/lib/types";
import type { IconType } from "react-icons";
import {
  SiPython,
  SiScikitlearn,
  SiMysql,
  SiPostgresql,
  SiPandas,
  SiNumpy,
  SiPlotly,
  SiStreamlit,
  SiNextdotjs,
  SiReact,
  SiJavascript,
  SiTypescript,
  SiTailwindcss,
  SiFramer,
  SiVite,
  SiGit,
  SiGithub,
  SiDocker,
  SiSanity,
  SiSupabase,
  SiVercel,
} from "react-icons/si";
import { TbChartDots } from "react-icons/tb";

// ─── Custom Seaborn Official Logo SVG ─────────────────────────────────────────
function SeabornIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
    >
      <path d="M3 18C7 18 7.5 7 12 7C16.5 7 17 18 21 18" strokeWidth="2.2" />
      <path d="M3 12C7 12 8.5 6 12 6C15.5 6 17 12 21 12" strokeWidth="1.6" strokeOpacity="0.4" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="21" cy="18" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="3" cy="18" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface CompetencyRow {
  index: string;
  title: string;
  technologies: string[];
}

interface MarqueeTool {
  name: string;
  icon: IconType | React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  brandColor: string;
  customSvg?: React.ReactNode;
}

// ─── 4 Core Competencies Data ────────────────────────────────────────────────
const COMPETENCY_ROWS: CompetencyRow[] = [
  {
    index: "01",
    title: "AI & MACHINE LEARNING",
    technologies: [
      "Machine Learning",
      "Deep Learning",
      "Gemini AI",
      "LLMs",
      "NLP",
      "Time Series Analysis",
      "AI Engineering",
    ],
  },
  {
    index: "02",
    title: "DATA SCIENCE & ANALYTICS",
    technologies: [
      "Python",
      "SQL / MySQL",
      "PostgreSQL",
      "Pandas",
      "NumPy",
      "Seaborn",
      "Plotly",
      "Streamlit",
      "Data Visualization",
      "Web Scraping",
    ],
  },
  {
    index: "03",
    title: "FULL-STACK DEVELOPMENT",
    technologies: [
      "Next.js 15",
      "React",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
    ],
  },
  {
    index: "04",
    title: "CLOUD & ENGINEERING",
    technologies: [
      "Git",
      "GitHub",
      "Docker",
      "Sanity.io",
      "Supabase",
      "Vercel",
    ],
  },
];

// ─── Marquee Row 01 Data (AI + Data with Original Brand Colors) ───────────────
const MARQUEE_ROW_01: MarqueeTool[] = [
  {
    name: "Python",
    icon: SiPython,
    brandColor: "#3776AB",
    customSvg: (
      <svg viewBox="0 0 256 255" className="w-4 sm:w-6 h-4 sm:h-6 shrink-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="py-a" x1="12.959%" y1="12.039%" x2="79.639%" y2="78.201%">
            <stop offset="0%" stopColor="#387EB8"/>
            <stop offset="100%" stopColor="#366994"/>
          </linearGradient>
          <linearGradient id="py-b" x1="19.128%" y1="20.579%" x2="90.742%" y2="88.429%">
            <stop offset="0%" stopColor="#FFE052"/>
            <stop offset="100%" stopColor="#FFC331"/>
          </linearGradient>
        </defs>
        <path fill="url(#py-a)" d="M126.916.072c-64.832 0-60.784 28.115-60.784 28.115l.072 29.128h61.868v8.745H41.631S.145 61.355.145 126.77c0 65.417 36.21 63.097 36.21 63.097h21.61v-30.356s-1.165-36.21 35.632-36.21h61.362s34.475.557 34.475-33.319V33.97S194.67.072 126.916.072zM92.802 19.66a11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13 11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.13z"/>
        <path fill="url(#py-b)" d="M128.757 254.126c64.832 0 60.784-28.115 60.784-28.115l-.072-29.127H127.6v-8.745h86.441s41.486 4.705 41.486-60.712c0-65.416-36.21-63.096-36.21-63.096h-21.61v30.355s1.165 36.21-35.632 36.21h-61.362s-34.475-.557-34.475 33.32v56.013s-5.235 33.897 62.518 33.897zm34.114-19.586a11.12 11.12 0 0 1-11.13-11.13 11.12 11.12 0 0 1 11.13-11.131 11.12 11.12 0 0 1 11.13 11.13 11.12 11.12 0 0 1-11.13 11.13z"/>
      </svg>
    ),
  },
  { name: "Scikit-learn", icon: SiScikitlearn, brandColor: "#F7931E" },
  { name: "MySQL", icon: SiMysql, brandColor: "#4479A1" },
  { name: "PostgreSQL", icon: SiPostgresql, brandColor: "#4169E1" },
  { name: "Pandas", icon: SiPandas, brandColor: "#E70488" },
  { name: "NumPy", icon: SiNumpy, brandColor: "#4DABCF" },
  { name: "Seaborn", icon: SeabornIcon, brandColor: "#4C72B0" },
  { name: "Plotly", icon: SiPlotly, brandColor: "#636EFA" },
  { name: "Streamlit", icon: SiStreamlit, brandColor: "#FF4B4B" },
  { name: "Data Visualization", icon: TbChartDots, brandColor: "#00E575" },
];

// ─── Marquee Row 02 Data (Dev + Cloud with Original Brand Colors) ─────────────
const MARQUEE_ROW_02: MarqueeTool[] = [
  { name: "Next.js", icon: SiNextdotjs, brandColor: "#FFFFFF" },
  { name: "React", icon: SiReact, brandColor: "#61DAFB" },
  { name: "JavaScript", icon: SiJavascript, brandColor: "#F7DF1E" },
  { name: "TypeScript", icon: SiTypescript, brandColor: "#3178C6" },
  { name: "Tailwind CSS", icon: SiTailwindcss, brandColor: "#06B6D4" },
  { name: "Framer Motion", icon: SiFramer, brandColor: "#EA4C89" },
  { name: "Vite", icon: SiVite, brandColor: "#646CFF" },
  { name: "Git", icon: SiGit, brandColor: "#F05032" },
  { name: "GitHub", icon: SiGithub, brandColor: "#FFFFFF" },
  { name: "Docker", icon: SiDocker, brandColor: "#2496ED" },
  { name: "Sanity.io", icon: SiSanity, brandColor: "#F03E2F" },
  { name: "Supabase", icon: SiSupabase, brandColor: "#3ECF8E" },
  { name: "Vercel", icon: SiVercel, brandColor: "#FFFFFF" },
];

// ─── Infinite Marquee Track Component ─────────────────────────────────────────
function ToolMarquee({
  items,
  direction = "left",
  desktopDuration = 35,
  mobileDuration = 12,
}: {
  items: MarqueeTool[];
  direction?: "left" | "right";
  desktopDuration?: number;
  mobileDuration?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const singleSetRef = useRef<HTMLDivElement>(null);
  const [, setReady] = useState(false);

  // We render 2 copies. We animate by the pixel width of ONE copy.
  useEffect(() => {
    if (!trackRef.current || !singleSetRef.current) return;

    const isMobile = window.innerWidth < 768;
    const dur = isMobile ? mobileDuration : desktopDuration;
    const oneSetWidth = singleSetRef.current.offsetWidth;

    if (!oneSetWidth) return;

    const translateStart = direction === "left" ? 0 : -oneSetWidth;
    const translateEnd = direction === "left" ? -oneSetWidth : 0;

    const el = trackRef.current;
    el.style.transition = "none";
    el.style.transform = `translateX(${translateStart}px)`;

    let startTime: number | null = null;
    let raf: number;

    const animate = (ts: number) => {
      if (startTime === null) startTime = ts;
      const elapsed = ts - startTime;
      const progress = (elapsed % (dur * 1000)) / (dur * 1000);
      const x = translateStart + (translateEnd - translateStart) * progress;
      el.style.transform = `translateX(${x}px)`;
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    setReady(true);

    return () => cancelAnimationFrame(raf);
  }, [direction, desktopDuration, mobileDuration]);

  const doubled = [...items, ...items];

  const itemNodes = (refProp?: React.RefObject<HTMLDivElement | null>) =>
    items.map((tool, idx) => {
      const IconComponent = tool.icon;
      return (
        <div
          key={idx}
          className="flex items-center shrink-0"
          ref={idx === items.length - 1 && refProp ? undefined : undefined}
        >
          <div className="flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-8 py-2 cursor-default">
            {tool.customSvg ? tool.customSvg : (
              <IconComponent
                className="w-4 sm:w-6 h-4 sm:h-6 shrink-0"
                style={{ color: tool.brandColor }}
              />
            )}
            <span className="text-sm sm:text-lg md:text-xl font-semibold tracking-normal text-[#F5F5F5]">
              {tool.name}
            </span>
          </div>
          <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0 mx-2 sm:mx-3 select-none" />
        </div>
      );
    });

  return (
    <div
      className="relative w-full overflow-hidden select-none py-3 sm:py-4"
      style={{
        maskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
      }}
    >
      <div
        ref={trackRef}
        className="flex items-center gap-0 whitespace-nowrap will-change-transform"
      >
        {/* First copy — measured for pixel width */}
        <div ref={singleSetRef} className="flex items-center gap-0 whitespace-nowrap shrink-0">
          {itemNodes()}
        </div>
        {/* Second copy — seamless loop */}
        <div className="flex items-center gap-0 whitespace-nowrap shrink-0">
          {itemNodes()}
        </div>
      </div>
    </div>
  );
}

// ─── Main Skills & Expertise Section ─────────────────────────────────────────
interface SkillsSectionProps {
  skills?: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const totalCount = skills && skills.length > 0 ? skills.length : 37;

  return (
    <section
      id="skills"
      className="relative pt-24 pb-0 md:pt-32 lg:pt-36 bg-[#050505] text-[#F5F5F5] overflow-hidden"
    >
      {/* Subtle top divider line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      <div ref={ref} className="container mx-auto px-5 sm:px-8 md:px-12 max-w-6xl">
        {/* ── 1. Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 md:mb-20"
        >
          {/* Left: Title & Subtitle */}
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl leading-none shrink-0 select-none">⚡</span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#F5F5F5]">
                  Skills &amp; Expertise
                </h2>
              </div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-white/[0.04] border border-white/[0.08] text-[#8A8A8A]">
                {totalCount}+ technologies
              </span>
            </div>
            <p className="text-sm sm:text-base text-[#8A8A8A] font-normal leading-relaxed max-w-xl">
              A blend of skills powering my work in AI, data, and development.
            </p>
          </div>

          {/* Right: Two subtle minimal statistic boxes */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-lg bg-[#0a0a0a]/80 border border-white/[0.07] min-w-[105px]">
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#F5F5F5] tracking-tight">
                {totalCount}+
              </p>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#8A8A8A] uppercase tracking-wider mt-0.5">
                Technologies
              </p>
            </div>
            <div className="px-4 py-3 rounded-lg bg-[#0a0a0a]/80 border border-white/[0.07] min-w-[105px]">
              <p className="text-xl sm:text-2xl font-bold font-mono text-[#F5F5F5] tracking-tight">
                04
              </p>
              <p className="text-[10px] sm:text-[11px] font-mono text-[#8A8A8A] uppercase tracking-wider mt-0.5">
                Core Areas
              </p>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Core Competencies (4 Editorial Rows) ── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 md:mb-28"
        >
          {/* Label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E575]" />
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8A8A8A]">
              CORE COMPETENCIES
            </p>
          </div>

          {/* 4 Large Editorial Rows/Cards */}
          <div className="flex flex-col gap-3">
            {COMPETENCY_ROWS.map((row, idx) => (
              <motion.div
                key={row.index}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-7 md:p-8 rounded-xl bg-[#0a0a0a]/60 hover:bg-[#0f0f0f] border border-white/[0.07] hover:border-white/20 transition-all duration-300 gap-4 lg:gap-8"
              >
                {/* Left: Index + Category Title */}
                <div className="lg:w-[320px] shrink-0 flex items-center gap-4">
                  <span className="font-mono text-sm sm:text-base font-semibold text-[#8A8A8A] group-hover:text-[#C83228D9] transition-colors duration-300">
                    {row.index}
                  </span>
                  <h3
                    className="text-base sm:text-lg font-bold tracking-tight transition-colors duration-300"
                    style={{ color: "#C83228D9" }}
                  >
                    {row.title}
                  </h3>
                </div>

                {/* Thin Vertical Divider (Desktop) */}
                <div className="hidden lg:block w-px h-8 bg-white/[0.08] group-hover:bg-white/20 transition-colors duration-300 shrink-0" />

                {/* Right: Technologies List */}
                <div className="flex-1 flex flex-wrap items-center gap-x-2.5 gap-y-2">
                  {row.technologies.map((tech, techIdx) => (
                    <span key={tech} className="inline-flex items-center gap-2.5">
                      <span className="text-xs sm:text-sm font-medium text-white transition-colors duration-300">
                        {tech}
                      </span>
                      {techIdx < row.technologies.length - 1 && (
                        <span
                          className="text-[#C83228D9]/70 text-xs select-none font-bold"
                          aria-hidden="true"
                        >
                          ·
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── 3. Two Horizontal Infinite Marquees (No Category Headings, Original Colors, Larger Text) ── */}
      <div className="w-full bg-[#080808] border-y border-white/[0.06] flex flex-col gap-0">
        {/* Row 1: AI + Data — scrolls RIGHT */}
        <ToolMarquee items={MARQUEE_ROW_01} direction="right" desktopDuration={62} mobileDuration={38} />

        {/* Crisp divider seam between rows */}
        <div className="w-full h-px bg-white/[0.04]" />

        {/* Row 2: Dev + Cloud — scrolls LEFT */}
        <ToolMarquee items={MARQUEE_ROW_02} direction="left" desktopDuration={66} mobileDuration={43} />
      </div>
    </section>
  );
}
