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
}

const SUGGESTIONS = [
  "What are his top skills?",
  "Explore his GitHub",
  "Tell me about his projects",
  "Contact Shashikar",
];

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  onSend,
  onRetry,
  autoFocusInput,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showEmailToast, setShowEmailToast] = useState(false);
  const lastSeenEmailMsgId = useRef<string | null>(null);
  const scrollThrottleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        )}
      </div>

      <ChatInput
        onSend={onSend}
        isLoading={isLoading}
        autoFocus={autoFocusInput}
      />
    </div>
  );
};

export default ChatPanel;
