import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";
import PageLayout from "../../components/PageLayout";
import PageHeader from "../../components/PageHeader";
import EditItemModal from "../../components/EditItemModal";
import SearchModal from "../../components/SearchModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

/**
 * SaaS Home Page - Root display for the SaaS business sector.
 * Lists departments and high-level operations.
 */

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
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-4xl shadow-2xl relative z-100 p-8 border border-gray-100 dark:border-slate-800"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 font-['Space_Grotesk']">
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

const AddProjectModal = ({
  isOpen,
  onClose,
  businessId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessId: string | null;
  onSuccess: (project: any) => void;
}) => {
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/portfolio/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          businessId: businessId || "default-business-id",
          projectName,
          projectDescription
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const resData = await response.json();
      onSuccess(resData.data || resData);
      setProjectName("");
      setProjectDescription("");
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
                New Project
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
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter project name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Project Description
                </label>
                <textarea
                  required
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] resize-none h-32 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter project description"
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
                  {loading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
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

const AddBusinessDocumentModal = ({
  isOpen,
  onClose,
  businessId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  onSuccess: (doc: any) => void;
}) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!name || !file || !businessId) return;
    setLoading(true);
    setError(null);

    try {
      // 1. Upload to Firebase
      const fileRef = ref(storage, `business_documents/${businessId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const url = await getDownloadURL(snapshot.ref);

      // 2. Submit to backend
      const response = await fetch(`${API_URL}/businessdocuments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({
          businessId,
          name,
          url,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit document");
      }

      const resData = await response.json();
      onSuccess(resData.data || resData);
      onClose();
      setName("");
      setFile(null);
    } catch (err: any) {
      setError(err.message || "An error occurred");
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
                Add Document
              </h3>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Document Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 Tax Returns"
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-blue-500 font-['Inter']"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                  File
                </label>
                <div className="relative group">
                  <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border-2 border-dashed border-gray-200 dark:border-slate-700 flex items-center justify-center text-gray-500 group-hover:border-blue-500 transition-colors">
                    {file ? file.name : "Select a file"}
                  </div>
                </div>
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
                  onClick={handleSubmit}
                  disabled={loading || !name || !file}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Uploading..." : "Add Document"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const AddFolderModal = ({
  isOpen,
  onClose,
  businessId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  onSuccess: (folder: any) => void;
}) => {
  const [folderName, setFolderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) {
      setError("Folder name is required");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/folders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({
          businessId,
          folderName: folderName,
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      const resData = await response.json();
      onSuccess(resData.data || resData);
      setFolderName("");
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
                New Folder
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
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-['Inter'] text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                  placeholder="Enter folder name"
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
                  {loading ? "Creating..." : "Create Folder"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Saas = () => {
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get("businessId") || localStorage.getItem("currentBusinessId") || "";

  const [projects, setProjects] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);

  useEffect(() => {
    if (businessId) {
      localStorage.setItem("currentBusinessId", businessId);

      const fetchProjects = async () => {
        try {
          const response = await fetch(`${API_URL}/portfolio/projects/${businessId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setProjects(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
          }
        } catch (e) {
          console.error("Failed to fetch projects:", e);
        } finally {
        }
      };

      const fetchTasks = async () => {
        try {
          const response = await fetch(`${API_URL}/businessitems/task/${businessId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setTasks(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
          }
        } catch (e) {
          console.error("Failed to fetch tasks:", e);
        }
      };

      const fetchDocuments = async () => {
        try {
          const response = await fetch(`${API_URL}/businessdocuments/${businessId}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setDocuments(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
          }
        } catch (e) {
          console.error("Failed to fetch documents:", e);
        }
      };
      const fetchFolders = async () => {
        try {
          const response = await fetch(`${API_URL}/folders`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setFolders(Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []));
          }
        } catch (e) {
          console.error("Failed to fetch folders:", e);
        }
      };

      fetchProjects();
      fetchTasks();
      fetchDocuments();
      fetchFolders();
    }
  }, [businessId]);

  const [activeTab, setActiveTab] = useState("Home");
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [isAddFolderModalOpen, setIsAddFolderModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const base = "/dashboard/portfolio/saas";
  const queryString = businessId ? `?businessId=${businessId}` : "";
  const [cards, setCards] = useState<any[]>([
    // {
    //   id: "folder",
    //   label: "Business Folder",
    //   to: `${base}/folder${queryString}`,
    //   image: null as string | null,
    // },
    //    {
    //   id: "block",
    //   label: "Business Documents",
    //   to: `${base}/businessdocs/${businessId}`,
    //   image: null as string | null,
    // },
    // {
    //   id: "processes",
    //   label: "Business Tasks",
    //   to: `/dashboard/portfolio/saas/businesstasks/${businessId}`,
    //   image: null as string | null,
    // },

  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    image?: string | null;
  } | null>(null);

  const handleSaveEdit = (
    id: string,
    newName: string,
    newImage: string | null,
  ) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, label: newName, image: newImage } : card,
      ),
    );
  };

  const onDragEnd = async (result: DropResult) => {
    if (result.combine) {
      const draggedId = result.draggableId;
      const targetId = result.combine.draggableId;

      const draggedProject = projects.find(p => p._id === draggedId);
      const draggedTask = tasks.find(t => t._id === draggedId);
      const draggedDoc = documents.find(d => d._id === draggedId);
      const targetFolder = folders.find(f => f._id === targetId || f.id === targetId);

      if (targetFolder) {
        let endpoint = "";
        if (draggedProject) {
          endpoint = `${API_URL}/portfolio/projects/${draggedId}/folder`;
        } else if (draggedTask) {
          endpoint = `${API_URL}/businessitems/task/${draggedId}/folder`;
        } else if (draggedDoc) {
          endpoint = `${API_URL}/businessdocuments/${draggedId}/folder`;
        }

        if (endpoint) {
          try {
            const response = await fetch(endpoint, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`
              },
              body: JSON.stringify({ folderId: targetId })
            });

            if (!response.ok && response.status === 404) {
              await fetch(endpoint, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                },
                body: JSON.stringify({ folderId: targetId })
              });
            }

            window.location.reload();
          } catch (e) {
            console.error("Failed to add to folder:", e);
          }
        }
      }
      return;
    }

    if (!result.destination) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
  };

  const dropdownItems = [
    { id: "folder", label: "Folder" },
    { id: "project", label: "Project" },
    { id: "processes", label: "Tasks" },
    { id: "block", label: "Documents" },
  ];

  const handleModeSelect = (mode: "blank" | "template") => {
    if (selectedCategory) {
      if (selectedCategory.id === "project" && mode === "blank") {
        setIsAddProjectModalOpen(true);
      } else if (selectedCategory.id === "folder" && mode === "blank") {
        setIsAddFolderModalOpen(true);
      } else if (selectedCategory.id === "processes" && mode === "blank") {
        setIsAddTaskModalOpen(true);
      } else if (selectedCategory.id === "block" && mode === "blank") {
        setIsAddDocModalOpen(true);
      } else if (selectedCategory.id === "processes") {
        navigate(`${base}/business/${businessId}/processes?mode=${mode}`);
      } else {
        navigate(`${base}/${selectedCategory.id}?mode=${mode}`);
      }
    }
    setIsCreationModalOpen(false);
    setSelectedCategory(null);
  };

  const currentCrumbs = [
    { label: "Portfolio", to: "/dashboard/portfolio" },
    { label: "SaaS", to: "/dashboard/portfolio/saas" },
  ];

  return (
    <PageLayout>
      <PageHeader
        breadcrumbs={currentCrumbs}
        onSearch={() => setIsSearchOpen(true)}
        onAdd={() => setIsDropdownOpen(!isDropdownOpen)}
        extraActions={
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
                        setSelectedCategory(item);
                        setIsCreationModalOpen(true);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                      <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <PlusIcon />
                      </span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-200 tracking-tight uppercase">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        }
      />

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
                layoutId="activeTabSaaS"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Cards */}
      <div className="flex h-[calc(100vh-100px)] items-center justify-center">
        {activeTab === "Home" && (
          <div className="max-w-7xl w-full px-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="saas-cards" direction="horizontal" isCombineEnabled={true}>
                {(provided) => {
                  // Combine static cards and fetched projects and tasks
                  const projectCards = projects
                    .filter((project) => !project.folderId)
                    .map((project) => ({
                    id: project._id,
                    label: project.projectName || "Unnamed Project",
                    to: `${base}/project/${project._id}${queryString}`,
                    image: null,
                    isProject: true,
                  }));

                  const taskCards = tasks
                    .filter((task) => !task.folderId)
                    .map((task) => ({
                    id: task._id,
                    label: task.taskName || "Unnamed Task",
                    to: `${base}/showbusinesstask/${task._id}${queryString}`,
                    image: null,
                    isTask: true,
                  }));

                  const documentCards = documents
                    .filter((doc) => !doc.folderId)
                    .map((doc) => ({
                    id: doc._id,
                    label: doc.name || "Unnamed Document",
                    to: `${base}/showbusinessdoc/${doc._id}${queryString}`,
                    image: null,
                    isDocument: true,
                  }));

                  const folderCards = folders
                    .filter((folder) => !folder.folderId)
                    .map((folder) => ({
                    id: folder._id || folder.id,
                    label: folder.folderName || folder.name || "Unnamed Folder",
                    to: `${base}/folder/${folder._id || folder.id}${queryString}`,
                    image: null,
                    isFolder: true,
                  }));

                  const displayItems = [...cards, ...folderCards, ...projectCards, ...taskCards, ...documentCards];

                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                    >
                      {displayItems.map((item, i) => (
                        <Draggable key={item.id} draggableId={item.id} index={i} isDragDisabled={(item as any).isFolder}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`transition-all ${snapshot.isDragging ? "z-50" : ""
                                }`}
                            >
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ 
                                  opacity: 1, 
                                  y: 0,
                                  scale: snapshot.combineTargetFor ? 0.9 : 1
                                }}
                                transition={{ 
                                  delay: i * 0.1,
                                  scale: { duration: 0.2, type: "spring" }
                                }}
                                className={`flex flex-col items-center gap-3 w-full group cursor-pointer p-6 rounded-[2.5rem] hover:bg-gray-100 dark:hover:bg-slate-900 transition-all font-bold relative ${snapshot.isDragging
                                  ? "bg-white dark:bg-slate-800 shadow-lg ring-4 ring-blue-500/20"
                                  : snapshot.combineTargetFor
                                  ? "bg-blue-50 dark:bg-blue-900/20 shadow-inner border-2 border-blue-400 border-dashed"
                                  : ""
                                  }`}
                                onClick={() => navigate(item.to)}
                                whileHover={{ scale: snapshot.combineTargetFor ? 0.9 : 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <div className="w-full aspect-16/10 bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:shadow-md transition-shadow flex items-center justify-center overflow-hidden relative">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.label}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <>
                                      <div className="absolute inset-0 bg-linear-to-br from-blue-50/20 dark:from-blue-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                      <div className="absolute inset-0 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                                        {(item as any).isProject ? (
                                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500 group-hover:scale-110 transition-transform duration-300">
                                            <rect x="3" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="3" width="7" height="7"></rect>
                                            <rect x="14" y="14" width="7" height="7"></rect>
                                            <rect x="3" y="14" width="7" height="7"></rect>
                                          </svg>
                                        ) : (item as any).isTask ? (
                                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 group-hover:scale-110 transition-transform duration-300">
                                            <path d="M9 11l3 3L22 4"></path>
                                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                                          </svg>
                                        ) : (item as any).isDocument ? (
                                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500 group-hover:scale-110 transition-transform duration-300">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                            <polyline points="14 2 14 8 20 8"></polyline>
                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                            <polyline points="10 9 9 9 8 9"></polyline>
                                          </svg>
                                        ) : (
                                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:scale-110 transition-transform duration-300">
                                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                                          </svg>
                                        )}
                                      </div>
                                    </>
                                  )}
                                </div>
                                <span className="text-sm font-black font-['Space_Grotesk'] text-gray-900 dark:text-gray-100 tracking-tight uppercase group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {item.label}
                                </span>

                                {/* Item Tag */}
                                {(item as any).isProject && (
                                  <div className="absolute top-4 left-4 px-2 py-1 bg-blue-600/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Project
                                  </div>
                                )}
                                {(item as any).isTask && (
                                  <div className="absolute top-4 left-4 px-2 py-1 bg-green-600/10 dark:bg-green-400/10 text-green-600 dark:text-green-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Task
                                  </div>
                                )}
                                {(item as any).isDocument && (
                                  <div className="absolute top-4 left-4 px-2 py-1 bg-purple-600/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Document
                                  </div>
                                )}
                                {(item as any).isFolder && (
                                  <div className="absolute top-4 left-4 px-2 py-1 bg-yellow-600/10 dark:bg-yellow-400/10 text-yellow-600 dark:text-yellow-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                    Folder
                                  </div>
                                )}

                                {/* Hover Actions */}
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setEditingItem(item);
                                      setIsEditModalOpen(true);
                                    }}
                                    className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-sm"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      console.log("Delete", item.id);
                                    }}
                                    className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>
          </div>
        )}
        {activeTab === "Team" && (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            No team members found
          </div>
        )}
      </div>

      <CreationModeModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSelect={handleModeSelect}
        categoryLabel={selectedCategory?.label || ""}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        businessId={businessId}
        onSuccess={(newProject) => {
          setProjects(prev => [...prev, newProject]);
        }}
      />

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        businessId={businessId}
        onSuccess={(newTask) => {
          setTasks(prev => [...prev, newTask]);
        }}
      />

      <AddBusinessDocumentModal
        isOpen={isAddDocModalOpen}
        onClose={() => setIsAddDocModalOpen(false)}
        businessId={businessId}
        onSuccess={(newDoc) => {
          if (newDoc) {
            setDocuments(prev => [...prev, newDoc]);
          } else {
            // Fallback refresh
            window.location.reload();
          }
        }}
      />

      <AddFolderModal
        isOpen={isAddFolderModalOpen}
        onClose={() => setIsAddFolderModalOpen(false)}
        businessId={businessId}
        onSuccess={() => {
          // Optional: Add to local state if you create a folders array, otherwise reload
          window.location.reload();
        }}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        item={editingItem}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </PageLayout>
  );
};

export default Saas;
