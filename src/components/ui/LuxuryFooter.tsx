"use client";

import React, { useEffect, useRef } from "react";
import { Rubik_Distressed } from "next/font/google";

const rubikDistressed = Rubik_Distressed({ weight: "400", subsets: ["latin"] });

export default function LuxuryFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const lightRef = useRef<HTMLDivElement>(null);
  const maskRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      targetPosition.current = { x: rect.width / 2, y: rect.height / 2 };
      currentPosition.current = { x: rect.width / 2, y: rect.height / 2 };
    }

    const animate = () => {
      // Smoother lerp for floaty luxury movement
      currentPosition.current.x += (targetPosition.current.x - currentPosition.current.x) * 0.03;
      currentPosition.current.y += (targetPosition.current.y - currentPosition.current.y) * 0.03;

      if (lightRef.current) {
        lightRef.current.style.setProperty("--x", `${currentPosition.current.x}px`);
        lightRef.current.style.setProperty("--y", `${currentPosition.current.y}px`);
      }
      if (maskRef.current) {
        maskRef.current.style.setProperty("--x", `${currentPosition.current.x}px`);
        maskRef.current.style.setProperty("--y", `${currentPosition.current.y}px`);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    targetPosition.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  return (
    <footer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[80vh] min-h-[600px] bg-[#020202] flex items-center justify-center overflow-hidden cursor-default"
    >
      {/* Cinematic Grain Texture */}
      <div className="absolute inset-0 z-10 opacity-[0.04] mix-blend-screen pointer-events-none">
        <svg viewBox="0 0 100% 100%" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <filter id="cinematicNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#cinematicNoise)" />
        </svg>
      </div>

      {/* Depth Gradient Layer */}
      <div className="absolute inset-0 z-40 pointer-events-none bg-gradient-to-b from-[#020202] via-transparent to-[#020202] opacity-80" />

      {/* Base Ultra-Dark Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <h1 className={`text-[28vw] md:text-[22vw] lg:text-[18vw] tracking-[-0.08em] text-[#070707] leading-none select-none w-full text-center ${rubikDistressed.className}`}>
          SUNFI
        </h1>
      </div>

      {/* Ambient Soft Glow (Background Light) */}
      <div
        ref={lightRef}
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: `radial-gradient(circle 800px at var(--x, 50%) var(--y, 50%), rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.015) 40%, transparent 80%)`,
          mixBlendMode: "screen",
        }}
      />

      {/* Revealed Luminous Text (Masked) */}
      <div
        ref={maskRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
        style={{
          WebkitMaskImage: `radial-gradient(circle 700px at var(--x, 50%) var(--y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 75%)`,
          maskImage: `radial-gradient(circle 700px at var(--x, 50%) var(--y, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 40%, transparent 75%)`,
        }}
      >
        <h1 className={`text-[28vw] md:text-[22vw] lg:text-[18vw] tracking-[-0.08em] bg-gradient-to-b from-[#999999] to-[#555555] bg-clip-text text-transparent leading-none select-none w-full text-center drop-shadow-[0_0_40px_rgba(255,255,255,0.1)] blur-[0.5px] ${rubikDistressed.className}`}>
          SUNFI
        </h1>
      </div>
    </footer>
  );
}
