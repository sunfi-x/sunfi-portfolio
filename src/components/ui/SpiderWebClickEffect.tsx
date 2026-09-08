"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface WebBurst {
  id: number;
  x: number;
  y: number;
  rotation: number;
  size: number;
}

export function SpiderWebClickEffect() {
  const [bursts, setBursts] = useState<WebBurst[]>([]);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Do not spawn web if clicking interactive buttons, inputs or links directly
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
      rotation: Math.floor(Math.random() * 360),
      size: Math.floor(260 + Math.random() * 80), // 260px - 340px (balanced medium size)
    };

    setBursts((prev) => [...prev.slice(-4), newBurst]); // Max 5 active webs
  }, []);

  useEffect(() => {
    const heroSection = document.getElementById("hero");
    if (!heroSection) return;

    heroSection.addEventListener("click", handleClick);
    return () => {
      heroSection.removeEventListener("click", handleClick);
    };
  }, [handleClick]);

  // Remove expired bursts after total animation lifetime (5000ms: 3.5s sticky + 1.5s slow fade)
  useEffect(() => {
    if (bursts.length === 0) return;

    const timer = setTimeout(() => {
      setBursts((prev) => prev.slice(1));
    }, 5000);

    return () => clearTimeout(timer);
  }, [bursts]);

  return (
    // STRICTLY BACKGROUND LAYER (z-[1]), BEHIND ALL CONTENT (z-[10])
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-spider-web-lingering"
          style={{
            left: `${burst.x}px`,
            top: `${burst.y}px`,
            width: `${burst.size}px`,
            height: `${burst.size}px`,
            transform: `translate(-50%, -50%) rotate(${burst.rotation}deg)`,
          }}
        >
          {/* Authentic spidernet.png image asset with crisp contrast and glow */}
          <div className="relative w-full h-full opacity-80 drop-shadow-[0_0_15px_rgba(255,255,255,0.35)]">
            <Image
              src="/spiderman/spidernet.png"
              alt="Spider Web"
              fill
              className="object-contain filter invert"
              priority
            />
          </div>
        </div>
      ))}

      <style jsx global>{`
        @keyframes spiderWebLingering {
          0% {
            transform: translate(-50%, -50%) scale(0.15) rotate(0deg);
            opacity: 0.95;
          }
          12% {
            transform: translate(-50%, -50%) scale(1.0) rotate(8deg);
            opacity: 0.85;
          }
          70% {
            transform: translate(-50%, -50%) scale(1.02) rotate(10deg);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.08) rotate(15deg);
            opacity: 0;
          }
        }
        .animate-spider-web-lingering {
          animation: spiderWebLingering 5.0s cubic-bezier(0.1, 0.9, 0.2, 1) forwards;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  );
}
