/* eslint-disable react-hooks/purity */
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleFieldProps {
  theme: "light" | "dark";
  mouseNormalized?: { x: number; y: number };
  mouseRef?: React.RefObject<{ x: number; y: number }>;
  count?: number;
}

export default function ParticleField({
  theme,
  mouseNormalized,
  mouseRef,
  count = 600,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette =
      theme === "dark"
        ? [
            new THREE.Color("#b79cff"),
            new THREE.Color("#8fffd1"),
            new THREE.Color("#78d9ff"),
            new THREE.Color("#e5ff65"),
          ]
        : [
            new THREE.Color("#c9b8ff"),
            new THREE.Color("#bdeccf"),
            new THREE.Color("#a9d8ff"),
            new THREE.Color("#ffb7c5"),
          ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Spherical distribution
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    return { positions, colors };
  }, [count, theme]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    const t = clock.getElapsedTime();

    const mx = mouseRef?.current ? mouseRef.current.x : mouseNormalized?.x ?? 0;
    const my = mouseRef?.current ? mouseRef.current.y : mouseNormalized?.y ?? 0;

    // Gentle rotation + mouse influence (time-based, refresh-rate independent)
    pointsRef.current.rotation.y = t * 0.04 + mx * 0.08;
    pointsRef.current.rotation.x = t * 0.02 + my * 0.05;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={theme === "dark" ? 0.025 : 0.02}
        vertexColors
        transparent
        opacity={theme === "dark" ? 0.85 : 0.6}
        sizeAttenuation
      />
    </points>
  );
}
