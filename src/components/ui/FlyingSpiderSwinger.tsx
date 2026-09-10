"use client";

import React, { useEffect, useRef } from "react";

interface FlyingSpiderman {
  x: number;
  y: number;
  anchorX: number;
  anchorY: number;
  targetAnchorX: number;
  targetAnchorY: number;
  webLength: number;
  angle: number;
  angularVelocity: number;
  phase: "shooting" | "swinging" | "releasing";
  shootProgress: number;
  imgIndex: number;
  width: number;
  height: number;
  releaseVx: number;
  releaseVy: number;
}

const SPIDERMAN_IMAGES = [
  "/spiderman/spiderman1.png",
  "/spiderman/spiderman2.png",
  "/spiderman/spiderman4.png",
  "/spiderman/spiderman6.png",
  "/spiderman/spiderman7.png",
  "/spiderman/spiderman8.png",
];

export function FlyingSpiderSwinger() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImagesRef = useRef<HTMLImageElement[]>([]);

  // Preload Spider-Man PNG Images
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    SPIDERMAN_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
      images.push(img);
    });
    loadedImagesRef.current = images;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hero = document.getElementById("hero");
    if (!hero) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width;
      canvas.height = height;
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const createFlyingSpiderman = (startX?: number, startY?: number): FlyingSpiderman => {
      const isMobile = width < 768;
      const sX = startX ?? (isMobile ? width * 0.1 : width * 0.15);
      const sY = startY ?? (isMobile ? height * 0.5 : height * 0.4);

      const targetAnchorX = Math.max(40, Math.min(width - 40, sX + (Math.random() > 0.5 ? 1 : -1) * (width * 0.35)));
      const targetAnchorY = Math.max(10, Math.random() * (height * 0.2));

      return {
        x: sX,
        y: sY,
        anchorX: sX,
        anchorY: sY,
        targetAnchorX,
        targetAnchorY,
        webLength: isMobile ? 160 : 220,
        angle: -0.8,
        angularVelocity: 0.035,
        phase: "shooting",
        shootProgress: 0,
        imgIndex: Math.floor(Math.random() * SPIDERMAN_IMAGES.length),
        width: isMobile ? 90 : 130,
        height: isMobile ? 120 : 170,
        releaseVx: 0,
        releaseVy: 0,
      };
    };

    let heroSpiderman: FlyingSpiderman = createFlyingSpiderman();
    let animId: number;

    const render = () => {
      if (width < 768) {
        ctx.clearRect(0, 0, width, height);
        return; // Don't run RAF animation loop on mobile for zero lag
      }
      ctx.clearRect(0, 0, width, height);

      const sp = heroSpiderman;
      const isMobile = width < 768;

      // Update responsive dimensions
      sp.width = isMobile ? 90 : 130;
      sp.height = isMobile ? 120 : 170;

      // -----------------------------------------------------------------
      // PHASE 1: SHOOTING WHITE WEB THREAD TO CEILING/TOP ANCHOR
      // -----------------------------------------------------------------
      if (sp.phase === "shooting") {
        sp.shootProgress += 0.07;

        const currentWebX = sp.x + (sp.targetAnchorX - sp.x) * sp.shootProgress;
        const currentWebY = sp.y + (sp.targetAnchorY - sp.y) * sp.shootProgress;

        // Draw Web Thread Shot Out by Spider-Man
        ctx.save();
        ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(sp.x, sp.y - sp.height * 0.2);
        ctx.lineTo(currentWebX, currentWebY);
        ctx.stroke();

        // Web Impact Spot on Wall/Ceiling
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(currentWebX, currentWebY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (sp.shootProgress >= 1) {
          sp.phase = "swinging";
          sp.anchorX = sp.targetAnchorX;
          sp.anchorY = sp.targetAnchorY;

          const dx = sp.x - sp.anchorX;
          const dy = sp.y - sp.anchorY;
          sp.webLength = Math.sqrt(dx * dx + dy * dy);
          sp.angle = Math.atan2(dx, dy);
          sp.angularVelocity = sp.anchorX < width / 2 ? 0.04 : -0.04;
        }

        // Slight drift while web travels
        sp.x += (sp.targetAnchorX > sp.x ? 1 : -1) * 1.5;
      }

      // -----------------------------------------------------------------
      // PHASE 2: SWINGING ACROSS THE HERO SECTION ON THE WEB THREAD
      // -----------------------------------------------------------------
      else if (sp.phase === "swinging") {
        const gravity = 0.0016;
        const angularAccel = (-gravity / (sp.webLength / 180)) * Math.sin(sp.angle);

        sp.angularVelocity += angularAccel;
        sp.angularVelocity *= 0.995; // Smooth momentum
        sp.angle += sp.angularVelocity;

        sp.x = sp.anchorX + Math.sin(sp.angle) * sp.webLength;
        sp.y = sp.anchorY + Math.cos(sp.angle) * sp.webLength;

        // Draw Prominent Glowing Web Thread Connecting Spider-Man to Ceiling
        ctx.save();
        ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
        ctx.shadowBlur = 8;
        ctx.strokeStyle = "rgba(240, 245, 255, 0.9)";
        ctx.lineWidth = 2.0;

        // Curved organic web line
        const handX = sp.x;
        const handY = sp.y - sp.height * 0.25;
        const midX = (sp.anchorX + handX) / 2;
        const midY = (sp.anchorY + handY) / 2 + 8;

        ctx.beginPath();
        ctx.moveTo(sp.anchorX, sp.anchorY);
        ctx.quadraticCurveTo(midX, midY, handX, handY);
        ctx.stroke();

        // Web Anchor Spot
        ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
        ctx.beginPath();
        ctx.arc(sp.anchorX, sp.anchorY, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Release web when reaching end of swing arc
        if (
          Math.abs(sp.angularVelocity) < 0.005 ||
          (sp.angularVelocity > 0 && sp.angle > 0.75) ||
          (sp.angularVelocity < 0 && sp.angle < -0.75)
        ) {
          sp.phase = "releasing";
          sp.releaseVx = Math.cos(sp.angle) * sp.angularVelocity * sp.webLength * 1.3;
          sp.releaseVy = -Math.abs(sp.angularVelocity * sp.webLength * 0.6) - 1.5;
        }
      }

      // -----------------------------------------------------------------
      // PHASE 3: FLYING THROUGH THE AIR TO THE NEXT WEBSHOOT POSITION
      // -----------------------------------------------------------------
      else if (sp.phase === "releasing") {
        sp.x += sp.releaseVx;
        sp.y += sp.releaseVy;
        sp.releaseVy += 0.12; // Gravity leap

        // Reset & shoot web from new position
        if (sp.y > height * 0.75 || sp.x < 20 || sp.x > width - 20 || sp.releaseVy > 4) {
          const nextX = Math.max(60, Math.min(width - 60, sp.x));
          const nextY = Math.max(height * 0.35, Math.min(height * 0.6, sp.y));

          heroSpiderman = createFlyingSpiderman(nextX, nextY);
        }
      }

      // -----------------------------------------------------------------
      // DRAW SPIDER-MAN CHARACTER IMAGE WITH SMOOTH SWING ROTATION
      // -----------------------------------------------------------------
      const img = loadedImagesRef.current[sp.imgIndex];
      if (img && img.complete) {
        ctx.save();
        ctx.translate(sp.x, sp.y);

        // Tilt Spider-Man dynamically according to swing angle & direction
        const swingTilt = sp.phase === "swinging" ? -sp.angle * 0.45 : sp.releaseVx * 0.05;
        ctx.rotate(swingTilt);

        // Shadow under Spider-Man
        ctx.shadowColor = "rgba(0, 0, 0, 0.7)";
        ctx.shadowBlur = 12;

        ctx.drawImage(
          img,
          -sp.width / 2,
          -sp.height / 2,
          sp.width,
          sp.height
        );

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[4] overflow-hidden"
    />
  );
}
