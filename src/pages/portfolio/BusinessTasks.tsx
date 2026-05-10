import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { API_URL } from "../../config/api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";

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

const AddTaskModal = ({
  isOpen,
  onClose,
  businessId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessId: string | undefined;
  onSuccess: (task: any) => void;
}) => {
  const [taskName, setTaskName] = useState("");
  const [docName, setDocName] = useState("");
  const [manualBusinessId, setManualBusinessId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (businessId) {
      setManualBusinessId(businessId);
    }
  }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalBusinessId = manualBusinessId || businessId;

    if (!finalBusinessId) {
      setError("Cannot create: Missing Business ID");
      return;
    }
    if (!taskName) {
      setError("Cannot create: Missing Task Name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let documents: any[] = [];
      if (file) {
        const fileRef = ref(storage, `tasks/${finalBusinessId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        const url = await getDownloadURL(snapshot.ref);
        documents = [{
          name: docName || file.name,
          url: url
        }];
      }

      const response = await fetch(`${API_URL}/businessitems/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          businessId: finalBusinessId,
          taskName,
          documents
        })
      });

      if (!response.ok) {
        let errorMessage = "Failed to create task";
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
      setTaskName("");
      setDocName("");
      setFile(null);
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
                New Task
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
                  Business ID
                </label>
                <input
                  type="text"
                  required
                  value={manualBusinessId}
                  onChange={(e) => setManualBusinessId(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter Business ID"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter task name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Document Name (Optional)
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="e.g. Q3 Financials"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Attach Document (Optional)
                </label>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFile(e.target.files[0]);
                    } else {
                      setFile(null);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100"
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
                  {loading ? "Creating..." : "Create Task"}
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
  const { businessId: routeBusinessId } = useParams<{ businessId: string }>();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get("phaseId") || "";
  const projectId = searchParams.get("projectId") || localStorage.getItem("projectId") || "";
  const initialBusinessId = routeBusinessId || searchParams.get("businessId") || localStorage.getItem("currentBusinessId") || "";
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
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const [processesList, setProcessesList] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ name: "", agentIds: [] as string[] });
  const [docFile, setDocFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [people] = useState<Array<{ name: string; seed: string }>>([
    { name: "Felix", seed: "Felix" },
    { name: "Aneka", seed: "Aneka" },
    { name: "Jace", seed: "Jace" },
  ]);

  // Load task data
  useEffect(() => {
    const loadTasks = async () => {
      if (!resolvedBusinessId) return;
      
      try {
        const res = await fetch(`${API_URL}/businessitems/task/${resolvedBusinessId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });
        if (res.ok) {
          const json = await res.json();
          const fetched = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
          setProcessesList(fetched);
          if (fetched.length > 0) {
            setSelectedTask(fetched[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load tasks:", err);
      }
    };
    loadTasks();
  }, [resolvedBusinessId]);

  const dropdownItems = [
    { id: "project", label: "Project" },
    { id: "process", label: "Tasks" },
    { id: "block", label: "Documents" },
  ];

  const handleModeSelect = (mode: "blank" | "template") => {
    if (selectedType && selectedType.id === "process" && mode === "blank") {
      setIsAddTaskModalOpen(true);
    } else {
      console.log(
        `Creating new ${selectedType?.label} in ${mode} mode for Process`,
      );
    }
    setIsCreationModalOpen(false);
    setSelectedType(null);
  };

  const handleAddDocument = async () => {
    try {
      if (selectedTask?._id && newTask.name && docFile) {
        setLoading(true);
        
        // 1. Upload to Firebase
        const fileRef = ref(storage, `business_docs/${selectedTask._id}/${Date.now()}_${docFile.name}`);
        const snapshot = await uploadBytes(fileRef, docFile);
        const url = await getDownloadURL(snapshot.ref);

        // 2. Submit to backend
        const response = await fetch(`${API_URL}/businessitems/task/${selectedTask._id}/document`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          },
          body: JSON.stringify({
            name: newTask.name,
            url: url
          })
        });

        if (!response.ok) {
          let errorMessage = "Failed to add document";
          try {
            const errData = await response.json();
            errorMessage = errData.error || errData.message || JSON.stringify(errData);
          } catch (e) {
            errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
          }
          throw new Error(errorMessage);
        }

        const resData = await response.json();
        const updatedTask = resData.data || resData;
        
        // 3. Update local state
        setSelectedTask(updatedTask);
        setProcessesList(prev => prev.map(p => 
          p._id === updatedTask._id ? updatedTask : p
        ));

        setNewTask({ name: "", agentIds: [] });
        setDocFile(null);
        setIsTaskModalOpen(false);
      }
    } catch (err: any) {
      console.error("Failed to add document:", err);
      alert(err.message || "Failed to add document");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden font-['Inter'] transition-colors duration-300">
      
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        businessId={resolvedBusinessId}
        onSuccess={() => {
          // Refresh your list or handle the new task
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
              { label: "Tasks", to: "#" },
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
                  Tasks
                </span>
                {processesList.map((task, index) => (
                  <div
                    key={task._id || index}
                    className="relative group flex items-center"
                    onMouseEnter={() => setHoveredBlock(index)}
                    onMouseLeave={() => setHoveredBlock(null)}
                    onClick={() => {
                      setSelectedTask(task);
                    }}
                  >
                    <div className={`w-10 h-10 ${selectedTask?.taskName === task.taskName ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-slate-800"} rounded-lg shrink-0 cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors flex items-center justify-center text-white font-bold text-xs`}>
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
                            <div className="w-32 h-6 bg-gray-300 dark:bg-slate-700 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-gray-300">{task.taskName}</div>
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
                    setSelectedType({ id: "process", label: "Tasks" });
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
                  {selectedTask?.taskName || "Task Details"}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsTaskModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <PlusIcon /> Add Business Document
                </motion.button>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {!selectedTask || !selectedTask.documents || selectedTask.documents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p>No documents found for this task.</p>
                  </div>
                ) : (
                  selectedTask.documents.map((doc: any, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{doc.name}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Document</p>
                        </div>
                      </div>
                      <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      >
                        View File
                      </a>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Add Business Documents Modal */}
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
                          Add Documents
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
                            Document Name
                          </label>
                          <input
                            type="text"
                            placeholder="Enter document name"
                            value={newTask.name}
                            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                            className="w-full px-4 py-3 mt-1 rounded-xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-700 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            Upload Document
                          </label>
                          <div className="mt-2">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <svg className="w-8 h-8 mb-3 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span className="font-semibold">Click to upload</span> or drag and drop
                                </p>
                                <p className="text-xs text-gray-400">
                                  {docFile ? docFile.name : "PDF, PNG, JPG or DOCX"}
                                </p>
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target.files && e.target.files.length > 0) {
                                    setDocFile(e.target.files[0]);
                                  }
                                }}
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="px-8 py-6 bg-gray-50 dark:bg-slate-800/30 flex gap-3">
                        <button
                          onClick={handleAddDocument}
                          disabled={loading || !newTask.name.trim() || !docFile}
                          className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          {loading ? "Uploading..." : "Add Document"}
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
        categoryLabel={selectedType?.label || "Tasks"}
      />
    </div>
  );
};

export default Process;
