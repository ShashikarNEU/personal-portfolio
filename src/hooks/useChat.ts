import { useState, useRef, useCallback } from "react";
import {
  streamMessage,
  sendMessageSync,
  Source,
} from "../services/chatApi";

export interface ChatMessageData {
  id: string;
  role: "user" | "bot";
  text: string;
  sources?: Source[];
  emailSent?: boolean;
  isError?: boolean;
  timestamp: number;
  isStreaming?: boolean;
  thinkingSteps?: string[];
  isFallback?: boolean;
}

const WELCOME_MESSAGE: ChatMessageData = {
  id: "welcome",
  role: "bot",
  text: "Hi! I'm Shashikar's AI assistant. Ask me about his projects, skills, or experience — or ask me to send him a message!",
  timestamp: Date.now(),
};

const LS_KEY = "chatbot_thread_id";

function getOrCreateThreadId(): string {
  const stored = localStorage.getItem(LS_KEY);
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem(LS_KEY, id);
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessageData[]>([
    WELCOME_MESSAGE,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const threadIdRef = useRef(getOrCreateThreadId());
  const abortControllerRef = useRef<AbortController | null>(null);
  const threadWasResetRef = useRef(false);

  const updateBotMessage = useCallback(
    (botId: string, updater: (msg: ChatMessageData) => ChatMessageData) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === botId ? updater(m) : m))
      );
    },
    []
  );

  const sendMessage = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;

      // Abort any in-flight request
      abortControllerRef.current?.abort();
      threadWasResetRef.current = false;

      const userMsg: ChatMessageData = {
        id: crypto.randomUUID(),
        role: "user",
        text: trimmed,
        timestamp: Date.now(),
      };

      const botId = crypto.randomUUID();
      const botPlaceholder: ChatMessageData = {
        id: botId,
        role: "bot",
        text: "",
        timestamp: Date.now(),
        isStreaming: true,
        thinkingSteps: [],
        isFallback: false,
      };

      setMessages((prev) => [...prev, userMsg, botPlaceholder]);
      setIsLoading(true);
      setError(null);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Safety timeout: 60s max
      const safetyTimeout = setTimeout(() => {
        controller.abort();
      }, 60000);

      try {
        let streamErrorOccurred = false;

        await streamMessage(trimmed, threadIdRef.current, {
          onThinking: (step) => {
            updateBotMessage(botId, (m) => ({
              ...m,
              thinkingSteps: [...(m.thinkingSteps || []), step],
            }));
          },
          onToken: (token) => {
            updateBotMessage(botId, (m) => ({
              ...m,
              text: m.text + token,
            }));
          },
          onToolCall: () => {
            // Backend already sends thinking events for each tool — skip to avoid duplicates
          },
          onToolResult: () => {
            // Skip — let backend thinking events handle "Generating response..."
          },
          onSources: (sources) => {
            updateBotMessage(botId, (m) => ({
              ...m,
              sources,
            }));
          },
          onEmailStatus: (sent) => {
            updateBotMessage(botId, (m) => ({
              ...m,
              emailSent: sent,
            }));
          },
          onDone: (serverThreadId) => {
            if (threadWasResetRef.current) {
              // Thread was reset mid-stream — skip stale thread sync
              updateBotMessage(botId, (m) => ({
                ...m,
                isStreaming: false,
              }));
              return;
            }
            if (serverThreadId) {
              threadIdRef.current = serverThreadId;
              localStorage.setItem(LS_KEY, serverThreadId);
            }
            updateBotMessage(botId, (m) => ({
              ...m,
              isStreaming: false,
            }));
          },
          onError: (message) => {
            streamErrorOccurred = true;
            updateBotMessage(botId, (m) => ({
              ...m,
              text: message,
              isError: true,
              isStreaming: false,
            }));
          },
          onThreadReset: (message) => {
            threadWasResetRef.current = true;
            const newId = crypto.randomUUID();
            threadIdRef.current = newId;
            localStorage.setItem(LS_KEY, newId);
            setMessages([
              { ...WELCOME_MESSAGE, id: "welcome", timestamp: Date.now() },
              {
                id: crypto.randomUUID(),
                role: "bot",
                text: message,
                timestamp: Date.now(),
              },
            ]);
          },
        }, controller.signal);

        if (!streamErrorOccurred) {
          // Ensure streaming is marked done; show fallback if empty response
          updateBotMessage(botId, (m) => {
            if (!m.text && !m.isError) {
              return {
                ...m,
                text: "No response received. Please try again.",
                isError: true,
                isStreaming: false,
              };
            }
            return { ...m, isStreaming: false };
          });
        }
      } catch (err) {
        // Network failure or abort — fall back to sync
        if (controller.signal.aborted) {
          // If aborted by user (clearChat/close), just clean up
          updateBotMessage(botId, (m) => ({
            ...m,
            text: m.text || "Request cancelled.",
            isStreaming: false,
            isError: !m.text,
          }));
        } else {
          // Network error — try sync fallback
          updateBotMessage(botId, (m) => ({
            ...m,
            thinkingSteps: [],
            isFallback: true,
          }));

          try {
            const res = await sendMessageSync(trimmed, threadIdRef.current);
            threadIdRef.current = res.thread_id;
            localStorage.setItem(LS_KEY, res.thread_id);

            updateBotMessage(botId, (m) => ({
              ...m,
              text: res.response,
              sources: res.sources,
              emailSent: res.email_sent,
              isStreaming: false,
              isFallback: true,
            }));
          } catch (syncErr) {
            const errText =
              syncErr instanceof Error
                ? syncErr.message
                : "Something went wrong. Please try again later.";
            setError(errText);
            updateBotMessage(botId, (m) => ({
              ...m,
              text: errText,
              isError: true,
              isStreaming: false,
            }));
          }
        }
      } finally {
        clearTimeout(safetyTimeout);
        abortControllerRef.current = null;
        setIsLoading(false);
      }
    },
    [isLoading, updateBotMessage]
  );

  const clearChat = useCallback(() => {
    // Abort any in-flight stream
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;

    const newId = crypto.randomUUID();
    threadIdRef.current = newId;
    localStorage.setItem(LS_KEY, newId);
    setMessages([{ ...WELCOME_MESSAGE, id: "welcome", timestamp: Date.now() }]);
    setError(null);
    setIsLoading(false);
  }, []);

  const retryLast = useCallback(() => {
    setMessages((prev) => {
      // Find last user message
      const lastUserIdx = [...prev].reverse().findIndex((m) => m.role === "user");
      if (lastUserIdx === -1) return prev;
      const lastUser = prev[prev.length - 1 - lastUserIdx];

      // Remove the last bot message (the one after the last user message)
      const filtered = prev.filter((m, i) => {
        if (i <= prev.length - 1 - lastUserIdx) return true;
        return m.role === "user";
      });

      // Re-send after state settles
      setTimeout(() => sendMessage(lastUser.text), 0);
      return filtered;
    });
  }, [sendMessage]);

  return { messages, isLoading, error, sendMessage, clearChat, retryLast };
}
