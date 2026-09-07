"use client";

import React, { useEffect, useRef } from "react";

// ============================================================================
// 🌫️ SMOKE TRAIL — TUNING CONSTANTS
// Every parameter is labelled. Adjust freely to dial in the look.
// ============================================================================
const CFG = {
  // ── PARTICLE POOL ──────────────────────────────────────────────────────────
  MAX_PARTICLES: 200,        // Hard cap. Prevents frame-rate drop at any speed.

  // ── SPAWN RADIUS ───────────────────────────────────────────────────────────
  // Particles are born inside a tight disc around the cursor.
  SPAWN_RADIUS: 10,          // px. 8-15 = tight source, like a flame tip.

  // ── VELOCITY-DRIVEN SPAWN RATE (non-linear) ────────────────────────────────
  // Formula: count = clamp( speed^SPAWN_EXP * SPAWN_SCALE, 0, SPAWN_MAX )
  // Exponent >1 makes slow movement create near-zero smoke, fast flicks = dense plume.
  SPAWN_SCALE: 0.06,         // Multiplier. Increase for denser smoke overall.
  SPAWN_EXP: 1.6,            // Non-linearity. 1.5–2.0 recommended.
  SPAWN_MAX: 9,              // Max particles born per frame.

  // ── LIFETIME ───────────────────────────────────────────────────────────────
  LIFE_MIN: 90,              // frames (~1.5s at 60fps)
  LIFE_MAX: 200,             // frames (~3.3s at 60fps)

  // ── SIZE ───────────────────────────────────────────────────────────────────
  SIZE_MIN: 22,              // px — starting radius
  SIZE_MAX: 65,              // px — birth range max
  SIZE_GROW_RATE: 0.55,      // px/frame expansion as smoke disperses
  SIZE_CAP: 240,             // px — absolute maximum size

  // ── OPACITY ────────────────────────────────────────────────────────────────
  // Keep VERY low per-particle. Many overlapping soft blobs = continuous wisps.
  OPACITY_MAX: 0.14,         // Per-particle max alpha. 0.10–0.18 for wisps.
  // Ease-out fade curve: opacity = max * progress^FADE_POWER
  // FADE_POWER < 1 = fast fade in, slow fade out (hang around longer)
  // FADE_POWER > 1 = fast fade out first (fast melt-away)
  FADE_POWER: 0.65,

  // ── CURL NOISE FLOW FIELD ──────────────────────────────────────────────────
  NOISE_SCALE: 0.0022,       // Spatial scale. Lower = larger, lazier swirls.
  NOISE_TIME_SCALE: 0.012,   // How fast the field evolves over time.
  CURL_STRENGTH: 0.85,       // px/frame driven by curl field. 0.5–1.5 range.

  // ── DETACHMENT ─────────────────────────────────────────────────────────────
  // DETACH_PROB fraction of particles are "free" at birth — they immediately
  // follow the curl field and escape the cursor, trailing off as air-carried wisps.
  // The remaining (1 - DETACH_PROB) briefly carry cursor momentum first.
  DETACH_PROB: 0.72,

  // ── VELOCITY PHYSICS ───────────────────────────────────────────────────────
  VELOCITY_INHERIT: 0.15,    // Fraction of cursor velocity transferred at birth.
  VELOCITY_LERP: 0.07,       // Per-frame lerp toward target vel (lower = smoother).
  UPWARD_BIAS: 0.28,         // px/frame — thermal buoyant rise (smoke goes up).

  // ── EDGE BOUNCE ────────────────────────────────────────────────────────────
  // When a particle hits a canvas edge, its velocity on that axis is reflected
  // and multiplied by BOUNCE_ENERGY (< 1 = loses energy each bounce).
  BOUNCE_ENERGY: 0.42,

  // ── COLOR ──────────────────────────────────────────────────────────────────
  // BASE: desaturated white/gray smoke — monochrome, NOT colorful
  SMOKE_RGB: [255, 255, 255] as [number, number, number],
  // TINT: very subtle warm-red hint tied to site's #E53935 / #AB2020 theme
  TINT_RGB: [229, 57, 53] as [number, number, number],
  // Per-particle probability of having a tint (0 = none, 1 = all)
  TINT_CHANCE: 0.65,
  // Maximum tint fraction (0 = pure white smoke, 0.08 = barely visible red)
  TINT_MAX: 0.75,
};

// ============================================================================
// 🔢 2D VALUE NOISE — lightweight, dependency-free
// ============================================================================
// Hash two integers into a pseudo-random float [0, 1]
function hash2(ix: number, iy: number): number {
  // Wang hash variant — fast, decent distribution
  let h = (ix * 1619 + iy * 31337) | 0;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = h ^ (h >>> 16);
  return (h >>> 0) / 0xffffffff;
}

// Smoothstep — C2 smooth interpolation (no grid artifacts)
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

// Bilinear value noise, returns [-1, 1]
function valueNoise(x: number, y: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smoothstep(x - xi);
  const yf = smoothstep(y - yi);
  const a = hash2(xi,     yi    ) * 2 - 1;
  const b = hash2(xi + 1, yi    ) * 2 - 1;
  const c = hash2(xi,     yi + 1) * 2 - 1;
  const d = hash2(xi + 1, yi + 1) * 2 - 1;
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

// Two-octave fractal noise — richer turbulence without extra cost
function fNoise(x: number, y: number): number {
  return valueNoise(x, y) * 0.65 + valueNoise(x * 2.3 + 4.1, y * 2.3 + 1.7) * 0.35;
}

// ============================================================================
// 🌀 CURL NOISE — divergence-free 2D velocity field derived from a scalar field
//
// For a scalar field N(x,y,t), the 2D curl is:
//   curl_x =  ∂N/∂y   (finite difference: (N(x, y+ε) − N(x, y−ε)) / 2ε)
//   curl_y = -∂N/∂x   (finite difference: (N(x+ε, y) − N(x−ε, y)) / 2ε)
//
// This guarantees the field has zero divergence → particles swirl organically
// without clumping or dispersing in ugly radiating lines.
// ============================================================================
const EPS = 0.0008;
function curlNoise(x: number, y: number, t: number): { vx: number; vy: number } {
  const tx = t * CFG.NOISE_TIME_SCALE;
  const ty = t * CFG.NOISE_TIME_SCALE * 0.77; // Different rate on y axis for asymmetry

  const dNdy = (fNoise(x, y + EPS + ty) - fNoise(x, y - EPS + ty)) / (2 * EPS);
  const dNdx = (fNoise(x + EPS + tx, y) - fNoise(x - EPS + tx, y)) / (2 * EPS);

  return { vx: dNdy, vy: -dNdx };
}

// ============================================================================
// 🏷️ PARTICLE DEFINITION
// ============================================================================
interface Particle {
  x: number;
  y: number;
  vx: number;         // Current velocity x
  vy: number;         // Current velocity y
  tvx: number;        // Lerp target velocity x
  tvy: number;        // Lerp target velocity y
  size: number;
  life: number;       // Frames remaining
  maxLife: number;
  opacity: number;    // Birth opacity (max for this particle)
  rotation: number;
  rotSpeed: number;
  detached: boolean;  // true = immediately follows curl field, escapes cursor
  tint: number;       // 0 = pure white smoke, >0 = slight red tint
  active: boolean;
}

// ============================================================================
// 🎨 MAIN COMPONENT
// ============================================================================
export function SmokeTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    if (!ctx) return;

    let raf: number;
    let W = 0, H = 0;
    let time = 0;

    // ── OBJECT POOL ─────────────────────────────────────────────────────────
    // Pre-allocate all particles upfront. Avoids GC pressure during animation.
    // active=false particles are "dead" slots available for reuse.
    const pool: Particle[] = Array.from({ length: CFG.MAX_PARTICLES }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, tvx: 0, tvy: 0,
      size: 0, life: 0, maxLife: 1,
      opacity: 0, rotation: 0, rotSpeed: 0,
      detached: true, tint: 0, active: false,
    }));

    // ── MOUSE STATE ──────────────────────────────────────────────────────────
    const mouse = {
      x: -9999, y: -9999,
      prevX: -9999, prevY: -9999,
      vx: 0, vy: 0,         // Smoothed velocity
      speed: 0,
      onScreen: false,
    };

    // ── RESIZE ───────────────────────────────────────────────────────────────
    const resize = () => {
      const parent = canvas.parentElement;
      W = parent ? parent.clientWidth  : window.innerWidth;
      H = parent ? parent.clientHeight : window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.onScreen = true;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const rect = canvas.getBoundingClientRect();
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.onScreen = true;
    };
    const onLeave = () => { mouse.onScreen = false; };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    resize();

    // ── SPAWN ─────────────────────────────────────────────────────────────────
    // Finds a free pool slot and initialises it at cursor position.
    function spawn(cursorVx: number, cursorVy: number) {
      let p: Particle | null = null;
      for (let i = 0; i < CFG.MAX_PARTICLES; i++) {
        if (!pool[i].active) { p = pool[i]; break; }
      }
      if (!p) return;

      // Birth position: tight disc around cursor
      const angle = Math.random() * Math.PI * 2;
      const r     = Math.random() * CFG.SPAWN_RADIUS;
      p.x = mouse.x + Math.cos(angle) * r;
      p.y = mouse.y + Math.sin(angle) * r;

      // ── DETACHMENT LOGIC ────────────────────────────────────────────────
      // DETACH_PROB fraction of particles ignore cursor and immediately follow
      // the curl field — these become the long escaping wisps.
      // Remaining particles inherit cursor momentum briefly, then transition.
      p.detached = Math.random() < CFG.DETACH_PROB;

      // Initial velocity = fraction of cursor momentum + small random spread
      const spread = 0.5;
      p.vx  = cursorVx * CFG.VELOCITY_INHERIT + (Math.random() - 0.5) * spread;
      p.vy  = cursorVy * CFG.VELOCITY_INHERIT + (Math.random() - 0.5) * spread - CFG.UPWARD_BIAS;
      p.tvx = p.vx;
      p.tvy = p.vy;

      p.size      = CFG.SIZE_MIN + Math.random() * (CFG.SIZE_MAX - CFG.SIZE_MIN);
      p.maxLife   = CFG.LIFE_MIN + Math.floor(Math.random() * (CFG.LIFE_MAX - CFG.LIFE_MIN));
      p.life      = p.maxLife;
      p.opacity   = CFG.OPACITY_MAX * (0.75 + Math.random() * 0.25);
      p.rotation  = Math.random() * Math.PI * 2;
      p.rotSpeed  = (Math.random() - 0.5) * 0.022;
      p.tint      = Math.random() < CFG.TINT_CHANCE ? Math.random() * CFG.TINT_MAX : 0;
      p.active    = true;
    }

    // ── RENDER LOOP ──────────────────────────────────────────────────────────
    function loop() {
      time += 1;

      // 1. Update smoothed mouse velocity
      if (mouse.onScreen && mouse.prevX > -9000) {
        const rawVx = mouse.x - mouse.prevX;
        const rawVy = mouse.y - mouse.prevY;
        // Lerp smoothing on mouse velocity — removes jitter
        mouse.vx += (rawVx - mouse.vx) * 0.45;
        mouse.vy += (rawVy - mouse.vy) * 0.45;
        mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      } else {
        mouse.vx   *= 0.88;
        mouse.vy   *= 0.88;
        mouse.speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);
      }

      // 2. VELOCITY-DRIVEN SPAWN RATE (non-linear power curve)
      // Formula: count = clamp(speed^SPAWN_EXP * SPAWN_SCALE, 0, SPAWN_MAX)
      // Result: near-zero smoke on slow drift, dramatic plume on fast flick.
      if (mouse.onScreen && mouse.speed > 0.8) {
        const raw   = Math.pow(mouse.speed, CFG.SPAWN_EXP) * CFG.SPAWN_SCALE;
        const count = Math.min(Math.ceil(raw), CFG.SPAWN_MAX);
        const activeNow = pool.filter(p => p.active).length;
        for (let i = 0; i < count; i++) {
          if (activeNow + i < CFG.MAX_PARTICLES) {
            spawn(mouse.vx, mouse.vy);
          }
        }
      }

      // 3. Clear — pure black canvas
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "screen";

      // 4. Update and render each active particle
      for (let i = 0; i < CFG.MAX_PARTICLES; i++) {
        const p = pool[i];
        if (!p.active) continue;

        p.life--;

        // A. EASE-OUT FADE CURVE
        // progress: 1 (fresh) → 0 (dead)
        // opacity = birthOpacity × progress^FADE_POWER
        // FADE_POWER < 1: lingers longer, fades slowly at end (natural melt-away)
        const progress = p.life / p.maxLife;
        const alpha    = p.opacity * Math.pow(Math.max(progress, 0), CFG.FADE_POWER);

        if (p.life <= 0 || alpha < 0.002) {
          p.active = false;
          continue;
        }

        // B. CURL NOISE FLOW FIELD
        // Sample the curl velocity at this particle's position, scaled to noise space.
        const nx = p.x * CFG.NOISE_SCALE;
        const ny = p.y * CFG.NOISE_SCALE;
        const { vx: cx, vy: cy } = curlNoise(nx, ny, time);

        // C. VELOCITY TARGET — blend between cursor-inherited momentum and curl field
        // Detached particles: 100% curl-driven from birth → long escaping streaks
        // Attached particles: transition from cursor momentum to curl as they age
        const curlBlend = p.detached ? 1.0 : 0.5 + (1 - progress) * 0.5;
        p.tvx = cx * CFG.CURL_STRENGTH * curlBlend;
        p.tvy = (cy * CFG.CURL_STRENGTH * curlBlend) - CFG.UPWARD_BIAS;

        // Non-detached: add fading cursor momentum component
        if (!p.detached) {
          p.tvx += p.vx * progress * 0.3;
          p.tvy += p.vy * progress * 0.3;
        }

        // D. LERP VELOCITY — smoothly damp all velocity changes (no jitter/snapping)
        p.vx += (p.tvx - p.vx) * CFG.VELOCITY_LERP;
        p.vy += (p.tvy - p.vy) * CFG.VELOCITY_LERP;

        // E. MOVE
        p.x += p.vx;
        p.y += p.vy;

        // F. EDGE BOUNCE
        // When particle crosses a canvas edge: reflect velocity, lose energy.
        // This makes fast-flicked smoke visibly hit the "walls" and roll along edges.
        if (p.x < 0) {
          p.x   = 0;
          p.vx  = Math.abs(p.vx)  * CFG.BOUNCE_ENERGY;
          p.tvx = p.vx;
        } else if (p.x > W) {
          p.x   = W;
          p.vx  = -Math.abs(p.vx) * CFG.BOUNCE_ENERGY;
          p.tvx = p.vx;
        }
        if (p.y < 0) {
          p.y   = 0;
          p.vy  = Math.abs(p.vy)  * CFG.BOUNCE_ENERGY;
          p.tvy = p.vy;
        } else if (p.y > H) {
          p.y   = H;
          p.vy  = -Math.abs(p.vy) * CFG.BOUNCE_ENERGY;
          p.tvy = p.vy;
        }

        // G. Grow, rotate
        p.size     = Math.min(p.size + CFG.SIZE_GROW_RATE, CFG.SIZE_CAP);
        p.rotation += p.rotSpeed;

        // H. RENDER — soft radial-gradient blob, slightly stretched along velocity
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Stretch canvas along velocity direction → oval wisp shape, not perfect circle
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy) + 0.01;
        // Clamp stretch so fast particles get elongated wisps, slow ones stay round
        const stretchX = Math.min(1 + spd * 0.1, 1.7);
        const stretchY = 1 / Math.sqrt(stretchX); // Preserve area
        ctx.scale(stretchX, stretchY);

        // Build smoke color: white smoke base + optional barely-visible red tint
        const [sr, sg, sb] = CFG.SMOKE_RGB;
        const [tr, tg, tb] = CFG.TINT_RGB;
        const f = p.tint;
        const r = Math.round(sr * (1 - f) + tr * f);
        const g = Math.round(sg * (1 - f) + tg * f);
        const b = Math.round(sb * (1 - f) + tb * f);

        // Soft radial gradient: dense center fades to transparent edge
        // Very low alphas per-stop: overlapping many particles = continuous wisp
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        grad.addColorStop(0,    `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(0.25, `rgba(${r},${g},${b},${alpha * 0.72})`);
        grad.addColorStop(0.55, `rgba(${r},${g},${b},${alpha * 0.28})`);
        grad.addColorStop(0.82, `rgba(${r},${g},${b},${alpha * 0.06})`);
        grad.addColorStop(1,    `rgba(${r},${g},${b},0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.globalCompositeOperation = "source-over";

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      raf = requestAnimationFrame(loop);
    }

    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
