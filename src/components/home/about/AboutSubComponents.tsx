"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { Database, Calendar } from "lucide-react";

// ─── ACTS DATA ────────────────────────────────────────────────────────────────
export const ACTS = [
  {
    id: 0, numeral: "I",
    leftLabel: "PHILOSOPHY",
    leftText: "I grew up in Dhaka \u2014 a city that never stops moving, never stops generating data. In college, I picked up Python almost by accident. But the moment I saw what it could do with data, something clicked. Resources led to projects, projects led to competitions. Watching others build at those competitions didn't intimidate me \u2014 it obsessed me. Then came the data centers. Walking through rows of humming machines, I realized \u2014 this is where the world actually runs. That was the moment curiosity became direction.",
    rightLabel: "THE JOURNEY",
    rightHeadline: "Hi, I\u2019m Sunfi.",
    rightSubtext: "Before the models, there was curiosity.",
    ctaLabel: "Read My Story", ctaHref: "/resume",
    bubble: "Why does this work?",
    image: "/sunfi1.jpg",
    topKeyword: "ORIGIN",
    bgWord: "BEGIN",
  },
  {
    id: 1, numeral: "II",
    leftLabel: "THE CRAFT",
    leftText: "Studying Data Science at United International University, my first real test came from a problem hiding in plain sight \u2014 our campus lost & found system was broken. Items went missing in bureaucracy. Students gave up searching. My team and I built a web application that changed that: a proper database architecture, an ML verification system, an AI that could accurately identify and match items. It won an award. But more than the award, it proved something \u2014 that the messiest real-world problems have the most elegant solutions. That project didn't just teach me to code. It taught me why I code.",
    rightLabel: "THE BUILD",
    rightHeadline: "Where chaos becomes clarity.",
    rightSubtext: "BSc in Data Science @ United International University",
    ctaLabel: null, ctaHref: null,
    bubble: "There has to be a better way.",
    image: "/sunfi2.jpg",
    topKeyword: "PROCESS",
    bgWord: "BUILD",
  },
  {
    id: 2, numeral: "III",
    leftLabel: "THE MISSION",
    leftText: "My goal was never complex \u2014 become someone who solves problems that actually hurt people. A Data Scientist. An ML & AI Engineer. Not for the title, but for what the title allows me to do. The sign language project wasn't a destination \u2014 it was a beginning. There are millions of people whose lives could change with the right model, the right system, the right person willing to build it. I want to be that person. Every dataset I touch, every model I train, every system I architect \u2014 it will be for real people, with real struggles, in the real world. That is the only metric that matters to me.",
    rightLabel: "THE VISION",
    rightHeadline: "Building for those the world forgot to design for.",
    rightSubtext: "Data Scientist \u00b7 ML & AI Engineer \u00b7 Human-First Builder",
    ctaLabel: null, ctaHref: null,
    bubble: "I will build it.",
    image: "/sunfi3.jpg",
    topKeyword: "FUTURE",
    bgWord: "IMPACT",
  },
] as const;

export type ActIndex = 0 | 1 | 2;

// ─── MASKED TEXT COMPONENT (Horizontal Sweep) ────────────────────────────────
export function MaskedText({ text, triggerKey, className, as = "p", stagger = 0.12, style = {} }: {
  text: string; triggerKey: number; className?: string; as?: any; stagger?: number; style?: React.CSSProperties;
}) {
  const lines = text.split("\n").length > 1 ? text.split("\n") : [text];
  const Component = (motion[as as keyof typeof motion] || motion.p) as any;

  return (
    <div className={className} style={style}>
      {lines.map((line, i) => (
        <div key={`${triggerKey}-${i}`} className="overflow-hidden">
          <Component
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={{ clipPath: "inset(0 0% 0 0)" }}
            transition={{
              duration: 0.7,
              delay: i * stagger,
              ease: [0.77, 0, 0.175, 1]
            }}
          >
            {line}
          </Component>
        </div>
      ))}
    </div>
  );
}

// ─── FIXED ABOUT HEADER ──────────────────────────────────────────────────────
export function FixedAboutHeader({ act }: { act: ActIndex }) {
  const actData = ACTS[act];
  return (
    <div className="w-full h-[40px] border-b border-[rgba(255,255,255,0.12)] flex items-center px-4 md:px-8 lg:px-10">
      <span className="text-[10px] font-mono text-[rgba(255,255,255,0.3)]">ACT {actData.numeral}</span>
      <span className="flex-1 text-center text-[10px] tracking-widest text-[rgba(255,255,255,0.3)]">SUNFI ISLAM</span>
      <span className="text-[10px] text-[rgba(255,255,255,0.3)] uppercase">{actData.leftLabel}</span>
    </div>
  );
}

// ─── PROGRESS INDICATOR ───────────────────────────────────────────────────────
export function ProgressIndicator({ current, onGoto, visible }: {
  current: ActIndex; onGoto: (i: ActIndex) => void; visible: boolean;
}) {
  return (
    <motion.div
      className="hidden lg:flex flex-col items-center gap-8"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-[1px] bg-gradient-to-b from-transparent to-gray-700" />
        {/* Removed vertical "About Me" label */}
      </div>

      <div className="flex flex-col items-center">
        {ACTS.map((act, i) => {
        const isActive = i === current;
        const isDone = i < current;
        return (
          <div key={act.id} className="flex flex-col items-center">
            <button onClick={() => onGoto(i as ActIndex)} className="flex flex-col items-center gap-1" aria-label={`Act ${act.numeral}`}>
              <motion.div
                animate={isActive ? { scale: [1, 1.35, 1] } : { scale: 1 }}
                transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                className={`w-3 h-3 rounded-full border-2 transition-colors duration-500 ${
                  isActive ? "bg-[#FF003C] border-[#FF003C] shadow-[0_0_12px_rgba(255,0,60,0.9)]"
                  : isDone ? "bg-[#FF003C]/40 border-[#FF003C]/40"
                  : "bg-transparent border-gray-600"
                }`}
              />
              <span className={`text-[9px] font-[family-name:var(--font-heading)] tracking-widest transition-colors duration-500 ${
                isActive ? "text-[#FF003C] drop-shadow-[0_0_6px_rgba(255,0,60,0.9)]"
                : isDone ? "text-[#FF003C]/50" : "text-gray-600"
              }`}>{act.numeral}</span>
            </button>
            {i < ACTS.length - 1 && (
              <div className="relative h-10 w-[1px] my-1 bg-gray-700 overflow-hidden">
                <motion.div className="absolute top-0 left-0 w-full bg-[#FF003C]"
                  animate={{ height: isDone ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
      </div>
    </motion.div>
  );
}

// ─── MOBILE DOTS ─────────────────────────────────────────────────────────────
export function MobileDots({ current, onGoto }: { current: ActIndex; onGoto: (i: ActIndex) => void }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex lg:hidden gap-3 items-center">
      {ACTS.map((_, i) => (
        <button key={i} onClick={() => onGoto(i as ActIndex)} aria-label={`Act ${i + 1}`}
          className={`rounded-full transition-all duration-400 ${
            i === current ? "w-6 h-2 bg-[#FF003C] shadow-[0_0_8px_rgba(255,0,60,0.8)]" : "w-2 h-2 bg-gray-600"
          }`}
        />
      ))}
    </div>
  );
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
export function MagneticButton({ children, disabled }: { children: React.ReactNode; disabled?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <motion.div ref={ref}
      onMouseMove={(e) => {
        if (disabled || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className="inline-block"
    >{children}</motion.div>
  );
}

// ─── TYPEWRITER BUBBLE ───────────────────────────────────────────────────────
export function TypewriterBubble({ text, triggerKey }: { text: string; triggerKey: number }) {
  const [displayed, setDisplayed] = useState("");
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setDisplayed(""); setVisible(true);
    let i = 0;
    const iv = setInterval(() => {
      i++; setDisplayed(text.slice(0, i));
      if (i >= text.length) { clearInterval(iv); setTimeout(() => setVisible(false), 3000); }
    }, 45);
    return () => clearInterval(iv);
  }, [triggerKey, text]);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.3 }}
          className="absolute -top-12 left-1/2 -translate-x-1/2 z-30 whitespace-nowrap">
          <div className="px-3 py-1.5 text-[11px] font-[family-name:var(--font-heading)] text-white border border-[#FF003C]/50 rounded-sm"
            style={{ background: "#0a0a0a" }}>
            &ldquo;{displayed}<span className="animate-pulse ml-0.5">|</span>&rdquo;
          </div>
          <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 border-r border-b border-[#FF003C]/50"
            style={{ background: "#0a0a0a" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── ANIMATED COUNTER ────────────────────────────────────────────────────────
export function AnimatedCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (target < 0) return;
    const dur = 1500; const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-2">
      <span className="text-xl md:text-2xl font-[family-name:var(--font-heading)] font-bold text-[#FF003C] drop-shadow-[0_0_10px_rgba(255,0,60,0.6)]">
        {target < 0 ? "\u221E" : `${val}${suffix}`}
      </span>
      <span className="text-[9px] text-gray-500 font-[family-name:var(--font-heading)] tracking-widest uppercase text-center leading-tight max-w-[64px]">
        {label}
      </span>
    </div>
  );
}

// ─── IMAGE CARD ──────────────────────────────────────────────────────────────
export function ImageCard({ actIndex, triggerKey, badgeDeltaX, badgeDeltaY }: {
  actIndex: ActIndex; triggerKey: number;
  badgeDeltaX: MotionValue<number>; badgeDeltaY: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  const act = ACTS[actIndex];
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => { setIsMobile(window.innerWidth < 768); }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    ry.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * 15);
    rx.set(-((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * 15);
  };

  const borderClass = "border-[rgba(255,0,60,0.8)] shadow-[0_0_20px_rgba(255,0,60,0.6),0_0_40px_rgba(255,0,60,0.3)]";

  return (
    <div className="flex justify-center w-full">
      <div ref={cardRef} onMouseMove={handleMove} onMouseLeave={() => { rx.set(0); ry.set(0); }}
        className="relative w-[240px] md:w-[280px] lg:w-[320px] max-h-[55vh]"
        style={{ perspective: 1000, aspectRatio: "3 / 4" }}>

        {/* L-corners */}
        {(["tl","tr","bl","br"] as const).map((c) => (
          <div key={c} className={`absolute w-7 h-7 z-30 pointer-events-none ${
            c === "tl" ? "-top-2 -left-2 border-t-2 border-l-2 border-[#FF003C]/50" :
            c === "tr" ? "-top-2 -right-2 border-t-2 border-r-2 border-[#FF003C]/50" :
            c === "bl" ? "-bottom-2 -left-2 border-b-2 border-l-2 border-[#FF003C]/50" :
                         "-bottom-2 -right-2 border-b-2 border-r-2 border-[#FF003C]/50"
          }`} />
        ))}

        {/* Floating Stat Badge — Top Left (BLUE) */}
        <motion.div
          className="absolute -top-4 -left-6 z-40 pointer-events-none"
          style={{ x: badgeDeltaX, y: badgeDeltaY }}
        >
          <motion.div
            animate={{ y: [-4, 0, -4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(59,130,246,0.4)]"
            style={{ background: "#0a0a0a", boxShadow: "0 0 12px rgba(59,130,246,0.3)" }}
          >
            <div className="p-1.5 rounded-lg bg-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              <Database className="w-4 h-4 text-[#60A5FA] flex-shrink-0" />
            </div>
            <div>
              <p className="text-white text-[16px] font-[family-name:var(--font-heading)] font-bold leading-none">50+</p>
              <p className="text-white/70 text-[10px] font-[family-name:var(--font-heading)] tracking-wider uppercase leading-tight mt-0.5">Datasets Explored</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Stat Badge — Bottom Right (GREEN) */}
        <motion.div
          className="absolute -bottom-4 -right-6 z-40 pointer-events-none"
          style={{ x: badgeDeltaX, y: badgeDeltaY }}
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-[rgba(34,197,94,0.4)]"
            style={{ background: "#0a0a0a", boxShadow: "0 0 12px rgba(34,197,94,0.3)" }}
          >
            <div className="p-1.5 rounded-lg bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.5)]">
              <Calendar className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />
            </div>
            <div>
              <p className="text-white text-[16px] font-[family-name:var(--font-heading)] font-bold leading-none">2+</p>
              <p className="text-white/70 text-[10px] font-[family-name:var(--font-heading)] tracking-wider uppercase leading-tight mt-0.5">Years Experience</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D tilt target */}
        <motion.div className="absolute inset-0" style={{ rotateX: srx, rotateY: sry }}>
          <div className={`relative w-full h-full overflow-hidden border transition-all duration-700 ${borderClass}`}
            style={{ background: "#050505" }}>

            {/* Images — layered crossfade */}
            {ACTS.map((a, i) => (
              <motion.div key={`img-${i}`} className="absolute inset-0"
                animate={{ opacity: i === actIndex ? 1 : 0 }} transition={{ duration: 0.6 }}>
                                <Image src={a.image} alt={`Sunfi – Act ${i + 1}`} fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1280px) 45vw, 320px"
                  className="object-cover object-top"
                  priority={i === 0} />
              </motion.div>
            ))}

            {/* Voice bubble */}
            <div className="absolute top-4 left-0 right-0 flex justify-center z-20">
              <TypewriterBubble text={act.bubble} triggerKey={triggerKey} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
