import React, { useEffect, useRef, useState } from 'react';
import styles from './aiShowcase.module.css';
import TechBadge from './TechBadge';

const features = [
  {
    icon: '🔍',
    title: 'Semantic Search',
    description: 'Advanced RAG with query expansion & reranking',
  },
  {
    icon: '🤖',
    title: 'Live GitHub Integration',
    description: 'Explores repos, reads code, analyzes architecture in real-time',
  },
  {
    icon: '⚡',
    title: 'Real-Time Streaming',
    description: 'SSE-powered token streaming with live thinking steps',
  },
  {
    icon: '🛡️',
    title: 'Smart Guardrails',
    description: 'Safe, scoped responses with prompt protection',
  },
  {
    icon: '📧',
    title: 'Contact Agent',
    description: 'Send messages directly via email',
  },
];

const techStack = [
  'FastAPI',
  'LangGraph',
  'GPT-5 Mini',
  'Pinecone',
  'SQLite',
  'GitHub API',
  'React',
  'SendGrid',
  'Python',
  'TypeScript',
];

const diagramSteps = [
  { label: 'User Message', icon: '💬' },
  { label: 'FastAPI', icon: '⚡' },
  { label: 'LangGraph Agent', icon: '🧠' },
];

const diagramTools = [
  { label: 'RAG Search', icon: '🔍' },
  { label: 'GitHub API', icon: '🐙' },
  { label: 'Email Agent', icon: '📧' },
];

const AIShowcase: React.FC = () => {
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

  const handleTryAssistant = () => {
    window.dispatchEvent(new Event('open-chatbot'));
  };

  return (
    <section
      className={`${styles.container} ${isVisible ? styles.visible : ''}`}
      ref={sectionRef}
    >
      <div className={styles.wrapper}>
        <div className={styles.header}>
          <h2 className={styles.title}>AI-Powered Portfolio</h2>
          <p className={styles.subtitle}>
            This portfolio features an AI chatbot powered by a multi-agent RAG
            system with real-time SSE streaming. It can answer questions about
            my projects, skills, and experience, explore my GitHub repositories
            and source code — or send me a message directly.
          </p>
          <button className={styles.tryButton} onClick={handleTryAssistant}>
            Try the AI Assistant
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

        {/* Architecture Diagram */}
        <div className={styles.diagram}>
          <h3 className={styles.diagramTitle}>Architecture</h3>
          <div className={styles.diagramFlow}>
            {diagramSteps.map((step, i) => (
              <React.Fragment key={step.label}>
                <div className={styles.diagramNode}>
                  <span className={styles.diagramIcon}>{step.icon}</span>
                  <span className={styles.diagramLabel}>{step.label}</span>
                </div>
                {i < diagramSteps.length - 1 && (
                  <div className={styles.diagramArrow}>
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.arrowIcon}
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}

            {/* Branch to tools */}
            <div className={styles.diagramArrow}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.arrowIcon}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className={styles.diagramBranch}>
              {diagramTools.map((tool) => (
                <div className={styles.diagramToolNode} key={tool.label}>
                  <span className={styles.diagramIcon}>{tool.icon}</span>
                  <span className={styles.diagramLabel}>{tool.label}</span>
                </div>
              ))}
            </div>

            <div className={styles.diagramArrow}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={styles.arrowIcon}
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
            <div className={styles.diagramNode}>
              <span className={styles.diagramIcon}>✨</span>
              <span className={styles.diagramLabel}>Response</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>How it works</h3>
          <div className={styles.featuresGrid}>
            {features.map((feature) => (
              <div className={styles.featureCard} key={feature.title}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <div className={styles.featureContent}>
                  <h4 className={styles.featureCardTitle}>{feature.title}</h4>
                  <p className={styles.featureDescription}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Badges */}
        <div className={styles.techSection}>
          <div className={styles.techBadges}>
            {techStack.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
          </div>
        </div>

        {/* GitHub Link */}
        <a
          href="https://github.com/ShashikarNEU/portfolio-rag-chatbot"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubLink}
        >
          View on GitHub
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="7" y1="17" x2="17" y2="7" />
            <polyline points="7 7 17 7 17 17" />
          </svg>
        </a>
      </div>
    </section>
  );
};

export default AIShowcase;
