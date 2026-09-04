"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowUpRight, Search, SlidersHorizontal, Layers, Check, X } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Project as SanityProject } from "@/sanity/lib/types";

// Project Type matching the schema and static data
interface Project {
  id: string | number;
  slug: string;
  title: string;
  category: "AI Systems" | "Web Apps" | "E-Commerce" | "Visualization" | "Data Engineering";
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  impactScore: number;
  date: string;
  imageUrl?: string;
  order?: number;
}

// 8 Specific Projects Data
const projectsData: Project[] = [
  {
    id: 1,
    slug: "neurolens",
    title: "NeuroLens",
    category: "AI Systems",
    description: "Deep learning system for clinical brain MRI analysis — achieving 97% sensitivity on validation sets.",
    techStack: ["Python", "PyTorch", "OpenCV", "FastAPI"],
    githubUrl: "https://github.com/sunfi/neurolens",
    liveUrl: "https://neurolens.demo",
    featured: true,
    impactScore: 97,
    date: "2026-05-10"
  },
  {
    id: 2,
    slug: "datavista-dashboard",
    title: "DataVista Dashboard",
    category: "Web Apps",
    description: "High-throughput BI analytics dashboard processing 2M+ rows with sub-second aggregate query response times.",
    techStack: ["Next.js", "TypeScript", "Tailwind", "D3.js"],
    githubUrl: "https://github.com/sunfi/datavista",
    liveUrl: "https://datavista.demo",
    featured: false,
    impactScore: 88,
    date: "2026-04-15"
  },
  {
    id: 3,
    slug: "graph-neural-explorer",
    title: "Graph Neural Explorer",
    category: "Visualization",
    description: "Interactive topological GNN visualization tool for complex node classification models — published IEEE 2024.",
    techStack: ["Python", "DGL", "NetworkX", "Plotly"],
    githubUrl: "https://github.com/sunfi/gnn-explorer",
    liveUrl: "https://gnn-explorer.demo",
    featured: true,
    impactScore: 93,
    date: "2026-05-01"
  },
  {
    id: 4,
    slug: "audiomind-ai",
    title: "AudioMind AI",
    category: "AI Systems",
    description: "Spatio-temporal audio emotion classification model achieving a 91% F1 score across major vocal categories.",
    techStack: ["Python", "Librosa", "PyTorch", "FastAPI"],
    githubUrl: "https://github.com/sunfi/audiomind",
    liveUrl: "https://audiomind.demo",
    featured: false,
    impactScore: 86,
    date: "2026-02-28"
  },
  {
    id: 5,
    slug: "etl-pipeline-pro",
    title: "ETL Pipeline Pro",
    category: "Data Engineering",
    description: "Fault-tolerant multi-source streaming pipeline into a unified warehouse — reducing query latency by 70%.",
    techStack: ["Airflow", "dbt", "BigQuery", "Terraform"],
    githubUrl: "https://github.com/sunfi/etl-pipeline",
    liveUrl: "https://etl-pipeline.demo",
    featured: true,
    impactScore: 95,
    date: "2026-05-15"
  },
  {
    id: 6,
    slug: "llm-churn-predictor",
    title: "LLM Churn Predictor",
    category: "AI Systems",
    description: "Attention-based sequence models and gradient boosted ensembles predicting enterprise customer churn.",
    techStack: ["HuggingFace", "XGBoost", "FastAPI", "Postgres"],
    githubUrl: "https://github.com/sunfi/llm-churn",
    liveUrl: "https://llm-churn.demo",
    featured: true,
    impactScore: 96,
    date: "2026-03-20"
  },
  {
    id: 7,
    slug: "crop-disease-vision",
    title: "Crop Disease Vision",
    category: "E-Commerce",
    description: "Edge computer vision model trained on 80K agricultural samples for real-time crop disease detection.",
    techStack: ["TensorFlow", "OpenCV", "Next.js", "PWA"],
    githubUrl: "https://github.com/sunfi/crop-vision",
    liveUrl: "https://crop-vision.demo",
    featured: false,
    impactScore: 91,
    date: "2026-01-10"
  },
  {
    id: 8,
    slug: "stock-lstm-forecaster",
    title: "Stock LSTM Forecaster",
    category: "Visualization",
    description: "Recurrent LSTM model with attention mechanics for multi-variate financial time-series forecasting.",
    techStack: ["Keras", "Pandas", "NumPy", "Streamlit"],
    githubUrl: "https://github.com/sunfi/stock-lstm",
    liveUrl: "https://stock-lstm.demo",
    featured: false,
    impactScore: 89,
    date: "2026-04-05"
  }
];

// Vector UI Mockups to replace emojis and provide a unified, premium visual representation
// Vector UI Mockups to replace emojis and provide a unified, premium visual representation
function ProjectMockup({ slug }: { slug: string }) {
  switch (slug) {
    case "neurolens":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
          <svg className="w-4/5 h-4/5 text-white/20" viewBox="0 0 100 100" fill="none">
            {/* Brain/Neural Scanner Visual */}
            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="1" />
            <path d="M 50 10 L 50 90 M 10 50 L 90 50" stroke="currentColor" strokeWidth="0.25" opacity="0.5" />
            <path d="M 30 40 Q 40 25 50 25 Q 60 25 70 40 Q 60 55 50 55 Q 40 55 30 40 Z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M 35 60 Q 45 45 50 45 Q 55 45 65 60 Q 55 75 50 75 Q 45 75 35 60 Z" stroke="currentColor" strokeWidth="1" opacity="0.7" />
            <circle cx="50" cy="40" r="2.5" fill="rgba(255,255,255,0.6)" />
            <circle cx="42" cy="35" r="1.5" fill="rgba(255,255,255,0.3)" />
            <circle cx="58" cy="35" r="1.5" fill="rgba(255,255,255,0.3)" />
            {/* Scanning Sweep */}
            <line x1="50" y1="50" x2="80" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="1.2" strokeLinecap="round">
              <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite" />
            </line>
          </svg>
          <div className="absolute bottom-4 left-4 font-mono text-[9px] text-white/30 uppercase tracking-widest flex flex-col gap-0.5 select-none">
            <span>Scan Mode: Active</span>
            <span>Sensitivity: 97.0%</span>
          </div>
        </div>
      );

    case "datavista-dashboard":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-8 overflow-hidden">
          {/* Subtle grid line backdrop */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] [background-size:24px_24px]" />
          <svg className="w-5/6 h-2/3 text-white/20" viewBox="0 0 100 40" fill="none">
            <path d="M0,30 Q25,12 50,22 T100,8" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="22" r="1.5" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>
      );

    case "graph-neural-explorer":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <svg className="w-full h-full text-white/20" viewBox="0 0 100 100" fill="none">
            {/* Graph Network Nodes & Edges */}
            <line x1="30" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="0.75" />
            <line x1="70" y1="30" x2="50" y2="50" stroke="currentColor" strokeWidth="0.75" />
            <line x1="50" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="0.75" />
            <line x1="30" y1="30" x2="70" y2="30" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2,2" />
            <line x1="30" y1="30" x2="20" y2="60" stroke="currentColor" strokeWidth="0.5" />
            <line x1="50" y1="50" x2="20" y2="60" stroke="currentColor" strokeWidth="0.75" />
            <line x1="50" y1="80" x2="80" y2="70" stroke="currentColor" strokeWidth="0.5" />
            <line x1="70" y1="30" x2="80" y2="70" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="5" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <circle cx="30" cy="30" r="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="70" cy="30" r="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="50" cy="80" r="4" fill="rgba(255,255,255,0.2)" />
            <circle cx="20" cy="60" r="3" fill="#111" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <circle cx="80" cy="70" r="3" fill="#111" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          </svg>
          <div className="absolute top-4 right-4 font-mono text-[8px] text-white/25 select-none">
            <span>h_v^(k) = σ(W h_u)</span>
          </div>
        </div>
      );

    case "audiomind-ai":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-8 overflow-hidden">
          {/* Subtle audio ripple */}
          <svg className="w-5/6 h-1/3 text-white/20" viewBox="0 0 100 20" fill="none">
            <line x1="0" y1="10" x2="100" y2="10" stroke="currentColor" strokeWidth="0.25" opacity="0.3" />
            <path d="M10,10 Q25,10 30,5 T40,15 T50,2 T60,18 T70,10 L90,10" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" />
          </svg>
        </div>
      );

    case "etl-pipeline-pro":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-6 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />
          <svg className="w-full h-3/4 text-white/20" viewBox="0 0 120 80" fill="none">
            {/* Pipelines Flow */}
            <rect x="10" y="10" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="0.75" />
            <rect x="10" y="34" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="0.75" />
            <rect x="10" y="58" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="0.75" />
            <path d="M 30 16 L 60 16 L 60 40 M 30 40 L 60 40 M 30 64 L 60 64 L 60 40" stroke="currentColor" strokeWidth="0.75" />
            <line x1="60" y1="40" x2="90" y2="40" stroke="currentColor" strokeWidth="1.2" />
            <rect x="90" y="28" width="20" height="24" rx="2" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.75" />
            {/* Labels inside SVGs */}
            <text x="13" y="18" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace">API</text>
            <text x="13" y="42" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace">SQL</text>
            <text x="13" y="66" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="monospace">LOG</text>
            <text x="94" y="42" fill="#fff" fontSize="6" fontFamily="monospace" fontWeight="bold">LAKE</text>
          </svg>
          <div className="absolute bottom-3 right-4 font-mono text-[8px] text-white/30 select-none">
            <span>Lag: -70%</span>
          </div>
        </div>
      );

    case "llm-churn-predictor":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex flex-col justify-between p-5 overflow-hidden">
          <div className="w-full flex items-center justify-between border-b border-white/[0.04] pb-2">
            <span className="font-mono text-[8px] text-white/25 select-none">ATTENTION_WEIGHT_MATRIX</span>
          </div>
          {/* Attention Grid Visualization */}
          <div className="flex-1 w-full grid grid-cols-6 grid-rows-4 gap-1 py-3">
            {Array.from({ length: 24 }).map((_, i) => {
              const opacities = [0.1, 0.4, 0.7, 0.2, 0.8, 0.3, 0.15, 0.6, 0.9, 0.2, 0.5, 0.1, 0.75, 0.3, 0.1, 0.85, 0.4, 0.2, 0.6, 0.1, 0.5, 0.9, 0.3, 0.2];
              const op = opacities[i] || 0.2;
              return (
                <div
                  key={i}
                  className="rounded-sm transition-colors duration-500"
                  style={{
                    backgroundColor: `rgba(255, 255, 255, ${op * 0.12})`,
                    border: `1px solid rgba(255, 255, 255, ${op * 0.05})`
                  }}
                />
              );
            })}
          </div>
          <div className="w-full flex justify-between font-mono text-[8px] text-white/25 select-none">
            <span>Class: Churn [94%]</span>
            <span>XGB+Transformer</span>
          </div>
        </div>
      );

    case "crop-disease-vision":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-8 overflow-hidden">
          {/* Minimal Leaf Outline */}
          <svg className="w-3/5 h-3/5 text-white/20" viewBox="0 0 100 100" fill="none">
            <path d="M50,20 Q70,40 60,70 Q50,85 50,85 Q50,85 40,70 Q30,40 50,20 Z" stroke="currentColor" strokeWidth="0.75" />
            <circle cx="50" cy="50" r="2.5" fill="rgba(255,255,255,0.4)" />
            <path d="M 40 50 L 60 50 M 50 40 L 50 60" stroke="rgba(255,255,255,0.25)" strokeWidth="0.25" opacity="0.5" />
          </svg>
        </div>
      );

    case "stock-lstm-forecaster":
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-8 overflow-hidden">
          {/* Clean upward trend */}
          <svg className="w-5/6 h-2/3 text-white/20" viewBox="0 0 100 40" fill="none">
            <path d="M0,35 L20,30 L40,32 L60,20 L80,24 L100,5" stroke="currentColor" strokeWidth="0.75" />
            <path d="M80,24 Q90,14 100,5" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="1.5,1.5" />
            <circle cx="100" cy="5" r="1.5" fill="rgba(255,255,255,0.5)" />
          </svg>
        </div>
      );

    default:
      return (
        <div className="absolute inset-0 w-full h-full bg-[#0f0f0f] flex items-center justify-center p-6">
          <div className="w-12 h-12 rounded-full border border-white/10" />
        </div>
      );
  }
}
// FloatingOrb component deleted to avoid double-stacking background glow layers. All backdrop lights are managed by AmbientOrbs.

// Translucent floating filters and input controls
interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: "Newest" | "Featured" | "Impact";
  setSortBy: (sort: "Newest" | "Featured" | "Impact") => void;
}

function FilterBar({
  activeCategory,
  setActiveCategory,
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy
}: FilterBarProps) {
  const [mobileMode, setMobileMode] = useState<"none" | "search" | "category" | "sort">("none");
  const categories = ["All", "AI Systems", "Web Apps", "E-Commerce", "Visualization", "Data Engineering"];

  const handleClearSearch = () => {
    setSearchQuery("");
    setMobileMode("none");
  };

  return (
    <div className="w-full pb-3 border-b border-white/[0.08] z-20 relative font-sans">
      {/* ─── DESKTOP VIEW ─── */}
      <div className="hidden md:flex flex-col gap-3.5 md:flex-row md:items-center md:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 cursor-pointer border ${
                  isActive
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-gray-400 border-white/[0.08] hover:text-gray-200 hover:border-white/20"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search + Sort */}
        <div className="flex items-center gap-2.5">
          {/* Search */}
          <div className="relative w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search work..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-all duration-300"
            />
          </div>

          {/* Sort */}
          <div className="relative w-[130px]">
            <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-8 pr-7 py-2 bg-white/[0.03] border border-white/[0.08] rounded-full text-xs text-gray-300 focus:outline-none focus:border-white/25 focus:text-white cursor-pointer appearance-none transition-all duration-300 font-mono"
            >
              <option value="Newest" className="bg-[#0f0f0f] text-white">Newest first</option>
              <option value="Featured" className="bg-[#0f0f0f] text-white">Featured first</option>
              <option value="Impact" className="bg-[#0f0f0f] text-white">Performance</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-400 w-0 h-0" />
          </div>
        </div>
      </div>

      {/* ─── MOBILE VIEW (Search Input + Category & Sort Icons in One Line) ─── */}
      <div className="flex md:hidden flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
          {/* Search Input directly on the line */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search work..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white/[0.04] border border-white/[0.1] rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-white/25 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Filter Category Icon Button */}
          <button
            onClick={() => setMobileMode(mobileMode === "category" ? "none" : "category")}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300 ${
              mobileMode === "category" || activeCategory !== "All"
                ? "bg-white text-black border-white shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white"
            }`}
            title="Filter Category"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>

          {/* Sort Icon Button */}
          <button
            onClick={() => setMobileMode(mobileMode === "sort" ? "none" : "sort")}
            className={`w-9 h-9 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300 ${
              mobileMode === "sort" || sortBy !== "Newest"
                ? "bg-white text-black border-white shadow-[0_2px_10px_rgba(255,255,255,0.2)]"
                : "bg-white/[0.03] border-white/[0.08] text-gray-400 hover:text-white"
            }`}
            title="Sort Projects"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Collapsible Category Drawer */}
        <AnimatePresence>
          {mobileMode === "category" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-1.5 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] mt-1"
            >
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      setActiveCategory(cat);
                      setMobileMode("none");
                    }}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider uppercase transition-all duration-200 ${
                      isActive
                        ? "bg-white text-black font-extrabold"
                        : "bg-white/[0.03] text-gray-400 border border-white/[0.04]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapsible Sort Drawer */}
        <AnimatePresence>
          {mobileMode === "sort" && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-1 p-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] mt-1"
            >
              {([
                { key: "Newest", label: "Newest first" },
                { key: "Featured", label: "Featured first" },
                { key: "Impact", label: "Performance score" }
              ] as const).map((option) => {
                const isActive = sortBy === option.key;
                return (
                  <button
                    key={option.key}
                    onClick={() => {
                      setSortBy(option.key);
                      setMobileMode("none");
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold tracking-wider uppercase transition-all duration-200 ${
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    {isActive && <Check className="w-3 h-3 text-white" />}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Utility: extract tech pills ────────────────────────────────────────────
function extractTech(techStack: string[]): string[] {
  if (!techStack || techStack.length === 0) return [];
  const keyKeywords = [
    "FastAPI", "React", "Python", "SQLite", "Gemini AI", "OpenCV",
    "Tailwind CSS", "Vite", "PyTorch", "Next.js", "TypeScript", "OCR",
    "Airflow", "dbt", "BigQuery", "Terraform", "HuggingFace", "XGBoost",
    "TensorFlow", "Keras", "Pandas", "Streamlit", "D3.js", "Librosa"
  ];
  const rawStr = Array.isArray(techStack) ? techStack.join(" ") : String(techStack || "");
  const extracted: string[] = [];
  keyKeywords.forEach((tech) => {
    if (rawStr.toLowerCase().includes(tech.toLowerCase()) && !extracted.includes(tech)) {
      extracted.push(tech);
    }
  });
  if (extracted.length === 0) {
    techStack.forEach((t) => {
      const clean = t.replace(/^(Frontend|Backend|Database & Storage|Security & Tools|AI & Computer Vision):\s*/i, "").split(",")[0].trim();
      if (clean && !extracted.includes(clean)) extracted.push(clean);
    });
  }
  return extracted.slice(0, 4);
}

// Category → accent color mapping
const CATEGORY_ACCENT: Record<string, string> = {
  "AI Systems":        "#C9A96E",   // warm brass / champagne gold
  "Web Apps":          "#8FAfa0",   // sage mist
  "E-Commerce":        "#BFA38A",   // copper sand
  "Visualization":     "#8BA8BF",   // steel slate
  "Data Engineering":  "#A99BBF",   // dusty lavender
};

// ─── HORIZONTAL card (magazine-style, full-width) ─────────────────────────
interface HorizontalCardProps {
  project: Project;
  index: number;
  serialNo: number;
  reversed?: boolean;
}

function HorizontalCard({ project, index, serialNo, reversed = false }: HorizontalCardProps) {
  const detailUrl = `/projects/${encodeURIComponent(project.slug.trim())}`;
  const liveUrl   = project.liveUrl?.trim();
  const githubUrl = project.githubUrl?.trim();
  const featuredTech = useMemo(() => extractTech(project.techStack), [project.techStack]);
  const accent = CATEGORY_ACCENT[project.category] ?? "#C83228";
  const numStr = String(serialNo).padStart(2, "0");

  return (
    <div className="w-full group relative">
      <div
        className={`relative w-full overflow-hidden bg-[#141416] border border-white/[0.07] rounded-3xl flex flex-col ${
          reversed ? "md:flex-row-reverse" : "md:flex-row"
        } min-h-[340px] md:min-h-[420px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] hover:border-white/20 hover:-translate-y-1 hover:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95)] transition-all duration-500 ease-out cursor-pointer`}
      >
        {/* Full-overlay link */}
        <Link href={detailUrl} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />

        {/* Accent top line */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] z-20 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}99, transparent)` }}
        />

        {/* ── Image pane ── */}
        <div className={`relative ${
          reversed ? "md:rounded-r-3xl" : "md:rounded-l-3xl"
        } overflow-hidden bg-[#080808] w-full md:w-[52%] shrink-0 min-h-[220px] md:min-h-0 p-3 sm:p-4`}>
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-[#050505] min-h-[200px] md:min-h-[360px]">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover object-top group-hover:scale-[1.03] transition-transform duration-700"
              />
            ) : (
              <ProjectMockup slug={project.slug} />
            )}
            {/* Image overlay gradient */}
            <div
              className={`absolute inset-0 pointer-events-none ${
                reversed
                  ? "bg-gradient-to-l from-[#141416] via-transparent to-transparent opacity-60"
                  : "bg-gradient-to-r from-[#141416] via-transparent to-transparent opacity-60"
              }`}
            />
          </div>
        </div>

        {/* ── Content pane ── */}
        <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 md:p-10 z-20 pointer-events-none">
          <div>
            {/* Serial + category row */}
            <div className="flex items-center gap-3 mb-5">
              <span
                className="text-4xl md:text-5xl font-black leading-none select-none"
                style={{ color: `${accent}22`, fontFamily: "'Quicksand', sans-serif" }}
              >
                {numStr}
              </span>
              <div className="flex flex-col gap-1">
                <span
                  className="text-[9px] uppercase tracking-[0.2em] font-bold font-mono"
                  style={{ color: accent }}
                >
                  {project.category}
                </span>
                {project.featured && (
                  <span className="text-[9px] uppercase tracking-widest text-white/40 font-mono">Featured</span>
                )}
              </div>
            </div>

            {/* Title */}
            <h3
              className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-4 leading-snug group-hover:opacity-80 transition-opacity duration-300 line-clamp-2"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed font-light mb-6 line-clamp-3 md:line-clamp-4">
              {project.description}
            </p>

            {/* Tech pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {featuredTech.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wide border"
                  style={{
                    backgroundColor: `${accent}10`,
                    borderColor: `${accent}30`,
                    color: `${accent}cc`
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-4 pointer-events-auto z-30 relative" style={{ borderColor: `${accent}20` }}>
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors duration-200 text-xs font-mono"
              >
                <FaGithub className="w-3.5 h-3.5" />
                <span>Source</span>
              </a>
            ) : (
              <span className="text-gray-700 flex items-center gap-1.5 text-xs font-mono">
                <FaGithub className="w-3.5 h-3.5" />
                <span>Source</span>
              </span>
            )}

            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full transition-all duration-300 hover:scale-[1.03]"
                style={{ backgroundColor: accent, color: "#fff", boxShadow: `0 2px 14px ${accent}40` }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 animate-pulse" />
                <span>Live</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            ) : (
              <Link
                href={detailUrl}
                className="flex items-center gap-1 text-xs text-gray-300 hover:text-white font-medium transition-colors duration-200"
              >
                <span>Read Details</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VERTICAL card (magazine grid column) ────────────────────────────────────
interface VerticalCardProps {
  project: Project;
  index: number;
  serialNo: number;
}

function VerticalCard({ project, index, serialNo }: VerticalCardProps) {
  const detailUrl = `/projects/${encodeURIComponent(project.slug.trim())}`;
  const liveUrl   = project.liveUrl?.trim();
  const githubUrl = project.githubUrl?.trim();
  const featuredTech = useMemo(() => extractTech(project.techStack), [project.techStack]);
  const accent = CATEGORY_ACCENT[project.category] ?? "#C83228";
  const numStr = String(serialNo).padStart(2, "0");

  return (
    <div className="w-full group relative">
      <div
        className="relative w-full overflow-hidden bg-[#141416] border border-white/[0.07] rounded-3xl flex flex-col min-h-[420px] shadow-[0_12px_40px_-10px_rgba(0,0,0,0.8)] hover:border-white/20 hover:-translate-y-2 hover:shadow-[0_24px_60px_-10px_rgba(0,0,0,0.95)] transition-all duration-500 ease-out cursor-pointer"
      >
        {/* Full-overlay link */}
        <Link href={detailUrl} className="absolute inset-0 z-10" aria-label={`View ${project.title}`} />

        {/* Accent top line */}
        <div
          className="absolute top-0 inset-x-0 h-[2px] z-20 pointer-events-none"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}88, transparent)` }}
        />

        {/* Image area */}
        <div className="relative w-full h-52 sm:h-56 overflow-hidden bg-[#080808] shrink-0 p-3">
          <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/[0.06] bg-[#050505]">
            {project.imageUrl ? (
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                className="object-cover object-top group-hover:scale-[1.04] transition-transform duration-700"
              />
            ) : (
              <ProjectMockup slug={project.slug} />
            )}
          </div>
          {/* Serial number watermark on image */}
          <span
            className="absolute bottom-4 right-4 text-5xl font-black leading-none select-none pointer-events-none z-10"
            style={{ color: `${accent}18`, fontFamily: "'Quicksand', sans-serif" }}
          >
            {numStr}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-5 sm:p-6 z-20 pointer-events-none">
          <div>
            {/* Category */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-[9px] uppercase tracking-[0.2em] font-bold font-mono"
                style={{ color: accent }}
              >
                {project.category}
              </span>
              {project.featured && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-[9px] uppercase tracking-wider text-white/35 font-mono">Featured</span>
                </>
              )}
            </div>

            {/* Title */}
            <h3
              className="text-white text-lg sm:text-xl font-extrabold tracking-tight mb-2.5 leading-snug line-clamp-2 group-hover:opacity-75 transition-opacity duration-300"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              {project.title}
            </h3>

            {/* Description */}
            <p className="text-gray-500 text-xs leading-relaxed font-light mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Tech pills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {featuredTech.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-0.5 rounded-full text-[9px] font-mono tracking-wide border"
                  style={{
                    backgroundColor: `${accent}0d`,
                    borderColor: `${accent}25`,
                    color: `${accent}aa`
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3 pointer-events-auto z-30 relative" style={{ borderColor: `${accent}18` }}>
            {githubUrl ? (
              <a
                href={githubUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-gray-500 hover:text-white transition-colors duration-200 text-[11px] font-mono"
              >
                <FaGithub className="w-3 h-3" />
                <span>Source</span>
              </a>
            ) : (
              <span className="text-gray-700 flex items-center gap-1.5 text-[11px] font-mono">
                <FaGithub className="w-3 h-3" />
                <span>Source</span>
              </span>
            )}

            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1 rounded-full transition-all duration-300 hover:scale-[1.04]"
                style={{ backgroundColor: accent, color: "#fff", boxShadow: `0 2px 10px ${accent}35` }}
              >
                <span className="w-1 h-1 rounded-full bg-white/70 animate-pulse" />
                <span>Live</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            ) : (
              <Link
                href={detailUrl}
                className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-white font-medium transition-colors duration-200"
              >
                <span>Details</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Quiet Space Block ────────────────────────────────────────────────────────
function QuietSpaceBlock() {
  return (
    <div className="w-full rounded-3xl border border-white/[0.06] bg-[#0f0f10] flex flex-col justify-center p-8 min-h-[200px] select-none">
      <p className="text-[#6b7280] text-sm leading-relaxed font-light tracking-wide italic border-l-2 border-white/[0.12] pl-4">
        &ldquo;Built slowly. Designed with restraint. Every interface tells a story of intention.&rdquo;
      </p>
      <span className="text-[9px] text-gray-600 uppercase tracking-widest mt-4 pl-4 font-mono">
        Sunfi Design Manifesto
      </span>
    </div>
  );
}


// Main page rendering wrapper
function ProjectsPageContent({ sanityProjects }: { sanityProjects?: SanityProject[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Map Sanity Projects if available
  const allProjects = useMemo(() => {
    if (!sanityProjects || sanityProjects.length === 0) return projectsData;

    const mappedFromSanity: Project[] = sanityProjects.map((sp, i) => ({
      id: sp._id,
      slug: (sp.slug || "").trim(),
      title: sp.title,
      category: (sp.category as any) || "AI Systems",
      description: sp.shortDescription || "",
      techStack: sp.techStack || [],
      githubUrl: sp.githubUrl || "",
      liveUrl: sp.liveUrl || "",
      featured: Boolean(sp.isFeatured),
      impactScore: 95 - i,
      date: "2026-08-17",
      imageUrl: sp.mainImage?.asset?._ref
        ? urlFor(sp.mainImage).width(800).height(480).fit("crop").url()
        : undefined,
      order: sp.order ?? i,
    }));

    return mappedFromSanity;
  }, [sanityProjects]);

  // Load state from URL Query Parameters
  const activeCategory = searchParams.get("category") || "All";
  const searchQuery = searchParams.get("search") || "";
  const sortBy = (searchParams.get("sortBy") as "Newest" | "Featured" | "Impact") || "Newest";

  const setActiveCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== "All") {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setSearchQuery = (query: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const setSortBy = (sort: "Newest" | "Featured" | "Impact") => {
    const params = new URLSearchParams(searchParams.toString());
    if (sort && sort !== "Newest") {
      params.set("sortBy", sort);
    } else {
      params.delete("sortBy");
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Filter & Sort computation
  const filteredProjects = useMemo(() => {
    return allProjects
      .filter((project) => {
        const catStr = (project.category || "").toLowerCase().trim();
        const activeStr = activeCategory.toLowerCase().trim();
        const matchesCategory =
          activeCategory === "All" ||
          catStr === activeStr ||
          (activeCategory === "E-Commerce" && catStr.includes("commerce")) ||
          (activeCategory === "Web Apps" && (catStr.includes("web") || catStr.includes("app")));
        const matchesSearch =
          project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "Impact") {
          return b.impactScore - a.impactScore;
        }
        // Default / Featured sort: Featured projects first, then by order asc
        if (a.featured !== b.featured) {
          return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        }
        const orderA = a.order ?? 99;
        const orderB = b.order ?? 99;
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }, [activeCategory, searchQuery, sortBy, allProjects]);

  // Classify projects into horizontal (featured) and vertical (regular)
  // for the magazine layout
  const classifyProject = (project: Project): "horizontal" | "vertical" => {
    return project.featured ? "horizontal" : "vertical";
  };

  return (
    <div className="projects-page-container bg-[#050505] min-h-screen text-[#F5F5F5] selection:bg-white/15 selection:text-white pb-24 md:pb-32 pt-0 mt-[-5rem] sm:mt-[-6rem] relative overflow-x-hidden max-w-full">
      
      {/* Google fonts style rules for Quicksand */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        `
      }} />

      {/* Barely visible grain texture overlay using inline SVG fractal noise */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-[0.012] mix-blend-overlay">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
      </div>



      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-24 sm:pt-28 md:pt-32 relative z-10 flex flex-col gap-8 sm:gap-10 md:gap-14">
        
        {/* ==========================================
            HERO SECTION
            ========================================== */}
        <section className="flex flex-col items-start text-left w-full pt-4 select-none relative overflow-hidden">

          {/* Ghost watermark title — desktop only */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute -top-6 -left-2 text-[clamp(6rem,10vw,11rem)] font-black leading-none tracking-tighter pointer-events-none z-0 whitespace-nowrap"
            style={{
              fontFamily: "'Quicksand', sans-serif",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.035)",
              userSelect: "none",
            }}
          >
            PROJECTS
          </div>

          {/* // Build log label */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs font-bold tracking-[3px] uppercase mb-4 relative z-10"
            style={{ color: "#C83228D9" }}
          >
            // Build log
          </motion.p>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10"
          >
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#e2e8f0] tracking-tight leading-tight mb-4"
              style={{ fontFamily: "'Quicksand', sans-serif" }}
            >
              Projects
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative z-10 mb-6"
          >
            <p className="text-gray-500 text-xs sm:text-sm md:text-base font-light tracking-tight max-w-xl">
              Not just code. Systems that think, pipelines that breathe, and visuals that speak.
            </p>
          </motion.div>

          {/* ── Marquee Ticker ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full"
          >
            {/* thin top rule */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mb-4" />

            <div className="relative overflow-hidden w-full" style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}>
              <div className="flex gap-0 animate-marquee-slow whitespace-nowrap">
                {[
                  "FastAPI", "React", "Python", "PyTorch", "Next.js", "TypeScript",
                  "OpenCV", "TensorFlow", "Keras", "SQLite", "Airflow", "dbt",
                  "BigQuery", "HuggingFace", "XGBoost", "D3.js", "Streamlit", "Vite",
                  "Librosa", "Tailwind CSS", "Pandas", "Terraform", "Gemini AI", "OCR",
                  // duplicate for seamless loop
                  "FastAPI", "React", "Python", "PyTorch", "Next.js", "TypeScript",
                  "OpenCV", "TensorFlow", "Keras", "SQLite", "Airflow", "dbt",
                  "BigQuery", "HuggingFace", "XGBoost", "D3.js", "Streamlit", "Vite",
                  "Librosa", "Tailwind CSS", "Pandas", "Terraform", "Gemini AI", "OCR",
                ].map((tag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-3 px-0 mr-6 text-[11px] font-mono tracking-[0.15em] uppercase shrink-0"
                  >
                    <span className="text-white/[0.18] font-light">{tag}</span>
                    <span className="w-1 h-1 rounded-full bg-white/[0.08] shrink-0" />
                  </span>
                ))}
              </div>
            </div>

            {/* thin bottom rule */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent mt-4" />
          </motion.div>

          {/* ── Stat row ── */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-6 mt-5 relative z-10"
          >
            {[
              { value: filteredProjects.length.toString().padStart(2, "0"), label: "Projects" },
              { value: filteredProjects.filter(p => p.featured).length.toString().padStart(2, "0"), label: "Featured" },
              { value: "05", label: "Categories" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-6">
                {i > 0 && <div className="w-px h-6 bg-white/[0.08]" />}
                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-xl font-black leading-none text-white/70"
                    style={{ fontFamily: "'Quicksand', sans-serif" }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[9px] text-gray-600 uppercase tracking-[0.2em] font-mono">
                    {stat.label}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ==========================================
            FILTER & SEARCH CONTROLS
            ========================================== */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-6"
        >
          <FilterBar
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            sortBy={sortBy}
            setSortBy={setSortBy}
          />
        </motion.section>

        {/* ==========================================
            MAGAZINE LAYOUT GRID
            ========================================== */}
        <section className="relative w-full">
          <AnimatePresence mode="popLayout">
            {/* ── Render projects in magazine layout ── */}
            {(() => {
              const cardVariants = {
                hidden:   { opacity: 0, y: 16 },
                visible:  (delay: number) => ({
                  opacity: 1, y: 0,
                  transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] as [number,number,number,number], delay }
                }),
                exit:     { opacity: 0, scale: 0.97, y: 8, transition: { duration: 0.2 } }
              };

              // Separate into horizontal (featured) and vertical (regular)
              const horizontal = filteredProjects.filter((p) => classifyProject(p) === "horizontal");
              const vertical   = filteredProjects.filter((p) => classifyProject(p) === "vertical");

              // Build a serial number map across all projects (sorted order)
              const serialMap = new Map<string | number, number>();
              filteredProjects.forEach((p, i) => serialMap.set(p.id, i + 1));

              return (
                <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">

                  {/* ── Section 1: Featured / Horizontal cards ── */}
                  {horizontal.length > 0 && (
                    <div className="flex flex-col gap-6 sm:gap-8">
                      {horizontal.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          layout
                          custom={Math.min(idx, 3) * 0.06}
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          exit="exit"
                          viewport={{ once: true, amount: 0.05, margin: "40px" }}
                        >
                          <HorizontalCard
                            project={project}
                            index={idx}
                            serialNo={serialMap.get(project.id) ?? idx + 1}
                            reversed={idx % 2 !== 0}
                          />
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Divider between sections */}
                  {horizontal.length > 0 && vertical.length > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-px bg-white/[0.05]" />
                      <span className="text-[9px] text-gray-600 uppercase tracking-[0.3em] font-mono select-none">More work</span>
                      <div className="flex-1 h-px bg-white/[0.05]" />
                    </div>
                  )}

                  {/* ── Section 2: Regular / Vertical cards in 3-col grid ── */}
                  {vertical.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                      {vertical.map((project, idx) => (
                        <motion.div
                          key={project.id}
                          layout
                          custom={Math.min(idx, 4) * 0.05 + 0.05}
                          variants={cardVariants}
                          initial="hidden"
                          whileInView="visible"
                          exit="exit"
                          viewport={{ once: true, amount: 0.05, margin: "40px" }}
                        >
                          <VerticalCard
                            project={project}
                            index={idx}
                            serialNo={serialMap.get(project.id) ?? horizontal.length + idx + 1}
                          />
                        </motion.div>
                      ))}

                      {/* Manifesto quiet block at the end of vertical grid */}
                      {activeCategory === "All" && searchQuery === "" && (
                        <motion.div
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, amount: 0.05, margin: "40px" }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                        >
                          <QuietSpaceBlock />
                        </motion.div>
                      )}
                    </div>
                  )}

                  {/* If ALL projects are featured (horizontal only), append manifesto below */}
                  {vertical.length === 0 && activeCategory === "All" && searchQuery === "" && (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.05, margin: "40px" }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                      className="md:max-w-md"
                    >
                      <QuietSpaceBlock />
                    </motion.div>
                  )}
                </div>
              );
            })()}
          </AnimatePresence>

          {/* Empty Search Result state */}
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full py-32 text-center rounded-3xl border border-stone-900 bg-[#0f0f0f]/30 backdrop-blur-md flex flex-col items-center justify-center"
            >
              <Layers className="w-8 h-8 text-stone-600 mb-4" />
              <p className="text-stone-500 text-sm font-light tracking-wider">No matching projects found</p>
            </motion.div>
          )}
        </section>

        {/* ==========================================
            EMOTIONAL CTA SECTION
            ========================================== */}
        <section className="w-full py-16 border-t border-white/[0.05] mt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-12 select-none">
          <div className="flex flex-col gap-2 max-w-xl">
            <h4 className="text-gray-400 text-base md:text-lg font-light tracking-wide italic">
              "Selected work crafted with obsession and intention."
            </h4>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">
              Every interface tells a story
            </p>
          </div>

          <div className="relative group">
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-transparent border border-white/10 rounded-full text-sm font-medium tracking-wide text-gray-300 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all duration-700 ease-out cursor-pointer shadow-lg hover:shadow-[0_8px_30px_rgba(0,0,0,0.8)]"
            >
              <span>Initiate collaboration</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:scale-125 transition-transform duration-700" />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

interface ProjectsContainerProps {
  sanityProjects?: SanityProject[];
}

// Export default with Suspense wrapper to prevent de-opt issues in build stage
export default function ProjectsContainer({ sanityProjects }: ProjectsContainerProps) {
  return (
    <Suspense fallback={
      <div className="bg-[#050505] min-h-screen flex items-center justify-center">
        <div className="w-5 h-5 rounded-full border border-zinc-800 border-t-white/40 animate-spin" />
      </div>
    }>
      <ProjectsPageContent sanityProjects={sanityProjects} />
    </Suspense>
  );
}

