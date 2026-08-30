"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChatMessage } from "./ChatMessage";
import { QUICK_PROMPTS } from "@/data/portfolio-data";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content:
    "Hi there! 👋 I'm **Sunfi AI**, your guide to Khondoker Sazzad Sunfi's portfolio.\n\nAsk me anything about his background, ML projects, research, skills, or how to get in touch!",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2.5 mb-3.5 px-1 font-quicksand" style={{ fontFamily: "var(--font-quicksand), sans-serif" }}>
      <div className="flex-shrink-0 relative w-7 h-7 rounded-full overflow-hidden border border-white/20 shadow-xs">
        <Image src="/sazzadsunfi.jpg" alt="Sunfi" fill className="object-cover" sizes="28px" />
      </div>
      <div
        className="px-4 py-2.5 rounded-2xl rounded-tl-xs flex items-center gap-1.5 shadow-xs"
        style={{
          backgroundColor: "#1D1F21",
          border: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-[#60A5FA]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}

function QuickPromptChips({
  onSelect,
  disabled,
}: {
  onSelect: (prompt: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5 px-4 pb-2.5 font-quicksand" style={{ fontFamily: "var(--font-quicksand), sans-serif" }}>
      {QUICK_PROMPTS.map((qp) => (
        <button
          key={qp.label}
          onClick={() => onSelect(qp.prompt)}
          disabled={disabled}
          className="text-xs px-3 py-1 rounded-full border transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-medium font-quicksand"
          style={{
            backgroundColor: "#1D1F21",
            borderColor: "rgba(255, 255, 255, 0.08)",
            color: "#cbd5e1",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "#212427";
            (e.target as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.2)";
            (e.target as HTMLElement).style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = "#1D1F21";
            (e.target as HTMLElement).style.borderColor = "rgba(255, 255, 255, 0.08)";
            (e.target as HTMLElement).style.color = "#cbd5e1";
          }}
        >
          {qp.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main Widget ──────────────────────────────────────────────────────────────

export function AiAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showQuickPrompts, setShowQuickPrompts] = useState(true);
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Notify user of new message when widget is closed
  useEffect(() => {
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].role === "assistant") {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen) setHasNewMessage(false);
  }, [isOpen]);

  // Cleanup abort on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const sendMessage = useCallback(
    async (messageText?: string) => {
      const text = (messageText ?? input).trim();
      if (!text || isLoading) return;

      setInput("");
      setError(null);
      setShowQuickPrompts(false);
      setIsLoading(true);

      const userMsg: Message = { role: "user", content: text };
      setMessages((prev) => [...prev, userMsg]);

      // Create a placeholder for the streaming assistant message
      const assistantPlaceholder: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, assistantPlaceholder]);
      setIsStreaming(true);

      abortRef.current = new AbortController();

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages
              .slice(1) // exclude the welcome message from history
              .filter((m) => m.content !== "") // no empty placeholder
              .slice(-12), // bounded: at most 12 messages
          }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          const errorMsg =
            errData?.error ??
            "Something went wrong. Please try again or contact Sunfi directly.";
          setMessages((prev) => [
            ...prev.slice(0, -1), // remove placeholder
            { role: "assistant", content: `⚠️ ${errorMsg}` },
          ]);
          setError(errorMsg);
          return;
        }

        // Check if it's a streaming response or a JSON response
        const contentType = res.headers.get("content-type") ?? "";

        if (contentType.includes("application/json")) {
          // Non-streaming fallback
          const data = await res.json();
          const responseText = data.response ?? "I couldn't generate a response.";
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { role: "assistant", content: responseText },
          ]);
        } else {
          // Streaming text/plain
          const reader = res.body?.getReader();
          const decoder = new TextDecoder();

          if (!reader) throw new Error("No readable stream");

          let accumulated = "";

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            accumulated += chunk;

            // Update the last (assistant) message in place
            setMessages((prev) => [
              ...prev.slice(0, -1),
              { role: "assistant", content: accumulated },
            ]);
          }
        }
      } catch (err: unknown) {
        if ((err as Error)?.name === "AbortError") return;
        console.error("[Chat] Error:", err);
        const errMsg = "I'm having trouble connecting right now. Please try again shortly.";
        setMessages((prev) => [
          ...prev.slice(0, -1),
          { role: "assistant", content: `⚠️ ${errMsg}` },
        ]);
        setError(errMsg);
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleReset = () => {
    abortRef.current?.abort();
    setMessages([WELCOME_MESSAGE]);
    setInput("");
    setError(null);
    setIsLoading(false);
    setIsStreaming(false);
    setShowQuickPrompts(true);
  };

  // Widget dimensions
  const modalWidth = isExpanded ? "min(680px, 96vw)" : "min(400px, 96vw)";
  const modalHeight = isExpanded ? "min(650px, 85vh)" : "min(550px, 82vh)";

  return (
    <div className="font-quicksand" style={{ fontFamily: "var(--font-quicksand), sans-serif" }}>
      {/* ── Trigger Button & Tooltip Callout ── */}
      <div className="fixed bottom-6 right-6 flex flex-col items-end gap-2" style={{ zIndex: 9999 }}>
        <AnimatePresence>
          {!isOpen && (
            <>
              {/* Pill Trigger Button with Avatar + Label + Chat Icon */}
              <motion.button
                key="trigger"
                onClick={() => setIsOpen(true)}
                aria-label="Ask Sunfi AI"
                className="relative flex items-center gap-2.5 px-3 py-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 transition-all font-quicksand"
                style={{
                  backgroundColor: "#121212",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.85), 0 0 15px rgba(255, 255, 255, 0.05)",
                  border: "1.5px solid rgba(255, 255, 255, 0.18)",
                  fontFamily: "var(--font-quicksand), sans-serif",
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Avatar Image sazzadsunfi.jpg */}
                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 flex-shrink-0">
                  <Image src="/sazzadsunfi.jpg" alt="Sunfi" fill className="object-cover rounded-full" sizes="32px" />
                  {/* Online status indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#121212]" />
                </div>

                {/* Text Label: Ask Sunfi AI */}
                <div className="flex items-center gap-1.5 pr-1">
                  <span className="text-xs font-bold text-white tracking-tight font-quicksand">
                    Ask Sunfi AI
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#60A5FA]/20 text-[#60A5FA] border border-[#60A5FA]/30 uppercase tracking-wider">
                    AI
                  </span>
                </div>

                {/* Chat / Sparkle Icon */}
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>

                {/* New message badge */}
                {hasNewMessage && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#D90429] border-2 border-[#121212] z-20 animate-pulse" />
                )}
              </motion.button>
            </>
          )}
        </AnimatePresence>

        {/* ── Widget Card (#0A0A0A) ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="modal"
              className="absolute bottom-0 right-0 flex flex-col overflow-hidden rounded-2xl font-quicksand"
              style={{
                width: modalWidth,
                height: modalHeight,
                backgroundColor: "#0A0A0A", // Widget Background Color: #0A0A0A
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: "0 20px 50px rgba(0, 0, 0, 0.95)",
                fontFamily: "var(--font-quicksand), sans-serif",
              }}
              initial={{ opacity: 0, scale: 0.88, y: 20, originX: 1, originY: 1 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 20 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {/* ── Top Header: Charcoal Gray (#121212) ── */}
              <div
                className="flex items-center justify-between px-4 py-3 flex-shrink-0"
                style={{
                  backgroundColor: "#121212", // Top Header Color: #121212
                  borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <div className="flex items-center gap-3">
                  {/* sazzadsunfi.jpg avatar */}
                  <div className="relative flex items-center">
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 shadow-xs">
                      <Image src="/sazzadsunfi.jpg" alt="Sunfi Avatar" fill className="object-cover" sizes="32px" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#121212]" />
                  </div>

                  <div>
                    {/* Header Title: Sunfi AI */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white leading-tight font-quicksand tracking-tight">
                        Sunfi
                      </span>
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-white/10 text-white uppercase tracking-wider">
                        AI
                      </span>
                    </div>

                    {/* Subtitle: AI Assistant */}
                    <p className="text-[11px] font-medium text-slate-400 leading-tight font-quicksand mt-0.5">
                      AI Assistant
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Expand / compress */}
                  <button
                    onClick={() => setIsExpanded((e) => !e)}
                    aria-label={isExpanded ? "Compress widget" : "Expand widget"}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    {isExpanded ? (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="4 14 10 14 10 20" /><polyline points="20 10 14 10 14 4" />
                        <line x1="10" y1="14" x2="3" y2="21" /><line x1="21" y1="3" x2="14" y2="10" />
                      </svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" />
                        <line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" />
                      </svg>
                    )}
                  </button>

                  {/* Reset */}
                  <button
                    onClick={handleReset}
                    aria-label="Reset conversation"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="Clear chat"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 .49-4.51" />
                    </svg>
                  </button>

                  {/* Close */}
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close AI assistant"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── Messages Container: #0A0A0A ── */}
              <div
                className="flex-1 overflow-y-auto px-4 pt-4 scroll-smooth font-quicksand"
                style={{
                  backgroundColor: "#0A0A0A", // Widget Background: #0A0A0A
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
                }}
              >
                {messages.map((msg, idx) => (
                  <ChatMessage
                    key={idx}
                    role={msg.role}
                    content={msg.content}
                    isStreaming={
                      isStreaming &&
                      idx === messages.length - 1 &&
                      msg.role === "assistant"
                    }
                  />
                ))}

                {/* Typing indicator */}
                {isLoading && !isStreaming && <TypingIndicator />}

                {/* Error notice */}
                {error && !isLoading && (
                  <p className="text-xs text-center text-red-400 mb-3 px-4 font-quicksand">
                    {error}
                  </p>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* ── Quick prompts ── */}
              <AnimatePresence>
                {showQuickPrompts && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                    style={{
                      backgroundColor: "#0e0e0e",
                      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                    }}
                  >
                    <p className="text-[11px] font-medium text-slate-400 px-4 pt-2.5 pb-1 font-quicksand">Suggested topics</p>
                    <QuickPromptChips
                      onSelect={(prompt) => sendMessage(prompt)}
                      disabled={isLoading}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Bottom Input Chatbox: Charcoal Gray (#121212) ── */}
              <div
                className="flex items-end gap-2.5 px-4 py-3 flex-shrink-0"
                style={{
                  backgroundColor: "#121212", // Bottom Chatbox Color: #121212
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask me anything about Sunfi…"
                  rows={1}
                  disabled={isLoading}
                  className="flex-1 bg-transparent resize-none text-sm text-slate-200 placeholder-slate-500 outline-none leading-relaxed py-1.5 font-quicksand disabled:opacity-50"
                  style={{
                    minHeight: "36px",
                    maxHeight: "120px",
                    overflowY: "auto",
                    fontFamily: "var(--font-quicksand), sans-serif",
                  }}
                  onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height = Math.min(el.scrollHeight, 120) + "px";
                  }}
                />

                {/* Send / Stop button */}
                <motion.button
                  onClick={isLoading ? () => abortRef.current?.abort() : () => sendMessage()}
                  disabled={!isLoading && !input.trim()}
                  aria-label={isLoading ? "Stop generating" : "Send message"}
                  className="flex-shrink-0 w-8.5 h-8.5 rounded-xl flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 disabled:opacity-30 disabled:cursor-not-allowed shadow-xs"
                  style={{
                    backgroundColor:
                      isLoading || input.trim()
                        ? "#212427"
                        : "rgba(255, 255, 255, 0.06)",
                  }}
                  whileHover={!(!isLoading && !input.trim()) ? { scale: 1.06 } : {}}
                  whileTap={!(!isLoading && !input.trim()) ? { scale: 0.92 } : {}}
                >
                  {isLoading ? (
                    // Stop icon
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="#f1f5f9">
                      <rect x="6" y="6" width="12" height="12" rx="2" />
                    </svg>
                  ) : (
                    // Send icon
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f1f5f9" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  )}
                </motion.button>
              </div>

              {/* ── Footer ── */}
              <div
                className="text-center pb-2 pt-1 flex-shrink-0"
                style={{ backgroundColor: "#0e0e0e", borderTop: "1px solid rgba(255, 255, 255, 0.03)" }}
              >
                <p className="text-[10px] text-slate-500 font-quicksand">
                  Powered by Gemini AI · Responses may not always be perfect
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
