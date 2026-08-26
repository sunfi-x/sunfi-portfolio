"use client";

import { useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { motion } from "framer-motion";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Quicksand } from "next/font/google";
import { urlFor } from "@/sanity/lib/image";
import type { GalleryImage } from "@/sanity/lib/types";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// ── Blink keyframe injected once via a style tag ─────────────────────────────
const BLINK_STYLE = `@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }`;


// ─── Lightbox slides ─────────────────────────────────────────────────────────

function buildSlides(images: GalleryImage[]) {
  return images.map((img) => ({
    src: urlFor(img.image).width(1800).url(),
    alt: img.image.alt ?? img.title,
    width: img.width,
    height: img.height,
  }));
}

// ─── Reveal animation ────────────────────────────────────────────────────────

const cellVariants: any = {
  hidden: { opacity: 0, y: 48, scale: 0.97 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.25, 0.46, 0.45, 0.94],
      delay,
    },
  }),
};

// ─── Breakpoints ─────────────────────────────────────────────────────────────

const BREAKPOINTS = {
  default: 3,
  1024: 2,
  640: 2,
};

// ─── Main component ───────────────────────────────────────────────────────────

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState(-1);
  const slides = buildSlides(images);

  return (
    <div className={`min-h-screen bg-black ${quicksand.className}`} style={{ backgroundColor: '#000000' }}>
      {/* ── Blink keyframe ── */}
      <style>{BLINK_STYLE}</style>

      {/* ── Header ── */}
      <header className="px-8 md:px-16 py-20 bg-black" style={{ backgroundColor: '#000000' }}>
        <h1 style={{ fontFamily: 'Quicksand, sans-serif', color: '#FFFFFF' }} className="text-4xl md:text-6xl font-bold uppercase mb-8">
          STORIES WITHOUT WORDS
        </h1>

        <div style={{ maxWidth: '380px' }}>
          <p style={{
            fontFamily: 'Quicksand, sans-serif',
            color: '#aaaaaa',
            fontStyle: 'italic',
            fontSize: '13px',
            lineHeight: '2',
          }}>
            "All I want to do<br />
            is trade this life for something new,<br />
            holding on to what I haven't got.
            <span style={{
              color: '#FF0000',
              marginLeft: '2px',
              animation: 'blink 1s step-end infinite',
            }}>|</span>"
          </p>

          <p style={{
            fontFamily: 'Quicksand, sans-serif',
            color: '#FF0000',
            fontSize: '11px',
            marginTop: '10px',
            textAlign: 'left',
            paddingLeft: '32px',
            letterSpacing: '0.05em',
            borderTop: '1px solid #1a1a1a',
            paddingTop: '8px',
          }}>
            — Waiting for the End | Linkin Park
          </p>
        </div>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </header>

      {/* ── Masonry grid ── */}
      <div className="px-[2px] bg-black" style={{ backgroundColor: '#000000' }}>
        <Masonry
          breakpointCols={BREAKPOINTS}
          className="flex gap-[2px] w-auto bg-black"
          style={{ backgroundColor: '#000000' }}
          columnClassName="flex flex-col gap-[2px] bg-black bg-clip-padding"
        >
          {images.map((img, i) => (
            <GalleryCell
              key={img._id}
              image={img}
              index={i}
              onOpen={() => setIndex(i)}
            />
          ))}
        </Masonry>
      </div>

      {/* ── Lightbox ── */}
      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(0,0,0,0.97)" } }}
      />
    </div>
  );
}

// ─── Individual cell ──────────────────────────────────────────────────────────

function GalleryCell({
  image,
  index,
  onOpen,
}: {
  image: GalleryImage;
  index: number;
  onOpen: () => void;
}) {
  const staggerDelay = (index % 3) * 0.08;

  return (
    <motion.div
      variants={cellVariants}
      initial="hidden"
      whileInView="visible"
      custom={staggerDelay}
      viewport={{ once: true, margin: "-40px" }}
      className="relative group overflow-hidden bg-[#111] cursor-crosshair"
      onClick={onOpen}
    >
      {/* ── Image: natural aspect ratio + simultaneous grayscale→color + zoom ── */}
      <div className="overflow-hidden">
        <Image
          src={urlFor(image.image).width(900).url()}
          alt={image.image.alt ?? image.title}
          width={image.width || 900}
          height={image.height || 600}
          style={{ width: "100%", height: "auto", display: "block" }}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="w-full transition-all duration-700 ease-in-out filter grayscale group-hover:grayscale-0 scale-100 group-hover:scale-[1.05] origin-center"
        />
      </div>

      {/* ── Dark overlay ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.42)" }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.35, ease: "easeInOut" }}
      />

      {/* ── Title / category reveal ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-5 pointer-events-none"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <p className="text-white font-semibold text-base leading-tight">
          {image.title}
        </p>
        {image.category && (
          <p className="text-white/50 text-xs mt-1 font-mono uppercase tracking-widest">
            {image.category}
          </p>
        )}
      </motion.div>

      {/* ── Top-left L-bracket ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: 12, left: 12, width: 20, height: 20 }}
        initial={{ opacity: 0, x: 5, y: 5 }}
        whileHover={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 2, background: "#FF0000" }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: 2, height: "100%", background: "#FF0000" }} />
      </motion.div>

      {/* ── Bottom-right L-bracket ── */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ bottom: 12, right: 12, width: 20, height: 20 }}
        initial={{ opacity: 0, x: -5, y: -5 }}
        whileHover={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "100%", height: 2, background: "#FF0000" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: 2, height: "100%", background: "#FF0000" }} />
      </motion.div>
    </motion.div>
  );
}
