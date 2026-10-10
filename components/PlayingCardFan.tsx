"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  PlayingCard,
  type PlayingCardRank,
  type PlayingCardSuit,
} from "@/components/PlayingCard";
import type { UnoCardColor, UnoValue } from "@/lib/uno";
import styles from "./PlayingCardFan.module.css";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FanCard = {
  id: string;
  color?: UnoCardColor;
  value?: UnoValue;
  rank?: PlayingCardRank;
  suit?: PlayingCardSuit;
};

export type PlayingCardFanProps = {
  cards: readonly FanCard[];
  /** Card width in pixels. */
  cardWidth?: number;
  className?: string;
  onPlay?: (card: FanCard) => void;
  onAttemptPlay?: (card: FanCard) => void;
  /**
   * Controls which cards sit on the pile, in play order. Omit to let the
   * fan manage played cards itself.
   */
  playedIds?: readonly string[];
  /** IDs of cards that are currently legal to play */
  legalCardIds?: readonly string[];
  /** Whether it's currently the player's turn */
  isMyTurn?: boolean;
};

type PileTransform = {
  rotate: number;
  x: number;
  y: number;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const bottomTuck = 46;
const hoverLift = 54;
const pileLift = -224;
const playThresholdY = -80;
const playThresholdVelocity = -600;
const minFanSpacing = 26;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const rankNames: Record<PlayingCardRank, string> = {
  A: "ace",
  "2": "two",
  "3": "three",
  "4": "four",
  "5": "five",
  "6": "six",
  "7": "seven",
  "8": "eight",
  "9": "nine",
  "10": "ten",
  J: "jack",
  Q: "queen",
  K: "king",
};

function deterministicBetween(id: string, salt: number, min: number, max: number) {
  let h = salt;
  for (let i = 0; i < id.length; i++) {
    h = (Math.imul(31, h) + id.charCodeAt(i)) | 0;
  }
  const normalized = (Math.abs(h) % 10000) / 10000;
  return min + normalized * (max - min);
}

/** Spread each card into a symmetric arc around the middle of the hand. */
function fanTransform(index: number, count: number, spacing: number) {
  const offset = index - (count - 1) / 2;
  const stepDeg = count > 1 ? Math.min(9, 46 / (count - 1)) : 0;
  const rotate = offset * stepDeg;

  return {
    rotate,
    x: offset * spacing,
    y: Math.abs(rotate) * 1.9,
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PlayingCardFan({
  cards,
  cardWidth = 112,
  className,
  isMyTurn = true,
  legalCardIds,
  onAttemptPlay,
  onPlay,
  playedIds: controlledPlayedIds,
}: PlayingCardFanProps) {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pileTransforms = useRef(new Map<string, PileTransform>());
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const [internalPlayedIds, setInternalPlayedIds] = useState<readonly string[]>(
    [],
  );
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [wobbleId, setWobbleId] = useState<string | null>(null);

  const playedIds = controlledPlayedIds ?? internalPlayedIds;

  useLayoutEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Forget pile positions of cards that returned to the hand
  useEffect(() => {
    for (const id of pileTransforms.current.keys()) {
      if (!playedIds.includes(id)) {
        pileTransforms.current.delete(id);
      }
    }
  }, [playedIds]);

  const handCards = cards.filter((card) => !playedIds.includes(card.id));
  const hoveredIndex = hoveredId
    ? handCards.findIndex((card) => card.id === hoveredId)
    : -1;

  const baseSpacing = handCards.length > 5 ? 44 : 54;
  const maxOffset = (handCards.length - 1) / 2;
  const halfAvailable =
    containerWidth === null
      ? Number.POSITIVE_INFINITY
      : containerWidth / 2 - cardWidth * 0.8;
  const fanSpacing =
    maxOffset > 0
      ? Math.min(
          baseSpacing,
          Math.max(minFanSpacing, halfAvailable / maxOffset),
        )
      : 0;

  const cardTransition = shouldReduceMotion
    ? { duration: 0.16, ease: "easeOut" as const }
    : {
        damping: 30,
        mass: 0.9,
        stiffness: 340,
        type: "spring" as const,
      };

  function pileTransform(id: string): PileTransform {
    const existing = pileTransforms.current.get(id);
    if (existing) return existing;

    const created = {
      rotate: deterministicBetween(id, 1, -13, 13),
      x: deterministicBetween(id, 2, -14, 14),
      y: pileLift + deterministicBetween(id, 3, -6, 6),
    };
    pileTransforms.current.set(id, created);
    return created;
  }

  function clearHover(id: string) {
    setHoveredId((current) => (current === id ? null : current));
  }

  function playCard(card: FanCard) {
    if (playedIds.includes(card.id)) return;

    // Check legal play & turn
    const isLegal = legalCardIds === undefined || legalCardIds.includes(card.id);
    if (!isLegal || !isMyTurn) {
      // Trigger subtle wobble feedback
      setWobbleId(card.id);
      setTimeout(() => {
        setWobbleId((cur) => (cur === card.id ? null : cur));
      }, 420);
      onAttemptPlay?.(card);
      return;
    }

    clearHover(card.id);

    if (controlledPlayedIds === undefined) {
      setInternalPlayedIds((current) =>
        current.includes(card.id) ? current : [...current, card.id],
      );
    }

    onPlay?.(card);
  }

  const containerClass = [styles.container, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={containerClass} ref={containerRef}>
      {cards.map((card) => {
        const playOrder = playedIds.indexOf(card.id);
        const isPlayed = playOrder !== -1;
        const handIndex = handCards.findIndex(
          (candidate) => candidate.id === card.id,
        );
        const isWobbling = !isPlayed && wobbleId === card.id;

        let target: { rotate: number; scale: number; x: number | number[]; y: number };
        let zIndex: number;

        if (isPlayed) {
          const pile = pileTransform(card.id);
          target = {
            rotate: pile.rotate,
            scale: 1,
            x: pile.x,
            y: pile.y,
          };
          zIndex = 100 + playOrder;
        } else {
          const fan = fanTransform(handIndex, handCards.length, fanSpacing);
          const isHovered = card.id === hoveredId;
          const neighborShift =
            hoveredIndex !== -1 && !isHovered
              ? (Math.sign(handIndex - hoveredIndex) * 24) /
                Math.max(1, Math.abs(handIndex - hoveredIndex))
              : 0;

          target = {
            rotate: isHovered ? fan.rotate * 0.3 : fan.rotate,
            scale: isHovered ? 1.08 : 1,
            x: isWobbling
              ? [fan.x - 10, fan.x + 10, fan.x - 8, fan.x + 8, fan.x]
              : fan.x + neighborShift,
            y: isHovered ? -hoverLift : fan.y,
          };
          zIndex = isHovered ? 60 : 10 + handIndex;
        }

        const isLegal =
          !isPlayed &&
          isMyTurn &&
          (legalCardIds === undefined || legalCardIds.includes(card.id));

        let cardAriaLabel = "";
        if (isPlayed) {
          cardAriaLabel = card.color
            ? `${card.color} ${card.value}, played`
            : card.rank
            ? `${rankNames[card.rank]} of ${card.suit}, played`
            : "Played card";
        } else {
          cardAriaLabel = card.color
            ? `Play ${card.color} ${card.value}${isLegal ? "" : " (illegal move)"}`
            : card.rank
            ? `Play the ${rankNames[card.rank]} of ${card.suit}`
            : "Play card";
        }

        return (
          <motion.div
            animate={target}
            className={styles.cardWrapper}
            initial={false}
            key={card.id}
            style={{
              bottom: -bottomTuck,
              marginLeft: -cardWidth / 2,
              zIndex,
            }}
            transition={isWobbling ? { duration: 0.35, ease: "easeInOut" } : cardTransition}
          >
            <motion.button
              aria-label={cardAriaLabel}
              className={`
                ${styles.cardBtn}
                ${isPlayed ? styles.cardBtnPlayed : styles.cardBtnHand}
                ${!isPlayed && isLegal ? styles.cardBtnLegal : ""}
                ${!isPlayed && !isLegal ? styles.cardBtnIllegal : ""}
              `}
              disabled={isPlayed}
              drag={isPlayed ? false : "y"}
              dragConstraints={{ bottom: 0, top: -260 }}
              dragElastic={0.12}
              dragSnapToOrigin
              onBlur={() => clearHover(card.id)}
              onDragEnd={(_event, info) => {
                if (
                  info.offset.y < playThresholdY ||
                  info.velocity.y < playThresholdVelocity
                ) {
                  playCard(card);
                }
              }}
              onFocus={() => {
                if (!isPlayed) setHoveredId(card.id);
              }}
              onHoverEnd={() => clearHover(card.id)}
              onHoverStart={() => {
                if (!isPlayed) setHoveredId(card.id);
              }}
              onTap={() => {
                if (!isPlayed) playCard(card);
              }}
              type="button"
            >
              <PlayingCard
                color={card.color}
                value={card.value}
                rank={card.rank}
                suit={card.suit}
                width={cardWidth}
              />
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
}
