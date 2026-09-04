"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";

// --- Single Work Area Block ---
function WorkAreaBlock({
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
      className="flex flex-col gap-2 lg:gap-3 min-w-0"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "clamp(22px, 3.1vw, 52px)",
          fontWeight: 800,
          lineHeight: 1.0,
          letterSpacing: "-0.03em",
          color: "#F5F2ED",
          margin: 0,
          textTransform: "uppercase",
        }}
      >
        {keyword}
      </h3>
      <div style={{ height: 1, background: "rgba(245,242,237,0.12)", width: "100%" }} />
      <p
        style={{
          fontFamily: "'Lexend', sans-serif",
          fontSize: "clamp(10.5px, 0.85vw, 13px)",
          fontWeight: 300,
          lineHeight: 1.65,
          letterSpacing: "0.025em",
          color: "rgba(245,242,237,0.6)",
          margin: 0,
          maxWidth: 280,
          textTransform: "uppercase",
        }}
      >
        {description}
      </p>
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 10,
          letterSpacing: "0.22em",
          color: "rgba(245,242,237,0.28)",
          marginTop: 2,
        }}
      >
        {index}
      </span>
    </motion.div>
  );
}

// --- Main Component ---
export function WorkPanel() {
  return (
    <div
      id="work"
      className="relative w-full h-full overflow-hidden bg-[#0a0a0a] text-[#F5F2ED]"
    >
      {/* ── Full-Bleed Background Image ─────────────────────────────────── */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src="/sunfi2.jpg"
            alt="Work background"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-[85%_75%] md:object-[center_75%]"
            style={{
              filter: "grayscale(20%) brightness(0.30) contrast(1.12)",
            }}
          />
        </div>
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.72) 50%, rgba(0,0,0,0.92) 100%)",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
              }}
            />
          </div>

          {/* ── Content Layer ─────────────────────────────────────────────── */}
          <div className="relative z-10 h-full flex flex-col justify-between px-6 lg:px-16 pt-16 lg:pt-20 pb-8 lg:pb-12 box-border">
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 600, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.3em" }}>
                My Work
              </span>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 600, color: "#C83228D9", textTransform: "uppercase", letterSpacing: "0.2em" }}>
                03 / WORK
              </span>
            </div>

            <div className="flex flex-col gap-6 lg:gap-8">
              <div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', var(--font-heading), sans-serif",
                    fontSize: "clamp(30px, 5.2vw, 96px)",
                    fontWeight: 800,
                    lineHeight: 0.92,
                    letterSpacing: "-0.035em",
                    color: "#F5F2ED",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  I Turn Ideas Into
                </h2>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', var(--font-heading), sans-serif",
                    fontSize: "clamp(30px, 5.2vw, 96px)",
                    fontWeight: 800,
                    lineHeight: 0.92,
                    letterSpacing: "-0.035em",
                    color: "#F5F2ED",
                    margin: 0,
                    textTransform: "uppercase",
                    paddingLeft: "clamp(0px, 3vw, 44px)",
                  }}
                >
                  <span style={{ color: "rgba(245,242,237,0.92)" }}>Systems</span>
                  <span style={{ color: "rgba(200,50,40,0.85)", fontStyle: "italic", fontWeight: 700 }}> That Work.</span>
                </h2>
              </div>

              <p
                style={{
                  fontFamily: "'Lexend', sans-serif",
                  fontSize: "clamp(12px, 1.05vw, 16px)",
                  fontWeight: 300,
                  lineHeight: 1.7,
                  letterSpacing: "0.01em",
                  color: "rgba(245,242,237,0.6)",
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                I work across data science, machine learning, AI, and software
                engineering — building practical systems that transform complex
                information into useful experiences.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-10 xl:gap-12 pb-1">
                <WorkAreaBlock
                  index="01"
                  keyword="Data."
                  description="Finding patterns, extracting meaning, and turning raw information into decisions."
                  delay={0.1}
                />
                <WorkAreaBlock
                  index="02"
                  keyword="Intelligence."
                  description="Building machine learning and AI systems that can reason, predict, and assist."
                  delay={0.2}
                />
                <WorkAreaBlock
                  index="03"
                  keyword="Product."
                  description="Turning ideas into reliable, usable products through modern engineering."
                  delay={0.3}
                />
              </div>
            </div>

            <motion.div
              className="border-t border-white/[0.10] pt-4 lg:pt-5 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.0, delay: 0.45 }}
            >
              <div className="flex flex-col gap-1.5">
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: 9,
                    letterSpacing: "0.28em",
                    color: "rgba(245,242,237,0.35)",
                    textTransform: "uppercase",
                  }}
                >
                  Currently Exploring
                </span>
                <p
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "clamp(16px, 2.2vw, 32px)",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.0,
                    color: "rgba(245,242,237,0.88)",
                    margin: 0,
                    textTransform: "uppercase",
                  }}
                >
                  AI x Data x Product
                </p>
                <p
                  style={{
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: "clamp(10px, 0.8vw, 12.5px)",
                    fontWeight: 300,
                    lineHeight: 1.7,
                    letterSpacing: "0.01em",
                    color: "rgba(245,242,237,0.42)",
                    margin: 0,
                    maxWidth: 440,
                  }}
                >
                  Exploring the space where intelligent systems, data, and thoughtful
                  interfaces come together.
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <div
                  style={{
                    height: 1,
                    background: "rgba(245,242,237,0.28)",
                    width: 64,
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: 9,
                    letterSpacing: "0.22em",
                    color: "rgba(245,242,237,0.28)",
                    textTransform: "uppercase",
                  }}
                >
                  Dhaka, BD
                </span>
              </div>
            </motion.div>
          </div>
    </div>
  );
}
