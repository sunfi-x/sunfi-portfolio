"use client";

import Link from "next/link";
import { FileText, Download } from "lucide-react";
import { motion } from "framer-motion";

interface ResumePreviewProps {
  resumeUrl?: string | null;
}

export function ResumePreview({ resumeUrl }: ResumePreviewProps) {
  const cvHref = resumeUrl ?? "/cv.pdf";

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="glass rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#D90429] rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none" />

          <div className="z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#D90429]" />
              Professional{" "}
              <span className="text-[#D90429]">Experience</span>
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              With a strong foundation in machine learning and scalable backend
              engineering, I&apos;ve delivered end-to-end AI products from
              conceptualization to deployment. Review my full professional
              history and impact metrics.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/resume"
                className="px-6 py-3 bg-white text-black font-semibold rounded-md hover:bg-gray-200 transition-colors"
              >
                View Full Resume
              </Link>
              <a
                href={cvHref}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 border border-[#D90429] text-white font-semibold rounded-md hover:bg-[#D90429]/10 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-full max-w-sm h-64 bg-black/60 border border-[rgba(255,255,255,0.1)] rounded-xl relative overflow-hidden shadow-2xl flex flex-col items-center justify-center cursor-pointer group z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D90429]/5 to-transparent pointer-events-none" />
            <FileText className="w-16 h-16 text-white/20 group-hover:text-[#D90429] transition-colors mb-4" />
            <div className="text-center px-6">
              <div className="h-2 w-3/4 bg-white/10 rounded mx-auto mb-2" />
              <div className="h-2 w-1/2 bg-white/10 rounded mx-auto mb-4" />
              <div className="h-2 w-full bg-white/5 rounded mx-auto mb-2" />
              <div className="h-2 w-5/6 bg-white/5 rounded mx-auto mb-2" />
              <div className="h-2 w-4/6 bg-white/5 rounded mx-auto" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
