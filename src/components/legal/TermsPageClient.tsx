"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

const sections: Section[] = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "intellectual-property", title: "2. Intellectual Property & Code" },
  { id: "acceptable-use", title: "3. Acceptable Use Policy" },
  { id: "external-links", title: "4. Third-Party & External Links" },
  { id: "disclaimer", title: "5. Disclaimer of Warranties" },
  { id: "limitation", title: "6. Limitation of Liability" },
  { id: "governing-law", title: "7. Governing Law & Modifications" },
  { id: "contact", title: "8. Inquiries & Permissions" },
];

export function TermsPageClient() {
  const [activeSection, setActiveSection] = useState<string>("acceptance");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText("sunfisazzad@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap');
        .terms-scope, .terms-scope * {
          font-family: 'Quicksand', sans-serif !important;
        }
        .terms-card {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="terms-scope max-w-7xl mx-auto">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#C83228] transition-colors"
          >
            Privacy Policy <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Header - Minimal clean card without Orbs */}
        <div className="terms-card rounded-2xl p-8 md:p-10 mb-10">
          <div className="max-w-3xl">
            <span className="text-[#C83228] text-xs font-bold uppercase tracking-widest block mb-3">
              LEGAL AGREEMENT & GUIDELINES
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              Terms & Conditions
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Please review these Terms & Conditions governing your access and usage of <strong className="text-white">Khondoker Sazzad Sunfi's</strong> personal portfolio, content, articles, and interactive features.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-white/[0.06] pt-4">
              <span>Last Modified: August 23, 2026</span>
              <span>•</span>
              <span>Domain: sunfi.vercel.app</span>
              <span>•</span>
              <span className="text-gray-400">Standard License & Fair Use</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar / Navigation */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            {/* Quick Search */}
            <div className="terms-card p-4 rounded-xl">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in terms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C83228] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Table of Contents */}
            <div className="terms-card p-5 rounded-xl">
              <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-4">
                TABLE OF CONTENTS
              </h3>

              <nav className="space-y-2">
                {sections
                  .filter((sec) =>
                    sec.title.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((sec) => {
                    const isActive = activeSection === sec.id;
                    return (
                      <button
                        key={sec.id}
                        onClick={() => scrollTo(sec.id)}
                        className={`w-full text-left py-1.5 text-xs transition-colors duration-200 block ${
                          isActive
                            ? "text-[#C83228] font-bold border-l-2 border-[#C83228] pl-3"
                            : "text-gray-400 hover:text-[#C83228] pl-3 border-l-2 border-transparent"
                        }`}
                      >
                        {sec.title}
                      </button>
                    );
                  })}
              </nav>
            </div>

            {/* In A Nutshell Card */}
            <div className="terms-card p-5 rounded-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Key Highlights
              </h4>
              <ul className="text-xs text-gray-400 space-y-1.5 leading-relaxed mb-4 list-disc list-inside">
                <li>Personal portfolio & educational content.</li>
                <li>Open-source projects respect repository licenses.</li>
                <li>No unauthorized commercial scraping or spam.</li>
              </ul>
              <button
                onClick={copyEmail}
                className="text-xs font-medium text-gray-300 hover:text-[#C83228] transition-colors underline underline-offset-4"
              >
                {copiedEmail ? "Copied Email!" : "Licensing Questions? Email"}
              </button>
            </div>
          </div>

          {/* Right Column / Content Sections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1 */}
            <section id="acceptance" className="terms-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">1. Acceptance of Terms</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                By browsing, accessing, or interacting with <strong className="text-white">sunfi.vercel.app</strong> or related portfolio subdomains, you agree to comply with and be bound by these Terms & Conditions.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                If you do not agree with any portion of these terms, please discontinue using the portfolio website.
              </p>
            </section>

            {/* Section 2 */}
            <section id="intellectual-property" className="terms-card p-6 md:p-8 rounded-xl space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">2. Intellectual Property & Code Rights</h2>
              
              <div className="space-y-3 text-xs">
                <div className="border-t border-white/[0.05] pt-3 space-y-1.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Portfolio Content & Design Ownership
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    All custom website designs, portfolio branding, articles, case studies, images, and original media hosted on this website are the intellectual property of <strong className="text-white">Khondoker Sazzad Sunfi</strong>, protected under copyright and intellectual property standards.
                  </p>
                </div>

                <div className="border-t border-white/[0.05] pt-3 space-y-1.5">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Open-Source Repositories & Code Licenses
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Code repositories showcased or linked from GitHub are governed by their respective open-source license files (e.g., MIT License, Apache 2.0, BSD). You are free to inspect, fork, or reuse open-source code in compliance with the specified license terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="acceptable-use" className="terms-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">3. Acceptable Use Policy</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                When using this portfolio, you agree to adhere to acceptable web practices:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">Permitted Actions</strong>
                  Viewing content, sharing links to portfolio pages, reading research write-ups, and contacting for professional opportunities.
                </div>
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">Prohibited Scraping</strong>
                  Aggressive automated scraping or harvesting of content for unauthorized commercial AI training without explicit written permission.
                </div>
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">Form Abuse & Spam</strong>
                  Submitting malicious payloads, advertising spam, or fraudulent queries through contact channels.
                </div>
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">Impersonation & Cyber Attacks</strong>
                  Attempting unauthorized access, overloading servers, or misrepresenting identity.
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="external-links" className="terms-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">4. Third-Party & External Links</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                This portfolio contains external outbound links to third-party platforms (GitHub, LinkedIn, X/Twitter, academic publications, research venues, etc.).
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                These external resources are owned and operated by third parties. Sunfi is not responsible for the content, privacy policies, or practices of external platforms. Visiting external links is done at your own discretion.
              </p>
            </section>

            {/* Section 5 */}
            <section id="disclaimer" className="terms-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">5. Disclaimer of Warranties</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                This portfolio, code snippets, project demos, and research articles are provided on an <strong className="text-white">"AS IS"</strong> and <strong className="text-white">"AS AVAILABLE"</strong> basis without warranties of any kind, whether express or implied.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                While every effort is made to maintain accurate project information and operational uptime, no guarantee is made that code samples or site components will be error-free or uninterrupted.
              </p>
            </section>

            {/* Section 6 */}
            <section id="limitation" className="terms-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">6. Limitation of Liability</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                To the maximum extent permitted by law, Khondoker Sazzad Sunfi shall not be liable for any direct, indirect, incidental, or consequential damages resulting from your access to, or inability to access, this website or reliance on information presented herein.
              </p>
            </section>

            {/* Section 7 */}
            <section id="governing-law" className="terms-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">7. Governing Law & Modifications</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                These terms are governed by and construed in accordance with applicable laws of Bangladesh and international web standards.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                I reserve the right to revise or update these Terms & Conditions at any time. Continued use of the website following published updates constitutes acceptance of the modified terms.
              </p>
            </section>

            {/* Section 8 */}
            <section id="contact" className="terms-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">8. Inquiries & Licensing Permissions</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                If you have questions regarding these terms, content usage permissions, or licensing requests for projects, please get in touch:
              </p>
              
              <div className="p-4 rounded-lg bg-black/40 border border-white/[0.05] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Owner:</span>
                  <span className="font-semibold text-white">Khondoker Sazzad Sunfi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Contact Email:</span>
                  <a href="mailto:sunfisazzad@gmail.com" className="font-semibold text-[#C83228] hover:underline">
                    sunfisazzad@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Portfolio:</span>
                  <span className="text-white">sunfi.vercel.app</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
