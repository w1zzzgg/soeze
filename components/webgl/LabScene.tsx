/* eslint-disable react-hooks/purity */
"use client";

import { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useThemeContext } from "@/components/ui/ThemeProvider";

interface LabSceneProps {
  mouseNormalized: { x: number; y: number };
  burstTrigger?: number; // increments on user click
  burstOrigin?: { x: number; y: number };
}

function KineticField({
  mouseNormalized,
  burstTrigger = 0,
  burstOrigin = { x: 0, y: 0 },
  theme,
}: LabSceneProps & { theme: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const shockwaveRef = useRef({ radius: 0, maxRadius: 6, speed: 0, active: false, x: 0, y: 0 });
  const prevBurst = useRef(burstTrigger);

  const { isMobile, count } = useMemo(() => {
    const mobile = typeof window !== "undefined" && window.innerWidth < 768;
    return { isMobile: mobile, count: mobile ? 450 : 1100 };
  }, []);

  // Generate grid points with slight random variation
  const [positions, initialPositions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const init = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);

    const isDark = theme === "dark";
    const colorPalette = isDark
      ? [
          new THREE.Color("#b79cff"), // electric lavender
          new THREE.Color("#78d9ff"), // electric blue
          new THREE.Color("#8fffd1"), // mint
          new THREE.Color("#e5ff65"), // yellow
        ]
      : [
          new THREE.Color("#111111"), // near-black
          new THREE.Color("#4a3e80"), // deep purple
          new THREE.Color("#2563eb"), // cobalt
          new THREE.Color("#7c3aed"), // violet
        ];

    const rows = Math.floor(Math.sqrt(count * 1.5));
    const colsCount = Math.floor(count / rows);
    let idx = 0;

    for (let r = 0; r < rows && idx < count; r++) {
      for (let c = 0; c < colsCount && idx < count; c++) {
        const u = (c / (colsCount - 1) - 0.5) * 11;
        const v = (r / (rows - 1) - 0.5) * 6;
        const z = (Math.random() - 0.5) * 0.4;

        pos[idx * 3] = u + (Math.random() - 0.5) * 0.15;
        pos[idx * 3 + 1] = v + (Math.random() - 0.5) * 0.15;
        pos[idx * 3 + 2] = z;

        init[idx * 3] = pos[idx * 3];
        init[idx * 3 + 1] = pos[idx * 3 + 1];
        init[idx * 3 + 2] = z;

        const chosenCol = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        cols[idx * 3] = chosenCol.r;
        cols[idx * 3 + 1] = chosenCol.g;
        cols[idx * 3 + 2] = chosenCol.b;

        idx++;
      }
    }

    return [pos, init, cols];
  }, [count, theme]);

  // Handle click bursts
  useEffect(() => {
    if (burstTrigger !== prevBurst.current && burstTrigger > 0) {
      prevBurst.current = burstTrigger;
      shockwaveRef.current = {
        radius: 0.1,
        maxRadius: 7.5,
        speed: 12,
        active: true,
        x: burstOrigin.x * 5.5,
        y: burstOrigin.y * 3.0,
      };
    }
  }, [burstTrigger, burstOrigin]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;

    const geom = pointsRef.current.geometry;
    const posAttr = geom.attributes.position as THREE.BufferAttribute;
    const array = posAttr.array as Float32Array;

    const time = state.clock.getElapsedTime();
    const mouseX = mouseNormalized.x * 5.5;
    const mouseY = mouseNormalized.y * 3.0;

    const shock = shockwaveRef.current;
    if (shock.active) {
      shock.radius += shock.speed * delta;
      if (shock.radius > shock.maxRadius) {
        shock.active = false;
      }
    }

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const baseX = initialPositions[ix];
      const baseY = initialPositions[iy];

      // Subtle ambient wave breathing
      const ambientWave = Math.sin(time * 1.5 + baseX * 0.8 + baseY * 0.6) * 0.12;

      // Mouse displacement
      const dx = mouseX - baseX;
      const dy = mouseY - baseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const influenceRadius = isMobile ? 1.8 : 2.6;

      let dispX = 0;
      let dispY = 0;
      let dispZ = ambientWave;

      if (dist < influenceRadius) {
        const force = (1 - dist / influenceRadius) * 0.9;
        // Radial push with slight vortex twist
        dispX = -dx * force * 0.45 - dy * force * 0.3;
        dispY = -dy * force * 0.45 + dx * force * 0.3;
        dispZ += force * 0.6;
      }

      // Click shockwave expansion
      if (shock.active) {
        const sx = baseX - shock.x;
        const sy = baseY - shock.y;
        const sdist = Math.sqrt(sx * sx + sy * sy);
        const waveDelta = Math.abs(sdist - shock.radius);

        if (waveDelta < 1.2) {
          const waveStrength = (1 - waveDelta / 1.2) * (1 - shock.radius / shock.maxRadius);
          dispX += (sx / (sdist + 0.01)) * waveStrength * 2.0;
          dispY += (sy / (sdist + 0.01)) * waveStrength * 2.0;
          dispZ += Math.sin(waveDelta * Math.PI) * waveStrength * 1.5;
        }
      }

      // Smooth target interpolation (refresh-rate independent damping)
      const targetX = baseX + dispX;
      const targetY = baseY + dispY;
      const targetZ = dispZ;

      const lerpDamp = 1 - Math.exp(-7.5 * Math.min(delta, 0.1));
      array[ix] += (targetX - array[ix]) * lerpDamp;
      array[iy] += (targetY - array[iy]) * lerpDamp;
      array[iz] += (targetZ - array[iz]) * lerpDamp;
    }

    posAttr.needsUpdate = true;
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
        size={isMobile ? 0.06 : 0.08}
        vertexColors
        transparent
        opacity={theme === "dark" ? 0.85 : 0.75}
        sizeAttenuation
      />
    </points>
  );
}

export default function LabScene(props: LabSceneProps) {
  const { theme } = useThemeContext();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
      aria-hidden="true"
    >
      <Suspense fallback={null}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 55 }}
          dpr={[1, typeof window !== "undefined" ? Math.min(window.devicePixelRatio ?? 1, 2) : 1]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
        >
          <KineticField {...props} theme={theme} />
        </Canvas>
      </Suspense>
    </div>
  );
}
