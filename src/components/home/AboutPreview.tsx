"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Briefcase, Database } from "lucide-react";
import type { Profile } from "@/sanity/lib/types";

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
    <div className="group relative flex flex-col justify-between p-2 sm:p-4 rounded-xl bg-gradient-to-b from-[#131313] via-[#0E0E0E] to-[#080808] border border-white/[0.09] hover:border-[#C83228]/40 hover:shadow-[0_12px_28px_rgba(0,0,0,0.7),0_0_24px_rgba(200,50,40,0.15)] transition-all duration-300 ease-out hover:-translate-y-1 overflow-hidden">
      <div className="pointer-events-none absolute -top-12 -right-12 w-28 h-28 bg-[#C83228]/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Top row: Icon + Label */}
      <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-3 z-10">
        <div className="flex items-center justify-center w-6 sm:w-8 h-6 sm:h-8 rounded-lg bg-[#C83228]/[0.10] border border-[#C83228]/30 text-[#C83228D9] group-hover:bg-[#C83228]/[0.22] transition-all duration-300">
          <Icon className="w-3 sm:w-4 h-3 sm:h-4" strokeWidth={2} />
        </div>
        <span
          className="px-1.5 sm:px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.07]"
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "clamp(7.5px, 0.7vw, 9.5px)",
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: "#A1A1AA",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </div>

      {/* Value & subtext */}
      <div className="my-0.5 z-10">
        <div
          style={{
            fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
            fontSize: "clamp(11px, 1.25vw, 22px)",
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            color: "#FFFFFF",
          }}
          className="group-hover:text-white transition-colors truncate"
        >
          {value}
        </div>
        <div
          style={{
            fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif",
            fontSize: "clamp(9px, 0.8vw, 13px)",
            fontWeight: 500,
            lineHeight: 1.3,
            color: "#B4B4B8",
            marginTop: 2,
          }}
          className="truncate"
        >
          {subtext}
        </div>
      </div>

      {/* Bottom meta */}
      <div
        className="mt-1.5 sm:mt-3 pt-1 sm:pt-2 border-t border-white/[0.07] z-10 flex items-center justify-between"
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "clamp(7.5px, 0.7vw, 9px)",
          letterSpacing: "0.08em",
          color: "#71717A",
          textTransform: "uppercase",
        }}
      >
        <span className="truncate">{meta}</span>
        <span className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-[#C83228]/50 group-hover:bg-[#C83228D9] shrink-0 ml-1" />
      </div>
    </div>
  );
}

const CARDS = [
  { icon: Trophy,   label: "AWARD",      value: "1st Runner Up",  subtext: "OOP Competition", meta: "UIU · 2025"     },
  { icon: Briefcase,label: "EXPERIENCE", value: "3+ Years",       subtext: "Hands-on Dev",    meta: "Data · ML · AI" },
  { icon: Database, label: "DATA",       value: "500+ Datasets",  subtext: "Explored",        meta: "DS · ML · Viz"  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export function AboutPreview({ profile: _profile }: { profile: Profile | null }) {
  return (
    <div
      id="about"
      className="relative w-full h-full overflow-hidden bg-[#050505] text-[#F5F2ED]"
    >
      {/* Grain overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='250' height='250'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='250' height='250' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ═══════════════════════════════════════════════
          DESKTOP — Split two-column grid (lg+)
      ═══════════════════════════════════════════════ */}
      <div className="hidden lg:grid lg:grid-cols-[1fr_1px_1.15fr] relative z-10 h-full w-full">

        {/* LEFT — full-bleed editorial portrait */}
        <div className="relative overflow-hidden h-full w-full">
          <div className="absolute inset-0">
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
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(5,5,5,0.38) 0%, rgba(5,5,5,0.05) 50%, rgba(5,5,5,0.68) 100%)" }} />
            </motion.div>

            {/* Corner crosshairs */}
            {(["tl","tr","bl","br"] as const).map((pos, idx) => (
              <motion.div
                key={pos}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + idx * 0.08, ease: "easeOut" }}
                style={{
                  position: "absolute", width: 20, height: 20, zIndex: 30,
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

            {/* Caption */}
            <motion.div
              initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "absolute", bottom: 24, left: 24, zIndex: 30 }}
            >
              <span style={{ display: "block", fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.24em", color: "rgba(245,242,237,0.7)", textTransform: "uppercase" }}>
                Khondoker Sazzad Sunfi
              </span>
              <span style={{ display: "block", marginTop: 3, fontFamily: "var(--font-mono, monospace)", fontSize: 9, letterSpacing: "0.2em", color: "rgba(245,242,237,0.4)", textTransform: "uppercase" }}>
                Dhaka, Bangladesh
              </span>
            </motion.div>
          </div>
        </div>

        {/* Hairline divider */}
        <div style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(245,242,237,0.18) 15%, rgba(245,242,237,0.18) 85%, transparent 100%)" }} />

        {/* RIGHT — text content */}
        <div className="flex flex-col justify-start gap-4 h-full w-full px-16 pt-[95px] pb-8 box-border overflow-hidden">

          {/* Label row */}
          <div className="flex justify-between items-center w-full shrink-0">
            <motion.span initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, fontWeight: 500, color: "rgba(245,242,237,0.55)", textTransform: "uppercase", letterSpacing: "0.3em" }}>
              ABOUT ME
            </motion.span>
            <motion.span initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 11, letterSpacing: "0.2em", color: "rgba(245,242,237,0.35)", textTransform: "uppercase" }}>
              01 / IDENTITY
            </motion.span>
          </div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ margin: 0, fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(20px, 3.6vw, 56px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: "#FFFFFF" }}
            className="shrink-0"
          >
            Crafting Intelligent Systems with{" "}
            <span style={{ color: "#C83228D9", fontWeight: 700 }}>Passion</span>
          </motion.h2>

          {/* Bio + Toolkit */}
          <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.85, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col gap-2 shrink-0">
            <p style={{ fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(11px, 1.0vw, 16px)", fontWeight: 400, lineHeight: 1.45, color: "#A0A0A0", margin: 0, maxWidth: 560 }}>
              I&apos;m a Data Science &amp; AI enthusiast at UIU turning real-world data into clear insights and production-ready intelligent systems — building robust data pipelines, ML models, and interactive dashboards.
            </p>
            <p style={{ fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(10.5px, 0.95vw, 15px)", fontWeight: 400, lineHeight: 1.4, color: "#A0A0A0", margin: 0, maxWidth: 560 }}>
              My toolkit spans <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Python</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Machine Learning</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Time Series</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>NLP/LLMs</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Streamlit</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>FastAPI</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>MySQL/PostgreSQL</strong>, and modern full-stack tools (<strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Next.js</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>JavaScript</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>TypeScript</strong>, <strong style={{ fontWeight: 700, color: "#C8C8C8" }}>Tailwind</strong>). I enjoy designing scalable architectures and optimizing data workflows.
            </p>
          </motion.div>

          {/* Cards */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.35 } } }} className="shrink-0">
            <div className="grid grid-cols-3 gap-3">
              {CARDS.map((card) => (
                <motion.div key={card.label} variants={{ hidden: { opacity: 0, y: 20, scale: 0.96 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } } }}>
                  <IdentityProofCard {...card} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Closing */}
          <motion.p initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(10px, 0.8vw, 13px)", fontWeight: 400, lineHeight: 1.4, color: "#A0A0A0", margin: 0, maxWidth: 580 }}
            className="shrink-0 w-full"
          >
            I&apos;m constantly exploring Generative AI, data engineering, and practical MLOps, and I&apos;m always looking for opportunities to build things that matter.
          </motion.p>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          MOBILE — Full-bleed hero image + content overlay
      ═══════════════════════════════════════════════ */}
      <div className="lg:hidden relative z-10 h-full w-full flex flex-col overflow-hidden">

        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/sazzadsunfi1.jpg"
            alt="Khondoker Sazzad Sunfi"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: "center 8%" }}
          />
          {/* Gradient: transparent at top → opaque dark below */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(5,5,5,0.10) 0%, rgba(5,5,5,0.25) 35%, rgba(5,5,5,0.80) 55%, rgba(5,5,5,0.96) 70%, #050505 85%)",
            }}
          />
        </div>

        {/* Top label bar */}
        <div className="relative z-10 flex justify-between items-center w-full px-4 pt-[52px] shrink-0">
          <motion.span
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, fontWeight: 500, color: "rgba(245,242,237,0.60)", textTransform: "uppercase", letterSpacing: "0.28em" }}
          >
            ABOUT ME
          </motion.span>
          <motion.span
            initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
            style={{ fontFamily: "var(--font-mono, monospace)", fontSize: 10, letterSpacing: "0.2em", color: "rgba(245,242,237,0.35)", textTransform: "uppercase" }}
          >
            01 / IDENTITY
          </motion.span>
        </div>

        {/* Flex spacer — controls how much image shows above content */}
        <div className="relative z-10 flex-[2]" />

        {/* Content overlay block */}
        <div className="relative z-10 flex-[3] flex flex-col justify-end px-4 pb-3 gap-[6px]">

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.75 }}
            style={{ margin: 0, fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(17px, 5.2vw, 26px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "#FFFFFF" }}
          >
            Crafting Intelligent Systems with{" "}
            <span style={{ color: "#C83228D9" }}>Passion</span>
          </motion.h2>

          {/* Bio */}
          <motion.p
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.08 }}
            style={{ fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(10px, 2.7vw, 13px)", fontWeight: 400, lineHeight: 1.45, color: "#A0A0A0", margin: 0 }}
          >
            I&apos;m a Data Science &amp; AI enthusiast at UIU turning real-world data into clear insights and production-ready intelligent systems — building robust data pipelines, ML models, and interactive dashboards.
          </motion.p>

          {/* Toolkit */}
          <motion.p
            initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.13 }}
            style={{ fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(9.5px, 2.5vw, 12px)", fontWeight: 400, lineHeight: 1.4, color: "#888888", margin: 0 }}
          >
            My toolkit spans{" "}
            <strong style={{ fontWeight: 700, color: "#C0C0C0" }}>Python</strong>,{" "}
            <strong style={{ fontWeight: 700, color: "#C0C0C0" }}>ML</strong>,{" "}
            <strong style={{ fontWeight: 700, color: "#C0C0C0" }}>NLP/LLMs</strong>,{" "}
            <strong style={{ fontWeight: 700, color: "#C0C0C0" }}>Streamlit</strong>,{" "}
            <strong style={{ fontWeight: 700, color: "#C0C0C0" }}>FastAPI</strong>,{" "}
            <strong style={{ fontWeight: 700, color: "#C0C0C0" }}>Next.js</strong>,{" "}
            <strong style={{ fontWeight: 700, color: "#C0C0C0" }}>TypeScript</strong>{" "}
            &amp; more.
          </motion.p>

          {/* 3 Cards */}
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.09, delayChildren: 0.18 } } }}
            className="grid grid-cols-3 gap-1.5"
          >
            {CARDS.map((card) => (
              <motion.div
                key={card.label}
                variants={{ hidden: { opacity: 0, y: 14, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } } }}
              >
                <IdentityProofCard {...card} />
              </motion.div>
            ))}
          </motion.div>

          {/* Closing statement */}
          <motion.p
            initial={{ opacity: 0, y: 6 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 0.28 }}
            style={{ fontFamily: "var(--font-quicksand), 'Quicksand', sans-serif", fontSize: "clamp(9px, 2.3vw, 11.5px)", fontWeight: 400, lineHeight: 1.4, color: "#707070", margin: 0 }}
          >
            I&apos;m constantly exploring Generative AI, data engineering, and practical MLOps, and I&apos;m always looking for opportunities to build things that matter.
          </motion.p>

        </div>
      </div>

    </div>
  );
}
