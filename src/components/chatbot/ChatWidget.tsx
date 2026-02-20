import React, { useState, useEffect, useCallback, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import ChatPanel from "./ChatPanel";
import styles from "./ChatWidget.module.css";

const MIN_WIDTH = 300;
const MIN_HEIGHT = 380;
const DEFAULT_WIDTH = 380;
const DEFAULT_HEIGHT = 520;

function loadSize(): { w: number; h: number } {
  try {
    const raw = localStorage.getItem("chatbot_panel_size");
    if (raw) {
      const { w, h } = JSON.parse(raw);
      if (typeof w === "number" && typeof h === "number") return { w, h };
    }
  } catch {}
  return { w: DEFAULT_WIDTH, h: DEFAULT_HEIGHT };
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenOpened, setHasBeenOpened] = useState(false);
  const { messages, isLoading, sendMessage, clearChat, retryLast } = useChat();

  const saved = loadSize();
  const [panelWidth, setPanelWidth] = useState(saved.w);
  const [panelHeight, setPanelHeight] = useState(saved.h);
  const resizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const open = useCallback(() => {
    setIsOpen(true);
    setHasBeenOpened(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  // Listen for custom "open-chatbot" event (from AIShowcase)
  useEffect(() => {
    const handler = () => open();
    window.addEventListener("open-chatbot", handler);
    return () => window.removeEventListener("open-chatbot", handler);
  }, [open]);

  // Escape key closes panel
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, close]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (isOpen && window.innerWidth < 640) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // --- Resize handlers (drag from top-left corner) ---
  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      resizing.current = true;
      startPos.current = { x: e.clientX, y: e.clientY, w: panelWidth, h: panelHeight };
      document.body.style.cursor = "nwse-resize";
      document.body.style.userSelect = "none";
    },
    [panelWidth, panelHeight]
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizing.current) return;
      const dx = startPos.current.x - e.clientX; // moving left = bigger
      const dy = startPos.current.y - e.clientY; // moving up = bigger
      const maxW = window.innerWidth - 48;
      const maxH = window.innerHeight - 48;
      setPanelWidth(Math.min(maxW, Math.max(MIN_WIDTH, startPos.current.w + dx)));
      setPanelHeight(Math.min(maxH, Math.max(MIN_HEIGHT, startPos.current.h + dy)));
    };
    const onUp = () => {
      if (!resizing.current) return;
      resizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      // persist
      setPanelWidth((w) => {
        setPanelHeight((h) => {
          localStorage.setItem("chatbot_panel_size", JSON.stringify({ w, h }));
          return h;
        });
        return w;
      });
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <>
      {/* Floating button */}
      <button
        className={`${styles.fab} ${isOpen ? styles.fabHidden : ""} ${
          !hasBeenOpened ? styles.fabPulse : ""
        }`}
        onClick={open}
        aria-label="Open AI chat assistant"
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          className={styles.panel}
          role="dialog"
          aria-label="AI Chat Assistant"
          style={
            isMobile
              ? undefined
              : { width: panelWidth, height: panelHeight }
          }
        >
          {/* Resize handle — top-left corner */}
          {!isMobile && (
            <div
              className={styles.resizeHandle}
              onMouseDown={onResizeStart}
              aria-hidden="true"
            />
          )}
          {/* Header */}
          <div className={styles.header}>
            <span className={styles.headerTitle}>AI Assistant</span>
            <div className={styles.headerActions}>
              <button
                className={styles.headerBtn}
                onClick={clearChat}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <button
                className={styles.headerBtn}
                onClick={close}
                aria-label="Close chat"
                title="Close"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Body */}
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            onSend={sendMessage}
            onRetry={retryLast}
            autoFocusInput={isOpen}
          />
        </div>
      )}
    </>
  );
};

export default ChatWidget;
