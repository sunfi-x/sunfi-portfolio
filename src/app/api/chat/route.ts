/**
 * POST /api/chat
 *
 * Streaming AI chat endpoint powered by Google Gemini.
 * Features:
 *  - IP-based in-memory rate limiting (per-minute + per-day sliding windows)
 *  - Bounded conversation history (MAX_HISTORY_TURNS per direction)
 *  - Dynamic system prompt from Sanity + static fallback data
 *  - Graceful error handling (missing API key, model errors, network issues)
 *  - Streaming text/plain response for real-time UI rendering
 */

import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { buildSystemPrompt, MAX_HISTORY_TURNS } from "@/lib/ai-context";
import { fetchProfile, fetchAllProjects, fetchAllPapers, fetchContactInfo } from "@/sanity/lib/fetchers";

// ─── Rate Limiting ────────────────────────────────────────────────────────────

interface RateRecord {
  minuteTokens: number[];  // timestamps (ms) within the last 60 s
  dayTokens: number[];     // timestamps (ms) within the last 24 h
}

const rateLimitMap = new Map<string, RateRecord>();

const RATE_LIMIT_PER_MINUTE = 10;
const RATE_LIMIT_PER_DAY = 100;
const ONE_MINUTE_MS = 60_000;
const ONE_DAY_MS = 86_400_000;

function checkRateLimit(ip: string): { allowed: boolean; reason?: string } {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    record = { minuteTokens: [], dayTokens: [] };
    rateLimitMap.set(ip, record);
  }

  // Slide windows
  record.minuteTokens = record.minuteTokens.filter((t) => now - t < ONE_MINUTE_MS);
  record.dayTokens = record.dayTokens.filter((t) => now - t < ONE_DAY_MS);

  if (record.minuteTokens.length >= RATE_LIMIT_PER_MINUTE) {
    return { allowed: false, reason: "minute" };
  }
  if (record.dayTokens.length >= RATE_LIMIT_PER_DAY) {
    return { allowed: false, reason: "day" };
  }

  // Record this request
  record.minuteTokens.push(now);
  record.dayTokens.push(now);
  return { allowed: true };
}

// Clean up stale rate limit entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    record.minuteTokens = record.minuteTokens.filter((t) => now - t < ONE_MINUTE_MS);
    record.dayTokens = record.dayTokens.filter((t) => now - t < ONE_DAY_MS);
    if (record.minuteTokens.length === 0 && record.dayTokens.length === 0) {
      rateLimitMap.delete(ip);
    }
  }
}, 600_000);

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Trim history to keep at most MAX_HISTORY_TURNS in each direction. */
function boundHistory(history: ChatMessage[]): ChatMessage[] {
  const maxMessages = MAX_HISTORY_TURNS * 2; // user + assistant pairs
  if (history.length <= maxMessages) return history;
  return history.slice(history.length - maxMessages);
}

// ─── Route Handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // 1. Rate limit check
  const ip = getClientIp(req);
  const { allowed, reason } = checkRateLimit(ip);

  if (!allowed) {
    const message =
      reason === "minute"
        ? "You're sending messages too quickly. Please wait a moment and try again."
        : "You've reached the daily message limit. Please come back tomorrow!";

    return NextResponse.json(
      { error: message, code: "RATE_LIMITED" },
      { status: 429 }
    );
  }

  // 2. Validate API key
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[AI Chat] GEMINI_API_KEY is not set");
    return NextResponse.json(
      {
        error:
          "The AI assistant is not configured yet. Please check back soon, or contact Sunfi directly at sunfisazzad@gmail.com.",
        code: "NO_API_KEY",
      },
      { status: 503 }
    );
  }

  // 3. Parse body
  let userMessage: string;
  let history: ChatMessage[];

  try {
    const body = await req.json();
    userMessage = (body.message ?? "").trim();
    history = Array.isArray(body.history) ? body.history : [];
  } catch {
    return NextResponse.json(
      { error: "Invalid request body.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }

  if (!userMessage) {
    return NextResponse.json(
      { error: "Message cannot be empty.", code: "EMPTY_MESSAGE" },
      { status: 400 }
    );
  }

  // 4. Bound history
  const boundedHistory = boundHistory(history);

  // 5. Build system prompt from live Sanity data (with fallback)
  let systemPrompt: string;
  try {
    const [profile, projects, papers, contactInfo] = await Promise.allSettled([
      fetchProfile(),
      fetchAllProjects(),
      fetchAllPapers(),
      fetchContactInfo(),
    ]);

    systemPrompt = buildSystemPrompt({
      profile: profile.status === "fulfilled" ? profile.value : null,
      projects: projects.status === "fulfilled" ? projects.value : [],
      papers: papers.status === "fulfilled" ? papers.value : [],
      contactInfo: contactInfo.status === "fulfilled" ? contactInfo.value : null,
    });
  } catch {
    // Fully fallback to static data
    systemPrompt = buildSystemPrompt({});
  }

  // 6. Call Gemini with streaming
  try {
    const genAI = new GoogleGenAI({ apiKey });

    // Build the conversation contents for Gemini
    const contents = [
      ...boundedHistory.map((msg) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      })),
      {
        role: "user",
        parts: [{ text: userMessage }],
      },
    ];

    const model = "gemini-3.6-flash";

    const streamResponse = await genAI.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction: systemPrompt,
        maxOutputTokens: 2048,
        temperature: 0.7,
        topP: 0.9,
      },
    });

    // Stream the response as plain text
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamResponse) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (streamErr) {
          console.error("[AI Chat] Stream error:", streamErr);
          controller.enqueue(
            encoder.encode(
              "\n\n*Sorry, I encountered an error while generating a response. Please try again.*"
            )
          );
          controller.close();
        }
      },
    });

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err: unknown) {
    console.error("[AI Chat] Gemini API error:", err);

    // Fallback to non-streaming model if flash unavailable
    try {
      const genAI = new GoogleGenAI({ apiKey });
      const fallbackModel = "gemini-3.6-flash";

      const contents = [
        ...boundedHistory.map((msg) => ({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }],
        })),
        { role: "user", parts: [{ text: userMessage }] },
      ];

      const result = await genAI.models.generateContent({
        model: fallbackModel,
        contents,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 2048,
          temperature: 0.7,
        },
      });

      const text = result.text ?? "I'm unable to respond right now. Please try again shortly.";
      return NextResponse.json({ response: text });
    } catch (fallbackErr) {
      console.error("[AI Chat] Fallback model also failed:", fallbackErr);
      return NextResponse.json(
        {
          error:
            "The AI assistant is temporarily unavailable. You can reach Sunfi directly at sunfisazzad@gmail.com.",
          code: "MODEL_ERROR",
        },
        { status: 502 }
      );
    }
  }
}
