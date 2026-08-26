"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { Trophy, Briefcase, Database } from "lucide-react";
import type { Profile } from "@/sanity/lib/types";

// ─── Scroll Fade Block Helper ────────────────────────────────────────────────
function ScrollFadeBlock({
  children,
  progress,
  range,
  className,
  style,
}: {
  children: React.ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  className?: string;
  style?: React.CSSProperties;
}) {
  const opacity = useTransform(progress, range, [0.75, 1]);
  const y = useTransform(progress, range, [8, 0]);

  return (
    <motion.div
      className={className}
      style={{
        ...style,
        opacity,
        y,
      }}
    >
      {children}
    </motion.div>
  );
}

// ─── Premium Editorial Identity Proof Card ───────────────────────────────────
function IdentityProofCard({
  icon: Icon,
  label,
  value,
  subtext,
  meta,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext: string;
  meta: string;
}) {
  return (
    <div className="group relative flex flex-col justify-between p-4 sm:p-4.5 rounded-xl bg-gradient-to-b from-[#131313] via-[#0E0E0E] to-[#080808] border border-white/[0.09] hover:border-[#C83228]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.7),0_0_24px_rgba(200,50,40,0.15)] transition-all duration-300 ease-out hover:-translate-y-1.5 overflow-hidden">
      {/* Top subtle light accent glow on hover */}
      <div className="pointer-events-none absolute -top-12 -right-12 w-28 h-28 bg-[#C83228]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top row: Glowing Icon Badge + Category Tag */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#C83228]/[0.10] border border-[#C83228]/30 text-[#C83228D9] group-hover:bg-[#C83228]/[0.22] group-hover:border-[#C83228]/50 group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(200,50,40,0.35)] transition-all duration-300">
          <Icon className="w-4 h-4" strokeWidth={2} />
        </div>
        <span
          className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.07] group-hover:border-white/[0.15] transition-colors"
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: 9.5,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: "#A1A1AA",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>

      {/* Middle: Main value & Supporting text */}
      <div className="my-0.5 z-10">
        <div
          style={{
            fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
            fontSize: "clamp(18px, 1.35vw, 22px)",
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
          }}
          className="group-hover:text-white transition-colors"
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
            fontSize: "clamp(11.5px, 0.8vw, 13px)",
            fontWeight: 500,
            lineHeight: 1.4,
            color: "#B4B4B8",
            marginTop: 3,
          }}
        >
          {subtext}
        </div>
      </div>

      {/* Bottom metadata */}
      <div
        className="mt-3 pt-2 border-t border-white/[0.07] z-10 flex items-center justify-between"
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: 9,
          letterSpacing: "0.1em",
          color: "#71717A",
          textTransform: "uppercase",
        }}
      >
        <span className="truncate">{meta}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#C83228]/50 group-hover:bg-[#C83228D9] group-hover:shadow-[0_0_6px_#C83228] transition-all shrink-0 ml-1.5" />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AboutPreview({ profile: _profile }: { profile: Profile | null }) {
  return (
    <div
      id="about"
      className="relative w-full h-full overflow-hidden bg-[#050505] text-[#F5F2ED]"
    >
      {/* Subtle noise grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

        {/* ── Full Width Split Grid ────────────────────────────────────────── */}
        <div className="relative z-10 h-full w-full flex flex-col lg:grid lg:grid-cols-[1fr_1px_1.15fr]">

          {/* ══════════════════════════════════════════════════════════════════
              LEFT COLUMN — Fullscreen Editorial Portrait with Cinematic Reveal
          ══════════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:block relative overflow-hidden h-full w-full">
            <div className="absolute inset-0">
              {/* Main Full Image with Luxury Lens Focus & Exposure Dissolve */}
              <motion.div
                initial={{ opacity: 0, scale: 1.06, filter: "blur(10px) brightness(0.55)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1.0)" }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src="/sazzadsunfi1.jpg"
                  alt="Khondoker Sazzad Sunfi"
                  fill
                  priority
                  unoptimized
                  sizes="50vw"
                  className="object-cover object-top"
                  style={{ filter: "grayscale(6%) contrast(1.06)" }}
                />
                {/* Dark editorial overlay gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(135deg, rgba(5,5,5,0.38) 0%, rgba(5,5,5,0.05) 50%, rgba(5,5,5,0.68) 100%)",
                  }}
                />
              </motion.div>

              {/* Framing Crosshairs with Staggered Entrance */}
              {(["tl", "tr", "bl", "br"] as const).map((pos, idx) => (
                <motion.div
                  key={pos}
                  initial={{ opacity: 0, scale: 0.4 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 + idx * 0.08, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    width: 20,
                    height: 20,
                    zIndex: 30,
                    top:    pos.startsWith("t") ? 20 : undefined,
                    bottom: pos.startsWith("b") ? 20 : undefined,
                    left:   pos.endsWith("l")   ? 20 : undefined,
                    right:  pos.endsWith("r")   ? 20 : undefined,
                    borderTop:    pos.startsWith("t") ? "1px solid rgba(245,242,237,0.35)" : undefined,
                    borderBottom: pos.startsWith("b") ? "1px solid rgba(245,242,237,0.35)" : undefined,
                    borderLeft:   pos.endsWith("l")   ? "1px solid rgba(245,242,237,0.35)" : undefined,
                    borderRight:  pos.endsWith("r")   ? "1px solid rgba(245,242,237,0.35)" : undefined,
                  }}
                />
              ))}

              {/* Photo Caption with Smooth Slide */}
              <motion.div
                initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                style={{ position: "absolute", bottom: 24, left: 24, zIndex: 30 }}
              >
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    color: "rgba(245,242,237,0.7)",
                    textTransform: "uppercase",
                  }}
                >
                  Khondoker Sazzad Sunfi
                </span>
                <span
                  style={{
                    display: "block",
                    marginTop: 3,
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: 9,
                    letterSpacing: "0.2em",
                    color: "rgba(245,242,237,0.4)",
                    textTransform: "uppercase",
                  }}
                >
                  Dhaka, Bangladesh
                </span>
              </motion.div>
            </div>
          </div>

          {/* ── Vertical Hairline Divider ────────────────────────────────────── */}
          <div
            className="hidden lg:block h-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(245,242,237,0.18) 15%, rgba(245,242,237,0.18) 85%, transparent 100%)",
            }}
          />

          {/* ══════════════════════════════════════════════════════════════════
              RIGHT COLUMN — High-Impact Quicksand Editorial Layout with Masked Reveals
          ══════════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col justify-start h-full w-full px-8 lg:px-16 pt-[85px] lg:pt-[95px] pb-8 box-border gap-0">

            {/* ── TOP: Category Label & Index with Tracking Expansion ─────── */}
            <div className="flex justify-between items-center w-full shrink-0">
              <motion.span
                initial={{ opacity: 0, x: -14, letterSpacing: "0.18em" }}
                whileInView={{ opacity: 1, x: 0, letterSpacing: "0.3em" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 11,
                  fontWeight: 500,
                  color: "rgba(245,242,237,0.55)",
                  textTransform: "uppercase",
                }}
              >
                ABOUT ME
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: 14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: "rgba(245,242,237,0.35)",
                  textTransform: "uppercase",
                }}
              >
                01 / IDENTITY
              </motion.span>
            </div>

            {/* ── MIDDLE: Headline, Description & 3 Premium Cards ────────── */}
            <div className="flex flex-col justify-center py-2 lg:py-3">

              {/* Mobile Portrait with Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:hidden relative w-full aspect-[16/9] mb-4 rounded-xl overflow-hidden"
              >
                <Image
                  src="/sazzadsunfi1.jpg"
                  alt="Sunfi Islam"
                  fill
                  priority
                  unoptimized
                  sizes="95vw"
                  className="object-cover object-top"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(to bottom, transparent 40%, rgba(5,5,5,0.7) 100%)",
                  }}
                />
              </motion.div>

              {/* High-End Editorial Masked Line Headline Reveal */}
              <motion.h2
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.12,
                      delayChildren: 0.05,
                    },
                  },
                }}
                style={{
                  margin: 0,
                  fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
                  fontSize: "clamp(30px, 4.0vw, 56px)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "#FFFFFF",
                }}
              >
                <span className="block overflow-hidden pb-1">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "115%", opacity: 0 },
                      visible: {
                        y: "0%",
                        opacity: 1,
                        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    Crafting Intelligent
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-1">
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "115%", opacity: 0 },
                      visible: {
                        y: "0%",
                        opacity: 1,
                        transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    Systems with{" "}
                    <span
                      style={{
                        color: "#C83228D9",
                        fontWeight: 700,
                      }}
                    >
                      Passion
                    </span>
                  </motion.span>
                </span>
              </motion.h2>

              {/* Supporting Statement with Soft Blur-to-Crisp Reveal */}
              <motion.div
                initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ marginTop: "clamp(12px, 1.6vh, 18px)" }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
                    fontSize: "clamp(14px, 1.1vw, 16px)",
                    fontWeight: 400,
                    lineHeight: 1.7,
                    letterSpacing: "0.01em",
                    color: "#A0A0A0",
                    margin: 0,
                    maxWidth: 560,
                  }}
                >
                  I&apos;m a Data Science and AI enthusiast who loves turning messy,
                  real-world data into clear insights and production-ready
                  intelligent systems. Currently pursuing my B.Sc. in Data
                  Science at United International University, I focus on building
                  end-to-end solutions — from robust data pipelines and machine
                  learning models to interactive dashboards that actually get
                  used.
                </p>

                {/* Paragraph 2 */}
                <p
                  style={{
                    fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
                    fontSize: "clamp(14px, 1.1vw, 16px)",
                    fontWeight: 400,
                    lineHeight: 1.7,
                    letterSpacing: "0.01em",
                    color: "#A0A0A0",
                    margin: 0,
                    marginTop: "clamp(10px, 1.2vh, 14px)",
                    maxWidth: 560,
                  }}
                >
                  My toolkit spans{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Python</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Machine Learning</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Time Series</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>NLP/LLMs</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Streamlit</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>FastAPI</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>MySQL/PostgreSQL</strong>,
                  and modern full-stack tools (
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Next.js</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>JavaScript</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>TypeScript</strong>,{" "}
                  <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Tailwind</strong>
                  ). I enjoy designing scalable architectures, optimizing data
                  workflows, and creating applications that solve real problems.
                </p>
              </motion.div>

              {/* ── 3 Premium Identity Proof Cards with Staggered Cascading Reveal ── */}
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.12,
                      delayChildren: 0.35,
                    },
                  },
                }}
                style={{ marginTop: "clamp(16px, 2.2vh, 26px)" }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 lg:gap-3">
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 26, scale: 0.96 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    <IdentityProofCard
                      icon={Trophy}
                      label="AWARD"
                      value="1st Runner Up"
                      subtext="OOP Project Competition"
                      meta="United International University · 2025"
                    />
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 26, scale: 0.96 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    <IdentityProofCard
                      icon={Briefcase}
                      label="EXPERIENCE"
                      value="3+ Years"
                      subtext="Hands-on Development"
                      meta="Data · ML · AI"
                    />
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 26, scale: 0.96 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                  >
                    <IdentityProofCard
                      icon={Database}
                      label="DATA"
                      value="500+ Datasets"
                      subtext="Explored & Analyzed"
                      meta="Data Science · Visualization · ML"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* ── BOTTOM: Lower Closing Statement with Gentle Fade ─────────── */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="w-full shrink-0"
              style={{ marginTop: "clamp(10px, 1.5vh, 18px)" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
                  fontSize: "clamp(11px, 0.8vw, 12.5px)",
                  fontWeight: 400,
                  lineHeight: 1.65,
                  letterSpacing: "0.01em",
                  color: "#8E8E93",
                  margin: 0,
                  maxWidth: 580,
                }}
              >
                I&apos;m constantly exploring Generative AI, data engineering,
                and practical MLOps, and I&apos;m always looking for
                opportunities to build things that matter.
              </p>
            </motion.div>

          </div>
        </div>
    </div>
  );
}
