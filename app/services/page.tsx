import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import SectionLabel from "@/components/ui/SectionLabel";
import Services from "@/components/sections/Services";
import Contact from "@/components/sections/Contact";
import styles from "./services.module.css";

export const metadata: Metadata = {
  title: "Services",
  description: `Services offered by ${siteConfig.name} — AI automations, AI chatbots, AI ads, creative design, and digital marketing.`,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: `Services — ${siteConfig.name}`,
    description: `Services offered by ${siteConfig.name} — AI automations, AI chatbots, AI ads, creative design, and digital marketing.`,
    url: `${siteConfig.url}/services`,
  },
};

export default function ServicesPage() {
  return (
    <div style={{ paddingTop: "var(--nav-height)" }}>
      {/* Page header */}
      <section className={`section ${styles.header}`}>
        <div className="container">
          <SectionLabel index="01">WHAT I DO</SectionLabel>
          <div className={styles.headline}>
            <h1 className="text-display">SERVICES</h1>
            <p className={`text-body ${styles.headlineDesc}`}>
              A range of creative and technical services, each designed to make
              your digital presence actually worth looking at.
            </p>
          </div>
        </div>
      </section>

      {/* Services list — reusing the home section */}
      <Services />

      {/* Process section */}
      <section className={`section ${styles.process}`}>
        <div className="container">
          <SectionLabel index="02">HOW IT WORKS</SectionLabel>
          <div className={styles.processGrid}>
            {[
              { num: "01", title: "DISCOVER", desc: "We talk. I listen. We figure out what you actually need versus what you think you need." },
              { num: "02", title: "DESIGN", desc: "Concepts, layouts, direction. Nothing gets built until it looks right." },
              { num: "03", title: "BUILD", desc: "Clean code. Fast delivery. No filler." },
              { num: "04", title: "LAUNCH", desc: "We ship. You look good. The internet gets a little less boring." },
            ].map((step) => (
              <div key={step.num} className={styles.processItem}>
                <span className={styles.processNum}>{step.num}</span>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={`text-body ${styles.processDesc}`}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <Contact />
    </div>
  );
}
