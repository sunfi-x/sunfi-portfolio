"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, X, Terminal, Layers, Layout, Database } from "lucide-react";

export interface GalleryItem {
  title: string;
  caption: string;
  type: "ui" | "architecture" | "schema" | "admin";
  src?: string;
}

interface ProjectImageGalleryProps {
  galleryItems: GalleryItem[];
  fallbackImage?: string;
  projectTitle: string;
}

export function ProjectImageGallery({
  galleryItems,
  fallbackImage,
  projectTitle,
}: ProjectImageGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const items: GalleryItem[] =
    galleryItems && galleryItems.length > 0
      ? galleryItems
      : [
          {
            title: `${projectTitle} UI Dashboard`,
            caption: "Main interactive management dashboard user interface",
            type: "ui",
            src: fallbackImage,
          },
          {
            title: `${projectTitle} System Architecture`,
            caption: "End-to-end data pipeline & component visual flowchart",
            type: "architecture",
            src: fallbackImage,
          },
        ];

  const filteredItems = items.filter((item) => {
    if (activeFilter === "all") return true;
    return item.type === activeFilter;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case "ui":
        return <Layout className="w-3.5 h-3.5 text-sky-400" />;
      case "architecture":
        return <Layers className="w-3.5 h-3.5 text-purple-400" />;
      case "schema":
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Terminal className="w-3.5 h-3.5 text-[#10B981]" />;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Category Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 flex-wrap font-mono text-xs">
          {[
            { id: "all", label: "All Screenshots" },
            { id: "ui", label: "UI Screenshots" },
            { id: "architecture", label: "Architecture Diagrams" },
            { id: "schema", label: "Schema & Flow" },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-[#22242A] text-white font-bold border-white/20 shadow-xs"
                    : "bg-[#141416] text-gray-400 border-white/[0.08] hover:text-white hover:border-white/20"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <span className="text-gray-500 font-mono text-xs">
          {filteredItems.length} {filteredItems.length === 1 ? "Visual" : "Visuals"}
        </span>
      </div>

      {/* Grid Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map((item, idx) => {
          const imageSrc = item.src || fallbackImage;

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0f0f0f] hover:border-white/30 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              {/* Image Preview Container */}
              <div className="relative w-full aspect-[16/10] bg-[#080808] overflow-hidden">
                {imageSrc ? (
                  <Image
                    src={imageSrc}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-gray-500 font-mono space-y-2">
                    <Terminal className="w-8 h-8 text-white/20" />
                    <span className="text-xs uppercase tracking-wider">{item.title}</span>
                  </div>
                )}

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="p-3 rounded-full bg-black/80 border border-white/20 text-white backdrop-blur-xs flex items-center gap-2 font-mono text-xs shadow-xl">
                    <Maximize2 className="w-4 h-4 text-[#10B981]" />
                    <span>Expand Preview</span>
                  </div>
                </div>
              </div>

              {/* Caption Footer */}
              <div className="p-4 bg-[#0f0f0f] border-t border-white/[0.06] flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getIconForType(item.type)}
                    <h4 className="text-sm font-semibold text-white font-quicksand">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-400 font-light leading-normal line-clamp-2">
                    {item.caption}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08] text-[10px] font-mono uppercase text-gray-400 shrink-0">
                  {item.type}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxItem(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full bg-[#121212] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#0a0a0a]">
                <div className="flex items-center gap-2.5">
                  {getIconForType(lightboxItem.type)}
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-white font-quicksand">
                      {lightboxItem.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-mono">{lightboxItem.caption}</p>
                  </div>
                </div>
                <button
                  onClick={() => setLightboxItem(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Image Area */}
              <div className="relative w-full aspect-[16/9] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
                {lightboxItem.src || fallbackImage ? (
                  <Image
                    src={lightboxItem.src || fallbackImage!}
                    alt={lightboxItem.title}
                    fill
                    className="object-contain"
                  />
                ) : (
                  <div className="p-12 text-center font-mono text-gray-500 space-y-3">
                    <Terminal className="w-12 h-12 mx-auto text-white/30" />
                    <p>{lightboxItem.title}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
