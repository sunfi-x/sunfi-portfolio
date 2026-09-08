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
  transition?: any;
}

const POSES: PoseConfig[] = [
  // 1. Top Header Blank Space Between Text & Avatar (spiderman1)
  {
    src: "/spiderman/spiderman1.png",
    alt: "Spider-Man Hanging Upside Down",
    containerStyle: { top: "0%", left: "47%", transform: "translateX(-50%)" },
    widthPx: 270,
    heightPx: 400,
    hasWebThreadTop: true,
    initialAnimation: { y: -450, opacity: 0, scale: 0.85 },
    animateAnimation: { y: 0, opacity: 1, scale: 1 },
    exitAnimation: { y: 150, x: 250, opacity: 0, scale: 0.6, rotate: 25 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 2. Right Wall Edge (spiderman2 - wall crawling larger)
  {
    src: "/spiderman/spiderman2.png",
    alt: "Spider-Man Wall Crawling Right",
    containerStyle: { top: "16%", right: "0%" },
    widthPx: 310,
    heightPx: 430,
    initialAnimation: { x: 350, opacity: 0 },
    animateAnimation: { x: 0, opacity: 1 },
    exitAnimation: { y: -300, x: -150, opacity: 0, rotate: -20 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 3. Bottom Center-Left Ground (spiderman3)
  {
    src: "/spiderman/spiderman3.png",
    alt: "Spider-Man Sitting Bottom Ground",
    containerStyle: { bottom: "2%", left: "40%", transform: "translateX(-50%)" },
    widthPx: 300,
    heightPx: 330,
    initialAnimation: { y: 300, opacity: 0, scale: 0.85 },
    animateAnimation: { y: 0, opacity: 1, scale: 1 },
    exitAnimation: { y: -200, x: -250, opacity: 0, scale: 0.7 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 4. Top-Left Corner (spiderman4)
  {
    src: "/spiderman/spiderman4.png",
    alt: "Spider-Man Top Left Corner",
    containerStyle: { top: "3%", left: "2%" },
    widthPx: 280,
    heightPx: 350,
    hasWebThreadTop: true,
    initialAnimation: { y: -300, x: -150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: 250, x: 200, opacity: 0, rotate: -15 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 5. Bottom-Left Ground (spiderman5)
  {
    src: "/spiderman/spiderman5.png",
    alt: "Spider-Man Bottom Left Crouch",
    containerStyle: { bottom: "2%", left: "4%" },
    widthPx: 300,
    heightPx: 330,
    initialAnimation: { y: 250, x: -150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: 250, opacity: 0, rotate: 20 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 6. Top-Right Corner (spiderman6)
  {
    src: "/spiderman/spiderman6.png",
    alt: "Spider-Man Top Right Corner",
    containerStyle: { top: "3%", right: "2%" },
    widthPx: 270,
    heightPx: 340,
    initialAnimation: { y: -250, x: 150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: 250, x: -200, opacity: 0, rotate: -25 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 7. Left Blank Space (spiderman7)
  {
    src: "/spiderman/spiderman7.png",
    alt: "Spider-Man Left Blank Space",
    containerStyle: { top: "30%", left: "1%" },
    widthPx: 270,
    heightPx: 340,
    initialAnimation: { x: -300, opacity: 0 },
    animateAnimation: { x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: 200, opacity: 0, rotate: 15 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 8. Middle Gap Shifted Left (spiderman8)
  {
    src: "/spiderman/spiderman8.png",
    alt: "Spider-Man Middle Blank Space",
    containerStyle: { top: "48%", left: "38%", transform: "translate(-50%, -50%)" },
    widthPx: 290,
    heightPx: 350,
    initialAnimation: { scale: 0.2, opacity: 0 },
    animateAnimation: { scale: 1, opacity: 1 },
    exitAnimation: { y: 250, x: -150, opacity: 0, scale: 0.5 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 9. Bottom-Right Corner (spiderman9)
  {
    src: "/spiderman/spiderman9.png",
    alt: "Spider-Man Bottom Right Corner",
    containerStyle: { bottom: "2%", right: "3%" },
    widthPx: 290,
    heightPx: 350,
    initialAnimation: { y: 250, x: 150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: -250, opacity: 0, rotate: -20 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
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
          animate={{
            ...activePose.animateAnimation,
            transition: { duration: 1.8, ease: [0.16, 1, 0.3, 1] }, // Slow, smooth entry (1.8s)
          }}
          exit={{
            ...activePose.exitAnimation,
            transition: { duration: 0.35, ease: [0.7, 0, 0.84, 0] }, // Fast action leap exit (0.35s)
          }}
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
