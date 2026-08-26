"use client";

import { useState, useEffect } from "react";
import { ListCollapse, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TableOfContents } from "./TableOfContents";

interface HeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface MobileTOCDrawerProps {
  headings: HeadingItem[];
  activeId: string;
  readTime?: string;
}

export function MobileTOCDrawer({ headings, activeId, readTime }: MobileTOCDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Auto-close when clicking a link
  useEffect(() => {
    setIsOpen(false);
  }, [activeId]);

  return (
    <>
      {/* Floating contents button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full bg-white hover:bg-gray-100 text-black font-semibold shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:scale-105 transition-all duration-200 ease-in-out cursor-pointer"
      >
        <ListCollapse className="w-4 h-4" />
        <span className="text-[12px] tracking-wider uppercase">Contents</span>
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-up Drawer */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#111111] border-t border-[#1a1a1a] rounded-t-2xl max-h-[80vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a1a]">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Table of Contents
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contents list */}
              <div className="flex-1 overflow-y-auto px-6 py-6 select-none">
                <TableOfContents
                  headings={headings}
                  activeId={activeId}
                  readTime={readTime}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
