"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { JetBrains_Mono, Lexend } from "next/font/google";
import { 
  IconClock, 
  IconMail, 
  IconPhone, 
  IconBrandGithub, 
  IconBrandLinkedin, 
  IconBrandX, 
  IconBrandFacebook, 
  IconBrandInstagram, 
  IconBrandDiscord, 
  IconBrandTelegram, 
  IconBrandYoutube,
  IconBrandWhatsapp
} from "@tabler/icons-react";

const jetbrains = JetBrains_Mono({ 
  subsets: ["latin"], 
  weight: ["400", "500", "700"] 
});

const lexend = Lexend({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500"] 
});

const TICKER_MSGS = [
  "Dhaka, Bangladesh · UTC+6",
  "Open to remote worldwide",
  "Data Science · ML · AI",
  "Last active: today",
  "~2h avg response time"
];

const SOCIAL_LINKS = [
  { label: "GitHub",     url: "https://github.com/sunfi-x",        icon: IconBrandGithub },
  { label: "LinkedIn",   url: "https://www.linkedin.com/in/khondoker-sazzad-sunfi-3124a4325/",   icon: IconBrandLinkedin },
  { label: "X / Twitter",url: "https://x.com/SUNFI15",             icon: IconBrandX },
  { label: "Facebook",   url: "https://www.facebook.com/sazzadsunfi/",      icon: IconBrandFacebook },
  { label: "Instagram",  url: "https://www.instagram.com/sazzadsunfi/",     icon: IconBrandInstagram },
  { label: "Discord",    url: "https://discord.com/users/sunfi_x",       icon: IconBrandDiscord },
  { label: "Telegram",   url: "https://t.me/sunfi_x",              icon: IconBrandTelegram },
  { label: "WhatsApp",   url: "https://wa.me/8801309605222",       icon: IconBrandWhatsapp },
];

// Formatters created once at module level — never recreated
const timeFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: true,
});

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "Asia/Dhaka",
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function ContactCard() {
  const [uptime, setUptime]           = useState("00:00:00");
  const [clock, setClock]             = useState({ time: "--:--:--", ampm: "--", date: "---" });
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerOpacity, setTickerOpacity] = useState(1);

  // Uptime
  useEffect(() => {
    const startTime = Date.now();
    const id = setInterval(() => {
      const s   = Math.floor((Date.now() - startTime) / 1000);
      const hh  = String(Math.floor(s / 3600)).padStart(2, "0");
      const mm  = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
      const ss  = String(s % 60).padStart(2, "0");
      setUptime(`${hh}:${mm}:${ss}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Clock — Dhaka, 12-hour
  useEffect(() => {
    const tick = () => {
      const now   = new Date();
      const parts = timeFormatter.formatToParts(now);
      const h     = parts.find(p => p.type === "hour")?.value      ?? "00";
      const m     = parts.find(p => p.type === "minute")?.value    ?? "00";
      const s     = parts.find(p => p.type === "second")?.value    ?? "00";
      const ampm  = parts.find(p => p.type === "dayPeriod")?.value ?? "--";
      setClock({ time: `${h}:${m}:${s}`, ampm, date: dateFormatter.format(now) });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Ticker
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setTickerOpacity(0);
      timeoutId = setTimeout(() => {
        setTickerIndex(prev => (prev + 1) % TICKER_MSGS.length);
        setTickerOpacity(1);
      }, 350);
    }, 3000);
    return () => {
      clearInterval(id);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className={`relative w-full flex items-center justify-center p-6 ${lexend.className}`}>

      {/* Card — sits on top of whatever background the parent provides */}
      <div className="relative z-10 w-full max-w-[1100px] bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl selection:bg-[#C83228D9]/30">

        {/* Scanline */}
        <div
          className="absolute inset-0 pointer-events-none z-0 rounded-2xl"
          style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(200,50,40,0.01) 2px,rgba(200,50,40,0.01) 4px)" }}
        />

        {/* ── Header ── */}
        <div className="relative z-10 flex items-center justify-between px-[22px] py-3 border-b border-white/5 bg-white/5">
          <span className={`${jetbrains.className} text-[10px] text-white/40 tracking-[2px]`}>
            SUNFI.DEV — CONTACT
          </span>
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center gap-1.5 bg-black border border-white/10 rounded-md px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
              <span className={`${jetbrains.className} text-[11px] text-white/50 tracking-wider`}>
                UP <span className="text-[#22c55e]">{uptime}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── Two-column body ── */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">

          {/* LEFT */}
          <div className="px-5 py-5 sm:px-7 sm:py-6 md:px-8 md:py-7">

            {/* Status + Clock */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-4 sm:gap-2 mb-[1.4rem]">
              <div className="flex flex-col gap-2 shrink-0">
                <div className="inline-flex items-center gap-2 bg-[#0d1a0e] border border-[#1a3320] rounded-md px-3 py-1.5 w-fit">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse-status" />
                  <span className={`${jetbrains.className} text-[11px] text-[#22c55e] tracking-[1.5px]`}>ONLINE</span>
                </div>
                <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-md px-2.5 py-1 w-fit">
                  <IconClock size={10} className="text-white/30" />
                  <span className={`${jetbrains.className} text-[9px] text-white/40 tracking-widest uppercase`}>AVG RESPONSE · ~2H</span>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <div className={`${jetbrains.className} text-[11px] text-white/30 tracking-[2px] mb-1 uppercase`}>DHAKA · BDT</div>
                <div className={`${jetbrains.className} text-[22px] sm:text-[26px] font-bold text-[#e8e8e8] tracking-[1.5px] sm:tracking-[2px] tabular-nums flex items-end justify-start sm:justify-end gap-1`}>
                  {clock.time}
                  <span className="text-[12px] sm:text-[14px] font-normal text-white/40 tracking-wider pb-[2px] sm:pb-[3px]">{clock.ampm}</span>
                </div>
                <div className={`${jetbrains.className} text-[12px] text-white/40 mt-1`}>{clock.date}</div>
                <div className={`${jetbrains.className} text-[10px] text-white/20 mt-0.5 tracking-wider`}>UTC +06:00</div>
              </div>
            </div>

            {/* Sysbar */}
            <div className="flex flex-wrap gap-1 items-center justify-between bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 mb-5">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
                <span className={`${jetbrains.className} text-[8px] text-white/40 tracking-wider uppercase`}>SYSTEMS</span>
                <span className={`${jetbrains.className} text-[8px] text-[#22c55e] tracking-widest`}>NOMINAL</span>
              </div>
              <span className={`${jetbrains.className} text-[8px] text-white/10`}>//</span>
              <div className="flex items-center gap-1.5">
                <span className={`${jetbrains.className} text-[8px] text-white/40 tracking-wider uppercase`}>MODE</span>
                <span className={`${jetbrains.className} text-[8px] text-blue-400/70 tracking-widest uppercase`}>Freelance + Full-time</span>
              </div>
              <span className={`${jetbrains.className} text-[8px] text-white/10 hidden sm:inline`}>//</span>
              <div className="hidden sm:flex items-center gap-1.5">
                <span className={`${jetbrains.className} text-[8px] text-white/40 tracking-wider uppercase`}>LOCATION</span>
                <span className={`${jetbrains.className} text-[8px] text-purple-400/70 tracking-widest uppercase`}>Dhaka, BD</span>
              </div>
            </div>

            <div className={`${jetbrains.className} text-[11px] text-white/30 tracking-[1.5px] mb-1 uppercase`}>// MISSION.md</div>
            <div className={`${jetbrains.className} text-[21px] font-bold text-[#d4d4d4] leading-tight tracking-tight mb-3 uppercase`}>
              MISSION: BUILD SOMETHING{" "}
              <span className="text-[#C83228D9] animate-blink-fast drop-shadow-[0_0_20px_rgba(200,50,40,0.35)]">IMPACTFUL</span>
            </div>

            <div className="text-[13.5px] font-light text-white/50 leading-[1.9] border-l-2 border-white/5 pl-3">
              <span className={`${jetbrains.className} text-[#C83228D9] opacity-80 mr-2`}>&gt;</span>
              Whether you have a data problem or just an idea —<br />
              <span className={`${jetbrains.className} text-[#C83228D9] opacity-80 mr-2`}>&gt;</span>
              I&apos;m always open to new opportunities &amp; collabs.
              <span className="inline-block w-[7px] h-[11px] bg-[#C83228D9] opacity-70 ml-1 align-[-2px] animate-blink-cursor" />
            </div>
          </div>

          {/* Separator */}
          <div className="w-full h-[1px] md:w-[1px] md:h-full bg-[#141414]" />

          {/* RIGHT */}
          <div className="px-5 py-5 sm:px-7 sm:py-6 md:px-8 md:py-7">

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
              <Link href="mailto:sunfisazzad@gmail.com" className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-all duration-200 hover:border-[#C8322855] hover:bg-[#110407] group">
                <IconMail size={24} className="text-white/30 group-hover:text-[#C83228D9] transition-colors flex-shrink-0" />
                <div>
                  <span className={`${jetbrains.className} block text-[11px] text-white/40 tracking-wider mb-0.5 uppercase`}>EMAIL</span>
                  <span className="block text-[14px] text-white/70 group-hover:text-white transition-colors">sunfisazzad@gmail.com</span>
                </div>
              </Link>
              <Link href="tel:+8801309605222" className="flex items-center gap-3.5 bg-white/5 border border-white/10 rounded-xl px-4 py-3 transition-all duration-200 hover:border-[#C8322855] hover:bg-[#110407] group">
                <IconPhone size={24} className="text-white/30 group-hover:text-[#C83228D9] transition-colors flex-shrink-0" />
                <div>
                  <span className={`${jetbrains.className} block text-[11px] text-white/40 tracking-wider mb-0.5 uppercase`}>PHONE</span>
                  <span className="block text-[14px] text-white/70 group-hover:text-white transition-colors">+880 1309 605 222</span>
                </div>
              </Link>
            </div>

            {/* Social */}
            <div className={`${jetbrains.className} text-[12px] text-white/30 tracking-[2px] mb-2 uppercase`}>// FIND ME ON</div>
            <div className="flex gap-1.5 flex-wrap mb-5">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-[42px] h-[42px] rounded-lg bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200 hover:border-[#C8322855] hover:bg-[#120407] hover:-translate-y-0.5"
                >
                  <social.icon size={20} className="text-white/40 group-hover:text-[#C83228D9] transition-colors" />
                  <span className={`${jetbrains.className} absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-[#171717] text-white/60 text-[9px] px-2 py-1 rounded-md border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none`}>
                    {social.label}
                  </span>
                </a>
              ))}
            </div>

            <hr className="border-none border-t border-[#111] my-[1.1rem]" style={{ borderTopWidth: "1px", borderColor: "#111" }} />

            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 w-full py-3 bg-[#C83228D9] hover:bg-[#C83228] text-[#FFFFFF] rounded-xl text-[13px] font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(200,50,40,0.35)] tracking-wide"
            >
              <IconMail size={18} />
              Email Me Directly →
            </Link>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="relative z-10 flex items-center justify-between px-[22px] py-2.5 border-t border-white/5 bg-white/5">
          <div className="flex items-center gap-1.5 text-[11px] font-light text-white/40">
            <div className="w-1.5 h-1.5 rounded-full bg-[#22c55e]" />
            Open to freelance &amp; full-time
          </div>
          <div
            className={`${jetbrains.className} text-[11px] text-white/30 transition-opacity duration-300`}
            style={{ opacity: tickerOpacity }}
          >
            {TICKER_MSGS[tickerIndex]}
          </div>
        </div>

      </div>

      <style jsx global>{`
        @keyframes pulse-status {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        @keyframes blink-fast {
          0%, 49%  { opacity: 1; }
          50%, 100%{ opacity: 0; }
        }
        @keyframes blink-cursor {
          0%, 49%  { opacity: 0.5; }
          50%, 100%{ opacity: 0; }
        }
        .animate-pulse-status { animation: pulse-status 2s ease-in-out infinite; }
        .animate-blink-fast   { animation: blink-fast  1.3s step-start infinite; }
        .animate-blink-cursor { animation: blink-cursor 1s  step-start infinite; }
      `}</style>
    </div>
  );
}
