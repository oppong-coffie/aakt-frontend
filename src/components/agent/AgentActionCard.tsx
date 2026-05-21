import { Check } from "lucide-react";
import type { AgentAction } from "../../api/agent.service";

const HIDDEN_INPUT_FIELDS = new Set([
  "businessId",
  "folderId",
  "phaseId",
  "projectId",
  "taskId",
  "workloadId",
]);

function formatValue(value: unknown) {
  if (Array.isArray(value)) {
    return `${value.length} linked item${value.length === 1 ? "" : "s"}`;
  }
  if (value && typeof value === "object") {
    return "Configured";
  }
  return String(value);
}

function formatInput(input: Record<string, unknown>) {
  const entries = Object.entries(input)
    .filter(([key]) => !HIDDEN_INPUT_FIELDS.has(key))
    .slice(0, 4);

  if (entries.length === 0) {
    return "Ready for approval";
  }

  return entries
    .map(([key, value]) => `${key}: ${formatValue(value)}`)
    .join(" · ");
}

export default function AgentActionCard({
  action,
  onConfirm,
  onReject,
}: {
  action: AgentAction;
  onConfirm: () => void;
  onReject: () => void;
}) {
  const isPending = action.status === "pending";
  const isDone = action.status === "executed";
  const isRejected = action.status === "rejected";

  return (
    <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {action.title}
          </p>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {action.description}
          </p>
        </div>
        <span className="rounded bg-blue-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-blue-600 dark:bg-blue-950">
          {action.status}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-gray-400">
        {formatInput(action.input)}
      </p>
      {action.error && <p className="mt-2 text-xs text-red-500">{action.error}</p>}
      {isPending && (
        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            <Check size={14} />
            Confirm
          </button>
          <button
            type="button"
            onClick={onReject}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-900"
          >
            Reject
          </button>
        </div>
      )}
      {isDone && (
        <p className="mt-3 text-xs font-semibold text-green-600">Executed successfully.</p>
      )}
      {isRejected && (
        <p className="mt-3 text-xs font-semibold text-gray-500">Rejected.</p>
      )}
    </div>
  );
}
