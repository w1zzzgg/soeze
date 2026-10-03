"use client";

import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import MagneticButton from "@/components/ui/MagneticButton";
import FooterWordmark from "@/components/layout/FooterWordmark";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      {/* Animated multilingual wordmark */}
      <FooterWordmark />

      <div className={styles.bottom}>
        {/* Tagline */}
        <div className={styles.tagline}>
          {siteConfig.footer.tagline.map((line, i) => (
            <div key={i} className={styles.taglineLine}>
              {line}
            </div>
          ))}
        </div>

        {/* Nav */}
        <nav aria-label="Footer navigation" className={styles.footerNav}>
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className={styles.footerLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Social + Copyright */}
        <div className={styles.meta}>
          <div className={styles.socialLinks}>
            {/* REPLACE_ME: Replace these placeholder social links with real URLs */}
            <MagneticButton
              href={siteConfig.social.github}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="GitHub — REPLACE_ME"
            >
              GH ↗
            </MagneticButton>
            <MagneticButton
              href={siteConfig.social.instagram}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="Instagram — REPLACE_ME"
            >
              IG ↗
            </MagneticButton>
            <MagneticButton
              href={siteConfig.social.linkedin}
              className={styles.socialLink}
              target="_blank"
              rel="noopener noreferrer"
              ariaLabel="LinkedIn — REPLACE_ME"
            >
              LI ↗
            </MagneticButton>
          </div>
          <span className={styles.copyright}>
            {siteConfig.footer.copyright} {siteConfig.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
