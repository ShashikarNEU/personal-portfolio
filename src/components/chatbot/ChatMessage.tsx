import React, { useState } from "react";
import { ChatMessageData } from "../../hooks/useChat";
import SourceCard from "./SourceCard";
import styles from "./ChatMessage.module.css";

interface ChatMessageProps {
  message: ChatMessageData;
  onRetry?: () => void;
}

/**
 * Renders inline markdown: **bold** and [text](url)
 */
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, i) => {
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={i} className={styles.bold}>
          {boldMatch[1]}
        </strong>
      );
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={i}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.link}
        >
          {linkMatch[1]}
        </a>
      );
    }

    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/**
 * Renders markdown with bold, links, and list items
 */
function renderMarkdown(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Sub-list item: starts with "  -" or "   -"
    const subListMatch = line.match(/^(\s{2,})-\s+(.+)/);
    if (subListMatch) {
      result.push(
        <span key={i} className={styles.subListItem}>
          <span className={styles.listBullet}>&#8227;</span>
          <span>{renderInline(subListMatch[2])}</span>
        </span>
      );
      continue;
    }

    // Top-level list item: starts with "- "
    const listMatch = line.match(/^-\s+(.+)/);
    if (listMatch) {
      result.push(
        <span key={i} className={styles.listItem}>
          <span className={styles.listBullet}>&#8226;</span>
          <span>{renderInline(listMatch[1])}</span>
        </span>
      );
      continue;
    }

    // Regular line
    if (line === "") {
      result.push(<br key={i} />);
    } else {
      result.push(
        <React.Fragment key={i}>
          {i > 0 && lines[i - 1] !== "" && !lines[i - 1].match(/^(\s*)-\s+/) && <br />}
          {renderInline(line)}
        </React.Fragment>
      );
    }
  }

  return result;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onRetry }) => {
  const isUser = message.role === "user";
  const isError = message.isError;
  const [feedback, setFeedback] = useState<"up" | "down" | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  const bubbleClass = isUser
    ? styles.user
    : isError
    ? styles.error
    : styles.bot;

  const showActions =
    !isUser && !isError && !message.isStreaming && !!message.text;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.text);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const handleFeedback = (type: "up" | "down") => {
    setFeedback((prev) => (prev === type ? null : type));
  };

  // User messages: simple layout (no avatar, no actions)
  if (isUser) {
    return (
      <div className={`${styles.wrapper} ${styles.wrapperUser}`}>
        <div className={`${styles.bubble} ${styles.user}`}>
          <span className={styles.text}>{renderMarkdown(message.text)}</span>
        </div>
      </div>
    );
  }

  // Bot messages: avatar + bubble column (bubble, actions, sources)
  return (
    <div className={`${styles.wrapper} ${styles.wrapperBot}`}>
      <div className={styles.messageRow}>
        {/* Avatar */}
        <div className={`${styles.avatar} ${isError ? styles.avatarError : ""}`}>
          {isError ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          )}
        </div>

        {/* Bubble column */}
        <div className={styles.bubbleColumn}>
          <div className={`${styles.bubble} ${bubbleClass}`}>
            {isError && <span className={styles.errorIcon}>&#9888;</span>}
            <span className={`${styles.text} ${message.isStreaming && message.text ? styles.textStreaming : ''}`}>
              {renderMarkdown(message.text)}
              {message.isStreaming && message.text && (
                <span className={styles.streamingCursor} />
              )}
            </span>
          </div>

          {/* Action buttons */}
          {showActions && (
            <div className={styles.actions}>
              <button
                className={`${styles.actionBtn} ${showCopied ? styles.actionActive : ""}`}
                onClick={handleCopy}
                aria-label={showCopied ? "Copied" : "Copy message"}
                title={showCopied ? "Copied!" : "Copy"}
              >
                {showCopied ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>

              {onRetry && (
                <button
                  className={styles.actionBtn}
                  onClick={onRetry}
                  aria-label="Retry"
                  title="Retry"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                </button>
              )}

              <button
                className={`${styles.actionBtn} ${feedback === "up" ? styles.actionActive : ""}`}
                onClick={() => handleFeedback("up")}
                aria-label="Thumbs up"
                title="Good response"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === "up" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                </svg>
              </button>

              <button
                className={`${styles.actionBtn} ${feedback === "down" ? styles.actionActive : ""}`}
                onClick={() => handleFeedback("down")}
                aria-label="Thumbs down"
                title="Bad response"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill={feedback === "down" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
                </svg>
              </button>
            </div>
          )}

          {/* Sources */}
          {message.sources && message.sources.length > 0 && (
            <SourceCard sources={message.sources} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
