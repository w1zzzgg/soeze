"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { IDEATION_ITEMS, type IdeaItem } from "@/lib/ideation-data";
import styles from "./IdeationCards.module.css";

interface IdeationCardsProps {
  gridId?: string;
}

function renderPillarContent(content: string) {
  const blocks = content.split("\n\n").map((b) => b.trim()).filter(Boolean);
  return (
    <div className={styles.pillarContent}>
      {blocks.map((block, idx) => {
        if (block.includes("\n- ") || block.startsWith("- ")) {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          const intro = lines[0].startsWith("- ") ? null : lines[0];
          const bullets = lines
            .filter((l) => l.startsWith("- "))
            .map((l) => l.replace(/^- /, ""));
          return (
            <div key={idx} className={styles.bulletBlock}>
              {intro && <p className={styles.pillarText}>{intro}</p>}
              <ul className={styles.pillarList}>
                {bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className={styles.pillarListItem}>
                    <span className={styles.bulletDot} aria-hidden="true">—</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        const isNumbered = /^\d+\.\s/.test(block) || /\n\d+\.\s/.test(block);
        if (isNumbered) {
          const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
          const intro = /^\d+\.\s/.test(lines[0]) ? null : lines[0];
          const items = lines
            .filter((l) => /^\d+\.\s/.test(l))
            .map((l) => {
              const match = l.match(/^(\d+)\.\s*(.*)/);
              return {
                num: match ? match[1].padStart(2, "0") : "",
                text: match ? match[2] : l,
              };
            });
          return (
            <div key={idx} className={styles.bulletBlock}>
              {intro && <p className={styles.pillarText}>{intro}</p>}
              <ol className={styles.pillarList}>
                {items.map((item, bIdx) => (
                  <li key={bIdx} className={styles.pillarListItem}>
                    <span className={styles.bulletNumber} aria-hidden="true">
                      {item.num}
                    </span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ol>
            </div>
          );
        }
        return (
          <p key={idx} className={styles.pillarText}>
            {block}
          </p>
        );
      })}
    </div>
  );
}

export default function IdeationCards({ gridId = "ideation-grid" }: IdeationCardsProps) {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modalCloseBtnRef = useRef<HTMLButtonElement>(null);
  const triggerCardRef = useRef<HTMLDivElement | null>(null);

  const [activeIdea, setActiveIdea] = useState<IdeaItem | null>(null);

  // Entrance animation
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      cardsRef.current.forEach((card) => {
        if (card) {
          card.style.opacity = "1";
          card.style.transform = "none";
        }
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const handleOpenIdea = useCallback((idea: IdeaItem, cardEl?: HTMLDivElement | null) => {
    triggerCardRef.current = cardEl ?? null;
    setActiveIdea(idea);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveIdea(null);
    if (triggerCardRef.current) {
      triggerCardRef.current.focus();
    }
  }, []);

  // Keyboard accessibility for modal
  useEffect(() => {
    if (!activeIdea) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleCloseModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = setTimeout(() => {
      modalCloseBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(timer);
    };
  }, [activeIdea, handleCloseModal]);

  const getAccentClass = (accentVar: string) => {
    switch (accentVar) {
      case "lavender":
        return styles.accentLavender;
      case "mint":
        return styles.accentMint;
      case "coral":
        return styles.accentCoral;
      case "lime":
      case "yellow":
        return styles.accentLime;
      default:
        return "";
    }
  };

  return (
    <>
      <div className={styles.grid} id={gridId}>
        {IDEATION_ITEMS.map((idea, i) => {
          const accentClass = getAccentClass(idea.accentVar);
          return (
            <div
              key={idea.id}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className={styles.card}
              role="button"
              tabIndex={0}
              aria-haspopup="dialog"
              aria-expanded={activeIdea?.id === idea.id}
              aria-label={`Open concept panel for ${idea.label}`}
              data-cursor="open"
              onClick={(e) => handleOpenIdea(idea, e.currentTarget)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleOpenIdea(idea, e.currentTarget);
                }
              }}
            >
              {/* Speculative Canvas Banner / Artwork Panel */}
              <div
                className={`${styles.cardVisual} ${accentClass}`}
                style={{ backgroundColor: idea.accentColor }}
              >
                {/* Artwork Image */}
                {idea.image && (
                  <div className={styles.imageWrapper} style={{ position: "absolute", inset: 0 }}>
                    <Image
                      src={idea.image}
                      alt={idea.imageAlt}
                      fill
                      sizes={i === 0 ? "(max-width: 860px) 100vw, 100vw" : "(max-width: 860px) 100vw, 50vw"}
                      quality={95}
                      priority={i === 0}
                      className={styles.cardImage}
                      style={{ objectPosition: idea.imagePosition || "center center" }}
                    />
                  </div>
                )}

                {/* Subtle top scrim to guarantee badge legibility over any photo */}
                <div className={styles.imageScrim} aria-hidden="true" />

                {/* Visual Top Bar */}
                <div className={styles.visualTopBar}>
                  <span className={styles.visualBadge}>
                    {idea.isOpenSlot ? "[ OPEN INVITATION ]" : "[ SPECULATIVE CONCEPT ]"}
                  </span>
                  <span className={styles.visualDomain}>{idea.domain}</span>
                </div>

                {/* Oversized Graphic Watermark */}
                <span className={styles.visualWatermark} aria-hidden="true">
                  {idea.num}
                </span>

                {/* Neo-brutalist corner crosshair */}
                <span
                  className={`${styles.cornerCrosshair} ${styles.crosshairBottomLeft}`}
                  aria-hidden="true"
                >
                  +
                </span>

                {/* Hover overlay */}
                <div className={styles.cardOverlay}>
                  <span className={styles.overlayCue}>
                    {idea.interactionCue}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                {/* Meta Row: Label & Interaction Cue */}
                <div className={styles.cardMetaRow}>
                  <span className={styles.cardLabel}>{idea.label}</span>
                  <span className={styles.interactionCue}>
                    {idea.interactionCue.replace(" ↗", "")}{" "}
                    <span className={styles.interactionArrow} aria-hidden="true">
                      ↗
                    </span>
                  </span>
                </div>

                {idea.category && (
                  <div className={styles.cardCategory}>{idea.category}</div>
                )}

                {/* Headline */}
                <h3 className={styles.cardHeadline}>{idea.headline}</h3>

                {/* Description */}
                <p className={styles.cardDescription}>{idea.description}</p>

                {idea.supportingCopy && (
                  <p className={styles.cardSupportingCopy}>
                    {idea.supportingCopy}
                  </p>
                )}

                {/* Bottom Footer Hint */}
                <div className={styles.cardFooterHint}>
                  <span>{idea.footerHint || "IDEATION / SPECULATIVE DEBRIEF"}</span>
                  <span className={styles.hintAction}>
                    {idea.isOpenSlot ? "YOUR IDEA COULD LIVE HERE →" : "CLICK TO EXPAND CONCEPT →"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Concept Panel Modal */}
      {activeIdea && (
        <div
          className={styles.modalBackdrop}
          onClick={handleCloseModal}
          role="presentation"
        >
          <div
            className={styles.modalContent}
            role="dialog"
            aria-modal="true"
            aria-labelledby="concept-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header with Card Accent */}
            <div
              className={`${styles.modalHeader} ${getAccentClass(activeIdea.accentVar)}`}
              style={{ backgroundColor: activeIdea.accentColor }}
            >
              <span className={styles.modalHeaderLabel}>
                [ 05 ] CONCEPT DEBRIEF // {activeIdea.label}
              </span>
              <button
                ref={modalCloseBtnRef}
                type="button"
                className={styles.modalCloseBtn}
                onClick={handleCloseModal}
                aria-label="Close concept debrief panel"
                data-cursor="hover"
              >
                <span>CLOSE [ESC]</span>
                <span aria-hidden="true">✕</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className={styles.modalBody}>
              {(activeIdea.category || activeIdea.status) && (
                <div className={styles.modalMetaRow}>
                  {activeIdea.category && (
                    <span className={styles.modalCategoryTag}>
                      {activeIdea.category}
                    </span>
                  )}
                  {activeIdea.status && (
                    <span className={styles.modalStatusTag}>
                      [ STATUS: {activeIdea.status} ]
                    </span>
                  )}
                </div>
              )}

              <h3 id="concept-modal-title" className={styles.modalHeadline}>
                {activeIdea.emptyState?.headline || activeIdea.headline}
              </h3>

              {activeIdea.emptyState ? (
                <div className={styles.emptyStateContainer}>
                  <div className={styles.emptyStateCard}>
                    {activeIdea.emptyState.body.split("\n\n").map((para, pIdx) => (
                      <p key={pIdx} className={styles.emptyStatePara}>
                        {para}
                      </p>
                    ))}
                  </div>

                  {activeIdea.emptyState.closingLine && (
                    <div className={styles.emptyStateClosing}>
                      {activeIdea.emptyState.closingLine}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {activeIdea.supportingStatement ? (
                    <>
                      <p className={styles.modalSummary}>
                        &ldquo;{activeIdea.supportingStatement}&rdquo;
                      </p>
                      <p className={styles.modalSubSummary}>
                        {activeIdea.description}
                      </p>
                    </>
                  ) : (
                    <p className={styles.modalSummary}>{activeIdea.description}</p>
                  )}

                  {/* Three Concept Pillars */}
                  {activeIdea.debrief && (
                    <div className={styles.conceptPillars}>
                      <div className={styles.pillarCard}>
                        <div className={styles.pillarHeader}>
                          <span className={styles.pillarIndex}>01</span>
                          <h4 className={styles.pillarTitle}>
                            THE PROBLEM OR OPPORTUNITY
                          </h4>
                        </div>
                        {renderPillarContent(activeIdea.debrief.problem)}
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarHeader}>
                          <span className={styles.pillarIndex}>02</span>
                          <h4 className={styles.pillarTitle}>THE PROPOSED IDEA</h4>
                        </div>
                        {renderPillarContent(activeIdea.debrief.solution)}
                      </div>

                      <div className={styles.pillarCard}>
                        <div className={styles.pillarHeader}>
                          <span className={styles.pillarIndex}>03</span>
                          <h4 className={styles.pillarTitle}>
                            HOW SOEZE COULD APPROACH IT
                          </h4>
                        </div>
                        {renderPillarContent(activeIdea.debrief.approach)}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <span className={styles.modalDisclaimer}>
                {activeIdea.emptyState
                  ? "OPEN INVITATION // NO CONCEPT. NO PRETENDING."
                  : "SPECULATIVE CONCEPT // OPEN FOR EXPLORATION & COLLABORATION"}
              </span>

              <div className={styles.modalActions}>
                <a
                  href={activeIdea.emptyState?.ctaHref || "#contact"}
                  className={styles.modalTalkBtn}
                  onClick={handleCloseModal}
                  data-cursor="hover"
                >
                  <span>
                    {activeIdea.emptyState?.ctaLabel || "LET'S TALK ABOUT THIS ↗"}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
