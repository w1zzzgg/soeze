"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import styles from "./TheLab.module.css";

const LabScene = dynamic(() => import("@/components/webgl/LabScene"), {
  ssr: false,
  loading: () => null,
});

const THOUGHTS = [
  "INSPIRE MAT HOJANA MUJHSE.",
  "KAAM CHHOTA THA. SCOPE NE MANA KAR DIYA.",
  "MAIN PROCRASTINATE NAHI KARTA. MAIN FUTURE KO BANDWIDTH DETA HOON.",
  "YE FEATURE NAHI HAI. YE PERSONALITY HAI.",
  "404: MOTIVATION NOT FOUND.",
  "THODA PAISA. THODA PYAAR. BAAKI SAB CSS.",
  "DEADLINE KE EK DIN PEHLE SAB CREATIVE LAGTA HAI.",
  "WEBSITE LIVE HAI. AB BUGS KO BHI CONFIDENCE AA GAYA HAI.",
  "CLIENT: BAS SIMPLE RAKHNA. ALSO CLIENT: YE 17 REFERENCES DEK.",
  "EK KAAM THA. TEEN TABS KHUL GAYE.",
  "PLAN THA. PHIR INTERNET CHAL GAYA.",
  "DEBUGGING IS JUST ARGUING WITH YOURSELF. PROFESSIONALLY.",
  "SLEEP SCHEDULE? BETA VERSION.",
  "JO DIKHTA HAI WOH UI HAI. JO NAHI DIKHTA WOH BUGS HAIN.",
  "BAS 5 MINUTE AUR.",
  "PROFESSIONAL HOON. PAR ITNA BHI NAHI.",
  "EK AUR ANIMATION DAAL DETE HAIN.",
  "LIFE SORTED HOTI TOH WEBSITE KYUN BANATA?",
  "KAL SE PAKKA PRODUCTIVE.",
  "MAIN THEEK HOON. BAS 47 BROWSER TABS KHULE HAIN.",
  "CODE LIKHA. PHIR KUCH ZYADA HI HO GAYA.",
  "YE BUTTON ABSOLUTELY NOTHING KARTA HAI.",
  "TUM KAAM KARNE AAYE THE.",
  "INTERNET PE HOON. NORMAL HONA MANA HAI.",
  "UI HAI. PAR SEEDHA NAHI HAI.",
  "BORING THA. ISLIYE MAINE CHHED DIYA.",
  "IDEA AAYA. BANA DIYA. SHIP KIYA. REPEAT.",
  "COMPUTERS SHOULD BE STRANGE, TACTILE, AND SLIGHTLY UNPREDICTABLE.",
  "WRITE CODE LIKE POETRY. DEPLOY LIKE LIGHTNING.",
  "IF AN ALGORITHM DOESN'T SURPRISE ITS AUTHOR, IT'S JUST ACCOUNTING.",
  "THE INTERNET IS WEIRD. MAKE IT WEIRDER.",
  "DESIGN KAR DIYA. AB TUM DEKHTE RAHO.",
  "SCOPE CREEP IS JUST AMBITION WITH A BILLING PROBLEM.",
  "WHY MAKE IT NORMAL WHEN MAKING IT WEIRD COSTS THE SAME?",
  "THE BEST CODE IS CODE THAT EMBARRASSES YOUR PAST SELF.",
  "EVERY WEBSITE IS SOMEONE'S FIRST IMPRESSION OF YOU. MAKE IT WEIRD.",
  "OVERTHINKING IS JUST PLANNING IN ITALICS.",
  "PRODUCTION MEIN DAL DO. DEV MEIN TOOT JAATA THA.",
  "GOOD DESIGN IS INVISIBLE. SOEZE DESIGN IS MEMORABLE.",
  "PHIR SE STARTED FROM SCRATCH. AS A TREAT.",
  "PIXEL-PERFECT? KYA TUJHE PATA HAI KITNE SCREENS HAIN?",
  "PADH KE AANA THA. VIBE CODING MEIN NIKAL GAYA.",
];

const TEXT_LINES = ["MAKE", "SOMETHING", "WEIRD."];

export default function TheLab() {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const lettersRef = useRef<HTMLSpanElement[]>([]);
  const thoughtRef = useRef<HTMLDivElement>(null);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [burstCount, setBurstCount] = useState(0);
  const [burstOrigin, setBurstOrigin] = useState({ x: 0, y: 0 });
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  // Entrance animation
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  // Mouse move handler for stage & typography distortion
  const handleStageMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (reducedMotion || !stageRef.current) return;

      const rect = stageRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      setMouse({ x: nx, y: ny });

      // Kinetic typography interaction
      lettersRef.current.forEach((letter) => {
        if (!letter) return;
        const lRect = letter.getBoundingClientRect();
        const lx = lRect.left + lRect.width / 2;
        const ly = lRect.top + lRect.height / 2;

        const dx = e.clientX - lx;
        const dy = e.clientY - ly;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 130;

        if (dist < radius) {
          const force = (1 - dist / radius);
          const pushX = (-dx / dist) * force * 24;
          const pushY = (-dy / dist) * force * 20;

          gsap.to(letter, {
            x: pushX,
            y: pushY,
            color: force > 0.4 ? "var(--accent-lavender)" : "var(--fg)",
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        } else {
          gsap.to(letter, {
            x: 0,
            y: 0,
            color: "var(--fg)",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
      });
    },
    [reducedMotion]
  );

  const handleStageMouseLeave = useCallback(() => {
    setMouse({ x: 0, y: 0 });
    lettersRef.current.forEach((letter) => {
      if (!letter) return;
      gsap.to(letter, {
        x: 0,
        y: 0,
        color: "var(--fg)",
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    });
  }, []);

  // Touch move support for mobile
  const handleStageTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (reducedMotion || !stageRef.current || !e.touches[0]) return;
      const touch = e.touches[0];
      const rect = stageRef.current.getBoundingClientRect();
      const nx = ((touch.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((touch.clientY - rect.top) / rect.height) * 2 - 1);
      setMouse({ x: nx, y: ny });
    },
    [reducedMotion]
  );

  // Click burst on stage
  const handleStageClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      setBurstOrigin({ x: nx, y: ny });
      setBurstCount((c) => c + 1);

      // Letter scatter effect on click
      lettersRef.current.forEach((letter) => {
        if (!letter) return;
        const randX = (Math.random() - 0.5) * 35;
        const randY = (Math.random() - 0.5) * 30;

        gsap.to(letter, {
          x: randX,
          y: randY,
          duration: 0.15,
          ease: "power4.out",
          onComplete: () => {
            gsap.to(letter, {
              x: 0,
              y: 0,
              duration: 0.6,
              ease: "elastic.out(1, 0.4)",
            });
          },
        });
      });
    },
    []
  );

  // Thought Generator Click
  const handleThoughtClick = () => {
    let nextIdx = Math.floor(Math.random() * THOUGHTS.length);
    if (nextIdx === thoughtIndex) {
      nextIdx = (nextIdx + 1) % THOUGHTS.length;
    }

    if (thoughtRef.current) {
      // Exit: slide up + fade out
      gsap.to(thoughtRef.current, {
        y: -16,
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setClickCount((c) => c + 1);
          setThoughtIndex(nextIdx);
          // Entrance: start below, animate up
          gsap.fromTo(
            thoughtRef.current,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power3.out",
            }
          );
        },
      });
    } else {
      setClickCount((c) => c + 1);
      setThoughtIndex(nextIdx);
    }
  };

  let charCount = 0;

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.lab}`}
      id="lab"
      aria-label="The Lab — interactive experiments"
    >
      <div className="container">
        <SectionLabel index="05">EXPERIMENTS // THE LAB</SectionLabel>

        <div className={styles.header}>
          <div className="text-display">THE LAB</div>
          <p className={`text-body ${styles.headerDesc}`}>
            A playground for experiments. Some useful. Some strange. All intentional.
          </p>
        </div>

        {/* Experiment 1: Interactive Canvas & Kinetic Typography */}
        <div className={styles.canvasContainer}>
          {/* Telemetry header */}
          <div className={styles.telemetryBar}>
            <div className={styles.statusIndicator}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span>EXPERIMENT_01 // KINETIC DISPLACEMENT FIELD</span>
            </div>
            <div className={styles.telemetryHint}>
              [ CLICK / DRAG TO TRIGGER SHOCKWAVE ]
            </div>
            <div className={styles.touchHint}>[ TAP TO DISTORT ]</div>
            <div className={styles.telemetryCoords}>
              X: {mouse.x >= 0 ? `+${mouse.x.toFixed(2)}` : mouse.x.toFixed(2)} // Y:{" "}
              {mouse.y >= 0 ? `+${mouse.y.toFixed(2)}` : mouse.y.toFixed(2)}
            </div>
          </div>

          {/* Interactive Stage */}
          <div
            ref={stageRef}
            className={styles.stage}
            onMouseMove={handleStageMouseMove}
            onMouseLeave={handleStageMouseLeave}
            onTouchMove={handleStageTouchMove}
            onClick={handleStageClick}
            data-cursor="drag"
            role="region"
            aria-label="Interactive kinetic canvas"
          >
            {/* Three.js / WebGL Kinetic Mesh */}
            <LabScene
              mouseNormalized={mouse}
              burstTrigger={burstCount}
              burstOrigin={burstOrigin}
            />

            {/* Typography Overlay */}
            <div className={styles.typeField} aria-hidden="true">
              {TEXT_LINES.map((line, lineIdx) => (
                <div key={lineIdx} className={styles.typeLine}>
                  {line.split("").map((char) => {
                    const idx = charCount++;
                    return (
                      <span
                        key={idx}
                        ref={(el) => {
                          if (el) lettersRef.current[idx] = el;
                        }}
                        className={styles.typeChar}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Stage bottom telemetry */}
            <div className={styles.stageFooter}>
              <span>INTERACTION: KINETIC_FIELD</span>
              <span>PARTICLES: 1,100 // MODE: REACTIVE</span>
            </div>
          </div>
        </div>

        {/* Experiment 2: "RANDOM THING" Thought Generator */}
        <div className={styles.thoughtGenerator}>
          <div className={styles.generatorHeader}>
            <span className={styles.generatorTitle}>
              EXPERIMENT_02: UNEXPECTED COGNITION MATRIX
            </span>
            <span className={styles.generatorBadge}>RANDOM THOUGHTS</span>
          </div>

          <div className={styles.thoughtBox}>
            <div ref={thoughtRef} className={styles.thoughtText}>
              &ldquo;{THOUGHTS[thoughtIndex]}&rdquo;
            </div>
          </div>

          <div className={styles.generatorControls}>
            <button
              type="button"
              className={styles.actionBtn}
              onClick={handleThoughtClick}
              data-cursor="hover"
              aria-label="Generate an unexpected creative statement"
            >
              <span>[ CLICK SOMETHING ]</span>
            </button>
            <span className={styles.clickCounter}>
              DISRUPTIONS TRIGGERED: {clickCount.toString().padStart(3, "0")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
