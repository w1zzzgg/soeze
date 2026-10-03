# SOEZE Contact Form — Setup Guide

This document explains how to make the contact form deliver emails via [Resend](https://resend.com).

**The Resend API key must NEVER appear in frontend code.** It is only read inside `app/api/contact/route.ts` on the server. The browser never sees it.

---

## Architecture

```
VISITOR → POST /api/contact → Server validates → Resend API → Your inbox
                                     ↑
                              .env.local (server only)
```

---

## Step 1 — Create a Resend account

1. Go to https://resend.com and sign up (free tier works for testing).
2. Log in.

---

## Step 2 — Verify soeze.tech in Resend

1. In the Resend dashboard: **Domains → Add Domain**.
2. Enter `soeze.tech`.
3. Resend will give you DNS records (SPF, DKIM, DMARC).
4. Add those DNS records at your domain registrar / DNS provider.
5. Click **Verify** in Resend.

NOTE: Until `soeze.tech` is verified, use Resend's shared domain for testing:
`onboarding@resend.dev` — set `CONTACT_FROM_EMAIL=onboarding@resend.dev` temporarily.
You can only send to your own verified email when using the shared domain.

---

## Step 3 — Create a Resend API Key

1. In Resend: **API Keys → Create API Key**.
2. Name it: `soeze-contact-form`.
3. Set permission: **Sending access** only.
4. Copy the key — you will not see it again.

---

## Step 4 — Configure environment variables

Open (or create) `.env.local` in the project root:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
CONTACT_TO_EMAIL=you@yourdomain.com
CONTACT_FROM_EMAIL=hello@soeze.tech
```

| Variable | Description |
| :--- | :--- |
| `RESEND_API_KEY` | Your Resend API key — server only |
| `CONTACT_TO_EMAIL` | Where new enquiries are delivered (your inbox) |
| `CONTACT_FROM_EMAIL` | Verified sender in Resend (e.g. `hello@soeze.tech`) |

`.env.local` is already gitignored via `.env*` in `.gitignore`. Never commit it.

---

## Step 5 — Run locally

```bash
npm run dev
```

Open http://localhost:3000, scroll to the Contact section, fill in the form, and click SEND MESSAGE.

Check the Resend dashboard → Emails to confirm delivery. Check your inbox for the actual email.

---

## Step 6 — Test the form

| Scenario | Expected result |
| :--- | :--- |
| Valid submission | Button → "SENDING..." → "MESSAGE SENT ✓", email arrives in inbox |
| Empty name | Inline error: "Name must be at least 2 characters." |
| Invalid email | Inline error: "Please enter a valid email address." |
| No project type selected | Inline error: "Please select a project type." |
| Message too short | Inline error: "Message must be at least 10 characters." |
| Double-click submit | Second click ignored while loading |
| Reply-To | Open received email, click Reply — goes to visitor's address |

---

## Step 7 — Production deployment

When deploying (Vercel, Railway, etc.), add the same environment variables in the platform dashboard:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

The API route at `/api/contact` uses relative paths — no hardcoded URLs needed.

---

## Email format

```
From:    SOEZE Contact <hello@soeze.tech>
Reply-To: visitor@example.com
Subject: New SOEZE enquiry — AI Chatbots

NEW SOEZE ENQUIRY
=================
Name:     John Doe
Email:    john@example.com
Project:  AI Chatbots

Message:
--------
I need a WhatsApp chatbot for my business...

--------
Received via soeze.tech
```

Clicking **Reply** in Gmail goes directly to the visitor's email (Reply-To).

---

## Files

| File | Purpose |
| :--- | :--- |
| `app/api/contact/route.ts` | Server-side: validation, honeypot, Resend |
| `components/sections/Contact.tsx` | Client form: states, fetch, GSAP |
| `components/sections/Contact.module.css` | Styles |
| `.env.local` | Local secrets — never commit |

---

## Security features

- Honeypot field: Hidden `website` input — if filled by a bot, silently dropped
- Rate limiting: 5 submissions per IP per 10 minutes (in-memory; swap for Redis in serverless prod)
- Server-side validation: All fields re-validated server-side
- Project type allowlist: Server rejects unexpected values
- No credential exposure: API key only read server-side
- Input sanitisation: HTML-escaped in email template
