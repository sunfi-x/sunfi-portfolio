"use client";

import React, { useEffect, useRef } from "react";

interface FlyingSpider {
  x: number;
  y: number;
  vx: number;
  vy: number;
  anchorX: number;
  anchorY: number;
  webLength: number;
  angle: number;
  angularVelocity: number;
  phase: "shooting" | "swinging" | "releasing";
  shootProgress: number; // 0 to 1
  size: number;
  targetAnchorX: number;
  targetAnchorY: number;
}

export function FlyingSpiderSwinger() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });

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

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    hero.addEventListener("mousemove", handleMouseMove);

    // Initialize 2-3 Flying Swung Spiders
    const createSpider = (initialX?: number, initialY?: number): FlyingSpider => {
      const startX = initialX ?? Math.random() * (width || 800);
      const startY = initialY ?? (height ? height * 0.4 + Math.random() * (height * 0.3) : 300);
      
      // Target anchor somewhere above the spider on top border or ceiling area
      const targetAnchorX = Math.max(50, Math.min(width - 50, startX + (Math.random() - 0.5) * 400));
      const targetAnchorY = Math.max(10, Math.random() * (height * 0.25));

      return {
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 2,
        anchorX: startX,
        anchorY: startY,
        targetAnchorX,
        targetAnchorY,
        webLength: 200,
        angle: 0,
        angularVelocity: (Math.random() > 0.5 ? 1 : -1) * (0.03 + Math.random() * 0.03),
        phase: "shooting",
        shootProgress: 0,
        size: 14 + Math.random() * 8, // Cute small spider size
      };
    };

    const spiders: FlyingSpider[] = [
      createSpider(width * 0.2, height * 0.5),
      createSpider(width * 0.7, height * 0.6),
    ];

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      spiders.forEach((spider, idx) => {
        // -------------------------------------------------------------
        // STATE 1: SHOOTING WEB TO TOP ANCHOR
        // -------------------------------------------------------------
        if (spider.phase === "shooting") {
          spider.shootProgress += 0.08;
          
          // Current tip of the expanding web line being shot out
          const currentWebX = spider.x + (spider.targetAnchorX - spider.x) * spider.shootProgress;
          const currentWebY = spider.y + (spider.targetAnchorY - spider.y) * spider.shootProgress;

          // Draw shooting web thread with glowing white/silver effect
          ctx.save();
          ctx.shadowColor = "rgba(255, 255, 255, 0.9)";
          ctx.shadowBlur = 8;
          ctx.strokeStyle = "rgba(240, 245, 255, 0.85)";
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(spider.x, spider.y);
          ctx.lineTo(currentWebX, currentWebY);
          ctx.stroke();

          // Draw glowing web node at tip
          ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
          ctx.beginPath();
          ctx.arc(currentWebX, currentWebY, 2.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Once web connects to ceiling target
          if (spider.shootProgress >= 1) {
            spider.phase = "swinging";
            spider.anchorX = spider.targetAnchorX;
            spider.anchorY = spider.targetAnchorY;
            
            const dx = spider.x - spider.anchorX;
            const dy = spider.y - spider.anchorY;
            spider.webLength = Math.sqrt(dx * dx + dy * dy);
            spider.angle = Math.atan2(dx, dy);
          }

          // Move spider slightly while shooting
          spider.x += spider.vx * 0.5;
          spider.y += spider.vy * 0.5;
        }

        // -------------------------------------------------------------
        // STATE 2: SWINGING ON CONNECTED WEB THREAD
        // -------------------------------------------------------------
        else if (spider.phase === "swinging") {
          // Pendulum Physics Motion
          const gravity = 0.0018;
          const angularAccel = (-gravity / (spider.webLength / 150)) * Math.sin(spider.angle);
          
          spider.angularVelocity += angularAccel;
          spider.angularVelocity *= 0.992; // Slight air resistance damping
          spider.angle += spider.angularVelocity;

          // Update position based on pendulum angle
          spider.x = spider.anchorX + Math.sin(spider.angle) * spider.webLength;
          spider.y = spider.anchorY + Math.cos(spider.angle) * spider.webLength;

          // Repulsion from mouse cursor if nearby!
          const mdx = spider.x - mouseRef.current.x;
          const mdy = spider.y - mouseRef.current.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (dist < 120) {
            spider.angularVelocity += (mdx > 0 ? 0.004 : -0.004);
          }

          // Draw Glowing Connected Silver Web Thread from Anchor to Spider
          ctx.save();
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
          ctx.shadowBlur = 6;
          ctx.strokeStyle = "rgba(230, 240, 255, 0.75)";
          ctx.lineWidth = 1.5;

          // Slight curved sag to make the web thread feel realistic and fluid
          const midX = (spider.anchorX + spider.x) / 2;
          const midY = (spider.anchorY + spider.y) / 2 + 10;

          ctx.beginPath();
          ctx.moveTo(spider.anchorX, spider.anchorY);
          ctx.quadraticCurveTo(midX, midY, spider.x, spider.y);
          ctx.stroke();

          // Anchor point glowing web-spot
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.beginPath();
          ctx.arc(spider.anchorX, spider.anchorY, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Release web after 4-6 seconds or when swing slows down
          if (Math.abs(spider.angularVelocity) < 0.002 && Math.abs(spider.angle) < 0.08) {
            spider.phase = "releasing";
            spider.vx = Math.cos(spider.angle) * spider.angularVelocity * spider.webLength * 1.2;
            spider.vy = -Math.abs(spider.angularVelocity * spider.webLength * 0.8) - 1;
          }
        }

        // -------------------------------------------------------------
        // STATE 3: RELEASING & FLYING TO NEW LOCATION
        // -------------------------------------------------------------
        else if (spider.phase === "releasing") {
          spider.x += spider.vx;
          spider.y += spider.vy;
          spider.vy += 0.08; // Mild gravity drift

          // Fade out old thread line
          if (Math.random() < 0.05 || spider.y > height || spider.x < -100 || spider.x > width + 100) {
            // Pick a new target anchor and shoot web again!
            const newAnchorX = Math.max(50, Math.min(width - 50, spider.x + (Math.random() - 0.5) * 500));
            const newAnchorY = Math.max(10, Math.random() * (height * 0.25));

            spiders[idx] = {
              x: Math.max(50, Math.min(width - 50, spider.x)),
              y: Math.max(100, Math.min(height * 0.7, spider.y)),
              vx: (Math.random() - 0.5) * 3,
              vy: (Math.random() - 0.5) * 2,
              anchorX: spider.x,
              anchorY: spider.y,
              targetAnchorX: newAnchorX,
              targetAnchorY: newAnchorY,
              webLength: 200,
              angle: 0,
              angularVelocity: (Math.random() > 0.5 ? 1 : -1) * (0.025 + Math.random() * 0.025),
              phase: "shooting",
              shootProgress: 0,
              size: spider.size,
            };
          }
        }

        // -------------------------------------------------------------
        // DRAW THE CUTE SPIDER BODY AT (spider.x, spider.y)
        // -------------------------------------------------------------
        ctx.save();
        ctx.translate(spider.x, spider.y);
        
        // Rotate spider body towards its swing/flight direction
        let bodyRotation = 0;
        if (spider.phase === "swinging") {
          bodyRotation = -spider.angle * 0.5;
        } else {
          bodyRotation = Math.atan2(spider.vy, spider.vx) + Math.PI / 2;
        }
        ctx.rotate(bodyRotation);

        const r = spider.size / 2;

        // Glowing Spider Aura (Red / White accent)
        ctx.shadowColor = "rgba(224, 41, 29, 0.85)";
        ctx.shadowBlur = 10;

        // 8 Animated Legs
        ctx.strokeStyle = "rgba(224, 41, 29, 0.9)";
        ctx.lineWidth = 1.6;
        ctx.lineCap = "round";

        const time = Date.now() * 0.008;
        for (let side = -1; side <= 1; side += 2) {
          for (let legIdx = 0; legIdx < 4; legIdx++) {
            const legOffset = Math.sin(time + legIdx * 0.8) * 3;
            const angleOffset = (legIdx - 1.5) * 0.35 + (side * 0.2);

            const kneeX = side * (r * 1.5 + Math.cos(angleOffset) * 6);
            const kneeY = (legIdx - 1.5) * 4 + legOffset;

            const tipX = side * (r * 2.4 + Math.cos(angleOffset) * 10);
            const tipY = (legIdx - 1.5) * 7 + legOffset * 1.5;

            ctx.beginPath();
            ctx.moveTo(side * (r * 0.6), (legIdx - 1.5) * 3);
            ctx.quadraticCurveTo(kneeX, kneeY, tipX, tipY);
            ctx.stroke();
          }
        }

        // Spider Abdomen (Back)
        ctx.fillStyle = "#E0291D"; // Stylish Red matching Sunfi theme
        ctx.beginPath();
        ctx.ellipse(0, r * 0.4, r * 0.75, r * 0.95, 0, 0, Math.PI * 2);
        ctx.fill();

        // Spider Cephalothorax (Head)
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -r * 0.5, r * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Spider Eyes (Glowing dots)
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(-r * 0.2, -r * 0.6, 1.2, 0, Math.PI * 2);
        ctx.arc(r * 0.2, -r * 0.6, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      hero.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-[4] overflow-hidden"
    />
  );
}
