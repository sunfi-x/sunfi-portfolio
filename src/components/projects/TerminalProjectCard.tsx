"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────── */
export interface TerminalProjectCardProps {
  /** Project title – rendered ALL CAPS, centered over image */
  title: string;
  /** Short description – truncated to 3 lines */
  description: string;
  /** Absolute URL or relative path to the thumbnail */
  imageUrl?: string;
  /** Optional href — makes the whole card a link */
  href?: string;
  /** @deprecated — silently ignored, kept for backward compat */
  tag?: string;
}

/* ─────────────────────────────────────────────────
   SINGLE CARD — exact Ghostty / Project Lab spec
───────────────────────────────────────────────── */
export function TerminalProjectCard({
  title,
  description,
  imageUrl,
  href,
}: TerminalProjectCardProps) {
  const [hovered, setHovered] = useState(false);

  const content = (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative flex flex-col w-full h-full bg-[#0C0C0C] hover:bg-[#111111] transition-all duration-300 cursor-pointer select-none overflow-hidden"
    >
      {/* ══════════════════════════════════════
          TOP — Image area (~58% of card height)
         ══════════════════════════════════════ */}
      <div className="relative w-full flex-[0_0_58%] overflow-hidden bg-[#0C0C0C]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-all duration-500 ${
              hovered
                ? "brightness-100 scale-[1.02] opacity-100"
                : "brightness-[0.55] scale-100 opacity-80"
            }`}
          />
        ) : (
          /* Subtle terminal grid fallback */
          <div
            className="absolute inset-0 bg-[#0C0C0C]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)," +
                "linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
        )}

        {/* Flat dark overlay */}
        <div
          className={`absolute inset-0 transition-colors duration-300 pointer-events-none ${
            hovered ? "bg-black/15" : "bg-black/55"
          }`}
        />

        {/* ── Title: centered over the image in bold monospace ── */}
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center pointer-events-none">
          <h3 className="font-mono font-bold text-sm sm:text-base md:text-lg lg:text-xl text-white uppercase tracking-wider transition-all duration-300 leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {title}
          </h3>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BOTTOM — Description area (~42% of card height)
         ══════════════════════════════════════ */}
      <div className="flex-1 bg-[#0C0C0C] border-t border-white/[0.06] p-4 sm:p-4.5 flex flex-col justify-start overflow-hidden">
        <p className="m-0 font-mono text-xs sm:text-[13px] text-white/60 group-hover:text-white/85 leading-relaxed line-clamp-3 transition-colors duration-200">
          {description}
        </p>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link href={href} className="block w-full h-full text-inherit no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

/* ─────────────────────────────────────────────────
   GRID WRAPPER — 4-col, 1px gap
   The 1px gap reveals the container background
   (#141414) creating thin dark separator lines.
───────────────────────────────────────────────── */
export interface TerminalProjectGridProps {
  children: React.ReactNode;
  gap?: number;
}

export function TerminalProjectGrid({
  children,
  gap = 1,
}: TerminalProjectGridProps) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: `${gap}px`,
        width: "100%",
        backgroundColor: "#141414", /* shows through the 1px gap as separator */
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────
   DEMO SECTION — preview at /card-preview
   (safe to delete in production)
───────────────────────────────────────────────── */
const DEMO_PROJECTS: TerminalProjectCardProps[] = [
  {
    title: "NeuroLens",
    description:
      "Deep learning system for clinical brain MRI analysis — achieving 97% sensitivity on validation sets with multi-resolution attention heads.",
    href: "/projects/neurolens",
  },
  {
    title: "DataVista",
    description:
      "High-throughput BI analytics dashboard processing 2M+ rows with sub-second aggregate query response times using streaming materialized views.",
    href: "/projects/datavista-dashboard",
  },
  {
    title: "Graph Neural Explorer",
    description:
      "Interactive topological GNN visualization tool for complex node classification models — published IEEE 2024.",
    href: "/projects/graph-neural-explorer",
  },
  {
    title: "ETL Pipeline Pro",
    description:
      "Fault-tolerant multi-source streaming pipeline into a unified warehouse — reducing query latency by 70% through columnar partitioning.",
    href: "/projects/etl-pipeline-pro",
  },
  {
    title: "AudioMind AI",
    description:
      "Spatio-temporal audio emotion classification model achieving a 91% F1 score across major vocal categories using Librosa spectrograms.",
    href: "/projects/audiomind-ai",
  },
  {
    title: "LLM Churn Predictor",
    description:
      "Attention-based sequence models and gradient boosted ensembles predicting enterprise customer churn with 96% AUC on holdout set.",
    href: "/projects/llm-churn-predictor",
  },
  {
    title: "Crop Disease Vision",
    description:
      "Edge computer vision model trained on 80K agricultural samples for real-time crop disease detection with a Progressive Web App interface.",
    href: "/projects/crop-disease-vision",
  },
  {
    title: "Stock LSTM Forecaster",
    description:
      "Recurrent LSTM model with attention mechanics for multi-variate financial time-series forecasting across 12 equity indices.",
    href: "/projects/stock-lstm-forecaster",
  },
];

export function TerminalProjectDemo() {
  return (
    <section
      style={{ backgroundColor: "#0d0d0d", padding: "48px 24px", minHeight: "100vh" }}
    >
      <div
        style={{
          marginBottom: "24px",
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.28)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        -- VIEW --
      </div>

      <TerminalProjectGrid gap={1}>
        {DEMO_PROJECTS.map((p) => (
          <div key={p.title} style={{ aspectRatio: "4 / 5" }}>
            <TerminalProjectCard {...p} />
          </div>
        ))}
      </TerminalProjectGrid>
    </section>
  );
}
