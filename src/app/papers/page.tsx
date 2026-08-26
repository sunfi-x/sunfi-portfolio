import { fetchAllPapers } from "@/sanity/lib/fetchers";
import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, CheckCircle2, Circle, HelpCircle } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Publications | Khondoker Sazzad Sunfi",
  description:
    "Academic papers, journal articles, and conference proceedings focusing on applied machine learning and data infrastructure.",
};

export default async function PapersPage() {
  const papers = await fetchAllPapers();

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white mt-[-5rem] sm:mt-[-6rem] flex items-center justify-center pt-24 pb-12 md:py-0 md:h-screen md:overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        
        .quicksand-scope, .quicksand-scope * {
          font-family: 'Quicksand', sans-serif !important;
        }

        @keyframes dot-blink {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 1; }
        }
        .loading-dot {
          display: inline-block;
          animation: dot-blink 1.4s infinite both;
          color: #22C55E;
          font-weight: bold;
        }
        .loading-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        .loading-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
      `}</style>

      <div className="quicksand-scope w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col justify-center animate-fade-in">
        {papers.length === 0 ? (
          /* ── Coming Soon Landscape Card (Dashboard style) ── */
          <div className="bg-[#0f0f0f] border border-white/[0.04] rounded-2xl p-6 md:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.9)] transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-stretch">
              
              {/* Left Column: Heading, Info & Pipeline */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  {/* Top Indicator */}
                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] shadow-[0_0_8px_#22C55E] animate-pulse" />
                    <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold">
                      Academic Research
                    </span>
                  </div>

                  {/* Title with 3-dot green blinking sequential loading */}
                  <h1 className="text-3xl md:text-4.5xl font-bold text-white tracking-tight leading-tight mb-5">
                    Working in Progress
                    <span className="ml-1.5 select-none tracking-normal">
                      <span className="loading-dot">.</span>
                      <span className="loading-dot">.</span>
                      <span className="loading-dot">.</span>
                    </span>
                  </h1>

                  {/* Divider */}
                  <div className="h-[1px] bg-white/[0.05] mb-6" />

                  {/* Description */}
                  <p className="text-gray-400 text-[14px] leading-relaxed mb-8">
                    I am currently investigating neural architectures and drafting research papers for peer-reviewed journals and AI conferences. preprints and publication papers will be updated here as they are accepted.
                  </p>
                </div>

                {/* Pipeline/Milestones widget to balance the extra space */}
                <div className="space-y-3.5 mb-8">
                  <span className="text-[11px] uppercase tracking-wider text-gray-600 font-bold block mb-1">
                    Current Milestone
                  </span>
                  
                  {/* Step 1 */}
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
                    <span className="text-xs text-gray-300">Literature Review & Hypothesis</span>
                    <span className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-gray-500 font-bold">Done</span>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border border-amber-500/30 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    </span>
                    <span className="text-xs text-white font-medium">Model Experiments & Testing</span>
                    <span className="text-[9px] uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-amber-500 font-bold">Active</span>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-center gap-3">
                    <Circle className="w-4 h-4 text-gray-700 shrink-0" />
                    <span className="text-xs text-gray-500">Manuscript Drafting & Peer Review</span>
                    <span className="text-[9px] uppercase tracking-wider bg-white/[0.02] border border-white/[0.05] px-1.5 py-0.5 rounded text-gray-700 font-bold">Queue</span>
                  </div>
                </div>

                {/* Status Info Row */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 border-t border-white/[0.05] pt-6 mt-auto">
                  <span>Target Venues: IEEE / ACM</span>
                  <span className="text-gray-800">|</span>
                  <Link 
                    href="/contact" 
                    className="text-gray-400 hover:text-white underline underline-offset-4 transition-colors"
                  >
                    Collaborate
                  </Link>
                </div>
              </div>

              {/* Right Column: Focus Areas (Landscape design component) */}
              <div className="md:col-span-5 bg-white/[0.01] border border-white/[0.03] rounded-xl p-6 md:p-8 flex flex-col justify-center">
                <h3 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-5">
                  Research Interests
                </h3>
                <div className="space-y-3">
                  {[
                    "Neural Architectures",
                    "Applied ML & DL",
                    "Bioinformatics & AI",
                    "Data Infrastructure"
                  ].map((field) => (
                    <div 
                      key={field} 
                      className="bg-white/[0.02] border border-white/[0.04] rounded-lg px-4 py-3.5 flex items-center gap-3 hover:border-white/[0.08] transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                      <span className="text-xs text-gray-300 font-semibold">{field}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* ── Papers List ── */
          <div className="bg-[#0f0f0f] border border-white/[0.04] rounded-2xl p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center gap-2.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
              <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
                Publications
              </span>
            </div>

            <h1 className="text-3xl font-bold text-white tracking-tight mb-6">
              Research Papers
            </h1>

            <div className="h-[1px] bg-white/[0.05] mb-8" />

            <div className="space-y-8">
              {papers.map((paper, index) => (
                <div key={paper._id} className="flex gap-4">
                  <span className="text-xs text-gray-700 font-mono mt-1 shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5 text-xs text-gray-500">
                      {paper.year && <span>{paper.year}</span>}
                      {paper.conference && (
                        <>
                          <span>·</span>
                          <span>{paper.conference}</span>
                        </>
                      )}
                    </div>
                    <h2 className="text-base font-semibold text-white leading-snug mb-2">
                      {paper.title}
                    </h2>
                    {paper.abstract && (
                      <p className="text-gray-500 text-xs leading-relaxed mb-3">
                        {paper.abstract}
                      </p>
                    )}
                    {paper.doiLink && (
                      <a
                        href={paper.doiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        View paper
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
