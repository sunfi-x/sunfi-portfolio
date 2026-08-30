"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { type Engine } from "@tsparticles/engine";

export function ParticlesBackground() {
  const [init, setInit] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!init) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Particles
        id="tsparticles"
        className="w-full h-full"
        options={{
          background: {
            color: {
              value: "#000000",
            },
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
            color: {
              value: "#D90429",
            },
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
              outModes: {
                default: "out",
              },
              random: true,
              speed: isMobile ? 1.2 : 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                width: 1000,
                height: 1000,
              },
              value: isMobile ? 25 : 65,
            },
            opacity: {
              value: { min: 0.3, max: 0.7 },
            },
            shape: {
              type: "circle",
            },
            size: {
              value: { min: 1, max: isMobile ? 2 : 3 },
            },
          },
          detectRetina: !isMobile,
        }}
      />
    </div>
  );
}
