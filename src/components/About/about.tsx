import React from 'react';
import styles from './about.module.css';
import Title from './title';

const About: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <Title/>
        <p className={styles.description}>
         Former Software Development Engineer at Ford, specializing in REST APIs and product-based projects. Currently pursuing an MS in Information Systems at Northeastern University. Skilled in full-stack development, with experience in MERN, Cloud Infrastructure, REST and more, blending diverse technologies into scalable solutions.
        </p>
        <a href="mailto:anthoniraj.s@northeastern.edu" className={styles.contactBtn}>Contact Me</a>
      </div>
    </section>
  );
};

export default About;