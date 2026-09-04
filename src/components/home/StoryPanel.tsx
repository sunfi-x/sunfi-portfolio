"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// ─── Single Keyword Block ──────────────────────────────────────────────────
function KeywordBlock({
  index,
  keyword,
  description,
  delay,
}: {
  index: string;
  keyword: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      className="flex flex-col gap-2.5 sm:gap-3 min-w-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(28px, 4.2vw, 68px)",
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          color: "#FFFFFF",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        {keyword}
      </h3>
      <p
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "clamp(10px, 0.78vw, 12px)",
          fontWeight: 400,
          lineHeight: 1.5,
          letterSpacing: "0.04em",
          color: "rgba(245,242,237,0.7)",
          margin: 0,
          textTransform: "uppercase",
          maxWidth: 260,
        }}
      >
        {description}
      </p>
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "rgba(245,242,237,0.35)",
          marginTop: 2,
        }}
      >
        {index}
      </span>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StoryPanel() {
  return (
    <div
      id="story"
      className="relative w-full h-full overflow-hidden bg-[#0a0a0a] text-[#F5F2ED]"
    >
      {/* ── Full-Bleed Background Image ─────────────────────────────────── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src="/sunfi1.jpg"
            alt="Story background"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-top"
            style={{ filter: "grayscale(15%) brightness(0.38) contrast(1.1)" }}
          />
        </div>

        {/* Dark Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.65) 45%, rgba(0,0,0,0.9) 100%)",
          }}
        />

        {/* Subtle Noise Texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Content Layer ─────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-between px-6 lg:px-16 pt-16 lg:pt-20 pb-8 lg:pb-12 box-border">
        {/* ── TOP: Section Label ──────────────────────────────────────── */}
        <div className="flex justify-between items-center w-full shrink-0">
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 11,
              fontWeight: 500,
              color: "rgba(245,242,237,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.3em",
            }}
          >
            MY STORY
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: 11,
              fontWeight: 500,
              color: "rgba(245,242,237,0.5)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
            }}
          >
            02 / CHAPTER
          </span>
        </div>

        {/* ── MIDDLE: 4 Keyword Columns (BUILD. THINK. DESIGN. EVOLVE.) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 items-start my-auto">
          <KeywordBlock
            index="01"
            keyword="BUILD."
            description="I BUILD AI-POWERED SYSTEMS AND DATA PIPELINES THAT TURN RAW COMPLEXITY INTO CLARITY."
            delay={0.1}
          />
          <KeywordBlock
            index="02"
            keyword="THINK."
            description="EVERY PROJECT STARTS WITH FIRST PRINCIPLES — UNDERSTANDING THE PROBLEM BEFORE WRITING A SINGLE LINE."
            delay={0.2}
          />
          <KeywordBlock
            index="03"
            keyword="DESIGN."
            description="I BELIEVE TECHNICAL IDEAS DESERVE BEAUTIFUL PRESENTATION. DATA WITHOUT DESIGN IS JUST NOISE."
            delay={0.3}
          />
          <KeywordBlock
            index="04"
            keyword="EVOLVE."
            description="I'M ALWAYS LEARNING — NEW MODELS, NEW TOOLS, NEW WAYS OF SEEING THE WORLD THROUGH DATA."
            delay={0.4}
          />
        </div>

        {/* ── BOTTOM: Horizontal Divider & Narrative Paragraph ── */}
        <motion.div
          className="flex flex-col gap-3 sm:gap-4 shrink-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div style={{ height: 1, backgroundColor: "rgba(245,242,237,0.15)", width: "100%" }} />
          <p
            style={{
              fontFamily: "'Lexend', sans-serif",
              fontSize: "clamp(11px, 0.95vw, 15px)",
              fontWeight: 300,
              lineHeight: 1.6,
              color: "rgba(245,242,237,0.75)",
              margin: 0,
              maxWidth: 960,
            }}
          >
            I&apos;m Khondoker Sazzad Sunfi — a Data Science student from Dhaka, Bangladesh, working at the intersection of machine learning, software engineering, and visual storytelling. I don&apos;t just run models; I craft systems that make sense of the world. Each project is an attempt to communicate something true — through clean code, intelligent pipelines, and intentional design.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
