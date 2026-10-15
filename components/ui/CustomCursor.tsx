"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useThemeContext } from "./ThemeProvider";
import styles from "./CustomCursor.module.css";

type CursorState =
  | "default"
  | "hover"
  | "view"
  | "drag"
  | "external"
  | "select"
  | "open";

export default function CustomCursor() {
  const { theme } = useThemeContext();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<CursorState>("default");
  const [isInverted, setIsInverted] = useState(false);

  useEffect(() => {
    // Hide on touch devices or reduced motion
    if (
      typeof window !== "undefined" &&
      (window.matchMedia("(hover: none)").matches ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    // Use gsap.quickTo for instant 120Hz/144Hz tracking with zero GC tween churn
    const xToRing = gsap.quickTo(ring, "x", { duration: 0.28, ease: "power2.out" });
    const yToRing = gsap.quickTo(ring, "y", { duration: 0.28, ease: "power2.out" });
    const xToLabel = label ? gsap.quickTo(label, "x", { duration: 0.22, ease: "power2.out" }) : null;
    const yToLabel = label ? gsap.quickTo(label, "y", { duration: 0.22, ease: "power2.out" }) : null;

    const handleMove = (e: MouseEvent) => {
      // Dot follows instantly
      gsap.set(dot, { x: e.clientX, y: e.clientY });

      // Ring and label track with smooth cadence-aware interpolation
      xToRing(e.clientX);
      yToRing(e.clientY);

      if (xToLabel && yToLabel) {
        xToLabel(e.clientX);
        yToLabel(e.clientY);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check for inverted background sections when in light mode
      if (theme === "light") {
        const invertedContainer = target.closest(
          "footer, [class*='contact'], [data-invert-cursor]"
        );
        setIsInverted(Boolean(invertedContainer));
      } else {
        setIsInverted(false);
      }

      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorEl?.dataset?.cursor) {
        const type = cursorEl.dataset.cursor as CursorState;
        setState(type);
        gsap.to(ring, { scale: 1.6, duration: 0.25, ease: "power2.out", overwrite: "auto" });
        gsap.to(dot, { scale: 0, opacity: 0, duration: 0.2, overwrite: "auto" });
        return;
      }

      const isInteractive = target.closest("a, button, [role='button'], input, textarea");
      if (isInteractive) {
        setState("hover");
        gsap.to(ring, { scale: 1.35, duration: 0.25, ease: "power2.out", overwrite: "auto" });
        gsap.to(dot, { scale: 0.6, duration: 0.2, overwrite: "auto" });
      }
    };

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = target.closest("a, button, [role='button'], [data-cursor], input, textarea");
      if (isInteractive) {
        setState("default");
        gsap.to(ring, { scale: 1, duration: 0.3, ease: "power2.out", overwrite: "auto" });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.25, overwrite: "auto" });
      }
    };

    const handleMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2, overwrite: "auto" });
    };

    const handleMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2, overwrite: "auto" });
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleMouseOver, { passive: true });
    window.addEventListener("mouseout", handleMouseOut, { passive: true });
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      gsap.killTweensOf([dot, ring]);
      if (label) gsap.killTweensOf(label);
    };
  }, [theme]);

  const labels: Record<CursorState, string> = {
    default: "",
    hover: "",
    view: "VIEW ↗",
    drag: "DRAG",
    external: "↗",
    select: "SELECT",
    open: "OPEN",
  };

  const showLabel = state !== "default" && state !== "hover" && labels[state];

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.dot} ${isInverted ? styles.invertedDot : ""}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`${styles.ring} ${isInverted ? styles.invertedRing : ""}`}
        aria-hidden="true"
      >
        {showLabel && (
          <div
            ref={labelRef}
            className={`${styles.label} ${isInverted ? styles.invertedLabel : ""}`}
          >
            {labels[state]}
          </div>
        )}
      </div>
    </>
  );
}
