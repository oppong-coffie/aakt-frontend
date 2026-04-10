import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../config/api";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

/**
 * Homepage - A fully interactive task management dashboard.
 *
 * Features:
 * - Dynamic Workload Columns: Create, rename, and delete columns.
 * - Task Management: Add tasks, edit names, toggle completion, and delete.
 * - Drag and Drop: Reorder columns and move tasks between columns.
 * - Archive System: Move tasks to a separate archive section to declutter.
 * - Responsive Design: Adapts to various screen sizes.
 */

// --- SVG Components (Icons) ---

/** Plus icon for adding new items */
const PlusIcon = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

/** Three-dot icon for action menus */
const MoreIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-400"
  >
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="19" cy="12" r="1"></circle>
    <circle cx="5" cy="12" r="1"></circle>
  </svg>
);

/** Simple checkmark for completed tasks */
const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

/** File box icon representing the Archive */
const ArchiveIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="21 8 21 21 3 21 3 8"></polyline>
    <rect x="1" y="3" width="22" height="5"></rect>
    <line x1="10" y1="12" x2="14" y2="12"></line>
  </svg>
);

/** Trash bin icon for permanent deletions */
const TrashIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

/** Six-dot indicator for drag handles */
const DragHandle = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-300"
  >
    <circle cx="9" cy="5" r="1"></circle>
    <circle cx="9" cy="12" r="1"></circle>
    <circle cx="9" cy="19" r="1"></circle>
    <circle cx="15" cy="5" r="1"></circle>
    <circle cx="15" cy="12" r="1"></circle>
    <circle cx="15" cy="19" r="1"></circle>
  </svg>
);

// --- Sub-Components ---

/**
 * TaskItem Component
 * Manages individual task display, completion state, editing, and its own context menu.
 */
const TaskItem = ({
  task,
  index,
  onToggle,
  onDelete,
  onEdit,
  onArchive,
  isArchived = false,
  onUnarchive,
}: {
  task: any;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  onEdit: (newText: string) => void;
  onArchive?: () => void;
  isArchived?: boolean;
  onUnarchive?: () => void;
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the popup menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Save edits and exit edit mode
  const handleEditSubmit = () => {
    onEdit(editText);
    setIsEditing(false);
    setIsMenuOpen(false);
  };

  /** Specific layout for tasks that are currently in the Archive section */
  if (isArchived) {
    return (
      <Draggable draggableId={task.id.toString()} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white dark:bg-slate-900/50 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between group hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm ${
              snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500/20" : ""
            }`}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className={`w-4 h-4 rounded-sm border flex items-center justify-center ${task.completed ? "bg-blue-400 border-blue-400" : "border-gray-300"}`}
              >
                {task.completed && <CheckIcon />}
              </div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                {task.text}
              </span>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={onUnarchive}
                className="p-1.5 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                title="Restore from archive"
              >
                <PlusIcon size={14} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                title="Delete permanently"
              >
                <TrashIcon size={14} />
              </button>
            </div>
          </div>
        )}
      </Draggable>
    );
  }

  /** Main Task layout for active workloads (Draggable) */
  return (
    <Draggable draggableId={task.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`relative group flex items-center justify-between gap-3 p-1 rounded-lg transition-colors ${
            snapshot.isDragging
              ? "bg-blue-50 dark:bg-blue-900/30 shadow-md ring-1 ring-blue-100 dark:ring-blue-900"
              : "hover:bg-gray-50 dark:hover:bg-slate-800"
          }`}
        >
          {/* Left: Task Content (Checkbox + Label/Input) */}
          <div className="flex items-center gap-2 flex-1 overflow-hidden">
            <div className="p-1 opacity-40 group-hover:opacity-100 transition-opacity">
              <DragHandle />
            </div>

            <div
              onClick={onToggle}
              className={`shrink-0 w-5 h-5 rounded-md border-2 transition-all flex items-center justify-center cursor-pointer ${
                task.completed
                  ? "bg-blue-600 border-blue-600"
                  : "border-gray-200 dark:border-slate-700 hover:border-blue-400"
              }`}
            >
              {task.completed && <CheckIcon />}
            </div>

            {isEditing ? (
              <input
                autoFocus
                className="flex-1 bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-900 rounded px-1 py-0.5 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleEditSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleEditSubmit()}
              />
            ) : (
              <span
                className={`text-sm font-medium truncate ${task.completed ? "text-gray-400 dark:text-gray-500 line-through font-normal" : "text-gray-700 dark:text-gray-200"}`}
              >
                {task.text}
              </span>
            )}
          </div>

          {/* Right: Action Menu (More icon + Dropdown) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-slate-700 rounded-md border border-transparent hover:border-gray-100 dark:hover:border-slate-600"
            >
              <MoreIcon />
            </button>

            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-1 z-20"
                >
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onToggle();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    {task.completed ? "Undo Task" : "Complete"}
                  </button>
                  <button
                    onClick={() => {
                      onArchive?.();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => {
                      onDelete();
                      setIsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/40 transition-colors"
                  >
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </Draggable>
  );
};

/**
 * Main Homepage Component
 * Controls the top-level state for workloads, columns, and archiving.
 */
const Homepage = () => {
  // --- STATE ---
  const navigate = useNavigate();
  const [completionData, setCompletionData] = useState<any>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);

  /** Active workloads split into columns */
  const [workloads, setWorkloads] = useState<any[]>([]);

  /** Tasks moved out of active workloads */
  const [archivedTasks, setArchivedTasks] = useState<any[]>([]);

  /** Workloads moved out of active view */
  const [archivedWorkloads, setArchivedWorkloads] = useState<any[]>([]);

  /** Loading state */
  const [isLoading, setIsLoading] = useState(true);

  /** State for inline task addition */
  const [addingToWorkloadId, setAddingToWorkloadId] = useState<string | null>(
    null,
  );
  const [newTaskText, setNewTaskText] = useState("");

  // Helper to get auth token from localStorage
  const getToken = () => localStorage.getItem("token");

  // Fetch workloads from API on mount
  useEffect(() => {
    const fetchWorkloads = async () => {
      try {
        setIsLoading(true);
        const token = getToken();

        // Fetch and log completed field
        axios.get(`${API_URL}/home/completed`, {
          headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
          const compData = res.data?.completed ?? res.data;
          console.log("Completed field:", compData);
          setCompletionData(compData);
          
          let percentage = 0;
          if (compData) {
            if (compData.step) percentage += 20;
            if (compData.stage) percentage += 20;
            if (compData.confident) percentage += 20;
            if (compData.feeling) percentage += 20;
            if (compData.skills) percentage += 20;
          }
          setCompletionPercentage(percentage);
        }).catch(err => {
          console.error("Failed to fetch completed field:", err);
        });

        const res = await axios.get(
          `${API_URL}/workloads/getworkloadsbyuserid`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const all: any[] = Array.isArray(res.data)
          ? res.data
          : res.data?.workloads ?? [];
        const mapWorkload = (w: any) => ({
          id: String(w._id ?? w.id ?? w.workloadname),
          title: w.workloadname ?? w.title ?? "Untitled",
          tasks: (w.tasks ?? []).map((t: any, idx: number) => ({
            id: String(t._id ?? t.id ?? `${w._id}-task-${idx}`),
            text: t.taskname ?? t.name ?? t.text ?? "",
            completed: t.status === 'Completed',
          })),
        });
        setWorkloads(all.filter((w: any) => w.status !== 'Archive').map(mapWorkload));
        setArchivedWorkloads(all.filter((w: any) => w.status === 'Archive').map(mapWorkload));
      } catch (err) {
        console.error("Failed to fetch workloads:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkloads();
  }, []);

  // --- DRAG AND DROP HANDLER ---

  /**
   * Orchestrates the final result of a drag operation.
   * Handles reordering columns, reordering tasks within a column, or moving tasks between columns.
   */
  const onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    if (!destination) return; // Dropped outside
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return; // Same spot

    // Case 1: Reordering/Archiving Columns
    if (type === "COLUMN") {
      if (destination.droppableId === "archive-zone") {
        // Archive a column
        const newWorkloads = Array.from(workloads);
        const [archived] = newWorkloads.splice(source.index, 1);
        setWorkloads(newWorkloads);
        setArchivedWorkloads([...archivedWorkloads, archived]);
        // Call archive API
        axios
          .patch(
            `${API_URL}/workloads/${archived.id}/archive`,
            {},
            { headers: { Authorization: `Bearer ${getToken()}` } }
          )
          .catch(console.error);
        return;
      }

      if (
        source.droppableId === "archive-zone" &&
        destination.droppableId === "all-columns"
      ) {
        // Restore a column from archive
        const newArchived = Array.from(archivedWorkloads);
        const [restored] = newArchived.splice(source.index, 1);
        const newWorkloads = Array.from(workloads);
        newWorkloads.splice(destination.index, 0, restored);
        setArchivedWorkloads(newArchived);
        setWorkloads(newWorkloads);
        // Call unarchive API
        axios
          .patch(
            `${API_URL}/workloads/${restored.id}/inprogress`,
            {},
            { headers: { Authorization: `Bearer ${getToken()}` } }
          )
          .catch(console.error);
        return;
      }

      if (source.droppableId === destination.droppableId) {
        // Reorder columns in active area or archive area
        if (source.droppableId === "all-columns") {
          const newWorkloads = Array.from(workloads);
          const [removed] = newWorkloads.splice(source.index, 1);
          newWorkloads.splice(destination.index, 0, removed);
          setWorkloads(newWorkloads);
        } else {
          const newArchived = Array.from(archivedWorkloads);
          const [removed] = newArchived.splice(source.index, 1);
          newArchived.splice(destination.index, 0, removed);
          setArchivedWorkloads(newArchived);
        }
        return;
      }
      return;
    }

    // Case 2: Reordering/Moving Tasks
    if (
      source.droppableId === "archive" ||
      destination.droppableId === "archive"
    ) {
      if (source.droppableId === destination.droppableId) {
        // Reorder within archive
        const newArchived = Array.from(archivedTasks);
        const [removed] = newArchived.splice(source.index, 1);
        newArchived.splice(destination.index, 0, removed);
        setArchivedTasks(newArchived);
        return;
      }

      if (source.droppableId === "archive") {
        // Drag from archive to workload
        const newArchived = Array.from(archivedTasks);
        const [task] = newArchived.splice(source.index, 1);

        const destCol = workloads.find((w) => w.id === destination.droppableId);
        if (!destCol) return;

        const destTasks = Array.from(destCol.tasks);
        destTasks.splice(destination.index, 0, {
          id: task.id,
          text: task.text,
          completed: task.completed,
        });

        setArchivedTasks(newArchived);
        setWorkloads(
          workloads.map((w) =>
            w.id === destCol.id ? { ...w, tasks: destTasks } : w,
          ),
        );
        return;
      }

      if (destination.droppableId === "archive") {
        // Drag from workload to archive
        const sourceCol = workloads.find((w) => w.id === source.droppableId);
        if (!sourceCol) return;

        const sourceTasks = Array.from(sourceCol.tasks);
        const [task] = sourceTasks.splice(source.index, 1);

        const newArchived = Array.from(archivedTasks);
        newArchived.splice(destination.index, 0, {
          ...(task as any),
          originalWorkloadId: sourceCol.id,
        });

        setWorkloads(
          workloads.map((w) =>
            w.id === sourceCol.id ? { ...w, tasks: sourceTasks } : w,
          ),
        );
        setArchivedTasks(newArchived);
        return;
      }
    }

    const sourceCol = workloads.find((w) => w.id === source.droppableId);
    const destCol = workloads.find((w) => w.id === destination.droppableId);

    if (!sourceCol || !destCol) return;

    if (sourceCol === destCol) {
      // Reorder within the same list
      const newTasks = Array.from(sourceCol.tasks);
      const [removed] = newTasks.splice(source.index, 1);
      newTasks.splice(destination.index, 0, removed);

      setWorkloads(
        workloads.map((w) =>
          w.id === sourceCol.id ? { ...w, tasks: newTasks } : w,
        ),
      );
    } else {
      // Move between two different lists
      const sourceTasks = Array.from(sourceCol.tasks);
      const [removed] = sourceTasks.splice(source.index, 1);

      const destTasks = Array.from(destCol.tasks);
      destTasks.splice(destination.index, 0, removed);

      setWorkloads(
        workloads.map((w) => {
          if (w.id === sourceCol.id) return { ...w, tasks: sourceTasks };
          if (w.id === destCol.id) return { ...w, tasks: destTasks };
          return w;
        }),
      );
    }
  };

  // --- ACTIONS: WORKLOADS ---

  /** Create a new empty workload column */
  const addWorkload = async () => {
    try {
      const token = getToken();
      const res = await axios.post(
        `${API_URL}/workloads`,
        { workloadname: "New Workload" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const created = res.data?.workload ?? res.data;
      const newId = String(created?._id ?? created?.id ?? Date.now());
      setWorkloads([...workloads, { id: newId, title: "New Workload", tasks: [] }]);
    } catch (err) {
      console.error("Failed to create workload:", err);
    }
  };

  /** Remove an entire workload column */
  const deleteWorkload = async (workloadId: string) => {
    if (confirm("Are you sure you want to delete this workload?")) {
      try {
        const token = getToken();
        await axios.delete(`${API_URL}/workloads/${workloadId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkloads(workloads.filter((w) => w.id !== workloadId));
      } catch (err) {
        console.error("Failed to delete workload:", err);
      }
    }
  };

  // --- ACTIONS: TASKS ---

  /** Add a new task to a specific workload column */
  const addTask = async (workloadId: string, taskText: string) => {
    if (!taskText.trim()) return;
    try {
      const token = getToken();
      const res = await axios.post(
        `${API_URL}/workloads/${workloadId}/tasks`,
        { taskname: taskText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const created = res.data?.task ?? res.data;
      const newTask = {
        id: String(created?._id ?? created?.id ?? Date.now()),
        text: taskText.trim(),
        completed: (created?.status ?? 'Todo') === 'Completed',
      };
      setWorkloads(
        workloads.map((w) =>
          w.id === workloadId ? { ...w, tasks: [...w.tasks, newTask] } : w
        )
      );
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  /** Toggle the completion status (checked/unchecked) */
  const toggleTask = async (workloadId: string, taskId: string) => {
    const workload = workloads.find((w) => w.id === workloadId);
    if (!workload) return;
    const task = workload.tasks.find((t: any) => t.id === taskId);
    if (!task) return;

    const newCompleted = !task.completed;

    try {
      const token = getToken();
      const endpoint = newCompleted ? "complete" : "todo";
      await axios.patch(
        `${API_URL}/workloads/${workloadId}/tasks/${taskId}/${endpoint}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error(`Failed to update task status to ${newCompleted ? "complete" : "todo"}:`, err);
    }

    setWorkloads(
      workloads.map((w) => {
        if (w.id === workloadId) {
          return {
            ...w,
            tasks: w.tasks.map((t: any) =>
              t.id === taskId ? { ...t, completed: newCompleted } : t,
            ),
          };
        }
        return w;
      }),
    );
  };

  /** Remove a task from its workload column */
  const deleteTask = async (workloadId: string, taskId: string) => {
    try {
      const token = getToken();
      await axios.delete(
        `${API_URL}/workloads/${workloadId}/tasks/${taskId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
    setWorkloads(
      workloads.map((w) =>
        w.id === workloadId
          ? { ...w, tasks: w.tasks.filter((t: any) => t.id !== taskId) }
          : w
      )
    );
  };

  /** Rename an existing task */
  const editTask = async (workloadId: string, taskId: string, newText: string) => {
    try {
      const token = getToken();
      await axios.patch(
        `${API_URL}/workloads/${workloadId}/tasks/${taskId}/name`,
        { taskname: newText.trim() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Failed to rename task:", err);
    }
    setWorkloads(
      workloads.map((w) => {
        if (w.id === workloadId) {
          return {
            ...w,
            tasks: w.tasks.map((t: any) =>
              t.id === taskId ? { ...t, text: newText } : t,
            ),
          };
        }
        return w;
      }),
    );
  };

  // --- ACTIONS: ARCHIVE ---

  /** Move a task to the Archive section and track its original column for restoration */
  const archiveTask = (workloadId: string, taskId: string) => {
    const workload = workloads.find((w) => w.id === workloadId);
    if (!workload) return;
    const taskToArchive = workload.tasks.find((t: any) => t.id === taskId);
    if (!taskToArchive) return;

    setArchivedTasks([
      ...archivedTasks,
      { ...taskToArchive, originalWorkloadId: workloadId },
    ]);
    deleteTask(workloadId, taskId);
  };

  /** Restore a task from the Archive back to its workload */
  const unarchiveTask = (archiveId: string) => {
    const task = archivedTasks.find((t) => t.id === archiveId);
    if (!task) return;

    setWorkloads(
      workloads.map((w) => {
        // Restore to original col if it still exists, else "Today", else first col
        if (
          w.id === task.originalWorkloadId ||
          (w.id === "today" &&
            !workloads.some((wl) => wl.id === task.originalWorkloadId))
        ) {
          return {
            ...w,
            tasks: [
              ...w.tasks,
              { id: task.id, text: task.text, completed: task.completed },
            ],
          };
        }
        return w;
      }),
    );
    setArchivedTasks(archivedTasks.filter((t) => t.id !== archiveId));
  };

  /** Delete an archived task permanently */
  const deleteArchivedTask = (archiveId: string) => {
    setArchivedTasks(archivedTasks.filter((t) => t.id !== archiveId));
  };

  // --- RENDER ---

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-400 text-sm font-medium">
        Loading workloads...
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="relative min-h-[85vh] mt-9 flex flex-col gap-12 pb-2 font-inter-local">
        {/* Main Workspace: Workloads Grid */}
        <Droppable
          droppableId="all-columns"
          direction="horizontal"
          type="COLUMN"
        >
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-6 items-start"
            >
              {workloads.map((workload, index) => (
                <Draggable
                  key={workload.id}
                  draggableId={workload.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white dark:bg-slate-900 rounded-xl p-2 shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col gap-4 min-h-[220px] w-full max-w-[280px] transition-shadow ${
                        snapshot.isDragging
                          ? "shadow-2xl ring-2 ring-blue-500/20 rotate-1"
                          : ""
                      }`}
                    >
                      {/* Column Header */}
                      <div className="flex justify-between items-center px-1">
                        <input
                          className="font-bold text-gray-800 dark:text-gray-100 text-lg bg-transparent border-none outline-none w-32 focus:bg-gray-50 dark:focus:bg-slate-800 rounded px-1 transition-colors cursor-text"
                          value={workload.title}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            setWorkloads(
                              workloads.map((w) =>
                                w.id === workload.id
                                  ? { ...w, title: e.target.value }
                                  : w,
                              ),
                            );
                          }}
                          onBlur={(e) => {
                            const newName = e.target.value.trim();
                            if (!newName) return;
                            axios
                              .patch(
                                `${API_URL}/workloads/${workload.id}/name`,
                                { workloadname: newName },
                                { headers: { Authorization: `Bearer ${getToken()}` } }
                              )
                              .catch(console.error);
                          }}
                        />
                        <button
                          onClick={() => deleteWorkload(workload.id)}
                          className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                          title="Delete workload"
                        >
                          <TrashIcon size={14} />
                        </button>
                      </div>

                      {/* Tasks List (Droppable area for tasks) */}
                      <Droppable droppableId={workload.id} type="TASK">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex-1 flex flex-col gap-1 rounded-xl transition-colors ${
                              snapshot.isDraggingOver
                                ? "bg-blue-50/50 dark:bg-blue-900/10"
                                : ""
                            }`}
                          >
                            {workload.tasks.length > 0
                              ? workload.tasks.map((task: any, idx: number) => (
                                  <TaskItem
                                    key={task.id}
                                    index={idx}
                                    task={task}
                                    onToggle={() =>
                                      toggleTask(workload.id, task.id)
                                    }
                                    onDelete={() =>
                                      deleteTask(workload.id, task.id)
                                    }
                                    onEdit={(text) =>
                                      editTask(workload.id, task.id, text)
                                    }
                                    onArchive={() =>
                                      archiveTask(workload.id, task.id)
                                    }
                                  />
                                ))
                              : !snapshot.isDraggingOver &&
                                addingToWorkloadId !== workload.id && (
                                  <span className="text-gray-400 text-sm px-1 italic py-2">
                                    No tasks yet
                                  </span>
                                )}

                            {/* Inline Add Task Input */}
                            {addingToWorkloadId === workload.id && (
                              <div className="px-1 py-1">
                                <input
                                  autoFocus
                                  className="w-full bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-900 rounded px-2 py-1.5 text-sm font-medium text-gray-900 dark:text-gray-100 outline-none shadow-sm"
                                  placeholder="Type task name..."
                                  value={newTaskText}
                                  onChange={(e) =>
                                    setNewTaskText(e.target.value)
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      addTask(workload.id, newTaskText);
                                      setNewTaskText("");
                                      setAddingToWorkloadId(null);
                                    } else if (e.key === "Escape") {
                                      setAddingToWorkloadId(null);
                                      setNewTaskText("");
                                    }
                                  }}
                                  onBlur={() => {
                                    if (newTaskText.trim()) {
                                      addTask(workload.id, newTaskText);
                                    }
                                    setNewTaskText("");
                                    setAddingToWorkloadId(null);
                                  }}
                                />
                              </div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>

                      {/* Add Task Button */}
                      <button
                        onClick={() => {
                          setAddingToWorkloadId(workload.id);
                        }}
                        className="flex items-center gap-2 text-gray-800 hover:text-blue-600 transition-colors text-sm font-semibold px-1 mt-2 group"
                      >
                        <PlusIcon
                          size={14}
                          className="text-gray-400 group-hover:text-blue-600"
                        />
                        <span>Add new task</span>
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}

              {/* "Add New Workload" Button - Permanently at the end of the list */}
              <motion.button
                layout
                onClick={addWorkload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white px-8 py-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 text-gray-800 font-bold text-sm hover:shadow-md transition-all h-[56px] shrink-0 self-start mt-2"
              >
                <PlusIcon className="text-gray-400" />
                <span>Add new workload</span>
              </motion.button>
            </div>
          )}
        </Droppable>

        {/* --- ARCHIVE SECTION --- */}
        <div className="mt-8 flex flex-col gap-8">
          {/* Header with horizontal dividers */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200"></div>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest px-4">
              <ArchiveIcon size={14} />
              <span>Archive ({archivedTasks.length})</span>
            </div>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          {/* Archived Workloads Zone */}
          <Droppable
            droppableId="archive-zone"
            direction="horizontal"
            type="COLUMN"
          >
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`min-h-[120px] border-2 border-dashed transition-all p-4 flex flex-wrap gap-4 items-center justify-center ${
                  snapshot.isDraggingOver
                    ? "bg-blue-50/50 border-blue-300 shadow-inner"
                    : "bg-transparent border-gray-200"
                }`}
              >
                {archivedWorkloads.length > 0
                  ? archivedWorkloads.map((workload, idx) => (
                      <Draggable
                        key={workload.id}
                        draggableId={workload.id}
                        index={idx}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2 min-w-[200px] max-w-[240px] transition-all ${
                              snapshot.isDragging
                                ? "shadow-2xl ring-2 ring-blue-500/20 rotate-1"
                                : "hover:shadow-md"
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800 text-sm truncate">
                                {workload.title}
                              </span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => {
                                    const newArchived = archivedWorkloads.filter(
                                      (w) => w.id !== workload.id,
                                    );
                                    setArchivedWorkloads(newArchived);
                                    setWorkloads([...workloads, workload]);
                                    axios
                                      .put(
                                        `${API_URL}/workloads/${workload.id}/inprogress`,
                                        {},
                                        { headers: { Authorization: `Bearer ${getToken()}` } }
                                      )
                                      .catch(console.error);
                                  }}
                                  className="p-1 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                                  title="Restore"
                                >
                                  <PlusIcon size={12} />
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm("Delete this workload permanently?")) {
                                      try {
                                        await axios.delete(
                                          `${API_URL}/workloads/${workload.id}`,
                                          { headers: { Authorization: `Bearer ${getToken()}` } }
                                        );
                                      } catch (err) {
                                        console.error("Failed to delete archived workload:", err);
                                      }
                                      setArchivedWorkloads(
                                        archivedWorkloads.filter((w) => w.id !== workload.id)
                                      );
                                    }
                                  }}
                                  className="p-1 hover:bg-red-50 text-red-400 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <TrashIcon size={12} />
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">
                                {workload.tasks.length} Tasks
                              </span>
                              <div className="flex -space-x-1">
                                {workload.tasks.slice(0, 3).map((_: any, i: number) => (
                                  <div
                                    key={i}
                                    className="w-2.5 h-2.5 rounded-full bg-blue-100 border border-white"
                                  ></div>
                                ))}
                                {workload.tasks.length > 3 && (
                                  <span className="text-[10px] text-gray-300 ml-1">
                                    +
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  : !snapshot.isDraggingOver && (
                      <div className="flex flex-col items-center justify-center text-gray-300 gap-1">
                        <ArchiveIcon size={24} />
                        <p className="text-xs font-bold uppercase tracking-tighter">
                          Drag workload here to archive
                        </p>
                      </div>
                    )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Archived Tasks Grid (Keeping this for individual tasks if needed) */}
          <div className="flex items-center gap-4 mt-4">
            <div className="h-px flex-1 bg-gray-200"></div>
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Tasks ({archivedTasks.length})
            </span>
            <div className="h-px flex-1 bg-gray-200"></div>
          </div>

          <Droppable droppableId="archive" direction="horizontal" type="TASK">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-2 min-h-[60px] rounded-xl transition-colors ${
                  snapshot.isDraggingOver ? "bg-blue-50/50" : ""
                }`}
              >
                {archivedTasks.length > 0
                  ? archivedTasks.map((task, idx) => (
                      <TaskItem
                        key={task.id}
                        index={idx}
                        task={task}
                        onToggle={() => {}} // Non-toggleable in archive view
                        onDelete={() => deleteArchivedTask(task.id)}
                        onEdit={() => {}}
                        isArchived={true}
                        onUnarchive={() => unarchiveTask(task.id)}
                      />
                    ))
                  : !snapshot.isDraggingOver && (
                      <div className="col-span-full py-4 flex flex-col items-center justify-center text-gray-200">
                        <p className="text-[10px] font-black uppercase italic">
                          No single tasks archived
                        </p>
                      </div>
                    )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>

        {/* Footer Banner: Finish Account Setup */}
        {completionPercentage < 100 && (
          <div className="mt-12 w-full">
            <motion.div className="bg-white rounded-[2.5rem] p-8 sm:p-10 shadow-sm border border-gray-100 flex flex-col justify-between items-center gap-6">
              <div className="w-full flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Finish setting up your account
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Things that you have missed should be filled.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (!completionData) return;
                    if (!completionData.step) navigate("/step");
                    else if (!completionData.stage) navigate("/stage");
                    else if (!completionData.confident) navigate("/confident");
                    else if (!completionData.feeling) navigate("/feeling");
                    else if (!completionData.skills) navigate("/skills");
                  }}
                  className="px-10 py-3 border border-blue-600 text-blue-600 rounded-full font-bold text-sm hover:bg-blue-50 transition-colors whitespace-nowrap cursor-pointer"
                >
                  Finish It
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full mt-4">
                <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
                  <span>Profile Completion</span>
                  <span className="text-blue-600">{completionPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full transition-all duration-1000 ease-out shadow-sm"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </DragDropContext>
  );
};

export default Homepage;
