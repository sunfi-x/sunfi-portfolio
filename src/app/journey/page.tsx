import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { LearningJourney } from "@/components/home/LearningJourney";

export const metadata: Metadata = {
  title: "My Learning Journey | Khondoker Sazzad Sunfi",
  description:
    "Explore Khondoker Sazzad Sunfi's comprehensive learning roadmap, key milestones, academic timeline, and core knowledge domains in AI & Data Science.",
};

export default function JourneyPage() {
  return (
    <main className="min-h-screen pt-28 md:pt-36 bg-[#050505] relative z-20">
      <div className="container mx-auto px-5 sm:px-8 md:px-12 max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs font-mono transition-all duration-200 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-[#C83228D9]" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <LearningJourney />
    </main>
  );
}
