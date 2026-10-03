"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { useThemeContext } from "@/components/ui/ThemeProvider";
import {
  SOEZE_LANGUAGES,
  SOEZE_COLOR_CYCLES_LIGHT,
  SOEZE_COLOR_CYCLES_DARK,
  type SoezeLanguage,
} from "@/lib/soeze-languages";
import styles from "./FooterWordmark.module.css";

// Cycle duration in milliseconds per language pair
const CYCLE_MS = 4000;

export default function FooterWordmark() {
  const { theme } = useThemeContext();
  const soRef = useRef<HTMLSpanElement>(null);
  const ezeRef = useRef<HTMLSpanElement>(null);

  const [langIndex, setLangIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [currentSo, setCurrentSo] = useState(SOEZE_LANGUAGES[0].so);
  const [currentEze, setCurrentEze] = useState(SOEZE_LANGUAGES[0].eze);
  const [currentLang, setCurrentLang] = useState<SoezeLanguage>(SOEZE_LANGUAGES[0]);
  const [voiceIndex, setVoiceIndex] = useState(1);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorCycles = theme === "dark" ? SOEZE_COLOR_CYCLES_DARK : SOEZE_COLOR_CYCLES_LIGHT;

  // Animate BOTH halves simultaneously on the same GSAP timeline
  const animateBoth = useCallback(
    (
      soEl: HTMLSpanElement | null,
      ezeEl: HTMLSpanElement | null,
      newSoText: string,
      newEzeText: string,
      onSoSet: (v: string) => void,
      onEzeSet: (v: string) => void
    ) => {
      if (!soEl && !ezeEl) return;

      // Exit both simultaneously on a shared timeline (position "0")
      const exitTl = gsap.timeline({
        onComplete: () => {
          // Update both text values at the same moment
          onSoSet(newSoText);
          onEzeSet(newEzeText);

          // Enter both simultaneously
          const enterTl = gsap.timeline();
          if (soEl) {
            enterTl.fromTo(
              soEl,
              { yPercent: 110, opacity: 0, filter: "blur(4px)" },
              { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.38, ease: "power3.out" },
              0 // position 0 — start at same time
            );
          }
          if (ezeEl) {
            enterTl.fromTo(
              ezeEl,
              { yPercent: 110, opacity: 0, filter: "blur(4px)" },
              { yPercent: 0, opacity: 1, filter: "blur(0px)", duration: 0.38, ease: "power3.out" },
              0 // position 0 — same time as SO
            );
          }
        },
      });

      if (soEl) {
        exitTl.to(
          soEl,
          { yPercent: -110, opacity: 0, filter: "blur(4px)", duration: 0.28, ease: "power2.in" },
          0 // position 0
        );
      }
      if (ezeEl) {
        exitTl.to(
          ezeEl,
          { yPercent: -110, opacity: 0, filter: "blur(4px)", duration: 0.28, ease: "power2.in" },
          0 // position 0 — exits at exactly the same time as SO
        );
      }
    },
    []
  );

  useEffect(() => {
    const schedule = () => {
      timerRef.current = setTimeout(() => {
        const nextLangIdx = (langIndex + 1) % SOEZE_LANGUAGES.length;
        const nextColorIdx = (colorIndex + 1) % colorCycles.length;
        const nextLang = SOEZE_LANGUAGES[nextLangIdx];

        // SO and EZE animate together — zero stagger
        animateBoth(
          soRef.current,
          ezeRef.current,
          nextLang.so,
          nextLang.eze,
          setCurrentSo,
          setCurrentEze
        );

        setLangIndex(nextLangIdx);
        setColorIndex(nextColorIdx);
        setCurrentLang(nextLang);
        setVoiceIndex((v) => v + 1);

        schedule();
      }, CYCLE_MS);
    };

    schedule();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [langIndex, colorIndex, colorCycles]);

  const [soColor, ezeColor] = colorCycles[colorIndex];

  return (
    <div className={styles.wordmarkWrap}>
      {/* Accessible label: just "SOEZE" — no .TECH in the visual wordmark */}
      <div className={styles.wordmarkRow} aria-label={`SOEZE — ${currentLang.language}`}>
        {/* SO */}
        <span className={styles.soWrap}>
          <span
            ref={soRef}
            className={styles.soText}
            style={{ color: soColor }}
            aria-hidden="true"
          >
            {currentSo}
          </span>
        </span>

        {/* EZE */}
        <span className={styles.ezeWrap}>
          <span
            ref={ezeRef}
            className={styles.ezeText}
            style={{ color: ezeColor }}
            aria-hidden="true"
          >
            {currentEze}
          </span>
        </span>
        {/* .TECH removed from visual wordmark — brand is SOEZE, not SOEZE.TECH */}
      </div>

      {/* Subtle language voice label */}
      <div className={styles.voiceLabel} aria-hidden="true">
        <span>VOICE</span>
        <span className={styles.voiceDivider}>//</span>
        <span>{String(voiceIndex).padStart(2, "0")}</span>
        <span className={styles.voiceDivider}>//</span>
        <span>{currentLang.language.toUpperCase()}</span>
      </div>
    </div>
  );
}
