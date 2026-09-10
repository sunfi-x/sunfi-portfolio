"use client";

import { ParticlesBackground } from "@/components/ui/ParticlesBackground";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Full-page particle background — fixed, behind all content */}
      <ParticlesBackground />
      {/* All page content above particles */}
      <div className="relative z-[1]">
        {children}
      </div>
    </div>
  );
}
