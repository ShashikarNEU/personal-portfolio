import React from 'react';
import About from './components/About/about';
import Experience from './components/experience';
import Education from './components/education'; 
import Skills from './components/skills';
import Projects from './components/projects';
import Navbar from './components/Navbar/navbar';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.App}>
      <Navbar />
      <div id="about"><About /></div>
      <div id="experience"><Experience /></div>
      <div id="education"><Education /></div>
      <div id="skills"><Skills /></div>
      <div id="projects"><Projects /></div>
    </div>
  );
}

export default App;