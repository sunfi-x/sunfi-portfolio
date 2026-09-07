"use client";

import React, { useEffect, useRef } from "react";

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  alpha: number;
  maxAlpha: number;
  life: number;
  maxLife: number;
  rotation: number;
  rotSpeed: number;
  colorStop0: string;
  colorStop1: string;
}

export function FluidShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Mouse position & velocity tracking
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      vx: 0,
      vy: 0,
      active: false,
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      if (!mouse.active) {
        mouse.targetX = width * 0.5;
        mouse.targetY = height * 0.4;
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
        mouse.prevX = mouse.x;
        mouse.prevY = mouse.y;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.targetX = e.touches[0].clientX;
        mouse.targetY = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    handleResize();

    // Soft Smoke Color Tones (Velvety violet, electric purple, indigo & cyan highlights)
    const smokeColors = [
      { stop0: "rgba(139, 92, 246, ", stop1: "rgba(76, 29, 149, 0)" },  // Electric Violet
      { stop0: "rgba(99, 102, 241, ", stop1: "rgba(30, 58, 138, 0)" },  // Indigo Smoke
      { stop0: "rgba(168, 85, 247, ", stop1: "rgba(88, 28, 135, 0)" },  // Royal Purple Smoke
      { stop0: "rgba(14, 165, 233, ", stop1: "rgba(14, 116, 144, 0)" }, // Cyan Smoke Highlight
      { stop0: "rgba(217, 70, 239, ", stop1: "rgba(112, 26, 117, 0)" }, // Magenta Smoke Touch
    ];

    const smokeParticles: SmokeParticle[] = [];
    let time = 0;

    // Helper: Create soft volumetric smoke cloud texture
    const createSmokeTexture = (colorStop0: string, colorStop1: string, alpha: number) => {
      const pCanvas = document.createElement("canvas");
      pCanvas.width = 128;
      pCanvas.height = 128;
      const pCtx = pCanvas.getContext("2d");
      if (!pCtx) return pCanvas;

      const grad = pCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, `${colorStop0}${alpha})`);
      grad.addColorStop(0.35, `${colorStop0}${alpha * 0.45})`);
      grad.addColorStop(0.7, `${colorStop0}${alpha * 0.15})`);
      grad.addColorStop(1, colorStop1);

      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(64, 64, 64, 0, Math.PI * 2);
      pCtx.fill();

      return pCanvas;
    };

    // Cache soft smoke textures
    const smokeTextures = smokeColors.map((col) => ({
      tex: createSmokeTexture(col.stop0, col.stop1, 0.25),
      col,
    }));

    const render = () => {
      time += 0.015;

      // Mouse smooth position & velocity calculation
      mouse.vx = (mouse.targetX - mouse.x) * 0.1;
      mouse.vy = (mouse.targetY - mouse.y) * 0.1;
      mouse.x += mouse.vx;
      mouse.y += mouse.vy;

      const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

      // Spawn continuous gaseous smoke particles along mouse movement
      if (mouse.active && (Math.abs(mouse.vx) > 0.05 || Math.abs(mouse.vy) > 0.05 || mouseSpeed > 0.1)) {
        const spawnCount = Math.min(Math.floor(mouseSpeed * 0.8) + 2, 6);

        for (let i = 0; i < spawnCount; i++) {
          const colorIdx = Math.floor(Math.random() * smokeColors.length);
          const colorObj = smokeColors[colorIdx];

          // Random offset around cursor for organic smoke volume
          const angle = Math.random() * Math.PI * 2;
          const spread = Math.random() * 25;

          smokeParticles.push({
            x: mouse.x + Math.cos(angle) * spread,
            y: mouse.y + Math.sin(angle) * spread,
            vx: mouse.vx * 0.35 + (Math.random() - 0.5) * 1.2,
            vy: mouse.vy * 0.35 + (Math.random() - 0.5) * 1.2 - 0.3, // Subtle thermal upward drift
            size: 60 + Math.random() * 50,
            maxSize: 180 + Math.random() * 140,
            alpha: 0.22 + Math.random() * 0.12,
            maxAlpha: 0.25,
            life: 0,
            maxLife: 90 + Math.random() * 60, // ~2-3 seconds lifetime
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.015,
            colorStop0: colorObj.stop0,
            colorStop1: colorObj.stop1,
          });
        }
      }

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      // Limit particle count for high 60fps performance
      if (smokeParticles.length > 180) {
        smokeParticles.splice(0, smokeParticles.length - 180);
      }

      // PURE PITCH BLACK CANVAS (No grain overlay)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Screen blend mode for seamless gaseous smoke ribbon blending
      ctx.globalCompositeOperation = "screen";

      // Render and update smoke particles
      for (let i = smokeParticles.length - 1; i >= 0; i--) {
        const p = smokeParticles[i];
        p.life++;

        // Curl noise / sine wave fluid drift
        const noiseX = Math.sin(time * 2 + p.y * 0.01 + i) * 0.6;
        const noiseY = Math.cos(time * 1.5 + p.x * 0.01 + i) * 0.4;

        p.x += p.vx + noiseX;
        p.y += p.vy + noiseY;

        // Friction slowing down initial momentum
        p.vx *= 0.96;
        p.vy *= 0.96;

        // Smoke expanding as it dissipates
        const progress = p.life / p.maxLife;
        const currentSize = p.size + (p.maxSize - p.size) * Math.sin(progress * Math.PI * 0.5);
        p.rotation += p.rotSpeed;

        // Smooth fade-in and fade-out curve
        let currentAlpha = 0;
        if (progress < 0.15) {
          currentAlpha = (progress / 0.15) * p.alpha;
        } else {
          currentAlpha = (1 - (progress - 0.15) / 0.85) * p.alpha;
        }

        if (p.life >= p.maxLife || currentAlpha <= 0.001) {
          smokeParticles.splice(i, 1);
          continue;
        }

        // Draw soft gaseous smoke cloud
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = currentAlpha;

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, currentSize);
        grad.addColorStop(0, `${p.colorStop0}0.45)`);
        grad.addColorStop(0.4, `${p.colorStop0}0.2)`);
        grad.addColorStop(0.75, `${p.colorStop0}0.05)`);
        grad.addColorStop(1, p.colorStop1);

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(0, 0, currentSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // Reset composite mode
      ctx.globalCompositeOperation = "source-over";

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none transition-opacity duration-700"
      style={{ zIndex: 0 }}
    />
  );
}
