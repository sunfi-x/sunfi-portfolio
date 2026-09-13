"use client";

import React, { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Compass,
  GraduationCap,
  Brain,
  Code2,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  Terminal,
  Layers,
} from "lucide-react";
import {
  SiPython,
  SiScikitlearn,
  SiFastapi,
  SiNextdotjs,
  SiDocker,
  SiLeetcode,
  SiKaggle,
} from "react-icons/si";

interface Milestone {
  year: string;
  phase: string;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  brandColor: string;
  highlights: string[];
  keyTools: { name: string; icon?: React.ElementType; color?: string }[];
  statLabel?: string;
  statValue?: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2022",
    phase: "PHASE 01",
    title: "Genesis & Programming Foundations",
    badge: "The Spark",
    subtitle: "Python, SQL & Data Visualization",
    description:
      "Started programming with Python, turning raw numbers into charts on a screen. Focused heavily on syntax, logic building, relational database queries (SQL), and exploratory plotting.",
    icon: Terminal,
    brandColor: "#3776AB",
    highlights: [
      "Mastered core Python data structures & OOP principles",
      "Built first data visualization scripts with Matplotlib & Seaborn",
      "Created relational database schemas with MySQL",
    ],
    keyTools: [
      { name: "Python", icon: SiPython, color: "#3776AB" },
      { name: "SQL", color: "#4479A1" },
      { name: "Matplotlib", color: "#11557C" },
    ],
    statLabel: "Foundational Code",
    statValue: "10k+ Lines",
  },
  {
    year: "2023",
    phase: "PHASE 02",
    title: "Academic Data Science & ML Core",
    badge: "Deep Dive",
    subtitle: "B.Sc. in Data Science at UIU",
    description:
      "Enrolled in B.Sc. in Data Science at United International University (UIU). Deepened knowledge in statistical modeling, machine learning algorithms, Pandas, NumPy, and large-scale web scraping.",
    icon: GraduationCap,
    brandColor: "#F7931E",
    highlights: [
      "Scraped & structured 6MB+ real BD Data Science job market data",
      "Implemented classical ML models (Regression, Random Forests, SVMs)",
      "Designed exploratory data pipelines with Pandas & NumPy",
    ],
    keyTools: [
      { name: "Scikit-Learn", icon: SiScikitlearn, color: "#F7931E" },
      { name: "Pandas", color: "#E70488" },
      { name: "NumPy", color: "#4DABCF" },
    ],
    statLabel: "Data Scraped",
    statValue: "6MB+ Cleaned",
  },
  {
    year: "2024",
    phase: "PHASE 03",
    title: "Applied AI & Competitive Coding",
    badge: "Systems & Algorithms",
    subtitle: "Full-Stack AI & Competitive Platforms",
    description:
      "Shifted towards real-world production engineering and competitive problem solving. Earned HackerRank Gold Badge, active LeetCode & Kaggle contributor, and built production web software.",
    icon: Code2,
    brandColor: "#00EA64",
    highlights: [
      "Built UIU Lost & Found V3 with FastAPI, React, and Gemini AI",
      "Developed Campus Transit System cutting resolution time by 65%",
      "Achieved Gold Badge in Problem Solving & Python on HackerRank",
    ],
    keyTools: [
      { name: "FastAPI", icon: SiFastapi, color: "#009688" },
      { name: "LeetCode", icon: SiLeetcode, color: "#FFA116" },
      { name: "Kaggle", icon: SiKaggle, color: "#20BEFF" },
    ],
    statLabel: "Resolution Boost",
    statValue: "65% Faster",
  },
  {
    year: "2025",
    phase: "PHASE 04",
    title: "Research, Clinical ML & Awards",
    badge: "Academic Excellence",
    subtitle: "Clinical ML Audits & Recognition",
    description:
      "Focused on rigorous ML research, auditing data leakage in clinical AI models (such as PCOS diagnosis), and winning 1st Runner-Up in the University OOP Project Competition.",
    icon: Award,
    brandColor: "#C83228",
    highlights: [
      "Awarded 1st Runner-Up in University OOP Project Competition",
      "Authored clinical ML research on data leakage & model inflation",
      "Optimized ensemble stacking models with strict cross-validation",
    ],
    keyTools: [
      { name: "Machine Learning", color: "#C83228" },
      { name: "Stacking Ensembles", color: "#9333EA" },
      { name: "Statistical Auditing", color: "#3B82F6" },
    ],
    statLabel: "Award",
    statValue: "1st Runner-Up",
  },
  {
    year: "2026+",
    phase: "PHASE 05",
    title: "Generative AI & MLOps Architecture",
    badge: "Current Horizon",
    subtitle: "LLM Agents, Next.js 15 & MLOps",
    description:
      "Current focus is architecting autonomous AI agents, multi-modal LLM integrations, modern full-stack web applications with Next.js 15 & Tailwind, containerization with Docker, and scalable MLOps.",
    icon: Sparkles,
    brandColor: "#61DAFB",
    highlights: [
      "Integrating Gemini 1.5 & 2.0 Pro/Flash into automated agent workflows",
      "Building high-performance Next.js 15 applications with SSR & ISR",
      "Containerizing ML microservices with Docker & Cloud deployments",
    ],
    keyTools: [
      { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF" },
      { name: "Gemini AI", color: "#8E75FF" },
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
    ],
    statLabel: "Target Goal",
    statValue: "Production AI",
  },
];

const PILLARS = [
  {
    title: "Machine Learning & AI",
    desc: "Rigorous ML pipelines, data leakage prevention, LLM integrations & predictive analytics.",
    icon: Brain,
    color: "#C83228",
  },
  {
    title: "Data Engineering",
    desc: "Web scraping, data cleaning, ETL pipelines, and SQL/PostgreSQL schema optimization.",
    icon: TrendingUp,
    color: "#F7931E",
  },
  {
    title: "Full-Stack Development",
    desc: "Modern web applications powered by Next.js 15, React, TypeScript, FastAPI, and Tailwind CSS.",
    icon: Layers,
    color: "#61DAFB",
  },
  {
    title: "Algorithmic Problem Solving",
    desc: "Strong computer science fundamentals, data structures, dynamic programming & verified profiles.",
    icon: Code2,
    color: "#00EA64",
  },
];

export function LearningJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activePhase, setActivePhase] = useState<number>(4); // Default to latest phase (2026+)

  return (
    <section
      id="journey"
      className="relative py-20 md:py-28 bg-[#050505] text-[#F5F5F5] overflow-hidden"
    >
      {/* Top subtle border divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#C83228D9]/5 blur-[140px] rounded-full pointer-events-none -z-10" />

      <div ref={sectionRef} className="container mx-auto px-5 sm:px-8 md:px-12 max-w-6xl">
        {/* ── 1. Section Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C83228D9]/10 border border-[#C83228D9]/20 text-[11px] font-mono text-[#C83228D9] tracking-wider uppercase mb-3">
              <Compass className="w-3.5 h-3.5" />
              <span>EVOLUTION & MILESTONES</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              My Learning <span className="text-[#C83228D9]">Journey</span>
            </h2>
            <p className="text-sm sm:text-base text-[#8A8A8A] font-normal leading-relaxed max-w-xl mt-2">
              From writing my first Python script to building production AI applications, clinical ML research, and competitive problem solving.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">4+</span>
              <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-wider">Years Coding</p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
              <span className="text-xl sm:text-2xl font-bold font-mono text-white">05</span>
              <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-wider">Major Phases</p>
            </div>
            <div className="px-4 py-3 rounded-xl bg-[#0a0a0a] border border-white/[0.08]">
              <span className="text-xl sm:text-2xl font-bold font-mono text-[#C83228D9]">UIU</span>
              <p className="text-[10px] font-mono text-[#8A8A8A] uppercase tracking-wider">B.Sc. Data Sci</p>
            </div>
          </div>
        </motion.div>

        {/* ── 2. Interactive Timeline & Milestone Showcase ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Left Column: Timeline Navigation Buttons */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1 px-1">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest text-[#8A8A8A]">
                CHRONOLOGICAL ROADMAP
              </span>
              <span className="text-[11px] font-mono text-white/40">Select a phase</span>
            </div>

            {MILESTONES.map((item, idx) => {
              const isActive = activePhase === idx;
              const IconComp = item.icon;

              return (
                <button
                  key={item.year}
                  onClick={() => setActivePhase(idx)}
                  className={`group relative text-left p-4 sm:p-5 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    isActive
                      ? "bg-[#0f0f0f] border-[#C83228D9]/60 shadow-[0_0_25px_rgba(200,50,40,0.15)]"
                      : "bg-[#0a0a0a]/70 border-white/[0.07] hover:border-white/20 hover:bg-[#0d0d0d]"
                  }`}
                >
                  {/* Left accent bar for active */}
                  {isActive && (
                    <motion.div
                      layoutId="timelineActiveIndicator"
                      className="absolute left-0 top-3 bottom-3 w-1 bg-[#C83228D9] rounded-r-full"
                    />
                  )}

                  <div className="flex items-center gap-3.5 pl-2">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-colors ${
                        isActive
                          ? "bg-[#C83228D9]/20 border-[#C83228D9]/40 text-[#C83228D9]"
                          : "bg-white/[0.04] border-white/10 text-[#8A8A8A] group-hover:text-white"
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {item.year}
                        </span>
                        <span className="text-[10px] font-mono text-[#8A8A8A] px-1.5 py-0.2 rounded bg-white/[0.05]">
                          {item.phase}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-gray-300 group-hover:text-white line-clamp-1 mt-0.5">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono font-semibold px-2 py-1 rounded transition-colors ${
                      isActive
                        ? "bg-[#C83228D9] text-white"
                        : "bg-white/[0.05] text-[#8A8A8A] group-hover:text-white"
                    }`}
                  >
                    {item.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Active Milestone Detail Card */}
          <div className="lg:col-span-8">
            {MILESTONES.map((item, idx) => {
              if (activePhase !== idx) return null;
              const IconComp = item.icon;

              return (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative p-6 sm:p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden"
                >
                  {/* Background Glow */}
                  <div
                    className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[90px] opacity-15 pointer-events-none"
                    style={{ backgroundColor: item.brandColor }}
                  />

                  {/* Top Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-5 border-b border-white/[0.08]">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-black/60 shadow-inner"
                        style={{ color: item.brandColor }}
                      >
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#C83228D9]">
                            {item.year}
                          </span>
                          <span className="text-xs font-mono text-[#8A8A8A]">• {item.phase}</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">{item.title}</h3>
                      </div>
                    </div>

                    {item.statValue && (
                      <div className="px-3.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-right">
                        <span className="block text-sm font-bold font-mono text-white">
                          {item.statValue}
                        </span>
                        <span className="block text-[10px] font-mono text-[#8A8A8A]">
                          {item.statLabel}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Subtitle & Description */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-300 font-mono mb-2">
                      Focus: {item.subtitle}
                    </h4>
                    <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Key Highlights */}
                  <div className="mb-8">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-[#8A8A8A] mb-3">
                      KEY LEARNING ACCOMPLISHMENTS
                    </h5>
                    <div className="space-y-2.5">
                      {item.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#C83228D9] shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-gray-200">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tools & Technologies */}
                  <div className="pt-4 border-t border-white/[0.08]">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#8A8A8A] block mb-3">
                      PRIMARY STACK FOR THIS PHASE
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {item.keyTools.map((t, i) => {
                        const ToolIcon = t.icon;
                        return (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-200"
                          >
                            {ToolIcon && (
                              <ToolIcon className="w-3.5 h-3.5" style={{ color: t.color }} />
                            )}
                            <span>{t.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── 3. Four Core Learning Pillars Grid ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C83228D9]" />
            <p className="text-[11px] font-mono font-semibold uppercase tracking-[0.25em] text-[#8A8A8A]">
              CORE KNOWLEDGE DOMAINS
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((p, i) => {
              const PillarIcon = p.icon;
              return (
                <div
                  key={i}
                  className="p-5 rounded-xl bg-[#0a0a0a]/80 border border-white/[0.07] hover:border-white/20 transition-all duration-300 group"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/[0.04] border border-white/10 mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{ color: p.color }}
                  >
                    <PillarIcon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1.5 group-hover:text-[#C83228D9] transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-[#8A8A8A] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
