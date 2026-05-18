import React, { useEffect, useRef, useState } from 'react';
import styles from './aiShowcase.module.css';
import TechBadge from './TechBadge';

const features = [
  {
    icon: 'search',
    title: 'Semantic Search',
    description: 'Advanced RAG with query expansion & reranking',
  },
  {
    icon: 'github',
    title: 'Live GitHub Integration',
    description: 'Explores repos, reads code, analyzes architecture in real-time',
  },
  {
    icon: 'stream',
    title: 'Real-Time Streaming',
    description: 'SSE-powered token streaming with live thinking steps',
  },
  {
    icon: 'shield',
    title: 'Smart Guardrails',
    description: 'Safe, scoped responses with prompt protection',
  },
  {
    icon: 'mail',
    title: 'Contact Agent',
    description: 'Send messages directly via email',
  },
  {
    icon: 'memory',
    title: 'Conversation Memory',
    description: 'SQLite-backed thread persistence across sessions',
  },
];

type FeatureIconType = typeof features[number]['icon'];

const FeatureGlyph = ({ type }: { type: FeatureIconType }) => {
  const commonProps = {
    width: 22,
    height: 22,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  if (type === 'search') {
    return (
      <svg {...commonProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
    );
  }

  if (type === 'github') {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 .8C5.8.8.8 5.8.8 12c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.5v-2.1c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.6-1.2-1.6-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.3.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3.1 1.1a10.7 10.7 0 0 1 5.6 0c2.1-1.4 3.1-1.1 3.1-1.1.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.3.8 1 .8 2.1v3.1c0 .3.2.6.8.5A11.2 11.2 0 0 0 23.2 12C23.2 5.8 18.2.8 12 .8z" />
      </svg>
    );
  }

  if (type === 'stream') {
    return (
      <svg {...commonProps}>
        <path d="M4 7h6" />
        <path d="M4 12h10" />
        <path d="M4 17h16" />
        <path d="m16 8 4 4-4 4" />
      </svg>
    );
  }

  if (type === 'shield') {
    return (
      <svg {...commonProps}>
        <path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6l-7-3z" />
        <path d="m9 12 2 2 4-5" />
      </svg>
    );
  }

  if (type === 'mail') {
    return (
      <svg {...commonProps}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="m4 8 8 6 8-6" />
      </svg>
    );
  }

  return (
    <svg {...commonProps}>
      <path d="M8 7h8" />
      <path d="M8 12h8" />
      <path d="M8 17h5" />
      <rect x="5" y="3" width="14" height="18" rx="2" />
    </svg>
  );
};

const stats = [
  { value: '6', label: 'Assistant Tools' },
  { value: 'Real-Time', label: 'SSE Streaming' },
  { value: 'LangGraph', label: 'Workflow' },
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
          <h2 className={styles.title}>Portfolio Assistant System</h2>
          <p className={styles.subtitle}>
            A backend-focused assistant that demonstrates how I build practical
            AI-enabled systems: FastAPI services, streaming responses, retrieval,
            GitHub tooling, persistence, and contact automation working together.
          </p>
          <button className={styles.tryButton} onClick={handleTryAssistant}>
            <span className={styles.tryButtonText}>Try the Assistant</span>
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
          <h3 className={styles.diagramTitle}>Backend architecture</h3>
          <div className={styles.diagramFlow}>
            {/* Main pipeline: User → FastAPI → LangGraph Agent */}
            <div className={`${styles.diagramNode} ${styles.nodeUser}`}>
              <span className={styles.diagramIcon}>UI</span>
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
              <span className={styles.diagramIcon}>API</span>
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
              <span className={styles.diagramIcon}>LG</span>
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
                <span className={styles.diagramIcon}>RAG</span>
                <span className={styles.diagramLabel}>RAG Search</span>
              </div>
              <div className={`${styles.diagramToolNode} ${styles.toolGithub}`}>
                <span className={styles.diagramIcon}>GH</span>
                <span className={styles.diagramLabel}>GitHub API</span>
              </div>
              <div className={`${styles.diagramToolNode} ${styles.toolEmail}`}>
                <span className={styles.diagramIcon}>MAIL</span>
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
              <span className={styles.diagramIcon}>OUT</span>
              <span className={styles.diagramLabel}>Response</span>
            </div>
          </div>

          {/* SQLite persistence layer */}
          <div className={styles.persistenceLayer}>
            <div className={styles.persistenceConnector}>
              <div className={styles.persistenceConnectorLine} />
            </div>
            <div className={`${styles.diagramNode} ${styles.nodeSqlite}`}>
              <span className={styles.diagramIcon}>DB</span>
              <span className={styles.diagramLabel}>SQLite</span>
              <span className={styles.persistenceSubLabel}>Thread Memory</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className={styles.featuresSection}>
          <h3 className={styles.featuresTitle}>How the assistant works</h3>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div
                className={`${styles.featureCard} ${isVisible ? styles.cardVisible : ''}`}
                key={feature.title}
                style={{ animationDelay: `${0.3 + index * 0.08}s` }}
              >
                <div className={styles.cardGlow} />
                <div className={styles.featureIcon}>
                  <FeatureGlyph type={feature.icon} />
                </div>
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
