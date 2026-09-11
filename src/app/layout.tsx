import dynamic from "next/dynamic";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Space_Grotesk, Lexend, Barlow_Condensed, Quicksand } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollResetClient } from "@/components/layout/ScrollResetClient";

const ParticlesBackground = dynamic(
  () => import("@/components/ui/ParticlesBackground").then((mod) => mod.ParticlesBackground)
);

const AiAssistantWidget = dynamic(
  () => import("@/components/ai/AiAssistantWidget").then((mod) => mod.AiAssistantWidget)
);

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-quicksand",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["900"],
  variable: "--font-header-heavy",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Khondoker Sazzad Sunfi | Data Science | ML | AI",
  description: "Portfolio of Khondoker Sazzad Sunfi. Specialist in Data Science, Machine Learning, and Artificial Intelligence.",
  keywords: ["Data Science", "Machine Learning", "AI", "Portfolio", "Khondoker Sazzad Sunfi"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://sunfi-portfolio.vercel.app"),
  openGraph: {
    title: "Khondoker Sazzad Sunfi | Data Science | ML | AI",
    description: "Specialist in Data Science, Machine Learning, and Artificial Intelligence.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${spaceGrotesk.variable} ${lexend.variable} ${quicksand.variable} ${barlowCondensed.variable} h-full antialiased dark`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600&display=swap" rel="stylesheet" />
      </head>
      <body
        className="min-h-full flex flex-col relative selection:bg-[#D90429]/30 selection:text-white bg-black"
        suppressHydrationWarning
      >
        {/* Global particle background — fixed, behind all page content */}
        <ParticlesBackground />
        {/* All content at z-[1] so particles (z-0) show through transparent areas */}
        <div className="relative z-[1] flex flex-col min-h-full flex-1">
          <ScrollResetClient />
          <Navbar />
          <main className="flex-1 pt-24 pb-16">
            {children}
          </main>
          <Footer />
          <AiAssistantWidget />
        </div>
      </body>
    </html>
  );
}
