"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Search } from "lucide-react";

interface Section {
  id: string;
  title: string;
}

const sections: Section[] = [
  { id: "overview", title: "1. Overview & Scope" },
  { id: "collection", title: "2. Information We Collect" },
  { id: "usage", title: "3. How Data Is Used" },
  { id: "cookies", title: "4. Cookies & Storage" },
  { id: "third-party", title: "5. Third-Party Services" },
  { id: "security", title: "6. Security & Retention" },
  { id: "rights", title: "7. Your Rights & Choices" },
  { id: "contact", title: "8. Contact Information" },
];

export function PrivacyPolicyClient() {
  const [activeSection, setActiveSection] = useState<string>("overview");
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
        .privacy-scope, .privacy-scope * {
          font-family: 'Quicksand', sans-serif !important;
        }
        .privacy-card {
          background: #0d0d0d;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <div className="privacy-scope max-w-7xl mx-auto">
        {/* Navigation Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Portfolio
          </Link>

          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-[#C83228] transition-colors"
          >
            Terms & Conditions <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Hero Header - Minimal clean card without Orbs */}
        <div className="privacy-card rounded-2xl p-8 md:p-10 mb-10">
          <div className="max-w-3xl">
            <span className="text-[#C83228] text-xs font-bold uppercase tracking-widest block mb-3">
              PRIVACY & TRANSPARENCY
            </span>

            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-4">
              Privacy Policy
            </h1>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Your privacy is valued and protected. This Privacy Policy details how personal information is collected, used, and safeguarded when visiting the portfolio of <strong className="text-white">Khondoker Sazzad Sunfi</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-white/[0.06] pt-4">
              <span>Effective Date: August 23, 2026</span>
              <span>•</span>
              <span>Domain: sunfi.vercel.app</span>
              <span>•</span>
              <span className="text-gray-400">No Spam Guarantee</span>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar / Navigation */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            {/* Quick Search */}
            <div className="privacy-card p-4 rounded-xl">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search in policy..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C83228] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Table of Contents */}
            <div className="privacy-card p-5 rounded-xl">
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

            {/* Quick Contact Box */}
            <div className="privacy-card p-5 rounded-xl">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Have Questions?
              </h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Reach out directly for any privacy inquiries or data removal requests.
              </p>
              <button
                onClick={copyEmail}
                className="text-xs font-medium text-gray-300 hover:text-[#C83228] transition-colors underline underline-offset-4"
              >
                {copiedEmail ? "Copied Email!" : "Copy sunfisazzad@gmail.com"}
              </button>
            </div>
          </div>

          {/* Right Column / Content Sections */}
          <div className="lg:col-span-8 space-y-6">
            {/* Section 1 */}
            <section id="overview" className="privacy-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">1. Overview & Scope</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                This Privacy Policy outlines how <strong className="text-white">Khondoker Sazzad Sunfi</strong> ("I", "me", or "my") handles information gathered through this portfolio website.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                This site serves as a personal showcase for software engineering projects, AI/ML research, publications, blog articles, and professional inquiries. By accessing or sending communications through this site, you acknowledge the terms outlined in this document.
              </p>
            </section>

            {/* Section 2 */}
            <section id="collection" className="privacy-card p-6 md:p-8 rounded-xl space-y-4">
              <h2 className="text-lg font-bold text-white tracking-tight">2. Information We Collect</h2>
              
              <div className="space-y-4">
                <div className="border-t border-white/[0.05] pt-3 space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Voluntarily Provided Information
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    When you use the contact form or send a direct email, the following information may be collected:
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 pl-1">
                    <li>Full Name</li>
                    <li>Email Address</li>
                    <li>Subject & Message Content</li>
                    <li>Project requirements or collaboration details included in your query</li>
                  </ul>
                </div>

                <div className="border-t border-white/[0.05] pt-3 space-y-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Automatically Collected Analytics & Technical Data
                  </h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Standard non-identifying technical metadata is collected automatically by web server infrastructure (Vercel):
                  </p>
                  <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 pl-1">
                    <li>Anonymized IP addresses & geographic region (country level)</li>
                    <li>Browser type, operating system, and device screen dimensions</li>
                    <li>Referring pages and page interaction analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="usage" className="privacy-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">3. How Your Information Is Used</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Collected information is strictly utilized to deliver a high-quality experience and facilitate professional collaboration:
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">Direct Communication</strong>
                  Responding to messages submitted via the contact form or direct email inquiries.
                </div>
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">Service & Security</strong>
                  Monitoring site performance, preventing automated spam, and maintaining system integrity.
                </div>
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">Portfolio Optimization</strong>
                  Analyzing general web traffic patterns to improve content and layout.
                </div>
                <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.05] text-gray-300">
                  <strong className="text-[#C83228] block mb-1">No Data Selling</strong>
                  Your information will never be sold, rented, leased, or traded to third parties for marketing purposes.
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section id="cookies" className="privacy-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">4. Cookies & Local Storage</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                This portfolio relies on minimal cookies or browser local storage necessary for core website functionality:
              </p>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1.5 pl-1">
                <li><strong>Essential State:</strong> Browser storage may be used to save your local UI preferences (such as command palette status or search filter states).</li>
                <li><strong>No Ad Tracking:</strong> This website does NOT deploy invasive third-party ad retargeting cookies or marketing trackers.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="third-party" className="privacy-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">5. Third-Party Services</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3">
                This website integrates trusted third-party cloud providers for hosting, content delivery, and messaging:
              </p>
              
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Vercel Inc.</span>
                    <span className="text-gray-400">Web application hosting, edge infrastructure, and performance analytics.</span>
                  </div>
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[#C83228] hover:underline text-xs shrink-0 ml-4">
                    Vercel Privacy
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Sanity.io</span>
                    <span className="text-gray-400">Headless CMS for structured blog and project content storage.</span>
                  </div>
                  <a href="https://www.sanity.io/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C83228] hover:underline text-xs shrink-0 ml-4">
                    Sanity Privacy
                  </a>
                </div>

                <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white block">Resend</span>
                    <span className="text-gray-400">Email delivery API used to securely route contact messages to my inbox.</span>
                  </div>
                  <a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[#C83228] hover:underline text-xs shrink-0 ml-4">
                    Resend Privacy
                  </a>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section id="security" className="privacy-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">6. Data Security & Retention</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Industry-standard encryption protocols (TLS 1.3 / HTTPS) are implemented across all endpoints to protect data in transit.
              </p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Contact submissions are retained only as long as necessary to address your communication or fulfill collaborative work agreements, after which they are securely archived or deleted upon request.
              </p>
            </section>

            {/* Section 7 */}
            <section id="rights" className="privacy-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">7. Your Rights & Choices</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                Regardless of your location, you hold full rights regarding your personal communication data:
              </p>
              <ul className="list-disc list-inside text-xs text-gray-300 space-y-1 pl-1">
                <li><strong>Access & Copy:</strong> You may request a copy of any personal contact information submitted.</li>
                <li><strong>Correction:</strong> You may request corrections to inaccurate contact details.</li>
                <li><strong>Deletion (Right to be Forgotten):</strong> You can request complete erasure of your contact messages from my records.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="contact" className="privacy-card p-6 md:p-8 rounded-xl space-y-3">
              <h2 className="text-lg font-bold text-white tracking-tight">8. Contact Information</h2>
              <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                For any privacy requests, questions, or concerns regarding this policy, please reach out directly:
              </p>
              
              <div className="p-4 rounded-lg bg-black/40 border border-white/[0.05] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="font-semibold text-white">Khondoker Sazzad Sunfi</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Email:</span>
                  <a href="mailto:sunfisazzad@gmail.com" className="font-semibold text-[#C83228] hover:underline">
                    sunfisazzad@gmail.com
                  </a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Location:</span>
                  <span className="text-white">Bangladesh</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
