"use client";

import React, { useRef, useState } from "react";

export default function SpotlightFooter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <footer
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-[80vh] min-h-[600px] bg-black flex items-center justify-center overflow-hidden cursor-default"
    >
      {/* Dim Base Layer */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <h1 className="text-[15vw] md:text-[250px] font-black text-white/[0.03] tracking-tighter leading-none select-none">
          SUNFI
        </h1>
      </div>

      {/* Reveal Layer */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-500 ease-out"
        style={{
          opacity: isHovered ? 1 : 0,
          WebkitMaskImage: `radial-gradient(circle 400px at ${position.x}px ${position.y}px, black 10%, transparent 80%)`,
          maskImage: `radial-gradient(circle 400px at ${position.x}px ${position.y}px, black 10%, transparent 80%)`,
        }}
      >
        <h1 className="text-[15vw] md:text-[250px] font-black text-white tracking-tighter leading-none select-none drop-shadow-[0_0_50px_rgba(255,255,255,0.4)]">
          SUNFI
        </h1>
      </div>
    </footer>
  );
}
