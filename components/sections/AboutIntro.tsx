"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/site-config";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./AboutIntro.module.css";

export default function AboutIntro() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const lines = headlineRef.current?.querySelectorAll(`.${styles.headlineLine}`);
    if (lines) {
      gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          stagger: 0.1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headlineRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    if (bioRef.current) {
      gsap.fromTo(
        bioRef.current.querySelectorAll("p"),
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: bioRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section ref={sectionRef} className={`section ${styles.about}`} id="about" aria-label="About section">
      <div className="container">
        <SectionLabel index="02">ABOUT</SectionLabel>

        <div className={styles.grid}>
          {/* Left: Headline */}
          <div>
            <div ref={headlineRef} className={styles.headline}>
              {siteConfig.about.headline.map((line, i) => (
                <div key={i} className={styles.headlineWrapper}>
                  <div className={`${styles.headlineLine} text-display`}>
                    {line}
                  </div>
                </div>
              ))}
            </div>

            {/* Profile image */}
            {/* REPLACE_ME — PROFILE IMAGE */}
            <div className={styles.profileFrame} data-cursor="view">
              <div className={styles.profileInner}>
                <Image
                  src={siteConfig.profile.image}
                  alt={siteConfig.profile.imageAlt}
                  fill
                  sizes="(max-width: 768px) 240px, (max-width: 1200px) 300px, 320px"
                  className={styles.profileImg}
                  priority
                />
                <div className={styles.profileOverlay} />
              </div>
            </div>
          </div>

          {/* Right: Bio + Stats */}
          <div>
            <div ref={bioRef} className={styles.bio}>
              {siteConfig.about.bio.map((para, i) => (
                <p key={i} className={`text-body ${styles.bioPara}`}>
                  {para}
                </p>
              ))}
            </div>

            {/* Stats grid */}
            {/* REPLACE_ME: Update stats with real personal data */}
            <div className={styles.statsGrid}>
              {siteConfig.about.stats.map((stat, i) => (
                <div key={i} className={styles.statItem}>
                  <AnimatedNumber value={stat.value} label={stat.label} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
