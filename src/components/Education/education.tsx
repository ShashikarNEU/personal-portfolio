import React, { useEffect, useRef, useState } from 'react';
import styles from './education.module.css';
import EducationHistory from '../../data/education.json';

const Education: React.FC = () => {
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
      <h2 className={styles.title}>Education</h2>
      <div className={styles.content}>
        <ul className={styles.educationHistory}>
          {EducationHistory.map((education, index) => {
            return (
              <li
                className={`${styles.historyItem} ${isVisible ? styles.itemVisible : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                key={index}
              >
                <div className={styles.historyItemDetails}>
                  <img
                    className={styles.logoStyle}
                    src={require(`../../assets/education/${education.imageLogo}`)}
                    alt={`${education.school} logo`}
                    loading="lazy"
                  />
                  <div className={styles.educationHistoryTitle}>
                    <h3 className={styles.degree}>{education.degree}</h3>
                    <p className={styles.school}>{education.school}</p>
                    <div className={styles.metaRow}>
                      <span className={styles.dateBadge}>
                        📅 {education.startDate} — {education.endDate}
                      </span>
                      <span className={styles.locationBadge}>
                        📍 {education.place}
                      </span>
                      <span className={styles.gpaBadge}>
                        🎓 GPA: {education.gpa}
                      </span>
                    </div>
                    {education.coursework && education.coursework.length > 0 && (
                      <div className={styles.coursework}>
                        <span className={styles.courseworkLabel}>Key Coursework:</span>
                        <div className={styles.courseworkTags}>
                          {education.coursework.map((course: string, idx: number) => (
                            <span key={idx} className={styles.courseworkTag}>{course}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            )
          }
          )}
        </ul>
      </div>
    </section>
  );
};

export default Education;