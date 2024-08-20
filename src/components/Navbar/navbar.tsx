import React, {useState} from 'react';
import styles from './navbar.module.css';
import menuIcon from '../../assets/nav/menuIcon.png';
import closeIcon from '../../assets/nav/closeIcon.png';

import { getImageUrl } from '../../utils';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <a className={styles.title} href="/">Portfolio</a>

      <div className={styles.menu}>
        <img className={styles.menuBtn} src={menuOpen ? menuIcon : closeIcon} onClick={() => {setMenuOpen(!menuOpen)}} alt="menu-button" />
        <ul className={`${styles.menuItems} ${menuOpen && styles.menuOpen}`}>
          <li><a href="#about">About</a></li>
          <li><a href="#experience">Experience</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar