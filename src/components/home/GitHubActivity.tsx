"use client";

import React, { useEffect, useState, useRef } from "react";
import { FaGithub } from "react-icons/fa6";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const GitHubCalendar = dynamic(() => import("react-github-calendar").then(mod => mod.GitHubCalendar), {
  ssr: false,
  loading: () => (
    <div style={{
      height: "120px",
      width: "100%",
      borderRadius: "8px",
      background: "linear-gradient(90deg, #1a1a1a 25%, #222 50%, #1a1a1a 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite"
    }} />
  )
}) as any;

function AnimatedNumber({ value, suffix = "+" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (value === 0 || started.current) return;
    started.current = true;
    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue}{suffix}</span>;
}

export function GitHubActivity() {
  const [repos, setRepos] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [contributions, setContributions] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      // Fetch Repos & Followers
      try {
        const res = await fetch("https://api.github.com/users/sunfi-x");
        if (res.ok) {
          const data = await res.json();
          setRepos(data.public_repos || 16);
          setFollowers(data.followers || 2);
        }
      } catch {
        setRepos(16);
        setFollowers(2);
      }

      // Fetch Total Contributions using the jogruber v4 API (current calendar year)
      try {
        const currentYear = new Date().getFullYear();
        const contribRes = await fetch(`https://github-contributions-api.jogruber.de/v4/sunfi-x?y=${currentYear}`);
        if (contribRes.ok) {
          const contribData = await contribRes.json();
          if (contribData && contribData.total && typeof contribData.total[currentYear] === 'number') {
            setContributions(contribData.total[currentYear]);
          }
        }
      } catch (e) {
        console.warn("Failed to fetch total contributions", e);
        setContributions(56); // Fallback based on real count
      }
    };
    fetchProfile();
  }, []);

  // Green theme for the calendar matching GitHub's native look
  const greenTheme = {
    dark: ["#1a1a1a", "#0e4429", "#196127", "#239a3b", "#2ea043"]
  };

  // Show last 6 months on mobile
  const transformData = isMobile
    ? (data: any[]) => {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return data.filter(d => new Date(d.date) >= sixMonthsAgo);
      }
    : undefined;

  return (
    <section id="proof-of-work" className="py-24 relative overflow-hidden github-section">
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .github-section, .github-section * {
          font-family: 'Quicksand', sans-serif !important;
        }
        
        /* Custom thin dark scrollbar for heatmap */
        .github-heatmap-container {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
        .github-heatmap-container::-webkit-scrollbar {
          height: 2px;
        }
        .github-heatmap-container::-webkit-scrollbar-track {
          background: transparent;
        }
        .github-heatmap-container::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .github-heatmap-container::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        @media (max-width: 768px) {
          .heatmap-scrollbar,
          .heatmap-progress,
          input[type="range"] {
            display: none !important;
          }
          .github-headline {
            font-size: 28px !important;
            white-space: nowrap !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 6px !important;
          }
        }
      `}</style>

      {/* Subtle green glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#2ea043]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6"
          >
            <FaGithub className="w-3.5 h-3.5 text-gray-400" />
            <span style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#888" }}>
              Open Source Profile
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="github-headline"
            style={{ 
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: "700",
              fontSize: "42px",
              textAlign: "center",
              color: "#fff",
              marginBottom: "12px",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              flexWrap: "nowrap"
            }}
          >
            <span style={{ 
              color: "#ffffff", 
              fontWeight: "600",
              opacity: 1,
              fontFamily: "monospace",
              fontSize: "0.85em",
              letterSpacing: "-0.05em"
            }}>{"</>"}</span>
            Github{" "}
            <span style={{ color: "#22C55E" }}>Activity</span>
          </motion.h2>

          <p style={{ color: "#555", fontSize: "15px", maxWidth: "480px", textAlign: "center" }}>
            Actively contributing to the ecosystem and shipping scalable architectures.
          </p>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: isMobile ? "24px" : "64px",
          marginBottom: "40px"
        }}>
          {[
            { value: contributions, label: "CONTRIBUTIONS", suffix: "+" },
            { value: repos,  label: "REPOSITORIES",  suffix: "+" },
            { value: followers, label: "FOLLOWERS", suffix: "" }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              style={{ textAlign: "center" }}
            >
              <div style={{ fontSize: isMobile ? "28px" : "42px", fontWeight: 700, color: "#22C55E" }}>
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ fontSize: "10px", color: "#555", letterSpacing: "2px", marginTop: "4px" }}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Heatmap Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="max-w-5xl mx-auto"
        >
          <div 
            className="github-heatmap-container"
            style={{
              background: "linear-gradient(135deg, #0d0d0d 0%, #111318 100%)",
              border: "1px solid #ffffff08",
              borderRadius: "16px",
              padding: isMobile ? "16px" : "28px 32px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              overflowX: "auto"
            }}
          >
            <div style={{ minWidth: isMobile ? "unset" : "700px", display: "flex", justifyContent: "center" }}>
              <GitHubCalendar
                username="sunfi-x"
                colorScheme="dark"
                theme={greenTheme}
                year={new Date().getFullYear()}
                blockSize={12}
                blockMargin={4}
                fontSize={11}
                hideTotalCount={false}
                hideColorLegend={false}
                transformData={transformData}
              />
            </div>
          </div>
        </motion.div>

        {/* Footer Link */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "32px" }}>
          <Link
            href="https://github.com/sunfi-x"
            target="_blank"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "#555",
              textDecoration: "none",
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: 600,
              transition: "color 0.2s"
            }}
            className="hover:text-white group"
          >
            <FaGithub style={{ width: "16px", height: "16px" }} />
            View Full Profile
            <ExternalLink style={{ width: "12px", height: "12px" }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
