"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface PoseConfig {
  id: string;
  src: string;
  alt: string;
  containerStyle: React.CSSProperties;
  mobileContainerStyle?: React.CSSProperties;
  widthPx: number;
  heightPx: number;
  mobileWidthPx?: number;
  mobileHeightPx?: number;
  hasWebThreadTop?: boolean;
  initialAnimation: any;
  animateAnimation: any;
  exitAnimation: any;
  transition?: any;
}

const ALL_POSES: PoseConfig[] = [
  // 1. Top Header Blank Space Between Text & Avatar (spiderman1)
  {
    id: "spiderman1",
    src: "/spiderman/spiderman1.png",
    alt: "Spider-Man Hanging Upside Down",
    containerStyle: { top: "0%", left: "47%", transform: "translateX(-50%)" },
    // On phone: moved further to the right edge (right: -5px) so it hangs completely free from behind avatar
    mobileContainerStyle: { top: "4%", right: "-5px", left: "auto", transform: "none" },
    widthPx: 270,
    heightPx: 400,
    mobileWidthPx: 140,
    mobileHeightPx: 200,
    hasWebThreadTop: true,
    initialAnimation: { y: -450, opacity: 0, scale: 0.85 },
    animateAnimation: { y: 0, opacity: 1, scale: 1 },
    exitAnimation: { y: 150, x: 250, opacity: 0, scale: 0.6, rotate: 25 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 2. Right Wall Edge (spiderman2 - wall crawling)
  {
    id: "spiderman2",
    src: "/spiderman/spiderman2.png",
    alt: "Spider-Man Wall Crawling Right",
    containerStyle: { top: "16%", right: "0%" },
    // On phone: just a bit lower into the blank space above Sunfi (top: 27%)
    mobileContainerStyle: { top: "27%", right: "0%" },
    widthPx: 310,
    heightPx: 430,
    mobileWidthPx: 130,
    mobileHeightPx: 180,
    initialAnimation: { x: 350, opacity: 0 },
    animateAnimation: { x: 0, opacity: 1 },
    exitAnimation: { y: -300, x: -150, opacity: 0, rotate: -20 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 3. Bottom Center-Left Ground (spiderman3) - Desktop only
  {
    id: "spiderman3",
    src: "/spiderman/spiderman3.png",
    alt: "Spider-Man Sitting Bottom Ground",
    containerStyle: { bottom: "2%", left: "40%", transform: "translateX(-50%)" },
    widthPx: 300,
    heightPx: 330,
    initialAnimation: { y: 400, opacity: 0, scale: 0.85 },
    animateAnimation: { y: 0, opacity: 1, scale: 1 },
    exitAnimation: { y: -200, x: -250, opacity: 0, scale: 0.7 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 4. Top-Left Corner (spiderman4)
  {
    id: "spiderman4",
    src: "/spiderman/spiderman4.png",
    alt: "Spider-Man Top Left Corner",
    containerStyle: { top: "3%", left: "2%" },
    // On phone: clings in top-left empty corner above bio
    mobileContainerStyle: { top: "1%", left: "1%" },
    widthPx: 280,
    heightPx: 350,
    mobileWidthPx: 130,
    mobileHeightPx: 165,
    hasWebThreadTop: true,
    initialAnimation: { y: -300, x: -150, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: 250, x: 200, opacity: 0, rotate: -15 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 5. Bottom-Left Ground (spiderman5)
  {
    id: "spiderman5",
    src: "/spiderman/spiderman5.png",
    alt: "Spider-Man Bottom Left Crouch",
    containerStyle: { bottom: "2%", left: "4%" },
    // On phone: positioned neatly in the space above 'Khondoker' (just below the orbit / greeting)
    mobileContainerStyle: { top: "30%", left: "2%" },
    widthPx: 300,
    heightPx: 330,
    mobileWidthPx: 125,
    mobileHeightPx: 145,
    initialAnimation: { y: -600, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: 250, opacity: 0, rotate: 20 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 6. Top-Right Corner (spiderman6) - Desktop only
  {
    id: "spiderman6",
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
  // 7. Left Blank Space (spiderman7) - Desktop only
  {
    id: "spiderman7",
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
  // 8. Middle Gap Shifted Left (spiderman8) - Desktop only
  {
    id: "spiderman8",
    src: "/spiderman/spiderman8.png",
    alt: "Spider-Man Middle Blank Space",
    containerStyle: { top: "48%", left: "38%", transform: "translate(-50%, -50%)" },
    widthPx: 290,
    heightPx: 350,
    initialAnimation: { y: -250, x: 250, opacity: 0, scale: 0.85 },
    animateAnimation: { y: 0, x: 0, opacity: 1, scale: 1 },
    exitAnimation: { y: 250, x: -150, opacity: 0, scale: 0.5 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
  // 9. Bottom-Right Corner (spiderman9) - Desktop only
  {
    id: "spiderman9",
    src: "/spiderman/spiderman9.png",
    alt: "Spider-Man Bottom Right Corner",
    containerStyle: { bottom: "2%", right: "3%" },
    widthPx: 290,
    heightPx: 350,
    initialAnimation: { y: 300, x: 0, opacity: 0 },
    animateAnimation: { y: 0, x: 0, opacity: 1 },
    exitAnimation: { y: -250, x: -250, opacity: 0, rotate: -20 },
    transition: { duration: 2.0, ease: [0.16, 1, 0.3, 1] },
  },
];

export function SpidermanPoseManager() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Filter poses: On phone/mobile, strictly cycle through 1, 2, 4, 5
  const activePosesList = useMemo(() => {
    if (mounted && isMobile) {
      return ALL_POSES.filter((p) =>
        ["spiderman1", "spiderman2", "spiderman4", "spiderman5"].includes(p.id)
      );
    }
    return ALL_POSES;
  }, [isMobile, mounted]);

  // Reset index if out of bounds after resize
  useEffect(() => {
    setCurrentIdx((prev) => (prev >= activePosesList.length ? 0 : prev));
  }, [activePosesList]);

  const nextPose = useCallback(() => {
    setCurrentIdx((prev) => (prev + 1) % activePosesList.length);
  }, [activePosesList.length]);

  // Extended Timed Auto-Cycle: 7.0 seconds per pose for prominent display
  useEffect(() => {
    const timer = setInterval(() => {
      nextPose();
    }, 7000);

    return () => clearInterval(timer);
  }, [nextPose]);

  const activePose = activePosesList[currentIdx] || activePosesList[0];

  const currentStyle = (mounted && isMobile)
    ? activePose.mobileContainerStyle || activePose.containerStyle
    : activePose.containerStyle;

  const width = (mounted && isMobile) ? activePose.mobileWidthPx || 140 : activePose.widthPx;
  const height = (mounted && isMobile) ? activePose.mobileHeightPx || 180 : activePose.heightPx;

  return (
    // STRICTLY LAYER z-[5] — ABOVE WEBS (z-[2]), BEHIND CONTENT (z-[10])
    <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activePose.id}-${isMobile ? "m" : "d"}`}
          style={currentStyle}
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
            <div className="absolute -top-[600px] left-1/2 -translate-x-1/2 w-[2px] md:w-[2.5px] h-[600px] bg-gradient-to-b from-white/10 via-white/80 to-white/95 shadow-[0_0_10px_rgba(255,255,255,0.9)] z-0" />
          )}

          {/* Spider-Man Character Image */}
          <div
            className="relative drop-shadow-[0_8px_16px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-300"
            style={{
              width: `${width}px`,
              height: `${height}px`,
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
