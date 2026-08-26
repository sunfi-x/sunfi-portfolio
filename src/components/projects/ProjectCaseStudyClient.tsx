"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Clock,
  Sparkles,
  Layers,
  ShieldAlert,
  Cpu,
  Zap,
  CheckCircle2,
  ChevronRight,
  Share2,
  Check,
  Award,
} from "lucide-react";
import { FaGithub, FaXTwitter } from "react-icons/fa6";
import { urlFor } from "@/sanity/lib/image";
import type { Project } from "@/sanity/lib/types";
import { getProjectDetailData } from "@/data/project-details-data";
import { ProjectImageGallery } from "./ProjectImageGallery";
import { ArchitectureVisualizer } from "./ArchitectureVisualizer";

interface ProjectCaseStudyProps {
  project: Project;
}

export function ProjectCaseStudyClient({ project }: ProjectCaseStudyProps) {
  const [activeSection, setActiveSection] = useState<string>("summary");
  const [linkCopied, setLinkCopied] = useState<boolean>(false);

  // Fetch enriched case study data for the project (with fallback)
  const detailData = useMemo(() => {
    return getProjectDetailData(project.slug || "");
  }, [project.slug]);

  const sections = useMemo(() => {
    return [
      { id: "summary", label: "Executive Summary" },
      { id: "problem", label: "Problem & Motivation" },
      { id: "architecture", label: "System Architecture" },
      { id: "tech-stack", label: "Tech Stack & Tools" },
      { id: "challenges", label: "Engineering Breakthroughs" },
      { id: "impact", label: "Impact & Benchmarks" },
      { id: "gallery", label: "Project Gallery" },
    ];
  }, []);

  // IntersectionObserver to highlight active TOC item on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0.1 }
    );

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const liveUrl = project.liveUrl?.trim() || detailData.liveUrl;
  const githubUrl = project.githubUrl?.trim() || detailData.githubUrl;
  const imageUrl = project.mainImage?.asset?._ref
    ? urlFor(project.mainImage).width(1200).height(675).fit("crop").url()
    : undefined;

  const topPills = useMemo(() => {
    const list: string[] = [];
    if (project.category && !list.includes(project.category)) {
      list.push(project.category);
    }

    const techArray = Array.isArray(project.techStack)
      ? project.techStack
      : (project.techStack ? [project.techStack] : []);

    techArray.forEach((t) => {
      const cleanTags = t
        .replace(/^([^:]+):\s*/, "")
        .split(",")
        .map((tag) => tag.trim());

      cleanTags.forEach((tag) => {
        const firstWord = tag.split(" ")[0];
        if (firstWord && !list.includes(firstWord) && list.length < 7) {
          list.push(firstWord);
        }
      });
    });

    if (list.length <= 1) {
      detailData.techCategories.forEach((cat) => {
        cat.items.forEach((item) => {
          const clean = item.split(",")[0].trim();
          if (clean && !list.includes(clean) && list.length < 7) {
            list.push(clean);
          }
        });
      });
    }

    return list.slice(0, 6);
  }, [project.category, project.techStack, detailData.techCategories]);

  return (
    <div className="bg-[#000000] min-h-screen text-[#F5F5F5] font-sans selection:bg-white/15 selection:text-white pb-32 pt-4 relative">
      
      {/* Background Noise Overlay */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-[0.015] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* ── 1. Top Breadcrumb Navigation ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono text-gray-400 hover:text-white transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Back to projects</span>
          </Link>
        </motion.div>

        {/* ── 2. Tag Pills ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {topPills.map((tech, i) => (
            <span
              key={i}
              className="px-3.5 py-1 bg-[#141416] border border-white/[0.08] rounded-full text-xs font-mono text-gray-300 tracking-wide"
            >
              {tech}
            </span>
          ))}
        </motion.div>

        {/* ── 3. Main Project Title ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-4xl mb-6"
        >
          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15]"
            style={{ fontFamily: "'Quicksand', sans-serif" }}
          >
            {project.title}
          </h1>
        </motion.div>

        {/* ── 4. Subtitle Lead Paragraph ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mb-8"
        >
          <p className="text-gray-300 text-base sm:text-lg md:text-xl font-light leading-relaxed">
            {detailData.overview || project.shortDescription}
          </p>
        </motion.div>

        {/* ── 5. Action Buttons (View Live & Source Code) — Green #22C55E button ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="flex flex-wrap items-center gap-4 mb-10"
        >
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-[#22C55E] hover:bg-[#16a34a] text-black font-semibold text-xs font-mono flex items-center gap-2.5 transition-all duration-200"
            >
              <ExternalLink className="w-4 h-4 text-black" />
              <span>View Live App</span>
            </a>
          )}
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="px-6 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.12] text-white font-medium text-xs font-mono flex items-center gap-2.5 transition-all duration-200 hover:border-white/30"
            >
              <FaGithub className="w-4 h-4" />
              <span>Source Code</span>
            </a>
          )}
        </motion.div>

        {/* ── 6. Metadata Bar (Author, Dates, Status) ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center gap-6 py-4 border-y border-white/[0.08] text-xs sm:text-sm text-gray-400 font-mono mb-12"
        >
          <div className="flex items-center gap-2.5">
            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-white/20">
              <Image
                src="/sazzadsunfi.jpg"
                alt="Khondoker Sazzad Sunfi"
                fill
                className="object-cover"
              />
            </div>
            <span className="text-gray-200 font-semibold">Khondoker Sazzad Sunfi</span>
          </div>

          <span className="text-white/20">•</span>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500" />
            <span>{detailData.publishedDate}</span>
          </div>

          <span className="text-white/20">•</span>

          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-500" />
            <span>Updated {detailData.updatedDate}</span>
          </div>

          <span className="text-white/20">•</span>

          <div className="flex items-center gap-1.5">
            <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-white text-[10px] font-bold uppercase tracking-wider border border-white/10 font-mono">
              {detailData.statusBadge}
            </span>
          </div>
        </motion.div>

        {/* ── 7. TWO-COLUMN LAYOUT: Content (Left 8 cols) + Sticky TOC (Right 4 cols) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* ════════════════════════════════════════════
              LEFT COLUMN: Case Study Presentation
             ════════════════════════════════════════════ */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* --- SECTION 1: EXECUTIVE SUMMARY --- */}
            <section id="summary" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <Sparkles className="w-5 h-5 text-gray-300" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Executive Summary
                </h2>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {detailData.executiveSummary.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.08] flex items-start gap-3 text-sm text-gray-300 font-light leading-relaxed hover:border-white/20 transition-all duration-300"
                  >
                    <Award className="w-4 h-4 text-[#60A5FA] shrink-0 mt-1" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION 2: PROBLEM & MOTIVATION --- */}
            <section id="problem" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  The Problem &amp; Motivation
                </h2>
              </div>
              
              <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-red-500/20 text-gray-300 leading-relaxed font-light relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500/80" />
                <p className="text-base sm:text-lg text-gray-200">
                  {detailData.problemStatement}
                </p>
              </div>
            </section>

            {/* --- SECTION 3: SYSTEM ARCHITECTURE & DATA FLOW --- */}
            <section id="architecture" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <Layers className="w-5 h-5 text-sky-400" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  System Architecture &amp; Data Flow
                </h2>
              </div>

              {/* Architecture Visualizer */}
              <ArchitectureVisualizer
                asciiDiagram={detailData.architecture.ascii}
                description={detailData.architecture.description}
                flowNodes={detailData.architecture.flowNodes}
              />
            </section>

            {/* --- SECTION 4: TECH STACK & INFRASTRUCTURE --- */}
            <section id="tech-stack" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <Cpu className="w-5 h-5 text-purple-400" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Technology Stack &amp; Infrastructure
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {detailData.techCategories.map((catGroup, idx) => (
                  <div
                    key={idx}
                    className="p-4 sm:p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] flex items-center justify-between font-mono text-xs sm:text-sm hover:border-white/20 transition-all duration-300"
                  >
                    <div className="text-gray-200 leading-relaxed pr-2">
                      <span className="text-white font-bold">{catGroup.category}: </span>
                      <span className="text-gray-300 font-normal">{catGroup.items.join(", ")}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded bg-white/[0.06] text-white border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider shrink-0 ml-3">
                      ENGINEERED
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION 5: ENGINEERING BREAKTHROUGHS --- */}
            <section id="challenges" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <Zap className="w-5 h-5 text-amber-400" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Engineering Breakthroughs
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {detailData.breakthroughs.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-3 font-sans hover:border-white/20 transition-all duration-300"
                  >
                    <h3 className="text-base font-bold text-white flex items-center gap-2 font-quicksand">
                      <span className="text-red-400 font-mono text-xs">0{idx + 1}.</span>
                      <span>{item.title}</span>
                    </h3>
                    
                    <div className="space-y-2 text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                      <p>
                        <strong className="text-red-400 font-mono text-xs uppercase mr-2">Challenge:</strong>
                        {item.challenge}
                      </p>
                      <p>
                        <strong className="text-sky-400 font-mono text-xs uppercase mr-2">Engineered Solution:</strong>
                        {item.solution}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* --- SECTION 6: MEASURABLE IMPACT & BENCHMARKS (Reverted back to clean dark / blue) --- */}
            <section id="impact" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <CheckCircle2 className="w-5 h-5 text-[#60A5FA]" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Measurable Impact &amp; Benchmarks
                </h2>
              </div>

              <div className="p-6 sm:p-8 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] text-gray-300 font-sans text-base sm:text-lg leading-relaxed flex items-start gap-4 hover:border-white/20 transition-all duration-300">
                <CheckCircle2 className="w-6 h-6 text-[#60A5FA] shrink-0 mt-1" />
                <div>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-2">
                    VERIFIED PRODUCTION OUTCOME
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    {detailData.impactMetrics.map((metric, idx) => (
                      <div key={idx} className="space-y-1">
                        <span className="text-2xl font-extrabold text-white font-mono block">
                          {metric.value}
                        </span>
                        <span className="text-xs font-bold text-gray-300 font-mono uppercase block">
                          {metric.label}
                        </span>
                        <span className="text-[11px] text-gray-400 font-light block leading-tight">
                          {metric.detail}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* --- SECTION 7: MULTI-IMAGE GALLERY --- */}
            <section id="gallery" className="scroll-mt-32 space-y-6">
              <div className="flex items-center gap-3 border-b border-white/[0.08] pb-4">
                <Sparkles className="w-5 h-5 text-gray-300" />
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Project Gallery &amp; Screenshots
                </h2>
              </div>

              <ProjectImageGallery
                galleryItems={detailData.gallery}
                fallbackImage={imageUrl}
                projectTitle={project.title}
              />
            </section>

            {/* ════════════════════════════════════════════════════
                PAGE BOTTOM ACTION BAR
               ════════════════════════════════════════════════════ */}

            {/* GITHUB REPO & BADGES */}
            <div className="pt-8 border-t border-white/[0.08] space-y-4 font-mono text-sm">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#60A5FA] hover:text-[#93C5FD] font-bold text-base block underline decoration-[#60A5FA]/40 hover:decoration-[#60A5FA] transition-all"
                >
                  {githubUrl.replace(/^https?:\/\//, "")}
                </a>
              )}

              <div className="flex flex-wrap gap-2.5 pt-1">
                <span className="px-3 py-1 rounded-full bg-white/[0.04] text-white border border-white/[0.08] text-xs font-semibold flex items-center gap-1.5">
                  <FaGithub className="w-3.5 h-3.5" /> CI <span className="text-gray-400 font-normal">passing</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold flex items-center gap-1.5">
                  <FaGithub className="w-3.5 h-3.5" /> release <span className="text-blue-300 font-normal">v1.0.0</span>
                </span>
              </div>
            </div>

            {/* SHARE & ACTION BUTTONS */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/[0.08]">
              {/* Left: Share buttons */}
              <div className="flex items-center gap-3 font-mono text-xs text-gray-400">
                <span>Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Share on X / Twitter"
                  className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
                <button
                  onClick={handleCopyLink}
                  aria-label="Copy link"
                  className="p-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.08] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4 text-[#60A5FA]" />
                      <span className="text-[#60A5FA] text-[10px]">Copied!</span>
                    </>
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Right: Action Buttons — Green #22C55E button */}
              <div className="flex items-center gap-3 font-mono">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-5 py-2.5 rounded-full bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold text-xs flex items-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-black" />
                    <span>Try it out</span>
                  </a>
                )}
                <Link
                  href="/projects"
                  className="px-5 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 hover:text-white font-medium text-xs flex items-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>All Projects</span>
                </Link>
              </div>
            </div>

            {/* CALLOUT CARD — Green #22C55E button */}
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0f0f0f] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white/20 shrink-0 bg-white/10">
                <Image
                  src="/sazzadsunfi.jpg"
                  alt="Khondoker Sazzad Sunfi"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="space-y-3 flex-grow">
                <h3
                  className="text-xl sm:text-2xl font-bold text-white tracking-tight"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  Interested in this project?
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
                  Feel free to explore the source code, try the live demo, or reach out if you&apos;d like to collaborate on machine learning or web architecture.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2 font-mono">
                  <Link
                    href="/contact"
                    className="px-5 py-2.5 rounded-full bg-[#22C55E] hover:bg-[#16a34a] text-black font-bold text-xs transition-all"
                  >
                    Get in Touch
                  </Link>
                  <Link
                    href="/projects"
                    className="px-5 py-2.5 text-gray-300 hover:text-white font-medium text-xs transition-all hover:underline"
                  >
                    More Projects
                  </Link>
                </div>
              </div>
            </div>

          </div>

          {/* ════════════════════════════════════════════
              RIGHT COLUMN: Sticky "ON THIS PAGE" Table of Contents
             ════════════════════════════════════════════ */}
          <aside className="lg:col-span-4 sticky top-32 space-y-8 hidden lg:block">
            <div className="p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.08] space-y-4">
              <h3 className="font-mono text-xs uppercase tracking-widest text-gray-400 font-semibold border-b border-white/[0.06] pb-3">
                On This Page
              </h3>

              <nav className="flex flex-col gap-1.5 font-mono text-xs">
                {sections.map(({ id, label }) => {
                  const isActive = activeSection === id;
                  return (
                    <button
                      key={id}
                      onClick={() => scrollTo(id)}
                      className={`text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center justify-between cursor-pointer ${
                        isActive
                          ? "bg-[#212A37] text-white font-bold border-l-2 border-[#60A5FA] pl-2.5"
                          : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span>{label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-[#60A5FA]" />}
                    </button>
                  );
                })}
              </nav>

              {/* Action Sidebar Footer — Green #22C55E button */}
              <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-2">
                {liveUrl && (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#22C55E] hover:bg-[#16a34a] text-black font-semibold text-xs font-mono flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-black" />
                    <span>Launch Live App</span>
                  </a>
                )}
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-gray-300 font-medium text-xs font-mono flex items-center justify-center gap-2 transition-all"
                  >
                    <FaGithub className="w-3.5 h-3.5" />
                    <span>Source Repository</span>
                  </a>
                )}
              </div>
            </div>
          </aside>

        </div>

      </div>
    </div>
  );
}
