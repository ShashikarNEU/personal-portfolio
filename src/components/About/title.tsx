import React, { useState, useEffect } from 'react';
import styles from './about.module.css';

const Title = () => {
  const titles = ['Full Stack Developer', 'Software Engineer'];
  const [currentTitle, setCurrentTitle] = useState('');
  const [titleIndex, setTitleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseTime = 1500; 

  useEffect(() => {
    const handleTyping = () => {
      const currentFullTitle = titles[titleIndex];
      if (!isDeleting && charIndex < currentFullTitle.length) {
        setCurrentTitle((prev) => prev + currentFullTitle[charIndex]);
        setCharIndex(charIndex + 1);
      } else if (isDeleting && charIndex > 0) {
        setCurrentTitle((prev) => prev.slice(0, -1));
        setCharIndex(charIndex - 1);
      } else if (!isDeleting && charIndex === currentFullTitle.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      }
    };

    const timeout = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
    return () => clearTimeout(timeout); 
  }, [charIndex, isDeleting, titleIndex, titles]);

  return (
    <h1 className={styles.position1}>
      {currentTitle}
      <span className={styles.cursor}>|</span> 
    </h1>
  );
};

export default Title;
