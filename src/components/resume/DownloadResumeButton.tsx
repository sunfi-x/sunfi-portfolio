"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { BaseResume } from "@/sanity/lib/types";
import { ResumePDF } from "./ResumePDF";

// Dynamically import PDFDownloadLink to prevent SSR issues
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface DownloadResumeButtonProps {
  resume: BaseResume;
}

export function DownloadResumeButton({ resume }: DownloadResumeButtonProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button 
        style={{
          background: 'transparent',
          border: '1px solid #333',
          color: '#ffffff',
          padding: '8px 16px',
          fontSize: '11px',
          letterSpacing: '0.1em',
          fontFamily: 'Quicksand, sans-serif',
          cursor: 'not-allowed',
          opacity: 0.5
        }}
        className="w-full sm:w-auto uppercase tracking-wider" 
        disabled
      >
        Loading...
      </button>
    );
  }

  const fileName = `${resume.identity.fullName.replace(/\s+/g, "_")}_Resume.pdf`;

  return (
    <div className="w-full sm:w-auto group">
      <PDFDownloadLink
        document={<ResumePDF resume={resume} />}
        fileName={fileName}
        style={{
          background: 'transparent',
          border: '1px solid #333',
          color: '#ffffff',
          padding: '8px 16px',
          fontSize: '11px',
          letterSpacing: '0.1em',
          textDecoration: 'none',
          fontFamily: 'Quicksand, sans-serif',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="w-full sm:w-auto uppercase transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
      >
        {/* @ts-ignore - react-pdf types are sometimes tricky */}
        {({ loading }) => (loading ? "Generating PDF..." : "Download CV")}
      </PDFDownloadLink>
    </div>
  );
}
