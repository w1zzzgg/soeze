export type ChatRole = "user" | "assistant" | "system";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt?: number;
};

export type AiProviderType = "groq" | "gemini";

export type AiProviderConfig = {
  provider: AiProviderType;
  model: string;
  apiKey?: string;
};

export type ChatRequestBody = {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
};

export type ChatResponseBody = {
  message: {
    role: "assistant";
    content: string;
  };
  model: string;
  provider: string;
};

export type ChatErrorResponse = {
  error: string;
  code: "UNCONFIGURED" | "RATE_LIMITED" | "INVALID_INPUT" | "PROVIDER_ERROR" | "TIMEOUT" | "QUOTA_EXCEEDED";
  details?: string;
};
