"use client";

import React, { useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import Image from "next/image";
import { Components } from "react-markdown";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

/** Internal portfolio routes that should render as Next.js <Link> elements */
const INTERNAL_ROUTES = ["/projects", "/papers", "/blogs", "/contact", "/resume", "/gallery", "/writing"];

function isInternalRoute(href: string): boolean {
  return INTERNAL_ROUTES.some((r) => href.startsWith(r));
}

const markdownComponents: Components = {
  // Custom link renderer — links render in clean blue (#60A5FA / #3B82F6)
  a({ href, children }) {
    if (!href) return <span>{children}</span>;
    if (isInternalRoute(href)) {
      return (
        <Link
          href={href}
          className="text-[#60A5FA] font-medium underline underline-offset-2 hover:text-[#93C5FD] transition-colors"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#60A5FA] font-medium underline underline-offset-2 hover:text-[#93C5FD] transition-colors"
      >
        {children}
      </a>
    );
  },

  // Code blocks with dark bg
  code({ className, children, ...props }) {
    const isBlock = className?.startsWith("language-");
    if (isBlock) {
      return (
        <pre className="bg-[#0f1012] border border-white/[0.08] rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono leading-relaxed">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      );
    }
    return (
      <code
        className="bg-white/[0.08] text-[#93C5FD] rounded px-1.5 py-0.5 text-xs font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },

  // Paragraphs
  p({ children }) {
    return <p className="mb-2.5 last:mb-0 leading-relaxed font-quicksand text-[#e2e8f0]">{children}</p>;
  },

  // Lists
  ul({ children }) {
    return <ul className="list-disc list-inside mb-2.5 space-y-1 pl-1 font-quicksand text-[#e2e8f0]">{children}</ul>;
  },
  ol({ children }) {
    return <ol className="list-decimal list-inside mb-2.5 space-y-1 pl-1 font-quicksand text-[#e2e8f0]">{children}</ol>;
  },
  li({ children }) {
    return <li className="text-sm leading-relaxed font-quicksand text-[#e2e8f0]">{children}</li>;
  },

  // Headings
  h1({ children }) {
    return <h1 className="font-semibold text-base mb-2 text-white font-quicksand">{children}</h1>;
  },
  h2({ children }) {
    return <h2 className="font-semibold text-sm mb-1.5 text-white font-quicksand">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="font-medium text-sm mb-1 text-white font-quicksand">{children}</h3>;
  },

  // Blockquote
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-[#60A5FA]/70 pl-3 my-2.5 italic text-slate-300 font-quicksand">
        {children}
      </blockquote>
    );
  },

  // Strong / Em
  strong({ children }) {
    return <strong className="font-semibold text-white font-quicksand">{children}</strong>;
  },
  em({ children }) {
    return <em className="text-slate-300 italic font-quicksand">{children}</em>;
  },

  // Horizontal rule
  hr() {
    return <hr className="border-white/[0.08] my-3" />;
  },
};

/** Animated 3-dot blinking cursor shown while streaming AI replies */
function StreamingCursor() {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1 align-baseline text-[#60A5FA]">
      <span className="animate-pulse font-bold text-sm" style={{ animationDuration: "0.8s", animationDelay: "0ms" }}>.</span>
      <span className="animate-pulse font-bold text-sm" style={{ animationDuration: "0.8s", animationDelay: "200ms" }}>.</span>
      <span className="animate-pulse font-bold text-sm" style={{ animationDuration: "0.8s", animationDelay: "400ms" }}>.</span>
    </span>
  );
}

export function ChatMessage({ role, content, isStreaming = false }: ChatMessageProps) {
  const isUser = role === "user";
  const contentRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when streaming
  useEffect(() => {
    if (isStreaming && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [content, isStreaming]);

  // User Message Box: Oxford Blue (#212A37)
  if (isUser) {
    return (
      <div className="flex justify-end mb-3.5">
        <div
          className="max-w-[85%] px-4 py-2.5 rounded-2xl rounded-tr-xs text-sm font-quicksand text-white shadow-xs"
          style={{
            backgroundColor: "#212A37", // Oxford Blue: #212A37
            border: "1px solid rgba(255, 255, 255, 0.1)",
            fontFamily: "var(--font-quicksand), sans-serif",
          }}
        >
          <p className="leading-relaxed whitespace-pre-wrap break-words font-quicksand text-[#f1f5f9]">{content}</p>
        </div>
      </div>
    );
  }

  // Assistant Message Box: Gunmetal (#1D1F21)
  return (
    <div className="flex justify-start mb-3.5" ref={contentRef}>
      {/* Avatar Image — sazzadsunfi.jpg */}
      <div className="flex-shrink-0 relative w-7 h-7 rounded-full overflow-hidden mr-2.5 mt-0.5 border border-white/20 shadow-xs">
        <Image
          src="/sazzadsunfi.jpg"
          alt="Sunfi"
          fill
          className="object-cover"
          sizes="28px"
        />
      </div>

      <div
        className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-xs text-sm text-[#e2e8f0] shadow-xs font-quicksand"
        style={{
          backgroundColor: "#1D1F21",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          fontFamily: "var(--font-quicksand), sans-serif",
        }}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {content}
        </ReactMarkdown>
        {isStreaming && <StreamingCursor />}
      </div>
    </div>
  );
}
