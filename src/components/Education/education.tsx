import React,{useEffect, useRef, useState} from 'react';
import styles from './education.module.css';
import EducationHistory from '../../data/education.json';

const Education: React.FC = () => {
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
      <h2 className={styles.title}>Education</h2>
      <div className={styles.content}>
        <ul className={styles.educationHistory}>
          {EducationHistory.map((education, index) => {
            return (
              <li className={styles.historyItem} key={index}>
                <div className={styles.historyItemDetails}>
                  <img 
                    className={styles.logoStyle} 
                    src={require(`../../assets/education/${education.imageLogo}`)} 
                    alt={`${education.school} logo`}
                    loading="lazy"
                  />
                  <div className={styles.educationHistoryTitle}>
                    <h3>{`${education.degree}`}</h3>
                    <h3>{`${education.school}`}</h3>
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