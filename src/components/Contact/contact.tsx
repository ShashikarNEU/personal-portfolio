import React, { useState, useRef, useEffect } from 'react';
import styles from './contact.module.css';

const ContactIcon = ({ type }: { type: 'mail' | 'linkedin' | 'github' }) => {
  if (type === 'mail') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 4h16v16H4z" />
        <path d="m4 7 8 6 8-6" />
      </svg>
    );
  }

  if (type === 'linkedin') {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zm7.5 0h3.83v2.05h.05c.53-1.01 1.83-2.07 3.77-2.07 4.03 0 4.77 2.65 4.77 6.1V23h-4v-7.9c0-1.88-.03-4.3-2.62-4.3-2.62 0-3.02 2.05-3.02 4.17V23h-4V8z" />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.15c-3.2.7-3.87-1.37-3.87-1.37-.52-1.32-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.16 1.18a10.95 10.95 0 0 1 5.76 0c2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.76.12 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
};

const Contact: React.FC = () => {
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
      <div className={styles.wrapper}>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Open to opportunities</span>
          <h2 className={styles.title}>Contact</h2>
          <p className={styles.desc}>
            Have a backend, cloud, or full-stack role where reliability matters?
            Email me directly, connect on LinkedIn, or ask the portfolio assistant
            for a quick summary first.
          </p>
        </div>

        <div className={styles.contactShell}>
          <div className={styles.primaryPanel}>
            <p className={styles.panelLabel}>Best next step</p>
            <h3>Let’s talk about backend engineering work.</h3>
            <p>
              I’m most interested in production software roles around APIs,
              cloud systems, data workflows, reliability, and practical AI-enabled features.
            </p>
            <div className={styles.panelActions}>
              <a href="mailto:anthoniraj.s@northeastern.edu" className={styles.primaryAction}>
                Email Me
              </a>
              <button
                type="button"
                className={styles.secondaryAction}
                onClick={() => window.dispatchEvent(new Event('open-chatbot'))}
              >
                Ask Assistant
              </button>
            </div>
          </div>

          <div className={styles.contactGrid}>
            <a href="mailto:anthoniraj.s@northeastern.edu" className={styles.contactCard}>
              <div className={styles.cardIcon}><ContactIcon type="mail" /></div>
              <div>
                <h3 className={styles.cardTitle}>Email</h3>
                <p className={styles.cardSubtitle}>anthoniraj.s@northeastern.edu</p>
                <span className={styles.cardLink}>Send an email →</span>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/shashikar-anthoniraj/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.cardIcon}><ContactIcon type="linkedin" /></div>
              <div>
                <h3 className={styles.cardTitle}>LinkedIn</h3>
                <p className={styles.cardSubtitle}>Professional network</p>
                <span className={styles.cardLink}>Connect with me →</span>
              </div>
            </a>

            <a
              href="https://github.com/ShashikarNEU"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactCard}
            >
              <div className={styles.cardIcon}><ContactIcon type="github" /></div>
              <div>
                <h3 className={styles.cardTitle}>GitHub</h3>
                <p className={styles.cardSubtitle}>Repositories and projects</p>
                <span className={styles.cardLink}>View my work →</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.copyright}>© {new Date().getFullYear()} Shashikar Anthoniraj. All rights reserved.</p>
        <a className={styles.backToTop} href="#about">Back to top ↑</a>
      </footer>
    </section>
  );
};

export default Contact;
