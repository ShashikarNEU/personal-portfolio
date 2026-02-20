// Strip trailing /api/v1 if present for backward compat with existing env config
const envUrl = process.env.REACT_APP_API_URL || "http://localhost:8000";
const API_BASE = envUrl.replace(/\/api\/v[12](\/.*)?$/, "");
const STREAM_URL = `${API_BASE}/api/v2/chat/stream`;
const SYNC_URL = `${API_BASE}/api/v1/chat`;

export interface Source {
  document: string;
  chunk: string;
  relevance_score: number;
}

export interface ChatResponse {
  response: string;
  thread_id: string;
  sources: Source[];
  email_sent: boolean;
}

export type SSEEventType =
  | "thinking"
  | "token"
  | "tool_call"
  | "tool_result"
  | "sources"
  | "email_status"
  | "done"
  | "error"
  | "thread_reset";

export interface SSECallbacks {
  onThinking: (text: string) => void;
  onToken: (token: string) => void;
  onToolCall: (toolName: string) => void;
  onToolResult: (result: string) => void;
  onSources: (sources: Source[]) => void;
  onEmailStatus: (sent: boolean) => void;
  onDone: (threadId: string) => void;
  onError: (message: string) => void;
  onThreadReset: (message: string) => void;
}

/**
 * Stream a chat message via SSE (POST /api/v2/chat/stream).
 * Only throws on network-level failures (TypeError, AbortError) to trigger sync fallback.
 * Server errors (429, 500, etc.) call callbacks.onError() instead.
 */
export async function streamMessage(
  message: string,
  threadId: string,
  callbacks: SSECallbacks,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(STREAM_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, thread_id: threadId }),
    signal,
  });

  if (res.status === 429) {
    callbacks.onError(
      "You're sending messages too fast. Please wait a moment."
    );
    return;
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    callbacks.onError(
      body?.detail || "Something went wrong. Please try again later."
    );
    return;
  }

  if (!res.body) {
    callbacks.onError("Streaming not supported by the server.");
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      // Keep the last incomplete line in the buffer
      buffer = lines.pop() || "";

      let currentEvent: string | null = null;

      for (const line of lines) {
        if (line.startsWith("event:")) {
          currentEvent = line.slice(6).trim();
        } else if (line.startsWith("data:") && currentEvent) {
          // Handle both "data: {...}" and "data:{...}" (SSE spec allows no space)
          const dataStr = line.startsWith("data: ") ? line.slice(6) : line.slice(5);
          try {
            const data = JSON.parse(dataStr);
            dispatchSSEEvent(currentEvent as SSEEventType, data, callbacks);
          } catch {
            // Skip malformed JSON
          }
          currentEvent = null;
        } else if (line.trim() === "") {
          // Blank line = end of event block, but only reset if we already dispatched
          // (currentEvent is already null after dispatch)
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

function dispatchSSEEvent(
  event: SSEEventType,
  data: any,
  callbacks: SSECallbacks
): void {
  switch (event) {
    case "thinking":
      callbacks.onThinking(data.text || data.step || "");
      break;
    case "token":
      callbacks.onToken(data.text || data.token || data.content || "");
      break;
    case "tool_call":
      callbacks.onToolCall(data.tool || data.name || "");
      break;
    case "tool_result":
      callbacks.onToolResult(data.preview || data.result || data.output || "");
      break;
    case "sources":
      callbacks.onSources(data.sources || data || []);
      break;
    case "email_status":
      callbacks.onEmailStatus(data.sent ?? data.email_sent ?? false);
      break;
    case "done":
      callbacks.onDone(data.thread_id || "");
      break;
    case "error":
      callbacks.onError(data.message || data.detail || "An error occurred.");
      break;
    case "thread_reset":
      callbacks.onThreadReset(data.message || "Conversation was reset.");
      break;
  }
}

export async function sendMessageSync(
  message: string,
  threadId: string
): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(SYNC_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, thread_id: threadId }),
      signal: controller.signal,
    });

    if (res.status === 429) {
      throw new Error(
        "You're sending messages too fast. Please wait a moment."
      );
    }

    if (res.status === 500) {
      const body = await res.json().catch(() => null);
      const detail =
        body?.detail || "Something went wrong. Please try again later.";
      throw new Error(detail);
    }

    if (!res.ok) {
      throw new Error("Something went wrong. Please try again later.");
    }

    return (await res.json()) as ChatResponse;
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error(
        "Can't reach the server right now. The backend may be offline."
      );
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(
        "Request timed out. The server took too long to respond."
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
