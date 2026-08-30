"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpen, FileText, Clock, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import type { Blog } from "@/sanity/lib/types";
import { urlFor } from "@/sanity/lib/image";

interface BlogsPreviewProps {
  blogs: Blog[];
}

export function BlogsPreview({ blogs }: BlogsPreviewProps) {
  return (
    <section className="relative py-24 sm:py-28 overflow-hidden font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-500/[0.015] rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-14 gap-6 border-b border-white/[0.06] pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4 select-none">
              <BookOpen className="w-3.5 h-3.5 text-white/50" />
              <span className="text-[10px] font-mono tracking-[2px] uppercase text-white/50 font-medium">
                Writing & Research
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-4.5xl font-bold text-white tracking-tight leading-tight">
              Recent <span className="text-[#C83228D9]">Articles</span>
            </h2>
            <p className="mt-3 text-white/45 max-w-md text-xs sm:text-sm font-light leading-relaxed">
              Thoughts, tutorials, and research on machine learning, system design, and the future of AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-2.5"
          >
            <Link
              href="/blogs"
              className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 font-mono"
            >
              <FileText className="w-3.5 h-3.5 text-white/50" />
              <span>All Articles</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/papers"
              className="group flex items-center gap-2 px-4 py-2 rounded-full border border-white/[0.08] bg-white/[0.03] text-xs font-semibold text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 font-mono"
            >
              <span>Papers</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-center justify-center py-20 gap-3 border border-white/[0.05] rounded-2xl bg-[#0c0c0e]"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-white/40 text-xs font-light font-mono">No posts published yet.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
            {blogs.slice(0, 3).map((post, index) => {
              const imageUrl = post.mainImage
                ? typeof post.mainImage === "string"
                  ? post.mainImage
                  : urlFor(post.mainImage).width(600).height(380).fit("crop").url()
                : null;

              const cleanTags = (post.tags || []).filter((t) => t.toLowerCase() !== "pinned").slice(0, 3);

              return (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: index * 0.09, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="group relative flex flex-col h-full rounded-2xl bg-gradient-to-b from-[#111114] via-[#0d0d0f] to-[#09090b] border border-white/[0.08] overflow-hidden hover:border-white/20 hover:-translate-y-1.5 hover:shadow-[0_22px_60px_rgba(0,0,0,0.85),0_0_20px_rgba(255,255,255,0.02)] transition-all duration-300 ease-out"
                  >
                    {/* Top ambient highlight line */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:via-white/40 transition-all duration-500 z-10" />

                    {/* Image / Thumbnail header if available */}
                    {imageUrl && (
                      <div className="relative h-44 w-full overflow-hidden bg-[#0a0a0c] border-b border-white/[0.06]">
                        <Image
                          src={imageUrl}
                          alt={post.title}
                          fill
                          unoptimized
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-100"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0f] via-black/20 to-transparent" />
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="flex flex-col flex-1 p-6 sm:p-6.5 relative z-10">
                      {/* Top Meta: Badge + Date */}
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="flex items-center bg-white/[0.04] border border-white/[0.07] px-2.5 py-1 rounded-full">
                          <span className="font-mono text-[10px] font-semibold tracking-wider text-white/60 uppercase">
                            0{index + 1} · ARTICLE
                          </span>
                        </div>
                        {post.publishedAt && (
                          <span className="text-[11px] text-white/40 font-mono">
                            {format(new Date(post.publishedAt), "MMM d, yyyy")}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-3 group-hover:text-[#C83228D9] transition-colors duration-200 tracking-tight">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      {post.excerpt && (
                        <p className="text-white/55 text-xs leading-relaxed line-clamp-3 mb-5 font-normal">
                          {post.excerpt}
                        </p>
                      )}

                      {/* Tags */}
                      {cleanTags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-5 mt-auto">
                          {cleanTags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-[10px] text-white/40 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded-[4px] uppercase"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Divider & Read Link */}
                      <div className="mt-auto pt-4 border-t border-white/[0.06] flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] font-mono text-white/40">
                          <Clock className="w-3 h-3 text-white/30" />
                          <span>{post.readTime || "5 min read"}</span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-white/40 group-hover:text-white/70 bg-white/[0.03] group-hover:bg-white/[0.06] border border-white/[0.06] group-hover:border-white/[0.12] px-3 py-1 rounded-full transition-all duration-200">
                          <span>Read</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
