"use client";

import { useState } from "react";
import { Link as LinkIcon, Check, Share2 } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

interface BlogShareProps {
  title: string;
}

export function BlogShare({ title }: BlogShareProps) {
  const [copied, setCopied] = useState(false);

  const handleShareX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${title}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 py-5 border-y border-white/[0.06]">
      <div className="flex items-center gap-2 text-[11px] font-semibold text-white/25 uppercase tracking-wider">
        <Share2 className="w-3.5 h-3.5" />
        Share this post
      </div>

      <div className="flex items-center gap-2 ml-auto sm:ml-0">
        <button
          onClick={handleShareX}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.07] hover:border-white/[0.18] text-[12px] text-white/60 hover:text-white transition-all duration-200 cursor-pointer font-medium"
        >
          <FaXTwitter className="w-3.5 h-3.5 text-white/70" />
          <span>Share on X</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-transparent hover:bg-white/[0.05] border border-white/[0.07] hover:border-white/[0.15] text-[12px] text-white/40 hover:text-white/75 transition-all duration-200 cursor-pointer font-medium"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
