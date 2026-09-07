"use client";

import React, { useEffect, useRef } from "react";

/**
 * ============================================================================
 * 🌫️ SMOKE TRAIL TUNING CONFIGURATION
 * Tune these parameters to adjust the look, density, decay, and color of the smoke!
 * ============================================================================
 */
export const SMOKE_CONFIG = {
  // --- COLOR CONFIGURATION ---
  // Neutral dark-gray/charcoal with a subtle warm red tint (#AB2020 theme alignment)
  COLOR: {
    r: 190, // Red channel (higher = warmer/redder smoke)
    g: 65,  // Green channel
    b: 65,  // Blue channel
  },

  // --- SPAWN & VELOCITY PHYSICS ---
  // Scale factor converting cursor velocity to particle count (higher = more smoke on fast movement)
  SPAWN_VELOCITY_SCALE: 0.18,
  // Hard cap on max smoke particles spawned in a single frame
  MAX_SPAWN_PER_FRAME: 5,
  // Maximum total smoke particles alive at once (protects 60fps performance)
  MAX_TOTAL_PARTICLES: 200,

  // --- LIFECYCLE & FADE FORMULAS ---
  // Base initial opacity for new smoke particles (0.3 - 0.5)
  INITIAL_OPACITY: 0.38,
  // Per-frame opacity decay rate (e.g., 0.006 = ~160 frames / ~2.6 sec lifetime)
  OPACITY_DECAY: 0.0055,

  // --- DRIFT & TURBULENCE FORMULAS ---
  // Upward buoyant drift speed per frame (pixels/frame)
  UPWARD_DRIFT: 0.35,
  // Random horizontal/vertical velocity spread
  DRIFT_SPREAD: 0.4,
  // Turbulence sine-wave amplitude (wobbly smoke curling)
  TURBULENCE_AMP: 0.45,
  // Turbulence sine-wave frequency
  TURBULENCE_FREQ: 1.8,
  // Fraction of mouse velocity inherited by newly spawned smoke
  VELOCITY_INHERITANCE: 0.12,

  // --- SIZE & EXPANSION FORMULAS ---
  // Starting radius of smoke particle (px)
  START_SIZE: 35,
  // Per-frame expansion growth rate (px/frame)
  GROWTH_RATE: 0.85,
  // Maximum expansion size cap (px)
  MAX_SIZE: 220,
};

interface SmokeParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotSpeed: number;
  seed: number;
}

export function SmokeTrailCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let nextParticleId = 0;

    // Mouse tracking state
    const mouse = {
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
      velocity: 0,
      active: false,
    };

    // Particles array
    const particles: SmokeParticle[] = [];

    // Resize handler with DevicePixelRatio support for retina clarity
    const handleResize = () => {
      const parent = canvas.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    // Event Listeners for Mouse & Touch
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.touches[0].clientX - rect.left;
        mouse.y = e.touches[0].clientY - rect.top;
        mouse.active = true;
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    handleResize();

    let time = 0;

    // Animation Loop using requestAnimationFrame
    const render = () => {
      time += 0.016; // ~60fps delta time step

      // 1. CALCULATE MOUSE VELOCITY
      // Velocity = sqrt(dx^2 + dy^2) moved since previous frame
      if (mouse.active && mouse.prevX > -500 && mouse.prevY > -500) {
        const dx = mouse.x - mouse.prevX;
        const dy = mouse.y - mouse.prevY;
        mouse.velocity = Math.sqrt(dx * dx + dy * dy);

        // 2. SPAWN RATE FORMULA
        // Spawn count is proportional to velocity.
        // Fast movement = more particles, slow/no movement = zero particles spawned.
        const spawnCount = Math.min(
          Math.floor(mouse.velocity * SMOKE_CONFIG.SPAWN_VELOCITY_SCALE),
          SMOKE_CONFIG.MAX_SPAWN_PER_FRAME
        );

        for (let i = 0; i < spawnCount; i++) {
          // If total active particles exceed MAX_TOTAL_PARTICLES, remove oldest first
          if (particles.length >= SMOKE_CONFIG.MAX_TOTAL_PARTICLES) {
            particles.shift();
          }

          // Initial velocity: fraction of cursor velocity + small random drift + upward bias
          const initVx =
            dx * SMOKE_CONFIG.VELOCITY_INHERITANCE +
            (Math.random() - 0.5) * SMOKE_CONFIG.DRIFT_SPREAD;
          const initVy =
            dy * SMOKE_CONFIG.VELOCITY_INHERITANCE +
            (Math.random() - 0.5) * SMOKE_CONFIG.DRIFT_SPREAD -
            SMOKE_CONFIG.UPWARD_DRIFT;

          particles.push({
            id: nextParticleId++,
            x: mouse.x + (Math.random() - 0.5) * 12,
            y: mouse.y + (Math.random() - 0.5) * 12,
            vx: initVx,
            vy: initVy,
            size: SMOKE_CONFIG.START_SIZE + Math.random() * 15,
            opacity: SMOKE_CONFIG.INITIAL_OPACITY + (Math.random() - 0.5) * 0.1,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.02,
            seed: Math.random() * 100,
          });
        }
      } else {
        mouse.velocity = 0;
      }

      // Update previous mouse position
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      // 3. CLEAR CANVAS WITH PURE DARK BASE
      ctx.clearRect(0, 0, width, height);

      // Set blend mode to 'screen' so overlapping soft smoke blobs blend smoothly
      ctx.globalCompositeOperation = "screen";

      // 4. UPDATE & RENDER SMOKE PARTICLES
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // --- LIFECYCLE FORMULAS ---
        // A. Growth Formula: Particle expands outward over time
        if (p.size < SMOKE_CONFIG.MAX_SIZE) {
          p.size += SMOKE_CONFIG.GROWTH_RATE;
        }

        // B. Fade-away Formula: Opacity decays gradually on each frame
        p.opacity -= SMOKE_CONFIG.OPACITY_DECAY;

        // C. Drift & Turbulence Formula:
        // Position updated by momentum + sine-wave organic turbulence + thermal upward drift
        const turbulenceX =
          Math.sin(time * SMOKE_CONFIG.TURBULENCE_FREQ + p.seed) *
          SMOKE_CONFIG.TURBULENCE_AMP;
        const turbulenceY =
          Math.cos(time * SMOKE_CONFIG.TURBULENCE_FREQ + p.seed * 0.7) *
          (SMOKE_CONFIG.TURBULENCE_AMP * 0.5);

        p.x += p.vx + turbulenceX;
        p.y += p.vy - SMOKE_CONFIG.UPWARD_DRIFT + turbulenceY;

        // Easing damping on velocity momentum
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Slow organic rotation spin
        p.rotation += p.rotSpeed;

        // D. MELT-AWAY CLEANUP:
        // When opacity reaches 0 or particle moves far offscreen, remove it cleanly
        if (p.opacity <= 0 || p.x < -100 || p.x > width + 100 || p.y < -100 || p.y > height + 100) {
          particles.splice(i, 1);
          continue;
        }

        // 5. RENDER SOFT RADIAL-GRADIENT BLOB (Gaseous Smoke Look)
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Soft radial gradient from semi-transparent center to 0 opacity edge
        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
        const { r, g, b } = SMOKE_CONFIG.COLOR;

        grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${p.opacity})`);
        grad.addColorStop(0.35, `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.55})`);
        grad.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, ${p.opacity * 0.15})`);
        grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Reset composite operation to default
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // CLEANUP ON UNMOUNT
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}
