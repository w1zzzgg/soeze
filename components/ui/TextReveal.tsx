"use client";

import { useRef, useEffect, ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface TextRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: keyof React.JSX.IntrinsicElements;
  triggerOnce?: boolean;
}

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  stagger = 0.08,
  as: Tag = "div",
  triggerOnce = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = ref.current;
    if (!el) return;

    const lines = el.querySelectorAll(".reveal-line");

    gsap.fromTo(
      lines,
      { yPercent: 110, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger,
        delay,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: triggerOnce,
        },
      }
    );

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [delay, stagger, triggerOnce]);

  return (
    // @ts-ignore — dynamic tag
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

// Helper: wrap text in reveal-line divs
export function RevealLine({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div style={{ overflow: "hidden" }} className={className}>
      <div className="reveal-line">{children}</div>
    </div>
  );
}
