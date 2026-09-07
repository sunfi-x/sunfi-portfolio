"use client";

import React, { useEffect, useRef } from "react";

interface AuroraBackgroundProps {
  colorA?: string;       // Base/Edge color (Hex string) - e.g. Vibrant Red "#e53935"
  colorB?: string;       // Core center color (Hex string) - e.g. Glowing White "#ffffff"
  colorC?: string;       // Tip color (Hex string) - e.g. Deep Crimson "#7f1d1d"
  speed?: number;        // Animation speed multiplier
  intensity?: number;    // Brightness / opacity intensity (0 to 100)
  waviness?: number;     // Curtain undulation factor (0 to 100)
  rayDensity?: number;   // Vertical ray detail (0 to 100)
  height?: number;       // Vertical height extent (10 to 200)
  curtainCount?: number; // Curtain layers (1 to 4)
  seed?: number;         // Random seed (0 to 100)
  centerY?: number;      // Vertical baseline origin (0.1 to 0.9, default 0.35)
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

const FRAGMENT_SHADER = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uSpeed;
uniform float uIntensity;
uniform float uWaviness;
uniform float uRayDensity;
uniform float uHeight;
uniform float uCurtains;
uniform float uSeed;
uniform vec2 uCenter;

varying vec2 vUv;

// -------------------------------------------------------------
// 3D Simplex Noise Engine
// -------------------------------------------------------------
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

// -------------------------------------------------------------
// Organic Aurora Wave & Ray Helpers
// -------------------------------------------------------------
float calcWave(float x, float t, float phase, float freq, float speed, float amount) {
  return sin(x * freq + t * speed + phase) * amount;
}

// Soft organic ray texture (broad light streaks rather than sharp barcode lines)
float calcCurtainRays(float along, float frequency, float time, float phase) {
  float wave1 = sin(along * frequency + time * 0.4 + phase);
  float wave2 = cos(along * frequency * 1.8 - time * 0.3 + phase * 1.5);
  float val = (wave1 + wave2 * 0.5) * 0.333 + 0.5;
  return mix(0.75, 1.0, pow(clamp(val, 0.0, 1.0), 1.2));
}

vec3 mix3Colors(vec3 colA, vec3 colB, vec3 colC, float t) {
  t = clamp(t, 0.0, 1.0);
  if (t < 0.45) {
    return mix(colA, colB, t / 0.45);
  } else {
    return mix(colB, colC, (t - 0.45) / 0.55);
  }
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float time = uTime * (uSpeed * 0.25);

  float centerOriginX = uCenter.x;
  float centerOriginY = uCenter.y; // Correct baseline position (default 0.35)
  float waviness = uWaviness * 0.005;
  float rayDetail = uRayDensity * 0.01;
  float heightExt = max(uHeight * 0.006, 0.2);
  float glowIntensity = uIntensity * 0.015;

  vec3 totalColor = vec3(0.0);
  float totalAlpha = 0.0;
  float totalWeight = 0.0;

  vec4 timeOffsets = vec4(0.0, 2.4, 4.8, 7.2);
  vec4 weights = vec4(1.0, 0.75, 0.5, 0.3);

  // Normalized aspect-corrected horizontal coordinate
  float wx = (uv.x - centerOriginX) * aspect;

  for (int i = 0; i < 4; i++) {
    if (float(i) >= uCurtains) break;

    float tOffset = (i == 0) ? timeOffsets.x : (i == 1) ? timeOffsets.y : (i == 2) ? timeOffsets.z : timeOffsets.w;
    float wWeight = (i == 0) ? weights.x : (i == 1) ? weights.y : (i == 2) ? weights.z : weights.w;

    float curtainTime = time + tOffset;
    float layerSeed = uSeed + float(i) * 17.3;

    // Organic wavy path offsets
    float phase1 = mod(layerSeed * 12.9 + 4758.5, 6.28318);
    float phase2 = mod(layerSeed * 78.2 + 2847.1, 6.28318);
    float phase3 = mod(layerSeed * 41.6 + 1593.7, 6.28318);

    float waveSum = calcWave(wx, curtainTime, phase1, 0.8, 0.35, 0.25) +
                    calcWave(wx, curtainTime, phase2, 1.5, 0.55, 0.14) +
                    calcWave(wx, curtainTime, phase3, 2.8, 0.25, 0.07);

    // Organic Simplex Noise displacement along the curtain
    float curtainNoise = snoise(vec3(wx * 0.6, curtainTime * 0.2, layerSeed * 0.1));

    // Baseline path position across the canvas
    float pathBase = centerOriginY + waveSum * waviness + curtainNoise * 0.12 * waviness;

    // Soft Ray texture variation
    float rayFreq = mix(1.2, 3.5, rayDetail);
    float rayPhase = mod(layerSeed * 53.7 + 3847.2, 6.28318);
    float rayStructure = calcCurtainRays(wx + curtainNoise * 0.8, rayFreq, curtainTime, rayPhase);

    // Distance from undulating curtain path
    float distFromPath = abs(uv.y - pathBase);
    float curtainSpan = heightExt * mix(0.7, 1.0, rayStructure);

    // Smooth wide curtain falloff mask
    float verticalMask = smoothstep(curtainSpan, 0.0, distFromPath);
    float colorT = clamp((uv.y - (pathBase - curtainSpan * 0.5)) / curtainSpan, 0.0, 1.0);

    float curtainAlpha = verticalMask * rayStructure * glowIntensity * wWeight;
    vec3 curtainColor = mix3Colors(uColorA, uColorB, uColorC, colorT);

    totalColor += curtainColor * curtainAlpha;
    totalAlpha += curtainAlpha;
    totalWeight += wWeight;
  }

  vec3 finalColor = totalColor / max(totalWeight, 0.0001);
  float alphaOut = clamp(totalAlpha, 0.0, 1.0);

  gl_FragColor = vec4(finalColor, alphaOut);
}
`;

export function AuroraBackground({
  colorA = "#e53935",       // Red accent
  colorB = "#ffffff",       // Pure White core accent
  colorC = "#7f1d1d",       // Deep Crimson Red
  speed = 2.5,              // Smooth, elegant animation speed
  intensity = 45,           // Opacity / Brightness tuned so hero text remains crisp & clear
  waviness = 50,
  rayDensity = 25,
  height = 130,
  curtainCount = 4,
  seed = 0,
  centerY = 0.35,           // Vertical center baseline (35% from bottom)
  className = "",
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: true, preserveDrawingBuffer: false });
    if (!gl) return;

    // Enable Alpha blending over pure black background
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    // Compile Vertex Shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, VERTEX_SHADER);
    gl.compileShader(vs);

    // Compile Fragment Shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, FRAGMENT_SHADER);
    gl.compileShader(fs);

    // Link Program
    const program = gl.createProgram();
    if (!program) return;
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
    const uColA = gl.getUniformLocation(program, "uColorA");
    const uColB = gl.getUniformLocation(program, "uColorB");
    const uColC = gl.getUniformLocation(program, "uColorC");
    const uSpd = gl.getUniformLocation(program, "uSpeed");
    const uInt = gl.getUniformLocation(program, "uIntensity");
    const uWav = gl.getUniformLocation(program, "uWaviness");
    const uRay = gl.getUniformLocation(program, "uRayDensity");
    const uHgt = gl.getUniformLocation(program, "uHeight");
    const uCurt = gl.getUniformLocation(program, "uCurtains");
    const uSd = gl.getUniformLocation(program, "uSeed");
    const uCenter = gl.getUniformLocation(program, "uCenter");

    let animationFrameId: number;
    const startTime = performance.now();

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = canvas.parentElement?.clientHeight || window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    const render = () => {
      const elapsed = (performance.now() - startTime) * 0.001;

      gl.clearColor(0.0, 0.0, 0.0, 1.0); // Pure Dark Black Base
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform3fv(uColA, hexToRgb(colorA));
      gl.uniform3fv(uColB, hexToRgb(colorB));
      gl.uniform3fv(uColC, hexToRgb(colorC));
      gl.uniform1f(uSpd, speed);
      gl.uniform1f(uInt, intensity);
      gl.uniform1f(uWav, waviness);
      gl.uniform1f(uRay, rayDensity);
      gl.uniform1f(uHgt, height);
      gl.uniform1f(uCurt, curtainCount);
      gl.uniform1f(uSd, seed);
      gl.uniform2f(uCenter, 0.5, centerY);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (buffer) gl.deleteBuffer(buffer);
    };
  }, [colorA, colorB, colorC, speed, intensity, waviness, rayDensity, height, curtainCount, seed, centerY]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none -z-10 bg-black ${className}`}
      style={{ display: "block" }}
    />
  );
}
