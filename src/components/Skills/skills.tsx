import React, { useEffect, useRef, useState } from 'react';
import styles from './skills.module.css';
import skills from '../../data/skills.json';

const categoryIcons: Record<string, string> = {
  'Frontend': '🎨',
  'Backend': '⚙️',
  'Databases': '🗃️',
  'DevOps': '☁️',
  'AI / GenAI': '🤖',
  'Others': '🛠️',
};

const Skills: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [animateCards, setAnimateCards] = useState(true);
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
      { threshold: 0.05 }
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

  const handleCategoryChange = (category: string) => {
    if (category === activeCategory) return;
    setAnimateCards(false);
    setTimeout(() => {
      setActiveCategory(category);
      setAnimateCards(true);
    }, 150);
  };

  const filteredSkills = activeCategory === 'All'
    ? skills
    : skills.filter(s => s.title === activeCategory);

  const categories = ['All', ...skills.map(s => s.title)];

  return (
    <section className={`${styles.container} ${isVisible ? styles.visible : ''}`} ref={sectionRef}>
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>Skills & Technologies</h2>
          <p className={styles.subtitle}>
            Technologies and tools I work with to build modern, scalable applications — from crafting
            pixel-perfect interfaces to orchestrating cloud infrastructure and AI-powered workflows.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className={styles.filterBar}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterTab} ${activeCategory === cat ? styles.filterTabActive : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat !== 'All' && (
                <span className={styles.filterIcon}>{categoryIcons[cat] || '📌'}</span>
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className={`${styles.skillsGrid} ${animateCards ? styles.animateIn : styles.animateOut}`}>
          {filteredSkills.map((category, catIndex) => (
            <React.Fragment key={category.title}>
              {activeCategory === 'All' && (
                <div className={styles.categoryLabel}>
                  <span className={styles.categoryIcon}>{categoryIcons[category.title] || '📌'}</span>
                  <span>{category.title}</span>
                  <span className={styles.categoryLine} />
                </div>
              )}
              <div className={styles.skillCards}>
                {category.skills.map((item, index) => (
                  <div
                    className={`${styles.skillCard} ${isVisible ? styles.cardVisible : ''}`}
                    key={`${category.title}-${index}`}
                    style={{ animationDelay: `${(catIndex * 0.1) + (index * 0.06)}s` }}
                  >
                    <div className={styles.cardGlow} />
                    <div className={styles.cardContent}>
                      <img
                        className={styles.skillImage}
                        src={item.image}
                        alt={`${item.name} icon`}
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                      <span className={styles.skillName}>{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;