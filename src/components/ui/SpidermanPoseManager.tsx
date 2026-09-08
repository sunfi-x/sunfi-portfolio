"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PoseConfig {
  src: string;
  alt: string;
  containerStyle: React.CSSProperties;
  widthPx: number;
  heightPx: number;
  hasWebThreadTop?: boolean;
  initialAnimation: any;
  animateAnimation: any;
  exitAnimation: any;
}

const POSES: PoseConfig[] = [
  // 1. Top Center Header (spiderman1 - upside down hanging)
  {
    src: "/spiderman/spiderman1.png",
    alt: "Spider-Man Hanging Upside Down",
    containerStyle: { top: "0%", left: "50%", transform: "translateX(-50%)" },
    widthPx: 220,
    heightPx: 330,
    hasWebThreadTop: true,
    initialAnimation: { y: -350, opacity: 0, scale: 0.8 },
    animateAnimation: { y: 0, opacity: 1, scale: 1 },
    exitAnimation: { y: 150, x: 250, opacity: 0, scale: 0.6, rotate: 25 }, // Swings out down-right
  },
  // 2. Right Wall Edge (spiderman2 - wall crawling)
  {
    src: "/spiderman/spiderman2.png",
    alt: "Spider-Man Wall Crawling Right",
    containerStyle: { top: "20%", right: "2%" },
    widthPx: 240,
    heightPx: 340,
    initialAnimation: { x: 300, opacity: 0 },
    animateAnimation: { x: 0, opacity: 1 },
    exitAnimation: { y: -300, x: -150, opacity: 0, rotate: -20 }, // Leaps out up-left
  },
  // 3. Bottom Center Ground (spiderman3 - sitting crouching)
  {
    src: "/spiderman/spiderman3.png",
    alt: "Spider-Man Sitting Bottom Ground",
    containerStyle: { bottom: "2%", left: "48%", transform: "translateX(-50%)" },
    widthPx: 260,
    heightPx: 290,
    initialAnimation: { y: 250, opacity: 0, scale: 0.8 },
    animateAnimation: { y: 0, opacity: 1, scale: 1 },
    exitAnimation: { y: -200, x: -250, opacity: 0, scale: 0.7 }, // Swings out top-left
  },
  // 4. Top-Left Corner (spiderman4)
  {
    src: "/spiderman/spiderman4.png",
    alt: "Spider-Man Top Left Corner",
    containerStyle: { top: "4%", left: "3%" },
    widthPx: 240,
    heightPx: 310,
    hasWebThreadTop: true,
    initialAnimation: { y: -250, x: -150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: 250, x: 200, opacity: 0, rotate: -15 }, // Swings out bottom-right
  },
  // 5. Bottom-Left Ground (spiderman5 - crouching)
  {
    src: "/spiderman/spiderman5.png",
    alt: "Spider-Man Bottom Left Crouch",
    containerStyle: { bottom: "3%", left: "5%" },
    widthPx: 260,
    heightPx: 290,
    initialAnimation: { y: 200, x: -100, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: 250, opacity: 0, rotate: 20 }, // Leaps out top-right
  },
  // 6. Top-Right Corner (spiderman6)
  {
    src: "/spiderman/spiderman6.png",
    alt: "Spider-Man Top Right Corner",
    containerStyle: { top: "4%", right: "3%" },
    widthPx: 230,
    heightPx: 300,
    initialAnimation: { y: -200, x: 150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: 250, x: -200, opacity: 0, rotate: -25 }, // Swings out bottom-left
  },
  // 7. Left Blank Space (spiderman7)
  {
    src: "/spiderman/spiderman7.png",
    alt: "Spider-Man Left Blank Space",
    containerStyle: { top: "32%", left: "2%" },
    widthPx: 230,
    heightPx: 300,
    initialAnimation: { x: -250, opacity: 0 },
    animateAnimation: { x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: 200, opacity: 0, rotate: 15 }, // Swings out top-right
  },
  // 8. Middle Gap Between Bio & Profile Photo (spiderman8)
  {
    src: "/spiderman/spiderman8.png",
    alt: "Spider-Man Middle Blank Space",
    containerStyle: { top: "48%", left: "44%", transform: "translate(-50%, -50%)" },
    widthPx: 250,
    heightPx: 300,
    initialAnimation: { scale: 0.1, opacity: 0 },
    animateAnimation: { scale: 1, opacity: 1 },
    exitAnimation: { y: 250, x: -150, opacity: 0, scale: 0.5 }, // Drops out bottom-left
  },
  // 9. Bottom-Right Corner (spiderman9)
  {
    src: "/spiderman/spiderman9.png",
    alt: "Spider-Man Bottom Right Corner",
    containerStyle: { bottom: "3%", right: "4%" },
    widthPx: 250,
    heightPx: 300,
    initialAnimation: { y: 200, x: 150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: -250, opacity: 0, rotate: -20 }, // Swings out top-left
  },
];

export function SpidermanPoseManager() {
  const [currentIdx, setCurrentIdx] = useState(0);

  const nextPose = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % POSES.length);
  }, []);

  // Extended Timed Auto-Cycle: 7.0 seconds per pose for prominent display
  useEffect(() => {
    const timer = setInterval(() => {
      nextPose();
    }, 7000);

    return () => clearInterval(timer);
  }, [nextPose]);

  const activePose = POSES[currentIdx];

  return (
    // STRICTLY LAYER z-[5] — ABOVE WEBS (z-[2]), BEHIND CONTENT (z-[10])
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          style={activePose.containerStyle}
          initial={activePose.initialAnimation}
          animate={activePose.animateAnimation}
          exit={activePose.exitAnimation}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          onClick={(e) => {
            e.stopPropagation();
            nextPose();
          }}
          className="absolute cursor-pointer pointer-events-auto group select-none"
          title="Click Spider-Man to switch pose!"
        >
          {/* Top Silver Web Thread Line for hanging poses */}
          {activePose.hasWebThreadTop && (
            <div className="absolute -top-[600px] left-1/2 -translate-x-1/2 w-[2.5px] h-[600px] bg-gradient-to-b from-white/10 via-white/80 to-white/95 shadow-[0_0_10px_rgba(255,255,255,0.9)] z-0" />
          )}

          {/* Prominent Desktop Spider-Man Character Image */}
          <div
            className="relative drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
            style={{
              width: `${activePose.widthPx}px`,
              height: `${activePose.heightPx}px`,
            }}
          >
            <Image
              src={activePose.src}
              alt={activePose.alt}
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
