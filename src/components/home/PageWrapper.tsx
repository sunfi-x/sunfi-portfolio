"use client";

export function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
