import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "../../components/Breadcrumbs";
import EditItemModal from "../../components/EditItemModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { portfolioService, type Project as ProjectType, type Agent } from "../../api/portfolio.service";

/**
 * Project Page (Portfolio) - Displays the phases of a selected project.
 * Allows users to navigate into specific phases and edit Reality/Goal.
 * Also manages team members and agents.
 */

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PlusIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const LeftArrow = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);

const LongArrow = () => (
  <div className="mx-6 sm:mx-8 flex items-center">
    <svg width="70" height="18" viewBox="0 0 80 18" fill="none">
      <path
        d="M0 9H72"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 3L80 9L72 15"
        stroke="#9CA3AF"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const EditIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const CreationModeModal = ({
  isOpen,
  onClose,
  onSelect,
  categoryLabel,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (mode: "blank" | "template") => void;
  categoryLabel: string;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white w-full max-w-md rounded-4xl shadow-2xl relative z-100 p-8"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Inter']">
                New {categoryLabel}
              </h3>
              <p className="text-gray-500 text-sm">
                How would you like to start?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onSelect("blank")}
                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-black hover:text-white transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-gray-800 transition-colors">
                  <PlusIcon />
                </div>
                <span className="font-bold">Blank</span>
              </button>

              <button
                onClick={() => onSelect("template")}
                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:bg-black hover:text-white transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-gray-800 transition-colors">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                    <path d="M8 7h6" />
                    <path d="M8 11h8" />
                  </svg>
                </div>
                <span className="font-bold">Template</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 text-gray-400 font-medium hover:text-gray-600 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CreateRealityModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}) => {
  const [team] = useState<Array<{ agentId: string; role: string }>>([]);
  const [budget, setBudget] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [flexibility, setFlexibility] = useState("medium");
  const [constraints, setConstraints] = useState<string[]>([]);
  const [constraintInput, setConstraintInput] = useState("");

  const handleAddConstraint = () => {
    if (constraintInput.trim()) {
      setConstraints([...constraints, constraintInput]);
      setConstraintInput("");
    }
  };

  const handleRemoveConstraint = (index: number) => {
    setConstraints(constraints.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({
      team,
      budget: budget ? parseInt(budget) : undefined,
      timeline: {
        start: startDate || undefined,
        finish: endDate || undefined,
        flexibility,
      },
      constraints,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative z-111 w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col pt-6"
          >
            <div className="px-8 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Reality
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-4 space-y-5 overflow-y-auto max-h-[70vh]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Budget
                </label>
                <input
                  type="number"
                  placeholder="Budget amount"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Timeline
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    placeholder="Start"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <input
                    type="date"
                    placeholder="Finish"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Flexibility
                </label>
                <select
                  value={flexibility}
                  onChange={(e) => setFlexibility(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="space-y-2 pb-4">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Constraints
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add constraint"
                    value={constraintInput}
                    onChange={(e) => setConstraintInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    onClick={handleAddConstraint}
                    className="px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {constraints.map((constraint, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {constraint}
                      <button
                        onClick={() => handleRemoveConstraint(idx)}
                        className="ml-1 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
              >
                Save Reality
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CreateGoalModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}) => {
  const [objective, setObjective] = useState("");
  const [deliverables, setDeliverables] = useState<string[]>([]);
  const [deliverableInput, setDeliverableInput] = useState("");
  const [metrics, setMetrics] = useState<string[]>([]);
  const [metricInput, setMetricInput] = useState("");
  const [mustHave] = useState<string[]>([]);
  const [niceToHave] = useState<string[]>([]);
  const [wontHave] = useState<string[]>([]);

  const handleAddDeliverable = () => {
    if (deliverableInput.trim()) {
      setDeliverables([...deliverables, deliverableInput]);
      setDeliverableInput("");
    }
  };

  const handleAddMetric = () => {
    if (metricInput.trim()) {
      setMetrics([...metrics, metricInput]);
      setMetricInput("");
    }
  };

  const handleSave = () => {
    onSave({
      objective,
      deliverables,
      successMetrics: metrics,
      scope: {
        mustHave,
        niceToHave,
        wontHave,
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative z-111 w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col pt-6"
          >
            <div className="px-8 pb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Create Goal
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="px-8 py-4 space-y-6 overflow-y-auto max-h-[70vh]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  What is the objective?
                </label>
                <textarea
                  placeholder="Describe your objective..."
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full h-24 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Deliverables
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add deliverable..."
                    value={deliverableInput}
                    onChange={(e) => setDeliverableInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    onClick={handleAddDeliverable}
                    className="px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {deliverables.map((del, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                    >
                      {del}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Success metrics
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add metric..."
                    value={metricInput}
                    onChange={(e) => setMetricInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <button
                    onClick={handleAddMetric}
                    className="px-4 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {metrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
                    >
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
              >
                Save Goal
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-4 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const RealityGoalModal = ({
  isOpen,
  onClose,
  onRealityClick,
  onGoalClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  onRealityClick: () => void;
  onGoalClick: () => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 w-full max-w-4xl rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
            >
              ✕
            </button>

            {/* Content */}
            <div className="px-12 py-20 flex items-center justify-center">
              <div className="flex items-center gap-16 sm:gap-20">
                <h2
                  onClick={onRealityClick}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Reality
                </h2>

                {/* Arrow */}
                <svg
                  width="120"
                  height="24"
                  viewBox="0 0 120 24"
                  fill="none"
                  className="opacity-60"
                >
                  <path
                    d="M0 12H110"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M106 4L118 12L106 20"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <h2
                  onClick={onGoalClick}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white tracking-tight cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Goal
                </h2>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
const AddPhaseModal = ({
  isOpen,
  onClose,
  projectId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | undefined;
  onSuccess: (phase: any) => void;
}) => {
  const [phaseName, setPhaseName] = useState("");
  const [phaseDescription, setPhaseDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/portfolio/phases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          projectId: projectId || "default-project-id",
          phaseName,
          phaseDescription
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create phase");
      }

      const resData = await response.json();
      onSuccess(resData.data || resData);
      setPhaseName("");
      setPhaseDescription("");
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-4xl shadow-2xl relative z-[110] p-8 font-['Space_Grotesk'] border border-gray-100 dark:border-slate-800"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                New Phase
              </h3>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Phase Name
                </label>
                <input
                  type="text"
                  required
                  value={phaseName}
                  onChange={(e) => setPhaseName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter phase name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Phase Description
                </label>
                <textarea
                  required
                  value={phaseDescription}
                  onChange={(e) => setPhaseDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] resize-none h-32 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter phase description"
                />
              </div>

              <div className="flex items-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Creating..." : "Create Phase"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};



const Project = () => {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();
  const [activeTab, setActiveTab] = useState("Home");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isRealityGoalModalOpen, setIsRealityGoalModalOpen] = useState(false);
  const [isCreateRealityModalOpen, setIsCreateRealityModalOpen] = useState(false);
  const [isCreateGoalModalOpen, setIsCreateGoalModalOpen] = useState(false);
  const [isAddPhaseModalOpen, setIsAddPhaseModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const [project, setProject] = useState<ProjectType | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [newAgent, setNewAgent] = useState({ name: "", email: "", title: "", timezone: "UTC", kind: "human" as const });

  const [cards, setCards] = useState<Array<{ id: string; label: string; to: string }>>([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    image?: string | null;
  } | null>(null);

  // Load project data on mount
  useEffect(() => {
    const loadProject = async () => {
      try {
        const portfolioId = localStorage.getItem("portfolioId") || "default";
        if (projectId) {
          try {
            const data = await portfolioService.getProject(portfolioId, projectId);
            setProject(data);
          } catch (e) {
            console.error("Failed to load project metadata:", e);
          }

          try {
            const phasesRes = await fetch(`http://localhost:3000/portfolio/phases/${projectId}`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`
              }
            });
            if (phasesRes.ok) {
              const phasesJson = await phasesRes.json();
              const phasesData = Array.isArray(phasesJson.data) ? phasesJson.data : (Array.isArray(phasesJson) ? phasesJson : []);
              setCards(
                phasesData.map((phase: any) => {
                  const searchParams = new URLSearchParams(window.location.search);
                  const businessId = searchParams.get("businessId") || "";
                  return {
                    id: phase._id || Date.now().toString(),
                    label: phase.phaseName || "Unnamed Phase",
                    to: `/dashboard/portfolio/saas/project/${projectId}/phase/${phase._id}?businessId=${businessId}`,
                  };
                })
              );
            }
          } catch (e) {
            console.error("Failed to load phases:", e);
          }
        }
        // Load agents
        try {
          const agentsList = await portfolioService.getAgents(portfolioId);
          setAgents(agentsList);
        } catch (agentErr) {
          console.warn("Failed to load agents:", agentErr);
        }
      } catch (err: any) {
        console.error("Failed to load project:", err);
      }
    };
    loadProject();
  }, [projectId]);

  const handleSaveEdit = (id: string, newName: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, label: newName } : c)),
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this phase?")) {
      const newCards = cards.filter((c) => c.id !== id);
      setCards(newCards);
    }
  };

  const handleSaveReality = async (realityData: any) => {
    try {
      const portfolioId = localStorage.getItem("portfolioId") || "default";
      if (project && projectId) {
        await portfolioService.updateProject(portfolioId, projectId, {
          ...project,
          reality: realityData,
        });
        setProject((prev) =>
          prev ? { ...prev, reality: realityData } : null
        );
        setIsCreateRealityModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save reality:", err);
    }
  };

  const handleSaveGoal = async (goalData: any) => {
    try {
      const portfolioId = localStorage.getItem("portfolioId") || "default";
      if (project && projectId) {
        await portfolioService.updateProject(portfolioId, projectId, {
          ...project,
          goal: goalData,
        });
        setProject((prev) =>
          prev ? { ...prev, goal: goalData } : null
        );
        setIsCreateGoalModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to save goal:", err);
    }
  };

  const handleAddAgent = async () => {
    try {
      const portfolioId = localStorage.getItem("portfolioId") || "default";
      if (newAgent.name && newAgent.email) {
        const addedAgent = await portfolioService.addAgent(portfolioId, newAgent);
        setAgents([...agents, addedAgent]);
        setNewAgent({ name: "", email: "", title: "", timezone: "UTC", kind: "human" });
        setIsAgentModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to add agent:", err);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (window.confirm("Are you sure you want to delete this agent?")) {
      try {
        const portfolioId = localStorage.getItem("portfolioId") || "default";
        await portfolioService.deleteAgent(portfolioId, agentId);
        setAgents(agents.filter((a) => a.id !== agentId));
      } catch (err) {
        console.error("Failed to delete agent:", err);
      }
    }
  };

  const dropdownItems = [
    { id: "project", label: "Project" },
    { id: "process", label: "Process" },
    { id: "block", label: "Block" },
  ];

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
  };

  const handleModeSelect = (mode: "blank" | "template") => {
    if (selectedType && selectedType.id === "project" && mode === "blank") {
      setIsRealityGoalModalOpen(true);
    } else if (selectedType && selectedType.id === "phase" && mode === "blank") {
      setIsAddPhaseModalOpen(true);
    } else {
      console.log(
        `Creating new ${selectedType?.label} in ${mode} mode for Project`,
      );
    }
    setIsCreationModalOpen(false);
    setSelectedType(null);
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] bg-[#f0f0eb] dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden font-['Inter'] transition-colors duration-300">
      {/* Reality Goal Modal */}
      <RealityGoalModal
        isOpen={isRealityGoalModalOpen}
        onClose={() => setIsRealityGoalModalOpen(false)}
        onRealityClick={() => {
          setIsRealityGoalModalOpen(false);
          setIsCreateRealityModalOpen(true);
        }}
        onGoalClick={() => {
          setIsRealityGoalModalOpen(false);
          setIsCreateGoalModalOpen(true);
        }}
      />

      {/* Create Reality Modal */}
      <CreateRealityModal
        isOpen={isCreateRealityModalOpen}
        onClose={() => setIsCreateRealityModalOpen(false)}
        onSave={handleSaveReality}
      />

      {/* Create Goal Modal */}
      <CreateGoalModal
        isOpen={isCreateGoalModalOpen}
        onClose={() => setIsCreateGoalModalOpen(false)}
        onSave={handleSaveGoal}
      />

      <AddPhaseModal
        isOpen={isAddPhaseModalOpen}
        onClose={() => setIsAddPhaseModalOpen(false)}
        projectId={projectId}
        onSuccess={(newPhase) => {
          setCards(prev => [
            ...prev,
            {
              id: newPhase._id || Date.now().toString(),
              label: newPhase.phaseName || "New Phase",
              to: `/dashboard/portfolio/saas/project/${projectId}/phase/${newPhase._id || Date.now()}`,
            }
          ]);
        }}
      />

      <header className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Link to="/dashboard/portfolio/saas">
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors">
                <LeftArrow />
              </div>
            </Link>
          </div>
          <Breadcrumbs
            items={[
              { label: "Portfolio", to: "/dashboard/portfolio" },
              { label: "SaaS", to: "/dashboard/portfolio/saas" },
              { label: "Projects", to: "/dashboard/portfolio/saas/project" },
              { label: project?.projectName || "Project", to: `/dashboard/portfolio/saas/project/${projectId || ''}` },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            <SearchIcon />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors relative z-50"
          >
            <PlusIcon />
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 z-50 py-3 overflow-hidden"
                >
                  {dropdownItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedType(item);
                        setIsCreationModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                      <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-bold uppercase">
                        <PlusIcon />
                      </span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight uppercase">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="flex items-center justify-center gap-8 mb-8">
        {["Home", "Team"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-2 py-1 text-sm font-medium transition-colors ${activeTab === tab
              ? "text-gray-900 dark:text-gray-100"
              : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabProject"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full">
        {activeTab === "Home" && (
          <div className="flex items-center justify-center w-full">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="project-phases" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex items-center justify-center flex-wrap"
                  >
                    {cards.map((card, i) => (
                      <Draggable key={card.id} draggableId={card.id} index={i}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center transition-all group relative ${snapshot.isDragging ? "z-50 opacity-50" : ""
                              }`}
                          >
                            {/* Hover Actions (Edit/Delete) - Positioned above */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 dark:bg-slate-800/90 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-slate-700">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditingItem(card);
                                  setIsEditModalOpen(true);
                                }}
                                className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleDelete(card.id);
                                }}
                                className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all"
                              >
                                <TrashIcon />
                              </button>
                            </div>

                            {/* Phase */}
                            <motion.button
                              onClick={() => navigate(card.to)}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            >
                              {card.label}
                            </motion.button>

                            {/* Arrow between phases - Only show if not last item in the list */}
                            {i !== cards.length - 1 && <LongArrow />}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}

                    {/* Plus button after last phase */}
                    <motion.button
                      onClick={() => {
                        setSelectedType({ id: "phase", label: "Phase" });
                        setIsCreationModalOpen(true);
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="ml-10 w-10 h-10 rounded-lg bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition"
                      aria-label="Add Phase"
                    >
                      <PlusIcon />
                    </motion.button>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        {activeTab === "Team" && (
          <div className="w-full max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsAgentModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <PlusIcon /> Add Agent
              </motion.button>
            </div>

            {agents.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <p>No team members yet. Add one to get started.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{agent.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 capitalize">{agent.kind}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteAgent(agent.id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600 dark:text-gray-400">{agent.email}</p>
                      <p className="text-gray-600 dark:text-gray-400">{agent.timezone}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Add Agent Modal */}
            <AnimatePresence>
              {isAgentModalOpen && (
                <div className="fixed inset-0 z-110 flex items-center justify-center p-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsAgentModalOpen(false)}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 30 }}
                    className="relative z-111 w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden flex flex-col pt-6"
                  >
                    <div className="px-8 pb-4 flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Add Team Member
                      </h2>
                      <button
                        onClick={() => setIsAgentModalOpen(false)}
                        className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="px-8 py-4 space-y-4 overflow-y-auto max-h-[70vh]">
                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Agent name"
                          value={newAgent.name}
                          onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                          className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="agent@example.com"
                          value={newAgent.email}
                          onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                          className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Title
                        </label>
                        <input
                          type="text"
                          placeholder="Job title"
                          value={newAgent.title}
                          onChange={(e) => setNewAgent({ ...newAgent, title: e.target.value })}
                          className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Kind
                        </label>
                        <select
                          value={newAgent.kind}
                          onChange={(e) => setNewAgent({ ...newAgent, kind: e.target.value as any })}
                          className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        >
                          <option value="human">Human</option>
                          <option value="ai">AI</option>
                          <option value="software">Software</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Timezone
                        </label>
                        <input
                          type="text"
                          placeholder="UTC"
                          value={newAgent.timezone}
                          onChange={(e) => setNewAgent({ ...newAgent, timezone: e.target.value })}
                          className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                      </div>
                    </div>

                    <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 flex gap-3">
                      <button
                        onClick={handleAddAgent}
                        className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all"
                      >
                        Add Agent
                      </button>
                      <button
                        onClick={() => setIsAgentModalOpen(false)}
                        className="flex-1 py-4 bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-300 dark:hover:bg-slate-600 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <CreationModeModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSelect={handleModeSelect}
        categoryLabel={selectedType?.label || "Project"}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        item={editingItem}
        hideImage={true}
      />
    </div>
  );
};

export default Project;
