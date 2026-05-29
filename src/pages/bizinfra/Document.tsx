import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "../../components/Breadcrumbs";
import apiClient from "../../api/apiClient";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";

/* ─── Icon Components ─── */

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

const DocIcon = ({ filename, className = "w-6 h-6" }: { filename: string; className?: string }) => {
  const ext = filename.split(".").pop()?.toLowerCase();

  if (ext === "pdf") {
    return (
      <svg className={`${className} text-red-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M8 13h8M8 17h8" />
      </svg>
    );
  }

  if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(ext || "")) {
    return (
      <svg className={`${className} text-emerald-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }

  if (["xls", "xlsx", "csv"].includes(ext || "")) {
    return (
      <svg className={`${className} text-green-600`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M8 13h8v4H8z" />
        <path d="M12 13v4" />
      </svg>
    );
  }

  return (
    <svg className={`${className} text-blue-500`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <line x1="10" y1="9" x2="8" y2="9" />
    </svg>
  );
};

/* ─── Modals ─── */

const AddDocModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, file: File) => Promise<void>;
}) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setFile(null);
      setError(null);
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!name.trim() || !file) return;
    setIsUploading(true);
    setError(null);
    try {
      await onSave(name.trim(), file);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  };

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
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-100 p-8 border border-gray-100 dark:border-slate-800 font-['Inter']"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-['Space_Grotesk']">
              Add New Document
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-950">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50"
                  placeholder="e.g. Project Specification"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Select File
                </label>
                <div className="relative w-full h-36 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                  {file ? (
                    <div className="p-4 text-center">
                      <DocIcon filename={file.name} className="w-10 h-10 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[250px] block">{file.name}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500 block">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 p-4 text-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <span className="text-sm font-medium">Upload File</span>
                    </div>
                  )}
                  <input
                    type="file"
                    disabled={isUploading}
                    onChange={(e) => {
                      const selected = e.target.files?.[0] || null;
                      setFile(selected);
                      if (selected && !name.trim()) {
                        const baseName = selected.name.substring(0, selected.name.lastIndexOf('.')) || selected.name;
                        setName(baseName);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!name.trim() || !file || isUploading}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/10 dark:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    "Add Document"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const EditDocModal = ({
  isOpen,
  onClose,
  onSave,
  item,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, file: File | null) => Promise<void>;
  item: { id: string; name: string; url: string } | null;
}) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && item) {
      setName(item.name);
      setFile(null);
      setError(null);
    }
  }, [isOpen, item]);

  const handleSave = async () => {
    if (!name.trim() || !item) return;
    setIsUploading(true);
    setError(null);
    try {
      await onSave(item.id, name.trim(), file);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to update document");
    } finally {
      setIsUploading(false);
    }
  };

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
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-100 p-8 border border-gray-100 dark:border-slate-800 font-['Inter']"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-['Space_Grotesk']">
              Edit Document
            </h3>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-950">
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Document Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 disabled:opacity-50"
                  placeholder="Document name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Replace File (Optional)
                </label>
                <div className="relative w-full h-36 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border-2 border-dashed border-gray-200 dark:border-slate-700 flex flex-col items-center justify-center overflow-hidden group hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer">
                  {file ? (
                    <div className="p-4 text-center">
                      <DocIcon filename={file.name} className="w-10 h-10 mx-auto mb-2" />
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate max-w-[250px] block">{file.name}</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 p-4 text-center">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                      </svg>
                      <span className="text-xs text-gray-400 dark:text-gray-500 block mt-1">Current: {item?.name.split('/').pop() || "Uploaded Document"}</span>
                      <span className="text-sm font-medium">Choose new file</span>
                    </div>
                  )}
                  <input
                    type="file"
                    disabled={isUploading}
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!name.trim() || isUploading}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/10 dark:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/* ─── Main Component ─── */

interface DocItem {
  id: string;
  name: string;
  url: string;
}

const DocumentPage = () => {
  const navigate = useNavigate();
  const { id: skillId } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const phaseId = searchParams.get("phaseId") || "";

  const [documents, setDocuments] = useState<DocItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [skillName, setSkillName] = useState("Skill");
  const [projectName, setProjectName] = useState("Project");
  const [phaseName, setPhaseName] = useState("Phase");
  const [projectId, setProjectId] = useState("");

  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);


  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DocItem | null>(null);

  // const people = [
  //   { name: "Adam fatal", seed: "Adam" },
  //   { name: "Aneka", seed: "Aneka" },
  //   { name: "Jace", seed: "Jace" },
  // ];

  // Fetch skill, project, and phase metadata for breadcrumbs
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        if (skillId) {
          const response = await apiClient.get(`/skills`);
          if (response.data) {
            const skill = response.data.find((s: any) => s._id === skillId);
            if (skill) {
              setSkillName(skill.skillname);
            }
          }
        }
        if (phaseId) {
          const phaseRes = await apiClient.get(`/skills/phases/${phaseId}`);
          if (phaseRes.data) {
            setPhaseName(phaseRes.data.phasename);
            const projId = phaseRes.data.projectid;
            setProjectId(projId);

            if (projId) {
              const projectRes = await apiClient.get(`/skills/projects/${projId}`);
              if (projectRes.data) {
                setProjectName(projectRes.data.projectname);
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
      }
    };
    fetchMetadata();
  }, [skillId, phaseId]);

  // Fetch documents for the phase
  const fetchDocuments = async () => {
    if (!phaseId) return;
    try {
      setIsLoading(true);
      const res = await apiClient.get("/skills/documents", {
        params: { phaseid: phaseId },
      });
      if (res.data) {
        const loaded = res.data.map((d: any) => ({
          id: d._id,
          name: d.documentname,
          url: d.documenturl,
        }));
        setDocuments(loaded);
        if (loaded.length > 0) {
          setSelectedDoc(loaded[0]);
        } else {
          setSelectedDoc(null);
        }
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [phaseId]);

  // Create Document (POST)
  const handleAddDocument = async (name: string, file: File) => {
    try {
      const fileRef = ref(storage, `skills_documents/${skillId}/${phaseId}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(snapshot.ref);

      const response = await apiClient.post("/skills/documents", {
        phaseid: phaseId,
        documentname: name,
        documenturl: downloadUrl,
      });

      if (response.data) {
        const newDoc: DocItem = {
          id: response.data._id,
          name: response.data.documentname,
          url: response.data.documenturl,
        };
        setDocuments((prev) => [...prev, newDoc]);
        setSelectedDoc(newDoc);
      }
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    }
  };

  // Edit/Update Document (PUT)
  const handleEditDocument = async (id: string, name: string, file: File | null) => {
    try {
      let downloadUrl = editingItem?.url || "";

      if (file) {
        const fileRef = ref(storage, `skills_documents/${skillId}/${phaseId}/${Date.now()}_${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        downloadUrl = await getDownloadURL(snapshot.ref);
      }

      const response = await apiClient.put(`/skills/documents/${id}`, {
        documentname: name,
        documenturl: downloadUrl,
      });

      if (response.data) {
        const updated = {
          id: response.data._id,
          name: response.data.documentname,
          url: response.data.documenturl,
        };
        setDocuments((prev) => prev.map((d) => (d.id === id ? updated : d)));
        if (selectedDoc?.id === id) {
          setSelectedDoc(updated);
        }
      }
    } catch (error) {
      console.error("Error editing document:", error);
      throw error;
    }
  };

  // Delete Document (DELETE)
  const handleDeleteDocument = async (doc: DocItem) => {
    if (window.confirm(`Are you sure you want to delete "${doc.name}"?`)) {
      try {
        await apiClient.delete(`/skills/documents/${doc.id}`);
        setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
        if (selectedDoc?.id === doc.id) {
          const remaining = documents.filter((d) => d.id !== doc.id);
          setSelectedDoc(remaining.length > 0 ? remaining[0] : null);
        }
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-0px)] bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Header Area */}
      <header className="flex items-center justify-between mb-6 shrink-0">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-colors">
                <LeftArrowIcon />
              </div>
            </button>
          </div>
          <Breadcrumbs
            items={[
              { label: "BizInfra", to: "/dashboard/bizinfra" },
              { label: "Skillset", to: "/dashboard/bizinfra/skillset" },
              { label: skillName, to: `/dashboard/bizinfra/skillset/${skillId}/projects` },
              { label: projectName, to: `/dashboard/bizinfra/skillset/${skillId}/projects/${projectId}` },
              { label: phaseName, to: `/dashboard/bizinfra/skillset/${skillId}/projects/${projectId}/${phaseId}` },
              { label: "Documents", to: `/dashboard/bizinfra/skillset/${skillId}/block?phaseId=${phaseId}` },
            ]}
          />
        </div>
      </header>

      {/* Main split sidebar layout: matching Process.tsx */}
      <div className="flex flex-1 gap-6 overflow-hidden mb-6">
        {/* Left Sidebar */}
        <div className="w-16 flex flex-col gap-8 py-4 z-50 overflow-visible shrink-0">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
              Blocks
            </span>
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mt-2" />
            ) : (
              documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  className="relative group flex items-center"
                  onMouseEnter={() => setHoveredBlock(i)}
                  onMouseLeave={() => setHoveredBlock(null)}
                  onClick={() => setSelectedDoc(doc)}
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`w-10 h-10 ${selectedDoc?.id === doc.id ? "bg-blue-600 dark:bg-blue-500 text-white" : "bg-gray-300 dark:bg-slate-800 text-gray-700 dark:text-gray-300"} rounded-lg shrink-0 cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-400 hover:text-white transition-colors flex items-center justify-center font-bold text-xs shadow-sm`}>
                    {i + 1}
                  </div>
                  <AnimatePresence>
                    {hoveredBlock === i && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        className="absolute left-14 flex items-center gap-0 z-100 pointer-events-none font-['Space_Grotesk']"
                      >
                        <div className="w-40 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center relative translate-x-1">
                          <div className="w-4 h-4 bg-white dark:bg-slate-800 rotate-45 absolute -left-1.5 border-l border-b border-gray-100 dark:border-slate-700"></div>
                          <div className="w-32 h-6 bg-gray-300 dark:bg-slate-700 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-gray-350 truncate px-2">{doc.name}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsAddModalOpen(true)}
              className="w-10 h-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-600 transition-colors shrink-0"
            >
              <PlusIcon />
            </motion.button>
          </div>

          {/* People Section */}
          {/* <div className="flex flex-col items-center gap-3 mt-auto">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
              People
            </span>
            {people.map((person) => (
              <div
                key={person.name}
                className="relative group flex items-center"
              >
                <motion.img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
                  className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-800 shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform shrink-0"
                  onMouseEnter={() => setHoveredPerson(person.name)}
                  onMouseLeave={() => setHoveredPerson(null)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
                <AnimatePresence>
                  {hoveredPerson === person.name && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="absolute left-12 flex items-center gap-0 z-100 pointer-events-none font-['Space_Grotesk']"
                    >
                      <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center relative translate-x-1">
                        <div className="w-3 h-3 bg-white dark:bg-slate-800 rotate-45 absolute -left-1 border-l border-b border-gray-100 dark:border-slate-700"></div>
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
                          className="w-6 h-6 rounded-full"
                          alt={person.name}
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
          </div> */}
        </div>

        {/* Right Sidebar: Main Viewer Panel */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col h-full">
          <div className="p-4 flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6 shrink-0 font-['Space_Grotesk']">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                  {selectedDoc?.name || "Documents"}
                </h1>
                {selectedDoc && (
                  <div className="flex gap-1 ml-2">
                    <button
                      onClick={() => {
                        setEditingItem(selectedDoc);
                        setIsEditModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      <EditIcon />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(selectedDoc)}
                      className="p-2 rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                )}
              </div>
              {selectedDoc && (
                <a
                  href={selectedDoc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-xs font-bold bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  Open in New Tab
                </a>
              )}
            </div>

            {selectedDoc ? (
              <div className="flex-1 w-full bg-gray-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-inner flex flex-col relative">
                {selectedDoc.url.toLowerCase().endsWith(".pdf") || selectedDoc.url.includes("firestore") || selectedDoc.url.includes("storage") ? (
                  <iframe
                    src={selectedDoc.url}
                    className="w-full h-full border-none bg-white"
                    title={selectedDoc.name}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                    <DocIcon filename={selectedDoc.name} className="w-16 h-16 mb-4" />
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">{selectedDoc.name}</p>
                    <a
                      href={selectedDoc.url}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/10 flex items-center gap-2"
                    >
                      Download File
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-6 text-center">
                <div className="w-16 h-16 rounded-3xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-4 text-gray-300 dark:text-gray-700">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 font-['Space_Grotesk'] mb-1">No Document Selected</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-['Inter']">Select a document from the sidebar or upload a new one to view it here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddDocModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddDocument}
      />

      <EditDocModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleEditDocument}
        item={editingItem}
      />
    </div>
  );
};

export default DocumentPage;
