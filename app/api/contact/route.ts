// =============================================================================
// SOEZE Contact API Route — /api/contact
// =============================================================================
// Uses Resend to deliver contact form submissions to the site owner.
//
// REPLACE_ME — CONTACT EMAIL CONFIGURATION
// Before going live:
//   1. Set RESEND_API_KEY in .env.local (get from resend.com/api-keys)
//   2. Set CONTACT_TO_EMAIL to your receiving inbox
//   3. Set CONTACT_FROM_EMAIL to a verified sender in your Resend domain
//      (e.g. hello@soeze.tech — must be verified at resend.com/domains)
// =============================================================================

import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Allowed project type values — must match the client-side PROJECT_TYPES array.
// Validated server-side so a crafted POST cannot inject unexpected values.
const ALLOWED_PROJECT_TYPES = [
  "AI AUTOMATIONS",
  "AI CHATBOTS",
  "AI ADS",
  "CREATIVE DESIGN",
  "DIGITAL MARKETING",
  "SOMETHING ELSE",
] as const;

// Simple in-memory rate limiter: max 5 submissions per IP per 10-minute window.
// For production with serverless, swap this for a Redis/Upstash-backed solution.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true; // allowed
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false; // rate limited
  }

  record.count++;
  return true; // allowed
}

// --- HTML email template ---
function buildHtmlEmail(opts: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) {
  const { name, email, projectType, message } = opts;
  // Escape HTML entities to prevent injection in the email body
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>New SOEZE Enquiry — ${esc(projectType)}</title>
  <style>
    body { margin: 0; padding: 0; background: #f4f1ea; font-family: 'Space Grotesk', ui-monospace, monospace; }
    .outer { padding: 40px 24px; }
    .card { background: #111111; color: #f4f1ea; max-width: 560px; margin: 0 auto; }
    .header { padding: 24px 32px; border-bottom: 2px solid #333; }
    .header-label { font-size: 10px; letter-spacing: 0.2em; color: #888; text-transform: uppercase; }
    .header-title { font-size: 18px; font-weight: 700; letter-spacing: 0.05em; margin-top: 6px; color: #f4f1ea; text-transform: uppercase; }
    .body { padding: 32px; }
    .field { margin-bottom: 24px; }
    .field-label { font-size: 9px; letter-spacing: 0.2em; color: #888; text-transform: uppercase; margin-bottom: 4px; }
    .field-value { font-size: 15px; color: #f4f1ea; line-height: 1.5; word-break: break-word; }
    .divider { border: none; border-top: 1px solid #2a2a2a; margin: 24px 0; }
    .footer { padding: 16px 32px; border-top: 2px solid #333; }
    .footer-text { font-size: 10px; letter-spacing: 0.1em; color: #555; text-transform: uppercase; }
    .accent { color: #c4b5fd; }
    .message-box { background: #1a1a1a; padding: 16px; white-space: pre-wrap; line-height: 1.7; }
  </style>
</head>
<body>
  <div class="outer">
    <div class="card">
      <div class="header">
        <div class="header-label">Received via soeze.tech</div>
        <div class="header-title">New SOEZE Enquiry</div>
      </div>
      <div class="body">
        <div class="field">
          <div class="field-label">Name</div>
          <div class="field-value">${esc(name)}</div>
        </div>
        <div class="field">
          <div class="field-label">Email</div>
          <div class="field-value"><span class="accent">${esc(email)}</span></div>
        </div>
        <div class="field">
          <div class="field-label">Project Type</div>
          <div class="field-value">${esc(projectType)}</div>
        </div>
        <hr class="divider" />
        <div class="field">
          <div class="field-label">Message</div>
          <div class="field-value message-box">${esc(message)}</div>
        </div>
      </div>
      <div class="footer">
        <div class="footer-text">Reply to this email to respond directly to ${esc(name)}</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// --- Plain text fallback ---
function buildPlainText(opts: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}) {
  const { name, email, projectType, message } = opts;
  return [
    "NEW SOEZE ENQUIRY",
    "=================",
    "",
    `Name:        ${name}`,
    `Email:       ${email}`,
    `Project:     ${projectType}`,
    "",
    "Message:",
    "--------",
    message,
    "",
    "--------",
    "Received via soeze.tech",
  ].join("\n");
}

// =============================================================================
// POST /api/contact
// =============================================================================
export async function POST(request: NextRequest) {
  // --- Rate limiting ---
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { success: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  // --- Honeypot check ---
  // If the hidden "website" field is filled, it is a bot. Silently accept but do not send.
  if (body.website && String(body.website).trim() !== "") {
    // Return 200 to avoid bot detection fingerprinting
    return NextResponse.json({ success: true });
  }

  // --- Server-side validation ---
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const projectType =
    typeof body.projectType === "string" ? body.projectType.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  const errors: string[] = [];

  if (name.length < 2) errors.push("Name must be at least 2 characters.");
  if (name.length > 100) errors.push("Name is too long.");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) errors.push("Please enter a valid email address.");
  if (email.length > 254) errors.push("Email is too long.");

  if (!ALLOWED_PROJECT_TYPES.includes(projectType as (typeof ALLOWED_PROJECT_TYPES)[number])) {
    errors.push("Please select a valid project type.");
  }

  if (message.length < 10) errors.push("Message must be at least 10 characters.");
  if (message.length > 5000) errors.push("Message is too long (max 5000 characters).");

  if (errors.length > 0) {
    return NextResponse.json(
      { success: false, error: errors[0] },
      { status: 422 }
    );
  }

  // --- Check required environment variables ---
  // REPLACE_ME — CONTACT EMAIL CONFIGURATION
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error(
      "[contact] Missing environment variables: RESEND_API_KEY, CONTACT_TO_EMAIL, or CONTACT_FROM_EMAIL"
    );
    return NextResponse.json(
      { success: false, error: "Unable to send message. Server misconfiguration." },
      { status: 500 }
    );
  }

  // --- Send via Resend ---
  try {
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: `SOEZE Contact <${fromEmail}>`,
      to: [toEmail],
      replyTo: email,                              // ← Reply goes to visitor, not noreply
      subject: `New SOEZE enquiry — ${projectType}`,
      html: buildHtmlEmail({ name, email, projectType, message }),
      text: buildPlainText({ name, email, projectType, message }),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return NextResponse.json(
        { success: false, error: "Unable to send message." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "Unable to send message." },
      { status: 500 }
    );
  }
}
