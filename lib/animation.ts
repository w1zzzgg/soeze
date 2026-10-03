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

// Magnetic button effect — dynamically calculated relative to current transform
export function createMagneticEffect(
  el: HTMLElement,
  strength: number = 0.3
) {
  const handleMouseMove = (e: MouseEvent) => {
    // Current GSAP translation
    const currentX = (gsap.getProperty(el, "x") as number) || 0;
    const currentY = (gsap.getProperty(el, "y") as number) || 0;
    const rect = el.getBoundingClientRect();

    // Untransformed center coordinate relative to viewport
    const centerX = rect.left - currentX + rect.width / 2;
    const centerY = rect.top - currentY + rect.height / 2;

    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;

    // Clamp translation to prevent detachment / oscillation
    const maxOffset = 18;
    const targetX = Math.max(-maxOffset, Math.min(maxOffset, deltaX * strength));
    const targetY = Math.max(-maxOffset, Math.min(maxOffset, deltaY * strength));

    gsap.to(el, {
      x: targetX,
      y: targetY,
      duration: 0.25,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.35,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleClick = () => {
    // Return to resting position immediately upon clicking so navigation is never blocked
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.15,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  el.addEventListener("mousemove", handleMouseMove);
  el.addEventListener("mouseleave", handleMouseLeave);
  el.addEventListener("click", handleClick);

  return () => {
    el.removeEventListener("mousemove", handleMouseMove);
    el.removeEventListener("mouseleave", handleMouseLeave);
    el.removeEventListener("click", handleClick);
    gsap.killTweensOf(el);
  };
}

// Smooth scroll to element
export function scrollTo(target: string | HTMLElement) {
  gsap.to(window, {
    duration: 1.2,
    scrollTo: target,
    ease: "power3.inOut",
  });
}
