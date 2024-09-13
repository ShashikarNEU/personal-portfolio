import React from 'react';
import styles from './about.module.css';
import Title from './title';

const About: React.FC = () => {
  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>Hi, My Name is Shashikar Anthoni Raj</h2> 
        <h2 className={styles.position}>I am a <Title/></h2>
        <p className={styles.description}>
         Former Software Development Engineer at Ford, specializing in REST APIs and product-based projects. Currently pursuing an MS in Information Systems at Northeastern University. Skilled in full-stack development, with experience in MERN, Cloud Infrastructure, REST and more, blending diverse technologies into scalable solutions.
        </p>
        <a href="https://drive.google.com/file/d/1ZVM8guDWMO1uB9Ks_8nO_XrWrVfqvARV/view?usp=sharing" className={styles.contactBtn} target='_blank'>
          Check Resume
        </a>
      </div>
    </section>
  );
};

export default About;