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
  // 1. LAYER 1: 01 / IDENTITY
  // Only opacity fade — GPU-composited, zero lag on mobile
  // ─────────────────────────────────────────────────────────────────────────────
  const card1Opacity = useTransform(smoothProgress, [0.25, 0.39], [1.0, 0.0]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. LAYER 2: 02 / CHAPTER
  // translateY slide-in + opacity fade when Card 3 rises
  // ─────────────────────────────────────────────────────────────────────────────
  const card2Y = useTransform(
    smoothProgress,
    [0.0, 0.25, 0.39, 1.0],
    ["100%", "100%", "0%", "0%"]
  );
  const card2Opacity = useTransform(smoothProgress, [0.61, 0.75], [1.0, 0.0]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. LAYER 3: 03 / WORK
  // translateY slide-in only — no further card above it
  // ─────────────────────────────────────────────────────────────────────────────
  const card3Y = useTransform(
    smoothProgress,
    [0.0, 0.61, 0.75, 1.0],
    ["100%", "100%", "0%", "0%"]
  );

  return (
    <div
      ref={containerRef}
      id="about-sequence"
      className="relative w-full bg-black"
      style={{ height: "275vh" }}
    >
      {/* ── Sticky 100vh Viewport Pinning Container ────────────────────────── */}
      <div className="sticky top-0 w-full h-screen overflow-hidden bg-black">

        {/* ═══ 1. IDENTITY PANEL (01 / IDENTITY) ═══ */}
        <motion.div
          className="absolute inset-0 w-full h-full z-10 will-change-transform"
          style={{ opacity: card1Opacity }}
        >
          <AboutPreview profile={profile} />
        </motion.div>

        {/* ═══ 2. STORY / CHAPTER PANEL (02 / CHAPTER) ═══ */}
        <motion.div
          className="absolute inset-0 w-full h-full z-20 will-change-transform border-t border-white/[0.08]"
          style={{ y: card2Y, opacity: card2Opacity }}
        >
          <StoryPanel />
        </motion.div>

        {/* ═══ 3. WORK PANEL (03 / WORK) ═══ */}
        <motion.div
          className="absolute inset-0 w-full h-full z-30 will-change-transform border-t border-white/[0.08]"
          style={{ y: card3Y }}
        >
          <WorkPanel />
        </motion.div>

      </div>
    </div>
  );
}
