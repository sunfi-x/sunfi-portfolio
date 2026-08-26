"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, Code, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { urlFor } from "@/sanity/lib/image";
import type { Project } from "@/sanity/lib/types";

export function ProjectList({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      filter === "All" ||
      (filter === "Featured" && project.isFeatured) ||
      (filter === "Others" && !project.isFeatured);
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div className="flex p-1 glass rounded-lg w-full md:w-auto overflow-x-auto">
          {["All", "Featured", "Others"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap",
                filter === tab
                  ? "bg-[#D90429] text-white shadow-[0_0_15px_rgba(255,0,60,0.5)]"
                  : "text-gray-400 hover:text-white hover:bg-white/5",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-black/50 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D90429] transition-colors"
          />
        </div>
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => {
            const imgSrc =
              project.mainImage?.asset?._ref
                ? urlFor(project.mainImage).width(800).height(450).fit("crop").url()
                : null;

            return (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-xl overflow-hidden group hover:shadow-[0_0_30px_rgba(255,0,60,0.15)] hover:border-[rgba(255,0,60,0.5)] transition-all flex flex-col"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="block relative h-64 overflow-hidden bg-[#0a0a0a]"
                >
                  {imgSrc ? (
                    <Image
                      src={imgSrc}
                      alt={project.title}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                      <span className="text-sm uppercase tracking-widest">
                        {project.title}
                      </span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent opacity-80" />
                </Link>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#C83228D9] transition-colors">
                      <Link href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-white transition-colors"
                          aria-label="GitHub Repository"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Code className="w-5 h-5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-gray-400 hover:text-[#D90429] transition-colors"
                          aria-label="Live Demo"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {project.shortDescription && (
                    <p className="text-gray-400 mb-6 flex-1">
                      {project.shortDescription}
                    </p>
                  )}

                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.techStack.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-black/40 text-xs text-gray-300 rounded border border-gray-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-1 md:col-span-2 text-center py-20"
          >
            <p className="text-gray-500 text-lg">
              No projects found matching your criteria.
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
