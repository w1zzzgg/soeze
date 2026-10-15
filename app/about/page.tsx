import type { Metadata } from "next";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";
import SectionLabel from "@/components/ui/SectionLabel";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description: `About ${siteConfig.name} — Creative technologist working between design, technology, AI and the web.`,
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: `About — ${siteConfig.name}`,
    description: `About ${siteConfig.name} — Creative technologist working between design, technology, AI and the web.`,
    url: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <div className={styles.page} style={{ paddingTop: "var(--nav-height)" }}>
      {/* Hero */}
      <section className={`section ${styles.hero}`}>
        <div className="container">
          <SectionLabel index="01">ABOUT</SectionLabel>
          <h1 className={styles.heroHeadline}>
            {siteConfig.about.headline.map((line, i) => (
              <div key={i} className={`text-display ${styles.hline}`}>{line}</div>
            ))}
          </h1>
        </div>
      </section>

      {/* Bio + image */}
      <section className={`section ${styles.bioSection}`}>
        <div className="container">
          <div className={styles.bioGrid}>
            {/* Profile image */}
            {/* REPLACE_ME — PROFILE IMAGE */}
            <div className={styles.imageArea}>
              <div className={styles.imageFrame} data-cursor="view">
                <div className={styles.imageInner}>
                  <Image
                    src={siteConfig.profile.image}
                    alt={siteConfig.profile.imageAlt}
                    fill
                    sizes="(max-width: 768px) 260px, (max-width: 1200px) 320px, 340px"
                    className={styles.profileImg}
                    priority
                  />
                  <div className={styles.imageOverlay} />
                </div>
              </div>
              {/* REPLACE_ME: Replace with real name/handle */}
              <div className={styles.imageCaption}>
                <span>{siteConfig.profile.name}</span>
                <span className={styles.captionRole}>{siteConfig.profile.headline}</span>
              </div>
            </div>

            {/* Bio text */}
            <div className={styles.bioText}>
              {siteConfig.about.bio.map((para, i) => (
                <p key={i} className={`text-body ${styles.bioPara}`}>{para}</p>
              ))}

              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>BASED IN</span>
                  <span className={styles.infoValue}>MUMBAI, INDIA</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>AVAILABLE FOR</span>
                  <span className={styles.infoValue}>PROJECTS & COLLABS</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>CONTACT</span>
                  {/* REPLACE_ME: Replace with real email */}
                  <a href={`mailto:${siteConfig.email}`} className={styles.infoLink}>
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={`section ${styles.statsSection}`}>
        <div className="container">
          <div className={styles.statsGrid}>
            {/* REPLACE_ME: Update all stats with real data */}
            {siteConfig.about.stats.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <AnimatedNumber value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
