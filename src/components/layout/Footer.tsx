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

  useEffect(() => {
    const el = document.querySelector(".footer-part1");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el?.classList.add("visible");
        }
      },
      { threshold: 0.1 }
    );
    if (el) observer.observe(el);
    return () => observer.disconnect();
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
      
      {/* PART 1: CONTENT ZONE (Solid black background, z-10 covers Part 2) */}
      <div className="footer-part1 relative z-10 bg-[#000000] border-b border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.95)]">
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

        {/* Bottom bar inside Part 1 context */}
        <div className="container mx-auto px-6 max-w-7xl relative z-10 mb-8 mt-2">
          <div className="flex flex-col md:flex-row justify-between items-center pt-6 border-t border-white/[0.08] text-[12px] text-gray-500">
            <p>© 2026 Sunfi. All rights reserved.</p>
          </div>
        </div>
      </div>

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
