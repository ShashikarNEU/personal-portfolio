import React,{useEffect, useRef, useState} from 'react';
import styles from './education.module.css';
import EducationHistory from '../../data/education.json';

const Education: React.FC = () => {
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
        threshold: 0.05, 
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
   <section ref={sectionRef} className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <h2 className={styles.title}>Education</h2>
      <div className={styles.content}>
        <ul className={styles.educationHistory}>
          {EducationHistory.map((education, index) => {
            return (
              <li className={styles.historyItem} key={index}>
                <div className={styles.historyItemDetails}>
                  <div className={styles.educationHistoryTitle}>
                    <h3>{`${education.degree}, ${education.school}`}</h3>
                    <p>{`${education.startDate} - ${education.endDate}`}</p>
                    <p>{`Grade: ${education.gpa}`}</p>
                  </div>
                </div>
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