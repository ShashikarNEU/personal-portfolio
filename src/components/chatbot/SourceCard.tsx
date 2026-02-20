import React, { useState } from "react";
import { Source } from "../../services/chatApi";
import styles from "./SourceCard.module.css";

interface SourceCardProps {
  sources: Source[];
}

const SourceCard: React.FC<SourceCardProps> = ({ sources }) => {
  const [expanded, setExpanded] = useState(false);

  if (!sources.length) return null;

  return (
    <div className={styles.container}>
      <button
        className={styles.toggle}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        &#128206; {sources.length} source{sources.length !== 1 ? "s" : ""}
        <span className={`${styles.arrow} ${expanded ? styles.open : ""}`}>
          &#9662;
        </span>
      </button>

      {expanded && (
        <div className={styles.list}>
          {sources.map((src, i) => (
            <div key={i} className={styles.source}>
              <div className={styles.header}>
                <span className={styles.docName}>
                  &#128196; {src.document}
                </span>
                <span className={styles.badge}>
                  {Math.round(src.relevance_score * 100)}%
                </span>
              </div>
              <div className={styles.chunk}>
                {src.chunk.length > 150
                  ? src.chunk.slice(0, 150) + "..."
                  : src.chunk}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SourceCard;
