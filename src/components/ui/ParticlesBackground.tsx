"use client";

import { useState, useEffect } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { type Engine } from "@tsparticles/engine";

// Singleton: engine initialized once for entire app lifetime — no resets
let _engineReady = false;
let _enginePromise: Promise<void> | null = null;

function ensureEngine(): Promise<void> {
  if (_engineReady) return Promise.resolve();
  if (_enginePromise) return _enginePromise;
  _enginePromise = initParticlesEngine(async (engine: Engine) => {
    await loadSlim(engine);
  }).then(() => {
    _engineReady = true;
  });
  return _enginePromise;
}

export function ParticlesBackground() {
  const [ready, setReady] = useState(_engineReady); // start true if already initialized
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile once (no resize listener = no re-render = no particle reset)
    setIsMobile(window.innerWidth < 768);

    if (!_engineReady) {
      ensureEngine().then(() => setReady(true));
    }
  }, []);

  if (!ready) return null;

  return (
    <Particles
      id="tsparticles-global"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
      options={{
        background: {
          color: { value: "transparent" },
        },
        fullScreen: {
          enable: true,
          zIndex: 0,
        },
        fpsLimit: isMobile ? 30 : 60,
        interactivity: {
          events: {
            onHover: {
              enable: !isMobile,
              mode: "repulse",
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: { value: "#D90429" },
          links: {
            color: "#D90429",
            distance: isMobile ? 100 : 140,
            enable: true,
            opacity: isMobile ? 0.4 : 0.6,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: isMobile ? 1.2 : 2,
            straight: false,
          },
          number: {
            density: { enable: true, width: 1000, height: 1000 },
            value: isMobile ? 25 : 65,
          },
          opacity: {
            value: { min: 0.3, max: 0.7 },
          },
          shape: { type: "circle" },
          size: {
            value: { min: 1, max: isMobile ? 2 : 3 },
          },
        },
        detectRetina: !isMobile,
      }}
    />
  );
}
