"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Camera, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { urlFor } from "@/sanity/lib/image";
import type { GalleryImage } from "@/sanity/lib/types";

interface GalleryPreviewProps {
  images?: GalleryImage[];
}

function GalleryCard({ img }: { img: GalleryImage }) {
  const src = urlFor(img.image).width(600).height(800).fit("crop").url();

  return (
    <div 
      style={{
        minWidth: "280px",
        height: "380px",
        borderRadius: "16px",
        overflow: "hidden",
        flexShrink: 0,
        position: "relative",
        cursor: "pointer",
        transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        border: "1px solid #ffffff10"
      }}
      className="gallery-card-hover group"
    >
      <style jsx>{`
        .gallery-card-hover:hover {
          box-shadow: 0 0 20px rgba(224, 41, 29, 0.3);
          border-color: #e0291d40 !important;
        }
      `}</style>
      <div 
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Image
          src={src}
          alt={img.image.alt ?? img.title ?? "Gallery photo"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="280px"
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      {img.title && (
        <p className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 leading-snug pointer-events-none">
          {img.title}
        </p>
      )}
    </div>
  );
}

export function GalleryPreview({ images = [] }: GalleryPreviewProps) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const preview = images.slice(0, 10); // Show more for carousel

  // Removed custom vertical-to-horizontal wheel jacking.
  // It causes unavoidable jank/stuttering due to main-thread vs compositor thread conflicts.
  // Native horizontal scrolling (Trackpad sideways swipe, Shift+Wheel, or the Left/Right buttons) 
  // is the industry standard for perfect smoothness.

  // Update active index on scroll
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const handleScroll = () => {
      const index = Math.round(slider.scrollLeft / 296); // 280 width + 16 gap
      setActiveIndex(index);
    };

    slider.addEventListener("scroll", handleScroll);
    return () => slider.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-24 relative overflow-hidden bg-black">
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4" style={{ fontFamily: 'Quicksand, sans-serif' }}>
            Browse Me
          </h2>
          <p style={{
            fontFamily: "'Quicksand', sans-serif",
            fontSize: "16px",
            fontWeight: "600",
            color: "#ffffff",
            textAlign: "center",
            margin: "8px 0 24px 0",
            letterSpacing: "0.4px",
            fontStyle: "normal",
            background: "linear-gradient(90deg, #aaa 0%, #ffffff 50%, #aaa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Life is a beautiful dataset; because life doesn't have a 'save' button.
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative group/carousel">
          {/* Navigation Arrows */}
          <button 
            onClick={() => sliderRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
            className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-[#e0291d] hover:border-[#e0291d]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => sliderRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-white z-20 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300 hover:bg-[#e0291d] hover:border-[#e0291d]"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div 
            ref={sliderRef}
            style={{
              display: "flex",
              overflowX: "auto",
              gap: "16px",
              padding: "16px 8px",
              cursor: "grab",
              msOverflowStyle: "none",
              scrollbarWidth: "none"
            }}
            className="no-scrollbar"
          >
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {preview.map((img) => (
              <GalleryCard key={img._id} img={img} />
            ))}
          </div>
        </div>

        {/* Scroll indicator dots */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "6px",
          marginTop: "24px"
        }}>
          {preview.map((_, i) => (
            <div key={i} style={{
              width: activeIndex === i ? "20px" : "6px",
              height: "6px",
              borderRadius: "3px",
              backgroundColor: activeIndex === i ? "#e0291d" : "#444",
              transition: "all 0.3s ease"
            }} />
          ))}
        </div>

        {/* Browse Gallery CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/gallery"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-transparent rounded-full border border-[#e0291d40] text-white font-semibold hover:border-[#e0291d] hover:shadow-[0_0_25px_rgba(224,41,29,0.3)] transition-all duration-300"
            style={{ fontFamily: 'Quicksand, sans-serif' }}
          >
            <Camera className="w-5 h-5 text-[#e0291d]" />
            <span>Browse Gallery</span>
            <ArrowRight className="w-4 h-4 text-[#e0291d] group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

