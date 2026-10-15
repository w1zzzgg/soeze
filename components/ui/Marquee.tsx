"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import styles from "./Marquee.module.css";

interface MarqueeProps {
  items: string[];
  direction?: "forward" | "reverse";
  speed?: number;
  className?: string;
  accent?: string;
}

export default function Marquee({
  items,
  direction = "forward",
  speed = 40,
  className = "",
  accent,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);

  // Duplicate items 4× to ensure there is always enough content to
  // fill the viewport without any visible gap during the loop
  const repeated = [...items, ...items, ...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number;
    let resetTimeout: ReturnType<typeof setTimeout>;

    const wrapper = track.parentElement;
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const init = () => {
      // Kill any running animation before re-initialising
      animRef.current?.kill();
      gsap.set(track, { x: 0 });

      // Measure after layout — the track must be fully rendered
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth === 0) {
        // If layout hasn't completed yet, retry on the next frame
        rafId = requestAnimationFrame(init);
        return;
      }

      if (prefersReducedMotion) {
        return;
      }

      const duration = halfWidth / speed;

      animRef.current = gsap.fromTo(
        track,
        { x: direction === "reverse" ? -halfWidth : 0 },
        {
          x: direction === "reverse" ? 0 : -halfWidth,
          duration,
          ease: "none",
          repeat: -1,
        }
      );
    };

    // Schedule after a frame so the DOM is painted
    rafId = requestAnimationFrame(init);

    // Pause animation when offscreen to conserve GPU and CPU frame budget
    let observer: IntersectionObserver | null = null;
    if (wrapper && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (animRef.current) {
              if (entry.isIntersecting && !document.hidden && !prefersReducedMotion) {
                animRef.current.play();
              } else {
                animRef.current.pause();
              }
            }
          });
        },
        { rootMargin: "150px 0px" }
      );
      observer.observe(wrapper);
    }

    // Scroll-velocity interaction: throttled to animation frames
    let lastScrollY = window.scrollY;
    let scrollScheduled = false;

    const handleScroll = () => {
      if (scrollScheduled || prefersReducedMotion) return;
      scrollScheduled = true;

      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const velocity = Math.abs(currentScrollY - lastScrollY);
        const multiplier = Math.min(1 + velocity * 0.02, 3);
        lastScrollY = currentScrollY;

        if (animRef.current && animRef.current.isActive()) {
          animRef.current.timeScale(
            direction === "forward" ? multiplier : -multiplier
          );
        }

        // Return to normal speed 200ms after scrolling stops
        clearTimeout(resetTimeout);
        resetTimeout = setTimeout(() => {
          if (animRef.current && animRef.current.isActive()) {
            gsap.to(animRef.current, {
              timeScale: direction === "forward" ? 1 : -1,
              duration: 0.5,
              ease: "power2.out",
            });
          }
        }, 200);

        scrollScheduled = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      animRef.current?.kill();
      observer?.disconnect();
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(resetTimeout);
    };
  }, [direction, speed]);

  return (
    <div className={`marquee-wrapper ${styles.wrapper} ${className}`}>
      <div ref={trackRef} className={`marquee-track ${styles.track}`}>
        {repeated.map((item, i) => (
          <span key={i} className={`marquee-item ${styles.item}`}>
            {item}
            <span
              className={styles.dot}
              style={accent ? { color: accent } : {}}
            >
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
