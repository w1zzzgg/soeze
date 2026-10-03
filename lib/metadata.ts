import { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

// REPLACE_ME: Update the base URL when deploying to production
export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.heroMetaDescription}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "creative technology",
    "web development",
    "AI automation",
    "digital experiences",
    "next.js",
    "webgl",
    "digital studio",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.heroMetaDescription}`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    // REPLACE_ME: Add real OG image to /public/og-image.png
    images: [
      {
        url: siteConfig.seo.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} — Creative Technology Studio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.heroMetaDescription}`,
    description: siteConfig.description,
    creator: siteConfig.seo.twitterHandle,
    // REPLACE_ME: Add real OG image to /public/og-image.png
    images: [siteConfig.seo.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // REPLACE_ME: Add real favicon to /public/favicon.ico
  icons: {
    icon: siteConfig.seo.favicon,
    shortcut: siteConfig.seo.favicon,
  },
};
