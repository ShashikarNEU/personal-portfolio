import React, { useEffect, useRef, useState } from 'react';
import styles from './education.module.css';
import EducationHistory from '../../data/education.json';

const getCredentialType = (degree: string) => {
  if (degree.toLowerCase().includes('ms')) return 'Graduate';
  if (degree.toLowerCase().includes('b.tech')) return 'Undergraduate';
  return 'Credential';
};

const Education: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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
      <div className={styles.header}>
        <h2 className={styles.title}>Education</h2>
        <p className={styles.subtitle}>
          Academic foundation behind the backend, cloud, and systems work.
        </p>
      </div>
      <div className={styles.content}>
        <ul className={styles.credentialGrid}>
          {EducationHistory.map((education, index) => {
            return (
              <li
                className={`${styles.credentialCard} ${isVisible ? styles.itemVisible : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                key={`${education.school}-${education.degree}`}
              >
                <article className={styles.cardInner}>
                  <div className={styles.cardTop}>
                    <div className={styles.logoFrame}>
                      <img
                        className={styles.logoStyle}
                        src={require(`../../assets/education/${education.imageLogo}`)}
                        alt={`${education.school} logo`}
                        loading="lazy"
                      />
                    </div>
                    <span className={styles.credentialType}>{getCredentialType(education.degree)}</span>
                  </div>

                  <div className={styles.degreeBlock}>
                    <h3 className={styles.degree}>{education.degree}</h3>
                    <p className={styles.school}>{education.school}</p>
                  </div>

                  <div className={styles.metaGrid}>
                    <div className={styles.metaCard}>
                      <span className={styles.metaLabel}>Date</span>
                      <span>{education.startDate} - {education.endDate}</span>
                    </div>
                    <div className={styles.metaCard}>
                      <span className={styles.metaLabel}>Campus</span>
                      <span>{education.place}</span>
                    </div>
                    <div className={styles.metaCard}>
                      <span className={styles.metaLabel}>GPA</span>
                      <span>{education.gpa}</span>
                    </div>
                  </div>

                  {education.coursework && education.coursework.length > 0 && (
                    <div className={styles.coursework}>
                      <span className={styles.courseworkLabel}>Relevant coursework</span>
                      <div className={styles.courseworkTags}>
                        {education.coursework.map((course: string) => (
                          <span key={course} className={styles.courseworkTag}>{course}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
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
