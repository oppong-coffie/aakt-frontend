import apiClient from "./apiClient";
import { API_URL } from "../config/api";

export type AgentRole = "user" | "assistant";
export type AgentActionStatus = "pending" | "approved" | "rejected" | "executed" | "failed";

export interface AgentAction {
  actionId: string;
  toolName: string;
  title: string;
  description: string;
  input: Record<string, unknown>;
  status: AgentActionStatus;
  result?: Record<string, unknown>;
  error?: string;
}

export interface AgentMessage {
  id: string;
  role: AgentRole;
  content: string;
  actions?: AgentAction[];
}

export interface AgentConversationSummary {
  conversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

export interface AgentConversationMessage {
  role: AgentRole;
  content: string;
  actionIds?: string[];
  createdAt: string;
}

export interface AgentConversationDetail {
  conversationId: string;
  title: string;
  messages: AgentConversationMessage[];
  actions: AgentAction[];
}

export interface AgentChatResponse {
  answer: string;
  conversationId: string;
  actions: AgentAction[];
}

export interface AgentActionResponse {
  action: AgentAction;
  assistantMessage?: string;
}

export interface AgentStreamDone {
  answer: string;
  conversationId: string;
  actions: AgentAction[];
}

export interface AgentStreamHandlers {
  onDelta?: (delta: string) => void;
  onStart?: (conversationId: string) => void;
}

async function parseStreamResponse(
  response: Response,
  handlers: AgentStreamHandlers = {}
): Promise<AgentStreamDone> {
  if (!response.ok || !response.body) {
    const message = await response.text();
    throw new Error(message || `Request failed with status code ${response.status}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const processEvent = (event: string): AgentStreamDone | null => {
    const dataLine = event
      .split("\n")
      .find((line) => line.startsWith("data:"));
    if (!dataLine) {
      return null;
    }

    const payload = JSON.parse(dataLine.slice(5).trim()) as
      | { type: "start"; conversationId: string }
      | { type: "delta"; delta: string }
      | ({ type: "done" } & AgentStreamDone)
      | { type: "error"; error: string };

    if (payload.type === "start") {
      handlers.onStart?.(payload.conversationId);
      return null;
    }
    if (payload.type === "delta") {
      handlers.onDelta?.(payload.delta);
      return null;
    }
    if (payload.type === "error") {
      throw new Error(payload.error);
    }
    return payload;
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value ?? new Uint8Array(), { stream: !done });

    let boundary = buffer.indexOf("\n\n");
    while (boundary !== -1) {
      const event = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      const result = processEvent(event);
      if (result) {
        return result;
      }
      boundary = buffer.indexOf("\n\n");
    }

    if (done) {
      break;
    }
  }

  throw new Error("The assistant stream ended before a final response was received.");
}

export const agentService = {
  chat: async (payload: {
    message: string;
    conversationId?: string;
    scope?: Record<string, string | undefined>;
  }): Promise<AgentChatResponse> => {
    const response = await apiClient.post("/agent/chat", payload);
    return response.data;
  },

  chatStream: async (
    payload: {
      message: string;
      conversationId?: string;
      scope?: Record<string, string | undefined>;
    },
    handlers: AgentStreamHandlers = {}
  ): Promise<AgentStreamDone> => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/agent/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(payload),
    });

    return parseStreamResponse(response, handlers);
  },

  confirmAction: async (actionId: string): Promise<AgentActionResponse> => {
    const response = await apiClient.post(`/agent/actions/${actionId}/confirm`);
    return {
      action: response.data.data,
      assistantMessage: response.data.assistantMessage,
    };
  },

  rejectAction: async (actionId: string): Promise<AgentActionResponse> => {
    const response = await apiClient.post(`/agent/actions/${actionId}/reject`);
    return {
      action: response.data.data,
      assistantMessage: response.data.assistantMessage,
    };
  },

  listConversations: async (): Promise<AgentConversationSummary[]> => {
    const response = await apiClient.get("/agent/conversations");
    return response.data.data;
  },

  getConversation: async (conversationId: string): Promise<AgentConversationDetail> => {
    const response = await apiClient.get(`/agent/conversations/${conversationId}`);
    return response.data.data;
  },
};
