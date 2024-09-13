import React, {useEffect, useState} from 'react';
import About from './components/About/about';
import Experience from './components/Experience/experience';
import Education from './components/Education/education'; 
import Skills from './components/Skills/skills';
import Projects from './components/Projects/projects';
import Navbar from './components/Navbar/navbar';
import styles from './App.module.css';
import ProjectDetails from './components/Projects/projectDetails';

function App() {
  const [openModal, setOpenModal] = useState({ state: false, project: null });
  useEffect(() => {console.log(openModal.project);console.log(openModal.state);}, [openModal]);
  return (
    <div className={styles.App}>
      <Navbar />
      <div id="about"><About /></div>
      <div id="experience"><Experience /></div>
      <div id="education"><Education /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects openModal={openModal} setOpenModal={setOpenModal} /></div>
      {openModal.state && <ProjectDetails openModal={openModal} setOpenModal={setOpenModal} />}
    </div>
  );
}

export default App;