import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { taskService, type TaskItem } from "../api/task.service";

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    id: string;
    title: string;
    description?: string;
    status?: string;
    assignee?: string;
  } | null;
}

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const TaskModal = ({ isOpen, onClose, task }: TaskModalProps) => {
  const [subtasks, setSubtasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen && task?.id) {
      taskService.getTasks({ parentId: task.id })
        .then(setSubtasks)
        .catch(err => console.error("Failed to fetch subtasks", err));
    }
  }, [isOpen, task?.id]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] border border-gray-100 dark:border-slate-800"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between bg-gray-50/50 dark:bg-slate-800/50">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-['Space_Grotesk']">
              {task?.title || "Task Details"}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto font-['Inter']">
            <div className="flex gap-4 mb-6">
              <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
                {task?.status || "In Progress"}
              </div>
              <div className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium">
                {task?.assignee || "Unassigned"}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {task?.description ||
                "This is a placeholder description for the task. It would contain details about what needs to be done, success criteria, and any other relevant information."}
            </p>

            {/* Checklist Placeholder */}
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-4">
                Subtasks
              </h3>
              <div className="space-y-3">
                {subtasks.length > 0 ? subtasks.map((st) => (
                  <div key={st._id} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded border border-gray-300 dark:border-slate-700 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"></div>
                    <span className="text-gray-700 dark:text-gray-300 text-sm">
                      {st.title}
                    </span>
                  </div>
                )) : (
                  <span className="text-gray-500 text-sm">No subtasks yet</span>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
              Edit Task
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;
