"use client";

import { useEffect, useState } from "react";
import { ReadingProgress } from "./ReadingProgress";
import { TableOfContents } from "./TableOfContents";
import { MobileTOCDrawer } from "./MobileTOCDrawer";

interface HeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface BlogPageClientProps {
  headings: HeadingItem[];
  readTime?: string;
  children: React.ReactNode;
}

export function BlogPageClient({ headings, readTime, children }: BlogPageClientProps) {
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    if (headings.length === 0) return;

    const headingElements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          const sorted = visibleEntries.sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          );
          setActiveId(sorted[0].target.id);
        }
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    headingElements.forEach((el) => observer.observe(el));

    const handleScrollFallback = () => {
      if (window.scrollY < 200 && headings.length > 0) {
        setActiveId(headings[0].id);
      }
    };
    window.addEventListener("scroll", handleScrollFallback, { passive: true });

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
      window.removeEventListener("scroll", handleScrollFallback);
    };
  }, [headings]);

  return (
    <div style={{ backgroundColor: "#050505", minHeight: "100vh" }}>
      {/* Reading Progress Bar */}
      <ReadingProgress />

      {/* Main Page Layout */}
      <div className="container mx-auto px-4 max-w-7xl py-12 md:py-20 relative">
        <div className="flex flex-col lg:flex-row gap-14 items-start justify-center">

          {/* Left: Table of Contents Sidebar */}
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-28 max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
            <TableOfContents
              headings={headings}
              activeId={activeId}
              readTime={readTime}
            />
          </aside>

          {/* Right: Content Area */}
          <main className="flex-1 max-w-[730px] w-full min-w-0">
            {children}
          </main>

        </div>
      </div>

      {/* Mobile TOC Drawer */}
      <MobileTOCDrawer
        headings={headings}
        activeId={activeId}
        readTime={readTime}
      />
    </div>
  );
}
