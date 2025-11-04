import React, {useEffect, useRef, useState} from 'react';
import styles from './projects.module.css';
import projects from '../../data/projects.json';
import ProjectCard from './projectCard';

interface ProjectsProps {
  openModal: { state: boolean; project: any }; // Ensure type consistency
  setOpenModal: (value: { state: boolean; project: any }) => void; // Updated prop type
}

const Projects: React.FC<ProjectsProps> = ({ openModal, setOpenModal }) => {
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
    <section ref={sectionRef} className={`${styles.container} ${isVisible? styles.visible:''}`}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Featured Projects</h2>
          <p className={styles.subtitle}>
            A collection of projects showcasing my skills in full-stack development, cloud computing, and system design.
          </p>
        </div>
        <div className={styles.cardContainer}>
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className={`${styles.cardWrapper} ${isVisible ? styles.visible : ''}`}
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <ProjectCard project={project} setOpenModal={setOpenModal} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
