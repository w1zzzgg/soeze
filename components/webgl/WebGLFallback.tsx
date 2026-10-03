"use client";

// Static SVG fallback for when WebGL is not available
// (reduced motion, low-end devices, WebGL unsupported)

interface WebGLFallbackProps {
  theme: "light" | "dark";
}

const COLORS_LIGHT = ["#c9b8ff", "#bdeccf", "#a9d8ff", "#ffb7c5", "#fff0a8"];
const COLORS_DARK = ["#b79cff", "#8fffd1", "#78d9ff", "#ff6b6b", "#e5ff65"];

export default function WebGLFallback({ theme }: WebGLFallbackProps) {
  const colors = theme === "dark" ? COLORS_DARK : COLORS_LIGHT;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 600 600"
        width="100%"
        height="100%"
        style={{ maxWidth: "600px" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Concentric circles forming an abstract blob */}
        <circle cx="300" cy="300" r="220" fill={colors[0]} opacity="0.15" />
        <circle cx="300" cy="300" r="170" fill={colors[1]} opacity="0.2" />
        <circle cx="300" cy="300" r="120" fill={colors[2]} opacity="0.3" />
        <circle cx="300" cy="300" r="75" fill={colors[3]} opacity="0.4" />
        <circle cx="300" cy="300" r="40" fill={colors[4]} opacity="0.6" />

        {/* Scattered dots */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const r = 180 + Math.sin(i * 1.7) * 60;
          const x = 300 + Math.cos(angle) * r;
          const y = 300 + Math.sin(angle) * r;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={2 + Math.sin(i * 0.8) * 2}
              fill={colors[i % colors.length]}
              opacity="0.6"
            />
          );
        })}
      </svg>
    </div>
  );
}
