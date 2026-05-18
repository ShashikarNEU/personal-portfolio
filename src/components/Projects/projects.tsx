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
          <div>
            <span className={styles.eyebrow}>Selected engineering work</span>
            <h2 className={styles.title}>Featured Projects</h2>
            <p className={styles.subtitle}>
              Backend, cloud, location-aware product work, and assistant systems — presented with equal weight so recruiters can scan the full range quickly.
            </p>
          </div>
          <a
            href="https://github.com/ShashikarNEU"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.githubCta}
          >
            View GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17 17 7" />
              <path d="M7 7h10v10" />
            </svg>
          </a>
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
