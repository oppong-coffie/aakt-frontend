import apiClient from "./apiClient";

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

export interface AgentChatResponse {
  answer: string;
  conversationId: string;
  actions: AgentAction[];
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

  confirmAction: async (actionId: string): Promise<AgentAction> => {
    const response = await apiClient.post(`/agent/actions/${actionId}/confirm`);
    return response.data.data;
  },

  rejectAction: async (actionId: string): Promise<AgentAction> => {
    const response = await apiClient.post(`/agent/actions/${actionId}/reject`);
    return response.data.data;
  },
};
