"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./PlayingCard.module.css";
import type { UnoCardColor, UnoValue } from "@/lib/uno";

// ─── Types ────────────────────────────────────────────────────────────────────

export type PlayingCardRank =
  | "A"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "J"
  | "Q"
  | "K";

export type PlayingCardSuit = "clubs" | "diamonds" | "hearts" | "spades";

export type PlayingCardProps = {
  /** UNO card color: red | yellow | green | blue | wild */
  color?: UnoCardColor;
  /** UNO card value: 0-9 | skip | reverse | draw2 | wild | wild4 */
  value?: UnoValue;
  /** Standard poker card rank (legacy) */
  rank?: PlayingCardRank;
  /** Standard poker card suit (legacy) */
  suit?: PlayingCardSuit;
  className?: string;
  faceDown?: boolean;
  /** Card width in pixels. Height follows the classic 5:7 ratio. */
  width?: number;
};

// ─── Internal types for legacy poker cards ────────────────────────────────────

type Pip = { x: number; y: number; flip?: boolean };

const suitPaths: Record<PlayingCardSuit, string> = {
  clubs:
    "M12 2a4.1 4.1 0 0 0-4.1 4.1c0 .93.31 1.79.83 2.48a4.1 4.1 0 1 0 2.9 7.33c-.28 2.2-1.02 3.72-2.43 5.09h5.6c-1.41-1.37-2.15-2.89-2.43-5.09a4.1 4.1 0 1 0 2.9-7.33c.52-.69.83-1.55.83-2.48A4.1 4.1 0 0 0 12 2Z",
  diamonds: "M12 1.5 19.3 12 12 22.5 4.7 12Z",
  hearts:
    "M12 21.4C6.1 15.9 2.6 12.4 2.6 8.6a4.85 4.85 0 0 1 4.85-4.85c1.8 0 3.5.87 4.55 2.33a5.63 5.63 0 0 1 4.55-2.33A4.85 4.85 0 0 1 21.4 8.6c0 3.8-3.5 7.3-9.4 12.8Z",
  spades:
    "M12 1.8C6.9 7.2 3.6 10.3 3.6 13.6a4.35 4.35 0 0 0 7.1 3.36c-.3 1.9-1 3.26-2.35 4.54h7.3c-1.35-1.28-2.05-2.64-2.35-4.54a4.35 4.35 0 0 0 7.1-3.36c0-3.3-3.3-6.4-8.4-11.8Z",
};

const redSuits: ReadonlySet<PlayingCardSuit> = new Set(["diamonds", "hearts"]);

const courtSuitCode: Record<PlayingCardSuit, string> = {
  clubs: "C",
  diamonds: "D",
  hearts: "H",
  spades: "S",
};

const left = 0;
const center = 50;
const right = 100;

const pipLayouts: Partial<Record<PlayingCardRank, readonly Pip[]>> = {
  "2": [
    { x: center, y: 0 },
    { x: center, y: 100, flip: true },
  ],
  "3": [
    { x: center, y: 0 },
    { x: center, y: 50 },
    { x: center, y: 100, flip: true },
  ],
  "4": [
    { x: left, y: 0 },
    { x: right, y: 0 },
    { x: left, y: 100, flip: true },
    { x: right, y: 100, flip: true },
  ],
  "5": [
    { x: left, y: 0 },
    { x: right, y: 0 },
    { x: center, y: 50 },
    { x: left, y: 100, flip: true },
    { x: right, y: 100, flip: true },
  ],
  "6": [
    { x: left, y: 0 },
    { x: right, y: 0 },
    { x: left, y: 50 },
    { x: right, y: 50 },
    { x: left, y: 100, flip: true },
    { x: right, y: 100, flip: true },
  ],
  "7": [
    { x: left, y: 0 },
    { x: right, y: 0 },
    { x: center, y: 25 },
    { x: left, y: 50 },
    { x: right, y: 50 },
    { x: left, y: 100, flip: true },
    { x: right, y: 100, flip: true },
  ],
  "8": [
    { x: left, y: 0 },
    { x: right, y: 0 },
    { x: center, y: 25 },
    { x: left, y: 50 },
    { x: right, y: 50 },
    { x: center, y: 75, flip: true },
    { x: left, y: 100, flip: true },
    { x: right, y: 100, flip: true },
  ],
  "9": [
    { x: left, y: 0 },
    { x: right, y: 0 },
    { x: left, y: 33 },
    { x: right, y: 33 },
    { x: center, y: 50 },
    { x: left, y: 66, flip: true },
    { x: right, y: 66, flip: true },
    { x: left, y: 100, flip: true },
    { x: right, y: 100, flip: true },
  ],
  "10": [
    { x: left, y: 0 },
    { x: right, y: 0 },
    { x: center, y: 18 },
    { x: left, y: 33 },
    { x: right, y: 33 },
    { x: left, y: 66, flip: true },
    { x: right, y: 66, flip: true },
    { x: center, y: 82, flip: true },
    { x: left, y: 100, flip: true },
    { x: right, y: 100, flip: true },
  ],
};

const courtRanks: ReadonlySet<PlayingCardRank> = new Set(["J", "Q", "K"]);

function SuitIcon({
  className,
  suit,
}: {
  className?: string;
  suit: PlayingCardSuit;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
    >
      <path d={suitPaths[suit]} />
    </svg>
  );
}

function CornerIndex({
  flipped,
  rank,
  suit,
}: {
  flipped?: boolean;
  rank: PlayingCardRank;
  suit: PlayingCardSuit;
}) {
  const positionClass = flipped ? styles.cornerIndexBottom : styles.cornerIndexTop;
  return (
    <div className={`${styles.cornerIndex} ${positionClass}`} aria-hidden="true">
      <span className={styles.rankLabel}>{rank}</span>
      <SuitIcon className={styles.suitIconCorner} suit={suit} />
    </div>
  );
}

function CourtArtwork({
  rank,
  suit,
  width,
}: {
  rank: PlayingCardRank;
  suit: PlayingCardSuit;
  width: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={styles.courtFallback} aria-hidden="true">
        <span className={styles.courtFallbackRank}>{rank}</span>
        <SuitIcon className={styles.courtFallbackSuit} suit={suit} />
      </div>
    );
  }

  return (
    <div className={styles.courtContainer} aria-hidden="true">
      <Image
        alt=""
        className={styles.courtImage}
        draggable={false}
        fill
        sizes={`${Math.round(width * 0.52)}px`}
        src={`/experiments/courts/${rank}${courtSuitCode[suit]}.png`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

// ─── UNO SVG Icons & Components ───────────────────────────────────────────────

function SkipSvg() {
  return (
    <svg viewBox="0 0 32 32" className={styles.unoActionSvg} aria-hidden="true">
      <circle cx="16" cy="16" r="12" fill="none" stroke="currentColor" strokeWidth="4" />
      <line x1="7.5" y1="7.5" x2="24.5" y2="24.5" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

function ReverseSvg() {
  return (
    <svg viewBox="0 0 32 32" className={styles.unoActionSvg} aria-hidden="true">
      <path
        d="M6 12 L12 6 L12 10 C20 10 26 14 26 22 L22 22 C22 16 18 14 12 14 L12 18 Z"
        fill="currentColor"
      />
      <path
        d="M26 20 L20 26 L20 22 C12 22 6 18 6 10 L10 10 C10 16 14 18 20 18 L20 14 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function WildQuadrantSvg() {
  return (
    <svg viewBox="0 0 32 32" className={styles.unoWildSvg} aria-hidden="true">
      <path d="M16 16 L16 3 A13 13 0 0 1 29 16 Z" fill="#ef233c" />
      <path d="M16 16 L29 16 A13 13 0 0 1 16 29 Z" fill="#3a86ff" />
      <path d="M16 16 L16 29 A13 13 0 0 1 3 16 Z" fill="#ffb703" />
      <path d="M16 16 L3 16 A13 13 0 0 1 16 3 Z" fill="#10b981" />
      <circle cx="16" cy="16" r="13" fill="none" stroke="#ffffff" strokeWidth="1.5" />
    </svg>
  );
}

function getUnoValueLabel(val: UnoValue): string {
  switch (val) {
    case "skip":
      return "⊘";
    case "reverse":
      return "⇄";
    case "draw2":
      return "+2";
    case "wild":
      return "W";
    case "wild4":
      return "+4";
    default:
      return val;
  }
}

function getUnoAriaLabel(color: UnoCardColor, value: UnoValue): string {
  const colorStr = color === "wild" ? "Wild" : color.charAt(0).toUpperCase() + color.slice(1);
  const valStr =
    value === "skip"
      ? "Skip"
      : value === "reverse"
      ? "Reverse"
      : value === "draw2"
      ? "Draw Two"
      : value === "wild"
      ? "Wild"
      : value === "wild4"
      ? "Wild Draw Four"
      : value;
  return `${colorStr} ${valStr}`;
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function PlayingCard({
  className,
  color,
  faceDown = false,
  rank,
  suit,
  value,
  width = 112,
}: PlayingCardProps) {
  // If color and value are provided, render UNO Card
  if (color !== undefined && value !== undefined) {
    const isWild = color === "wild";
    const bgClass =
      color === "red"
        ? styles.unoBgRed
        : color === "yellow"
        ? styles.unoBgYellow
        : color === "green"
        ? styles.unoBgGreen
        : color === "blue"
        ? styles.unoBgBlue
        : styles.unoBgWild;

    const cornerLabel = getUnoValueLabel(value);
    const ariaLabel = getUnoAriaLabel(color, value);

    return (
      <div
        className={`${styles.card} ${styles.unoCard} ${bgClass} ${className ?? ""}`}
        style={{ fontSize: width / 14, width }}
        role="img"
        aria-label={faceDown ? "Face down UNO card" : ariaLabel}
      >
        {faceDown ? (
          <div className={styles.unoBack}>
            <div className={styles.unoBackOval}>
              <span className={styles.unoBackText}>UNO</span>
              <span className={styles.unoBackSub}>SOEZE</span>
            </div>
          </div>
        ) : (
          <>
            {/* Top-left corner */}
            <div className={`${styles.unoCorner} ${styles.unoCornerTop}`} aria-hidden="true">
              <span className={styles.unoCornerLabel}>{cornerLabel}</span>
            </div>

            {/* Bottom-right corner */}
            <div className={`${styles.unoCorner} ${styles.unoCornerBottom}`} aria-hidden="true">
              <span className={styles.unoCornerLabel}>{cornerLabel}</span>
            </div>

            {/* Central oval */}
            <div
              className={`${styles.unoCenterOval} ${
                isWild ? styles.unoCenterOvalDark : styles.unoCenterOvalWhite
              }`}
              aria-hidden="true"
            >
              {value === "skip" ? (
                <SkipSvg />
              ) : value === "reverse" ? (
                <ReverseSvg />
              ) : value === "draw2" ? (
                <span className={styles.unoCenterDraw2}>+2</span>
              ) : value === "wild" ? (
                <div className={styles.unoCenterWildBox}>
                  <WildQuadrantSvg />
                </div>
              ) : value === "wild4" ? (
                <div className={styles.unoCenterWild4Box}>
                  <WildQuadrantSvg />
                  <span className={styles.unoCenterWild4Text}>+4</span>
                </div>
              ) : (
                <span className={styles.unoCenterNumber}>{value}</span>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  // If faceDown is requested without UNO color/value:
  if (faceDown) {
    return (
      <div
        className={`${styles.card} ${styles.unoCard} ${styles.unoBgWild} ${className ?? ""}`}
        style={{ fontSize: width / 14, width }}
        role="img"
        aria-label="Face down card"
      >
        <div className={styles.unoBack}>
          <div className={styles.unoBackOval}>
            <span className={styles.unoBackText}>UNO</span>
            <span className={styles.unoBackSub}>SOEZE</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Legacy Poker Card fallback ──────────────────────────────────────────────
  const safeRank = rank ?? "A";
  const safeSuit = suit ?? "spades";
  const isRed = redSuits.has(safeSuit);
  const pips = pipLayouts[safeRank];
  const isCourt = courtRanks.has(safeRank);

  const colorClass = isRed ? styles.colorRed : styles.colorBlack;
  const rootClass = [styles.card, colorClass, className].filter(Boolean).join(" ");

  return (
    <div
      className={rootClass}
      style={{ fontSize: width / 14, width }}
    >
      <CornerIndex rank={safeRank} suit={safeSuit} />
      <CornerIndex flipped rank={safeRank} suit={safeSuit} />

      {safeRank === "A" ? (
        <div className={styles.aceCenter}>
          <SuitIcon className={styles.suitIconAce} suit={safeSuit} />
        </div>
      ) : null}

      {isCourt ? (
        <CourtArtwork rank={safeRank} suit={safeSuit} width={width} />
      ) : null}

      {pips ? (
        <div className={styles.pipField}>
          {pips.map((pip) => (
            <span
              className={pip.flip ? styles.pipFlip : styles.pip}
              key={`${pip.x}-${pip.y}`}
              style={{ left: `${pip.x}%`, top: `${pip.y}%` }}
            >
              <SuitIcon className={styles.suitIconPip} suit={safeSuit} />
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
