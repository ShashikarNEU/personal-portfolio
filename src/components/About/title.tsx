import React, {useState, useEffect} from 'react';
import styles from './about.module.css';

const Title = () => {
  const [title, setTitle] = useState('Hi, I am Shashikar Anthoni Raj. A Software Engineer.');

  useEffect(() => {
    let index = 0;

    const typeTitle = () => {
      if(index < title.length) {
        setTitle(title.slice(0, index + 1));
        index++;
        setTimeout(typeTitle, 55);
      }
    };
    
    typeTitle();
  }, []);

  return (
    <h1 className={styles.title}>{title}</h1>
  )
}

export default Title;