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
      const currentSection = sectionRef.current;
      if (currentSection) {
        observer.unobserve(currentSection);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.container} ${isVisible? styles.visible:''}`}>
      <div className={styles.wrapper}>
        <h2 className={styles.title}>Projects</h2>
        <div className={styles.cardContainer}>
          {projects.map((project) => (
            <ProjectCard project={project} setOpenModal={setOpenModal} key={project.id} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
