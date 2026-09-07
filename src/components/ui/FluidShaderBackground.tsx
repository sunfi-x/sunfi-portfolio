"use client";

import React, { useEffect, useRef } from "react";

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  colorStop0: string;
  colorStop1: string;
  rotation: number;
  life: number;
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
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      prevX: -1000,
      prevY: -1000,
      speed: 0,
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

    // Shader Color Palettes matching shaders.com & image reference
    const colorPalettes = [
      { stop0: "rgba(124, 58, 237, 0.85)", stop1: "rgba(76, 29, 149, 0)" },   // Deep Violet
      { stop0: "rgba(59, 130, 246, 0.80)", stop1: "rgba(30, 58, 138, 0)" },   // Electric Blue
      { stop0: "rgba(6, 182, 212, 0.70)", stop1: "rgba(14, 116, 144, 0)" },  // Neon Cyan
      { stop0: "rgba(192, 38, 211, 0.75)", stop1: "rgba(112, 26, 117, 0)" }, // Vibrant Magenta
      { stop0: "rgba(147, 51, 234, 0.80)", stop1: "rgba(88, 28, 135, 0)" },  // Royal Purple
    ];

    // Orbiting shader control blobs attached to cursor
    const orbiters = colorPalettes.map((palette, i) => ({
      angle: (i / colorPalettes.length) * Math.PI * 2,
      distance: 60 + (i % 3) * 40,
      speed: (0.015 + (i % 2) * 0.01) * (i % 2 === 0 ? 1 : -1),
      radius: 220 + (i % 3) * 70,
      palette,
      x: 0,
      y: 0,
    }));

    // Dynamic Trail Points generated along mouse movement
    const trailPoints: TrailPoint[] = [];

    let time = 0;

    // Create high-detail film grain overlay texture
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
        data[i + 3] = 18; // Tactile grain opacity
      }
      grainCtx.putImageData(grainImg, 0, 0);
    }
    const grainPattern = ctx.createPattern(grainCanvas, "repeat");

    const render = () => {
      time += 0.02;

      // Calculate mouse speed and smooth lerp position
      const dx = mouse.targetX - mouse.x;
      const dy = mouse.targetY - mouse.y;
      mouse.speed = Math.sqrt(dx * dx + dy * dy);

      mouse.x += dx * 0.08;
      mouse.y += dy * 0.08;

      // Spawn new shader trail points as mouse moves
      if (mouse.active && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
        const palette = colorPalettes[trailPoints.length % colorPalettes.length];
        trailPoints.push({
          x: mouse.x + (Math.random() - 0.5) * 20,
          y: mouse.y + (Math.random() - 0.5) * 20,
          vx: (mouse.x - mouse.prevX) * 0.15 + (Math.random() - 0.5) * 0.5,
          vy: (mouse.y - mouse.prevY) * 0.15 + (Math.random() - 0.5) * 0.5,
          radius: 180 + Math.random() * 120 + Math.min(mouse.speed * 2, 100),
          alpha: 0.8,
          colorStop0: palette.stop0,
          colorStop1: palette.stop1,
          rotation: Math.random() * Math.PI * 2,
          life: 1.0,
        });
      }

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;

      // Cap trail max points to keep performance butter smooth
      if (trailPoints.length > 35) {
        trailPoints.shift();
      }

      // Clear canvas with rich pitch black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // Set blend mode to screen for vibrant fluid color mixing
      ctx.globalCompositeOperation = "screen";

      // 1. Render Mouse Trail Shader Blobs (generated along mouse path)
      for (let i = trailPoints.length - 1; i >= 0; i--) {
        const p = trailPoints[i];
        p.life -= 0.015;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.radius += 0.8;

        if (p.life <= 0) {
          trailPoints.splice(i, 1);
          continue;
        }

        const currentAlpha = p.life * p.alpha;
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          Math.max(p.radius, 10)
        );

        gradient.addColorStop(
          0,
          p.colorStop0.replace(/[\d\.]+\)$/, `${currentAlpha})`)
        );
        gradient.addColorStop(
          0.6,
          p.colorStop0.replace(/[\d\.]+\)$/, `${currentAlpha * 0.35})`)
        );
        gradient.addColorStop(1, p.colorStop1);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(p.radius, 10), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Render Main Orbiting Shader Mesh directly under Cursor
      if (mouse.active && mouse.x > 0 && mouse.y > 0) {
        orbiters.forEach((orb, i) => {
          orb.angle += orb.speed;

          // Organic wobbly orbit centered on mouse cursor
          const currentDist = orb.distance + Math.sin(time * 2 + i) * 25;
          const targetOrbX = mouse.x + Math.cos(orb.angle) * currentDist;
          const targetOrbY = mouse.y + Math.sin(orb.angle) * currentDist;

          orb.x += (targetOrbX - orb.x) * 0.1;
          orb.y += (targetOrbY - orb.y) * 0.1;

          const dynamicRadius =
            orb.radius + Math.sin(time * 1.8 + i) * 35 + Math.min(mouse.speed * 1.5, 80);

          const gradient = ctx.createRadialGradient(
            orb.x,
            orb.y,
            0,
            orb.x,
            orb.y,
            Math.max(dynamicRadius, 10)
          );

          gradient.addColorStop(0, orb.palette.stop0);
          gradient.addColorStop(
            0.5,
            orb.palette.stop0.replace(/[\d\.]+\)$/, "0.4)")
          );
          gradient.addColorStop(1, orb.palette.stop1);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(orb.x, orb.y, Math.max(dynamicRadius, 10), 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // Reset composite mode
      ctx.globalCompositeOperation = "source-over";

      // 3. Subtle edge vignette to blend cleanly into pure black page border
      const vignette = ctx.createRadialGradient(
        width * 0.5,
        height * 0.5,
        Math.min(width, height) * 0.4,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(0.8, "rgba(0,0,0,0.5)");
      vignette.addColorStop(1, "rgba(0,0,0,0.95)");

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      // 4. Shader Film Grain Overlay across active shader area
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
