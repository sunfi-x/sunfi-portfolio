"use client";

import React, { useEffect, useRef } from "react";

interface SmokeFlowProps {
  colorA?: string;       // Fresh smoke color (Hex, e.g. "#e53935" vibrant red)
  colorB?: string;       // Core glow color (Hex, e.g. "#ffffff" white glow)
  colorC?: string;       // Dissipating tail color (Hex, e.g. "#7f1d1d" deep crimson)
  intensity?: number;    // Smoke emission density multiplier
  emitRadius?: number;   // Size of smoke emission puff around cursor (px)
  dissipation?: number;  // How fast smoke fades over time
  swirlDetail?: number;  // Fine-scale swirling vorticity
  className?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16);
  return [(num >> 16 & 255) / 255, (num >> 8 & 255) / 255, (num & 255) / 255];
}

const VERTEX_SHADER = `
attribute vec2 aPosition;
varying vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

// Smooth Silky Fluid Smoke Shader
const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVel;
uniform float uMouseActive;

uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uIntensity;
uniform float uEmitRadius;

varying vec2 vUv;

// 3D Simplex Noise Engine
vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.yw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.yw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// Smooth 2-octave FBM for silky smoke billows
float fbm(vec2 p, float time) {
  float val = snoise(vec3(p, time)) * 0.65;
  val += snoise(vec3(p * 2.2 + vec2(4.1, 1.7), time * 1.2)) * 0.35;
  return val * 0.5 + 0.5;
}

// Bounded Curl Noise (no derivative explosion)
vec2 smoothCurl(vec2 p, float time) {
  float eps = 0.08;
  float n1 = fbm(p + vec2(0.0, eps), time);
  float n2 = fbm(p - vec2(0.0, eps), time);
  float n3 = fbm(p + vec2(eps, 0.0), time);
  float n4 = fbm(p - vec2(eps, 0.0), time);

  vec2 curl = vec2(n1 - n2, -(n3 - n4));
  return clamp(curl * 0.8, -0.3, 0.3);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 st = vec2(uv.x * aspect, uv.y);

  float time = uTime * 0.2;

  // Smooth Curl Warp
  vec2 curl = smoothCurl(st * 1.2, time);
  vec2 warpedSt = st + curl * 0.15;

  // Distance to mouse cursor
  vec2 mouseSt = vec2(uMouse.x * aspect, uMouse.y);
  float distToMouse = length(st - mouseSt);

  // Mouse emission puff & trail
  float emitRadius = uEmitRadius * 0.003;
  float puff = smoothstep(emitRadius * 2.0, 0.0, distToMouse) * uMouseActive * uIntensity;

  // Velocity directional splat
  vec2 velDir = uMouseVel * 0.12;
  float velLen = length(uMouseVel);
  float motionSplat = smoothstep(emitRadius * 3.5, 0.0, length(st - (mouseSt - velDir))) * velLen * 2.5 * uIntensity;

  // Organic fluid smoke billows
  float smokePattern = fbm(warpedSt * 2.0 + vec2(0.0, -time * 0.15), time * 0.5);
  smokePattern = pow(smokePattern, 1.4);

  // Ambient organic background smoke + active cursor emission
  float totalSmoke = (puff * 0.8 + motionSplat * 0.6) + smokePattern * (puff * 1.2 + 0.04);
  totalSmoke = clamp(totalSmoke, 0.0, 1.0);

  // Color interpolation
  vec3 color;
  if (totalSmoke < 0.4) {
    color = mix(uColorC, uColorA, totalSmoke / 0.4);
  } else {
    color = mix(uColorA, uColorB, (totalSmoke - 0.4) / 0.6);
  }

  float alpha = smoothstep(0.02, 0.9, totalSmoke) * 0.85;

  gl_FragColor = vec4(color, alpha);
}
`;

export function SmokeFlowBackground({
  colorA = "#e53935",       // Fresh Smoke Red
  colorB = "#ffffff",       // Pure White Core Glow
  colorC = "#7f1d1d",       // Deep Crimson Tail
  intensity = 2.0,
  emitRadius = 50,
  swirlDetail = 30,
  className = "",
}: SmokeFlowProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true });
    if (!gl) return;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Compile Shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);

    const program = gl.createProgram()!;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Quad Buffer
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Uniform Locations
    const uRes = gl.getUniformLocation(program, "uResolution");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uMouse = gl.getUniformLocation(program, "uMouse");
    const uMouseVel = gl.getUniformLocation(program, "uMouseVel");
    const uMouseActive = gl.getUniformLocation(program, "uMouseActive");

    const uColA = gl.getUniformLocation(program, "uColorA");
    const uColB = gl.getUniformLocation(program, "uColorB");
    const uColC = gl.getUniformLocation(program, "uColorC");

    const uInt = gl.getUniformLocation(program, "uIntensity");
    const uRad = gl.getUniformLocation(program, "uEmitRadius");

    // Mouse Tracking State
    const mouse = {
      x: 0.5,
      y: 0.5,
      prevX: 0.5,
      prevY: 0.5,
      vx: 0,
      vy: 0,
      active: 0,
    };

    let animationFrameId: number;
    const startTime = performance.now();

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const targetX = (e.clientX - rect.left) / rect.width;
      const targetY = 1.0 - (e.clientY - rect.top) / rect.height;

      mouse.vx = (targetX - mouse.x) * 0.5 + mouse.vx * 0.5;
      mouse.vy = (targetY - mouse.y) * 0.5 + mouse.vy * 0.5;
      mouse.x = targetX;
      mouse.y = targetY;
      mouse.active = 1.0;
    };

    const handleMouseLeave = () => {
      mouse.active = 0.0;
    };

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      const width = parent?.clientWidth || window.innerWidth;
      const height = parent?.clientHeight || window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    handleResize();

    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      mouse.vx *= 0.88;
      mouse.vy *= 0.88;

      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Pure Dark Black
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform2f(uMouseVel, mouse.vx, mouse.vy);
      gl.uniform1f(uMouseActive, mouse.active);

      gl.uniform3fv(uColA, hexToRgb(colorA));
      gl.uniform3fv(uColB, hexToRgb(colorB));
      gl.uniform3fv(uColC, hexToRgb(colorC));

      gl.uniform1f(uInt, intensity);
      gl.uniform1f(uRad, emitRadius);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, [colorA, colorB, colorC, intensity, emitRadius]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none -z-10 bg-black ${className}`}
      style={{ display: "block" }}
    />
  );
}
