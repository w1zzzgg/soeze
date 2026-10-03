"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import styles from "./SelectedWork.module.css";

const CARD_ACCENTS = [
  "var(--accent-lavender)",
  "var(--accent-mint)",
  "var(--accent-pink)",
  "var(--accent-blue)",
];

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      gsap.fromTo(
        card,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          delay: i * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.work}`}
      id="work"
      aria-label="Selected work section"
    >
      <div className="container">
        <SectionLabel index="03">SELECTED EXPERIMENTS</SectionLabel>

        <div className={styles.header}>
          <div className="text-display">SELECTED<br />WORK</div>
          <MagneticButton
            href="/work"
            className={`btn ${styles.allWorkBtn}`}
            strength={0.3}
          >
            <span>ALL WORK ↗</span>
          </MagneticButton>
        </div>

        <div className={styles.grid}>
          {siteConfig.projects.filter((p) => p.featured).map((project, i) => (
            <div
              key={project.index}
              ref={(el) => { cardsRef.current[i] = el; }}
              className={styles.card}
              data-cursor="open"
            >
              {/* Image/placeholder */}
              <div
                className={styles.cardImage}
                style={{ backgroundColor: CARD_ACCENTS[i % CARD_ACCENTS.length] }}
              >
                {/* REPLACE_ME: Replace with real project image */}
                <div className={styles.imagePlaceholder}>
                  <span className={styles.placeholderTag}>REPLACE_ME</span>
                  <span className={styles.placeholderLabel}>PROJECT IMAGE</span>
                  <span className={styles.projectNum}>{project.index}</span>
                </div>

                {/* Hover overlay */}
                <div className={styles.cardOverlay}>
                  <span className={styles.viewLabel}>VIEW PROJECT ↗</span>
                </div>
              </div>

              {/* Card metadata */}
              <div className={styles.cardMeta}>
                <div className={styles.cardLeft}>
                  <span className={styles.cardIndex}>{project.index}</span>
                  <div>
                    <div className={styles.cardTitle}>{project.title}</div>
                    <div className={styles.cardCategory}>{project.category}</div>
                  </div>
                </div>
                <div className={styles.cardRight}>
                  <span className={styles.cardYear}>{project.year}</span>
                  {project.url && !project.url.startsWith("REPLACE_ME") ? (
                    <Link href={project.url} className={styles.cardLink} target="_blank" rel="noopener noreferrer">
                      ↗
                    </Link>
                  ) : null}
                </div>
              </div>

              {/* Description */}
              <div className={styles.cardDescription}>
                <p className="text-body">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
