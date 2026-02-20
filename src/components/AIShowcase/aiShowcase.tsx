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
  {
    icon: '💾',
    title: 'Conversation Memory',
    description: 'SQLite-backed thread persistence across sessions',
  },
];

const stats = [
  { value: '6', label: 'AI Tools' },
  { value: 'Real-Time', label: 'SSE Streaming' },
  { value: 'Multi-Agent', label: 'RAG Pipeline' },
  { value: '< 3s', label: 'First Token' },
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
            <span className={styles.tryButtonText}>Try the AI Assistant</span>
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

        {/* Stats Row */}
        <div className={styles.statsRow}>
          {stats.map((stat, i) => (
            <div
              className={`${styles.statCard} ${isVisible ? styles.statVisible : ''}`}
              key={stat.label}
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className={styles.diagram}>
          <h3 className={styles.diagramTitle}>Architecture</h3>
          <div className={styles.diagramFlow}>
            {/* Main pipeline: User → FastAPI → LangGraph Agent */}
            <div className={`${styles.diagramNode} ${styles.nodeUser}`}>
              <span className={styles.diagramIcon}>💬</span>
              <span className={styles.diagramLabel}>User Message</span>
            </div>

            <div className={styles.diagramArrowAnimated}>
              <div className={styles.arrowLine}>
                <div className={styles.arrowDot} />
              </div>
              <svg className={styles.arrowHead} width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 2 L10 6 L2 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className={`${styles.diagramNode} ${styles.nodeFastapi}`}>
              <span className={styles.diagramIcon}>⚡</span>
              <span className={styles.diagramLabel}>FastAPI</span>
            </div>

            <div className={styles.diagramArrowAnimated}>
              <div className={styles.arrowLine}>
                <div className={styles.arrowDot} />
              </div>
              <svg className={styles.arrowHead} width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 2 L10 6 L2 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className={`${styles.diagramNode} ${styles.nodeAgent}`}>
              <span className={styles.diagramIcon}>🧠</span>
              <span className={styles.diagramLabel}>LangGraph Agent</span>
            </div>

            <div className={styles.diagramArrowAnimated}>
              <div className={styles.arrowLine}>
                <div className={styles.arrowDot} />
              </div>
              <svg className={styles.arrowHead} width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 2 L10 6 L2 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            {/* Tool branch */}
            <div className={styles.diagramBranch}>
              <div className={`${styles.diagramToolNode} ${styles.toolRag}`}>
                <span className={styles.diagramIcon}>🔍</span>
                <span className={styles.diagramLabel}>RAG Search</span>
              </div>
              <div className={`${styles.diagramToolNode} ${styles.toolGithub}`}>
                <span className={styles.diagramIcon}>🐙</span>
                <span className={styles.diagramLabel}>GitHub API</span>
              </div>
              <div className={`${styles.diagramToolNode} ${styles.toolEmail}`}>
                <span className={styles.diagramIcon}>📧</span>
                <span className={styles.diagramLabel}>Email Agent</span>
              </div>
            </div>

            <div className={styles.diagramArrowAnimated}>
              <div className={styles.arrowLine}>
                <div className={styles.arrowDot} />
              </div>
              <svg className={styles.arrowHead} width="12" height="12" viewBox="0 0 12 12">
                <path d="M2 2 L10 6 L2 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className={`${styles.diagramNode} ${styles.nodeResponse}`}>
              <span className={styles.diagramIcon}>✨</span>
              <span className={styles.diagramLabel}>Response</span>
            </div>
          </div>

          {/* SQLite persistence layer */}
          <div className={styles.persistenceLayer}>
            <div className={styles.persistenceConnector}>
              <div className={styles.persistenceConnectorLine} />
            </div>
            <div className={`${styles.diagramNode} ${styles.nodeSqlite}`}>
              <span className={styles.diagramIcon}>💾</span>
              <span className={styles.diagramLabel}>SQLite</span>
              <span className={styles.persistenceSubLabel}>Thread Memory</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>How it works</h3>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                className={`${styles.featureCard} ${isVisible ? styles.cardVisible : ''}`}
                key={feature.title}
                style={{ animationDelay: `${0.3 + index * 0.08}s` }}
              >
                <div className={styles.cardGlow} />
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
