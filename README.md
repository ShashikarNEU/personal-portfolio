<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/CSS_Modules-Scoped_Styling-264de4?logo=css3&logoColor=white" alt="CSS Modules" />
  <img src="https://img.shields.io/badge/SSE-Real--Time_Streaming-FF6600?logo=data:image/svg+xml;base64,&logoColor=white" alt="SSE" />
  <img src="https://img.shields.io/badge/Netlify-Deployed-00C7B7?logo=netlify&logoColor=white" alt="Netlify" />
</p>

# Personal Portfolio — Shashikar Anthoni Raj

A modern, responsive portfolio website with an integrated **AI chatbot widget** that streams responses in real-time. Built with React 18, TypeScript, and CSS Modules with a glass-morphism design system.

The chatbot connects to a **multi-agent RAG backend** (GPT-5 Mini + LangGraph + Pinecone + GitHub API) — see the [Backend Repo](https://github.com/ShashikarNEU/portfolio-rag-chatbot) for architecture details.

### [Live Demo](https://shashikaranthoniraj.netlify.app) | [Backend Repo](https://github.com/ShashikarNEU/portfolio-rag-chatbot)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 18** | UI framework with hooks-based architecture |
| **TypeScript** | Type-safe components, API contracts, and SSE event types |
| **CSS Modules** | Scoped styling with CSS variables and glass-morphism effects |
| **Custom SSE Client** | `ReadableStream`-based parser for real-time server-sent events |
| **Create React App** | Project scaffolding and build tooling |
| **Netlify** | Hosting with continuous deployment from `main` |

---

## Chatbot Widget

A floating chat widget that streams AI responses token-by-token with live progress indicators.

### Frontend Capabilities
- **Real-time SSE streaming** — Custom `ReadableStream` parser handles 8 event types (`thinking`, `token`, `tool_call`, `tool_result`, `sources`, `email_status`, `done`, `thread_reset`)
- **Multi-step thinking indicator** — Perplexity/Claude-style progress animation that reveals backend processing stages as they happen
- **Sync fallback** — Automatically falls back to `POST /api/v1/chat` (full JSON response) if SSE streaming fails
- **Thread persistence** — Conversation thread IDs stored in `localStorage`, synced from server responses on every reply
- **Thread recovery** — Handles `thread_reset` SSE events from corrupted threads (orphaned tool calls) by auto-generating a new thread
- **Expandable source citations** — Collapsible cards showing document names, relevance scores, and content chunks
- **Email confirmation cards** — Inline success UI when the backend's email agent delivers a message
- **Basic markdown rendering** — Bold text and links parsed via regex (no external markdown library)
- **Abort handling** — `AbortController` with 60s safety timeout, clean cancellation on panel close
- **Mobile responsive** — Full-screen overlay on viewports < 640px

### Component Architecture

```
src/
├── services/
│   └── chatApi.ts              # SSE stream parser + sync fallback + typed events
├── hooks/
│   └── useChat.ts              # Chat state, thread management, streaming callbacks
├── components/chatbot/
│   ├── ChatWidget.tsx           # Floating button + panel container + animations
│   ├── ChatPanel.tsx            # Message list + suggestion chips + auto-scroll
│   ├── ChatMessage.tsx          # User/bot/error bubbles + markdown + citations
│   ├── ChatInput.tsx            # Textarea + send button + character count
│   ├── ThinkingIndicator.tsx    # Multi-step RAG progress animation
│   ├── SourceCard.tsx           # Expandable source citations
│   └── EmailConfirmation.tsx    # Email delivery success card
└── components/AIShowcase/
    ├── aiShowcase.tsx           # Portfolio section with architecture diagram
    └── TechBadge.tsx            # Pill-shaped tech stack tags
```

### SSE Event Handling

The frontend parses a custom SSE protocol from the backend. Each event type maps to a specific UI update:

| Event | Frontend Action |
|---|---|
| `thinking` | Appends a step to the thinking indicator |
| `token` | Appends text to the streaming bot bubble |
| `tool_call` | Logged (backend thinking events handle UI) |
| `sources` | Attaches citation data to the message |
| `email_status` | Shows inline email confirmation card |
| `done` | Syncs thread ID, marks streaming complete |
| `thread_reset` | Resets chat state, generates new thread, shows info message |
| `error` | Renders error bubble with warning icon |

### Backend (Separate Repo)

The chatbot is powered by a **multi-agent RAG system** with live GitHub integration, semantic search, and an email agent. Built with FastAPI, LangGraph, GPT-5 Mini, and Pinecone.

**[View Backend Repo & Architecture](https://github.com/ShashikarNEU/portfolio-rag-chatbot)**

---

## Design System

```css
--color-text: #fff;
--color-primary: #576cbc;     /* Blue-purple — buttons, user bubbles, accents */
--color-secondary: #19376d;   /* Deep navy — bot bubbles, panel backgrounds */
--color-dark: #0b2447;        /* Darker navy — headers */
--color-bg: #04152d;          /* Near-black navy — page background */
Accent green: #5dd6ac         /* Success states, links, active indicators */
Font: "Outfit", Arial, Helvetica, sans-serif
```

All backgrounds use `rgba()` with low opacity for glass/translucent effects — no solid opaque boxes. Chat panel uses `backdrop-filter: blur(12px)`.

---

## Portfolio Sections

- **About** — Background, education, and career summary
- **Experience** — Work history at Saayam For All and Ford Motor Company
- **Education** — MS @ Northeastern University, B.Tech @ NIT Warangal
- **Skills** — Languages, frameworks, cloud platforms, and tools
- **AI-Powered Portfolio** — Interactive showcase of the chatbot with architecture diagram and live demo trigger
- **Projects** — Featured projects with descriptions and GitHub links
- **Contact** — Direct contact form and social links

---

## Featured Projects

| Project | Description |
|---|---|
| **Portfolio RAG Chatbot** | Multi-agent system with RAG, GitHub API integration, email agent, and SSE streaming ([Backend](https://github.com/ShashikarNEU/portfolio-rag-chatbot)) |
| **Sidekick AI Agent** | Autonomous LangGraph agent with browser automation, web search, and code execution tools |
| **Plan API** | Distributed REST API with Redis, Elasticsearch, RabbitMQ, and Google OAuth |
| **Cloud Web App** | Spring Boot app deployed on GCP with Terraform, CI/CD, and auto-scaling |
| **locAll** | Full-stack community marketplace with Mapbox, Stripe, and weather integrations |

---

## Getting Started

### Prerequisites
- Node.js 16+
- npm

### Local Development

```bash
git clone https://github.com/ShashikarNEU/personal-portfolio.git
cd personal-portfolio
npm install
npm start
```

App runs at `http://localhost:3000`.

### Environment Variables

| Variable | Description | Default |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8000` |

### Build

```bash
npm run build
```

---

## Deployment

| Service | Branch | URL |
|---|---|---|
| **Frontend (Netlify)** | `main` | [shashikaranthoniraj.netlify.app](https://shashikaranthoniraj.netlify.app) |
| **Backend (Render)** | `main` | [portfolio-rag-chatbot-x19x.onrender.com](https://portfolio-rag-chatbot-x19x.onrender.com) |

---

## About Me

Software Engineer with 2.5+ years of full-stack development experience, with a focus on **AI/ML**. MS in Information Systems from Northeastern University, B.Tech from NIT Warangal.

[LinkedIn](https://linkedin.com/in/shashikar-anthoniraj) | [GitHub](https://github.com/ShashikarNEU) | anthoniraj.s@northeastern.edu
