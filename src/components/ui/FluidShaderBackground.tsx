"use client";

import React, { useEffect, useRef } from "react";

interface FluidBlob {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  radius: number;
  colorStop0: string;
  colorStop1: string;
  phase: number;
  speed: number;
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

    // Mouse tracking with smooth lerp
    const mouse = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      active: false,
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      // Default mouse target to center if inactive
      if (!mouse.active) {
        mouse.targetX = width * 0.5;
        mouse.targetY = height * 0.4;
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
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

    // Initialize Fluid Color Blobs matching the shader gradient in images
    const colors = [
      { stop0: "rgba(109, 40, 217, 0.75)", stop1: "rgba(76, 29, 149, 0)" },   // Deep Violet / Purple
      { stop0: "rgba(37, 99, 235, 0.70)", stop1: "rgba(30, 58, 138, 0)" },   // Electric Indigo / Blue
      { stop0: "rgba(6, 182, 212, 0.55)", stop1: "rgba(14, 116, 144, 0)" },  // Cyan Glow
      { stop0: "rgba(147, 51, 234, 0.65)", stop1: "rgba(88, 28, 135, 0)" },  // Royal Purple
      { stop0: "rgba(59, 130, 246, 0.60)", stop1: "rgba(29, 78, 216, 0)" },  // Bright Blue Wave
      { stop0: "rgba(168, 85, 247, 0.50)", stop1: "rgba(126, 34, 206, 0)" },  // Magenta Accent
    ];

    const blobs: FluidBlob[] = colors.map((col, i) => {
      const angle = (i / colors.length) * Math.PI * 2;
      return {
        x: width * 0.5 + Math.cos(angle) * width * 0.25,
        y: height * 0.4 + Math.sin(angle) * height * 0.25,
        originX: 0.2 + (i % 3) * 0.3,
        originY: 0.25 + Math.floor(i / 3) * 0.4,
        vx: 0,
        vy: 0,
        radius: Math.min(width, height) * (0.35 + (i % 3) * 0.08),
        colorStop0: col.stop0,
        colorStop1: col.stop1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.006,
      };
    });

    let time = 0;

    // Offscreen canvas for grain overlay
    const grainCanvas = document.createElement("canvas");
    grainCanvas.width = 256;
    grainCanvas.height = 256;
    const grainCtx = grainCanvas.getContext("2d");
    if (grainCtx) {
      const grainImg = grainCtx.createImageData(256, 256);
      const data = grainImg.data;
      for (let i = 0; i < data.length; i += 4) {
        const val = Math.random() * 255;
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 14; // Subtle grain opacity
      }
      grainCtx.putImageData(grainImg, 0, 0);
    }
    const grainPattern = ctx.createPattern(grainCanvas, "repeat");

    const render = () => {
      time += 0.015;

      // Smooth lerp mouse positioning
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // Clear with pitch black base
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Enable screen / lighter blend mode for liquid mesh glow blending
      ctx.globalCompositeOperation = "screen";

      blobs.forEach((blob, i) => {
        blob.phase += blob.speed;

        // Base wave motion
        const baseTargetX =
          blob.originX * width +
          Math.sin(blob.phase + time) * (width * 0.12) +
          Math.cos(time * 0.7 + i) * (width * 0.08);

        const baseTargetY =
          blob.originY * height +
          Math.cos(blob.phase * 1.2 + time) * (height * 0.12) +
          Math.sin(time * 0.5 + i) * (height * 0.08);

        // Calculate distance to mouse for fluid warp attraction/repulsion
        const dx = mouse.x - blob.x;
        const dy = mouse.y - blob.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.max(width, height) * 0.6;

        let mouseFactorX = 0;
        let mouseFactorY = 0;

        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 140;
          const angle = Math.atan2(dy, dx);
          // Fluid swirl offset
          mouseFactorX = Math.cos(angle + (i % 2 === 0 ? 0.4 : -0.4)) * force;
          mouseFactorY = Math.sin(angle + (i % 2 === 0 ? 0.4 : -0.4)) * force;
        }

        const finalTargetX = baseTargetX + mouseFactorX;
        const finalTargetY = baseTargetY + mouseFactorY;

        // Smooth position spring lerp
        blob.x += (finalTargetX - blob.x) * 0.035;
        blob.y += (finalTargetY - blob.y) * 0.035;

        // Pulsating radius
        const currentRadius =
          blob.radius + Math.sin(time * 1.5 + i) * (blob.radius * 0.15);

        // Create radial fluid gradient mesh
        const gradient = ctx.createRadialGradient(
          blob.x,
          blob.y,
          0,
          blob.x,
          blob.y,
          Math.max(currentRadius, 10)
        );

        gradient.addColorStop(0, blob.colorStop0);
        gradient.addColorStop(0.5, blob.colorStop0.replace(/[\d\.]+\)$/, "0.35)"));
        gradient.addColorStop(1, blob.colorStop1);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(blob.x, blob.y, Math.max(currentRadius, 10), 0, Math.PI * 2);
        ctx.fill();
      });

      // Reset composite operation to normal
      ctx.globalCompositeOperation = "source-over";

      // Apply subtle ambient dark vignette around edges to frame content
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.3,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.7, "rgba(0,0,0,0.45)");
      vignette.addColorStop(1, "rgba(0,0,0,0.92)");

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // Apply subtle film grain noise layer for shader texture magic look
      if (grainPattern) {
        ctx.fillStyle = grainPattern;
        ctx.fillRect(0, 0, width, height);
      }

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
