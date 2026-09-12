import { BlogList } from "@/components/blogs/BlogList";
import { fetchAllBlogs } from "@/sanity/lib/fetchers";
import type { Metadata } from "next";
import { FaMedium } from "react-icons/fa6";
import { ExternalLink } from "lucide-react";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing | Khondoker Sazzad Sunfi",
  description:
    "Articles, postmortems, and notes on backend engineering, distributed systems, and platform work.",
};

export default async function BlogsPage() {
  const blogs = await fetchAllBlogs();

  return (
    <section className="bg-transparent text-[#ffffff] min-h-screen mt-[-5rem] sm:mt-[-6rem] pt-24 sm:pt-28 md:pt-32 pb-24 font-['Quicksand',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        
        .quicksand-scope, .quicksand-scope * {
          font-family: 'Quicksand', sans-serif !important;
        }
      `}</style>

      <div className="quicksand-scope container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div>
            {/* Eyebrow Label */}
            <p className="font-mono text-xs font-bold tracking-[3px] uppercase mb-3" style={{ color: "#C83228D9" }}>// FIELD NOTES</p>
            
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-white leading-tight">
              Writing
            </h1>
            
            {/* Subtitle */}
            <p className="text-[#888888] text-xs sm:text-sm md:text-base lg:text-lg max-w-none font-light tracking-tight">
              Thoughts, postmortems, and notes on machine learning, bioinformatics, and data architecture.
            </p>
          </div>

          {/* Medium Profile Link Badge */}
          <a
            href="https://medium.com/@sunfi-x"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full border border-white/15 bg-white/[0.04] text-xs font-semibold text-white/90 hover:text-white hover:bg-black hover:border-white/40 transition-all duration-300 shadow-md font-mono shrink-0"
          >
            <FaMedium className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
            <span>Follow on Medium</span>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-colors" />
          </a>
        </div>
        
        <BlogList blogs={blogs} />
      </div>
    </section>
  );
}
