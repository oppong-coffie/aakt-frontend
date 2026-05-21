import { Bot, Loader2, Send, Sparkles, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  agentService,
  type AgentAction,
  type AgentMessage,
} from "../../api/agent.service";
import AgentActionCard from "./AgentActionCard";
import AgentMessageContent from "./AgentMessageContent";

const STARTER_PROMPTS = [
  "Summarize my workspace",
  "What should I work on next?",
  "Create a launch planning workload",
  "Find gaps in my BizInfra resources",
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function AgentPanel() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | undefined>();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const location = useLocation();
  const listRef = useRef<HTMLDivElement>(null);

  const scope = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      businessId: params.get("businessId") ?? undefined,
      currentPath: `${location.pathname}${location.search}`,
    };
  }, [location.pathname, location.search]);

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
    const assistantMessageId = makeId();
    setMessages((current) => [
      ...current,
      { id: makeId(), role: "user", content: trimmed },
      { id: assistantMessageId, role: "assistant", content: "" },
    ]);

    try {
      const response = await agentService.chatStream(
        {
          message: trimmed,
          conversationId,
          scope,
        },
        {
          onDelta: (delta) => {
            setMessages((current) =>
              current.map((message) =>
                message.id === assistantMessageId
                  ? { ...message, content: `${message.content}${delta}` }
                  : message
              )
            );
            requestAnimationFrame(() => {
              listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
            });
          },
          onStart: setConversationId,
        }
      );
      setConversationId(response.conversationId);
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId
            ? { ...message, content: response.answer, actions: response.actions }
            : message
        )
      );
      requestAnimationFrame(() => {
        listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? `I could not complete that request: ${error.message}`
          : "I could not complete that request.";
      setMessages((current) =>
        current.map((message) =>
          message.id === assistantMessageId ? { ...message, content: errorMessage } : message
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: AgentAction, mode: "confirm" | "reject") => {
    updateAction({ ...action, status: mode === "confirm" ? "approved" : "rejected" });
    try {
      const next =
        mode === "confirm"
          ? await agentService.confirmAction(action.actionId)
          : await agentService.rejectAction(action.actionId);
      updateAction(next.action);
      if (next.assistantMessage) {
        setMessages((current) => [
          ...current,
          {
            id: makeId(),
            role: "assistant",
            content: next.assistantMessage ?? "",
          },
        ]);
        requestAnimationFrame(() => {
          listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
        });
      }
    } catch (error) {
      updateAction({
        ...action,
        status: "failed",
        error: error instanceof Error ? error.message : "Action failed",
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-700"
        aria-label="Open AAKT AI assistant"
      >
        <Sparkles size={22} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[120] flex items-end justify-end bg-black/10 p-4 backdrop-blur-[2px] sm:p-6">
          <section className="flex h-[min(760px,92vh)] w-full max-w-[440px] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950">
            <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Bot size={19} />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                    AAKT AI
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Workspace assistant
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-900 dark:hover:text-gray-100"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
              {messages.length === 0 && (
                <div className="space-y-5 pt-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Ask about your business operations.
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      I can read your workspace and propose safe actions for approval.
                    </p>
                  </div>
                  <div className="grid gap-2 text-left">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendMessage(prompt)}
                        className="rounded-2xl border border-gray-100 px-4 py-3 text-sm text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 dark:border-slate-800 dark:text-gray-200 dark:hover:bg-slate-900"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((message) => {
                const hasVisibleAssistantContent =
                  message.role !== "assistant" ||
                  Boolean(message.content.trim()) ||
                  Boolean(message.actions?.length);

                if (!hasVisibleAssistantContent) {
                  return null;
                }

                return (
                  <div
                    key={message.id}
                    className={message.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto"}
                  >
                    {message.role === "user" ? (
                      <div className="rounded-2xl bg-blue-600 px-4 py-3 text-sm leading-6 text-white">
                        {message.content}
                      </div>
                    ) : (
                      <div className="px-1 py-1 text-sm leading-6 text-gray-800 dark:text-gray-100">
                        <AgentMessageContent content={message.content} />
                      </div>
                    )}
                    {message.actions?.length ? (
                      <div className="mt-3 space-y-2">
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
                );
              })}

              {loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="animate-spin" size={16} />
                  Thinking through your workspace...
                </div>
              )}
            </div>

            <form
              className="border-t border-gray-100 p-4 dark:border-slate-800"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage(input);
              }}
            >
              <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-gray-50 p-2 dark:border-slate-800 dark:bg-slate-900">
                <textarea
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  rows={1}
                  placeholder="Ask AAKT AI..."
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-gray-100"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send size={17} />
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </>
  );
}
