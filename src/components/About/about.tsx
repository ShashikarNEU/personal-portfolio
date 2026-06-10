import React, { useState, useEffect } from 'react';
import styles from './about.module.css';
import Title from './title';
import { RESUME_URL } from '../../utils';

const proofPoints = [
  { value: '2.5+', label: 'Years building production software' },
  { value: 'Backend', label: 'APIs, services, data workflows' },
  { value: 'Cloud', label: 'AWS, GCP, CI/CD, observability' },
  { value: 'Quality', label: 'Testing, reliability, clean architecture' },
];

const systemSignals = [
  { title: 'Backend Focused', detail: 'APIs, services, systems' },
  { title: 'Cloud & DevOps', detail: 'AWS, GCP, CI/CD' },
  { title: 'Testing First', detail: 'Reliability and automation' },
  { title: 'AI in Practice', detail: 'Assist, automate, enhance' },
];

const About = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={`${styles.textContent} ${isVisible ? styles.fadeIn : ''}`}>
          <p className={styles.greeting}>Hi, I'm</p>
          <h1 className={styles.name}>Shashikar Anthoniraj</h1>
          <div className={styles.position}>
            <Title />
          </div>
          <p className={styles.description}>
            I build reliable backend systems, scalable APIs, cloud-native services,
            and clean production workflows. I also use applied AI where it improves
            real products — as a practical engineering tool, not the headline.
          </p>
          <div className={styles.proofGrid} aria-label="Portfolio highlights">
            {proofPoints.map((item) => (
              <div className={styles.proofItem} key={item.label}>
                <span className={styles.proofValue}>{item.value}</span>
                <span className={styles.proofLabel}>{item.label}</span>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <a href={RESUME_URL} className={styles.resumeBtn} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
            <a href="mailto:anthoniraj.s@northeastern.edu" className={styles.contactBtn}>
              Get In Touch
            </a>
            <button
              type="button"
              className={styles.chatBtn}
              onClick={() => window.dispatchEvent(new Event('open-chatbot'))}
            >
              Ask Portfolio Assistant
            </button>
          </div>
        </div>
        <div className={`${styles.imageContainer} ${isVisible ? styles.fadeInRight : ''}`}>
          <div className={styles.showcaseStack}>
            <div className={styles.portraitPanel}>
              <div className={styles.imageFrame}>
                <img
                  src={require('../../assets/about/self.png')}
                  alt="Shashikar Anthoniraj"
                  className={styles.profileImage}
                />
              </div>
              <div className={styles.statusStrip}>
                <span className={styles.statusDot}></span>
                Open to backend software engineering roles
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.signalRail} aria-label="Engineering focus areas">
        {systemSignals.map((signal) => (
          <div className={styles.signalItem} key={signal.title}>
            <span className={styles.signalIcon} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3 4 7v10l8 4 8-4V7l-8-4z" />
                <path d="M12 12 4 7" />
                <path d="m12 12 8-5" />
                <path d="M12 12v9" />
              </svg>
            </span>
            <span>
              <strong>{signal.title}</strong>
              <small>{signal.detail}</small>
            </span>
          </div>
        ))}
      </div>
      <div className={styles.scrollIndicator}>
        <div className={styles.mouse}>
          <div className={styles.wheel}></div>
        </div>
        <div className={styles.arrows}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>
  );
};

export default About;
