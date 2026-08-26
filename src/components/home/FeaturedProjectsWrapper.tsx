"use client";

import dynamic from "next/dynamic";
import type { Project } from "@/sanity/lib/types";

const FeaturedProjects = dynamic(
  () =>
    import("./FeaturedProjects").then((mod) => mod.FeaturedProjects),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] glass rounded-2xl animate-pulse bg-white/5 flex items-center justify-center">
        <span className="text-gray-500 uppercase tracking-widest text-sm">
          Loading Featured Projects...
        </span>
      </div>
    ),
  },
);

interface FeaturedProjectsWrapperProps {
  projects: Project[];
}

export function FeaturedProjectsWrapper({
  projects,
}: FeaturedProjectsWrapperProps) {
  return <FeaturedProjects projects={projects} />;
}
