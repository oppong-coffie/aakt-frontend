import {
  Bot,
  Brain,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  FileText,
  FolderKanban,
  History,
  Loader2,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";
import { useLocation } from "react-router-dom";
import {
  agentService,
  type AgentAction,
  type AgentConversationSummary,
  type AgentMessage,
} from "../../api/agent.service";
import AgentActionCard from "../../components/agent/AgentActionCard";

const STARTER_PROMPTS = [
  {
    icon: BriefcaseBusiness,
    title: "Map the business system",
    description: "Summarize active businesses, projects, and open operational gaps.",
    prompt: "Map my current business system and highlight the most important gaps.",
  },
  {
    icon: FolderKanban,
    title: "Plan next workload",
    description: "Create a focused workload from the current business context.",
    prompt: "Plan the next workload I should create and propose the first tasks.",
  },
  {
    icon: FileText,
    title: "Organize documents",
    description: "Find missing folders, documents, and business task structure.",
    prompt: "Review my folders, documents, and business tasks. What should be organized next?",
  },
  {
    icon: Brain,
    title: "Design an agent process",
    description: "Draft an agent/task/block operating process for a business goal.",
    prompt: "Design a guided agent/task/block process for my highest priority business goal.",
  },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Recent";
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function buildMessageList(
  conversationId: string,
  messages: Array<{ role: "user" | "assistant"; content: string; actionIds?: string[] }>,
  actions: AgentAction[]
): AgentMessage[] {
  const actionsById = new Map(actions.map((action) => [action.actionId, action]));
  return messages.map((message, index) => ({
    id: `${conversationId}-${index}`,
    role: message.role,
    content: message.content,
    actions: message.actionIds
      ?.map((actionId) => actionsById.get(actionId))
      .filter((action): action is AgentAction => Boolean(action)),
  }));
}

export default function AgentWorkspace() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [conversations, setConversations] = useState<AgentConversationSummary[]>([]);
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const listRef = useRef<HTMLDivElement>(null);

  const scope = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      businessId: params.get("businessId") ?? undefined,
      currentPath: `${location.pathname}${location.search}`,
    };
  }, [location.pathname, location.search]);

  const refreshConversations = async () => {
    const data = await agentService.listConversations();
    setConversations(data);
  };

  useEffect(() => {
    let active = true;

    const loadHistory = async () => {
      try {
        setHistoryLoading(true);
        const data = await agentService.listConversations();
        if (active) {
          setConversations(data);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : "Could not load conversations.");
        }
      } finally {
        if (active) {
          setHistoryLoading(false);
        }
      }
    };

    loadHistory();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, loading]);

  const updateAction = (action: AgentAction) => {
    setMessages((current) =>
      current.map((message) => ({
        ...message,
        actions: message.actions?.map((item) =>
          item.actionId === action.actionId ? action : item
        ),
      }))
    );
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) {
      return;
    }

    setInput("");
    setLoading(true);
    setError(null);
    setMessages((current) => [
      ...current,
      { id: makeId(), role: "user", content: trimmed },
    ]);

    try {
      const response = await agentService.chat({
        message: trimmed,
        conversationId,
        scope,
      });
      setConversationId(response.conversationId);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content: response.answer,
          actions: response.actions,
        },
      ]);
      await refreshConversations();
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "The assistant could not respond.");
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          content:
            sendError instanceof Error
              ? `I could not complete that request: ${sendError.message}`
              : "I could not complete that request.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(input);
  };

  const handleAction = async (action: AgentAction, mode: "confirm" | "reject") => {
    updateAction({ ...action, status: mode === "confirm" ? "approved" : "rejected" });
    try {
      const next =
        mode === "confirm"
          ? await agentService.confirmAction(action.actionId)
          : await agentService.rejectAction(action.actionId);
      updateAction(next);
    } catch (actionError) {
      updateAction({
        ...action,
        status: "failed",
        error: actionError instanceof Error ? actionError.message : "Action failed",
      });
    }
  };

  const openConversation = async (nextConversationId: string) => {
    setLoading(true);
    setError(null);
    try {
      const detail = await agentService.getConversation(nextConversationId);
      setConversationId(detail.conversationId);
      setMessages(buildMessageList(detail.conversationId, detail.messages, detail.actions));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not open conversation.");
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    setConversationId(undefined);
    setMessages([]);
    setInput("");
    setError(null);
  };

  const activeConversation = conversations.find(
    (conversation) => conversation.conversationId === conversationId
  );

  return (
    <div className="flex h-full min-h-0 bg-[#f7f7f4] text-gray-900 dark:bg-slate-950 dark:text-white">
      <aside className="hidden w-80 shrink-0 border-r border-gray-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/60 xl:flex xl:flex-col">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              AAKT AI
            </p>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Conversations
            </h2>
          </div>
          <button
            type="button"
            onClick={startNewChat}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700"
            aria-label="Start new chat"
          >
            <Plus size={17} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {historyLoading ? (
            <div className="flex items-center gap-2 rounded-xl border border-gray-100 p-3 text-sm text-gray-500 dark:border-slate-800">
              <Loader2 className="animate-spin" size={15} />
              Loading chats
            </div>
          ) : conversations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500 dark:border-slate-800 dark:text-gray-400">
              No conversations yet.
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => {
                const active = conversation.conversationId === conversationId;
                return (
                  <button
                    key={conversation.conversationId}
                    type="button"
                    onClick={() => openConversation(conversation.conversationId)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-200"
                        : "border-gray-100 bg-white text-gray-700 hover:border-gray-200 hover:bg-gray-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-gray-300 dark:hover:bg-slate-900"
                    }`}
                  >
                    <p className="line-clamp-1 text-sm font-semibold">
                      {conversation.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>{conversation.messageCount} messages</span>
                      <span>{formatDate(conversation.updatedAt)}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col">
        <header className="flex min-h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white/80 px-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <Bot size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-base font-bold text-gray-900 dark:text-white">
                  AAKT AI
                </h1>
                <span className="rounded border border-blue-200 px-1.5 py-0.5 text-[10px] font-bold uppercase text-blue-600 dark:border-blue-900 dark:text-blue-300">
                  Alpha
                </span>
              </div>
              <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                {activeConversation?.title ?? "Business operating assistant"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-500 dark:border-slate-800 dark:text-gray-400 sm:flex">
              <CheckCircle2 size={14} />
              Approval-first actions
            </div>
            <button
              type="button"
              onClick={startNewChat}
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:border-blue-200 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-200"
            >
              <Plus size={16} />
              New chat
            </button>
          </div>
        </header>

        <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="mx-auto flex min-h-full w-full max-w-4xl flex-col">
            {messages.length === 0 ? (
              <WelcomeState onPromptSelect={sendMessage} />
            ) : (
              <div className="flex flex-col gap-5 pb-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={message.role === "user" ? "max-w-[78%]" : "max-w-[86%]"}>
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
                          message.role === "user"
                            ? "bg-blue-600 text-white"
                            : "border border-gray-100 bg-white text-gray-800 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-100"
                        }`}
                      >
                        {message.content}
                      </div>
                      {message.actions?.length ? (
                        <div className="mt-3 grid gap-2">
                          {message.actions.map((action) => (
                            <AgentActionCard
                              action={action}
                              key={action.actionId}
                              onConfirm={() => handleAction(action, "confirm")}
                              onReject={() => handleAction(action, "reject")}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Loader2 className="animate-spin" size={16} />
                    Thinking through your workspace
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 sm:px-6">
          <form onSubmit={submitMessage} className="mx-auto w-full max-w-4xl">
            {error && (
              <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600 dark:border-red-950 dark:bg-red-950/30 dark:text-red-300">
                {error}
              </div>
            )}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage(input);
                  }
                }}
                rows={2}
                placeholder="Ask AAKT AI to read your workspace or propose the next process..."
                className="max-h-36 min-h-16 w-full resize-none bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
              />
              <div className="flex items-center justify-between border-t border-gray-200 px-2 pt-2 dark:border-slate-800">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <Sparkles size={14} />
                  Guided and emergent planning
                </div>
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                  Send
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

function WelcomeState({ onPromptSelect }: { onPromptSelect: (prompt: string) => void }) {
  return (
    <div className="flex flex-1 items-center justify-center py-10">
      <div className="w-full max-w-3xl space-y-7">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20">
            <Bot size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Meet AAKT AI
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Ask anything about businesses, workloads, tasks, folders, documents, BizInfra, and operating processes.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {STARTER_PROMPTS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.title}
                onClick={() => onPromptSelect(item.prompt)}
                className="group rounded-2xl border border-gray-200 bg-white p-4 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-gray-300">
                    <Icon size={17} />
                  </span>
                  <span>
                    <span className="block text-sm font-bold text-gray-900 dark:text-white">
                      {item.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-gray-500 dark:text-gray-400">
                      {item.description}
                    </span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400">
          <History size={14} />
          Conversations are saved to your workspace
          <span className="h-1 w-1 rounded-full bg-gray-300" />
          <Clock3 size={14} />
          Actions wait for approval
        </div>
      </div>
    </div>
  );
}
