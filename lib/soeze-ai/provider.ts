/**
 * Provider-agnostic adapter for SOEZE AI Studio Assistant
 *
 * Supports free-tier providers:
 * - Groq (default model: llama-3.3-70b-versatile or llama-3.1-8b-instant)
 * - Google Gemini (default model: gemini-2.0-flash)
 *
 * Modular design allowing swapping models/keys via environment variables
 * without modifying UI or game code.
 */

import { SOEZE_SYSTEM_PROMPT } from "./system-prompt";
import type { AiProviderType } from "./types";

export type GenerateChatOptions = {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

export type GenerateChatResult = {
  content: string;
  model: string;
  provider: string;
};

export class ProviderConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProviderConfigurationError";
  }
}

export function getProviderConfig() {
  const provider = (process.env.AI_PROVIDER?.toLowerCase() as AiProviderType) || "groq";
  let model = process.env.AI_MODEL || "";
  let apiKey = "";

  if (provider === "gemini") {
    apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
    if (!model) model = "gemini-3.8-flash";
  } else {
    // Default to Groq
    apiKey = process.env.GROQ_API_KEY || "";
    if (!model) model = "llama-3.3-70b-versatile";
  }

  return {
    provider,
    model,
    apiKey,
    isConfigured: Boolean(apiKey && apiKey.trim().length > 0 && apiKey !== "REPLACE_ME"),
  };
}

export async function generateStudioResponse(
  options: GenerateChatOptions
): Promise<GenerateChatResult> {
  const config = getProviderConfig();

  if (!config.isConfigured) {
    throw new ProviderConfigurationError(
      `SOEZE AI is not configured yet. Please provide a valid API key (${
        config.provider === "gemini" ? "GEMINI_API_KEY" : "GROQ_API_KEY"
      }) in .env.local to activate the assistant.`
    );
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 150000); // 150s timeout for reasoning models

  try {
    if (config.provider === "gemini") {
      return await generateGeminiResponse(config.model, config.apiKey, options.messages, controller.signal);
    } else {
      return await generateGroqResponse(config.model, config.apiKey, options.messages, controller.signal);
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Groq Free Tier integration (OpenAI-compatible format)
 */
async function generateGroqResponse(
  model: string,
  apiKey: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  signal: AbortSignal
): Promise<GenerateChatResult> {
  const payload = {
    model,
    messages: [
      { role: "system", content: SOEZE_SYSTEM_PROMPT },
      ...messages.slice(-8), // Keep last 8 turns for safety & token bounds
    ],
    temperature: 0.7,
    max_tokens: 600,
  };

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    throw new Error(`Groq API error (${res.status}): ${errorBody || res.statusText}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content?.trim();

  if (!content) {
    throw new Error("Received empty response from Groq model.");
  }

  return {
    content,
    model,
    provider: "Groq",
  };
}

/**
 * Google Gemini Free Tier integration
 */
async function generateGeminiResponse(
  model: string,
  apiKey: string,
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  signal: AbortSignal
): Promise<GenerateChatResult> {
  // Format conversation history for Gemini generateContent API
  const contents = messages.slice(-8).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const cleanModel = model.trim().replace(/^models\//, "");
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    cleanModel
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const bodyPayload = JSON.stringify({
    systemInstruction: {
      parts: [{ text: SOEZE_SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
    },
  });

  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Connection": "close",
    },
    body: bodyPayload,
    signal,
  });

  // Automatically retry once if experiencing temporary 503 high demand spike
  if (res.status === 503) {
    await new Promise((r) => setTimeout(r, 2500));
    res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Connection": "close",
      },
      body: bodyPayload,
      signal,
    });
  }

  if (!res.ok) {
    const errorBody = await res.text().catch(() => "");
    let errorMsg = `Gemini API error (${res.status})`;
    try {
      const parsed = JSON.parse(errorBody);
      if (parsed?.error?.message) {
        errorMsg += `: ${parsed.error.message}`;
      }
    } catch {
      if (errorBody) errorMsg += `: ${errorBody}`;
    }
    throw new Error(errorMsg);
  }

  const data = await res.json();
  const parts = data?.candidates?.[0]?.content?.parts || [];
  // Extract user-facing text parts (excluding internal thoughts)
  const textParts = parts
    .filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought)
    .map((p: { text: string }) => p.text);
  const content = textParts.join("\n").trim() || parts[0]?.text?.trim();

  if (!content) {
    throw new Error("Received empty response from Gemini model.");
  }

  return {
    content,
    model: cleanModel,
    provider: "Google Gemini",
  };
}
