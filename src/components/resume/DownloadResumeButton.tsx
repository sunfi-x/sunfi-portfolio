"use client";

import React, { useState } from "react";
import type { BaseResume } from "@/sanity/lib/types";
import { ResumePDF } from "./ResumePDF";

interface DownloadResumeButtonProps {
  resume: BaseResume;
}

export function DownloadResumeButton({ resume }: DownloadResumeButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const { pdf } = await import("@react-pdf/renderer");
      const blob = await pdf(<ResumePDF resume={resume} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${resume.identity.fullName.replace(/\s+/g, "_")}_Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <button
        onClick={handleDownload}
        disabled={loading}
        style={{
          background: 'transparent',
          border: '1px solid #333',
          color: '#ffffff',
          padding: '8px 16px',
          fontSize: '11px',
          letterSpacing: '0.1em',
          fontFamily: 'Quicksand, sans-serif',
          cursor: loading ? 'wait' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="w-full sm:w-auto uppercase transition-all duration-300 hover:bg-white hover:text-black active:scale-95"
      >
        {loading ? "Generating PDF..." : "Download CV"}
      </button>
    </div>
  );
}
