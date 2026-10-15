/* eslint-disable react-hooks/immutability */
"use client";

import { Suspense, RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useThemeContext } from "@/components/ui/ThemeProvider";
import WebGLFallback from "./WebGLFallback";
import AbstractObject from "./AbstractObject";
import ParticleField from "./ParticleField";

interface HeroSceneProps {
  mouseNormalized?: { x: number; y: number };
  scrollProgress?: number;
  mouseRef?: RefObject<{ x: number; y: number }>;
  scrollProgressRef?: RefObject<number>;
  isInView?: boolean;
}

function CameraRig({
  mouseNormalized,
  scrollProgress,
  mouseRef,
  scrollProgressRef,
}: HeroSceneProps) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    const mx = mouseRef?.current ? mouseRef.current.x : mouseNormalized?.x ?? 0;
    const my = mouseRef?.current ? mouseRef.current.y : mouseNormalized?.y ?? 0;
    const sp = scrollProgressRef?.current !== undefined ? scrollProgressRef.current : scrollProgress ?? 0;

    // Subtle camera movement based on mouse
    const targetX = mx * 0.5;
    const targetY = my * 0.3;
    const targetZ = 5 + sp * 2;

    // Refresh-rate-independent damping (calibrated to 60fps base rate)
    // Avoids twitchy motion or overshooting on 120Hz/144Hz displays
    const dampFactor = 1 - Math.exp(-3.1 * Math.min(delta, 0.1));

    camera.position.x += (targetX - camera.position.x) * dampFactor;
    camera.position.y += (targetY - camera.position.y) * dampFactor;
    camera.position.z += (targetZ - camera.position.z) * dampFactor;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene({
  isInView = true,
  mouseRef,
  scrollProgressRef,
  mouseNormalized = { x: 0, y: 0 },
  scrollProgress = 0,
}: HeroSceneProps) {
  const { theme } = useThemeContext();

  const dprMax =
    typeof window !== "undefined"
      ? window.innerWidth < 768
        ? Math.min(window.devicePixelRatio ?? 1, 1.5)
        : Math.min(window.devicePixelRatio ?? 1, 1.75)
      : 1;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <Suspense fallback={<WebGLFallback theme={theme} />}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          frameloop={isInView ? "always" : "never"}
          dpr={[1, dprMax]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <CameraRig
            mouseNormalized={mouseNormalized}
            scrollProgress={scrollProgress}
            mouseRef={mouseRef}
            scrollProgressRef={scrollProgressRef}
          />

          {/* Lighting */}
          <ambientLight intensity={theme === "dark" ? 0.2 : 0.5} />
          <pointLight
            position={[5, 5, 5]}
            intensity={theme === "dark" ? 1.5 : 0.8}
            color={theme === "dark" ? "#b79cff" : "#ffffff"}
          />
          <pointLight
            position={[-5, -3, -5]}
            intensity={theme === "dark" ? 0.8 : 0.3}
            color={theme === "dark" ? "#8fffd1" : "#ffd1b3"}
          />

          {/* Main abstract object */}
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
            <AbstractObject
              theme={theme}
              mouseNormalized={mouseNormalized}
              mouseRef={mouseRef}
            />
          </Float>

          {/* Particle field */}
          <ParticleField
            theme={theme}
            mouseNormalized={mouseNormalized}
            mouseRef={mouseRef}
            count={typeof window !== "undefined" && window.innerWidth < 768 ? 250 : 600}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
