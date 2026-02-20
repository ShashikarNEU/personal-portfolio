import React, { useState, useRef, useEffect } from 'react';
import styles from './contact.module.css';

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
        <h2 className={styles.title}>Contact</h2>
        <p className={styles.desc}>
          I'm always open to discussing new opportunities, interesting projects, or just having a chat. Feel free to reach out!
        </p>

        <div className={styles.contactGrid}>
          <a href="mailto:anthoniraj.s@northeastern.edu" className={styles.contactCard}>
            <div className={styles.cardIcon}>✉️</div>
            <h3 className={styles.cardTitle}>Email</h3>
            <p className={styles.cardSubtitle}>anthoniraj.s@northeastern.edu</p>
            <span className={styles.cardLink}>Send an email →</span>
          </a>

          <a
            href="https://www.linkedin.com/in/shashikar-anthoniraj/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactCard}
          >
            <div className={styles.cardIcon}>💼</div>
            <h3 className={styles.cardTitle}>LinkedIn</h3>
            <p className={styles.cardSubtitle}>Professional Network</p>
            <span className={styles.cardLink}>Connect with me →</span>
          </a>

          <a
            href="https://github.com/ShashikarNEU"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactCard}
          >
            <div className={styles.cardIcon}>🐙</div>
            <h3 className={styles.cardTitle}>GitHub</h3>
            <p className={styles.cardSubtitle}>Code Repository</p>
            <span className={styles.cardLink}>View my work →</span>
          </a>
        </div>
      </div>

      <footer className={styles.footer}>
        <p className={styles.copyright}>© {new Date().getFullYear()} Shashikar Anthoniraj. All rights reserved.</p>
      </footer>
    </section>
  );
};

export default Contact;

