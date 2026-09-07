"use client";

import dynamic from "next/dynamic";

const FluidShaderBackground = dynamic(
  () =>
    import("@/components/ui/FluidShaderBackground").then(
      (mod) => mod.FluidShaderBackground,
    ),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 bg-black" />,
  },
);

// NightSky background retained for easy fallback/switching:
// const NightSkyBackground = dynamic(
//   () =>
//     import("@/components/ui/NightSkyBackground").then(
//       (mod) => mod.NightSkyBackground,
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
        <FluidShaderBackground />
      </div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

