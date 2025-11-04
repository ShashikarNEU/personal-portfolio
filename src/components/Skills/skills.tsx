import React, {useEffect, useRef, useState} from 'react';
import styles from './skills.module.css';
import skills from '../../data/skills.json'; 

const Skills: React.FC = () => {
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
        threshold: 0.05, // Trigger when 10% of the section is in view
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
   <section className={`${styles.container} ${isVisible ? styles.visible : ''}`} ref={sectionRef}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Skills & Technologies</h2>
          <p className={styles.subtitle}>
            Technologies and tools I work with to build modern applications.
          </p>
        </div>
        <div className={styles.skillsContainer}>
          {skills.map((skill, index) => (
            <div 
              className={`${styles.skill} ${isVisible ? styles.visible : ''}`} 
              key={index}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <div className={styles.skillTitle}>{skill.title}</div>
              <div className={styles.skillList}>
                 {skill.skills.map((item, subIndex) => (
                   <div 
                     className={styles.skillItem} 
                     key={subIndex}
                     style={{ transitionDelay: `${(index * 0.15) + (subIndex * 0.08)}s` }}
                   >
                     <img 
                       className={styles.skillImage} 
                       src={item.image} 
                       alt={`${item.name} icon`} 
                       loading="lazy"
                       onError={(e) => {
                         const target = e.target as HTMLImageElement;
                         target.style.display = 'none';
                       }}
                     />
                     <span className={styles.skillName}>{item.name}</span>
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