import React, {useState, useRef, useEffect} from 'react';
import styles from './experience.module.css';
import ExperienceData from '../../data/experience.json';

const Experience: React.FC = () => {
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
        threshold: 0.05, // Trigger when 10% of the section is in view
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
      <h2 className={styles.title}>Experience</h2>
      <div className={styles.content}>
        <ul className={styles.history}>
          {ExperienceData.map((experience, index) => {
              const logoStyle =
              experience.organisation === 'Ford Motor Company Private Ltd'
                ? styles.fordLogo
                : experience.organisation === 'Doha Bank'
                ? styles.dohaBankLogo
                : styles.logoStyle;
              return (
                <li className={styles.historyItem} key={index}>
                  <div className={styles.historyItemDetails}>
                    <img className={logoStyle} src={require(`../../assets/experience/${experience.imageLogo}`)} alt={`${experience.organisation} logo`} />
                    <div className={styles.historyTitle}>
                      <h3>{`${experience.role}, ${experience.organisation}`}</h3>
                      <p>{`${experience.startDate} - ${experience.endDate}`}</p>
                    </div>
                  </div>
                  <div className={styles.historyItemDesc}>
                    <ul>
                      {experience.experiences.map((description, index) => {
                        return (
                          <li key={index}>{description}</li>
                        )
                      })}
                    </ul>
                  </div>
                </li>
              )
          })}
        </ul>
      </div>
    </section>
  );
};

export default Experience;