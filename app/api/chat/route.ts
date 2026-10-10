import { NextRequest, NextResponse } from "next/server";
import {
  generateStudioResponse,
  getProviderConfig,
  ProviderConfigurationError,
} from "@/lib/soeze-ai/provider";
import { checkRateLimit } from "@/lib/soeze-ai/rate-limiter";
import type { ChatRequestBody, ChatResponseBody, ChatErrorResponse } from "@/lib/soeze-ai/types";

export const runtime = "nodejs";

const MAX_USER_MESSAGE_LENGTH = 1000;
const MAX_CONVERSATION_HISTORY = 10;

const FRIENDLY_UNAVAILABLE_MESSAGE =
  "Uh-oh! Our AI took a tiny coffee break. ☕✨ SOEZE AI is temporarily unavailable. Please try again later, or reach us through the Contact section if you need a hand!";

export async function POST(req: NextRequest) {
  try {
    // 1. IP / Client identification for rate limiting
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    const rateResult = checkRateLimit(ip);
    if (!rateResult.allowed) {
      const errorPayload: ChatErrorResponse = {
        error: "You've sent quite a few messages! Please take a quick breather and try again in a little while.",
        code: "RATE_LIMITED",
        details: `Please try again in ${rateResult.retryAfterSeconds ?? 60} seconds.`,
      };
      return NextResponse.json(errorPayload, {
        status: 429,
        headers: {
          "Retry-After": String(rateResult.retryAfterSeconds ?? 60),
        },
      });
    }

    // 2. Body parsing and validation
    let body: ChatRequestBody;
    try {
      body = await req.json();
    } catch {
      const errorPayload: ChatErrorResponse = {
        error: "Unable to parse request. Please check your message and try again.",
        code: "INVALID_INPUT",
      };
      return NextResponse.json(errorPayload, { status: 400 });
    }

    if (!body || !Array.isArray(body.messages) || body.messages.length === 0) {
      const errorPayload: ChatErrorResponse = {
        error: "Please enter a message to begin chatting.",
        code: "INVALID_INPUT",
      };
      return NextResponse.json(errorPayload, { status: 400 });
    }

    // 3. Validate messages, roles, and length
    const sanitizedMessages: Array<{ role: "user" | "assistant"; content: string }> = [];

    for (const msg of body.messages) {
      if (!msg || typeof msg !== "object") continue;
      if (msg.role !== "user" && msg.role !== "assistant") {
        continue; // Disallow client-injected 'system' role
      }

      if (typeof msg.content !== "string") continue;
      const trimmed = msg.content.trim();
      if (!trimmed) continue;

      if (msg.role === "user" && trimmed.length > MAX_USER_MESSAGE_LENGTH) {
        const errorPayload: ChatErrorResponse = {
          error: `Your message is a bit too long. Please keep it under ${MAX_USER_MESSAGE_LENGTH} characters.`,
          code: "INVALID_INPUT",
        };
        return NextResponse.json(errorPayload, { status: 400 });
      }

      sanitizedMessages.push({
        role: msg.role,
        content: trimmed,
      });
    }

    if (sanitizedMessages.length === 0 || sanitizedMessages[sanitizedMessages.length - 1].role !== "user") {
      const errorPayload: ChatErrorResponse = {
        error: "Please enter a message to continue.",
        code: "INVALID_INPUT",
      };
      return NextResponse.json(errorPayload, { status: 400 });
    }

    // Bound conversation length to last turns
    const boundedMessages = sanitizedMessages.slice(-MAX_CONVERSATION_HISTORY);

    // 4. Generate AI response
    const result = await generateStudioResponse({ messages: boundedMessages });

    const responseBody: ChatResponseBody = {
      message: {
        role: "assistant",
        content: result.content,
      },
      model: result.model,
      provider: result.provider,
    };

    return NextResponse.json(responseBody, {
      status: 200,
      headers: {
        "X-RateLimit-Remaining-Hour": String(rateResult.remainingPerHour),
        "X-RateLimit-Remaining-Day": String(rateResult.remainingPerDay),
      },
    });
  } catch (error: unknown) {
    if (error instanceof ProviderConfigurationError) {
      console.warn("[SOEZE AI] Provider configuration error:", error.message);
      const errorPayload: ChatErrorResponse = {
        error: FRIENDLY_UNAVAILABLE_MESSAGE,
        code: "UNCONFIGURED",
      };
      return NextResponse.json(errorPayload, { status: 503 });
    }

    const err = error as Error;
    if (err.name === "AbortError") {
      console.warn("[SOEZE AI] Upstream provider timeout (AbortError)");
      const errorPayload: ChatErrorResponse = {
        error: FRIENDLY_UNAVAILABLE_MESSAGE,
        code: "TIMEOUT",
      };
      return NextResponse.json(errorPayload, { status: 504 });
    }

    // Server-side diagnostic logging (strip potential key occurrences from logs)
    const sanitizedLog = err.message
      ? err.message.replace(/key=[^&\s]+/gi, "key=[REDACTED]")
      : "Unknown error";
    console.error("[SOEZE AI] Upstream chat provider error:", sanitizedLog);

    const isQuotaError =
      err.message?.includes("429") ||
      err.message?.toLowerCase().includes("quota") ||
      err.message?.toLowerCase().includes("resource_exhausted");

    // Return safe, friendly, structured error responses (never exposing upstream provider bodies/keys)
    const errorPayload: ChatErrorResponse = {
      error: FRIENDLY_UNAVAILABLE_MESSAGE,
      code: isQuotaError ? "QUOTA_EXCEEDED" : "PROVIDER_ERROR",
    };
    return NextResponse.json(errorPayload, { status: isQuotaError ? 429 : 500 });
  }
}

// GET endpoint to query provider status and configuration info safely (no secrets exposed)
export async function GET() {
  const config = getProviderConfig();
  return NextResponse.json({
    configured: config.isConfigured,
    provider: config.provider,
    model: config.model,
    limits: {
      maxUserMessageLength: MAX_USER_MESSAGE_LENGTH,
      perHourLimit: 10,
      perDayLimit: 30,
    },
  });
}
