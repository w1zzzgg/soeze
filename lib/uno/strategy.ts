/**
 * Strategic Heuristic Algorithm for 1v1 UNO Bot
 *
 * Runs locally without calling any hosted LLM.
 * Evaluates legitimate public game state and bot's own hand only.
 */

import {
  UnoCard,
  UnoColor,
  isLegal,
  getLegalCards,
  UNO_COLORS,
} from "../uno";

export type BotDifficulty = "easy" | "normal" | "tactical";

export type MoveEvaluation = {
  card: UnoCard;
  score: number;
  reason: string;
};

export type BotDecision = {
  action: "play" | "draw";
  card?: UnoCard;
  chosenColor?: UnoColor;
  reaction?: string;
};

/** Reaction quips generated purely locally */
const BOT_REACTIONS = {
  playDraw2: [
    "Enjoy the extra luggage. +2 for you.",
    "Calculated displacement. Take two cards.",
    "Tactical interference: +2 cards.",
  ],
  playSkip: [
    "Skipped! My turn again.",
    "Turn cancelled. Let me proceed.",
    "Hold on, let me play twice.",
  ],
  playReverse: [
    "In 1v1, reverse is just a skip. My turn again!",
    "Reversing straight back to me.",
    "Ping-pong mechanics: back to my turn.",
  ],
  playWild4: [
    "Critical disruption: +4 cards incoming.",
    "The 1v1 countermeasure: draw 4.",
    "Disrupting your win condition with +4.",
  ],
  callUno: [
    "UNO! One card between me and victory.",
    "Down to my final card. Pay attention.",
    "UNO! Calculating endgame.",
  ],
  normalPlay: [
    "Optimizing hand color distribution.",
    "Matching cadence.",
    "Clean play.",
  ],
  draw: [
    "No legal move. Drawing from the deck...",
    "Re-sampling the protocol.",
    "Drawing a card to rebalance options.",
  ],
};

function getRandomReaction(options: string[]): string {
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Calculates color distribution in hand (excluding wilds)
 */
export function getColorFrequencies(
  hand: readonly UnoCard[]
): Record<UnoColor, number> {
  const counts: Record<UnoColor, number> = {
    red: 0,
    yellow: 0,
    green: 0,
    blue: 0,
  };
  for (const c of hand) {
    if (c.color !== "wild") {
      counts[c.color as UnoColor]++;
    }
  }
  return counts;
}

/**
 * Best color for bot to choose when playing a Wild
 */
export function chooseBestColor(
  hand: readonly UnoCard[],
  excludeCardId?: string
): UnoColor {
  const remainingHand = excludeCardId
    ? hand.filter((c) => c.id !== excludeCardId)
    : hand;

  const frequencies = getColorFrequencies(remainingHand);
  const sorted = (Object.entries(frequencies) as [UnoColor, number][]).sort(
    (a, b) => b[1] - a[1]
  );
  return sorted[0]?.[0] ?? "red";
}

/**
 * Ranks all legal moves using tactical heuristics
 */
export function rankLegalMoves(
  legalMoves: readonly UnoCard[],
  hand: readonly UnoCard[],
  activeColor: UnoColor,
  humanHandCount: number,
  difficulty: BotDifficulty = "tactical"
): MoveEvaluation[] {
  if (legalMoves.length === 0) return [];

  const frequencies = getColorFrequencies(hand);
  const isHumanHighThreat = humanHandCount <= 2;
  const isHumanCritical = humanHandCount === 1;

  return legalMoves.map((card) => {
    let score = 10;
    let reason = "standard move";

    // 1. Color alignment
    const colorCount = card.color !== "wild" ? frequencies[card.color as UnoColor] : 0;
    score += colorCount * 4;

    // 2. Action card handling
    const isAction = ["skip", "reverse", "draw2"].includes(card.value);
    const isWild = card.value === "wild" || card.value === "wild4";

    if (difficulty === "easy") {
      // Random variance for easy difficulty
      score += Math.random() * 20;
      return { card, score, reason: "casual move" };
    }

    if (isHumanCritical) {
      // Urgent: disrupt immediately!
      if (card.value === "wild4") {
        score += 90;
        reason = "critical counter: draw 4 to halt win";
      } else if (card.value === "draw2") {
        score += 85;
        reason = "critical counter: draw 2 to halt win";
      } else if (card.value === "skip" || card.value === "reverse") {
        score += 80;
        reason = "critical skip/reverse: deny final card play";
      } else if (card.value === "wild") {
        // Switch color to human's least likely color (or bot's highest)
        score += 65;
        reason = "critical color shift to disrupt win";
      }
    } else if (isHumanHighThreat) {
      // Human has 2 cards
      if (card.value === "draw2") {
        score += 55;
        reason = "defensive draw 2";
      } else if (card.value === "skip" || card.value === "reverse") {
        score += 50;
        reason = "tempo skip/reverse";
      } else if (card.value === "wild4") {
        score += 45;
        reason = "disruptive wild 4";
      }
    } else {
      // Human has 3+ cards: conserve high-value Wild cards unless advantageous
      if (isWild) {
        if (legalMoves.length > 1) {
          // Penalize spending wilds when standard color matches exist
          score -= 25;
          reason = "conserve wild card for endgame";
        }
      } else if (isAction) {
        score += 20;
        reason = "maintain turn tempo with action card";
      } else {
        // Higher value number cards preferred to shed points if needed
        const numVal = parseInt(card.value, 10);
        if (!isNaN(numVal)) {
          score += numVal * 0.8;
          reason = `shedding high card ${numVal}`;
        }
      }
    }

    // Hand size bonus: playing a card that leaves bot with dominant color
    if (card.color !== "wild" && frequencies[card.color as UnoColor] > 2) {
      score += 15;
    }

    return { card, score, reason };
  }).sort((a, b) => b.score - a.score);
}

/**
 * Decides best move for the bot in a 1v1 match
 */
export function decideBotMove(
  hand: readonly UnoCard[],
  topCard: UnoCard,
  activeColor: UnoColor,
  humanHandCount: number,
  difficulty: BotDifficulty = "tactical"
): BotDecision {
  const legalMoves = getLegalCards(hand, topCard, activeColor);

  if (legalMoves.length === 0) {
    return {
      action: "draw",
      reaction: getRandomReaction(BOT_REACTIONS.draw),
    };
  }

  const ranked = rankLegalMoves(
    legalMoves,
    hand,
    activeColor,
    humanHandCount,
    difficulty
  );

  const best = ranked[0];
  const chosenCard = best.card;
  let chosenColor: UnoColor | undefined;
  let reaction = getRandomReaction(BOT_REACTIONS.normalPlay);

  if (chosenCard.color === "wild") {
    chosenColor = chooseBestColor(hand, chosenCard.id);
  }

  if (chosenCard.value === "draw2") {
    reaction = getRandomReaction(BOT_REACTIONS.playDraw2);
  } else if (chosenCard.value === "skip") {
    reaction = getRandomReaction(BOT_REACTIONS.playSkip);
  } else if (chosenCard.value === "reverse") {
    reaction = getRandomReaction(BOT_REACTIONS.playReverse);
  } else if (chosenCard.value === "wild4") {
    reaction = getRandomReaction(BOT_REACTIONS.playWild4);
  } else if (hand.length === 2) {
    reaction = getRandomReaction(BOT_REACTIONS.callUno);
  }

  return {
    action: "play",
    card: chosenCard,
    chosenColor,
    reaction,
  };
}
