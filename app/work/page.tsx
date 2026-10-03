import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import SectionLabel from "@/components/ui/SectionLabel";
import Contact from "@/components/sections/Contact";
import styles from "./work.module.css";

export const metadata: Metadata = {
  title: `Work — ${siteConfig.name}`,
  description: `Selected work and experiments by ${siteConfig.name}.`,
};

const CARD_ACCENTS = [
  "var(--accent-lavender)",
  "var(--accent-mint)",
  "var(--accent-pink)",
  "var(--accent-blue)",
  "var(--accent-yellow)",
];

export default function WorkPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      {/* Header */}
      <section className={`section ${styles.header}`}>
        <div className="container">
          <SectionLabel index="01">SELECTED EXPERIMENTS</SectionLabel>
          <div className={styles.headline}>
            <div className="text-display">ALL WORK</div>
            <p className={`text-body ${styles.headlineDesc}`}>
              A collection of digital experiments, client work, and things built
              for fun. Not all of it is finished. That's the point.
            </p>
          </div>
        </div>
      </section>

      {/* Project grid */}
      <section className={`section ${styles.projectSection}`}>
        <div className="container">
          <div className={styles.grid}>
            {siteConfig.projects.map((project, i) => (
              <div key={project.index} className={styles.card}>
                {/* Image/placeholder */}
                <div
                  className={styles.cardImage}
                  style={{ backgroundColor: CARD_ACCENTS[i % CARD_ACCENTS.length] }}
                >
                  {/* REPLACE_ME: Replace with real project image */}
                  <div className={styles.imagePlaceholder}>
                    <span className={styles.placeholderTag}>REPLACE_ME</span>
                    <span className={styles.projectNum}>{project.index}</span>
                  </div>
                  <div className={styles.cardOverlay}>
                    <span className={styles.viewLabel}>VIEW PROJECT ↗</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.cardHeader}>
                    <div>
                      <span className={styles.cardIndex}>{project.index}</span>
                      <div className={styles.cardTitle}>{project.title}</div>
                      <div className={styles.cardCategory}>{project.category}</div>
                    </div>
                    <span className={styles.cardYear}>{project.year}</span>
                  </div>
                  <p className={styles.cardDesc}>{project.description}</p>

                  {project.url && !project.url.startsWith("REPLACE_ME") && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.cardLink}
                    >
                      VISIT ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Contact />
    </div>
  );
}
