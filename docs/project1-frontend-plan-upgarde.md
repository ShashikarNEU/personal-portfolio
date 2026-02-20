# Frontend Upgrade Phase: SSE Streaming + GitHub UI

## Context
- The chatbot frontend is FULLY BUILT and working with the V1 sync endpoint (`POST /api/v1/chat`)
- Backend is being upgraded to add:
  - `POST /api/v2/chat/stream` — SSE streaming endpoint
  - GitHub tools (get_github_repos, get_github_repo_details, get_file_content, get_github_activity)
- This phase upgrades the frontend to consume SSE streams and show GitHub-aware thinking states
- DO NOT break existing functionality — V1 sync becomes the fallback

## Existing Files to Modify

```
src/
├── services/
│   └── chatApi.ts                    ← REWRITE: add SSE streaming client + keep sync as fallback
├── hooks/
│   └── useChat.ts                    ← MODIFY: streaming-aware state management
├── components/
│   ├── chatbot/
│   │   ├── ChatPanel.tsx             ← MODIFY: handle streaming message state
│   │   ├── ChatMessage.tsx           ← MODIFY: add streaming cursor
│   │   ├── ChatMessage.module.css    ← MODIFY: add cursor animation
│   │   ├── ThinkingIndicator.tsx     ← REWRITE: SSE-driven steps with badges (keep timer fallback)
│   │   └── ThinkingIndicator.module.css ← MODIFY: add badge styles
│   └── AIShowcase/
│       └── aiShowcase.tsx            ← MODIFY: update feature cards text
```

No new files needed. All changes are upgrades to existing components.

---

## 1. `services/chatApi.ts` — Add SSE Client

**Keep the existing `sendMessageSync` function exactly as-is.** Add a NEW `streamMessage` function above it.

```typescript
// ADD these new types at the top (keep existing Source, ChatResponse types)

export type SSEEventType = "thinking" | "token" | "tool_call" | "tool_result" | "sources" | "email_status" | "done" | "error";

export interface SSECallbacks {
  onThinking: (step: string) => void;
  onToken: (text: string) => void;
  onToolCall: (name: string, args: Record<string, unknown>) => void;
  onToolResult: (name: string) => void;
  onSources: (sources: Source[]) => void;
  onEmailStatus: (sent: boolean) => void;
  onDone: (threadId: string) => void;
  onError: (message: string) => void;
}
```

**Add this new function:**

```typescript
// CHANGE: API_URL should be base URL without /api/v1
// Before: const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000/api/v1"
// After:
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";
const STREAM_URL = `${API_BASE}/api/v2/chat/stream`;
const SYNC_URL = `${API_BASE}/api/v1/chat`;  // Update existing sendMessageSync to use this

/**
 * PRIMARY: Stream chat response via SSE
 * Uses fetch + ReadableStream (EventSource API only supports GET, we need POST)
 */
export async function streamMessage(
  message: string,
  threadId: string | null,
  callbacks: SSECallbacks,
  abortSignal?: AbortSignal
): Promise<void> {
  const body: Record<string, string> = { message };
  if (threadId) body.thread_id = threadId;

  const response = await fetch(STREAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: abortSignal,
  });

  if (response.status === 429) {
    callbacks.onError("You're sending messages too fast. Please wait a moment.");
    return;
  }
  if (!response.ok) {
    callbacks.onError("Something went wrong. Please try again later.");
    return;
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // Parse SSE events: "event: <type>\ndata: <json>\n\n"
    const parts = buffer.split("\n\n");
    buffer = parts.pop() || "";  // Keep incomplete event in buffer

    for (const part of parts) {
      const lines = part.split("\n");
      let eventType = "";
      let data = "";

      for (const line of lines) {
        if (line.startsWith("event: ")) eventType = line.slice(7).trim();
        else if (line.startsWith("data: ")) data = line.slice(6);
      }

      if (!eventType || !data) continue;

      try {
        const parsed = JSON.parse(data);
        switch (eventType) {
          case "thinking": callbacks.onThinking(parsed.step); break;
          case "token": callbacks.onToken(parsed.text); break;
          case "tool_call": callbacks.onToolCall(parsed.name, parsed.args); break;
          case "tool_result": callbacks.onToolResult(parsed.name); break;
          case "sources": callbacks.onSources(parsed); break;
          case "email_status": callbacks.onEmailStatus(parsed.sent); break;
          case "done": callbacks.onDone(parsed.thread_id); break;
          case "error": callbacks.onError(parsed.message); break;
        }
      } catch {
        // Skip malformed events
      }
    }
  }
}
```

**Also update existing `sendMessageSync` to use `SYNC_URL` constant** instead of the old `API_URL`. The function logic stays the same.

---

## 2. `hooks/useChat.ts` — Streaming-Aware State

**Add these new fields to `ChatMessageData` interface:**

```typescript
// ADD to existing interface:
isStreaming?: boolean;      // true while tokens are still arriving
thinkingSteps?: string[];   // live thinking steps from SSE events
```

**Add a new ref for abort control:**

```typescript
// ADD near other refs:
const abortControllerRef = useRef<AbortController | null>(null);
```

**Replace the `sendMessage` function body** with streaming-first logic:

```typescript
const sendMessage = async (text: string) => {
  // 1. Add user message (same as before)
  const userMsg: ChatMessageData = {
    id: crypto.randomUUID(),
    role: "user",
    text,
    timestamp: Date.now(),
  };
  setMessages(prev => [...prev, userMsg]);
  setIsLoading(true);

  // 2. Create bot placeholder with streaming state
  const botMsgId = crypto.randomUUID();
  const botPlaceholder: ChatMessageData = {
    id: botMsgId,
    role: "bot",
    text: "",
    isStreaming: true,
    thinkingSteps: [],
    timestamp: Date.now(),
  };
  setMessages(prev => [...prev, botPlaceholder]);

  // 3. Try SSE streaming first, fallback to sync
  const abortController = new AbortController();
  abortControllerRef.current = abortController;

  try {
    await streamMessage(
      text,
      threadIdRef.current,
      {
        onThinking: (step: string) => {
          setMessages(prev => prev.map(m =>
            m.id === botMsgId
              ? { ...m, thinkingSteps: [...(m.thinkingSteps || []), step] }
              : m
          ));
        },

        onToken: (token: string) => {
          setMessages(prev => prev.map(m =>
            m.id === botMsgId
              ? { ...m, text: m.text + token }
              : m
          ));
        },

        onToolCall: (name: string) => {
          // Map tool names to user-friendly thinking steps
          let step = `Calling ${name}...`;
          if (name.includes("search") || name.includes("portfolio")) step = "Searching knowledge base...";
          else if (name.includes("file_content")) step = "Reading source code...";
          else if (name.includes("github")) step = "Fetching live GitHub data...";
          else if (name.includes("email")) step = "Sending email...";

          setMessages(prev => prev.map(m =>
            m.id === botMsgId
              ? { ...m, thinkingSteps: [...(m.thinkingSteps || []), step] }
              : m
          ));
        },

        onToolResult: (_name: string) => {
          setMessages(prev => prev.map(m =>
            m.id === botMsgId
              ? { ...m, thinkingSteps: [...(m.thinkingSteps || []), "Generating response..."] }
              : m
          ));
        },

        onSources: (sources) => {
          setMessages(prev => prev.map(m =>
            m.id === botMsgId ? { ...m, sources } : m
          ));
        },

        onEmailStatus: (sent: boolean) => {
          setMessages(prev => prev.map(m =>
            m.id === botMsgId ? { ...m, emailSent: sent } : m
          ));
        },

        onDone: (threadId: string) => {
          threadIdRef.current = threadId;
          localStorage.setItem("chatbot_thread_id", threadId);
          setMessages(prev => prev.map(m =>
            m.id === botMsgId ? { ...m, isStreaming: false } : m
          ));
          setIsLoading(false);
        },

        onError: (message: string) => {
          setMessages(prev => prev.map(m =>
            m.id === botMsgId
              ? { ...m, text: message, isError: true, isStreaming: false }
              : m
          ));
          setIsLoading(false);
        },
      },
      abortController.signal
    );
  } catch (e) {
    // Network error or streaming failed → fallback to sync
    console.warn("SSE streaming failed, falling back to sync:", e);

    try {
      // Update thinking to show fallback mode
      setMessages(prev => prev.map(m =>
        m.id === botMsgId
          ? { ...m, text: "", thinkingSteps: [], isStreaming: true, isFallback: true }
          : m
      ));

      const response = await sendMessageSync(text, threadIdRef.current || crypto.randomUUID());

      threadIdRef.current = response.thread_id;
      localStorage.setItem("chatbot_thread_id", response.thread_id);

      setMessages(prev => prev.map(m =>
        m.id === botMsgId
          ? {
              ...m,
              text: response.response,
              sources: response.sources,
              emailSent: response.email_sent,
              isStreaming: false,
              isFallback: false,
            }
          : m
      ));
    } catch (syncError) {
      const errorMsg = syncError instanceof Error ? syncError.message : "Something went wrong.";
      setMessages(prev => prev.map(m =>
        m.id === botMsgId
          ? { ...m, text: errorMsg, isError: true, isStreaming: false, isFallback: false }
          : m
      ));
    }
    setIsLoading(false);
  }
};
```

**Update `clearChat`** to abort any active stream:

```typescript
const clearChat = () => {
  if (abortControllerRef.current) abortControllerRef.current.abort();
  // ... rest of existing clearChat logic
};
```

**Add `isFallback` to ChatMessageData interface** (optional field):

```typescript
isFallback?: boolean;  // true when streaming failed and using sync fallback
```

---

## 3. `ChatPanel.tsx` — Handle Streaming Message State

**Change:** Update the message rendering logic to show ThinkingIndicator for streaming messages that have no text yet.

Find where messages are mapped to `<ChatMessage />` components. Update the rendering logic:

```tsx
{messages.map((msg) => (
  <React.Fragment key={msg.id}>
    {/* Show ThinkingIndicator when streaming but no tokens yet */}
    {msg.isStreaming && msg.text === "" && msg.role === "bot" ? (
      <ThinkingIndicator
        steps={msg.thinkingSteps || []}
        isFallback={msg.isFallback || false}
      />
    ) : (
      <ChatMessage message={msg} />
    )}
  </React.Fragment>
))}
```

**When tokens start arriving** (msg.text !== ""), the ThinkingIndicator disappears and the streaming ChatMessage takes over.

**Update auto-scroll:** Throttle scroll-to-bottom during streaming to avoid jank. Instead of scrolling on every token, debounce to ~200ms:

```typescript
// ADD a throttled scroll ref
const scrollThrottle = useRef<NodeJS.Timeout | null>(null);

// In useEffect that watches messages:
useEffect(() => {
  if (scrollThrottle.current) return;
  scrollThrottle.current = setTimeout(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    scrollThrottle.current = null;
  }, 200);
}, [messages]);
```

**Update suggestion chips:** Change the third chip text:

```
Before: "What are his top skills?" | "Tell me about his projects" | "Contact Shashikar"
After:   "What are his top skills?" | "Explore his GitHub" | "Tell me about his projects" | "Contact Shashikar"
```

Four chips instead of three. Add "Explore his GitHub" as the second chip.

---

## 4. `ChatMessage.tsx` — Add Streaming Cursor

**Add a blinking cursor** at the end of the text when `isStreaming` is true AND text is not empty:

```tsx
// In the bot message render, after the parsed text content:
{message.isStreaming && message.text && (
  <span className={styles.streamingCursor} />
)}
```

The cursor disappears automatically when `isStreaming` flips to `false` (on the "done" SSE event).

---

## 5. `ChatMessage.module.css` — Cursor Animation

**Add these styles:**

```css
.streamingCursor {
  display: inline-block;
  width: 2px;
  height: 16px;
  background: #5dd6ac;
  margin-left: 2px;
  vertical-align: text-bottom;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}
```

---

## 6. `ThinkingIndicator.tsx` — REWRITE (SSE-driven + badges)

This is the biggest change. The component now receives REAL steps from SSE events instead of using fake timers.

**New props interface:**

```typescript
interface ThinkingIndicatorProps {
  steps: string[];       // Live steps from SSE events (via useChat)
  isFallback: boolean;   // true = sync mode, use timer-based fake steps
}
```

**SSE mode (isFallback = false):**
- Render `steps` prop as-is — each entry is a step from the backend
- ALL steps EXCEPT the last: show ✓ green checkmark, dimmed text (completed)
- LAST step: show pulsing green dot, white text with glow (active)
- Each new step fades in with the existing fadeInSlide animation
- Show a colored BADGE next to each step based on content:
  - Step contains "knowledge base" or "relevance" → `RAG` badge (blue, rgba(87,108,188,0.25))
  - Step contains "GitHub" or "repository" or "repo" → `GitHub API` badge (green, rgba(93,214,172,0.15))
  - Step contains "source code" or "file_content" or "Reading" → `Code` badge (pink, rgba(247,37,133,0.15))
  - Step contains "email" or "SendGrid" → `Email` badge (green)
  - All others → no badge

**Badge logic (simple keyword matching):**

```tsx
function getBadge(step: string): { label: string; className: string } | null {
  const lower = step.toLowerCase();
  if (lower.includes("knowledge base") || lower.includes("relevance") || lower.includes("searching"))
    return { label: "RAG", className: styles.badgeRag };
  if (lower.includes("github") || lower.includes("repository") || lower.includes("repo"))
    return { label: "GitHub API", className: styles.badgeGithub };
  if (lower.includes("source code") || lower.includes("file_content") || lower.includes("reading source"))
    return { label: "Code", className: styles.badgeCode };
  if (lower.includes("email") || lower.includes("sendgrid"))
    return { label: "Email", className: styles.badgeEmail };
  return null;
}
```

**Fallback mode (isFallback = true):**
- IGNORE the `steps` prop entirely
- Use timer-based fake steps (same as the original V1 implementation):

```typescript
const FALLBACK_STEPS = [
  { text: "Searching knowledge base...", delay: 0 },
  { text: "Analyzing relevance...", delay: 2500 },
  { text: "Generating response...", delay: 5500 },
  { text: "Almost there...", delay: 10000 },
];
```

- Use `useEffect` with `setTimeout` for each step
- Clean up all timeouts on unmount
- Same visual rendering as SSE mode (checkmarks, pulsing dot)

**The component renders identically in both modes** — the only difference is where the steps come from (SSE events vs timers).

---

## 7. `ThinkingIndicator.module.css` — Add Badge Styles

**Add these badge styles:**

```css
/* Tool badges next to thinking steps */
.badge {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 600;
  margin-left: 6px;
  vertical-align: middle;
}

.badgeRag {
  composes: badge;
  background: rgba(87, 108, 188, 0.25);
  color: rgba(87, 108, 188, 0.9);
}

.badgeGithub {
  composes: badge;
  background: rgba(93, 214, 172, 0.15);
  color: #5dd6ac;
}

.badgeCode {
  composes: badge;
  background: rgba(247, 37, 133, 0.15);
  color: #f72585;
}

.badgeEmail {
  composes: badge;
  background: rgba(93, 214, 172, 0.15);
  color: #5dd6ac;
}
```

---

## 8. `AIShowcase/aiShowcase.tsx` — Update Feature Cards

**Update the 4 feature cards** to reflect GitHub integration:

Before:
```
🔍 "Semantic Search" — "Advanced RAG with query expansion & reranking"
🤖 "Multi-Agent System" — "Intelligent orchestration via LangGraph"
🛡️ "Smart Guardrails" — "Safe, scoped responses with prompt protection"
📧 "Contact Agent" — "Send messages directly via email"
```

After:
```
🔍 "Semantic Search" — "Advanced RAG with query expansion & reranking"
🤖 "Live GitHub Integration" — "Explores repos, reads code, analyzes architecture in real-time"
🛡️ "Smart Guardrails" — "Safe, scoped responses with prompt protection"
📧 "Contact Agent" — "Send messages directly via email"
```

**Update tech badges:** Add `[GitHub API]` to the list:

```
[FastAPI] [LangGraph] [OpenAI] [Pinecone] [GitHub API] [React] [SendGrid] [Python] [TypeScript]
```

**Update description text** to mention GitHub:

```
"This portfolio features an AI chatbot that can answer questions about my
projects and skills, explore my GitHub repositories in real-time, read
actual source code — or send me a message directly."
```

---

## Environment Variable Change

```bash
# BEFORE (.env and Netlify):
REACT_APP_API_URL=http://localhost:8000/api/v1

# AFTER:
REACT_APP_API_URL=http://localhost:8000
```

The URL is now the BASE without `/api/v1`. The `chatApi.ts` appends `/api/v2/chat/stream` or `/api/v1/chat` as needed.

**IMPORTANT:** Update Netlify env var in production too when deploying.

---

## Edge Cases to Handle

1. **Streaming endpoint not yet deployed:** The `streamMessage` fetch will fail (404 or network error). The catch block falls back to `sendMessageSync` automatically. Users see the old timer-based thinking indicator. Zero breakage.

2. **Streaming starts but connection drops mid-stream:** The ReadableStream read loop will exit when `done` is true. If the "done" event never arrives, the bot message stays in `isStreaming: true` state. Add a safety timeout in `useChat`:
   ```typescript
   // After starting the stream, set a 60s safety timeout
   const safetyTimeout = setTimeout(() => {
     abortControllerRef.current?.abort();
     setMessages(prev => prev.map(m =>
       m.id === botMsgId && m.isStreaming
         ? { ...m, isStreaming: false, text: m.text || "Response interrupted. Please try again." }
         : m
     ));
     setIsLoading(false);
   }, 60000);
   // Clear it in onDone callback
   ```

3. **Token deduplication:** The backend's `astream_events` may emit tokens from the routing LLM pass (before tool calls) AND the response generation pass (after tool calls). The backend should handle this filtering. If you see garbage tokens appearing before the tool results, that's a backend issue — frontend just appends whatever `onToken` receives.

4. **Multiple rapid tool calls:** In the 2-loop code read scenario (get_github_repo_details → get_file_content), the thinking steps will show:
   ```
   ✓ Processing your message...
   ✓ Fetching live GitHub data...        [GitHub API]
   ✓ Reading source code...              [Code]
   ● Generating response...
   ```
   This is correct behavior. Each `onToolCall` and `onToolResult` callback adds a step. No special handling needed.

5. **Empty thinking steps:** If the backend only sends `token` events with no `thinking` events, `thinkingSteps` stays empty, `text` stays empty briefly until the first token, then the message renders as a streaming bot bubble immediately. No ThinkingIndicator flashes. This is fine.

6. **Thread ID sync:** The `onDone` callback receives `thread_id` from the backend. ALWAYS use this over the client-generated one. Same rule as V1, just moved from response JSON to SSE event.

---

## What NOT to Change

- ChatWidget.tsx — no changes needed (open/close, mobile, custom event listener all stay the same)
- ChatInput.tsx — no changes needed
- SourceCard.tsx — no changes needed (sources still arrive the same way, just via SSE now)
- EmailConfirmation.tsx — no changes needed
- Any CSS that isn't specifically listed above

---

## Quality Checks After Upgrade

1. **SSE streaming works:** Send a message → see ThinkingIndicator with LIVE steps appearing one by one from SSE events
2. **Badges appear:** RAG questions show blue `RAG` badge, GitHub questions show green `GitHub API` badge, code read shows pink `Code` badge
3. **Tokens stream:** After thinking indicator disappears, tokens appear one by one with blinking green cursor
4. **Cursor disappears:** When streaming completes, cursor is gone, sources appear below
5. **Fallback works:** If you kill the streaming endpoint (stop backend), the frontend falls back to sync with timer-based ThinkingIndicator. No errors visible to user.
6. **Thread ID persists:** After streaming response, check localStorage — thread_id should match the server's returned value
7. **Abort works:** Open chat, send message, close chat or clear chat mid-stream — no orphaned state, no console errors
8. **AIShowcase updated:** "Live GitHub Integration" card, `[GitHub API]` badge, updated description
9. **Suggestion chips:** 4 chips now including "Explore his GitHub"
10. **All V1 functionality preserved:** Sources expand/collapse, email confirmation shows, error states render, mobile overlay works
11. **No TypeScript errors, no console warnings**

---

## Build Order for Claude Code

```
1. chatApi.ts
   - Change API_URL to API_BASE (no /api/v1 suffix)
   - Add STREAM_URL and SYNC_URL constants
   - Add SSECallbacks interface and streamMessage function
   - Update sendMessageSync to use SYNC_URL
   - DO NOT remove any existing code, only add and modify

2. useChat.ts
   - Add isStreaming, thinkingSteps, isFallback to ChatMessageData
   - Add abortControllerRef
   - Replace sendMessage function body with streaming-first logic
   - Update clearChat to abort active streams
   - Add 60s safety timeout

3. ThinkingIndicator.tsx + .module.css
   - Rewrite to accept { steps, isFallback } props
   - SSE mode: render steps from props with badges
   - Fallback mode: timer-based steps (same as current)
   - Add badge styles to module.css
   - Keep ALL existing visual styles (pulsing dot, checkmarks, glassmorphism, vertical line)

4. ChatMessage.tsx + .module.css
   - Add streaming cursor span when isStreaming && text !== ""
   - Add cursor CSS animation

5. ChatPanel.tsx
   - Update message rendering: ThinkingIndicator when streaming + no text
   - Add "Explore his GitHub" chip (4 chips total)
   - Throttle auto-scroll during streaming (200ms debounce)

6. AIShowcase/aiShowcase.tsx
   - Update feature card #2 to "Live GitHub Integration"
   - Add [GitHub API] to tech badges
   - Update description text

7. Test full flow
   - Test with backend streaming endpoint running
   - Test with backend streaming endpoint DOWN (should fallback to sync)
   - Test mid-stream abort (close panel, clear chat)
   - Test on mobile
```