"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiKaggle, SiLeetcode, SiHackerrank, SiDatacamp } from "react-icons/si";
import { ExternalLink, CheckCircle2, Award } from "lucide-react";

interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
}

const PROFILES = [
  {
    id: "kaggle",
    name: "Kaggle",
    category: "Data Science & ML",
    icon: SiKaggle,
    url: "https://www.kaggle.com/sazzadsunfi",
    color: "#20BEFF",
    glowClass: "hover:border-[#20BEFF]/60 hover:shadow-[0_0_30px_rgba(32,190,255,0.25)]",
    bgGradient: "from-[#20BEFF]/10 via-transparent to-transparent",
    badgeText: "ML & Datasets Contributor",
    description: "Building machine learning pipelines, exploratory data analysis, and competitive AI models.",
    highlights: ["Public Notebooks", "ML Competitions", "Curated Datasets"],
  },
  {
    id: "leetcode",
    name: "LeetCode",
    category: "Algorithms & Data Structures",
    icon: SiLeetcode,
    url: "https://leetcode.com/u/sazzadsunfi/",
    color: "#FFA116",
    glowClass: "hover:border-[#FFA116]/60 hover:shadow-[0_0_30px_rgba(255,161,22,0.25)]",
    bgGradient: "from-[#FFA116]/10 via-transparent to-transparent",
    badgeText: "Verified Problem Solver",
    description: "Consistent problem solving, algorithmic optimization, and complex data structures.",
    highlights: ["Arrays & Graphs", "Dynamic Programming", "SQL Queries"],
    isLeetCode: true,
  },
  {
    id: "hackerrank",
    name: "HackerRank",
    category: "Problem Solving & SQL",
    icon: SiHackerrank,
    url: "https://www.hackerrank.com/profile/sunfisazzad",
    color: "#00EA64",
    glowClass: "hover:border-[#00EA64]/60 hover:shadow-[0_0_30px_rgba(0,234,100,0.25)]",
    bgGradient: "from-[#00EA64]/10 via-transparent to-transparent",
    badgeText: "Gold Badge Verified",
    description: "Certified proficiency in problem solving, Python programming, and relational databases.",
    highlights: ["Problem Solving ⭐⭐⭐⭐⭐", "Python Certified", "SQL Relational DBs"],
  },
  {
    id: "datacamp",
    name: "DataCamp",
    category: "Data Science & AI Tracks",
    icon: SiDatacamp,
    url: "https://www.datacamp.com/profile/sazzadsunfi",
    color: "#03EF62",
    glowClass: "hover:border-[#03EF62]/60 hover:shadow-[0_0_30px_rgba(3,239,98,0.25)]",
    bgGradient: "from-[#03EF62]/10 via-transparent to-transparent",
    badgeText: "Certified Track Completion",
    description: "Continuous learning in data engineering, deep learning, statistical modeling, and MLOps.",
    highlights: ["Data Engineering", "Machine Learning", "Python & R Statistics"],
  },
];

export function CodingProfiles() {
  const [leetStats, setLeetStats] = useState<LeetCodeStats | null>(null);

  useEffect(() => {
    async function fetchLeetCode() {
      try {
        const res = await fetch("https://leetcode-stats-api.herokuapp.com/sazzadsunfi");
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === "success") {
            setLeetStats({
              totalSolved: data.totalSolved || 0,
              easySolved: data.easySolved || 0,
              mediumSolved: data.mediumSolved || 0,
              hardSolved: data.hardSolved || 0,
              ranking: data.ranking || 0,
            });
          }
        }
      } catch (err) {
        console.warn("Could not fetch live LeetCode stats:", err);
      }
    }
    fetchLeetCode();
  }, []);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16 relative">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#C83228D9]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header Title */}
      <div className="flex flex-col items-center text-center mb-10 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-gray-300 tracking-wider uppercase mb-4"
        >
          <Award className="w-4 h-4 text-[#C83228D9]" />
          <span>AUTHENTICATED SKILL PROFILES</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl md:text-5xl font-extrabold text-white tracking-tight"
        >
          Competitive & Verified <span className="text-[#C83228D9]">Profiles</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-gray-400 max-w-2xl text-sm md:text-base mt-3"
        >
          Real-world proof of problem solving, machine learning expertise, algorithmic proficiency, and verified certifications across global coding platforms.
        </motion.p>
      </div>

      {/* Grid of 4 Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {PROFILES.map((item, index) => {
          const IconComp = item.icon;

          return (
            <motion.a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`group relative flex flex-col justify-between p-6 rounded-2xl bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 transition-all duration-300 ${item.glowClass}`}
            >
              {/* Subtle top gradient glow on hover */}
              <div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
              />

              <div>
                {/* Header: Icon & External Arrow */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-black/60 shadow-inner group-hover:scale-110 transition-transform duration-300"
                    style={{ color: item.color }}
                  >
                    <IconComp className="w-6 h-6" />
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>

                {/* Name & Category */}
                <div className="relative z-10 mb-3">
                  <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors flex items-center gap-1.5">
                    {item.name}
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 inline-block" />
                  </h3>
                  <p className="text-xs text-gray-400 font-mono mt-0.5">{item.category}</p>
                </div>

                {/* Live Stats for LeetCode if available */}
                {item.isLeetCode && leetStats && leetStats.totalSolved > 0 ? (
                  <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5 relative z-10">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">Total Solved</span>
                      <span className="text-sm font-bold text-[#FFA116] font-mono">{leetStats.totalSolved}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[11px] font-mono text-center pt-1 border-t border-white/5">
                      <span className="text-emerald-400">Easy: {leetStats.easySolved}</span>
                      <span className="text-amber-400">Med: {leetStats.mediumSolved}</span>
                      <span className="text-rose-400">Hard: {leetStats.hardSolved}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-300 leading-relaxed mb-4 relative z-10">
                    {item.description}
                  </p>
                )}

                {/* Highlight Bullets */}
                <div className="flex flex-wrap gap-1.5 relative z-10 mb-4">
                  {item.highlights.map((h, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-white/[0.04] border border-white/10 text-gray-300"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between relative z-10 mt-auto">
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Verified
                </span>
                <span className="text-xs font-semibold text-gray-300 group-hover:text-white group-hover:underline flex items-center gap-1">
                  View Profile &rarr;
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
