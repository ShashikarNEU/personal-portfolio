import React from 'react';
import styles from './experience.module.css';
import ExperienceData from '../../data/experience.json';
import FordLogo from '../../assets/experience/ford-logo.png';
import { getImageUrl } from '../../utils';

const Experience: React.FC = () => {
  return (
    <section className={styles.container}>
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