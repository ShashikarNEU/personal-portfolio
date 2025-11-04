import React, { useState, useEffect } from 'react';
import styles from './about.module.css';
import Title from './title';

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
            <p>I'm a</p>
            <Title />
          </div>
          <p className={styles.description}>
            I'm a passionate software engineer with experience in full-stack development, cloud computing, and system design. I love building scalable applications and exploring new technologies.
          </p>
          <div className={styles.actions}>
            <a href="https://shashikar-s3-bucket.s3.us-east-1.amazonaws.com/ShashikarResumeV1.pdf" className={styles.resumeBtn} target="_blank" rel="noopener noreferrer">
              View Resume
            </a>
            <a href="mailto:anthoniraj.s@northeastern.edu" className={styles.contactBtn}>
              Get In Touch
            </a>
          </div>
        </div>
        <div className={`${styles.imageContainer} ${isVisible ? styles.fadeInRight : ''}`}>
          <div className={styles.imageWrapper}>
            <div className={styles.blob}></div>
            <div className={styles.imageFrame}>
              <img 
                src={require('../../assets/about/self.png')} 
                alt="Shashikar Anthoniraj" 
                className={styles.profileImage}
              />
              <div className={styles.imageGlow}></div>
            </div>
            <div className={styles.floatingElements}>
              <div className={styles.floatingElement1}></div>
              <div className={styles.floatingElement2}></div>
              <div className={styles.floatingElement3}></div>
            </div>
          </div>
        </div>
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