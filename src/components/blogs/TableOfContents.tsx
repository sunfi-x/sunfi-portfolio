// src/components/blogs/TableOfContents.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Link as LinkIcon, Check, ArrowUp, Clock, BarChart2 } from "lucide-react";

interface HeadingItem {
  id: string;
  text: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  headings: HeadingItem[];
  activeId: string;
  readTime?: string;
}

export function TableOfContents({ headings, activeId, readTime }: TableOfContentsProps) {
  const [copied, setCopied] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(progress, 100));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav className="flex flex-col gap-4 text-sm font-sans select-none">

      {/* Back link */}
      <Link
        href="/blogs"
        className="flex items-center gap-2 text-[11px] font-semibold text-white/25 hover:text-white/60 transition-colors duration-200 group mb-1"
      >
        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform duration-200" />
        Back to Writing
      </Link>

      {/* Reading Progress */}
      {readTime && (
        <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[10px] font-bold tracking-[2px] text-white/30 uppercase">Reading Progress</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px] text-white/35">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-white/25" />
                <span>{readTime}</span>
              </div>
              <span className="font-mono text-white/25">{Math.round(scrollProgress)}%</span>
            </div>
            <div className="h-[2px] w-full bg-white/[0.05] rounded-full overflow-hidden">
              <div
                className="h-full bg-white/50 rounded-full transition-all duration-150 ease-out"
                style={{ width: `${scrollProgress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Table of Contents */}
      <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-xl">
        <h3 className="text-[10px] font-bold tracking-[2px] text-white/30 uppercase mb-4">
          On This Page
        </h3>

        {headings.length === 0 ? (
          <p className="text-white/20 text-xs italic">No headings found.</p>
        ) : (
          <ul className="flex flex-col gap-0.5 border-l border-white/[0.06]">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <li
                  key={heading.id}
                  style={{ marginLeft: "-1px" }}
                >
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleScrollTo(e, heading.id)}
                    className={`block py-1.5 border-l-2 text-[12px] leading-snug transition-all duration-200 ${
                      heading.level === 3 ? "pl-5" : "pl-3.5"
                    } ${
                      isActive
                        ? "text-white/90 border-white/60 font-medium"
                        : "text-white/35 border-transparent hover:text-white/65 hover:border-white/20"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-xl space-y-3">
        <h3 className="text-[10px] font-bold tracking-[2px] text-white/30 uppercase">
          Quick Actions
        </h3>

        <div className="flex flex-col gap-2">
          {/* Copy link */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-2.5 text-[12px] text-white/35 hover:text-white/70 transition-colors duration-200 text-left w-full cursor-pointer py-1 group"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-medium">Copied!</span>
              </>
            ) : (
              <>
                <LinkIcon className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform duration-200" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Scroll to Top */}
          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2.5 text-[12px] text-white/35 hover:text-white/70 transition-colors duration-200 text-left w-full cursor-pointer py-1 group"
          >
            <ArrowUp className="w-3.5 h-3.5 shrink-0 group-hover:-translate-y-0.5 transition-transform duration-200" />
            <span>Scroll to Top</span>
          </button>
        </div>
      </div>

    </nav>
  );
}
