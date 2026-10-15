import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import SectionLabel from "@/components/ui/SectionLabel";
import IdeationCards from "@/components/ideation/IdeationCards";
import Contact from "@/components/sections/Contact";
import MagneticButton from "@/components/ui/MagneticButton";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: "What If? — Ideation & Open Possibilities",
  description:
    "A collection of ideas, possible futures, and things we think should exist.",
  alternates: {
    canonical: "/work",
  },
  openGraph: {
    title: `What If? — Ideation & Open Possibilities — ${siteConfig.name}`,
    description:
      "A collection of ideas, possible futures, and things we think should exist.",
    url: `${siteConfig.url}/work`,
  },
};

export default function WorkPage() {
  return (
    <div className={styles.workPage}>
      {/* Page Header */}
      <section className={`section ${styles.header}`} aria-label="Ideation introduction">
        <div className="container">
          <div className={styles.headerMetaRow}>
            <SectionLabel index=" 05 ">
              — IDEATION / OPEN POSSIBILITIES
            </SectionLabel>

            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>STATUS: SPECULATIVE HORIZON</span>
            </div>
          </div>

          <div className={styles.headline}>
            <h1 className={styles.mainTitle}>WHAT IF?</h1>
            <p className={styles.headlineDesc}>
              A collection of ideas, possible futures, and things we think should exist.
            </p>
          </div>
        </div>
      </section>

      {/* Responsive Ideation Grid */}
      <section className={`section ${styles.ideationSection}`} aria-label="Speculative concepts">
        <div className="container">
          <div className={styles.sectionNotice}>
            <span className={styles.noticeText}>
              [ 03 THOUGHT VECTORS // CLICK ANY CONCEPT TO EXPAND DEBRIEF ]
            </span>
            <span className={styles.noticeText}>
              SPECULATIVE R&amp;D
            </span>
          </div>

          {/* Reusable Three-Card Grid with Interactive Concept Panel Modal */}
          <IdeationCards gridId="work-ideation-grid" />
        </div>
      </section>

      {/* Closing Statement & Manifesto Section */}
      <section className={`section ${styles.closingSection}`} aria-label="Closing statement">
        <div className="container">
          <div className={styles.closingContainer}>
            <span className={styles.closingLabel}>
              {"// THE STANCE // SPECULATIVE R&D"}
            </span>

            <h2 className={styles.closingStatement}>
              NO LIMITS. JUST POSSIBILITIES.
            </h2>

            <p className={styles.closingCopy}>
              We believe breakthroughs do not start from safe briefs or commoditized templates.
              They emerge from raw curiosity, asking unconstrained questions, and having the
              technical courage to build what does not yet exist.
            </p>

            <div className={styles.closingActions}>
              <MagneticButton
                href="#contact"
                className={styles.primaryCta}
                strength={0.25}
                dataCursor="hover"
              >
                <span>LET&apos;S TALK ABOUT AN IDEA ↗</span>
              </MagneticButton>

              <MagneticButton
                href="/#lab"
                className={styles.secondaryCta}
                strength={0.25}
                dataCursor="hover"
              >
                <span>EXPLORE THE LAB &amp; UNO GAME ↗</span>
              </MagneticButton>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
