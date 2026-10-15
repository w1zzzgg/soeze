import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";
import Hero from "@/components/sections/Hero";
import Marquee from "@/components/ui/Marquee";
import AboutIntro from "@/components/sections/AboutIntro";
import SelectedWork from "@/components/sections/SelectedWork";
import Services from "@/components/sections/Services";
import TheLab from "@/components/sections/TheLab";
import Contact from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Creative Technology Studio`,
  },
  description: siteConfig.description,
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Marquee — forward */}
      <Marquee items={[...siteConfig.marquee.forward]} direction="forward" speed={35} />

      {/* 3. About intro */}
      <AboutIntro />

      {/* 4. Marquee — reverse, different speed */}
      <Marquee
        items={[...siteConfig.marquee.reverse]}
        direction="reverse"
        speed={28}
        accent="var(--accent-lavender)"
      />

      {/* 5. What If? (Creative Ideation) */}
      <SelectedWork />

      {/* 6. Services */}
      <Services />

      {/* 7. The Lab */}
      <TheLab />

      {/* 8. Contact */}
      <Contact />
    </>
  );
}
