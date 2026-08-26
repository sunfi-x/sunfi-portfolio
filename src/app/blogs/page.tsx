// src/app/blogs/page.tsx
import { BlogList } from "@/components/blogs/BlogList";
import { fetchAllBlogs } from "@/sanity/lib/fetchers";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Writing | Khondoker Sazzad Sunfi",
  description:
    "Articles, postmortems, and notes on backend engineering, distributed systems, and platform work.",
};

export default async function BlogsPage() {
  const blogs = await fetchAllBlogs();

  return (
    <section className="bg-[#050505] text-[#ffffff] min-h-screen mt-[-5rem] sm:mt-[-6rem] pt-24 sm:pt-28 md:pt-32 pb-24 font-['Quicksand',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        
        .quicksand-scope, .quicksand-scope * {
          font-family: 'Quicksand', sans-serif !important;
        }
      `}</style>

      <div className="quicksand-scope container mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="mb-10">
          {/* Eyebrow Label */}
          <p className="font-mono text-xs font-bold tracking-[3px] uppercase mb-3" style={{ color: "#C83228D9" }}>// FIELD NOTES</p>
          
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-white leading-tight">
            Writing
          </h1>
          
          {/* Subtitle */}
          <p className="text-[#888888] text-xs sm:text-sm md:text-base lg:text-lg max-w-none font-light tracking-tight whitespace-normal sm:whitespace-nowrap">
            Thoughts, postmortems, and notes on machine learning, bioinformatics, and data architecture.
          </p>
        </div>
        
        <BlogList blogs={blogs} />
      </div>
    </section>
  );
}
