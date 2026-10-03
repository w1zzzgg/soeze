"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { siteConfig } from "@/lib/site-config";
import ThemeToggle from "@/components/ui/ThemeToggle";
import VisitorCounter from "@/components/ui/VisitorCounter";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Reveal nav on load
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    gsap.fromTo(
      nav,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 1.4 }
    );
  }, []);

  // Mobile menu open/close
  useEffect(() => {
    const overlay = overlayRef.current;
    const menu = menuRef.current;
    if (!overlay || !menu) return;

    if (menuOpen) {
      document.body.style.overflow = "hidden";
      gsap.set(overlay, { display: "flex" });
      gsap.fromTo(
        overlay,
        { clipPath: "inset(0 0 100% 0)" },
        { clipPath: "inset(0 0 0% 0)", duration: 0.6, ease: "power4.out" }
      );
      gsap.fromTo(
        menu.querySelectorAll(`.${styles.menuItem}`),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.07,
          duration: 0.6,
          ease: "power3.out",
          delay: 0.2,
        }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.5,
        ease: "power4.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
        },
      });
    }
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav ref={navRef} className={`nav ${styles.nav}`} role="navigation" aria-label="Main navigation">
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="SOEZE Home">
            {/* REPLACE_ME: Replace text logo with final SOEZE logo image */}
            <span className={styles.logoText}>{siteConfig.name}</span>
          </Link>

          {/* Desktop navigation */}
          <div className={styles.desktopLinks}>
            <div className={styles.navLinksGroup}>
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.navLink}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <div className={styles.navRightGroup}>
              <VisitorCounter />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile right controls */}
          <div className={styles.mobileRightGroup}>
            <VisitorCounter className={styles.mobileCounter} />
            <ThemeToggle />
            <button
              className={styles.menuBtn}
              onClick={() => setMenuOpen((p) => !p)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className={styles.menuBtnInner}>
                {menuOpen ? "CLOSE ✕" : "MENU ≡"}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile fullscreen overlay */}
      <div
        ref={overlayRef}
        className={styles.overlay}
        style={{ display: "none" }}
        aria-hidden={!menuOpen}
      >
        <div className={styles.overlayInner}>
          <div ref={menuRef} className={styles.menuLinks}>
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={styles.menuItem}
                onClick={closeMenu}
                data-cursor="select"
              >
                <span className={styles.menuIndex}>
                  {String(siteConfig.nav.indexOf(item) + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
          <div className={styles.overlayFooter}>
            <div className={styles.overlayFooterLeft}>
              <VisitorCounter />
              <ThemeToggle />
            </div>
            <span className={styles.overlayDomain}>{siteConfig.domain}</span>
          </div>
        </div>
      </div>
    </>
  );
}
