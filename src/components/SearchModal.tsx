import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

import TaskModal from "./TaskModal";

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTask, setSelectedTask] = useState<{
    id: string;
    title: string;
    description?: string;
    status?: string;
    assignee?: string;
  } | null>(null);

  const categories = [
    "All",
    "People",
    "Blocks",
    "Processes",
    "Projects",
    "Operations",
    "Departments",
    "Business",
  ];

  // Dummy data for demonstration
  const dummyTasks = Array.from({ length: 9 }).map((_, i) => ({
    id: `task-${i + 1}`,
    title: `Project Task ${i + 1}`,
    description: `Detailed description for task ${i + 1}. This task involves reviewing the requirements, implementing the changes, and verifying the results.`,
    status: i % 3 === 0 ? "Completed" : i % 3 === 1 ? "In Progress" : "Pending",
    assignee: ["Alice", "Bob", "Charlie"][i % 3],
  }));

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-[101] pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto border border-gray-100 dark:border-slate-800"
            >
              {/* Search Header */}
              <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 text-gray-400 dark:text-gray-500">
                <SearchIcon />
                <input
                  type="text"
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-600 text-base sm:text-lg"
                  placeholder="Search skills, projects..."
                />
              </div>

              <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
                {/* Sidebar (Horizontal on mobile) */}
                <div className="w-full sm:w-56 border-b sm:border-b-0 sm:border-r border-gray-50 dark:border-slate-800 flex sm:flex-col p-2 sm:p-4 gap-1 overflow-x-auto sm:overflow-y-auto no-scrollbar">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`whitespace-nowrap sm:whitespace-normal text-left px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                        activeCategory === category
                          ? "bg-blue-600/10 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Main Content Grid */}
                <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50/30 dark:bg-slate-950/30">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {dummyTasks.map((_, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 h-32 shadow-sm transition-all hover:shadow-md cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <TaskModal
            isOpen={!!selectedTask}
            onClose={() => setSelectedTask(null)}
            task={selectedTask}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
