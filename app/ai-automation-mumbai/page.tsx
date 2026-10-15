import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import Contact from "@/components/sections/Contact";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "AI Automation & Custom Agents in Mumbai",
  description:
    "Intelligent n8n workflow automation, custom AI chatbots, API integrations, and WhatsApp systems built for modern businesses in Mumbai, India.",
  alternates: {
    canonical: "/ai-automation-mumbai",
  },
  openGraph: {
    title: `AI Automation & Custom Agents in Mumbai — ${siteConfig.name}`,
    description:
      "Intelligent n8n workflow automation, custom AI chatbots, API integrations, and WhatsApp systems built for modern businesses in Mumbai, India.",
    url: `${siteConfig.url}/ai-automation-mumbai`,
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — AI Automation Services in Mumbai`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `AI Automation & Custom Agents in Mumbai — ${siteConfig.name}`,
    description:
      "Intelligent n8n workflow automation, custom AI chatbots, API integrations, and WhatsApp systems built for modern businesses in Mumbai, India.",
    images: [siteConfig.seo.ogImage],
  },
};

const FAQS = [
  {
    question: "What AI automation services does SOEZE provide in Mumbai?",
    answer:
      "SOEZE designs and deploys custom n8n workflows, API orchestrations, WhatsApp Business AI assistants, and intelligent document extraction pipelines for businesses in Mumbai and distributed teams globally.",
  },
  {
    question: "How do n8n and API workflow automations connect with existing tools?",
    answer:
      "Workflows connect directly via native REST/GraphQL APIs, webhooks, and secure database connections. We integrate platforms such as PostgreSQL, Google Sheets, Airtable, Slack, CRMs, and email gateways without disrupting current operations.",
  },
  {
    question: "Can SOEZE build custom WhatsApp and website AI chatbots?",
    answer:
      "Yes. We build conversational systems using the official WhatsApp Business API and custom web chat interfaces. These systems qualify inbound leads, answer operational queries from verified documentation, and route high-priority conversations to human team members.",
  },
  {
    question: "How are security, API credentials, and data privacy handled?",
    answer:
      "Workflows run on self-hosted or dedicated private cloud infrastructure. API keys and operational data remain strictly within your infrastructure and are never submitted to public model training datasets.",
  },
  {
    question: "What is the typical engagement process and timeline?",
    answer:
      "We begin with a technical audit to map high-friction bottlenecks, followed by schema design, sandbox testing, and production deployment. Focused standalone automations typically launch within one to three weeks.",
  },
];

const pageJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${siteConfig.url}/ai-automation-mumbai#service`,
      name: "AI Automation & Workflow Systems",
      serviceType: "AI Automation, Workflow Orchestration & Conversational AI",
      description:
        "Intelligent n8n workflow automation, API orchestration, custom conversational AI chatbots, and WhatsApp business automation systems engineered in Mumbai, India.",
      provider: {
        "@id": `${siteConfig.url}/#organization`,
      },
      areaServed: [
        {
          "@type": "City",
          name: "Mumbai",
        },
        {
          "@type": "Country",
          name: "India",
        },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "AI Automation Capabilities",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "n8n & Custom API Workflow Automation",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Conversational AI & WhatsApp Automation",
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "AI Agent Orchestration & Document Extraction",
            },
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteConfig.url}/ai-automation-mumbai#faq`,
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ],
};

export default function AiAutomationMumbaiPage() {
  return (
    <div className={styles.landingPage}>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />

      {/* ── 1. Hero / Header ────────────────────────────────────────────────── */}
      <section className={`section ${styles.header}`} aria-label="Regional capability header">
        <div className="container">
          <div className={styles.headerMetaRow}>
            <SectionLabel index=" 06 ">
              — REGIONAL CAPABILITY // MUMBAI, INDIA
            </SectionLabel>

            <div className={styles.statusIndicator}>
              <span className={styles.statusDot} aria-hidden="true" />
              <span>STATUS: AVAILABLE FOR SELECT COLLABORATIONS</span>
            </div>
          </div>

          <div className={styles.headline}>
            <h1 className={styles.mainTitle}>
              AI AUTOMATION &amp; WORKFLOWS IN MUMBAI.
            </h1>
            <p className={styles.leadText}>
              Intelligent systems that connect your software stack, eliminate repetitive
              manual operations, and orchestrate modern AI tools with rock-solid reliability.
              Engineered with precision for ambitious teams in Mumbai and beyond.
            </p>
          </div>

          <div className={styles.actionRow}>
            <MagneticButton
              href="#contact"
              className={styles.primaryCta}
              strength={0.25}
              dataCursor="hover"
            >
              <span>DISCUSS A WORKFLOW ↗</span>
            </MagneticButton>

            <MagneticButton
              href="/services"
              className={styles.secondaryCta}
              strength={0.25}
              dataCursor="hover"
            >
              <span>EXPLORE ALL SERVICES ↗</span>
            </MagneticButton>
          </div>
        </div>
      </section>

      {/* ── 2. Introduction & Methodology ─────────────────────────────────── */}
      <section className={`section ${styles.introSection}`} aria-label="Methodology">
        <div className="container">
          <div className={styles.introGrid}>
            <div>
              <SectionLabel index="01">APPROACH</SectionLabel>
              <h2 className={styles.introHeading}>
                NO FLUFF. JUST STREAMLINED OPERATIONS.
              </h2>
            </div>

            <div className={styles.introBody}>
              <p>
                Most growing businesses do not need speculative AI hype—they need operational
                clarity. When your team spends hours each week manually copying data between
                CRMs, answering the same repetitive customer inquiries, or parsing invoices,
                growth slows down.
              </p>
              <p>
                SOEZE designs, scripts, and deploys custom automation pipelines connecting your
                existing apps, databases, and APIs. We replace fragile manual handoffs with
                auditable, resilient background workflows.
              </p>
            </div>
          </div>

          {/* Pillars */}
          <div className={styles.pillarsGrid}>
            <div className={styles.pillarCard}>
              <span className={styles.pillarTag}>[ 01 // ARCHITECTURE ]</span>
              <h3 className={styles.pillarTitle}>API-FIRST ORCHESTRATION</h3>
              <p className={styles.pillarDesc}>
                Direct webhooks and REST/GraphQL integrations that trigger instantly across
                services without fragile browser scrapers or manual intervention.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <span className={styles.pillarTag}>[ 02 // PRIVACY &amp; CONTROL ]</span>
              <h3 className={styles.pillarTitle}>YOUR DATA, YOUR INFRASTRUCTURE</h3>
              <p className={styles.pillarDesc}>
                Workflows deployed on self-hosted n8n instances or dedicated cloud runtimes where
                your operational data and API tokens remain entirely under your control.
              </p>
            </div>

            <div className={styles.pillarCard}>
              <span className={styles.pillarTag}>[ 03 // SAFETY CONTROLS ]</span>
              <h3 className={styles.pillarTitle}>HUMAN-IN-THE-LOOP SAFEGUARDS</h3>
              <p className={styles.pillarDesc}>
                Critical actions, financial records, and high-value customer communications can
                include approval checkpoints in Slack or WhatsApp before triggering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Core Capabilities ─────────────────────────────────────────── */}
      <section className={`section ${styles.capabilitiesSection}`} aria-label="Core capabilities">
        <div className="container">
          <div className={styles.sectionHeader}>
            <SectionLabel index="02">DELIVERABLES</SectionLabel>
            <h2 className={styles.sectionTitle}>WHAT WE ACTUALLY BUILD</h2>
          </div>

          <div className={styles.capabilitiesGrid}>
            {/* Capability 1 */}
            <div className={styles.capabilityCard}>
              <div className={styles.capabilityTop}>
                <span className={styles.capabilityIndex}>01 // PIPELINES</span>
                <h3 className={styles.capabilityTitle}>n8n Workflow Automation</h3>
                <p className={styles.capabilityDesc}>
                  Automated pipelines connecting tools such as Airtable, Google Workspace,
                  PostgreSQL, Notion, and specialized industry CRMs. We configure robust error
                  handling, retries, and data validation rules so jobs never silently fail.
                </p>
              </div>
              <div className={styles.tagsWrapper}>
                <span className={styles.capabilityTag}>n8n</span>
                <span className={styles.capabilityTag}>Webhooks</span>
                <span className={styles.capabilityTag}>PostgreSQL</span>
                <span className={styles.capabilityTag}>Airtable</span>
                <span className={styles.capabilityTag}>Cron Jobs</span>
              </div>
            </div>

            {/* Capability 2 */}
            <div className={styles.capabilityCard}>
              <div className={styles.capabilityTop}>
                <span className={styles.capabilityIndex}>02 // MESSAGING</span>
                <h3 className={styles.capabilityTitle}>WhatsApp &amp; Website AI Assistants</h3>
                <p className={styles.capabilityDesc}>
                  Conversational agents connected to the official WhatsApp Business API or
                  embedded on your website. Trained on verified internal knowledge bases to
                  qualify prospects, schedule consultations, and resolve frequent questions.
                </p>
              </div>
              <div className={styles.tagsWrapper}>
                <span className={styles.capabilityTag}>WhatsApp Business API</span>
                <span className={styles.capabilityTag}>RAG Knowledge Bases</span>
                <span className={styles.capabilityTag}>Lead Qualification</span>
                <span className={styles.capabilityTag}>Multi-Channel</span>
              </div>
            </div>

            {/* Capability 3 */}
            <div className={styles.capabilityCard}>
              <div className={styles.capabilityTop}>
                <span className={styles.capabilityIndex}>03 // EXTRACTION</span>
                <h3 className={styles.capabilityTitle}>Document &amp; Invoice Processing</h3>
                <p className={styles.capabilityDesc}>
                  Intelligent parsing for PDFs, customer orders, vendor statements, and emails.
                  Extracts structured, type-checked JSON payloads ready for direct database
                  insertion, avoiding manual data re-entry.
                </p>
              </div>
              <div className={styles.tagsWrapper}>
                <span className={styles.capabilityTag}>Document AI</span>
                <span className={styles.capabilityTag}>Structured JSON</span>
                <span className={styles.capabilityTag}>Invoice Extraction</span>
                <span className={styles.capabilityTag}>OCR Pipelines</span>
              </div>
            </div>

            {/* Capability 4 */}
            <div className={styles.capabilityCard}>
              <div className={styles.capabilityTop}>
                <span className={styles.capabilityIndex}>04 // INTERFACES</span>
                <h3 className={styles.capabilityTitle}>Custom Internal Tooling &amp; Portals</h3>
                <p className={styles.capabilityDesc}>
                  Tailored, lightweight Next.js frontends and administrative dashboards that let
                  your operators monitor automated workflows, inspect execution logs, and run
                  batch actions with minimal learning curve.
                </p>
              </div>
              <div className={styles.tagsWrapper}>
                <span className={styles.capabilityTag}>Next.js</span>
                <span className={styles.capabilityTag}>Admin Portals</span>
                <span className={styles.capabilityTag}>Real-Time Telemetry</span>
                <span className={styles.capabilityTag}>API Controls</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Practical Business Use Cases ───────────────────────────────── */}
      <section className={`section ${styles.useCasesSection}`} aria-label="Business use cases">
        <div className="container">
          <div className={styles.sectionHeader}>
            <SectionLabel index="03">APPLICATIONS</SectionLabel>
            <h2 className={styles.sectionTitle}>PRACTICAL BUSINESS USE CASES</h2>
          </div>

          <div className={styles.useCasesGrid}>
            <div className={styles.useCaseCard}>
              <span className={styles.useCaseBadge}>CASE 01 // SALES OPERATIONS</span>
              <h3 className={styles.useCaseTitle}>Inbound Lead Routing &amp; Enrichment</h3>
              <p className={styles.useCaseDesc}>
                Incoming inquiries from website forms or ad campaigns are enriched with company
                intelligence, checked for duplicates, and dispatched instantly to WhatsApp or
                Slack with contextual notes for sales representatives.
              </p>
            </div>

            <div className={styles.useCaseCard}>
              <span className={styles.useCaseBadge}>CASE 02 // CUSTOMER SUPPORT</span>
              <h3 className={styles.useCaseTitle}>24/7 First-Line Triage &amp; FAQ Resolution</h3>
              <p className={styles.useCaseDesc}>
                Routine customer inquiries regarding pricing, order status, policies, and service
                coverage are answered immediately by AI agents, freeing your support team to
                handle high-priority, complex client issues.
              </p>
            </div>

            <div className={styles.useCaseCard}>
              <span className={styles.useCaseBadge}>CASE 03 // CLIENT ONBOARDING</span>
              <h3 className={styles.useCaseTitle}>Automated Intake &amp; Asset Collection</h3>
              <p className={styles.useCaseDesc}>
                Upon deal closure, the system automatically creates project folders, generates
                intake forms, triggers customized email sequences, and provisions account
                credentials without manual coordination delay.
              </p>
            </div>

            <div className={styles.useCaseCard}>
              <span className={styles.useCaseBadge}>CASE 04 // REPORTING &amp; AUDITS</span>
              <h3 className={styles.useCaseTitle}>Multi-Platform Analytics Aggregation</h3>
              <p className={styles.useCaseDesc}>
                Scheduled jobs pull daily campaign metrics, revenue numbers, and operational KPIs
                from multiple SaaS dashboards into a single consolidated Google Sheet or
                Slack executive briefing every morning.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. Technical Questions & Answers (AEO/GEO Optimized) ─────────── */}
      <section className={`section ${styles.faqSection}`} aria-label="Frequently asked questions">
        <div className="container">
          <div className={styles.sectionHeader}>
            <SectionLabel index="04">CLARITY</SectionLabel>
            <h2 className={styles.sectionTitle}>TECHNICAL QUESTIONS &amp; ARCHITECTURE</h2>
          </div>

          <div className={styles.faqGrid}>
            {FAQS.map((faq, i) => (
              <div key={i} className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>
                  [ {String(i + 1).padStart(2, "0")} ] — {faq.question}
                </h3>
                <p className={styles.faqAnswer}>{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Contextual Links & Breadcrumbs ─────────────────────────────── */}
      <section className={styles.contextSection} aria-label="Related studio sections">
        <div className="container">
          <div className={styles.contextRow}>
            <span className={styles.contextLabel}>
              EXPLORE SOEZE // CREATIVE TECHNOLOGY STUDIO
            </span>
            <div className={styles.contextLinks}>
              <Link href="/services" className={styles.contextLink}>
                All Services ↗
              </Link>
              <Link href="/work" className={styles.contextLink}>
                What If? R&amp;D ↗
              </Link>
              <Link href="/about" className={styles.contextLink}>
                About the Studio ↗
              </Link>
              <Link href="/contact" className={styles.contextLink}>
                Direct Contact ↗
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Direct Contact Form ────────────────────────────────────────── */}
      <Contact />
    </div>
  );
}
