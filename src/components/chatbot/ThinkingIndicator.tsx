import React, { useState, useEffect, useRef } from "react";
import styles from "./ThinkingIndicator.module.css";

interface ThinkingIndicatorProps {
  steps?: string[];
  isFallback?: boolean;
}

const FALLBACK_STEPS = [
  { text: "Searching knowledge base...", delay: 0 },
  { text: "Analyzing relevance...", delay: 2500 },
  { text: "Generating response...", delay: 5500 },
  { text: "Almost there...", delay: 10000 },
];

type BadgeType = "rag" | "github" | "code" | "email" | null;

function getBadgeType(step: string): BadgeType {
  const lower = step.toLowerCase();
  if (
    lower.includes("knowledge base") ||
    lower.includes("relevance") ||
    lower.includes("searching")
  )
    return "rag";
  if (
    lower.includes("github") ||
    lower.includes("repository") ||
    lower.includes("repo")
  )
    return "github";
  if (
    lower.includes("source code") ||
    lower.includes("file_content") ||
    lower.includes("reading source")
  )
    return "code";
  if (lower.includes("email") || lower.includes("sendgrid")) return "email";
  return null;
}

const BADGE_LABELS: Record<NonNullable<BadgeType>, string> = {
  rag: "RAG",
  github: "GitHub API",
  code: "Code",
  email: "Email",
};

const BADGE_STYLES: Record<NonNullable<BadgeType>, string> = {
  rag: styles.badgeRag,
  github: styles.badgeGithub,
  code: styles.badgeCode,
  email: styles.badgeEmail,
};

function Badge({ type }: { type: NonNullable<BadgeType> }) {
  return (
    <span className={`${styles.badge} ${BADGE_STYLES[type]}`}>
      {BADGE_LABELS[type]}
    </span>
  );
}

const ThinkingIndicator: React.FC<ThinkingIndicatorProps> = ({
  steps = [],
  isFallback = false,
}) => {
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Fallback mode: use timers
  useEffect(() => {
    if (!isFallback) return;

    FALLBACK_STEPS.forEach((step, i) => {
      if (i === 0) return;
      const t = setTimeout(() => setFallbackIndex(i), step.delay);
      timeoutsRef.current.push(t);
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [isFallback]);

  const displaySteps = isFallback
    ? FALLBACK_STEPS.slice(0, fallbackIndex + 1).map((s) => s.text)
    : steps;

  if (displaySteps.length === 0) {
    // Show a default first step while waiting for SSE events
    return (
      <div className={styles.container}>
        <div className={styles.timeline}>
          <div className={styles.step}>
            <div className={styles.indicator}>
              <span className={styles.dot} />
            </div>
            <span className={`${styles.text} ${styles.active}`}>
              Processing...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.timeline}>
        {displaySteps.map((stepText, i) => {
          const isLast = i === displaySteps.length - 1;
          const isCompleted = !isLast;
          const badge = getBadgeType(stepText);

          return (
            <div key={`${i}-${stepText}`} className={styles.step}>
              <div className={styles.indicator}>
                {isCompleted ? (
                  <span className={styles.check}>&#10003;</span>
                ) : (
                  <span className={styles.dot} />
                )}
                {isCompleted && i < displaySteps.length - 1 && (
                  <div className={styles.line} />
                )}
              </div>
              <span
                className={`${styles.text} ${isLast ? styles.active : ""} ${isCompleted ? styles.completed : ""
                  }`}
              >
                {stepText}
              </span>
              {badge && <Badge type={badge} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ThinkingIndicator;
