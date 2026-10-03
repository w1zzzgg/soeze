"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { incrementVisitCount, ANALYTICS_CONFIG } from "@/lib/visitor-counter";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./VisitorCounter.module.css";

function formatCount(num: number): string {
  // Format as 6 digits with leading zeros and comma, e.g. 001,284
  const padded = Math.round(num).toString().padStart(6, "0");
  return `${padded.slice(0, 3)},${padded.slice(3)}`;
}

export default function VisitorCounter({ className = "" }: { className?: string }) {
  const reducedMotion = useReducedMotion();
  const numRef = useRef<HTMLSpanElement>(null);
  const [targetCount, setTargetCount] = useState<number>(ANALYTICS_CONFIG.baselineCount);
  const animatedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    incrementVisitCount().then((count) => {
      if (!mounted) return;
      setTargetCount(count);

      if (animatedRef.current) return;
      animatedRef.current = true;

      if (reducedMotion) {
        if (numRef.current) {
          numRef.current.textContent = formatCount(count);
        }
        return;
      }

      const counterObj = { val: Math.max(0, count - 150) };
      gsap.to(counterObj, {
        val: count,
        duration: 1.4,
        ease: "power2.out",
        onUpdate: () => {
          if (numRef.current) {
            numRef.current.textContent = formatCount(counterObj.val);
          }
        },
      });
    });

    return () => {
      mounted = false;
    };
  }, [reducedMotion]);

  return (
    <div
      className={`${styles.counter} ${className}`}
      role="status"
      aria-label={`Visitor count: ${formatCount(targetCount)}`}
      title="[REPLACE_ME — CONNECT VISITOR ANALYTICS] Total website visits"
      data-cursor="hover"
    >
      <span className={styles.indicator} aria-hidden="true" />
      <span className={styles.label}>VISITS</span>
      <span ref={numRef} className={styles.number}>
        {formatCount(targetCount)}
      </span>
    </div>
  );
}
