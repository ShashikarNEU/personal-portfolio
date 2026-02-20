import React from 'react';
import styles from './TechBadge.module.css';

const TechBadge: React.FC<{ label: string }> = ({ label }) => {
  return <span className={styles.badge}>{label}</span>;
};

export default TechBadge;
