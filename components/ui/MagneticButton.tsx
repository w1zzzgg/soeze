"use client";

import { useRef, useEffect, ReactNode, MouseEvent } from "react";
import Link from "next/link";
import { createMagneticEffect } from "@/lib/animation";
import styles from "./MagneticButton.module.css";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  href?: string;
  onClick?: (e: MouseEvent<HTMLElement>) => void;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  dataCursor?: string;
  type?: "button" | "submit" | "reset";
}

export default function MagneticButton({
  children,
  className = "",
  strength = 0.3,
  href,
  onClick,
  target,
  rel,
  ariaLabel,
  dataCursor = "hover",
  type = "button",
}: MagneticButtonProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // Skip on touch devices
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;

    const cleanup = createMagneticEffect(ref.current, strength);
    return cleanup;
  }, [strength]);

  if (href) {
    const isInternal = href.startsWith("/") && !href.startsWith("//");
    const isPlaceholder = href.includes("REPLACE_ME");

    const handleAnchorClick = (e: MouseEvent<HTMLAnchorElement>) => {
      if (isPlaceholder) {
        e.preventDefault();
        console.info(`[REPLACE_ME] Placeholder link clicked: ${href}`);
      }
      onClick?.(e);
    };

    if (isInternal) {
      return (
        <Link
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          className={`${styles.magnetic} ${className}`}
          aria-label={ariaLabel}
          data-cursor={dataCursor}
          onClick={handleAnchorClick}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={isPlaceholder ? "#" : href}
        className={`${styles.magnetic} ${className}`}
        target={target ?? "_blank"}
        rel={rel ?? "noopener noreferrer"}
        aria-label={ariaLabel}
        data-cursor={dataCursor}
        onClick={handleAnchorClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      className={`${styles.magnetic} ${className}`}
      aria-label={ariaLabel}
      data-cursor={dataCursor}
    >
      {children}
    </button>
  );
}
