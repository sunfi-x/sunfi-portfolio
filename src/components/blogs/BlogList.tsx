// src/components/blogs/BlogList.tsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Search, ArrowUpRight, Clock, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Blog } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";

export function BlogList({ blogs }: { blogs: Blog[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pinned" | "workshops">("all");

  const filteredBlogs = useMemo(() => {
    return blogs
      .filter((blog) => {
        if (filter === "pinned" && !(blog.tags?.some((t) => t.toLowerCase() === "pinned"))) return false;
        if (filter === "workshops" && !blog.tags?.some((t) => t.toLowerCase().includes("workshop"))) return false;
        return true;
      })
      .filter((blog) => {
        const q = searchQuery.toLowerCase();
        return (
          blog.title.toLowerCase().includes(q) ||
          blog.excerpt?.toLowerCase().includes(q) ||
          blog.tags?.some((tag) => tag.toLowerCase().includes(q))
        );
      });
  }, [blogs, searchQuery, filter]);

  const counts = useMemo(() => {
    const pinned = blogs.filter((b) => b.tags?.some((t) => t.toLowerCase() === "pinned")).length;
    const workshops = blogs.filter((b) => b.tags?.some((t) => t.toLowerCase().includes("workshop"))).length;
    return { all: blogs.length, pinned, workshops };
  }, [blogs]);

  const isDefaultView = filter === "all" && !searchQuery;
  const { featuredBlog, displayBlogs } = useMemo(() => {
    if (!isDefaultView || filteredBlogs.length === 0) {
      return { featuredBlog: null, displayBlogs: filteredBlogs };
    }
    const featured = filteredBlogs.find((b) => b.tags?.some((t) => t.toLowerCase() === "pinned")) || filteredBlogs[0];
    const rest = filteredBlogs.filter((b) => b._id !== featured?._id);
    return { featuredBlog: featured, displayBlogs: rest };
  }, [filteredBlogs, isDefaultView]);

  return (
    <div className="space-y-10">

      {/* ── Toolbar ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Filter pills */}
        <div className="flex items-center gap-2">
          {([
            { key: "all", label: "All posts", count: counts.all },
            { key: "pinned", label: "Pinned", count: counts.pinned },
            { key: "workshops", label: "Workshops", count: counts.workshops },
          ] as const).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all border ${
                filter === tab.key
                  ? "bg-white text-black border-white shadow-[0_2px_12px_rgba(255,255,255,0.1)]"
                  : "bg-transparent text-gray-500 border-white/[0.08] hover:text-gray-200 hover:border-white/20"
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 text-[10px] ${filter === tab.key ? "opacity-50" : "opacity-40"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/[0.03] border border-white/[0.07] rounded-full text-white placeholder-gray-600 focus:outline-none focus:border-white/20 transition-all text-sm"
          />
        </div>
      </div>

      {/* Horizontal divider */}
      <div className="h-[1px] bg-white/[0.05]" />

      {/* ── Featured Hero Card ── */}
      {featuredBlog && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={`/blogs/${featuredBlog.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0f0f0f] hover:border-white/25 hover:-translate-y-1.5 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95),0_0_25px_rgba(255,255,255,0.05),inset_0_1px_0_rgba(255,255,255,0.12)] shadow-[0_15px_35px_-10px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-400 ease-out relative"
          >
            {/* Ambient inner glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Left: Image */}
            <div className="relative h-64 lg:h-auto overflow-hidden bg-[#080808]">
              {featuredBlog.mainImage ? (
                <img
                  src={
                    typeof featuredBlog.mainImage === "string"
                      ? featuredBlog.mainImage
                      : urlFor(featuredBlog.mainImage).width(900).height(600).fit("crop").url()
                  }
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#0c0c0c] to-[#161616] flex items-center justify-center">
                  <span className="text-white/[0.04] font-black text-[80px] select-none tracking-tight">ML</span>
                </div>
              )}
              {/* Overlay gradient for text bleed */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0c0c0e] opacity-0 lg:opacity-40 pointer-events-none" />

              {/* Featured label */}
              <div className="absolute top-4 left-4 z-10">
                <span className="text-[9px] font-bold tracking-[0.2em] uppercase bg-black/70 border border-white/15 text-gray-200 px-3 py-1 rounded-full backdrop-blur-md shadow-md">
                  Featured
                </span>
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex flex-col justify-between p-7 md:p-9 relative z-10">
              <div>
                {/* Meta */}
                <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-5 font-mono">
                  {featuredBlog.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {format(new Date(featuredBlog.publishedAt), "MMM d, yyyy")}
                    </span>
                  )}
                  {featuredBlog.readTime && (
                    <>
                      <span className="text-gray-700">·</span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-gray-400" />
                        {featuredBlog.readTime}
                      </span>
                    </>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-4 group-hover:text-[#C83228D9] transition-colors">
                  {featuredBlog.title}
                </h2>

                {/* Excerpt */}
                {featuredBlog.excerpt && (
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3 mb-6 font-light">
                    {featuredBlog.excerpt}
                  </p>
                )}
              </div>

              {/* Footer: tags + cta */}
              <div className="space-y-5">
                {featuredBlog.tags && featuredBlog.tags.filter(t => t.toLowerCase() !== "pinned").length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {featuredBlog.tags
                      .filter((t) => t.toLowerCase() !== "pinned")
                      .map((tag) => (
                        <span key={tag} className="text-[10px] font-mono text-gray-400 bg-white/[0.04] border border-white/[0.07] px-2.5 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                  </div>
                )}
                <div className="h-[1px] bg-white/[0.06]" />
                <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">
                  Read Article
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      )}

      {/* ── Blog Grid ── */}
      <AnimatePresence mode="popLayout">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayBlogs.map((blog, i) => {
            const imageUrl = blog.mainImage
              ? (typeof blog.mainImage === "string"
                ? blog.mainImage
                : urlFor(blog.mainImage).width(600).height(380).fit("crop").url())
              : null;

            return (
              <motion.div
                layout
                key={blog._id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col h-full rounded-2xl bg-[#0f0f0f] border border-white/[0.07] overflow-hidden hover:border-white/25 hover:-translate-y-2 hover:shadow-[0_22px_50px_-10px_rgba(0,0,0,0.95),0_0_20px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.1)] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)] transition-all duration-400 ease-out relative"
                >
                  {/* Subtle top edge sheen line */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/30 transition-all duration-500 z-10" />

                  {/* Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-[#080808]">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#111] via-[#0c0c0c] to-[#161616] flex items-center justify-center">
                        <span className="text-white/[0.04] font-black text-[60px] select-none tracking-tight">ML</span>
                      </div>
                    )}

                    {/* Gradient shade on thumbnail */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80" />

                    {/* Pinned badge */}
                    {blog.tags?.some((t) => t.toLowerCase() === "pinned") && (
                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[9px] font-bold tracking-widest uppercase bg-black/70 border border-white/15 text-gray-200 px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-sm">
                          Pinned
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex flex-col flex-1 p-6 relative z-10">
                    {/* Meta */}
                    <div className="flex items-center gap-2.5 text-[10px] text-gray-500 mb-3 font-mono">
                      {blog.publishedAt && (
                        <span>{format(new Date(blog.publishedAt), "MMM d, yyyy")}</span>
                      )}
                      {blog.readTime && (
                        <>
                          <span>·</span>
                          <span>{blog.readTime}</span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-[16px] font-bold text-white leading-snug mb-2.5 group-hover:text-[#C83228D9] transition-colors flex-1">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    {blog.excerpt && (
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-4 font-light">
                        {blog.excerpt}
                      </p>
                    )}

                    {/* Tags */}
                    {blog.tags && blog.tags.filter(t => t.toLowerCase() !== "pinned").length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {blog.tags
                          .filter((tag) => tag.toLowerCase() !== "pinned")
                          .map((tag) => (
                            <span key={tag} className="text-[9px] font-mono text-gray-400 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-4 border-t border-white/[0.05] flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                      Read Article
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>

      {/* Empty state */}
      {filteredBlogs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-white/[0.05] rounded-2xl bg-[#0f0f0f]">
          <Tag className="w-8 h-8 text-gray-700 mb-4" />
          <p className="text-gray-600 text-sm">
            {searchQuery ? `No results for "${searchQuery}"` : "No articles available yet."}
          </p>
        </div>
      )}
    </div>
  );
}
