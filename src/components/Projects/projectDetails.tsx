import React from 'react';
import { Modal } from '@mui/material';
import { CloseRounded } from '@mui/icons-material';
import styles from './projectDetails.module.css';

interface ProjectDetailsProps {
  openModal: { state: boolean; project: any }; // Updated type
  setOpenModal: (value: { state: boolean; project: any }) => void; // Updated prop type
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ openModal, setOpenModal }) => {
  const project = openModal?.project;

  return (
    <Modal open={openModal.state} onClose={() => setOpenModal({ state: false, project: null })}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <CloseRounded
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              cursor: 'pointer',
              color: 'var(--color-text)',
            }}
            onClick={() => setOpenModal({ state: false, project: null })}
          />
          <img className={styles.image} src={require(`../../assets/projects/${project.image}`)} alt="project details" />
          <h2 className={styles.title}>{project.title}</h2>
          <div className={styles.date}>{project.date}</div>
          <div className={styles.tags}>
            {project.tags.map((tag: string) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.desc}>{project.description}</div>
          <div className={styles['button-group']}>
            <a className={`${styles.button} ${styles['button-dull']}`} href={project.github} target="_blank" rel="noopener noreferrer">
              View Code
            </a>
            {project.webapp && project.webapp !== project.github && (
              <a className={styles.button} href={project.webapp} target="_blank" rel="noopener noreferrer">
                Live Demo
              </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProjectDetails;
