import React, { useState, useRef, useEffect } from 'react';
import styles from './experience.module.css';
import ExperienceData from '../../data/experience.json';

const Experience: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentSection = sectionRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.05,
      }
    );

    if (currentSection) {
      observer.observe(currentSection);
    }

    return () => {
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.content}>
        <ul className={styles.history}>
          {ExperienceData.map((experience, index) => {
            return (
              <li
                className={`${styles.historyItem} ${isVisible ? styles.itemVisible : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                key={index}
              >
                <div className={styles.historyItemDetails}>
                  <img
                    className={styles.logoStyle}
                    src={require(`../../assets/experience/${experience.imageLogo}`)}
                    alt={`${experience.organisation} logo`}
                    loading="lazy"
                  />
                  <div className={styles.historyTitle}>
                    <h3>{experience.role}</h3>
                    <p className={styles.organisation}>{experience.organisation}</p>
                    <div className={styles.metaRow}>
                      <span className={styles.dateBadge}>
                        📅 {experience.startDate} — {experience.endDate}
                      </span>
                      <span className={styles.locationBadge}>
                        📍 {experience.location}
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles.historyItemDesc}>
                  <ul>
                    {experience.experiences.map((description, idx) => {
                      return (
                        <li key={idx}>{description}</li>
                      )
                    })}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  );
};

export default Experience;