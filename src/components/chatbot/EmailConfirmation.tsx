import React, { useState, useEffect } from "react";
import styles from "./EmailConfirmation.module.css";

interface EmailConfirmationProps {
  onDismiss: () => void;
}

const DISPLAY_DURATION = 10000;
const FADE_DURATION = 400;

const EmailConfirmation: React.FC<EmailConfirmationProps> = ({ onDismiss }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setExiting(true), DISPLAY_DURATION);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(onDismiss, FADE_DURATION);
    return () => clearTimeout(timer);
  }, [exiting, onDismiss]);

  return (
    <div className={`${styles.toast} ${exiting ? styles.toastExit : ""}`}>
      <div className={styles.content}>
        <span className={styles.icon}>&#10004;</span>
        <div>
          <div className={styles.title}>Message sent to Shashikar</div>
          <div className={styles.subtitle}>He'll get back to you soon!</div>
        </div>
      </div>
      <button
        className={styles.closeBtn}
        onClick={() => setExiting(true)}
        aria-label="Dismiss notification"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ animationDuration: `${DISPLAY_DURATION}ms` }} />
      </div>
    </div>
  );
};

export default EmailConfirmation;
