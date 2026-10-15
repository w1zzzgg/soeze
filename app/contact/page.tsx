import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import Contact from "@/components/sections/Contact";
import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${siteConfig.name}. Let's make something weird.`,
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: `Contact — ${siteConfig.name}`,
    description: `Get in touch with ${siteConfig.name}. Let's make something weird.`,
    url: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      {/* Page header */}
      <section className={`section ${styles.header}`}>
        <div className="container">
          <SectionLabel index="01">LET&apos;S TALK</SectionLabel>
          <div className={styles.headline}>
            <h1 className="text-display">CONTACT</h1>
            <div className={styles.headlineRight}>
              <p className={`text-body ${styles.desc}`}>
                Have a project in mind? Want to collaborate?
                <br />
                Just want to say hello? I&apos;m all of those.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact form section */}
      <Contact />
    </div>
  );
}
