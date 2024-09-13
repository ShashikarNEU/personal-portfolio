import React, {useEffect, useRef, useState} from 'react';
import styles from './skills.module.css';
import skills from '../../data/skills.json'; 

const Skills: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is in view
      }
    );
  
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
  
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
   <section className={`${styles.container} ${isVisible ? styles.visible : ''}`} ref={sectionRef}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Skills</h2>
        <div className={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <div className={styles.skill} key={index}>
              <div className={styles.skillTitle}>{skill.title}</div>
              <div className={styles.skillList}>
                {skill.skills.map((item, subIndex) => (
                  <div className={styles.skillItem} key={subIndex}>
                    <img className={styles.skillImage} src={item.image} alt={item.name} />
                    {item.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
   </section>
  );
};

export default Skills;