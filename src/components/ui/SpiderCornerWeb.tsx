"use client";

import { useEffect, useRef, useCallback } from "react";

interface WebNode {
  x: number;
  y: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  fixed?: boolean;
}

interface WebConfig {
  focalX: number;
  focalY: number;
  startAngle: number;
  endAngle: number;
  spokesCount: number;
  ringsCount: number;
  radius: number;
  ringSagFactor: number;
  spokeOpacity: number;
  strandOpacity: number;
  is360?: boolean;
}

function createCornerWebGrid(config: WebConfig): { grid: WebNode[][]; focal: WebNode } {
  const { focalX, focalY, startAngle, endAngle, spokesCount, ringsCount, radius } = config;
  const focalNode: WebNode = { x: focalX, y: focalY, ox: focalX, oy: focalY, vx: 0, vy: 0, fixed: true };
  const grid: WebNode[][] = [];

  for (let r = 1; r <= ringsCount; r++) {
    const ringNodes: WebNode[] = [];
    const tRing = Math.pow(r / ringsCount, 0.82);
    const currentRadius = radius * tRing;

    for (let s = 0; s < spokesCount; s++) {
      const tSpoke = s / Math.max(spokesCount - 1, 1);
      const angle = startAngle + tSpoke * (endAngle - startAngle);

      const nx = focalX + Math.sin(angle) * currentRadius;
      const ny = focalY + Math.cos(angle) * currentRadius;
      const isAnchor = r === ringsCount || s === 0 || s === spokesCount - 1;

      ringNodes.push({
        x: nx,
        y: ny,
        ox: nx,
        oy: ny,
        vx: 0,
        vy: 0,
        fixed: isAnchor,
      });
    }
    grid.push(ringNodes);
  }

  return { grid, focal: focalNode };
}

function createRadial360WebGrid(config: WebConfig): { grid: WebNode[][]; focal: WebNode } {
  const { focalX, focalY, spokesCount, ringsCount, radius } = config;
  const focalNode: WebNode = { x: focalX, y: focalY, ox: focalX, oy: focalY, vx: 0, vy: 0, fixed: true };
  const grid: WebNode[][] = [];

  for (let r = 1; r <= ringsCount; r++) {
    const ringNodes: WebNode[] = [];
    const tRing = Math.pow(r / ringsCount, 0.78);
    const currentRadius = radius * tRing;

    for (let s = 0; s < spokesCount; s++) {
      const angle = (s / spokesCount) * Math.PI * 2;
      const nx = focalX + Math.cos(angle) * currentRadius;
      const ny = focalY + Math.sin(angle) * currentRadius;
      const isAnchor = r === ringsCount;

      ringNodes.push({
        x: nx,
        y: ny,
        ox: nx,
        oy: ny,
        vx: 0,
        vy: 0,
        fixed: isAnchor,
      });
    }
    grid.push(ringNodes);
  }

  return { grid, focal: focalNode };
}

function updateWebPhysics(grid: WebNode[][], mx: number, my: number, interactionRadius: number) {
  const spring = 0.12;
  const damp = 0.70;
  const repelStrength = 6.0;

  for (let r = 0; r < grid.length; r++) {
    for (let s = 0; s < grid[r].length; s++) {
      const node = grid[r][s];
      if (node.fixed) continue;

      const fx = (node.ox - node.x) * spring;
      const fy = (node.oy - node.y) * spring;

      const dx = node.x - mx;
      const dy = node.y - my;
      const dist = Math.hypot(dx, dy);

      let rx = 0;
      let ry = 0;
      if (dist < interactionRadius && dist > 0) {
        const force = ((interactionRadius - dist) / interactionRadius) * repelStrength;
        rx = (dx / dist) * force;
        ry = (dy / dist) * force;
      }

      node.vx = (node.vx + fx + rx) * damp;
      node.vy = (node.vy + fy + ry) * damp;
      node.x += node.vx;
      node.y += node.vy;
    }
  }
}

function drawWeb(
  ctx: CanvasRenderingContext2D,
  grid: WebNode[][],
  focal: WebNode,
  config: WebConfig
) {
  const rings = grid.length;
  const spokes = grid[0].length;
  const is360 = config.is360 || false;

  ctx.save();

  // 1. Spoke lines (radiating outward)
  ctx.strokeStyle = `rgba(240, 245, 255, ${config.spokeOpacity})`;
  ctx.lineWidth = is360 ? 1.1 : 1.2;
  ctx.shadowColor = "rgba(255, 255, 255, 0.4)";
  ctx.shadowBlur = is360 ? 5 : 4;

  for (let s = 0; s < spokes; s++) {
    ctx.beginPath();
    ctx.moveTo(focal.x, focal.y);
    for (let r = 0; r < rings; r++) {
      ctx.lineTo(grid[r][s].x, grid[r][s].y);
    }
    ctx.stroke();
  }

  // 2. Concentric ring strands (connecting adjacent spokes)
  ctx.strokeStyle = `rgba(220, 230, 255, ${config.strandOpacity})`;
  ctx.lineWidth = is360 ? 0.85 : 0.9;
  ctx.shadowBlur = 2;

  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < spokes; s++) {
      const nextS = (s + 1) % spokes;
      if (!is360 && s === spokes - 1) continue; // Don't loop around for corner web

      const nodeA = grid[r][s];
      const nodeB = grid[r][nextS];

      const midX = (nodeA.x + nodeB.x) / 2;
      const midY = (nodeA.y + nodeB.y) / 2;
      const cpX = focal.x + (midX - focal.x) * config.ringSagFactor;
      const cpY = focal.y + (midY - focal.y) * config.ringSagFactor;

      ctx.beginPath();
      ctx.moveTo(nodeA.x, nodeA.y);
      ctx.quadraticCurveTo(cpX, cpY, nodeB.x, nodeB.y);
      ctx.stroke();
    }
  }

  // 3. Web junction dots
  ctx.shadowColor = "rgba(255, 255, 255, 0.85)";
  ctx.shadowBlur = 5;
  ctx.fillStyle = `rgba(255, 255, 255, ${config.spokeOpacity * 1.4})`;

  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < spokes; s++) {
      const node = grid[r][s];
      ctx.beginPath();
      ctx.arc(node.x, node.y, r === rings - 1 ? 1.4 : 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

export function SpiderCornerWeb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const rafRef = useRef<number>(0);

  const websRef = useRef<
    { grid: WebNode[][]; focal: WebNode; config: WebConfig }[]
  >([]);

  const setupWebs = useCallback((w: number, h: number) => {
    // 1. Calculate dynamic Avatar center position
    const avatarEl = document.getElementById("hero-avatar-center");
    const heroEl = document.getElementById("hero");

    let avatarX = w * 0.74; // Fallback right column center
    let avatarY = h * 0.48; // Fallback right column center
    let avatarRadius = Math.min(Math.max(w * 0.32, 380), 520);

    if (avatarEl && heroEl) {
      const avatarRect = avatarEl.getBoundingClientRect();
      const heroRect = heroEl.getBoundingClientRect();
      avatarX = avatarRect.left + avatarRect.width / 2 - heroRect.left;
      avatarY = avatarRect.top + avatarRect.height / 2 - heroRect.top;
      avatarRadius = Math.max(avatarRect.width * 1.6, 380);
    }

    // 2. LEFT CORNER WEB (Top-left corner fan)
    const leftCornerRadius = Math.min(Math.max(w * 0.24, 280), 380);
    const leftCornerConfig: WebConfig = {
      focalX: 0,
      focalY: 0,
      startAngle: 0,
      endAngle: Math.PI / 2,
      spokesCount: 8,
      ringsCount: 6,
      radius: leftCornerRadius,
      ringSagFactor: 0.86,
      spokeOpacity: 0.42,
      strandOpacity: 0.32,
    };

    // 3. MASSIVE 360° RADIAL WEB (Centered behind Avatar Image)
    const avatarRadialConfig: WebConfig = {
      focalX: avatarX,
      focalY: avatarY,
      startAngle: 0,
      endAngle: Math.PI * 2,
      spokesCount: 18, // 18 radial spokes fanning out in 360 degrees
      ringsCount: 10, // 10 expanding concentric rings
      radius: avatarRadius,
      ringSagFactor: 0.85,
      spokeOpacity: 0.35,
      strandOpacity: 0.25,
      is360: true,
    };

    const webs: { grid: WebNode[][]; focal: WebNode; config: WebConfig }[] = [];

    // Only include Top-Left web if NOT on mobile (w >= 768)
    if (w >= 768) {
      const leftCorner = createCornerWebGrid(leftCornerConfig);
      webs.push({ grid: leftCorner.grid, focal: leftCorner.focal, config: leftCornerConfig });
    }

    const avatarRadial = createRadial360WebGrid(avatarRadialConfig);
    webs.push({ grid: avatarRadial.grid, focal: avatarRadial.focal, config: avatarRadialConfig });

    websRef.current = webs;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hero = document.getElementById("hero");
    if (!hero) return;

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      setupWebs(rect.width, rect.height);
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(hero);

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("mouseleave", onMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const web of websRef.current) {
        updateWebPhysics(web.grid, mouseRef.current.x, mouseRef.current.y, 95);
        drawWeb(ctx, web.grid, web.focal, web.config);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [setupWebs]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
      aria-hidden="true"
    />
  );
}
