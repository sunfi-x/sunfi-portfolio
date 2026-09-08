"use client";

import React, { useState, useEffect, useCallback } from "react";

interface WebBurst {
  id: number;
  x: number;
  y: number;
  size: number;
  spokes: number;
  rings: number;
}

// Custom Vector SVG Spider Web Renderer
function CuteSpiderWebSVG({ size, spokes, rings }: { size: number; spokes: number; rings: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const maxR = size / 2 - 6;

  const spokeAngles: number[] = [];
  for (let i = 0; i < spokes; i++) {
    spokeAngles.push((i / spokes) * Math.PI * 2);
  }

  // Generate spoke lines
  const spokeLines = spokeAngles.map((angle, i) => {
    const ex = cx + Math.cos(angle) * maxR;
    const ey = cy + Math.sin(angle) * maxR;
    return <line key={`spoke-${i}`} x1={cx} y1={cy} x2={ex} y2={ey} />;
  });

  // Generate sagging ring strands
  const ringPaths: React.JSX.Element[] = [];
  const junctionDots: React.JSX.Element[] = [];

  for (let r = 1; r <= rings; r++) {
    const currentR = maxR * Math.pow(r / rings, 0.85);

    for (let i = 0; i < spokes; i++) {
      const nextI = (i + 1) % spokes;
      const a1 = spokeAngles[i];
      const a2 = spokeAngles[nextI];

      const x1 = cx + Math.cos(a1) * currentR;
      const y1 = cy + Math.sin(a1) * currentR;
      const x2 = cx + Math.cos(a2) * currentR;
      const y2 = cy + Math.sin(a2) * currentR;

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const cpX = cx + (midX - cx) * 0.82;
      const cpY = cy + (midY - cy) * 0.82;

      ringPaths.push(
        <path
          key={`ring-${r}-${i}`}
          d={`M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`}
        />
      );

      junctionDots.push(
        <circle
          key={`dot-${r}-${i}`}
          cx={x1}
          cy={y1}
          r={r === rings ? 1.2 : 1.6}
        />
      );
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]"
    >
      <g
        stroke="rgba(240, 245, 255, 0.88)"
        strokeWidth="1.1"
        strokeLinecap="round"
        fill="none"
      >
        {spokeLines}
      </g>
      <g
        stroke="rgba(220, 235, 255, 0.68)"
        strokeWidth="0.85"
        strokeLinecap="round"
        fill="none"
      >
        {ringPaths}
      </g>
      <g fill="rgba(255, 255, 255, 0.95)" stroke="none">
        {junctionDots}
      </g>
    </svg>
  );
}

export function SpiderWebClickEffect() {
  const [bursts, setBursts] = useState<WebBurst[]>([]);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button, a, input, textarea")) return;

    const heroSection = document.getElementById("hero");
    if (!heroSection) return;

    const rect = heroSection.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newBurst: WebBurst = {
      id: Date.now() + Math.random(),
      x,
      y,
      size: Math.floor(140 + Math.random() * 50), // Small-medium cute size (140px - 190px)
      spokes: Math.floor(8 + Math.random() * 2), // 8-9 spokes
      rings: Math.floor(4 + Math.random() * 2), // 4-5 concentric rings
    };

    setBursts((prev) => [...prev.slice(-4), newBurst]);
  }, []);

  useEffect(() => {
    const heroSection = document.getElementById("hero");
    if (!heroSection) return;

    heroSection.addEventListener("click", handleClick);
    return () => {
      heroSection.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  // Remove expired bursts after 5.5s
  useEffect(() => {
    if (bursts.length === 0) return;

    const timer = setTimeout(() => {
      setBursts((prev) => prev.slice(1));
    }, 5500);

    return () => clearTimeout(timer);
  }, [bursts]);

  return (
    // STRICTLY BACKGROUND LAYER (z-[1]), BEHIND ALL CONTENT
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute animate-cute-spider-web-fixed"
          style={{
            left: `${burst.x}px`,
            top: `${burst.y}px`,
            width: `${burst.size}px`,
            height: `${burst.size}px`,
          }}
        >
          <CuteSpiderWebSVG
            size={burst.size}
            spokes={burst.spokes}
            rings={burst.rings}
          />
        </div>
      ))}

      <style jsx global>{`
        @keyframes cuteSpiderWebFixed {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 0;
          }
          8% {
            transform: translate(-50%, -50%) scale(1.0);
            opacity: 0.95;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.0);
            opacity: 0.90;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.0);
            opacity: 0;
          }
        }
        .animate-cute-spider-web-fixed {
          animation: cuteSpiderWebFixed 5.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
