"use client";

import dynamic from "next/dynamic";

const NightSkyBackground = dynamic(
  () =>
    import("@/components/ui/NightSkyBackground").then(
      (mod) => mod.NightSkyBackground,
    ),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black" />,
  },
);

// Original Particles background retained for easy fallback/switching:
// const ParticlesBackground = dynamic(
//   () =>
//     import("@/components/ui/ParticlesBackground").then(
//       (mod) => mod.ParticlesBackground,
//     ),
//   {
//     ssr: false,
//     loading: () => <div className="fixed inset-0 bg-black" />,
//   },
// );

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-90">
        <NightSkyBackground />
        {/* <ParticlesBackground /> */}
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

