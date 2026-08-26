"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import type { GalleryImage } from "@/sanity/lib/types";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// --- TYPES ---

type GridSize = "large" | "wide" | "tall" | "med" | "small";

interface BentoItem {
  image: GalleryImage;
  size: GridSize;
  layer: number;
}

// --- CONFIG ---

const getGridClass = (size: GridSize) => {
  switch (size) {
    case "large": return "col-span-2 row-span-2";
    case "wide":  return "col-span-2 row-span-1";
    case "tall":  return "col-span-1 row-span-2";
    case "med":   return "col-span-1 row-span-1";
    case "small": return "col-span-1 row-span-1";
    default:      return "col-span-1 row-span-1";
  }
};

/**
 * Assign bento size based on the image's actual aspect ratio.
 * First image is always "large" for visual anchor.
 * Portrait  (ar < 0.8)  → tall   (1 col, 2 rows)
 * Landscape (ar > 1.4)  → wide   (2 cols, 1 row)
 * Square    (0.8–1.4)   → alternates between med and small
 */
function getSizeFromAspectRatio(index: number, aspectRatio?: number): GridSize {
  if (index === 0) return "large";
  if (!aspectRatio) return index % 2 === 0 ? "med" : "small";
  if (aspectRatio < 0.8) return "tall";
  if (aspectRatio > 1.4) return "wide";
  return index % 2 === 0 ? "med" : "small";
}

// --- MAIN COMPONENT ---

export function BentoGallery({ images }: { images: GalleryImage[] }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Mouse Parallax Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Perspective tilt values
  const rotateX = useTransform(springY, [-1, 1], [3, -3]);
  const rotateY = useTransform(springX, [-1, 1], [-3, 3]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set((x - 0.5) * 2);
    mouseY.set((y - 0.5) * 2);
  }, [isMobile, mouseX, mouseY]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const bentoItems = useMemo(() => {
    return images.map((img, i) => ({
      image: img,
      size: getSizeFromAspectRatio(i, img.aspectRatio),
      layer: (i % 3) + 1,
    }));
  }, [images]);

  return (
    <div className="min-h-screen bg-[#050505] overflow-x-hidden">
      {/* Header: keep centered with padding, only header has padding */}
      <header className="py-24 mb-0 text-center px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter text-white uppercase italic">
          VISUAL <span className="text-white/20">DIARY</span>
        </h1>
        <p className="font-mono text-[12px] text-[#444] tracking-[0.15em] uppercase">
          Moments. Memories. Proof of life.
        </p>
      </header>

      {/* Grid: full-width, no max-width, no margin, no padding */}
      <motion.div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        style={{ 
          perspective: isMobile ? "none" : "1200px",
          rotateX: isMobile ? 0 : rotateX,
          rotateY: isMobile ? 0 : rotateY,
          transformStyle: "preserve-3d"
        }}
        className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[2px] auto-rows-[320px]"
      >
        {bentoItems.map((item, i) => (
          <GridItem 
            key={item.image._id + i} 
            item={item} 
            index={i} 
            isMobile={isMobile}
            springX={springX}
            springY={springY}
            onClick={() => setSelectedIdx(i)}
          />
        ))}
      </motion.div>

      <Lightbox 
        images={images} 
        selectedIdx={selectedIdx} 
        onClose={() => setSelectedIdx(null)} 
      />
    </div>
  );
}

// --- REVEAL VARIANTS (Fix 2) ---

const cellVariants: any = {
  hidden: { opacity: 0, y: 60, scale: 0.98 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay,
    },
  }),
};

// --- ITEM COMPONENT ---

function GridItem({ item, index, isMobile, springX, springY, onClick }: any) {
  const itemRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: itemRef,
    offset: ["start end", "end start"]
  });

  // Scroll Parallax Logic
  const yRange = item.layer === 1 ? [-60, 60] : item.layer === 2 ? [-30, 30] : [-15, 15];
  const scrollY = useTransform(scrollYProgress, [0, 1], yRange);

  // Mouse Parallax Logic
  const mFactor = item.layer === 1 ? 12 : item.layer === 2 ? 6 : 3;
  const mouseParallaxX = useTransform(springX, [-1, 1], [-mFactor, mFactor]);
  const mouseParallaxY = useTransform(springY, [-1, 1], [-mFactor, mFactor]);

  const staggerDelay = (index % 3) * 0.1;

  return (
    // FIX 2: whileInView reveal
    <motion.div
      ref={itemRef}
      variants={cellVariants}
      initial="hidden"
      whileInView="visible"
      custom={staggerDelay}
      viewport={{ once: true, margin: "-50px" }}
      style={{ 
        y: isMobile ? 0 : scrollY,
        x: isMobile ? 0 : mouseParallaxX,
        translateY: isMobile ? 0 : mouseParallaxY,
        willChange: "transform",
        z: isMobile ? 0 : item.layer * 20,
        cursor: "crosshair",  // merged here — no duplicate style prop
      } as any}
      className={`relative overflow-hidden bg-[#111] ${
        isMobile ? 'col-span-1 row-span-1' : getGridClass(item.size)
      }`}
      onClick={onClick}
    >
      {/* FIX 3: Framer Motion image zoom on hover */}
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        style={{ cursor: 'crosshair' }}
      >
        <Image
          src={urlFor(item.image.image).width(1400).url()}
          alt={item.image.title}
          fill
          className="object-cover object-top w-full h-full"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </motion.div>

      {/* FIX 3: Dark overlay on hover */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(0,0,0,0.35)' }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      />

      {/* FIX 3: Top-left L-bracket */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: 12, left: 12, width: 20, height: 20 }}
        initial={{ opacity: 0, x: 4, y: 4 }}
        whileHover={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 2, background: '#FF003C' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, width: 2, height: '100%', background: '#FF003C' }} />
      </motion.div>

      {/* FIX 3: Bottom-right L-bracket */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: 12, right: 12, width: 20, height: 20 }}
        initial={{ opacity: 0, x: -4, y: -4 }}
        whileHover={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '100%', height: 2, background: '#FF003C' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 2, height: '100%', background: '#FF003C' }} />
      </motion.div>
    </motion.div>
  );
}

// --- LIGHTBOX COMPONENT ---

function Lightbox({ images, selectedIdx, onClose }: any) {
  // Initialize to 0 to avoid null; synced via effect
  const [current, setCurrent] = useState<number>(selectedIdx ?? 0);

  useEffect(() => {
    if (selectedIdx !== null && selectedIdx !== undefined) {
      setCurrent(selectedIdx);
    }
  }, [selectedIdx]);

  useEffect(() => {
    if (selectedIdx === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") setCurrent((prev: number) => (prev > 0 ? prev - 1 : images.length - 1));
      if (e.key === "ArrowRight") setCurrent((prev: number) => (prev < images.length - 1 ? prev + 1 : 0));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIdx, images.length, onClose]);

  // Safe index — always a valid number even during the first render
  const idx = current ?? selectedIdx ?? 0;

  return (
    <AnimatePresence>
      {selectedIdx !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] bg-black/97 backdrop-blur-2xl flex flex-col items-center justify-center"
          onClick={onClose}
        >
          <button className="absolute top-8 right-8 text-[#444] hover:text-[#FF003C] transition-colors">
            <X size={24} />
          </button>

          <div className="flex items-center justify-center w-full h-full relative px-4 md:px-24">
            <button 
              className="absolute left-8 z-10 w-11 h-11 rounded-full border border-[#222] flex items-center justify-center text-[#666] hover:border-[#FF003C] hover:text-[#FF003C] transition-all bg-black/80"
              onClick={(e) => { e.stopPropagation(); setCurrent((prev: number) => (prev > 0 ? prev - 1 : images.length - 1)); }}
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex flex-col items-center max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <motion.div 
                key={idx}
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                className="relative w-full aspect-[4/3] md:aspect-video max-h-[65vh]"
              >
                <Image 
                  src={urlFor(images[idx].image).width(1600).url()} 
                  alt={images[idx].title} 
                  fill 
                  className="object-contain" 
                />
              </motion.div>

              <div className="w-full mt-0 border-t border-[#1a1a1a] bg-white/[0.03] p-8 flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {images[idx].title}
                  </h3>
                  <p className="text-[#666] text-sm leading-relaxed max-w-2xl">
                    {images[idx].image?.caption || "A moment captured in time, documenting the journey of creation and discovery."}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3 self-stretch justify-between">
                   <div className="px-3 py-1 bg-[#FF003C]/10 border border-[#FF003C]/30 text-[#FF003C] font-mono text-[10px] uppercase rounded-sm">
                    {images[idx].category || "UNCATEGORIZED"}
                   </div>
                   <span className="font-mono text-[11px] text-[#444]">
                    № {(idx + 1).toString().padStart(2, '0')} / {images.length.toString().padStart(2, '0')}
                   </span>
                </div>
              </div>
            </div>

            <button 
              className="absolute right-8 z-10 w-11 h-11 rounded-full border border-[#222] flex items-center justify-center text-[#666] hover:border-[#FF003C] hover:text-[#FF003C] transition-all bg-black/80"
              onClick={(e) => { e.stopPropagation(); setCurrent((prev: number) => (prev < images.length - 1 ? prev + 1 : 0)); }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
