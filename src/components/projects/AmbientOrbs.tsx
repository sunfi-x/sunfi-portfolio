import React from "react";
import { motion } from "framer-motion";

/**
 * AmbientOrbs
 *
 * Extremely subtle, near-neutral cinematic backlighting.
 * Pure monochrome whites — no red/amber hues.
 */
const AmbientOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Orb 1 – Very faint white radial glow in top-left */}
      <motion.div
        animate={{
          x: [0, 20, -10, 5, 0],
          y: [0, -15, 15, -5, 0],
          scale: [1, 1.02, 0.98, 1.01, 1]
        }}
        transition={{
          duration: 32,
          ease: "easeInOut",
          repeat: Infinity
        }}
        className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.008) 0%, transparent 70%)",
          filter: "blur(160px)",
          opacity: 0.5,
        }}
      />

      {/* Orb 2 – Ultra subtle white warmth mid-right */}
      <motion.div
        animate={{
          x: [0, -15, 20, -8, 0],
          y: [0, 20, -15, 8, 0],
          scale: [1, 0.99, 1.02, 0.99, 1]
        }}
        transition={{
          duration: 38,
          ease: "easeInOut",
          repeat: Infinity
        }}
        className="absolute top-[30%] right-[-10%] w-[900px] h-[900px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.005) 0%, transparent 70%)",
          filter: "blur(180px)",
          opacity: 0.4,
        }}
      />

      {/* Orb 3 – Quiet depth accent in bottom-left */}
      <motion.div
        animate={{
          x: [0, 15, -15, 8, 0],
          y: [0, -15, 15, -8, 0]
        }}
        transition={{
          duration: 44,
          ease: "easeInOut",
          repeat: Infinity
        }}
        className="absolute bottom-[-10%] left-[-5%] w-[950px] h-[950px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.004) 0%, transparent 70%)",
          filter: "blur(200px)",
          opacity: 0.4,
        }}
      />
    </div>
  );
};

export default AmbientOrbs;
