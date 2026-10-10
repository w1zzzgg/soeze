/**
 * UNO Game Engine — 1v1 Protocol
 * Pure TypeScript — no React dependencies.
 * Standard 108-card deck with complete 1 human vs. 1 bot rules.
 */

import { decideBotMove, chooseBestColor } from "./uno/strategy";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UnoColor = "red" | "yellow" | "green" | "blue";
export type UnoCardColor = UnoColor | "wild";

export type UnoValue =
  | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
  | "skip" | "reverse" | "draw2" | "wild" | "wild4";

export type UnoCard = {
  readonly id: string;
  readonly color: UnoCardColor;
  readonly value: UnoValue;
};

/** playing = normal turn, drew-card = human drew and may play it, color-select = wild pending, won = game over */
export type GamePhase = "playing" | "drew-card" | "color-select" | "won";

export const PLAYER_NAMES = ["YOU", "STUDIO_BOT"] as const;
export type PlayerName = (typeof PLAYER_NAMES)[number];

export type GameState = {
  readonly phase: GamePhase;
  readonly deck: readonly UnoCard[];
  readonly discard: readonly UnoCard[];
  /** hands[0] = human; hands[1] = bot */
  readonly hands: readonly [
    readonly UnoCard[],
    readonly UnoCard[]
  ];
  readonly currentPlayer: number;
  readonly direction: 1 | -1;
  readonly activeColor: UnoColor;
  readonly winner: number | null;
  readonly status: string;
  /** true when human has played down to 1 card and must press UNO */
  readonly unoWindowOpen: boolean;
  /** card just drawn by the human; null otherwise */
  readonly drawnCard: UnoCard | null;
  /** wild / wild4 card pending a color choice from the human */
  readonly pendingWild: UnoCard | null;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const UNO_COLORS: readonly UnoColor[] = ["red", "yellow", "green", "blue"];

const COLOR_VALUES: readonly UnoValue[] = [
  "0",
  "1", "1",
  "2", "2",
  "3", "3",
  "4", "4",
  "5", "5",
  "6", "6",
  "7", "7",
  "8", "8",
  "9", "9",
  "skip", "skip",
  "reverse", "reverse",
  "draw2", "draw2",
];

// ─── Deck ─────────────────────────────────────────────────────────────────────

function buildDeck(): UnoCard[] {
  let n = 0;
  const cards: UnoCard[] = [];

  for (const color of UNO_COLORS) {
    for (const value of COLOR_VALUES) {
      cards.push({ id: `u${n++}`, color, value });
    }
  }
  for (let i = 0; i < 4; i++) {
    cards.push({ id: `u${n++}`, color: "wild", value: "wild" });
    cards.push({ id: `u${n++}`, color: "wild", value: "wild4" });
  }
  // 4 × 25 + 8 = 108 cards ✓
  return cards;
}

/** Mulberry32 PRNG for deterministic pseudo-random sequences. */
export function createPrng(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const DETERMINISTIC_SEED = 0x50e2e; // "SOEZE"

export function shuffle<T>(arr: readonly T[], rng: () => number = Math.random): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Deck refill (reshuffle discard into draw pile) ───────────────────────────

function refill(
  deck: readonly UnoCard[],
  discard: readonly UnoCard[]
): { deck: UnoCard[]; discard: UnoCard[] } {
  if (deck.length > 4 || discard.length <= 1) {
    return { deck: [...deck], discard: [...discard] };
  }
  const top = discard[discard.length - 1];
  const rest = shuffle(discard.slice(0, discard.length - 1));
  return { deck: [...deck, ...rest], discard: [top] };
}

// ─── Player index helpers (1v1) ───────────────────────────────────────────────

function advance(from: number, _dir: 1 | -1, steps = 1): number {
  return ((from + steps) % 2 + 2) % 2;
}

// ─── Legal play check ─────────────────────────────────────────────────────────

export function isLegal(
  card: UnoCard,
  topCard: UnoCard,
  activeColor: UnoColor,
  hand: readonly UnoCard[]
): boolean {
  if (card.value === "wild") return true;
  if (card.value === "wild4") {
    // Only legal if no card in hand matches active color
    return !hand.some((c) => c.id !== card.id && c.color === activeColor);
  }
  return card.color === activeColor || card.value === topCard.value;
}

export function getLegalCards(
  hand: readonly UnoCard[],
  topCard: UnoCard,
  activeColor: UnoColor
): UnoCard[] {
  return hand.filter((c) => isLegal(c, topCard, activeColor, hand));
}

// ─── Game initialisation ──────────────────────────────────────────────────────

export function initGame(randomize = false): GameState {
  const rng = randomize ? Math.random : createPrng(DETERMINISTIC_SEED);
  const pool = shuffle(buildDeck(), rng);
  const hands: [UnoCard[], UnoCard[]] = [[], []];

  // Deal 7 cards each to human (0) and bot (1)
  for (let round = 0; round < 7; round++) {
    for (let p = 0; p < 2; p++) {
      hands[p].push(pool.shift()!);
    }
  }

  // Starting card must be a plain number card (no action/wild)
  let startCard: UnoCard | undefined;
  for (let i = 0; i < pool.length; i++) {
    const c = pool[i];
    if (!["skip", "reverse", "draw2", "wild", "wild4"].includes(c.value)) {
      startCard = c;
      pool.splice(i, 1);
      break;
    }
  }
  if (!startCard) {
    startCard = pool.shift()!;
  }

  return {
    phase: "playing",
    deck: pool,
    discard: [startCard],
    hands,
    currentPlayer: 0,
    direction: 1,
    activeColor: startCard.color as UnoColor,
    winner: null,
    status: "YOUR TURN // 1v1 MATCH",
    unoWindowOpen: false,
    drawnCard: null,
    pendingWild: null,
  };
}

// ─── Apply a card play ────────────────────────────────────────────────────────

export function formatCardName(card: UnoCard): string {
  if (card.value === "wild") return "WILD";
  if (card.value === "wild4") return "WILD DRAW 4";
  const color = card.color.toUpperCase();
  const val =
    card.value === "draw2"
      ? "+2"
      : card.value === "skip"
      ? "SKIP"
      : card.value === "reverse"
      ? "REVERSE"
      : card.value;
  return `${color} ${val}`;
}

/**
 * Apply a card play from `playerIndex`. In 2-player UNO:
 * - Reverse behaves like a Skip (player takes another turn)
 * - Skip skips the opponent (player takes another turn)
 * - Draw 2 skips the opponent (player takes another turn)
 * - Wild Draw 4 skips the opponent (player takes another turn)
 */
export function applyPlay(
  state: GameState,
  playerIndex: number,
  card: UnoCard,
  chosenColor?: UnoColor
): GameState {
  // Remove card from player hand
  const newHands = state.hands.map((h, i) =>
    i === playerIndex ? h.filter((c) => c.id !== card.id) : [...h]
  ) as [UnoCard[], UnoCard[]];

  let currentDeck = [...state.deck];
  let currentDiscard = [...state.discard, card];

  // Win check — must happen after removing the card
  if (newHands[playerIndex].length === 0) {
    return {
      ...state,
      hands: newHands,
      discard: currentDiscard,
      winner: playerIndex,
      phase: "won",
      status:
        playerIndex === 0
          ? "YOU WIN! 🎉 MATCH COMPLETED"
          : `${PLAYER_NAMES[playerIndex]} WINS! 🤖`,
      drawnCard: null,
      unoWindowOpen: false,
      pendingWild: null,
    };
  }

  let dir = state.direction;
  const activeColor: UnoColor =
    chosenColor ??
    (card.color !== "wild" ? (card.color as UnoColor) : state.activeColor);

  let next = advance(playerIndex, dir);
  let phase: GamePhase = "playing";
  let pendingWild: UnoCard | null = null;
  let workHands = [...newHands] as [UnoCard[], UnoCard[]];
  let status = `${PLAYER_NAMES[playerIndex]} PLAYED ${formatCardName(card)}`;

  switch (card.value) {
    case "reverse": {
      // In 2-player UNO, reverse functions identically to skip!
      dir = (dir === 1 ? -1 : 1) as 1 | -1;
      next = playerIndex; // Player immediately takes another turn
      status += " — 1v1 REVERSE: PLAY AGAIN!";
      break;
    }
    case "skip": {
      // In 2-player UNO, skip gives player another consecutive turn
      next = playerIndex;
      status += ` — ${PLAYER_NAMES[1 - playerIndex]} SKIPPED! PLAY AGAIN!`;
      break;
    }
    case "draw2": {
      const target = 1 - playerIndex;
      ({ deck: currentDeck, discard: currentDiscard } = refill(currentDeck, currentDiscard));
      const drawn = currentDeck.slice(0, Math.min(2, currentDeck.length));
      currentDeck = currentDeck.slice(drawn.length);
      workHands = workHands.map((h, i) =>
        i === target ? [...h, ...drawn] : h
      ) as typeof workHands;
      // In 2-player UNO, draw 2 also skips opponent's turn
      next = playerIndex;
      status += ` — ${PLAYER_NAMES[target]} DREW 2 & SKIPPED!`;
      break;
    }
    case "wild": {
      if (playerIndex === 0 && chosenColor === undefined) {
        phase = "color-select";
        next = playerIndex; // stay until color chosen
        pendingWild = card;
        status = "CHOOSE A COLOR FOR WILD";
      } else {
        status += ` — COLOR: ${activeColor.toUpperCase()}`;
      }
      break;
    }
    case "wild4": {
      if (playerIndex === 0 && chosenColor === undefined) {
        phase = "color-select";
        next = playerIndex;
        pendingWild = card;
        status = "CHOOSE A COLOR FOR WILD DRAW 4";
      } else {
        const target = 1 - playerIndex;
        ({ deck: currentDeck, discard: currentDiscard } = refill(currentDeck, currentDiscard));
        const drawn = currentDeck.slice(0, Math.min(4, currentDeck.length));
        currentDeck = currentDeck.slice(drawn.length);
        workHands = workHands.map((h, i) =>
          i === target ? [...h, ...drawn] : h
        ) as typeof workHands;
        // In 2-player UNO, wild 4 also skips opponent's turn
        next = playerIndex;
        status += ` — ${PLAYER_NAMES[target]} DREW 4 & SKIPPED! COLOR: ${activeColor.toUpperCase()}`;
      }
      break;
    }
  }

  if (workHands[playerIndex].length === 1) {
    if (playerIndex === 0) {
      status += " — MUST DECLARE UNO!";
    } else {
      status += " — UNO! 🃏";
    }
  }

  // UNO window: human just played down to exactly 1 card
  const unoWindowOpen =
    phase === "playing" && playerIndex === 0 && workHands[0].length === 1;

  return {
    phase,
    deck: currentDeck,
    discard: currentDiscard,
    hands: workHands,
    currentPlayer: next,
    direction: dir,
    activeColor,
    winner: null,
    status,
    unoWindowOpen,
    drawnCard: null,
    pendingWild,
  };
}

// ─── Resolve colour choice (human played wild) ────────────────────────────────

export function resolveColor(state: GameState, color: UnoColor): GameState {
  const { pendingWild, currentPlayer, direction } = state;
  if (!pendingWild) return state;

  let currentDeck = [...state.deck];
  let currentDiscard = [...state.discard];
  let workHands = state.hands.map((h) => [...h]) as unknown as GameState["hands"];
  let next = advance(currentPlayer, direction);
  let status = `WILD COLOR CHOSEN: ${color.toUpperCase()}`;

  if (pendingWild.value === "wild4") {
    const target = 1 - currentPlayer;
    ({ deck: currentDeck, discard: currentDiscard } = refill(currentDeck, currentDiscard));
    const drawn = currentDeck.slice(0, Math.min(4, currentDeck.length));
    currentDeck = currentDeck.slice(drawn.length);
    workHands = workHands.map((h, i) =>
      i === target ? [...h, ...drawn] : h
    ) as unknown as GameState["hands"];
    // In 2-player UNO, wild 4 skips opponent
    next = currentPlayer;
    status += ` — ${PLAYER_NAMES[target]} DREW 4 & SKIPPED!`;
  }

  const unoWindowOpen = workHands[0].length === 1;
  if (unoWindowOpen) {
    status += " — MUST DECLARE UNO!";
  }

  return {
    ...state,
    phase: "playing",
    deck: currentDeck,
    discard: currentDiscard,
    hands: workHands,
    currentPlayer: next,
    activeColor: color,
    pendingWild: null,
    unoWindowOpen,
    status,
  };
}

// ─── Draw a card ──────────────────────────────────────────────────────────────

export function drawCard(state: GameState, playerIndex: number): GameState {
  const { deck: currentDeck, discard: currentDiscard } = refill(state.deck, state.discard);

  if (currentDeck.length === 0) {
    return { ...state, status: "DECK EMPTY" };
  }

  const [drawn, ...rest] = currentDeck;
  const newHands = state.hands.map((h, i) =>
    i === playerIndex ? [...h, drawn] : h
  ) as unknown as GameState["hands"];

  // Human enters drew-card phase; bot stays in playing
  const phase: GamePhase = playerIndex === 0 ? "drew-card" : "playing";

  return {
    ...state,
    deck: rest,
    discard: currentDiscard,
    hands: newHands,
    phase,
    drawnCard: playerIndex === 0 ? drawn : null,
    status: playerIndex === 0 ? "DREW A CARD — PLAY OR PASS" : state.status,
  };
}

// ─── Pass turn ────────────────────────────────────────────────────────────────

export function passTurn(state: GameState): GameState {
  return {
    ...state,
    phase: "playing",
    currentPlayer: 1 - state.currentPlayer,
    drawnCard: null,
    unoWindowOpen: false,
    status: "",
  };
}

// ─── UNO declaration ──────────────────────────────────────────────────────────

export function declareUno(state: GameState): GameState {
  return { ...state, unoWindowOpen: false, status: "UNO! 🃏" };
}

/** Penalty for missing UNO declaration: draw 2 cards */
export function applyUnoPenalty(state: GameState): GameState {
  let s = drawCard(state, 0);
  s = drawCard({ ...s, phase: "playing", drawnCard: null }, 0);
  return {
    ...s,
    phase: "playing",
    drawnCard: null,
    unoWindowOpen: false,
    status: "TOO SLOW — DREW 2 PENALTY CARDS",
  };
}

// ─── AI Opponent Turn (Heuristic Local Strategy) ──────────────────────────────

/** Executes an automated strategic turn for the bot opponent. */
export function botTakeTurn(state: GameState): GameState {
  const bot = state.currentPlayer;
  if (bot !== 1 || state.winner !== null || state.phase !== "playing") {
    return state;
  }
  const hand = state.hands[1];
  const top = state.discard[state.discard.length - 1];
  const humanCardCount = state.hands[0].length;

  const decision = decideBotMove(hand, top, state.activeColor, humanCardCount, "tactical");

  if (decision.action === "play" && decision.card) {
    const afterPlay = applyPlay(state, 1, decision.card, decision.chosenColor);
    if (decision.reaction) {
      return {
        ...afterPlay,
        status: `${afterPlay.status} [ ${decision.reaction} ]`,
      };
    }
    return afterPlay;
  }

  // No legal move: bot draws a card
  const drewState = drawCard(state, 1);
  const newHand = drewState.hands[1];
  const drawn = newHand[newHand.length - 1];

  // If newly drawn card is legal, bot may play it immediately
  if (drawn && isLegal(drawn, top, drewState.activeColor, newHand)) {
    const chosenColor = drawn.color === "wild" ? chooseBestColor(newHand, drawn.id) : undefined;
    const played = applyPlay(drewState, 1, drawn, chosenColor);
    return {
      ...played,
      status: `${played.status} [ Drew and played immediately! ]`,
    };
  }

  // Otherwise, pass turn back to human
  const passed = passTurn(drewState);
  return {
    ...passed,
    status: `${PLAYER_NAMES[1]} DREW A CARD AND PASSED [ ${decision.reaction || "No legal move"} ]`,
  };
}
