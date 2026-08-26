"use client";

import { useState, useEffect, useRef } from "react";
import { Check, Copy } from "lucide-react";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";

interface PreBlockProps {
  code: string;
  language: string;
  filename?: string;
}

export function PreBlock({ code, language, filename }: PreBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      // Remove any previously generated hljs class to avoid double-processing
      codeRef.current.removeAttribute("data-highlighted");
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  // Standardize language display
  const displayLanguage = language === "javascript" ? "JS" 
                        : language === "typescript" ? "TS"
                        : language === "markdown" ? "MD"
                        : language;

  return (
    <div className="my-8 rounded-lg overflow-hidden border border-[#1f1f1f] bg-[#0d0d0d] font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0d0d0d] border-b border-[#1f1f1f] text-xs">
        <div className="flex items-center gap-2 font-mono text-[#555555]">
          <span className="uppercase font-bold text-gray-400 tracking-wider text-[11px]">
            {displayLanguage}
          </span>
          {filename && (
            <>
              <span className="text-[#1f1f1f]">•</span>
              <span className="text-gray-400 text-[11px] font-medium">{filename}</span>
            </>
          )}
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 font-mono text-[#555555] hover:text-white transition-colors duration-200 cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-green-500 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <pre className="p-4 overflow-x-auto bg-[#0d0d0d] font-mono text-[14px] leading-relaxed text-gray-300 select-text scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
        <code
          ref={codeRef}
          className={`language-${language} block`}
          style={{ fontFamily: "JetBrains Mono, Fira Code, monospace" }}
        >
          {code}
        </code>
      </pre>
    </div>
  );
}
