"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";
import { useThemeContext } from "@/components/ui/ThemeProvider";
import WebGLFallback from "./WebGLFallback";
import AbstractObject from "./AbstractObject";
import ParticleField from "./ParticleField";

interface HeroSceneProps {
  mouseNormalized: { x: number; y: number };
  scrollProgress: number;
}

function CameraRig({
  mouseNormalized,
  scrollProgress,
}: HeroSceneProps) {
  const { camera } = useThree();

  useFrame((_, delta) => {
    // Subtle camera movement based on mouse
    const targetX = mouseNormalized.x * 0.5;
    const targetY = mouseNormalized.y * 0.3;
    const targetZ = 5 + scrollProgress * 2;

    camera.position.x += (targetX - camera.position.x) * 0.05;
    camera.position.y += (targetY - camera.position.y) * 0.05;
    camera.position.z += (targetZ - camera.position.z) * 0.05;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

export default function HeroScene(props: HeroSceneProps) {
  const { theme } = useThemeContext();

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
          dpr={[1, typeof window !== "undefined" ? Math.min(window.devicePixelRatio ?? 1, 2) : 1]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <CameraRig {...props} />

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
              mouseNormalized={props.mouseNormalized}
            />
          </Float>

          {/* Particle field */}
          <ParticleField
            theme={theme}
            mouseNormalized={props.mouseNormalized}
            count={typeof window !== "undefined" && window.innerWidth < 768 ? 300 : 800}
          />
        </Canvas>
      </Suspense>
    </div>
  );
}
