"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import type { GalleryImage } from "@/sanity/lib/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface FilmStripProps {
  images: GalleryImage[];
  speed?: number;
  direction?: "left" | "right";
  category?: string;
  onImageClick: (img: GalleryImage, index: number) => void;
}

function FilmStrip({ images, speed = 0.5, direction = "right", category, onImageClick }: FilmStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const requestRef = useRef<number | undefined>(undefined);

  // Loop images to fill space
  const displayImages = [...images, ...images, ...images];

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const animate = () => {
      if (!isDown) {
        const move = direction === "right" ? speed : -speed;
        strip.scrollLeft += move;
        
        // Loop behavior
        if (direction === "right" && strip.scrollLeft >= strip.scrollWidth / 2) {
          strip.scrollLeft = 0;
        } else if (direction === "left" && strip.scrollLeft <= 0) {
          strip.scrollLeft = strip.scrollWidth / 2;
        }
      }
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isDown, speed, direction]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    setStartX(e.pageX - (stripRef.current?.offsetLeft || 0));
    setScrollLeft(stripRef.current?.scrollLeft || 0);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !stripRef.current) return;
    e.preventDefault();
    const x = e.pageX - stripRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    stripRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (stripRef.current) {
      stripRef.current.scrollLeft += e.deltaY * 1.5;
    }
  };

  return (
    <div className="relative group/strip my-4">
      {category && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 origin-left text-[10px] font-mono text-[#444] tracking-[0.2em] whitespace-nowrap z-10 pointer-events-none">
          — {category.toUpperCase()}
        </div>
      )}
      
      <div 
        ref={stripRef}
        className="flex overflow-x-hidden select-none bg-[#0a0a0a] border-y-2 border-[#222] py-8 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        style={{ scrollBehavior: 'auto' }}
      >
        <div className="flex gap-4 px-12 relative">
          {/* Top Perforations */}
          <div className="absolute top-2 left-0 right-0 flex justify-around pointer-events-none">
            {Array.from({ length: displayImages.length * 4 }).map((_, i) => (
              <div key={`top-perf-${i}`} className="w-4 h-5 bg-[#1a1a1a] border border-[#333] rounded-[3px] flex-shrink-0 mx-[12px]" />
            ))}
          </div>

          {displayImages.map((img, i) => (
            <div key={`${img._id}-${i}`} className="flex flex-col items-center">
              <div 
                className="w-[280px] h-[380px] border border-[#333] overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:border-[#FF003C] hover:shadow-[0_0_20px_rgba(255,0,60,0.3)] bg-black"
                onClick={() => onImageClick(img, i % images.length)}
              >
                <Image
                  src={urlFor(img.image).width(600).url()}
                  alt={img.image?.alt || img.title}
                  width={280}
                  height={380}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              <span className="mt-2 font-mono text-[10px] text-[#444]">
                № {(i % images.length + 1).toString().padStart(2, '0')}
              </span>
            </div>
          ))}

          {/* Bottom Perforations */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-around pointer-events-none">
            {Array.from({ length: displayImages.length * 4 }).map((_, i) => (
              <div key={`bot-perf-${i}`} className="w-4 h-5 bg-[#1a1a1a] border border-[#333] rounded-[3px] flex-shrink-0 mx-[12px]" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function FilmGallery({ images }: { images: GalleryImage[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  if (images.length === 0) return null;

  // Split images into 3 rows
  const row1 = images.filter((_, i) => i % 3 === 0);
  const row2 = images.filter((_, i) => i % 3 === 1);
  const row3 = images.filter((_, i) => i % 3 === 2);

  // Fallback if rows are empty (loop them)
  const safeRow1 = row1.length > 0 ? row1 : images;
  const safeRow2 = row2.length > 0 ? row2 : images;
  const safeRow3 = row3.length > 0 ? row3 : images;

  const handleImageClick = (img: GalleryImage, originalIndex: number) => {
    // Find the actual index in the full images array to support lightbox navigation
    const fullIdx = images.findIndex(item => item._id === img._id);
    setSelectedIdx(fullIdx !== -1 ? fullIdx : 0);
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden py-20 px-4 md:px-12">
      {/* Film Grain Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.04]">
        <svg width="100%" height="100%">
          <filter id="grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grain)" />
        </svg>
      </div>

      {/* Page Vignette */}
      <div className="fixed inset-0 pointer-events-none z-[99] shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />

      {/* Edge Perforations Decoration */}
      <div className="fixed left-0 top-0 bottom-0 w-10 bg-[#0a0a0a] z-50 border-r border-[#222] hidden md:flex flex-col items-center justify-around py-4 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`left-perf-${i}`} className="w-4 h-5 bg-[#1a1a1a] border border-[#333] rounded-[3px]" />
        ))}
      </div>
      <div className="fixed right-0 top-0 bottom-0 w-10 bg-[#0a0a0a] z-50 border-l border-[#222] hidden md:flex flex-col items-center justify-around py-4 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={`right-perf-${i}`} className="w-4 h-5 bg-[#1a1a1a] border border-[#333] rounded-[3px]" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter text-white">
            VISUAL <span className="text-[#FF003C]">DIARY</span>
          </h1>
          <p className="font-mono text-[12px] text-[#444] tracking-[0.2em] uppercase">
            scroll or drag to explore →
          </p>
        </header>

        <div className="flex flex-col gap-8">
          {/* Mobile view: single strip */}
          <div className="md:hidden">
            <FilmStrip images={images} speed={0.4} direction="right" onImageClick={handleImageClick} />
            <p className="text-center font-mono text-[10px] text-[#444] mt-4 uppercase">swipe to explore →</p>
          </div>

          {/* Desktop view: 3 strips */}
          <div className="hidden md:flex flex-col gap-2">
            <FilmStrip images={safeRow1} speed={0.5} direction="right" category="Portraits" onImageClick={handleImageClick} />
            <FilmStrip images={safeRow2} speed={0.4} direction="left" category="Moments" onImageClick={handleImageClick} />
            <FilmStrip images={safeRow3} speed={0.6} direction="right" category="Workspace" onImageClick={handleImageClick} />
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-12"
            onClick={() => setSelectedIdx(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/50 hover:text-[#FF003C] transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedIdx(null); }}
            >
              <X size={32} />
            </button>

            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#FF003C] transition-all hover:scale-110"
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedIdx(prev => (prev! > 0 ? prev! - 1 : images.length - 1));
              }}
            >
              <ChevronLeft size={64} />
            </button>

            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#FF003C] transition-all hover:scale-110"
              onClick={(e) => { 
                e.stopPropagation(); 
                setSelectedIdx(prev => (prev! < images.length - 1 ? prev! + 1 : 0));
              }}
            >
              <ChevronRight size={64} />
            </button>

            <motion.div 
              key={selectedIdx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 left-4 font-mono text-[12px] text-[#555] z-10 bg-black/40 px-2 py-1">
                № {(selectedIdx + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')}
              </div>
              
              <div className="relative w-full aspect-[3/2] max-h-[75vh]">
                <Image
                  src={urlFor(images[selectedIdx].image).width(1600).url()}
                  alt={images[selectedIdx].title}
                  fill
                  className="object-contain border border-[#222]"
                />
              </div>
              
              <div className="mt-6 text-center">
                <h2 className="text-white font-mono text-sm tracking-widest uppercase mb-1">
                  {images[selectedIdx].title}
                </h2>
                <p className="text-[#888] font-mono text-[11px] max-w-lg">
                  {images[selectedIdx].category}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
