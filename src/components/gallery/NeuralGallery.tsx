"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import type { GalleryImage } from "@/sanity/lib/types";
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

// --- HELPERS ---

const generatePositions = (count: number, width: number, height: number) => {
  const positions: { x: number; y: number }[] = [];
  const minDist = 220; // Increased distance for clarity
  const padding = 150;
  
  for (let i = 0; i < count; i++) {
    let attempts = 0;
    let pos: { x: number; y: number } = { x: 0, y: 0 };
    do {
      pos = {
        x: Math.random() * (width - padding * 2) + padding,
        y: Math.random() * (height - padding * 2) + padding,
      };
      attempts++;
    } while (
      positions.some(p => Math.hypot(p.x - pos.x, p.y - pos.y) < minDist) && 
      attempts < 100
    );
    positions.push(pos);
  }
  return positions;
};

const getConnections = (positions: { x: number; y: number }[]) => {
  const connections: { from: number; to: number }[] = [];
  const maxLineLength = 400;

  positions.forEach((pos, i) => {
    const distances = positions
      .map((p, j) => ({ j, dist: Math.hypot(p.x - pos.x, p.y - pos.y) }))
      .filter(d => d.j !== i && d.dist < maxLineLength)
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 2); // Connect to 2 nearest

    distances.forEach(d => {
      if (!connections.find(c => (c.from === i && c.to === d.j) || (c.from === d.j && c.to === i))) {
        connections.push({ from: i, to: d.j });
      }
    });
  });
  return connections;
};

// --- COMPONENTS ---

export function NeuralGallery({ images }: { images: GalleryImage[] }) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [displayCount, setDisplayCount] = useState(15);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentImages = useMemo(() => images.slice(0, displayCount), [images, displayCount]);

  const positions = useMemo(() => {
    if (windowSize.width === 0) return [];
    return generatePositions(currentImages.length, windowSize.width, windowSize.height);
  }, [currentImages.length, windowSize]);

  const connections = useMemo(() => getConnections(positions), [positions]);

  if (windowSize.width === 0) return null;

  // --- MOBILE VIEW ---
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#050505] py-20 px-6">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tighter text-white">
            VISUAL <span className="text-[#FF003C]">DIARY</span>
          </h1>
        </header>
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, i) => (
            <motion.div 
              key={img._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="aspect-square relative rounded-lg overflow-hidden border border-white/10"
              onClick={() => setSelectedIdx(i)}
            >
              <Image src={urlFor(img.image).width(400).url()} alt={img.title} fill className="object-cover" />
            </motion.div>
          ))}
        </div>
        <Lightbox images={images} selectedIdx={selectedIdx} onClose={() => setSelectedIdx(null)} />
      </div>
    );
  }

  // --- DESKTOP NEURAL VIEW ---
  return (
    <div className="relative w-full min-h-screen bg-[#050505] overflow-hidden cursor-default select-none">
      {/* Background FX */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3%3Cfilter id='noiseFilter'%3%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
      <div className="fixed inset-0 pointer-events-none z-0" 
           style={{ backgroundImage: `radial-gradient(#ffffff08 1px, transparent 1px)`, backgroundSize: '24px 24px' }} />

      <div className="relative z-10 max-w-7xl mx-auto pt-24 text-center">
        <h1 className="text-6xl font-bold mb-4 tracking-tighter text-white">
          VISUAL <span className="text-[#FF003C]">DIARY</span>
        </h1>
        <div className="font-mono text-[10px] text-[#444] tracking-[0.15em] uppercase flex items-center justify-center gap-4">
          <span>◈ {images.length} NODES</span>
          <span>·</span>
          <span>◈ {connections.length} CONNECTIONS</span>
          <span>·</span>
          <span className="text-[#FF003C]/60 animate-pulse">◈ NETWORK ACTIVE</span>
        </div>
      </div>

      {/* SVG Connections Layer */}
      <svg className="absolute inset-0 w-full h-full z-1 pointer-events-none">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        {connections.map((conn, i) => {
          const from = positions[conn.from];
          const to = positions[conn.to];
          const isHighlighted = hoveredNode === conn.from || hoveredNode === conn.to;
          
          return (
            <g key={`conn-${i}`}>
              <path
                id={`line-${i}`}
                d={`M ${from.x} ${from.y} L ${to.x} ${to.y}`}
                stroke={isHighlighted ? "rgba(255, 0, 60, 0.6)" : "rgba(255, 0, 60, 0.15)"}
                strokeWidth={isHighlighted ? 1.5 : 1}
                fill="none"
                style={{ transition: 'all 0.3s ease', filter: isHighlighted ? 'drop-shadow(0 0 4px rgba(255,0,60,0.4))' : 'none' }}
              />
              {/* Data Packet */}
              <circle r="2" fill="#FF003C" filter="url(#glow)">
                <animateMotion
                  dur={`${3 + Math.random() * 4}s`}
                  repeatCount="indefinite"
                  begin={`${Math.random() * 2}s`}
                >
                  <mpath href={`#line-${i}`} />
                </animateMotion>
              </circle>
            </g>
          );
        })}
      </svg>

      {/* Nodes Layer */}
      <div className="absolute inset-0 z-2">
        {currentImages.map((img, i) => (
          <Node 
            key={img._id} 
            image={img} 
            pos={positions[i]} 
            index={i}
            isHovered={hoveredNode === i}
            onHover={() => setHoveredNode(i)}
            onLeave={() => setHoveredNode(null)}
            onClick={() => setSelectedIdx(i)}
          />
        ))}
      </div>

      {displayCount < images.length && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30">
          <button 
            onClick={() => setDisplayCount(prev => prev + 10)}
            className="px-6 py-2 bg-black border border-white/10 text-white font-mono text-[10px] tracking-widest hover:border-[#FF003C] hover:text-[#FF003C] transition-all"
          >
            LOAD_MORE_NODES
          </button>
        </div>
      )}

      <Lightbox images={images} selectedIdx={selectedIdx} onClose={() => setSelectedIdx(null)} />
    </div>
  );
}

function Node({ image, pos, index, isHovered, onHover, onLeave, onClick }: any) {
  if (!pos) return null;

  return (
    <motion.div
      className="absolute flex flex-col items-center justify-center"
      style={{ x: pos.x, y: pos.y, translateX: '-50%', translateY: '-50%' }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <motion.div
        layout
        initial={false}
        animate={isHovered ? "hovered" : "default"}
        variants={{
          default: { width: 44, height: 44, borderRadius: "50%", zIndex: 1 },
          hovered: { width: 220, height: 280, borderRadius: "8px", zIndex: 50 }
        }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative border-[1.5px] border-[#FF003C]/50 bg-[#FF003C]/10 overflow-hidden cursor-pointer shadow-[0_0_12px_rgba(255,0,60,0.2)]"
        style={{ transformOrigin: 'center' }}
      >
        {!isHovered ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-[#FF003C] rounded-full shadow-[0_0_8px_#FF003C]" 
            />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full h-full relative">
            <Image 
              src={urlFor(image.image).width(400).url()} 
              alt={image.title} 
              fill 
              className="object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <p className="text-[9px] text-[#FF003C] font-bold uppercase tracking-wider mb-1">{image.category}</p>
              <p className="text-white font-mono text-[10px] leading-tight line-clamp-2">{image.title}</p>
              <span className="absolute bottom-3 right-3 text-[9px] font-mono text-white/30">№{(index + 1).toString().padStart(2, '0')}</span>
            </div>
          </motion.div>
        )}
      </motion.div>
      {!isHovered && (
        <span className="mt-2 font-mono text-[8px] text-[#FF003C]/30 tracking-widest uppercase">
          NODE_{(index + 1).toString().padStart(2, '0')}
        </span>
      )}
    </motion.div>
  );
}

function Lightbox({ images, selectedIdx, onClose }: any) {
  const [current, setCurrent] = useState(selectedIdx);

  useEffect(() => {
    setCurrent(selectedIdx);
    if (selectedIdx !== null) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
        if (e.key === "ArrowLeft") setCurrent((prev: number) => (prev > 0 ? prev - 1 : images.length - 1));
        if (e.key === "ArrowRight") setCurrent((prev: number) => (prev < images.length - 1 ? prev + 1 : 0));
      };
      window.addEventListener("keydown", handleEsc);
      return () => window.removeEventListener("keydown", handleEsc);
    }
  }, [selectedIdx, images.length, onClose]);

  return (
    <AnimatePresence>
      {selectedIdx !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4"
          onClick={onClose}
        >
          <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-[#FF003C] transition-colors">
            <X size={24} />
          </button>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[11px] text-[#555] tracking-widest">
            № {(current + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')}
          </div>

          <div className="flex items-center gap-8 w-full max-w-7xl justify-center">
            <button 
              onClick={(e) => { e.stopPropagation(); setCurrent((prev: number) => (prev > 0 ? prev - 1 : images.length - 1)); }}
              className="hidden md:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center text-white/30 hover:border-[#FF003C] hover:text-[#FF003C] transition-all"
            >
              <ChevronLeft size={20} />
            </button>

            <motion.div 
              key={current}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-[85vw] md:w-[60vw] aspect-video max-h-[75vh]">
                <Image src={urlFor(images[current].image).width(1600).url()} alt={images[current].title} fill className="object-contain border border-white/5" />
              </div>
              <p className="mt-8 font-mono text-white/60 text-sm tracking-wide text-center">{images[current].title}</p>
            </motion.div>

            <button 
              onClick={(e) => { e.stopPropagation(); setCurrent((prev: number) => (prev < images.length - 1 ? prev + 1 : 0)); }}
              className="hidden md:flex w-12 h-12 rounded-full border border-white/10 items-center justify-center text-white/30 hover:border-[#FF003C] hover:text-[#FF003C] transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
