"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// ─── Single Keyword Block (UI matching image: large bold typography & clean text) ───
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
          fontSize: "clamp(24px, 3.6vw, 60px)",
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
          fontSize: "clamp(10px, 0.75vw, 12px)",
          fontWeight: 400,
          lineHeight: 1.45,
          letterSpacing: "0.03em",
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
      <div className="relative z-10 h-full flex flex-col justify-between px-4 sm:px-8 lg:px-16 pt-3 sm:pt-14 lg:pt-20 pb-3 sm:pb-8 lg:pb-12 box-border overflow-hidden">
        {/* ── TOP: Section Label ──────────────────────────────────────── */}
        <div className="flex justify-end items-center shrink-0 w-full">
          <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 600, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.2em" }}>
            02 / CHAPTER
          </span>
        </div>

        {/* ── MIDDLE: 4 Keyword Columns (BUILD. THINK. DESIGN. EVOLVE.) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 items-start my-1 sm:my-3 lg:my-0 shrink-0">
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

        {/* ── BOTTOM: Story Narrative, Journey Timeline & Philosophy Quote ── */}
        <motion.div
          className="border-t border-white/15 pt-3 sm:pt-4 lg:pt-4 flex flex-col gap-3 sm:gap-4 lg:gap-4 shrink-0 mt-2 sm:mt-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.35 }}
        >
          {/* 1. Paragraph */}
          <p
            style={{
              fontFamily: "'Lexend', sans-serif",
              fontSize: "clamp(12px, 1.05vw, 16px)",
              fontWeight: 300,
              lineHeight: 1.65,
              letterSpacing: "0.01em",
              color: "rgba(245,242,237,0.8)",
              margin: 0,
              maxWidth: 920,
            }}
          >
            I started with Python in 2022, building small web apps just to see numbers turn into charts on a screen. That curiosity turned into a full B.Sc. in Data Science at UIU — and along the way, small experiments became real systems: an award-winning Lost &amp; Found platform, a pipeline that scraped and structured <strong style={{ fontWeight: 700, color: "#F5F2ED" }}>6MB+</strong> of Bangladesh&apos;s real data-science job market data, and a transit management system now cutting resolution time by <strong style={{ fontWeight: 700, color: "#F5F2ED" }}>65%</strong>. Still based in Dhaka. Still building.
          </p>

          {/* 2. Timeline / Journey Strip */}
          <div className="relative pt-1">
            {/* Horizontal subtle guide line */}
            <div className="hidden sm:block absolute top-[15px] lg:top-[17px] left-0 right-0 h-[1px] bg-gradient-to-r from-white/15 via-[#C83228]/45 to-white/15" />

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2.5 lg:gap-4 relative z-10">
              {/* Point 1: 2022 */}
              <div className="flex flex-col items-start gap-1 sm:gap-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/40 border border-white/20 shrink-0" />
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "clamp(11px, 0.9vw, 14px)",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "#F5F2ED",
                    }}
                  >
                    2022
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: "clamp(10px, 0.75vw, 12px)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                    color: "rgba(245,242,237,0.65)",
                    lineHeight: 1.35,
                  }}
                >
                  Python &amp; Data Visualization
                </span>
              </div>

              {/* Point 2: 2023 */}
              <div className="flex flex-col items-start gap-1 sm:gap-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/40 border border-white/20 shrink-0" />
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "clamp(11px, 0.9vw, 14px)",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "#F5F2ED",
                    }}
                  >
                    2023
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: "clamp(10px, 0.75vw, 12px)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                    color: "rgba(245,242,237,0.65)",
                    lineHeight: 1.35,
                  }}
                >
                  B.Sc. in Data Science at UIU
                </span>
              </div>

              {/* Point 3: 2024 */}
              <div className="flex flex-col items-start gap-1 sm:gap-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-white/40 border border-white/20 shrink-0" />
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "clamp(11px, 0.9vw, 14px)",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "#F5F2ED",
                    }}
                  >
                    2024
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: "clamp(10px, 0.75vw, 12px)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                    color: "rgba(245,242,237,0.65)",
                    lineHeight: 1.35,
                  }}
                >
                  Solving Real-World Problems
                </span>
              </div>

              {/* Point 4: 2025 */}
              <div className="flex flex-col items-start gap-1 sm:gap-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#C83228] shadow-[0_0_8px_rgba(200,50,40,0.85)] shrink-0" />
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "clamp(11px, 0.9vw, 14px)",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "#F5F2ED",
                    }}
                  >
                    2025
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: "clamp(10px, 0.75vw, 12px)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                    color: "rgba(245,242,237,0.65)",
                    lineHeight: 1.35,
                  }}
                >
                  1st Runner-Up, OOP Project
                </span>
              </div>

              {/* Point 5: NOW */}
              <div className="flex flex-col items-start gap-1 sm:gap-1.5">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-[#C83228] shadow-[0_0_8px_rgba(200,50,40,0.95)] shrink-0" />
                  <span
                    style={{
                      fontFamily: "var(--font-mono, monospace)",
                      fontSize: "clamp(11px, 0.9vw, 14px)",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: "#C83228D9",
                    }}
                  >
                    NOW
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: "clamp(10px, 0.75vw, 12px)",
                    fontWeight: 300,
                    letterSpacing: "0.01em",
                    color: "rgba(245,242,237,0.65)",
                    lineHeight: 1.35,
                  }}
                >
                  Building AI-Powered Systems
                </span>
              </div>
            </div>
          </div>

          {/* 3. Personal Philosophy Quote Block */}
          <div className="pt-1">
            <blockquote
              style={{
                margin: 0,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(14px, 1.85vw, 26px)",
                fontWeight: 700,
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                color: "#F5F2ED",
              }}
            >
              <span className="text-white/90">&ldquo;I don&apos;t trust a system until it&apos;s been used by </span>
              <span style={{ color: "#C83228D9", fontStyle: "italic", fontWeight: 700 }}>
                someone who isn&apos;t me.&rdquo;
              </span>
            </blockquote>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
