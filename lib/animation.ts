import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins on the client side
export function registerGSAP() {
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }
}

// Text reveal animation using clip-path
export function revealText(
  targets: gsap.TweenTarget,
  options: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    yPercent: 110,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.08,
    ...options,
  });
}

// Clip path reveal (from bottom)
export function clipReveal(
  targets: gsap.TweenTarget,
  options: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    clipPath: "inset(100% 0% 0% 0%)",
    duration: 1.1,
    ease: "power4.out",
    stagger: 0.1,
    ...options,
  });
}

// Fade up
export function fadeUp(
  targets: gsap.TweenTarget,
  options: gsap.TweenVars = {}
) {
  return gsap.from(targets, {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: "power2.out",
    stagger: 0.05,
    ...options,
  });
}

// Number counter animation
export function animateNumber(
  element: HTMLElement,
  target: number,
  options: { duration?: number; prefix?: string; suffix?: string } = {}
) {
  const { duration = 2, prefix = "", suffix = "" } = options;
  const obj = { val: 0 };
  return gsap.to(obj, {
    val: target,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = prefix + Math.round(obj.val).toString() + suffix;
    },
  });
}

// Magnetic button effect — cadence-aware with zero reflows on move
export function createMagneticEffect(
  el: HTMLElement,
  strength: number = 0.3
) {
  if (
    typeof window !== "undefined" &&
    (window.matchMedia("(hover: none)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches)
  ) {
    return () => {};
  }

  // Pre-allocated gsap.quickTo tweens for buttery 120Hz/144Hz tracking without GC churn
  const xTo = gsap.quickTo(el, "x", { duration: 0.25, ease: "power2.out" });
  const yTo = gsap.quickTo(el, "y", { duration: 0.25, ease: "power2.out" });

  let centerX = 0;
  let centerY = 0;

  const handleMouseEnter = () => {
    const currentX = (gsap.getProperty(el, "x") as number) || 0;
    const currentY = (gsap.getProperty(el, "y") as number) || 0;
    const rect = el.getBoundingClientRect();
    centerX = rect.left - currentX + rect.width / 2;
    centerY = rect.top - currentY + rect.height / 2;
  };

  const handleMouseMove = (e: MouseEvent) => {
    // If entered without triggering mouseenter (e.g. scroll onto cursor)
    if (centerX === 0 && centerY === 0) {
      handleMouseEnter();
    }

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    const maxOffset = 18;
    const targetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * strength));
    const targetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * strength));

    xTo(targetX);
    yTo(targetY);
  };

  const handleMouseLeave = () => {
    xTo(0);
    yTo(0);
    centerX = 0;
    centerY = 0;
  };

  const handleClick = () => {
    xTo(0);
    yTo(0);
  };

  el.addEventListener("mouseenter", handleMouseEnter, { passive: true });
  el.addEventListener("mousemove", handleMouseMove, { passive: true });
  el.addEventListener("mouseleave", handleMouseLeave, { passive: true });
  el.addEventListener("click", handleClick, { passive: true });

  return () => {
    el.removeEventListener("mouseenter", handleMouseEnter);
    el.removeEventListener("mousemove", handleMouseMove);
    el.removeEventListener("mouseleave", handleMouseLeave);
    el.removeEventListener("click", handleClick);
    gsap.killTweensOf(el);
  };
}

// Smooth scroll to element — synchronised with Lenis if available
export function scrollTo(target: string | HTMLElement) {
  if (typeof window !== "undefined") {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (t: string | HTMLElement, opts: unknown) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { duration: 1.15, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      return;
    }
  }

  gsap.to(window, {
    duration: 1.15,
    scrollTo: target,
    ease: "power3.inOut",
  });
}
