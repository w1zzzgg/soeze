"use client";

import { useRef, useEffect, useState, Suspense } from "react";
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
  const headlineRef = useRef<HTMLDivElement>(null);
  const subtextRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [scrollProgress, setScrollProgress] = useState(0);
  const [webglLoaded, setWebglLoaded] = useState(false);

  // Mouse tracking
  useEffect(() => {
    if (reducedMotion) return;
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, [reducedMotion]);

  // Scroll progress
  useEffect(() => {
    if (reducedMotion) return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: heroRef.current,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => setScrollProgress(self.progress),
    });
    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [reducedMotion]);

  // Page load entrance animation
  useEffect(() => {
    if (reducedMotion) {
      setWebglLoaded(true);
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const tl = gsap.timeline({ delay: 0.2 });

    // Headline assembles line by line
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

    // Subtext
    if (subtextRef.current) {
      tl.fromTo(
        subtextRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.3"
      );
    }

    // WebGL fades in
    tl.call(() => setWebglLoaded(true), undefined, "-=0.5");

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  const parallaxStyle = !reducedMotion
    ? { transform: `translateY(${scrollProgress * 60}px)` }
    : {};

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
          <HeroScene mouseNormalized={mouse} scrollProgress={scrollProgress} />
        ) : (
          <WebGLFallback theme={theme} />
        )}
      </div>

      {/* Content */}
      <div className={`container ${styles.content}`}>

        {/* Headline */}
        <div ref={headlineRef} className={styles.headline} style={parallaxStyle}>
          {siteConfig.hero.headline.map((line, i) => (
            <div key={i} className={styles.lineWrapper}>
              <div className={`${styles.line} text-hero`}>{line}</div>
            </div>
          ))}
        </div>

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

        {/* Scroll indicator */}
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollLine} />
          <span className={styles.scrollLabel}>SCROLL</span>
        </div>
      </div>
    </section>
  );
}
