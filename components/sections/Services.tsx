"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/site-config";
import SectionLabel from "@/components/ui/SectionLabel";
import { useThemeContext } from "@/components/ui/ThemeProvider";
import styles from "./Services.module.css";

const LIGHT_ACCENT_COLORS = [
  "var(--accent-lavender)",
  "var(--accent-mint)",
  "var(--accent-blue)",
  "var(--accent-pink)",
  "var(--accent-yellow)",
];

const DARK_ACCENT_COLORS = [
  "rgba(183, 156, 255, 0.12)",
  "rgba(143, 255, 209, 0.10)",
  "rgba(120, 217, 255, 0.10)",
  "rgba(255, 107, 107, 0.10)",
  "rgba(229, 255, 101, 0.10)",
];

export default function Services() {
  const { theme } = useThemeContext();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    rowRefs.current.forEach((row, i) => {
      if (!row) return;
      gsap.fromTo(
        row,
        { x: i % 2 === 0 ? -40 : 40, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const handleRowHover = (index: number, entering: boolean) => {
    if (entering) {
      setActiveIndex(index);
      const row = rowRefs.current[index];
      if (!row) return;
      gsap.to(row.querySelector(`.${styles.rowDetails}`), {
        height: "auto",
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.to(row.querySelector(`.${styles.rowArrow}`), {
        x: 8,
        rotate: -45,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      setActiveIndex(null);
      const row = rowRefs.current[index];
      if (!row) return;
      gsap.to(row.querySelector(`.${styles.rowDetails}`), {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
      gsap.to(row.querySelector(`.${styles.rowArrow}`), {
        x: 0,
        rotate: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.services}`}
      id="services"
      aria-label="Services section"
    >
      <div className="container">
        <SectionLabel index="04">SERVICES</SectionLabel>
        <div className={styles.header}>
          <div className="text-display">WHAT I DO</div>
        </div>
      </div>

      <div className={styles.rows}>
        {siteConfig.services.map((service, i) => (
          <div
            key={service.index}
            ref={(el) => { rowRefs.current[i] = el; }}
            className={styles.row}
            onMouseEnter={() => handleRowHover(i, true)}
            onMouseLeave={() => handleRowHover(i, false)}
            style={{
              backgroundColor:
                activeIndex === i
                  ? theme === "dark"
                    ? DARK_ACCENT_COLORS[i]
                    : LIGHT_ACCENT_COLORS[i]
                  : "transparent",
            }}
            role="listitem"
          >
            <div className="container">
              <div className={styles.rowInner}>
                {/* Index */}
                <span className={styles.rowIndex}>{service.index}</span>

                {/* Title area */}
                <div className={styles.rowTitle}>
                  <div className={styles.rowTitleText}>
                    {service.title.split("\n").map((line, j) => (
                      <span key={j} className="text-headline">
                        {line}
                      </span>
                    ))}
                  </div>

                  {/* Expandable details */}
                  <div className={styles.rowDetails} style={{ height: 0, opacity: 0, overflow: "hidden" }}>
                    <p className={`text-body ${styles.rowDescription}`}>
                      {service.description}
                    </p>
                    <div className={styles.rowTags}>
                      {service.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Short label */}
                <div className={styles.rowShort}>{service.short}</div>

                {/* Arrow */}
                <div className={styles.rowArrow}>→</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
