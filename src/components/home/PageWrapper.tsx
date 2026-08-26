"use client";

import dynamic from "next/dynamic";

const ParticlesBackground = dynamic(
  () =>
    import("@/components/ui/ParticlesBackground").then(
      (mod) => mod.ParticlesBackground,
    ),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black" />,
  },
);

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 pointer-events-none opacity-40 z-0">
        <ParticlesBackground />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
