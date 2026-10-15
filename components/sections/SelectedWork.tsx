"use client";

import { useRef } from "react";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import IdeationCards from "@/components/ideation/IdeationCards";
import styles from "./SelectedWork.module.css";

export default function SelectedWork() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.work}`}
      id="what-if"
      aria-label="Ideation and open possibilities section"
    >
      {/* Fallback anchor for backward compatibility */}
      <span id="work" className={styles.anchorOffset} aria-hidden="true" />

      <div className="container">
        {/* Technical Section Label */}
        <SectionLabel index=" 05 ">
          — IDEATION / OPEN POSSIBILITIES
        </SectionLabel>

        {/* Section Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.mainHeading}>WHAT IF?</h2>
            <p className={styles.supportingCopy}>
              A collection of ideas, possible futures, and things we think should exist.
            </p>
          </div>

          <div className={styles.headerRight}>
            <MagneticButton
              href="/work"
              className={`btn ${styles.ctaBtn}`}
              strength={0.25}
              ariaLabel="No limits. Just possibilities."
              dataCursor="hover"
            >
              <span>NO LIMITS. JUST POSSIBILITIES. ↗</span>
            </MagneticButton>
          </div>
        </div>

        {/* Three-Card Grid with Interactive Concept Modal */}
        <IdeationCards gridId="ideation-grid" />
      </div>
    </section>
  );
}
