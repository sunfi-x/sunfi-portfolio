"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { BrainLogo } from "@/components/ui/BrainLogo";
import { useEffect, useState } from "react";

import { Michroma } from "next/font/google";
const michroma = Michroma({ weight: "400", subsets: ["latin"] });

const navLinks = [
  { name: "Sunfi", href: "/" },
  { name: "Resume", href: "/resume" },
  { name: "Projects", href: "/projects" },
  { name: "Blogs", href: "/blogs" },
  { name: "Papers", href: "/papers" },
  { name: "Gallery", href: "/gallery" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 w-full z-[200] transition-all duration-700",
          scrolled
            ? "py-3 px-4 md:px-0"
            : "bg-transparent py-6"
        )}
      >
        <div className={cn(
          "container mx-auto transition-all duration-500 flex items-center justify-between",
          scrolled
            ? "max-w-5xl bg-[#0a0a0a]/90 backdrop-blur-xl border-0 outline-none ring-0 rounded-full px-6 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.8)]"
            : "px-4"
        )}>
          <Link href="/" className="flex items-center ml-[20px]">
            <img
              src="/logo.png"
              alt="Sunfi Logo"
              className="h-[32px] w-auto object-contain align-middle cursor-pointer"
            />
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "nav-link",
                  pathname === link.href && "active"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Desktop: Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex"
              style={{
                alignItems: "center",
                gap: "8px",
                backgroundColor: "#111111",
                border: "1px solid #ffffff12",
                borderRadius: "999px",
                padding: "7px 16px",
                cursor: "pointer",
                transition: "all 0.3s ease",
                color: "#666"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "#ffffff25";
                e.currentTarget.style.backgroundColor = "#1a1a1a";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#ffffff12";
                e.currentTarget.style.backgroundColor = "#111111";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <span style={{
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "13px",
                color: "#666",
                fontWeight: "500"
              }}>
                Search...
              </span>
              <span style={{
                fontSize: "10px",
                color: "#444",
                backgroundColor: "#1f1f1f",
                border: "1px solid #333",
                borderRadius: "4px",
                padding: "1px 5px",
                fontFamily: "monospace"
              }}>
                ⌘K
              </span>
            </button>

            {/* Mobile: Hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] transition-colors duration-200 hover:bg-white/[0.08]"
              aria-label="Toggle menu"
            >
              <div className="flex flex-col gap-[5px] w-[18px]">
                <span
                  className={cn(
                    "block h-[1.5px] bg-white/70 rounded-full transition-all duration-300 origin-center",
                    mobileMenuOpen ? "rotate-45 translate-y-[6.5px]" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] bg-white/70 rounded-full transition-all duration-300",
                    mobileMenuOpen ? "opacity-0 scale-x-0" : ""
                  )}
                />
                <span
                  className={cn(
                    "block h-[1.5px] bg-white/70 rounded-full transition-all duration-300 origin-center",
                    mobileMenuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                  )}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <nav className="mx-4 mt-2 mb-2 rounded-2xl bg-[#0c0c0c]/95 backdrop-blur-xl border border-white/[0.07] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
            {navLinks.map((link, i) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center justify-between px-5 py-3.5 text-sm font-medium transition-colors duration-150",
                  "border-b border-white/[0.04] last:border-0",
                  pathname === link.href
                    ? "text-white bg-white/[0.06]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <span>{link.name}</span>
                {pathname === link.href && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            header {
              padding-top: 8px !important;
              padding-bottom: 8px !important;
              min-height: unset !important;
              height: auto !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              width: 100% !important;
              overflow: visible !important;
              display: block !important;
              border-bottom: none !important;
              box-shadow: none !important;
            }
            header > div:first-child {
              position: relative !important;
              z-index: 50 !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}</style>
      </header>

      {/* Spotlight Search Overlay — desktop only */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "18vh"
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "580px",
              backgroundColor: "#111",
              border: "1px solid #ffffff15",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.05)"
            }}
          >
            {/* Search Input */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 20px",
              borderBottom: "1px solid #ffffff10"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                autoFocus
                placeholder="Search anything..."
                style={{
                  flex: 1,
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#fff",
                  fontSize: "16px",
                  fontFamily: "'Quicksand', sans-serif",
                  fontWeight: "500"
                }}
              />
              <kbd style={{
                fontSize: "11px",
                color: "#444",
                backgroundColor: "#1f1f1f",
                border: "1px solid #333",
                borderRadius: "4px",
                padding: "2px 6px",
                fontFamily: "monospace"
              }}>
                ESC
              </kbd>
            </div>

            {/* Quick Links */}
            <div style={{ padding: "8px" }}>
              <p style={{
                fontSize: "11px",
                color: "#444",
                padding: "8px 12px",
                fontFamily: "'Quicksand', sans-serif",
                letterSpacing: "1px",
                textTransform: "uppercase"
              }}>
                Quick Links
              </p>
              {["Home", "Resume", "Projects", "Blogs", "Papers", "Gallery", "Contact"].map((item, i) => (
                <a key={i} href={`/${item.toLowerCase() === "home" ? "" : item.toLowerCase()}`}
                  onClick={() => setSearchOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "8px",
                    color: "#888",
                    textDecoration: "none",
                    fontFamily: "'Quicksand', sans-serif",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = "#1a1a1a";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#888";
                  }}
                >
                  <span style={{ color: "#e0291d", fontSize: "12px" }}>→</span>
                  {item}
                </a>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: "10px 20px",
              borderTop: "1px solid #ffffff08",
              display: "flex",
              gap: "16px"
            }}>
              {[["↵", "Select"], ["↑↓", "Navigate"], ["ESC", "Close"]].map(([key, label]) => (
                <span key={key} style={{
                  fontSize: "11px",
                  color: "#444",
                  fontFamily: "'Quicksand', sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}>
                  <kbd style={{
                    backgroundColor: "#1f1f1f",
                    border: "1px solid #333",
                    borderRadius: "3px",
                    padding: "1px 5px",
                    fontFamily: "monospace"
                  }}>{key}</kbd>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
