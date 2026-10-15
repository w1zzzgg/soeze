// =============================================================================
// SITE CONFIGURATION — SOEZE.TECH
// =============================================================================
// This is the single source of truth for all brand/content configuration.
// Changing the brand later should require minimal code changes — update here only.
//
// Search the project for "REPLACE_ME" to find all items needing real content.
// =============================================================================

export const siteConfig = {
  // ---------------------------------------------------------------------------
  // BRAND
  // ---------------------------------------------------------------------------
  name: "SOEZE",
  tagline: "SOEZE.TECH",
  domain: "soeze.tech",
  url: "https://soeze.tech",

  // REPLACE_ME: Update this description with the final site description
  description:
    "Creative technology studio. Digital experiences, AI automation, and things that make the internet a little less boring.",

  // REPLACE_ME: Update with final short description for hero metadata
  heroMetaDescription: "CREATIVE TECHNOLOGY / DIGITAL STUDIO",

  // ---------------------------------------------------------------------------
  // CONTACT
  // ---------------------------------------------------------------------------

  // REPLACE_ME: Replace with real email address
  email: "hello@soeze.tech",

  // REPLACE_ME: Replace with real form endpoint (e.g. Formspree, Resend, etc.)
  formEndpoint: "REPLACE_ME_FORM_ENDPOINT",

  // ---------------------------------------------------------------------------
  // LOGO
  // ---------------------------------------------------------------------------
  logo: {
    // REPLACE_ME: Set type to "image" and update src when final logo is ready
    type: "text" as "text" | "image",
    // REPLACE_ME: Replace with path to final logo image (e.g. "/logo.svg")
    src: "REPLACE_ME_LOGO_SRC",
    alt: "SOEZE logo",
    width: 120,
    height: 40,
  },

  // ---------------------------------------------------------------------------
  // PROFILE
  // ---------------------------------------------------------------------------
  profile: {
    // REPLACE_ME — PROFILE IMAGE
    image: "/images/profile/profile-current.jpg",
    imageAlt: "SOEZE — Creative Technologist",
    // REPLACE_ME: Replace with real name or handle
    name: "SOEZE",
    // REPLACE_ME: Replace with real bio headline
    headline: "Creative Technologist",
  },

  // ---------------------------------------------------------------------------
  // SOCIAL LINKS
  // ---------------------------------------------------------------------------
  social: {
    github: "https://github.com/w1zzzgg",
    linkedin: "https://www.linkedin.com/in/weezfr/",
    instagram: "https://www.instagram.com/_harsh03/",
    twitter: "[REPLACE_ME — SOCIAL URL]",
  },

  // ---------------------------------------------------------------------------
  // NAVIGATION
  // ---------------------------------------------------------------------------
  nav: [
    { label: "IDEATION", href: "/work" },
    { label: "ABOUT", href: "/about" },
    { label: "SERVICES", href: "/services" },
    { label: "CONTACT", href: "/contact" },
  ],

  // ---------------------------------------------------------------------------
  // HERO
  // ---------------------------------------------------------------------------
  hero: {
    headline: ["SO, WE BUILD", "INTERNET THINGS."],
    subtext:
      "Websites, AI experiments, automations, and whatever else catches our curiosity.",
    // REPLACE_ME: Update hero counter/index with real project count
    index: "001 / 026",
    cta: { label: "VIEW WORK", href: "/work" },
  },

  // ---------------------------------------------------------------------------
  // ABOUT
  // ---------------------------------------------------------------------------
  about: {
    headline: ["WHO", "AM", "I?"],
    bio: [
      "I'm a multidisciplinary creative working somewhere between design, technology, automation, AI, marketing and the web.",
      "I build things that are fast, strange, and intentional. I'm not interested in templates.",
    ],
    stats: [
      // REPLACE_ME: Update these stats with real personal data
      { value: "22", label: "YEARS", sublabel: null },
      { value: "∞", label: "IDEAS", sublabel: null },
      { value: "24/7", label: "CURIOUS", sublabel: null },
      { value: "0", label: "INTEREST IN\nBORING WEBSITES", sublabel: null },
    ],
  },

  // ---------------------------------------------------------------------------
  // SERVICES
  // ---------------------------------------------------------------------------
  services: [
    {
      index: "01",
      title: "AI\nAUTOMATIONS",
      short: "INTELLIGENT WORKFLOWS THAT CONNECT TOOLS.",
      description:
        "Intelligent workflows that connect tools, apps and processes to eliminate repetitive work and make businesses run smarter.",
      tags: ["WORKFLOW AUTOMATION", "AI AGENTS", "N8N", "INTEGRATIONS"],
    },
    {
      index: "02",
      title: "AI\nCHATBOTS",
      short: "CONVERSATIONAL SYSTEMS FOR WEBSITES & APPS.",
      description:
        "AI-powered conversational systems for websites and communication platforms that can answer questions, qualify leads and automate customer interactions.",
      tags: ["WHATSAPP", "WEBSITE", "INSTAGRAM", "AI SUPPORT"],
    },
    {
      index: "03",
      title: "AI\nADS",
      short: "STRATEGIES BUILT FOR AI-POWERED PLATFORMS.",
      description:
        "Creative and advertising strategies built for the emerging world of AI-powered platforms and applications.",
      tags: ["AI PLATFORMS", "ADVERTISING", "CREATIVE", "CAMPAIGNS"],
    },
    {
      index: "04",
      title: "CREATIVE\nDESIGN",
      short: "VIBE-CODED WEBSITES & VISUALS THAT FEEL RIGHT.",
      description:
        "Vibe-coded websites, graphic design and video editing built to make ideas look as good as they feel.",
      tags: ["WEB DESIGN", "VIBE CODING", "GRAPHIC DESIGN", "VIDEO EDITING"],
    },
    {
      index: "05",
      title: "DIGITAL\nMARKETING",
      short: "STRATEGIES TO GET DISCOVERED AND GROW.",
      description:
        "Digital strategies that help brands get discovered, build attention and turn online presence into real growth.",
      tags: ["SEO", "SOCIAL MEDIA", "CONTENT", "GROWTH"],
    },
  ],

  // ---------------------------------------------------------------------------
  // PROJECTS
  // ---------------------------------------------------------------------------
  projects: [
    {
      index: "01",
      // REPLACE_ME: Replace with real project title
      title: "REPLACE_ME — PROJECT TITLE",
      // REPLACE_ME: Replace with real project description
      description: "REPLACE_ME — Project description goes here.",
      category: "REPLACE_ME — CATEGORY",
      year: "2025",
      // REPLACE_ME: Replace with real project image path
      image: "REPLACE_ME_PROJECT_IMAGE",
      // REPLACE_ME: Replace with real project URL
      url: "REPLACE_ME_PROJECT_URL",
      featured: true,
    },
    {
      index: "02",
      title: "N8N AUTOMATION SYSTEM",
      description:
        "A modular automation framework built with n8n. Connects APIs, triggers workflows, and replaces repetitive human tasks.",
      category: "AI AUTOMATION",
      year: "2025",
      // REPLACE_ME: Replace with real project image path
      image: "REPLACE_ME_PROJECT_IMAGE_N8N",
      // REPLACE_ME: Replace with real project URL
      url: "REPLACE_ME_PROJECT_URL_N8N",
      featured: true,
    },
    {
      index: "03",
      title: "SOCIALMAP",
      description:
        "A social media intelligence tool that maps content performance, audience behavior, and growth opportunities.",
      category: "DIGITAL MARKETING",
      year: "2024",
      // REPLACE_ME: Replace with real project image path
      image: "REPLACE_ME_PROJECT_IMAGE_SOCIALMAP",
      // REPLACE_ME: Replace with real project URL
      url: "REPLACE_ME_PROJECT_URL_SOCIALMAP",
      featured: true,
    },
    {
      index: "04",
      // REPLACE_ME: Replace with real project title
      title: "REPLACE_ME — PROJECT TITLE",
      // REPLACE_ME: Replace with real project description
      description: "REPLACE_ME — Project description goes here.",
      category: "REPLACE_ME — CATEGORY",
      year: "2024",
      // REPLACE_ME: Replace with real project image path
      image: "REPLACE_ME_PROJECT_IMAGE_2",
      // REPLACE_ME: Replace with real project URL
      url: "REPLACE_ME_PROJECT_URL_2",
      featured: false,
    },
  ],

  // ---------------------------------------------------------------------------
  // MARQUEE
  // ---------------------------------------------------------------------------
  marquee: {
    forward: [
      "VIBE CODED",
      "SHIP IT BHAI",
      "NO BORING UI",
      "CTRL + Z IS SELF CARE",
      "IDEA AAYA → BANA DIYA",
      "THODA CHAOS",
      "WEIRD IS WORKING",
      "CLIENT NE BOLA SIMPLE",
    ],
    reverse: [
      "ERROR AAYA. BHAAV NAHI.",
      "DEBUG KAR RAHE HAIN",
      "AI KO KAAM PE LAGAO",
      "MAKE. BREAK. REPEAT.",
      "PIXELS WITH PURPOSE",
      "PHIR HUMNE NAHI KIYA",
      "404: MOTIVATION NOT FOUND",
      "CHAI > COFFEE",
    ],
  },

  // ---------------------------------------------------------------------------
  // CONTACT SECTION
  // ---------------------------------------------------------------------------
  contact: {
    headline: ["LET'S", "MAKE", "SOMETHING", "WEIRD."],
    subtext: "Drop a message or find me on the internet.",
  },

  // ---------------------------------------------------------------------------
  // FOOTER
  // ---------------------------------------------------------------------------
  footer: {
    tagline: ["MADE WITH", "TOO MUCH", "COFFEE."],
    copyright: "© 2026",
  },

  // ---------------------------------------------------------------------------
  // SEO / METADATA
  // ---------------------------------------------------------------------------
  seo: {
    ogImage: "/images/project-community.png",
    favicon: "/favicon.ico",
    twitterHandle: "@soeze",
  },

  // ---------------------------------------------------------------------------
  // NOISE / TEXTURE CONFIG
  // ---------------------------------------------------------------------------
  noise: {
    // Grain intensity — 0 = none, 1 = max. Adjust for visual preference.
    lightModeIntensity: 0.04,
    darkModeIntensity: 0.06,
  },
} as const;

export type SiteConfig = typeof siteConfig;
