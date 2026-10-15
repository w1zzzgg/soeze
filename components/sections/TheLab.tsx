"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./TheLab.module.css";
import { PlayingCard } from "@/components/PlayingCard";
import { PlayingCardFan, type FanCard } from "@/components/PlayingCardFan";
import {
  initGame,
  applyPlay,
  drawCard,
  passTurn,
  resolveColor,
  declareUno,
  applyUnoPenalty,
  getLegalCards,
  isLegal,
  botTakeTurn,
  PLAYER_NAMES,
  type GameState,
  type UnoColor,
} from "@/lib/uno";

// ─── Random thought data (Experiment 02) ───────────────────────────────────────

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

// Color hex codes for indicator dots
const COLOR_HEX: Record<UnoColor, string> = {
  red: "#ef233c",
  yellow: "#ffb703",
  green: "#10b981",
  blue: "#2563eb",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function TheLab() {
  const sectionRef = useRef<HTMLElement>(null);
  const thoughtRef = useRef<HTMLDivElement>(null);

  // Experiment 02 state
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [clickCount, setClickCount] = useState(0);

  // Experiment 01 (UNO Protocol) state: initial state is deterministic to avoid hydration mismatch
  const [gameState, setGameState] = useState<GameState>(() => initGame(false));
  const [notice, setNotice] = useState<string>("");

  const noticeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const botTimerRef = useRef<NodeJS.Timeout | null>(null);
  const unoTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ── GSAP section entrance ──────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Show temporary notice ──────────────────────────────────────────────────
  const showNotice = useCallback((msg: string) => {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice(msg);
    noticeTimerRef.current = setTimeout(() => {
      setNotice("");
    }, 2400);
  }, []);

  // ── Bot Turn Loop ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (botTimerRef.current) {
      clearTimeout(botTimerRef.current);
      botTimerRef.current = null;
    }

    if (
      gameState.currentPlayer !== 0 &&
      gameState.phase === "playing" &&
      gameState.winner === null
    ) {
      botTimerRef.current = setTimeout(() => {
        setGameState((prev) => {
          if (
            prev.currentPlayer !== 0 &&
            prev.phase === "playing" &&
            prev.winner === null
          ) {
            return botTakeTurn(prev);
          }
          return prev;
        });
      }, 900);
    }

    return () => {
      if (botTimerRef.current) clearTimeout(botTimerRef.current);
    };
  }, [gameState.currentPlayer, gameState.phase, gameState.winner]);

  // ── UNO Penalty Timer ──────────────────────────────────────────────────────
  useEffect(() => {
    if (unoTimerRef.current) {
      clearTimeout(unoTimerRef.current);
      unoTimerRef.current = null;
    }

    if (gameState.unoWindowOpen && gameState.winner === null) {
      unoTimerRef.current = setTimeout(() => {
        setGameState((prev) => {
          if (prev.unoWindowOpen && prev.winner === null) {
            return applyUnoPenalty(prev);
          }
          return prev;
        });
      }, 3500);
    }

    return () => {
      if (unoTimerRef.current) clearTimeout(unoTimerRef.current);
    };
  }, [gameState.unoWindowOpen, gameState.winner]);

  // ── Human Player Card Actions ──────────────────────────────────────────────
  const handleCardPlay = useCallback(
    (fanCard: FanCard) => {
      if (gameState.winner !== null) return;
      if (gameState.currentPlayer !== 0) {
        showNotice("[ WAIT FOR YOUR TURN ]");
        return;
      }
      if (gameState.phase !== "playing" && gameState.phase !== "drew-card") {
        return;
      }

      const top = gameState.discard[gameState.discard.length - 1];
      const hand = gameState.hands[0];
      const card = hand.find((c) => c.id === fanCard.id);
      if (!card) return;

      const legal = isLegal(card, top, gameState.activeColor, hand);
      if (!legal) {
        showNotice(
          `[ ILLEGAL MOVE: MUST MATCH ${gameState.activeColor.toUpperCase()} OR ${top.value.toUpperCase()} ]`
        );
        return;
      }

      setGameState((prev) => applyPlay(prev, 0, card));
    },
    [gameState, showNotice]
  );

  const handleIllegalPlay = useCallback(() => {
    if (gameState.winner !== null) return;
      if (gameState.currentPlayer !== 0) {
        showNotice("[ WAIT FOR YOUR TURN ]");
        return;
      }
      const top = gameState.discard[gameState.discard.length - 1];
      showNotice(
        `[ ILLEGAL MOVE: MUST MATCH ${gameState.activeColor.toUpperCase()} OR ${top.value.toUpperCase()} ]`
      );
    },
    [gameState, showNotice]
  );

  const handleDrawCard = useCallback(() => {
    if (gameState.winner !== null) return;
    if (gameState.currentPlayer !== 0) {
      showNotice("[ WAIT FOR YOUR TURN ]");
      return;
    }
    if (gameState.phase !== "playing") return;

    setGameState((prev) => drawCard(prev, 0));
  }, [gameState, showNotice]);

  const handlePassTurn = useCallback(() => {
    if (gameState.winner !== null) return;
    if (gameState.currentPlayer !== 0) return;
    if (gameState.phase !== "drew-card") return;

    setGameState((prev) => passTurn(prev));
  }, [gameState]);

  const handleSelectColor = useCallback((color: UnoColor) => {
    setGameState((prev) => resolveColor(prev, color));
  }, []);

  const handleCallUno = useCallback(() => {
    if (!gameState.unoWindowOpen) return;
    if (unoTimerRef.current) clearTimeout(unoTimerRef.current);
    setGameState((prev) => declareUno(prev));
  }, [gameState.unoWindowOpen]);

  const handleNewGame = useCallback(() => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    if (unoTimerRef.current) clearTimeout(unoTimerRef.current);
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setNotice("");
    setGameState(initGame(true));
  }, []);

  // ── Thought generator (Experiment 02) ───────────────────────────────────────
  const handleThoughtClick = useCallback(() => {
    let nextIdx = Math.floor(Math.random() * THOUGHTS.length);
    if (nextIdx === thoughtIndex) nextIdx = (nextIdx + 1) % THOUGHTS.length;

    if (thoughtRef.current) {
      gsap.to(thoughtRef.current, {
        y: -16,
        opacity: 0,
        duration: 0.18,
        ease: "power2.in",
        onComplete: () => {
          setClickCount((c) => c + 1);
          setThoughtIndex(nextIdx);
          gsap.fromTo(
            thoughtRef.current,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }
          );
        },
      });
    } else {
      setClickCount((c) => c + 1);
      setThoughtIndex(nextIdx);
    }
  }, [thoughtIndex]);

  // Derived variables
  const humanHand = gameState.hands[0];
  const topDiscard = gameState.discard[gameState.discard.length - 1];
  const isHumanTurn =
    gameState.currentPlayer === 0 &&
    (gameState.phase === "playing" || gameState.phase === "drew-card") &&
    gameState.winner === null;

  const legalCards = isHumanTurn
    ? getLegalCards(humanHand, topDiscard, gameState.activeColor)
    : [];
  const legalCardIds = legalCards.map((c) => c.id);

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
          <h2 className="text-display">THE LAB</h2>
          <p className={`text-body ${styles.headerDesc}`}>
            A playground for experiments. Some useful. Some strange. All intentional.
          </p>
        </div>

        {/* ── Experiment 01: UNO Protocol ─────────────────────────────── */}
        <div className={styles.canvasContainer}>
          {/* Telemetry bar */}
          <div className={styles.telemetryBar}>
            <div className={styles.statusIndicator}>
              <span className={styles.liveDot} aria-hidden="true" />
              <span>EXPERIMENT_01 // UNO PROTOCOL</span>
            </div>

            <div className={styles.telemetryHint}>
              TURN: {PLAYER_NAMES[gameState.currentPlayer]} {"//"} DIR:{" "}
              {gameState.direction === 1 ? "CW ↻" : "CCW ↺"}
            </div>

            <div className={styles.telemetryRight}>
              <span className={styles.colorBadge}>
                <span
                  className={styles.colorBadgeDot}
                  style={{ background: COLOR_HEX[gameState.activeColor] }}
                />
                COLOR: {gameState.activeColor.toUpperCase()}
              </span>
              <span className={styles.cardCounter}>
                DRAW: {gameState.deck.length.toString().padStart(2, "0")} {"//"} HAND:{" "}
                {humanHand.length.toString().padStart(2, "0")}
              </span>
              <button
                type="button"
                className={styles.resetBtn}
                onClick={handleNewGame}
                aria-label="Start a new UNO match"
                data-cursor="hover"
              >
                [ NEW GAME ]
              </button>
            </div>
          </div>

          {/* UNO Game Arena */}
          <div
            className={styles.unoArena}
            role="region"
            aria-label="UNO Game Table"
          >
            {/* Opponent: Studio Bot */}
            <div className={styles.opponentsRow} role="group" aria-label="Opponent">
              {(() => {
                const botIdx = 1;
                const isCurrent = gameState.currentPlayer === botIdx;
                const botHandCount = gameState.hands[botIdx].length;
                const hasUno = botHandCount === 1;

                return (
                  <div
                    key={botIdx}
                    className={`${styles.opponentCard} ${
                      isCurrent ? styles.opponentActive : ""
                    }`}
                  >
                    <span className={styles.opponentDot} aria-hidden="true" />
                    <span>{PLAYER_NAMES[botIdx]}</span>
                    <span className={styles.opponentCardsCount}>
                      ({botHandCount.toString().padStart(2, "0")} CARDS)
                    </span>
                    {hasUno && (
                      <span className={styles.opponentUnoBadge}>UNO!</span>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Play Field: Discard, Draw, Status, Actions */}
            <div className={styles.playField}>
              {/* Card Piles */}
              <div className={styles.pilesArea}>
                {/* Draw pile */}
                <div className={styles.pileBox}>
                  <button
                    type="button"
                    className={styles.drawPileBtn}
                    onClick={handleDrawCard}
                    disabled={!isHumanTurn || gameState.phase !== "playing"}
                    aria-label={`Draw card from deck (${gameState.deck.length} remaining)`}
                    data-cursor="hover"
                  >
                    <PlayingCard faceDown width={76} />
                    <span className={styles.pileBadge}>
                      {gameState.deck.length}
                    </span>
                  </button>
                  <span className={styles.pileLabel}>DRAW PILE</span>
                </div>

                {/* Discard pile */}
                <div className={styles.pileBox}>
                  <PlayingCard
                    color={topDiscard.color}
                    value={topDiscard.value}
                    width={82}
                  />
                  <span className={styles.pileLabel}>DISCARD</span>
                </div>
              </div>

              {/* Status and Action Center */}
              <div className={styles.statusCenter}>
                <div className={styles.statusMessage}>
                  {gameState.status ||
                    (gameState.currentPlayer === 0
                      ? "YOUR TURN — PLAY OR DRAW"
                      : `${PLAYER_NAMES[gameState.currentPlayer]}'S TURN...`)}
                </div>

                {notice && <div className={styles.statusNotice}>{notice}</div>}

                {/* Interactive Action Controls */}
                <div className={styles.actionControls}>
                  {/* Wild Color Selection */}
                  {gameState.phase === "color-select" && (
                    <div className={styles.colorPicker} role="group" aria-label="Choose wild card color">
                      <span className={styles.colorPickerLabel}>COLOR:</span>
                      <button
                        type="button"
                        className={`${styles.colorBtn} ${styles.colorBtnRed}`}
                        onClick={() => handleSelectColor("red")}
                        aria-label="Select Red"
                      >
                        RED
                      </button>
                      <button
                        type="button"
                        className={`${styles.colorBtn} ${styles.colorBtnYellow}`}
                        onClick={() => handleSelectColor("yellow")}
                        aria-label="Select Yellow"
                      >
                        YEL
                      </button>
                      <button
                        type="button"
                        className={`${styles.colorBtn} ${styles.colorBtnGreen}`}
                        onClick={() => handleSelectColor("green")}
                        aria-label="Select Green"
                      >
                        GRN
                      </button>
                      <button
                        type="button"
                        className={`${styles.colorBtn} ${styles.colorBtnBlue}`}
                        onClick={() => handleSelectColor("blue")}
                        aria-label="Select Blue"
                      >
                        BLU
                      </button>
                    </div>
                  )}

                  {/* Pass Turn Button (after drawing) */}
                  {gameState.phase === "drew-card" && gameState.currentPlayer === 0 && (
                    <button
                      type="button"
                      className={styles.passBtn}
                      onClick={handlePassTurn}
                      aria-label="Pass your turn"
                      data-cursor="hover"
                    >
                      [ PASS TURN ]
                    </button>
                  )}

                  {/* Call UNO Button */}
                  {gameState.unoWindowOpen && (
                    <button
                      type="button"
                      className={styles.unoCallBtn}
                      onClick={handleCallUno}
                      aria-label="Declare UNO!"
                      data-cursor="hover"
                    >
                      [ 🃏 CALL UNO! ]
                    </button>
                  )}

                  {/* Game Won Restart Button */}
                  {gameState.winner !== null && (
                    <button
                      type="button"
                      className={styles.passBtn}
                      onClick={handleNewGame}
                      aria-label="Play another UNO match"
                      data-cursor="hover"
                    >
                      [ PLAY AGAIN ]
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Human Hand: Animated Card Fan */}
            <div
              className={styles.cardStage}
              role="region"
              aria-label="Your hand cards fan"
            >
              <PlayingCardFan
                cards={humanHand}
                cardWidth={92}
                isMyTurn={isHumanTurn}
                legalCardIds={legalCardIds}
                onPlay={handleCardPlay}
                onAttemptPlay={handleIllegalPlay}
                className={styles.fanWrapper}
              />
            </div>
          </div>

          {/* Stage footer telemetry */}
          <div className={styles.stageFooter}>
            <span>PROTOCOL: 1V1 STRATEGIC DUEL {"//"} STUDIO BOT</span>
            <span>
              DISCARD PILE: {gameState.discard.length} {"//"} ACTIVE COLOR:{" "}
              {gameState.activeColor.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ── Experiment 02: Random Thought Generator ──────────────────── */}
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
