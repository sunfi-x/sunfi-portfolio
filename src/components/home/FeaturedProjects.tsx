"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Brain, Sparkles, Database, Globe } from "lucide-react";
import { SiPython } from "react-icons/si";
import { TerminalProjectCard } from "../projects/TerminalProjectCard";
import { urlFor } from "@/sanity/lib/image";
import type { Project } from "@/sanity/lib/types";

/* ─── Interactive Mouse-Tracking Terminal Mascot ────────────────────────────── */
function InteractiveTerminalEyes() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Left eye center
      const leftEyeX = rect.left + 8;
      const leftEyeY = rect.top + 9;
      const leftAngle = Math.atan2(e.clientY - leftEyeY, e.clientX - leftEyeX);
      const leftDist = Math.min(2.5, Math.hypot(e.clientX - leftEyeX, e.clientY - leftEyeY) / 35);
      setLeftPupil({
        x: Math.cos(leftAngle) * leftDist,
        y: Math.sin(leftAngle) * leftDist,
      });

      // Right eye center
      const rightEyeX = rect.left + 24;
      const rightEyeY = rect.top + 9;
      const rightAngle = Math.atan2(e.clientY - rightEyeY, e.clientX - rightEyeX);
      const rightDist = Math.min(2.5, Math.hypot(e.clientX - rightEyeX, e.clientY - rightEyeY) / 35);
      setRightPupil({
        x: Math.cos(rightAngle) * rightDist,
        y: Math.sin(rightAngle) * rightDist,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex items-center gap-1.5 px-2 py-0.5 select-none cursor-default group"
      title="Project Lab Mascot"
    >
      {/* Left Eye */}
      <div className="w-3.5 h-3.5 rounded-full border border-white/40 bg-black/60 flex items-center justify-center relative overflow-hidden transition-colors group-hover:border-white/70">
        <div
          className="w-1.5 h-1.5 rounded-full bg-white transition-transform duration-75 ease-out shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          style={{
            transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)`,
          }}
        />
      </div>

      {/* Subtle Smile */}
      <span className="text-[11px] text-white/50 font-mono -mt-0.5 leading-none select-none transition-colors group-hover:text-white/80">
        ‿
      </span>

      {/* Right Eye */}
      <div className="w-3.5 h-3.5 rounded-full border border-white/40 bg-black/60 flex items-center justify-center relative overflow-hidden transition-colors group-hover:border-white/70">
        <div
          className="w-1.5 h-1.5 rounded-full bg-white transition-transform duration-75 ease-out shadow-[0_0_4px_rgba(255,255,255,0.8)]"
          style={{
            transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)`,
          }}
        />
      </div>
    </div>
  );
}

/* ─── Filter Category Configuration ─────────────────────────────────────────── */
const FILTER_TABS = [
  { id: "All", label: "All Projects" },
  { id: "Python", label: "Python", icon: SiPython },
  { id: "ML", label: "ML", icon: Brain },
  { id: "AI / NLP", label: "AI / NLP", icon: Sparkles },
  { id: "Data", label: "Data", icon: Database },
  { id: "Web", label: "Web", icon: Globe },
] as const;

interface FeaturedProjectsProps {
  projects: Project[];
}

export function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const [activeTab, setActiveTab] = useState<string>("All");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ── Sanity projects directly (fallback demos only if Sanity is completely empty) ── */
  const displayProjects = useMemo(() => {
    if (projects && projects.length > 0) return projects;
    return [
      {
        _id: "demo-1",
        title: "AGENONE",
        shortDescription:
          "Experience the epitome of digital innovation with Agenone, a dynamic agency landing website meticulously crafted with Next.js and Tailwind.",
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        category: "Web",
        slug: "agenone",
      },
      {
        _id: "demo-2",
        title: "BIGFRIEND",
        shortDescription:
          "Embark on a journey with BigFriend, a collaborative community of communication agencies and consulting experts built for scale.",
        techStack: ["Python", "FastAPI", "PostgreSQL", "React"],
        category: "Python",
        slug: "bigfriend",
      },
    ] as Project[];
  }, [projects]);

  /* ── Filter logic ── */
  const filteredProjects = useMemo(() => {
    if (activeTab === "All" || activeTab === "All Projects") return displayProjects;

    const cat = activeTab.toLowerCase();

    return displayProjects.filter((p) => {
      // 1. Check direct category field
      if (p.category && p.category.toLowerCase().includes(cat)) return true;

      // 2. Check tech stack and full text
      const stack = (p.techStack || []).map((t) => t.toLowerCase());
      const title = (p.title || "").toLowerCase();
      const desc = (p.shortDescription || "").toLowerCase();
      const combined = `${title} ${desc} ${stack.join(" ")}`;

      if (activeTab === "Python") {
        return (
          stack.some((s) =>
            ["python", "fastapi", "django", "flask", "pytorch", "pandas", "numpy"].some((k) => s.includes(k))
          ) || combined.includes("python")
        );
      }

      if (activeTab === "ML") {
        return (
          stack.some((s) =>
            ["ml", "machine learning", "pytorch", "tensorflow", "scikit", "keras", "xgboost", "cv"].some((k) => s.includes(k))
          ) ||
          ["ml", "machine learning", "model", "prediction", "neural", "classification", "forecast"].some((k) => combined.includes(k))
        );
      }

      if (activeTab === "AI / NLP") {
        return (
          stack.some((s) =>
            ["ai", "nlp", "llm", "vision", "speech", "bert", "gpt", "transformer"].some((k) => s.includes(k))
          ) ||
          ["ai", "nlp", "llm", "chat", "language", "intelligence", "vision", "audio"].some((k) => combined.includes(k))
        );
      }

      if (activeTab === "Data") {
        return (
          stack.some((s) =>
            ["data", "sql", "postgresql", "mysql", "d3", "analytics", "warehouse", "etl", "pandas"].some((k) => s.includes(k))
          ) ||
          ["data", "bi", "analytics", "dashboard", "telemetry", "streaming", "pipeline"].some((k) => combined.includes(k))
        );
      }

      if (activeTab === "Web") {
        return (
          stack.some((s) =>
            ["next", "react", "web", "typescript", "javascript", "tailwind", "vite", "html"].some((k) => s.includes(k))
          ) ||
          ["web", "landing", "app", "dashboard", "client", "ui", "platform"].some((k) => combined.includes(k))
        );
      }

      return stack.some((s) => s.includes(cat)) || combined.includes(cat);
    });
  }, [displayProjects, activeTab]);

  return (
    <section
      id="featured-work"
      className="pt-4 pb-20 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 md:mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-3 text-white tracking-tight">
              Featured <span className="text-[#C83228D9]">Work</span>
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl">
              Selected work representing expertise in data science, ML/AI
              pipelines, and web systems.
            </p>
          </div>
          <Link
            href="/projects"
            className="hidden md:inline-flex items-center gap-2 text-sm text-white/80 hover:text-white font-mono transition-colors group"
          >
            <span>View all projects</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* ════════════════════════════════════════════
            GHOSTTY / PROJECT LAB TERMINAL WINDOW
           ════════════════════════════════════════════ */}
        <div className="w-full bg-[#0a0a0a] border border-[#202020] rounded-xl md:rounded-2xl overflow-hidden flex flex-col shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
          {/* ── 1. Top Bar: macOS Dots + "project lab" Title + Interactive Eyes (Deeper #121212) ── */}
          <div className="flex items-center justify-between bg-[#121212] px-4 py-2.5 border-b border-[#202020] relative select-none">
            {/* Left: 3 macOS window dots */}
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#383838] hover:bg-[#4a4a4a] transition-colors inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#383838] hover:bg-[#4a4a4a] transition-colors inline-block" />
              <span className="w-3 h-3 rounded-full bg-[#383838] hover:bg-[#4a4a4a] transition-colors inline-block" />
            </div>

            {/* Center: "project lab" title */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center pointer-events-none">
              <span className="font-mono text-xs sm:text-sm text-white/55 font-medium tracking-wide">
                project lab
              </span>
            </div>

            {/* Right: Interactive Eyes Mascot (Follows mouse cursor) */}
            <div className="flex items-center">
              <InteractiveTerminalEyes />
            </div>
          </div>

          {/* ── 2. Filter Bar: (All | Python | ML | AI / NLP | Data | Web) (Deeper #101010) ── */}
          <div className="flex items-center bg-[#101010] px-3.5 py-2 gap-1.5 sm:gap-2 overflow-x-auto border-b border-[#202020] scrollbar-none">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComp = "icon" in tab ? tab.icon : null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs sm:text-[13px] tracking-wide rounded-[3px] transition-all duration-200 cursor-pointer whitespace-nowrap outline-none ${
                    isActive
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-white/50 hover:text-white hover:bg-white/[0.06] font-normal"
                  }`}
                >
                  {IconComp && <IconComp className="w-3.5 h-3.5 shrink-0 opacity-80" />}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── 3. Project Grid Body with Clean Separation Gap (#0a0a0a container, #0C0C0C cards, 10px-12px gap) ── */}
          <div
            className="bg-[#0a0a0a] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            style={{
              maxHeight: isMobile ? 580 : 540,
            }}
          >
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] sm:gap-[12px] bg-[#0a0a0a] p-[10px] sm:p-[12px]">
                {filteredProjects.map((project) => {
                  const imageUrl = project.mainImage?.asset?._ref
                    ? urlFor(project.mainImage)
                        .width(800)
                        .height(480)
                        .fit("crop")
                        .url()
                    : undefined;

                  return (
                    <div
                      key={project._id}
                      className="w-full h-[290px] sm:h-[300px] lg:h-[310px]"
                    >
                      <TerminalProjectCard
                        title={project.title}
                        description={project.shortDescription ?? ""}
                        imageUrl={imageUrl}
                        href={`/projects/${encodeURIComponent((project.slug || "").trim())}`}
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center font-mono text-xs text-white/30 uppercase tracking-widest bg-[#0a0a0a]">
                No projects matched filter: {activeTab}
              </div>
            )}
          </div>

          {/* ── 4. Terminal Status Footer Bar (Deeper #101010) ── */}
          <div className="flex items-center justify-between bg-[#101010] border-t border-[#202020] px-4 py-2 text-xs font-mono select-none flex-wrap gap-2">
            {/* Left: Branch info + Navigation */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-[#27c93f] font-bold flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span>main</span>
              </span>

              <div className="flex items-center gap-3 text-white/40 text-[11px] sm:text-xs">
                <Link
                  href="/"
                  className="hover:text-white transition-colors"
                >
                  home
                </Link>
                <Link
                  href="/resume"
                  className="hover:text-white transition-colors"
                >
                  resume
                </Link>
                <Link
                  href="/projects"
                  className="text-white underline font-semibold"
                >
                  projects
                </Link>
                <Link
                  href="/blogs"
                  className="hover:text-white transition-colors"
                >
                  blogs
                </Link>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  contact
                </Link>
              </div>
            </div>

            {/* Right: View mode + Sunfi badge */}
            <div className="flex items-center gap-2.5">
              <span className="text-white/30 text-[11px] tracking-wider">-- VIEW --</span>
              <span className="bg-white text-black font-bold text-[10px] px-2 py-0.5 uppercase tracking-wider rounded-[2px]">
                Sunfi
              </span>
            </div>
          </div>
        </div>

        {/* Mobile View All Link */}
        <Link
          href="/projects"
          className="flex md:hidden items-center justify-center gap-2 text-sm text-white/90 hover:text-white font-mono transition-colors mt-6"
        >
          <span>View all projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
