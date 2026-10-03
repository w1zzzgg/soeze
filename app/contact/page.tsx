import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import Contact from "@/components/sections/Contact";
import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: `Contact — ${siteConfig.name}`,
  description: `Get in touch with ${siteConfig.name}. Let's make something weird.`,
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      {/* Page header */}
      <section className={`section ${styles.header}`}>
        <div className="container">
          <SectionLabel index="01">LET'S TALK</SectionLabel>
          <div className={styles.headline}>
            <div className="text-display">CONTACT</div>
            <div className={styles.headlineRight}>
              <p className={`text-body ${styles.desc}`}>
                Have a project in mind? Want to collaborate?
                <br />
                Just want to say hello? I'm all of those.
              </p>
              {/* REPLACE_ME: Replace with real availability status */}
              <div className={styles.availability}>
                <span className={styles.availDot} />
                <span className={styles.availText}>
                  REPLACE_ME — AVAILABILITY STATUS
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form section */}
      <Contact />
    </div>
  );
}
