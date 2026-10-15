"use client";

import { useRef, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/site-config";
import { useThemeContext } from "@/components/ui/ThemeProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import MagneticButton from "@/components/ui/MagneticButton";
import WebGLFallback from "@/components/webgl/WebGLFallback";
import styles from "./Hero.module.css";

// Dynamically import WebGL with SSR disabled to avoid window is not defined
const HeroScene = dynamic(() => import("@/components/webgl/HeroScene"), {
  ssr: false,
  loading: () => <WebGLFallback theme="light" />,
});

export default function Hero() {
  const { theme } = useThemeContext();
  const reducedMotion = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);

  // Cadence-aware mutable refs (avoids 100+ React re-renders per second on mousemove/scroll)
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollProgressRef = useRef(0);

  const [webglLoaded, setWebglLoaded] = useState(Boolean(reducedMotion));
  const [isInView, setIsInView] = useState(true);

  // Mouse tracking — direct ref mutation with zero React reconciliation overhead
  useEffect(() => {
    if (reducedMotion) return;
    const handleMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [reducedMotion]);

  // Viewport intersection observer to pause WebGL rendering when hero is offscreen
  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && !document.hidden);
      },
      { rootMargin: "100px 0px" }
    );

    observer.observe(heroEl);

    const handleVisibility = () => {
      if (document.hidden) {
        setIsInView(false);
      } else {
        const rect = heroEl.getBoundingClientRect();
        setIsInView(rect.bottom > 0 && rect.top < window.innerHeight);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // GSAP Animations and Parallax Scroll with scoped context
  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Parallax scroll on headline using direct GPU transform (no React state updates)
      if (headlineRef.current && heroRef.current) {
        gsap.to(headlineRef.current, {
          y: 60,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress;
            },
          },
        });
      }

      // Entrance animation
      const tl = gsap.timeline({ delay: 0.2 });

      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll(`.${styles.line}`);
        tl.fromTo(
          lines,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 1,
            ease: "power4.out",
          }
        );
      }

      if (subtextRef.current) {
        tl.fromTo(
          subtextRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.3"
        );
      }

      tl.call(() => setWebglLoaded(true), undefined, "-=0.5");
    }, heroRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={heroRef}
      className={styles.hero}
      aria-label="Hero section"
    >
      {/* WebGL visual layer */}
      <div
        className={styles.webglContainer}
        style={{
          opacity: webglLoaded ? 1 : 0,
          transition: "opacity 1s ease",
        }}
      >
        {!reducedMotion ? (
          <HeroScene
            isInView={isInView}
            mouseRef={mouseRef}
            scrollProgressRef={scrollProgressRef}
          />
        ) : (
          <WebGLFallback theme={theme} />
        )}
      </div>

      {/* Content */}
      <div className={`container ${styles.content}`}>

        {/* Headline */}
        <h1 ref={headlineRef} className={styles.headline}>
          {siteConfig.hero.headline.map((line, i) => (
            <div key={i} className={styles.lineWrapper}>
              <div className={`${styles.line} text-hero`}>{line}</div>
            </div>
          ))}
        </h1>

        {/* Subtext + CTA */}
        <div ref={subtextRef} className={styles.subtext} style={{ opacity: 0 }}>
          <p className={`text-body ${styles.subtextCopy}`}>
            {siteConfig.hero.subtext}
          </p>
          <MagneticButton
            href={siteConfig.hero.cta.href}
            className={`btn ${styles.heroCta}`}
            strength={0.3}
            dataCursor="view"
          >
            <span>{siteConfig.hero.cta.label} ↗</span>
          </MagneticButton>
        </div>

      </div>

      {/* Scroll indicator */}
      <div className={styles.scrollIndicator} aria-hidden="true">
        <div className={styles.scrollLine} />
        <span className={styles.scrollLabel}>SCROLL</span>
      </div>
    </section>
  );
}
