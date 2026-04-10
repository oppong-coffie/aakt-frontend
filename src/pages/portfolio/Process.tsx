import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { portfolioService, type Agent } from "../../api/portfolio.service";
import { API_URL } from "../../config/api";

/**
 * Process Page (Portfolio) - A detailed view for managing business processes.
 * Supports creating tasks with steps (command, deliverable, feedback).
 * Includes a sidebar for quick access to Blocks and People involved in the process.
 */

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
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
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const LeftArrowIcon = () => (
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
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-4xl shadow-2xl relative z-100 p-8 border border-gray-100 dark:border-slate-800"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-['Inter']">
                New {categoryLabel}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                How would you like to start?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onSelect("blank")}
                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-gray-800 dark:group-hover:bg-gray-200 transition-colors">
                  <PlusIcon />
                </div>
                <span className="font-bold">Blank</span>
              </button>

              <button
                onClick={() => onSelect("template")}
                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-gray-800 dark:group-hover:bg-gray-200 transition-colors">
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
              className="w-full mt-6 py-3 text-gray-400 dark:text-gray-500 font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AddProcessModal = ({
  isOpen,
  onClose,
  phaseId,
  projectId,
  businessId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  phaseId: string | undefined;
  projectId: string | undefined;
  businessId: string | undefined;
  onSuccess: (process: any) => void;
}) => {
  const [processName, setProcessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate missing fields!
    const missingFields = [];
    if (!businessId) missingFields.push("businessId (missing from URL)");
    if (!phaseId) missingFields.push("phaseId (missing from URL)");
    if (!projectId) missingFields.push("projectId (missing from URL)");
    if (!processName) missingFields.push("processName");

    if (missingFields.length > 0) {
      setError(`Cannot create: Missing ${missingFields.join(", ")}`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/portfolio/processes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          phaseId,
          projectId,
          businessId,
          processName
        })
      });

      if (!response.ok) {
        let errorMessage = "Failed to create process";
        try {
          const errData = await response.json();
          errorMessage = errData.error || errData.message || JSON.stringify(errData);
        } catch (parseErr) {
          errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const resData = await response.json();
      onSuccess(resData.data || resData);
      setProcessName("");
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
                New Process
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
                  Process Name
                </label>
                <input
                  type="text"
                  required
                  value={processName}
                  onChange={(e) => setProcessName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter process name"
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
                  {loading ? "Creating..." : "Create Process"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Process = () => {
  const { processId } = useParams<{ processId: string }>();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get("phaseId") || processId || "";
  const projectId = searchParams.get("projectId") || localStorage.getItem("projectId") || "";
  const initialBusinessId = searchParams.get("businessId") || localStorage.getItem("currentBusinessId") || "";
  const [resolvedBusinessId, setResolvedBusinessId] = useState<string>(initialBusinessId);

  useEffect(() => {
    if (!resolvedBusinessId) {
      // Emergency fallback: fetch businesses from backend if URL and local storage let us down
      fetch(`${API_URL}/portfolio`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token") || ""}` }
      })
      .then(res => res.json())
      .then(json => {
         const list = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
         if (list.length > 0 && list[0]._id) {
           setResolvedBusinessId(list[0]._id);
           localStorage.setItem("currentBusinessId", list[0]._id);
         }
      })
      .catch(err => console.warn("Could not auto-resolve businessId:", err));
    }
  }, [resolvedBusinessId]);

  const [activeTab, setActiveTab] = useState("Home");
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isAddProcessModalOpen, setIsAddProcessModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const [processesList, setProcessesList] = useState<any[]>([]);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", agentIds: [] as string[] });

  const [people] = useState<Array<{ name: string; seed: string }>>([
    { name: "Felix", seed: "Felix" },
    { name: "Aneka", seed: "Aneka" },
    { name: "Jace", seed: "Jace" },
  ]);

  // Load process data
  useEffect(() => {
    const loadProcess = async () => {
      try {
        const portfolioId = localStorage.getItem("portfolioId") || "default";
        if (phaseId) {
          try {
            const data = await portfolioService.getAgents(portfolioId);
            setAgents(data);
          } catch (agentErr) {
            console.warn("Failed to load agents, this is non-fatal:", agentErr);
          }
          
          const res = await fetch(`${API_URL}/portfolio/processes/${phaseId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          });
          if (res.ok) {
            const json = await res.json();
            const fetched = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
            setProcessesList(fetched);
            console.log("processesList", fetched);
            if (fetched.length > 0) {
              setSelectedProcessId(fetched[0]._id);
              setTasks(fetched[0].tasks || []);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load process:", err);
      } finally {
      }
    };
    loadProcess();
  }, [phaseId]);

  const dropdownItems = [
    { id: "project", label: "Project" },
    { id: "process", label: "Process" },
    { id: "block", label: "Block" },
  ];

  const handleModeSelect = (mode: "blank" | "template") => {
    if (selectedType && selectedType.id === "process" && mode === "blank") {
      setIsAddProcessModalOpen(true);
    } else {
      console.log(
        `Creating new ${selectedType?.label} in ${mode} mode for Process`,
      );
    }
    setIsCreationModalOpen(false);
    setSelectedType(null);
  };

  const handleAddTask = async () => {
    try {
      if (selectedProcessId && newTask.name) {
        const response = await fetch(`${API_URL}/portfolio/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          },
          body: JSON.stringify({
            processId: selectedProcessId,
            taskName: newTask.name,
          })
        });

        if (!response.ok) {
          let errorMessage = "Failed to create task";
          try {
            const errData = await response.json();
            errorMessage = errData.error || errData.message || JSON.stringify(errData);
          } catch (e) {
            errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const resData = await response.json();
        const createdTask = resData.data || resData;
        
        setTasks([...tasks, createdTask]);
        
        setProcessesList(prev => prev.map(p => 
          p._id === selectedProcessId 
            ? { ...p, tasks: [...(p.tasks || []), createdTask] }
            : p
        ));

        setNewTask({ name: "", agentIds: [] });
        setIsTaskModalOpen(false);
      }
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const portfolioId = localStorage.getItem("portfolioId") || "default";
        if (selectedProcessId) {
          await portfolioService.deleteTask(portfolioId, selectedProcessId, taskId);
          setTasks(tasks.filter((t) => t.parentId !== taskId));
        }
      } catch (err) {
        console.error("Failed to delete task:", err);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden font-['Inter'] transition-colors duration-300">
      
      <AddProcessModal
        isOpen={isAddProcessModalOpen}
        onClose={() => setIsAddProcessModalOpen(false)}
        phaseId={phaseId}
        projectId={projectId}
        businessId={resolvedBusinessId}
        onSuccess={(newProc) => {
          setProcessesList(prev => [...prev, newProc]);
          if (!selectedProcessId) {
            setSelectedProcessId(newProc._id);
            setTasks(newProc.tasks || []);
          }
        }}
      />

      {/* Header Area */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Link to="/dashboard/portfolio/saas">
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors">
                <LeftArrowIcon />
              </div>
            </Link>
          </div>
          <Breadcrumbs
            items={[
              { label: "Portfolio", to: "/dashboard/portfolio" },
              { label: "SaaS", to: "/dashboard/portfolio/saas" },
              { label: "Projects", to: "/dashboard/portfolio/saas/project" },
              { label: projectId || "Project", to: `/dashboard/portfolio/saas/project/${projectId || ''}` },
              { label: "Phase", to: `/dashboard/portfolio/saas/project/${projectId || ''}/phase/${phaseId || ''}` },
              { label: "Process", to: "#" },
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
                layoutId="activeTabProcess"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-1 gap-6">
        {activeTab === "Home" && (
          <>
            {/* Left Sidebar (Blocks & People) */}
            <div className="w-16 flex flex-col gap-8 py-4 z-50">
              <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                  Process
                </span>
                {processesList.map((proc, index) => (
                  <div
                    key={proc._id}
                    className="relative group flex items-center"
                    onMouseEnter={() => setHoveredBlock(index)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => {
                      setSelectedProcessId(proc._id);
                      setTasks(proc.tasks || []);
                    }}
                  >
                    <div className={`w-10 h-10 ${selectedProcessId === proc._id ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-slate-800"} rounded-lg shrink-0 cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors flex items-center justify-center text-white font-bold text-xs`}>
                      {index + 1}
                    </div>

                    {/* Tooltip */}
                    <AnimatePresence>
                      {hoveredBlock === index && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          className="absolute left-14 flex items-center gap-0 z-[100] pointer-events-none"
                        >
                          <div className="w-40 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center relative translate-x-1">
                            <div className="w-4 h-4 bg-white dark:bg-slate-800 rotate-45 absolute -left-1.5 border-l border-b border-gray-100 dark:border-slate-700"></div>
                            <div className="w-32 h-6 bg-gray-300 dark:bg-slate-700 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-gray-300">{proc.processName}</div>
                          </div>
                          {/* <div className="bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 ml-1.5 whitespace-nowrap max-w-xs">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                              {proc.processName || `Stage ${index + 1}`}
                            </span>
                          </div> */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <button
                  onClick={() => {
                    setSelectedType({ id: "process", label: "Process" });
                    setIsCreationModalOpen(true);
                  }}
                  className="w-10 h-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shrink-0"
                >
                  <PlusIcon />
                </button>
              </div>

              {/* People Section - Displays avatars of team members linked to this process. */}
              <div className="flex flex-col items-center gap-3 mt-auto">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
                  People
                </span>
                {people.map((person) => (
                  <div
                    key={person.name}
                    className="relative group flex items-center"
                    onMouseEnter={() => setHoveredPerson(person.name)}
                    onMouseLeave={() => setHoveredPerson(null)}
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
                      className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform shrink-0"
                    />

                    {/* Person Tooltip */}
                    <AnimatePresence>
                      {hoveredPerson === person.name && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          className="absolute left-12 flex items-center gap-0 z-50 pointer-events-none"
                        >
                          <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center relative translate-x-1">
                            <div className="w-3 h-3 bg-white dark:bg-slate-800 rotate-45 absolute -left-1 border-l border-b border-gray-100 dark:border-slate-700"></div>
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
                              className="w-6 h-6 rounded-full"
                            />
                          </div>
                          <div className="bg-white dark:bg-slate-800 px-3 py-2 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 ml-1.5 whitespace-nowrap">
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                              {person.name}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
                <button className="text-[9px] font-bold text-blue-600 hover:underline whitespace-nowrap">
                  View More
                </button>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
              <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                  Tasks
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <PlusIcon /> Add Task
                </motion.button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p>No tasks yet. Create one to get started.</p>
                  </div>
                ) : (
                  tasks.map((task, idx) => (
                    <motion.div
                      key={task._id || task.id || idx}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{task.taskName || task.name}</h3>
                         
                          {task.agentIds && task.agentIds.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {task.agentIds.map((agentId: string) => {
                                const agent = agents.find((a) => a.id === agentId);
                                return agent ? (
                                  <span
                                    key={agentId}
                                    className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
                                  >
                                    {agent.name}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          )}
                          {task.steps && task.steps.length > 0 && (
                            <div className="mt-3 space-y-2">
                              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Steps:</p>
                              {task.steps.map((step: any, idx: number) => (
                                <div key={idx} className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                  {idx + 1}. {step.type === "command" && `Command: ${step.content}`}
                                  {step.type === "deliverable" && `Deliverable (Block: ${step.blockId})`}
                                  {step.type === "feedback" && `Feedback (Reviewer: ${step.reviewerAgentId})`}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.parentId)}
                          className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          âœ•
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Add Task Modal */}
              <AnimatePresence>
                {isTaskModalOpen && (
                  <div className="fixed inset-0 z-110 flex items-center justify-center p-6">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setIsTaskModalOpen(false)}
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
                          Add Task
                        </h2>
                        <button
                          onClick={() => setIsTaskModalOpen(false)}
                          className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
                        >
                          âœ•
                        </button>
                      </div>

                      <div className="px-8 py-4 space-y-4 overflow-y-auto max-h-[70vh]">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Task Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter task name"
                            value={newTask.name}
                            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                            className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Assign Agents
                          </label>
                          <div className="mt-2 space-y-2">
                            {agents.map((agent) => (
                              <label key={agent.id} className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={newTask.agentIds.includes(agent.id)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setNewTask({ ...newTask, agentIds: [...newTask.agentIds, agent.id] });
                                    } else {
                                      setNewTask({
                                        ...newTask,
                                        agentIds: newTask.agentIds.filter((id) => id !== agent.id),
                                      });
                                    }
                                  }}
                                  className="w-4 h-4 rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">{agent.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 flex gap-3">
                        <button
                          onClick={handleAddTask}
                          disabled={!newTask.name.trim()}
                          className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Add Task
                        </button>
                        <button
                          onClick={() => setIsTaskModalOpen(false)}
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
          </>
        )}
        {activeTab === "Team" && (
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
            No team members found
          </div>
        )}
      </div>

      <CreationModeModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSelect={handleModeSelect}
        categoryLabel={selectedType?.label || "Process"}
      />
    </div>
  );
};

export default Process;
