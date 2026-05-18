import React, { useRef, useEffect, useState, useCallback } from "react";
import { ChatMessageData } from "../../hooks/useChat";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ThinkingIndicator from "./ThinkingIndicator";
import EmailConfirmation from "./EmailConfirmation";
import styles from "./ChatPanel.module.css";

interface ChatPanelProps {
  messages: ChatMessageData[];
  isLoading: boolean;
  onSend: (text: string) => void;
  onRetry: () => void;
  autoFocusInput: boolean;
  voiceMode: boolean;
  onVoiceModeChange: (enabled: boolean) => void;
}

const SUGGESTIONS = [
  "What makes him a strong backend engineer?",
  "Explore his GitHub",
  "Show me his best projects",
  "Contact Shashikar",
];

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  onSend,
  onRetry,
  autoFocusInput,
  voiceMode,
  onVoiceModeChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showEmailToast, setShowEmailToast] = useState(false);
  const [speechOutputSupported, setSpeechOutputSupported] = useState(false);
  const lastSeenEmailMsgId = useRef<string | null>(null);
  const lastSpokenMsgId = useRef<string | null>(null);
  const scrollThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setSpeechOutputSupported(
      typeof window !== "undefined" &&
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window
    );

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => {
    if (!voiceMode || !speechOutputSupported) {
      window.speechSynthesis?.cancel();
      return;
    }

    const latestBotMessage = [...messages]
      .reverse()
      .find(
        (message) =>
          message.role === "bot" &&
          !message.isStreaming &&
          !message.isError &&
          message.id !== "welcome" &&
          Boolean(message.text.trim())
      );

    if (!latestBotMessage || latestBotMessage.id === lastSpokenMsgId.current) {
      return;
    }

    lastSpokenMsgId.current = latestBotMessage.id;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(
      latestBotMessage.text
        .replace(/\*\*/g, "")
        .replace(/\[[^\]]+\]\(([^)]+)\)/g, "$1")
        .replace(/\s+/g, " ")
        .trim()
    );
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }, [messages, speechOutputSupported, voiceMode]);

  // Detect new emailSent messages and show toast
  useEffect(() => {
    const latest = [...messages].reverse().find((m) => m.emailSent);
    if (latest && latest.id !== lastSeenEmailMsgId.current) {
      lastSeenEmailMsgId.current = latest.id;
      setShowEmailToast(true);
    }
  }, [messages]);

  const dismissToast = useCallback(() => setShowEmailToast(false), []);

  // Throttled auto-scroll to prevent jank during token streaming
  useEffect(() => {
    if (scrollThrottleRef.current) return;

    scrollThrottleRef.current = setTimeout(() => {
      scrollThrottleRef.current = null;
      if (scrollRef.current) {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 200);

    return () => {
      if (scrollThrottleRef.current) {
        clearTimeout(scrollThrottleRef.current);
        scrollThrottleRef.current = null;
      }
    };
  }, [messages, isLoading]);

  const showChips = messages.length <= 1;

  return (
    <div className={styles.panel}>
      {showEmailToast && <EmailConfirmation onDismiss={dismissToast} />}
      <div ref={scrollRef} className={styles.messages}>
        {messages.map((msg) => {
          // Show ThinkingIndicator inline for streaming bot messages with no text yet
          if (
            msg.role === "bot" &&
            msg.isStreaming &&
            !msg.text
          ) {
            return (
              <ThinkingIndicator
                key={msg.id}
                steps={msg.thinkingSteps || []}
                isFallback={msg.isFallback || false}
              />
            );
          }
          return <ChatMessage key={msg.id} message={msg} onRetry={onRetry} />;
        })}

        {showChips && (
          <div className={styles.emptyState}>
            <p className={styles.emptyIntro}>
              Ask for a recruiter summary, project details, GitHub context, or help contacting Shashikar.
            </p>
            <span className={styles.emptyKicker}>Try a recruiter-style prompt</span>
            <div className={styles.chips}>
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  className={styles.chip}
                  onClick={() => onSend(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <ChatInput
        onSend={onSend}
        isLoading={isLoading}
        autoFocus={autoFocusInput}
        voiceMode={voiceMode}
        onVoiceModeChange={onVoiceModeChange}
        speechOutputSupported={speechOutputSupported}
      />
    </div>
  );
};

export default ChatPanel;
