"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Rubik_Distressed } from "next/font/google";
import { cn } from "@/lib/utils";
import {
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaFacebook,
  FaInstagram,
  FaDiscord,
  FaTelegram,
  FaWhatsapp,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa6";
import {
  Code,
  Briefcase,
  Users,
  Camera,
  Send,
  MessageSquare,
  Hash,
  MessageCircle,
  Phone,
  Mail,
  FileText,
  BookOpen,
  MapPin,
  Cpu,
  ArrowUp
} from "lucide-react";
import { BrainLogo } from "@/components/ui/BrainLogo";
import { ConnectIcons } from "@/components/ui/ConnectIcons";

const rubikDistressed = Rubik_Distressed({ weight: "400", subsets: ["latin"] });

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Resume", href: "/resume" },
  { name: "Projects", href: "/projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "Papers", href: "/papers" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

const resourcesLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Resume", href: "/resume" },
];

const socialLinks = [
  { name: "GitHub", icon: <FaGithub />, url: "https://github.com/sunfi-x" },
  { name: "LinkedIn", icon: <FaLinkedin />, url: "https://www.linkedin.com/in/khondoker-sazzad-sunfi-3124a4325/" },
  { name: "X", icon: <FaXTwitter />, url: "https://x.com/SUNFI15" },
  { name: "Facebook", icon: <FaFacebook />, url: "https://www.facebook.com/sazzadsunfi/" },
  { name: "Instagram", icon: <FaInstagram />, url: "https://www.instagram.com/sazzadsunfi/" },
  { name: "Discord", icon: <FaDiscord />, url: "https://discord.com/users/sunfi_x" },
  { name: "Telegram", icon: <FaTelegram />, url: "https://t.me/sunfi_x" },
  { name: "WhatsApp", icon: <FaWhatsapp />, url: "https://wa.me/8801309605222" },
  { name: "Email", icon: <FaEnvelope />, url: "mailto:sunfisazzad@gmail.com" },
  { name: "Phone", icon: <FaPhone />, url: "tel:01309605222" },
];


export function Footer() {
  const brandingRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [fireKey, setFireKey] = useState(0);
  const isVisibleRef = useRef(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Sentinel is a 1px invisible div placed at the very bottom of Part 1.
    // When sentinel enters viewport = Part 2 starts to reveal.
    // When sentinel leaves viewport (scrolled back up) = Part 2 hidden again.
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Sentinel visible = Part 2 is being revealed
          if (!isVisibleRef.current) {
            isVisibleRef.current = true;
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
              setFireKey((prev) => prev + 1);
            }, 150);
          }
        } else {
          // Sentinel not visible = user scrolled back up, Part 2 hidden
          isVisibleRef.current = false;
          if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!brandingRef.current) return;
    const rect = brandingRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    brandingRef.current.style.setProperty("--mouse-x", `${x}px`);
    brandingRef.current.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <footer
      className="relative bg-[#000000] w-full border-t border-white/5"
    >
      <style>{`
        @keyframes thunder-travel {
          0% {
            transform: translateX(-340px);
            opacity: 0;
          }
          1% {
            opacity: 1;
          }
          98.5% {
            opacity: 1;
          }
          100% {
            transform: translateX(calc(100vw + 340px));
            opacity: 0;
          }
        }
        @keyframes lightning-core-pulse {
          0%, 100% { filter: brightness(1.25) drop-shadow(0 0 8px #ff3b00); }
          25% { filter: brightness(0.9) drop-shadow(0 0 4px #ea1e0f); }
          50% { filter: brightness(1.5) drop-shadow(0 0 14px #ffaa00); }
          75% { filter: brightness(1.1) drop-shadow(0 0 5px #ff2200); }
        }
        @keyframes lightning-jitter-alt {
          0%, 100% { opacity: 0.95; transform: translateY(0); }
          30% { opacity: 0.4; transform: translateY(-0.8px); }
          60% { opacity: 1; transform: translateY(0.8px); }
          85% { opacity: 0.55; transform: translateY(-0.4px); }
        }
        @keyframes comet-vein-1 {
          0%, 100% { opacity: 0; transform: scaleY(0.85); }
          18%, 22% { opacity: 1; transform: scaleY(1.08) skewX(-1.5deg); }
          48%, 52% { opacity: 0.85; transform: scaleY(0.95) skewX(1deg); }
          78%, 82% { opacity: 1; transform: scaleY(1.05); }
        }
        @keyframes comet-vein-2 {
          0%, 100% { opacity: 0.1; }
          12%, 16% { opacity: 1; transform: scale(1.06); }
          38%, 42% { opacity: 0.35; }
          68%, 72% { opacity: 1; transform: scale(1.1); }
        }
        @keyframes comet-vein-3 {
          0%, 100% { opacity: 0; transform: scaleY(0.8); }
          25%, 30% { opacity: 1; transform: scaleY(1.06) skewX(1.5deg); }
          58%, 62% { opacity: 0.8; transform: scaleY(0.92); }
          86%, 90% { opacity: 1; transform: scaleY(1.04); }
        }
        @keyframes spark-eject-down-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-42px, 34px) scale(0.1); opacity: 0; }
        }
        @keyframes spark-eject-down-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-55px, 22px) scale(0.1); opacity: 0; }
        }
        @keyframes spark-eject-down-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-28px, 42px) scale(0.1); opacity: 0; }
        }
        @keyframes spark-eject-down-4 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-48px, 36px) scale(0.1); opacity: 0; }
        }
        .comet-scale-wrapper {
          transform-origin: top right;
          transform: scale(0.72);
        }
        @media (min-width: 768px) {
          .comet-scale-wrapper {
            transform: scale(1);
          }
        }
      `}</style>
      
      {/* PART 1: CONTENT ZONE (Solid black background, z-10 covers Part 2) */}
      <div 
        className="footer-part1 relative z-10 bg-[#000000] shadow-[0_30px_70px_rgba(0,0,0,0.95)]"
      >
        <div className="container mx-auto px-6 max-w-7xl relative z-10 py-8 md:py-[32px] px-4 md:px-[40px] grid grid-cols-1 md:grid-cols-[1.8fr_1fr_1fr_1.5fr] gap-8 md:gap-4 items-start">
          
          {/* 1. Brand Card */}
          <div 
            className="w-full md:max-w-[280px]"
            style={{
              border: "1px solid #ffffff10",
              borderRadius: "12px",
              padding: "20px",
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <img 
              src="/logo.png" 
              alt="Sunfi Logo" 
              style={{ height: "38px", width: "auto", objectFit: "contain", alignSelf: "flex-start" }} 
            />
            <div style={{ width: "32px", height: "2px", backgroundColor: "#e0291d" }} />
            <p style={{ 
              color: "#aaa", 
              fontSize: "12.5px", 
              margin: 0,
              lineHeight: "1.7"
            }}>
              Transforming raw datasets into actionable insights and robust AI architectures that solve complex real-world problems.
            </p>
            <span style={{ color: "#666", fontSize: "11.5px" }}>
              📍 Based in Bangladesh
            </span>
          </div>

          {/* Wrapper for Sitemap & Resources on Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-2 md:contents gap-1 md:gap-4">
            {/* 2. Sitemap */}
            <div className="pr-2 md:pr-0" style={{ paddingLeft: '36px' }}>
              <h4 style={{
                color: "#fff",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                marginBottom: "12px",
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                SITEMAP
              </h4>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                {navLinks.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                  >
                    <Link 
                      href={link.href} 
                      className="footer-link"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* 3. Resources */}
            <div className="pl-2 md:pl-0">
              <h4 style={{
                color: "#fff",
                fontSize: "12px",
                fontWeight: "600",
                letterSpacing: "1.5px",
                marginBottom: "12px",
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}>
                RESOURCES
              </h4>
              <ul style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}>
                {resourcesLinks.map((link, index) => (
                  <motion.li 
                    key={link.name}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.07 }}
                  >
                    <Link 
                      href={link.href} 
                      className="footer-link"
                    >
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Connect */}
          <div className="flex flex-col items-center md:items-start">
            <h4 style={{
              color: "#fff",
              fontSize: "12px",
              fontWeight: "600",
              letterSpacing: "1.5px",
              marginBottom: "12px",
              marginTop: 0,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              width: "100%",
              justifyContent: "inherit"
            }}>
              CONNECT
            </h4>
            <div 
              className="flex flex-row flex-wrap justify-center md:justify-start gap-3 md:gap-2"
              style={{
                maxWidth: "100%"
              }}
            >
              {socialLinks.map((social, index) => (
                <motion.div
                  key={social.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                >
                  <a 
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="footer-social-icon"
                  >
                    {social.icon}
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar inside Part 1 context - clean padding, no cutoff */}
        <div className="container mx-auto px-6 max-w-7xl relative z-10 mt-6 pb-8 md:pb-10">
          <div className="flex flex-col md:flex-row justify-between items-center text-[12px] text-gray-500">
            <p>© 2026 Sunfi. All rights reserved.</p>
          </div>
        </div>

        {/* ── Realistic Grand Lightning & Scorched Burn Trail Under Divider ── */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
          {/* Base sleek divider line: strictly on top (z-30) */}
          <div className="w-full h-[1px] bg-white/[0.08] relative z-30" />

          {/* Effect container: STRICTLY UNDERNEATH the line (top-[1px]), pointing downwards into Part 2 */}
          <div className="absolute top-[1px] left-0 right-0 h-[115px] overflow-hidden pointer-events-none z-20">
            {fireKey > 0 && (
              <div
                key={fireKey}
                className="absolute top-0 left-0 pointer-events-none"
                style={{
                  width: "300px",
                  height: "115px",
                  animation: "thunder-travel 11.0s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
                  willChange: "transform",
                }}
              >
                {/* Responsive Scale Wrapper: 100% on desktop (untouched), 72% on mobile */}
                <div className="w-full h-full relative comet-scale-wrapper">
                  {/* 1. Downward Scorched Fire Shadow: Deep, large, warm glowing shadow into Part 2, NO veins */}
                  <div
                    className="absolute left-0 right-0 top-0 pointer-events-none"
                    style={{
                      height: "75px",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(142, 13, 13, 0) 18%, rgba(142, 13, 13, 0.35) 38%, rgba(234, 30, 15, 0.55) 62%, rgba(255, 80, 0, 0.8) 82%, rgba(255, 190, 90, 0.95) 95%, #ffffff 100%)",
                      WebkitMaskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.18) 70%, transparent 100%)",
                      maskImage:
                        "linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.6) 35%, rgba(0,0,0,0.18) 70%, transparent 100%)",
                      filter: "blur(8px)",
                    }}
                  />

                  {/* 2. Ionized Plasma Cloud around the comet head (richer & wider) */}
                  <div
                    className="absolute right-0 top-0 pointer-events-none"
                    style={{
                      width: "230px",
                      height: "75px",
                      background:
                        "radial-gradient(ellipse 200px 65px at 90% 10%, rgba(255, 130, 0, 0.48) 0%, rgba(234, 30, 15, 0.28) 45%, rgba(142, 13, 13, 0.08) 80%, transparent 100%)",
                      filter: "blur(12px)",
                    }}
                  />

                  {/* 3. Molten Scorched Seam: Smooth clean burn mark hugging underside of line, NO veins */}
                  <div
                    className="absolute left-0 right-0 top-0 pointer-events-none"
                    style={{
                      height: "2.5px",
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(142, 13, 13, 0) 15%, rgba(142, 13, 13, 0.45) 35%, rgba(234, 30, 15, 0.8) 60%, #ff4400 80%, #ffaa00 93%, #ffffff 100%)",
                      boxShadow: "0 1px 8px rgba(255, 90, 0, 0.85), 0 2px 18px rgba(234, 30, 15, 0.5)",
                    }}
                  />

                  {/* 4. SVG Lightning Veins ONLY Around the Comet Head (Charpashe & Downwards) */}
                  <svg
                    className="absolute right-0 top-0 overflow-visible pointer-events-none"
                    width="300"
                    height="115"
                    viewBox="0 0 300 115"
                  >
                    <defs>
                      {/* Deep Fiery Corona Glow */}
                      <filter id="comet-lightning-glow" x="-25%" y="-25%" width="150%" height="150%">
                        <feGaussianBlur stdDeviation="3.5" result="blur1" />
                        <feGaussianBlur stdDeviation="1.5" result="blur2" />
                        <feMerge>
                          <feMergeNode in="blur1" />
                          <feMergeNode in="blur2" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>

                      <linearGradient id="comet-head-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ff4400" stopOpacity="0" />
                        <stop offset="40%" stopColor="#ff5500" stopOpacity="0.7" />
                        <stop offset="80%" stopColor="#ffaa00" stopOpacity="1" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                      </linearGradient>

                      <linearGradient id="comet-core-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                        <stop offset="50%" stopColor="#fff5cc" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
                      </linearGradient>
                    </defs>

                    {/* Electric Arc wire at the comet head */}
                    <path
                      d="M 190,2 L 218,3.5 L 244,1.5 L 268,3 L 286,1.5 L 295,2"
                      fill="none"
                      stroke="url(#comet-head-grad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#comet-lightning-glow)"
                      style={{ animation: "lightning-core-pulse 0.2s infinite" }}
                    />
                    <path
                      d="M 190,2 L 218,3.5 L 244,1.5 L 268,3 L 286,1.5 L 295,2"
                      fill="none"
                      stroke="url(#comet-core-grad)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M 210,2.5 L 238,1 L 264,3 L 288,1.8 L 295,2"
                      fill="none"
                      stroke="#ffffff"
                      strokeWidth="0.9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{ animation: "lightning-jitter-alt 0.08s infinite alternate" }}
                    />

                    {/* === Lightning Veins ONLY Around Comet Head (Downward into Part 2) === */}
                    
                    {/* Vein 1: Just behind comet head (x=250-260) */}
                    <g style={{ animation: "comet-vein-1 0.38s infinite" }}>
                      <path
                        d="M 260,2 L 250,18 L 238,34 L 222,52 L 205,72 L 188,88"
                        fill="none"
                        stroke="#ff5500"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 238,34 L 246,46 L 240,60 L 228,74"
                        fill="none"
                        stroke="#ffaa00"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 250,18 L 238,34 L 222,52"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.7"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Vein 2: Directly at Comet Head (x=292) */}
                    <g style={{ animation: "comet-vein-2 0.24s infinite 0.05s" }}>
                      <path
                        d="M 292,2 L 285,16 L 272,32 L 258,50 L 240,68 L 225,82"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        filter="url(#comet-lightning-glow)"
                      />
                      <path
                        d="M 272,32 L 282,44 L 276,58"
                        fill="none"
                        stroke="#ffaa00"
                        strokeWidth="1"
                        strokeLinecap="round"
                      />
                    </g>

                    {/* Vein 3: Lower flank of Comet Head (x=275) */}
                    <g style={{ animation: "comet-vein-3 0.32s infinite 0.12s" }}>
                      <path
                        d="M 275,2.5 L 268,18 L 254,35 L 242,54 L 228,72"
                        fill="none"
                        stroke="#ff7700"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 254,35 L 262,48 L 258,62"
                        fill="none"
                        stroke="#ffcc00"
                        strokeWidth="0.9"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 268,18 L 254,35"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>

                  {/* 5. Incandescent Plasma Head Node (Enlarged & more radiant) */}
                  <div
                    className="absolute right-0 top-0 pointer-events-none"
                    style={{
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      boxShadow:
                        "0 0 8px 3px #ffffff, 0 0 18px 7px #ffbb00, 0 0 36px 14px #ff4400, 0 0 70px 24px rgba(234, 30, 15, 0.85)",
                      animation: "lightning-core-pulse 0.1s infinite alternate",
                    }}
                  />

                  {/* 6. High-Velocity Sparks ejecting around the comet head */}
                  <div
                    className="absolute right-[5px] top-[2px] pointer-events-none"
                    style={{
                      width: "3px",
                      height: "3px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 5px 1.5px #ffcc00",
                      animation: "spark-eject-down-1 0.4s infinite ease-out",
                    }}
                  />
                  <div
                    className="absolute right-[12px] top-[1px] pointer-events-none"
                    style={{
                      width: "2.5px",
                      height: "2.5px",
                      borderRadius: "50%",
                      backgroundColor: "#ffaa00",
                      boxShadow: "0 0 6px 2px #ff4400",
                      animation: "spark-eject-down-2 0.48s infinite ease-out 0.1s",
                    }}
                  />
                  <div
                    className="absolute right-[22px] top-[3px] pointer-events-none"
                    style={{
                      width: "2.5px",
                      height: "2.5px",
                      borderRadius: "50%",
                      backgroundColor: "#ff4400",
                      boxShadow: "0 0 5px 1.5px #ea1e0f",
                      animation: "spark-eject-down-3 0.52s infinite ease-out 0.18s",
                    }}
                  />
                  <div
                    className="absolute right-[32px] top-[1.5px] pointer-events-none"
                    style={{
                      width: "2px",
                      height: "2px",
                      borderRadius: "50%",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 0 4px 1px #ff8800",
                      animation: "spark-eject-down-4 0.44s infinite ease-out 0.26s",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sentinel: 1px invisible element at the bottom of Part 1. 
          When it enters the viewport, Part 2 is being revealed → trigger comet. */}
      <div ref={sentinelRef} style={{ height: "1px", width: "100%", marginTop: "-1px" }} />

      {/* PART 2: CINEMATIC BRANDING ZONE (Sticky reveal behind Part 1) */}
      <div 
        ref={brandingRef}
        onPointerMove={handlePointerMove}
        className="sticky bottom-0 z-0 w-full flex items-center justify-center overflow-hidden cursor-default bg-[#000000] border-t border-white/[0.02] touch-none pt-4 pb-4"
        style={{
          "--mouse-x": "50%",
          "--mouse-y": "50%"
        } as React.CSSProperties}
      >
        {/* Base Layer: Dark Muted Base (Provides natural tight height) */}
        <div className="relative z-0 flex items-center justify-center pointer-events-none w-full">
          <h1 
            className={`font-extrabold text-[#111111] tracking-[-0.05em] leading-none select-none w-full flex justify-center m-0 ${rubikDistressed.className}`}
            style={{ fontSize: "clamp(8rem, 23vw, 40rem)" }}
          >
            SUNFI
          </h1>
        </div>

        {/* Revealed Layer: Strictly Clipped Ash Grainy Text with Sharp Spotlight */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          style={{
            WebkitMaskImage: `radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
            maskImage: `radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)`,
          }}
        >
          <h1 
            className={`font-extrabold text-transparent tracking-[-0.05em] leading-none select-none w-full flex justify-center m-0 ${rubikDistressed.className}`}
            style={{
              fontSize: "clamp(8rem, 23vw, 40rem)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.4'/%3E%3C/svg%3E"), linear-gradient(to bottom, #808080, #505050)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              backgroundSize: "150px 150px, 100% 100%",
            }}
          >
            SUNFI
          </h1>
        </div>
      </div>

    </footer>
  );
}
