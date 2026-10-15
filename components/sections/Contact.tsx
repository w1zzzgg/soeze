"use client";

import { useRef, useEffect, useState, useId } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { siteConfig } from "@/lib/site-config";
import MagneticButton from "@/components/ui/MagneticButton";
import SectionLabel from "@/components/ui/SectionLabel";
import styles from "./Contact.module.css";

const PROJECT_TYPES = [
  "AI AUTOMATIONS",
  "AI CHATBOTS",
  "AI ADS",
  "CREATIVE DESIGN",
  "DIGITAL MARKETING",
  "SOMETHING ELSE",
] as const;

type ProjectType = (typeof PROJECT_TYPES)[number];
type SubmitStatus = "idle" | "loading" | "success" | "error";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateClient(fields: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}): string | null {
  if (fields.name.trim().length < 2) return "Name must be at least 2 characters.";
  if (fields.name.trim().length > 100) return "Name is too long.";
  if (!EMAIL_REGEX.test(fields.email.trim())) return "Please enter a valid email address.";
  if (fields.email.trim().length > 254) return "Email is too long.";
  if (!PROJECT_TYPES.includes(fields.projectType as ProjectType))
    return "Please select a project type.";
  if (fields.message.trim().length < 10) return "Message must be at least 10 characters.";
  if (fields.message.trim().length > 5000) return "Message is too long (max 5,000 characters).";
  return null;
}

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    projectType: "" as string,
    message: "",
    website: "", // honeypot — hidden from real users
  });

  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Headline entrance animation
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lines = headlineRef.current?.querySelectorAll(`.${styles.headlineLine}`);
      if (lines) {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          {
            yPercent: 0,
            stagger: 0.1,
            duration: 1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: headlineRef.current,
              start: "top 80%",
              once: true,
            },
          }
        );
      }
    }, headlineRef);

    return () => ctx.revert();
  }, []);

  // GSAP success animation — runs when status changes to "success"
  useEffect(() => {
    if (status !== "success" || !successRef.current) return;

    gsap.fromTo(
      successRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );

    // Animate the success icon border
    const icon = successRef.current.querySelector(`.${styles.successIcon}`);
    if (icon) {
      gsap.fromTo(
        icon,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, delay: 0.15, ease: "back.out(1.7)" }
      );
    }

    // Reset form after 3 seconds
    const timer = setTimeout(() => {
      setFormState({ name: "", email: "", projectType: "", message: "", website: "" });
      setStatus("idle");
      setErrorMsg(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent double submission
    if (status === "loading") return;

    setErrorMsg(null);

    // Client-side validation
    const clientError = validateClient(formState);
    if (clientError) {
      setErrorMsg(clientError);
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          projectType: formState.projectType,
          message: formState.message.trim(),
          website: formState.website, // honeypot — server checks this
        }),
      });

      const data = (await res.json()) as { success: boolean; error?: string };

      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Try again in a moment.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("COULDN'T SEND. CHECK YOUR CONNECTION AND TRY AGAIN.");
    }
  };

  const isLoading = status === "loading";
  const isSuccess = status === "success";

  const submitLabel =
    status === "loading"
      ? "SENDING..."
      : status === "success"
        ? "MESSAGE SENT ✓"
        : "SEND MESSAGE ↗";

  return (
    <section
      ref={sectionRef}
      className={`section ${styles.contact}`}
      id="contact"
      aria-label="Contact section"
    >
      {/* Halftone decorative bg */}
      <div className={styles.halftoneBg} aria-hidden="true" />

      <div className="container">
        <SectionLabel index="06">CONTACT</SectionLabel>

        <div className={styles.layout}>
          {/* Left: headline + social */}
          <div className={styles.left}>
            <h2 ref={headlineRef} className={styles.headline}>
              {siteConfig.contact.headline.map((line, i) => (
                <div key={i} className={styles.headlineWrapper}>
                  <div className={`${styles.headlineLine} text-display`}>
                    {line}
                  </div>
                </div>
              ))}
            </h2>

            <p className={`text-body ${styles.subtext}`}>
              {siteConfig.contact.subtext}
            </p>

            {/* Email */}
            <MagneticButton
              href={`mailto:${siteConfig.email}`}
              className={styles.emailLink}
              strength={0.3}
              dataCursor="external"
            >
              {/* REPLACE_ME: Replace with real email address in lib/site-config.ts */}
              {siteConfig.email}
            </MagneticButton>

            {/* Social */}
            <div className={styles.socials}>
              <span className={styles.socialTitle}>FIND ME AT</span>
              <div className={styles.socialLinks}>
                <MagneticButton
                  href={siteConfig.social.github}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="GitHub"
                  dataCursor="external"
                >
                  GITHUB ↗
                </MagneticButton>
                <MagneticButton
                  href={siteConfig.social.instagram}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Instagram"
                  dataCursor="external"
                >
                  INSTAGRAM ↗
                </MagneticButton>
                <MagneticButton
                  href={siteConfig.social.linkedin}
                  className={styles.socialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="LinkedIn"
                  dataCursor="external"
                >
                  LINKEDIN ↗
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Right: contact form */}
          <div className={styles.right}>
            <div ref={formCardRef} className={styles.formCard}>
              <div className={styles.formHeader}>
                <span className={styles.formTitle}>START A PROJECT</span>
              </div>

              {isSuccess ? (
                <div ref={successRef} className={styles.successMessage} role="status" aria-live="polite">
                  <div className={styles.successIcon} aria-hidden="true">✓</div>
                  <div className={styles.successText}>
                    MESSAGE SENT.
                    <br />
                    I&apos;LL BE IN TOUCH.
                  </div>
                  <p className={styles.successSubtext}>
                    Message received. I&apos;ll get back to you soon.
                  </p>
                </div>
              ) : (
                <form
                  className={styles.form}
                  onSubmit={handleSubmit}
                  aria-label="Contact form"
                  noValidate
                >
                  {/* Honeypot — hidden from real users, filled by bots */}
                  <div aria-hidden="true" className={styles.honeypot}>
                    <label htmlFor={`${id}-website`}>Website</label>
                    <input
                      id={`${id}-website`}
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formState.website}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, website: e.target.value }))
                      }
                    />
                  </div>

                  {/* Name */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${id}-name`} className={styles.fieldLabel}>
                      NAME
                    </label>
                    <input
                      id={`${id}-name`}
                      type="text"
                      placeholder="YOUR NAME"
                      className={`input-brutal ${styles.field}`}
                      value={formState.name}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, name: e.target.value }))
                      }
                      maxLength={100}
                      required
                      aria-required="true"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Email */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${id}-email`} className={styles.fieldLabel}>
                      EMAIL
                    </label>
                    <input
                      id={`${id}-email`}
                      type="email"
                      placeholder="YOUR EMAIL"
                      className={`input-brutal ${styles.field}`}
                      value={formState.email}
                      onChange={(e) =>
                        setFormState((p) => ({ ...p, email: e.target.value }))
                      }
                      maxLength={254}
                      required
                      aria-required="true"
                      disabled={isLoading}
                    />
                  </div>

                  {/* Project type */}
                  <div className={styles.fieldGroup}>
                    <span
                      id={`${id}-project-label`}
                      className={styles.fieldLabel}
                    >
                      PROJECT TYPE
                    </span>
                    <div
                      className={styles.typeGrid}
                      role="radiogroup"
                      aria-labelledby={`${id}-project-label`}
                    >
                      {PROJECT_TYPES.map((type) => {
                        const isActive = formState.projectType === type;
                        return (
                          <button
                            key={type}
                            type="button"
                            role="radio"
                            aria-checked={isActive}
                            className={`${styles.typeBtn} ${
                              isActive ? styles.typeBtnActive : ""
                            }`}
                            onClick={() =>
                              setFormState((p) => ({ ...p, projectType: type }))
                            }
                            disabled={isLoading}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Message */}
                  <div className={styles.fieldGroup}>
                    <label htmlFor={`${id}-message`} className={styles.fieldLabel}>
                      MESSAGE
                    </label>
                    <textarea
                      id={`${id}-message`}
                      placeholder="TELL ME ABOUT YOUR PROJECT..."
                      className={`input-brutal ${styles.field} ${styles.textarea}`}
                      rows={4}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState((p) => ({
                          ...p,
                          message: e.target.value,
                        }))
                      }
                      maxLength={5000}
                      required
                      aria-required="true"
                      disabled={isLoading}
                    />
                    {formState.message.length > 4500 && (
                      <span className={styles.charCount} aria-live="polite">
                        {5000 - formState.message.length} characters remaining
                      </span>
                    )}
                  </div>

                  {/* Inline error */}
                  {errorMsg && (
                    <div
                      className={styles.errorMsg}
                      role="alert"
                      aria-live="assertive"
                    >
                      {errorMsg}
                    </div>
                  )}

                  {/* Submit button — using a plain <button> to support ref + disabled */}
                  <button
                    ref={submitBtnRef}
                    type="submit"
                    className={`btn btn-filled ${styles.submitBtn} ${
                      isLoading ? styles.submitBtnLoading : ""
                    }`}
                    disabled={isLoading}
                    aria-label={isLoading ? "Sending message..." : "Send message"}
                    aria-busy={isLoading}
                  >
                    <span>{submitLabel}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
