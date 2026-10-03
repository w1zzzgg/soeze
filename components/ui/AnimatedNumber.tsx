"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface AnimatedNumberProps {
  value: string;
  label: string;
  className?: string;
}

export default function AnimatedNumber({
  value,
  label,
  className = "",
}: AnimatedNumberProps) {
  const valueRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = valueRef.current;
    const container = containerRef.current;
    if (!el || !container) return;

    // Only animate numeric values
    const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
    const isNumeric = !isNaN(numericValue) && value !== "∞" && value !== "24/7";

    if (!isNumeric) return;

    const obj = { val: 0 };
    const prefix = value.match(/^[^0-9]*/)?.[0] || "";
    const suffix = value.match(/[^0-9]*$/)?.[0] || "";

    ScrollTrigger.create({
      trigger: container,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: numericValue,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = prefix + Math.round(obj.val) + suffix;
          },
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [value]);

  return (
    <div ref={containerRef} className={`${className}`}>
      <div ref={valueRef} className="text-stat">
        {value}
      </div>
      <div
        className="text-label"
        style={{ color: "var(--fg-muted)", marginTop: "0.5rem", whiteSpace: "pre-line" }}
      >
        {label}
      </div>
    </div>
  );
}
