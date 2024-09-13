import React from 'react';
import styles from './projectCard.module.css';

interface ProjectProps {
  project: {
    id: number;
    title: string;
    date: string;
    description: string;
    image: string;
    tags: string[];
    category: string;
    github: string;
    webapp: string;
  };
  setOpenModal: (value: { state: boolean; project: any }) => void; // Updated prop type
}

const ProjectCard: React.FC<ProjectProps> = ({ project, setOpenModal }) => {
  return (
    <div className={styles.card} onClick={() => setOpenModal({ state: true, project })}>
      <div className={styles.image}>
        <img className={styles.image} src={require(`../../assets/projects/${project.image}`)} alt="project card" />
      </div>
      <div className={styles.tags}>
        {project.tags.map((tag: string, index: number) => (
          <div key={index} className={styles.tag}>{tag}</div>
        ))}
      </div>
      <div className={styles.details}>
        <div className={styles.title}>{project.title}</div>
        <div className={styles.date}>{project.date}</div>
        <div className={styles.description}>{project.description}</div>
      </div>
    </div>
  );
};

export default ProjectCard;
