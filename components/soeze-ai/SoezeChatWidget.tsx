"use client";

/**
 * SOEZE AI Studio Assistant — Floating Chat Widget
 *
 * UI Foundation adapted from Dqnamo Model Selector:
 * Reference: https://www.dqnamo.com/experiments/model-selector
 * Attribution: Adapted with respect to Dqnamo's prompt composer geometry,
 * pill badges, border treatments, and responsive send button.
 */

import React, { useState, useRef, useEffect, useCallback } from "react";
import styles from "./SoezeChatWidget.module.css";
import type { ChatMessage, ChatResponseBody, ChatErrorResponse } from "@/lib/soeze-ai/types";

const STARTER_QUESTIONS = [
  "What services does SOEZE offer?",
  "How does a WhatsApp AI chatbot work?",
  "What can I explore in the SOEZE Lab?",
  "How can I start a project with SOEZE?",
];

const INITIAL_GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "Hey! I'm SOEZE AI — your studio assistant. Ask me anything about our AI automations, web engineering, interactive experiments, or how to kick off a project.",
};

function formatModelDisplayName(model: string, provider?: string): string {
  if (!model) return "Gemini 3.8 Flash";
  const m = model.toLowerCase();
  if (m.includes("3.8") && m.includes("flash")) return "Gemini 3.8 Flash";
  if (m.includes("2.0") && m.includes("flash")) return "Gemini 2.0 Flash";
  if (m.includes("1.5") && m.includes("flash")) return "Gemini 1.5 Flash";
  if (m.includes("llama-3.3")) return "Llama 3.3 70B";
  if (m.includes("llama-3.1")) return "Llama 3.1 8B";
  return model
    .replace(/^models\//, "")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const FRIENDLY_UNAVAILABLE_MESSAGE =
  "Uh-oh! Our AI took a tiny coffee break. ☕✨ SOEZE AI is temporarily unavailable. Please try again later, or reach us through the Contact section if you need a hand!";

export default function SoezeChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [canRetry, setCanRetry] = useState(false);
  const [lastFailedInput, setLastFailedInput] = useState<string | null>(null);
  const [modelLabel, setModelLabel] = useState<string>("SOEZE CORE // Gemini 3.8 Flash");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch provider model configuration info safely on mount
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          if (data.model) {
            setModelLabel(`SOEZE CORE // ${formatModelDisplayName(data.model, data.provider)}`);
          }
        }
      } catch {
        // Fallback default label remains
      }
    }
    checkStatus();
  }, []);

  // Auto-scroll messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  // Focus textarea when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = useCallback(
    async (textToSend?: string) => {
      const content = (textToSend ?? input).trim();
      if (!content || isLoading) return;

      if (content.length > 1000) {
        setErrorNotice("Your message is a bit too long. Please keep it under 1,000 characters.");
        setCanRetry(false);
        return;
      }

      setErrorNotice(null);
      setCanRetry(false);
      setLastFailedInput(null);

      // Avoid duplicate message if retrying the same prompt
      let updatedHistory = messages;
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg || lastMsg.role !== "user" || lastMsg.content !== content) {
        const userMessage: ChatMessage = {
          id: `usr-${Date.now()}`,
          role: "user",
          content,
        };
        updatedHistory = [...messages, userMessage];
        setMessages(updatedHistory);
      }
      setInput("");
      setIsLoading(true);

      try {
        // Format history for API (omit system greetings / IDs)
        const payloadHistory = updatedHistory
          .filter((m) => m.id !== "greeting")
          .map((m) => ({
            role: m.role,
            content: m.content,
          }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: payloadHistory }),
        });

        if (!res.ok) {
          const errData: ChatErrorResponse = await res.json().catch(() => ({
            error: FRIENDLY_UNAVAILABLE_MESSAGE,
            code: "PROVIDER_ERROR",
          }));

          if (errData.code === "RATE_LIMITED") {
            setErrorNotice(
              errData.error || "You've sent quite a few messages! Please take a quick breather and try again in a little while."
            );
            setCanRetry(false);
            setLastFailedInput(null);
          } else if (errData.code === "INVALID_INPUT") {
            setErrorNotice(errData.error || "Please check your message and try again.");
            setCanRetry(false);
            setLastFailedInput(null);
          } else if (errData.code === "QUOTA_EXCEEDED" || res.status === 429) {
            // Quota limit can take hours to reset — do not falsely suggest immediate retry
            setErrorNotice(FRIENDLY_UNAVAILABLE_MESSAGE);
            setCanRetry(false);
            setLastFailedInput(null);
          } else if (errData.code === "UNCONFIGURED") {
            setErrorNotice(FRIENDLY_UNAVAILABLE_MESSAGE);
            setCanRetry(false);
            setLastFailedInput(null);
          } else {
            // Transient timeout, 503 capacity spike, or provider network glitch — allow retry
            setErrorNotice(FRIENDLY_UNAVAILABLE_MESSAGE);
            setCanRetry(true);
            setLastFailedInput(content);
          }
          return;
        }

        const data: ChatResponseBody = await res.json();
        const assistantMessage: ChatMessage = {
          id: `ast-${Date.now()}`,
          role: "assistant",
          content: data.message.content,
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch {
        setErrorNotice(FRIENDLY_UNAVAILABLE_MESSAGE);
        setCanRetry(true);
        setLastFailedInput(content);
      } finally {
        setIsLoading(false);
      }
    },
    [input, isLoading, messages]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    if (messages.length > 2) {
      const confirmReset = window.confirm("Start a new conversation and clear current history?");
      if (!confirmReset) return;
    }
    setMessages([INITIAL_GREETING]);
    setErrorNotice(null);
    setCanRetry(false);
    setLastFailedInput(null);
    setInput("");
  };

  const handleRetry = () => {
    if (lastFailedInput) {
      handleSendMessage(lastFailedInput);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <button
        type="button"
        className={styles.launcherButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label="Toggle SOEZE AI Studio Assistant"
        data-cursor="hover"
      >
        <span className={styles.launcherDot} aria-hidden="true" />
        <span>SOEZE AI</span>
      </button>

      {/* Floating Chat Modal */}
      {isOpen && (
        <section
          className={styles.widgetContainer}
          role="dialog"
          aria-label="SOEZE AI Studio Assistant"
          aria-modal="false"
        >
          {/* Header */}
          <div className={styles.widgetHeader}>
            <div className={styles.headerTitleGroup}>
              <span className={styles.launcherDot} aria-hidden="true" />
              <span className={styles.headerTitle}>SOEZE AI // STUDIO ASSISTANT</span>
              <span className={styles.headerBadge}>ONLINE</span>
            </div>

            <div className={styles.headerControls}>
              <button
                type="button"
                className={styles.headerIconBtn}
                onClick={handleNewChat}
                title="New conversation"
                aria-label="Start new conversation"
              >
                ↺
              </button>
              <button
                type="button"
                className={styles.headerIconBtn}
                onClick={() => setIsOpen(false)}
                title="Close assistant"
                aria-label="Close assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Conversation History */}
          <div className={styles.messagesScroll}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageRow} ${
                  msg.role === "user" ? styles.messageUser : styles.messageAssistant
                }`}
              >
                <span className={styles.messageSender}>
                  {msg.role === "user" ? "YOU" : "SOEZE AI"}
                </span>
                <div
                  className={`${styles.messageBubble} ${
                    msg.role === "user" ? styles.bubbleUser : styles.bubbleAssistant
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Suggested Starter Questions (when history is fresh) */}
            {messages.length <= 1 && (
              <div className={styles.startersSection}>
                <span className={styles.startersTitle}>SUGGESTED TOPICS:</span>
                {STARTER_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={styles.starterPill}
                    onClick={() => handleSendMessage(q)}
                    disabled={isLoading}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className={`${styles.messageRow} ${styles.messageAssistant}`}>
                <span className={styles.messageSender}>SOEZE AI</span>
                <div className={styles.typingIndicator} aria-label="SOEZE AI is thinking">
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}

            {/* Error Notification Banner */}
            {errorNotice && (
              <div className={styles.errorBanner} role="alert">
                <span>{errorNotice}</span>
                {canRetry && lastFailedInput && (
                  <button type="button" className={styles.retryBtn} onClick={handleRetry}>
                    [ RETRY MESSAGE ]
                  </button>
                )}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Dqnamo Adapted Prompt Composer */}
          <div className={styles.composerRoot}>
            <textarea
              ref={textareaRef}
              className={styles.composerTextarea}
              placeholder="Ask SOEZE AI anything... (Enter to send, Shift+Enter for newline)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              rows={2}
              maxLength={1000}
              aria-label="Message prompt"
            />

            <div className={styles.composerFooter}>
              {/* Model status badge adapted from Dqnamo combobox trigger */}
              <div className={styles.modelBadge} title="Active Studio Intelligence Model">
                <span className={styles.modelBadgeDot} aria-hidden="true" />
                <span>{modelLabel}</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {input.length > 700 && (
                  <span className={styles.charCount}>{input.length}/1000</span>
                )}
                <button
                  type="button"
                  className={styles.sendButton}
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message to SOEZE AI"
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 256 256"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M227.32,28.68a16,16,0,0,0-15.66-4.08l-192,56a16,16,0,0,0-2.28,29.83l76.75,39.46a8,8,0,0,1,3.75,3.75l39.46,76.75A16,16,0,0,0,152,240a15.89,15.89,0,0,0,6.41-1.34,16,16,0,0,0,9.91-14.32l56-192A16,16,0,0,0,227.32,28.68Z" />
                  </svg>
                  <span>SEND</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
