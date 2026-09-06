"use client";

import React, { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  minAlpha: number;
  twinkleSpeed: number;
  twinkleDir: number;
  color: string;
  glow: boolean;
  depth: number; // 0.1 (distant) to 1.0 (near) for 3D parallax
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  dx: number;
  dy: number;
  opacity: number;
  maxOpacity: number;
  width: number;
  color: string;
  life: number;
  maxLife: number;
}

interface MouseParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  maxAlpha: number;
  color: string;
  life: number;
  maxLife: number;
}

const STAR_COLORS = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#f8fafc", // silver white
  "#f1f5f9", // soft slate white
  "#fffbeb", // faint warm diamond
  "#e0f2fe", // soft sky blue
];

const STARDUST_COLORS = [
  "#ffffff",
  "#e0f2fe",
  "#bae6fd",
  "#fef3c7",
  "#f3e8ff",
];

export function NightSkyBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const isMobile = window.innerWidth < 768;
    const starCount = isMobile ? 90 : 230;

    // Mouse Tracking State
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    // Initialize Static Twinkling Stars with 3D Depth
    const stars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      const depth = Math.random() * 0.8 + 0.2; // depth scale for parallax
      const radius = (Math.random() < 0.88 ? Math.random() * 1.0 + 0.3 : Math.random() * 0.8 + 1.1) * (0.6 + depth * 0.4);
      const minAlpha = Math.random() * 0.15 + 0.05;
      const maxAlpha = (Math.random() * 0.5 + 0.35) * (0.5 + depth * 0.5);

      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius,
        alpha: Math.random() * (maxAlpha - minAlpha) + minAlpha,
        minAlpha,
        maxAlpha,
        twinkleSpeed: Math.random() * 0.008 + 0.002,
        twinkleDir: Math.random() < 0.5 ? 1 : -1,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        glow: radius > 1.4,
        depth,
      });
    }

    // Shooting Stars Array & Spawner
    let shootingStars: ShootingStar[] = [];

    const spawnShootingStar = () => {
      const angle = (Math.random() * 20 + 25) * (Math.PI / 180);

      // Randomize Speed Type: Speedy / Slow / Standard
      const typeRoll = Math.random();
      let speed: number;
      let length: number;
      let maxLife: number;
      let widthVal: number;

      if (typeRoll < 0.38) {
        // Speedy / Fast Meteor (Lightning streak)
        speed = Math.random() * 10 + 18; // 18-28 px/frame
        length = Math.random() * 120 + 200; // long 200-320px streak
        maxLife = Math.floor(Math.random() * 18 + 22);
        widthVal = Math.random() * 0.6 + 1.2;
      } else if (typeRoll < 0.70) {
        // Gentle / Slow Meteor (Drifting star)
        speed = Math.random() * 3 + 4.5; // 4.5-7.5 px/frame
        length = Math.random() * 60 + 90; // 90-150px soft trail
        maxLife = Math.floor(Math.random() * 35 + 70);
        widthVal = Math.random() * 0.5 + 0.8;
      } else {
        // Standard Meteor
        speed = Math.random() * 5 + 10; // 10-15 px/frame
        length = Math.random() * 80 + 130;
        maxLife = Math.floor(Math.random() * 25 + 40);
        widthVal = Math.random() * 0.5 + 1.0;
      }

      const spawnOnTop = Math.random() < 0.65;
      const startX = spawnOnTop
        ? Math.random() * (width * 1.2) - width * 0.1
        : width + Math.random() * 50;
      const startY = spawnOnTop
        ? -Math.random() * 50
        : Math.random() * (height * 0.5);

      shootingStars.push({
        x: startX,
        y: startY,
        length,
        speed,
        angle,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        opacity: 0,
        maxOpacity: Math.random() * 0.35 + 0.6,
        width: widthVal,
        color: Math.random() < 0.3 ? "#E0F2FE" : "#FFFFFF",
        life: 0,
        maxLife,
      });
    };

    // Mouse Stardust Particles
    const mouseParticles: MouseParticle[] = [];

    const spawnMouseStardust = (mx: number, my: number) => {
      if (isMobile) return;
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.2 + 0.3;
        const maxLife = Math.floor(Math.random() * 25 + 20);
        mouseParticles.push({
          x: mx + (Math.random() - 0.5) * 8,
          y: my + (Math.random() - 0.5) * 8,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.3, // slight upward float
          radius: Math.random() * 1.2 + 0.5,
          alpha: 1,
          maxAlpha: Math.random() * 0.7 + 0.3,
          color: STARDUST_COLORS[Math.floor(Math.random() * STARDUST_COLORS.length)],
          life: 0,
          maxLife,
        });
      }
    };

    // Frequent, lively shooting star interval (~1s to 2.5s)
    let spawnTimer = 0;
    const nextSpawnInterval = () => Math.floor(Math.random() * 90 + 55);
    let currentInterval = nextSpawnInterval();

    // Event Listeners for Mouse Interactivity
    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (!mouse.active) mouse.active = true;

      // Spawn subtle stardust trail on move
      spawnMouseStardust(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("resize", handleResize);

    // Main Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth Lerp for Mouse Parallax Shift
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Calculate Parallax Displacement (Max +/- 25px offset)
      const parallaxX = ((mouse.x - width / 2) / width) * 35;
      const parallaxY = ((mouse.y - height / 2) / height) * 35;

      // 1. Rich Black Background (Pure Deep Void Black with faint center warmth)
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const voidGradient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        20,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.8
      );
      voidGradient.addColorStop(0, "rgba(5, 7, 12, 0.4)");
      voidGradient.addColorStop(1, "rgba(0, 0, 0, 1)");
      ctx.fillStyle = voidGradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Render & Update Twinkling Stars with 3D Parallax
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];

        // Smooth breathing twinkle
        star.alpha += star.twinkleSpeed * star.twinkleDir;
        if (star.alpha >= star.maxAlpha) {
          star.alpha = star.maxAlpha;
          star.twinkleDir = -1;
        } else if (star.alpha <= star.minAlpha) {
          star.alpha = star.minAlpha;
          star.twinkleDir = 1;
        }

        // Apply 3D Parallax Shift based on Star Depth
        const renderX = star.x + parallaxX * star.depth;
        const renderY = star.y + parallaxY * star.depth;

        let currentAlpha = star.alpha;
        let currentRadius = star.radius;

        ctx.save();
        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = star.color;

        if (star.glow || currentRadius > 1.6) {
          ctx.shadowBlur = 5;
          ctx.shadowColor = star.color;
        }

        ctx.beginPath();
        ctx.arc(renderX, renderY, currentRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Render & Update Mouse Stardust Sparkles
      for (let i = mouseParticles.length - 1; i >= 0; i--) {
        const p = mouseParticles[i];
        p.life++;

        p.x += p.vx;
        p.y += p.vy;

        p.alpha = p.maxAlpha * (1 - p.life / p.maxLife);

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (1 - (p.life / p.maxLife) * 0.5), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life >= p.maxLife) {
          mouseParticles.splice(i, 1);
        }
      }

      // 5. Manage Shooting Stars Spawning
      spawnTimer++;
      if (spawnTimer >= currentInterval) {
        spawnShootingStar();
        // 35% chance to spawn a second twin shooting star right after
        if (Math.random() < 0.35) {
          setTimeout(() => spawnShootingStar(), Math.random() * 200 + 80);
        }
        spawnTimer = 0;
        currentInterval = nextSpawnInterval();
      }

      // 6. Render & Update Shooting Stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const meteor = shootingStars[i];
        meteor.life++;

        if (meteor.life < 12) {
          meteor.opacity = (meteor.life / 12) * meteor.maxOpacity;
        } else if (meteor.life > meteor.maxLife - 18) {
          meteor.opacity = Math.max(0, ((meteor.maxLife - meteor.life) / 18) * meteor.maxOpacity);
        } else {
          meteor.opacity = meteor.maxOpacity;
        }

        meteor.x += meteor.dx;
        meteor.y += meteor.dy;

        const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
        const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

        ctx.save();
        ctx.globalAlpha = meteor.opacity;

        const streakGradient = ctx.createLinearGradient(
          meteor.x,
          meteor.y,
          tailX,
          tailY
        );
        streakGradient.addColorStop(0, "rgba(255, 255, 255, 1.0)");
        streakGradient.addColorStop(0.12, "rgba(255, 255, 255, 0.75)");
        streakGradient.addColorStop(0.5, "rgba(226, 232, 240, 0.25)");
        streakGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = streakGradient;
        ctx.lineWidth = meteor.width;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(meteor.x, meteor.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        ctx.shadowBlur = 6;
        ctx.shadowColor = "#FFFFFF";
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(meteor.x, meteor.y, meteor.width * 1.1, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        if (
          meteor.life >= meteor.maxLife ||
          meteor.x < -100 ||
          meteor.x > width + 200 ||
          meteor.y > height + 200
        ) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
