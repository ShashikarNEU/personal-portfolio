# Personal Portfolio — Frontend

## Overview
React portfolio for Shashikar Anthoni Raj with an integrated AI chatbot widget.
Frontend plan: @docs/project1-frontend-plan.md

## Tech
- React 18, TypeScript, CSS Modules, CRA (create-react-app)
- Package manager: npm
- IMPORTANT: This is CRA, NOT Vite. Use `process.env.REACT_APP_*` for env vars, NOT `import.meta.env`

## Rules
- Always create a git branch before changes
- Never commit without my approval
- Use context7 MCP for up-to-date library docs whenever writing code/syntax
- Use `.tsx` files and `.module.css` files — match existing codebase pattern
- Do NOT install Tailwind or any new CSS framework — CSS Modules only
- Do NOT add new icon libraries — use inline SVGs for simple icons (send, trash, X, chat bubble)
- Each component lives in `ComponentName/componentName.tsx` + `componentName.module.css`
- Use CSS variables from `vars.css`: `var(--color-primary)`, `var(--color-bg)`, etc.
- All backgrounds use `rgba()` with low opacity for glass/translucent effects — no solid opaque boxes
- Never read or display `.env` file contents

## Design System (from vars.css + index.css)
```css
--color-text: #fff;
--color-primary: #576cbc;     /* Blue-purple — buttons, user bubbles, accents */
--color-secondary: #19376d;   /* Deep navy — bot bubbles, panel backgrounds */
--color-dark: #0b2447;        /* Darker navy — headers */
--color-bg: #04152d;          /* Near-black navy — page background */
Accent green: #5dd6ac         /* Success states, links, active indicators */
Font: "Outfit", Arial, Helvetica, sans-serif
```

## Commands
- Dev server: `npm start`
- Build: `npm run build`
- Lint: `npx eslint src/`

## Existing Dependencies (do NOT duplicate)
- MUI, Bootstrap, react-icons, react-router-dom, react-scroll

## Backend API (already built, separate repo)
```
POST /api/v1/chat
  Request:  { message: string, thread_id: string }
  Response: { response: string, thread_id: string, sources: Source[], email_sent: boolean }
  Source:   { document: string, chunk: string, relevance_score: number }

GET /api/v1/health → { status: "ok" }

Rate limit: 10/minute (429 = plain text, not JSON)
Daily cap: 200 requests (returns normal 200 with friendly message)
500 errors: { detail: "..." } (not ChatResponse schema)
```

## Backend Tech Stack (for reference)
- LLM: GPT-5 Mini (via langchain-openai)
- Embeddings: text-embedding-3-small
- Vector DB: Pinecone (serverless, free tier)
- Framework: FastAPI + LangGraph + SendGrid
