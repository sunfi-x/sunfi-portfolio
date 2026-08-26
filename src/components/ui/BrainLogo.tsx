"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BrainLogoProps {
  className?: string;
  size?: number;
}

// Shared animation variants for glow breathing
const glowVariants = {
  dim: {
    filter: [
      "drop-shadow(0 0 2px #FF003C) drop-shadow(0 0 6px rgba(255,0,60,0.6))",
      "drop-shadow(0 0 6px #FF003C) drop-shadow(0 0 20px rgba(255,0,60,0.9)) drop-shadow(0 0 40px rgba(255,0,60,0.4))",
      "drop-shadow(0 0 2px #FF003C) drop-shadow(0 0 6px rgba(255,0,60,0.6))",
    ],
  },
};

const glowTransition = {
  duration: 2.5,
  repeat: Infinity,
  ease: "easeInOut" as const,
};

export function BrainLogo({ className, size = 32 }: BrainLogoProps) {
  return (
    <div
      className={cn("relative flex-shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <motion.svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        animate={glowVariants.dim}
        transition={glowTransition}
      >
        {/* ─────────────── BRAIN OUTLINE ─────────────── */}

        {/* Left hemisphere */}
        <motion.path
          d={`
            M 31 12
            C 24 12, 17 17, 15 25
            C 11 27, 9 31, 9 35
            C 9 40, 12 44, 17 46
            C 18 51, 22 55, 27 56
            L 31 56
            Z
          `}
          stroke="#FF003C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Right hemisphere */}
        <motion.path
          d={`
            M 33 12
            C 40 12, 47 17, 49 25
            C 53 27, 55 31, 55 35
            C 55 40, 52 44, 47 46
            C 46 51, 42 55, 37 56
            L 33 56
            Z
          `}
          stroke="#FF003C"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Centre divider line */}
        <line
          x1="32" y1="12"
          x2="32" y2="56"
          stroke="#FF003C"
          strokeWidth="1.2"
          strokeDasharray="3 2.5"
          strokeLinecap="round"
        />

        {/* ─────────────── LEFT CIRCUITS ─────────────── */}

        {/* Top-left stub: horizontal → node */}
        <line x1="16" y1="22" x2="24" y2="22" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="24" cy="22" r="2" fill="#FF003C" />

        {/* Mid-left: horizontal → node → vertical drop → node */}
        <line x1="12" y1="32" x2="21" y2="32" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="32" r="2" fill="#FF003C" />
        <line x1="21" y1="32" x2="21" y2="42" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="21" cy="42" r="2" fill="#FF003C" />

        {/* Bottom-left stub */}
        <line x1="17" y1="48" x2="26" y2="48" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="26" cy="48" r="2" fill="#FF003C" />

        {/* ─────────────── RIGHT CIRCUITS ─────────────── */}

        {/* Top-right stub: horizontal → node */}
        <line x1="48" y1="22" x2="40" y2="22" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="40" cy="22" r="2" fill="#FF003C" />

        {/* Mid-right: horizontal → node → vertical drop → node */}
        <line x1="52" y1="32" x2="43" y2="32" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="43" cy="32" r="2" fill="#FF003C" />
        <line x1="43" y1="32" x2="43" y2="42" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="43" cy="42" r="2" fill="#FF003C" />

        {/* Bottom-right stub */}
        <line x1="47" y1="48" x2="38" y2="48" stroke="#FF003C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="38" cy="48" r="2" fill="#FF003C" />

        {/* ─── Centre cross-connections ─── */}
        <line x1="26" y1="37" x2="38" y2="37" stroke="#FF003C" strokeWidth="1.2" strokeLinecap="round" strokeDasharray="2 2" />
      </motion.svg>
    </div>
  );
}
