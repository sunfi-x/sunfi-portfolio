"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import type { Profile } from "@/sanity/lib/types";
import { AboutPreview } from "./AboutPreview";
import { StoryPanel } from "./StoryPanel";
import { WorkPanel } from "./WorkPanel";

interface AboutSectionWrapperProps {
  profile: Profile | null;
}

export function AboutSectionWrapper({ profile }: AboutSectionWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the scroll progress through the calibrated section track
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring physics for silky fluid motion on all devices
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 32,
    restDelta: 0.001,
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // STACKED OVERLAP / CURTAIN UNVEIL REVEAL SYSTEM:
  // Height: 400vh gives ample scroll distance for full readability on each page.
  // Layer 1 (01 / IDENTITY - z-30): Pinned until 0.28, then slides UP from 0.28 to 0.45.
  // Layer 2 (02 / CHAPTER - z-20): Pinned until 0.73, then slides UP from 0.73 to 0.90.
  // Layer 3 (03 / WORK - z-10): Unveiled at 0.90, stays pinned through the rest.
  // ─────────────────────────────────────────────────────────────────────────────
  const card1Y = useTransform(smoothProgress, [0.28, 0.45], ["0%", "100%"]);
  const card2Y = useTransform(smoothProgress, [0.73, 0.90], ["0%", "100%"]);

  return (
    <div
      ref={containerRef}
      id="about-sequence"
      className="relative w-full bg-black"
      style={{ height: "400vh" }}
    >
      {/* ── Sticky 100vh Viewport Pinning Container ────────────────────────── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">

        {/* ═══ 1. IDENTITY PANEL (01 / IDENTITY) - Highest Z (z-30), covers Chapter 02 & 03 ═══ */}
        <motion.div
          className="absolute inset-0 w-full h-full z-30 will-change-transform bg-[#050505] shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
          style={{ y: card1Y }}
        >
          <AboutPreview profile={profile} />
        </motion.div>

        {/* ═══ 2. STORY / CHAPTER PANEL (02 / CHAPTER) - Middle Z (z-20), covers Work 03 ═══ */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20 will-change-transform bg-[#0a0a0a] shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
          style={{ y: card2Y }}
        >
          <StoryPanel />
        </motion.div>

        {/* ═══ 3. WORK PANEL (03 / WORK) - Base Z (z-10), revealed when 02 slides up ═══ */}
        <div
          className="absolute inset-0 w-full h-full z-10 bg-[#0a0a0a]"
        >
          <WorkPanel />
        </div>

      </div>
    </div>
  );
}
