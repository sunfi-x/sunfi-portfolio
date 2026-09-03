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

            {/* Mobile: Floating Fixed 3-Line Hamburger Menu Button & Dropdown */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(prev => !prev)}
                className="fixed top-4 right-4 z-[250] flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#111111]/90 backdrop-blur-xl shadow-[0_8px_25px_rgba(0,0,0,0.85)] transition-all active:scale-95 cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                <div className="flex flex-col gap-[4.5px] w-[18px]">
                  <span
                    className={cn(
                      "block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center",
                      mobileMenuOpen ? "rotate-45 translate-y-[6px]" : ""
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[1.5px] bg-white rounded-full transition-all duration-300",
                      mobileMenuOpen ? "opacity-0 scale-x-0" : ""
                    )}
                  />
                  <span
                    className={cn(
                      "block h-[1.5px] bg-white rounded-full transition-all duration-300 origin-center",
                      mobileMenuOpen ? "-rotate-45 -translate-y-[6px]" : ""
                    )}
                  />
                </div>
              </button>

              {/* Floating Mobile Dropdown Menu */}
              <div
                className={cn(
                  "fixed top-16 right-4 z-[250] w-[220px] overflow-hidden transition-all duration-300 ease-in-out",
                  mobileMenuOpen ? "max-h-[420px] opacity-100 scale-100" : "max-h-0 opacity-0 scale-95 pointer-events-none"
                )}
                style={{ transformOrigin: "top right" }}
              >
                <nav className="rounded-2xl bg-[#0c0c0c]/98 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.9)] p-1.5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-colors duration-150",
                        pathname === link.href
                          ? "text-white bg-white/10 font-bold"
                          : "text-gray-300 hover:text-white hover:bg-white/[0.06]"
                      )}
                    >
                      <span>{link.name}</span>
                      {pathname === link.href && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D90429]" />
                      )}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            header {
              padding-top: 12px !important;
              padding-bottom: 8px !important;
              min-height: unset !important;
              height: auto !important;
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              right: 0 !important;
              width: 100% !important;
              overflow: visible !important;
              display: block !important;
              border-bottom: none !important;
              box-shadow: none !important;
              background: transparent !important;
            }
            header > div:first-child {
              position: relative !important;
              z-index: 50 !important;
              box-shadow: none !important;
              border: none !important;
              background: transparent !important;
              backdrop-filter: none !important;
              padding: 4px 16px !important;
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
