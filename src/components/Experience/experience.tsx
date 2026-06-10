import React, { useState, useRef, useEffect } from 'react';
import styles from './experience.module.css';
import ExperienceData from '../../data/experience.json';

const getImpactSignals = (items: string[]) => {
  const text = items.join(' ').toLowerCase();
  const signals = [
    { label: 'Backend systems', terms: ['spring boot', 'api', 'postgresql', 'microservices'] },
    { label: 'Cloud delivery', terms: ['aws', 'ci/cd', 'pipelines', 's3'] },
    { label: 'Containers', terms: ['docker', 'kubernetes', 'auto-scaling'] },
    { label: 'Testing discipline', terms: ['tdd', 'junit', 'mockito', 'test'] },
    { label: 'Performance', terms: ['latency', 'page load', 'efficiency', 'sub-200ms'] },
    { label: 'Applied AI', terms: ['langchain', 'openai', 'semantic', 'ai-powered'] },
    { label: 'Auth & reliability', terms: ['oauth', 'jwt', 'incidents', 'root cause'] },
    { label: 'API contracts', terms: ['openapi', 'cors', 'payload'] },
    { label: 'Product tooling', terms: ['react', 'dashboard', 'admin ui', 'frontend'] },
    { label: 'Automation', terms: ['python', 'sql', 'cron', 'automated'] },
  ];

  return signals
    .filter((signal) => signal.terms.some((term) => text.includes(term)))
    .map((signal) => signal.label)
    .slice(0, 5);
};

const getMetricHighlights = (items: string[]) => {
  const metricPattern = /sub-200ms|\d+(?:\.\d+)?(?:\+|%)/g;
  const matches = items.join(' ').match(metricPattern) || [];
  return Array.from(new Set(matches)).slice(0, 4);
};

const Experience: React.FC = () => {
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
        <h2 className={styles.title}>Experience</h2>
        <p className={styles.subtitle}>
          Backend-first engineering roles across microservices, cloud delivery, internal tools, and applied AI workflows.
        </p>
      </div>
      <div className={styles.content}>
        <ol className={styles.history}>
          {ExperienceData.map((experience, index) => {
            const impactSignals = getImpactSignals(experience.experiences);
            const metrics = getMetricHighlights(experience.experiences);

            return (
              <li
                className={`${styles.historyItem} ${isVisible ? styles.itemVisible : ''}`}
                style={{ animationDelay: `${index * 0.15}s` }}
                key={`${experience.organisation}-${experience.role}`}
              >
                <span className={styles.timelineMarker}>{String(index + 1).padStart(2, '0')}</span>
                <article className={styles.roleCard}>
                  <div className={styles.roleHeader}>
                    <div className={styles.logoFrame}>
                      <img
                        className={styles.logoStyle}
                        src={require(`../../assets/experience/${experience.imageLogo}`)}
                        alt={`${experience.organisation} logo`}
                        loading="lazy"
                      />
                    </div>
                    <div className={styles.roleIntro}>
                      <p className={styles.organisation}>{experience.organisation}</p>
                      <h3>{experience.role}</h3>
                      <div className={styles.metaRow}>
                        <span className={styles.metaBadge}>
                          <span className={styles.metaIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M8 2v4" />
                              <path d="M16 2v4" />
                              <rect x="4" y="5" width="16" height="17" rx="2" />
                              <path d="M4 10h16" />
                            </svg>
                          </span>
                          {experience.startDate} - {experience.endDate}
                        </span>
                        <span className={styles.metaBadge}>
                          <span className={styles.metaIcon} aria-hidden="true">
                            <svg viewBox="0 0 24 24">
                              <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11z" />
                              <circle cx="12" cy="10" r="2.5" />
                            </svg>
                          </span>
                          {experience.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.signalRow} aria-label={`${experience.organisation} impact signals`}>
                    {impactSignals.map((signal) => (
                      <span key={signal} className={styles.signalChip}>{signal}</span>
                    ))}
                  </div>

                  <div className={styles.impactGrid}>
                    {metrics.length > 0 && (
                      <div className={styles.metricRail} aria-label={`${experience.organisation} measurable outcomes`}>
                        {metrics.map((metric) => (
                          <span key={metric} className={styles.metricPill}>
                            <strong>{metric}</strong>
                            <span>impact</span>
                          </span>
                        ))}
                      </div>
                    )}

                    <ul className={styles.impactList}>
                      {experience.experiences.map((description) => (
                        <li key={description}>
                          <span className={styles.bulletMark} aria-hidden="true" />
                          <span>{description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  );
};

export default Experience;
