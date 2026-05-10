import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { API_URL } from "../../config/api";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../config/firebase";

/**
 * Block Page (SaaS) - A detailed view for managing business blocks within a SaaS context.
 * Features a sidebar for Blocks and People, mirroring the BizInfra Process/Block views.
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

const SearchModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "People",
    "Documents",
    "Tasks",
    "Projects",
    "Operations",
    "Departments",
    "Business",
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-100"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4 z-100 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto border border-gray-100 dark:border-slate-800"
            >
              <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
                <SearchIcon />
                <input
                  type="text"
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-lg font-['Inter']"
                  placeholder="Search skills, projects, tasks, projects, documents, operations"
                />
              </div>

              <div className="flex flex-1 overflow-hidden font-['Space_Grotesk']">
                <div className="w-56 border-r border-gray-50 dark:border-slate-800 flex flex-col p-4 gap-1 overflow-y-auto no-scrollbar">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeCategory === category
                          ? "bg-blue-600/10 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 dark:bg-slate-950/30">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
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
        </>
      )}
    </AnimatePresence>
  );
};

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
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-4xl shadow-2xl relative z-100 p-8 border border-gray-100 dark:border-slate-800 font-['Space_Grotesk']"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                New {categoryLabel}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-['Inter']">
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

const AddBusinessDocumentModal = ({
  isOpen,
  onClose,
  businessId,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  businessId: string;
  onSuccess: () => void;
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

      onSuccess();
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

              <button
                onClick={handleSubmit}
                disabled={loading || !name || !file}
                className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Uploading..." : "Add Document"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

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

const Block = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const [activeTab, setActiveTab] = useState("Home");
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [selectedType, setSelectedType] = useState<{
    id: string;
    label: string;
  } | null>(null);

  const fetchDocs = async () => {
    if (!businessId) return;
    try {
      const res = await fetch(`${API_URL}/businessdocuments/${businessId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      const json = await res.json();
      const docs = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
      setDocuments(docs);
      if (docs.length > 0 && !selectedDoc) setSelectedDoc(docs[0]);
    } catch (err) {
      console.error("Failed to fetch documents", err);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, [businessId]);

  const people = [
    { name: "Adam fatal", seed: "Adam" },
    { name: "Aneka", seed: "Aneka" },
    { name: "Jace", seed: "Jace" },
  ];

  const dropdownItems = [
    { id: "project", label: "Project" },
    { id: "process", label: "Tasks" },
    { id: "block", label: "Documents" },
  ];

  const handleModeSelect = (mode: "blank" | "template") => {
    if (selectedType && selectedType.id === "block" && mode === "blank") {
      setIsAddDocModalOpen(true);
    } else if (selectedType) {
      console.log(`Creating ${selectedType.label} in ${mode} mode`);
    }
    setIsCreationModalOpen(false);
    setSelectedType(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden font-['Inter'] transition-colors duration-300">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      {/* Header Area */}
      <header className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Link to="/dashboard/portfolio/saas">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors">
                <LeftArrowIcon />
              </div>
            </Link>
          </div>
          <Breadcrumbs
            items={[
              { label: "Portfolio", to: "/dashboard/portfolio" },
              { label: "SaaS", to: "/dashboard/portfolio/saas" },
              { label: "Documents", to: "/dashboard/portfolio/saas/block" },
            ]}
          />
        </div>
        <div className="flex items-center gap-2 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
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
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight uppercase font-['Space_Grotesk']">
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

      {/* Tabs */}
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
                layoutId="activeTabBlock"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      <div className="flex flex-1 gap-6">
        {/* Left Sidebar */}
        <div className="w-16 flex flex-col gap-8 py-4 z-50 overflow-visible">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter">
              Blocks
            </span>
            {documents.map((doc, i) => (
              <motion.div
                key={doc._id || i}
                className="relative group flex items-center"
                onMouseEnter={() => setHoveredBlock(i)}
                onMouseLeave={() => setHoveredBlock(null)}
                onClick={() => setSelectedDoc(doc)}
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className={`w-10 h-10 ${selectedDoc?._id === doc._id ? "bg-blue-600 dark:bg-blue-500" : "bg-gray-300 dark:bg-slate-800"} rounded-lg shrink-0 cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors flex items-center justify-center text-white font-bold text-xs`}>
                  {i + 1}
                </div>
                <AnimatePresence>
                  {hoveredBlock === i && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="absolute left-14 flex items-center gap-0 z-100 pointer-events-none"
                    >
                      <div className="w-40 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center relative translate-x-1">
                        <div className="w-4 h-4 bg-white dark:bg-slate-800 rotate-45 absolute -left-1.5 border-l border-b border-gray-100 dark:border-slate-700"></div>
                        <div className="w-32 h-6 bg-gray-300 dark:bg-slate-700 rounded-md flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-gray-300 truncate px-2">{doc.name}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSelectedType({ id: "block", label: "Documents" });
                setIsCreationModalOpen(true);
              }}
              className="w-10 h-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <PlusIcon />
            </motion.button>
          </div>

          {/* People Section - Displays team members associated with this block. */}
          <div className="flex flex-col items-center gap-3 mt-auto">
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
                      className="absolute left-12 flex items-center gap-0 z-100 pointer-events-none"
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
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col">
          <div className="p-8 flex-1 flex flex-col">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight font-['Space_Grotesk'] mb-6">
              {selectedDoc?.name || "Business Document"}
            </h1>
            {selectedDoc ? (
              <div className="flex-1 w-full bg-gray-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-inner flex flex-col">
                <iframe 
                  src={selectedDoc.url} 
                  className="w-full h-full border-none"
                  title={selectedDoc.name}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="w-16 h-16 rounded-2xl bg-gray-50 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                </div>
                <p className="text-sm font-medium">Select a document to view</p>
              </div>
            )}
            {activeTab === "Team" && (
              <div className="absolute inset-0 bg-white dark:bg-slate-900 p-8 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
                Team content goes here...
              </div>
            )}
          </div>
        </div>
      </div>

      <CreationModeModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSelect={handleModeSelect}
        categoryLabel={selectedType?.label || "Documents"}
      />

      <AddBusinessDocumentModal
        isOpen={isAddDocModalOpen}
        onClose={() => setIsAddDocModalOpen(false)}
        businessId={businessId || ""}
        onSuccess={() => {
          fetchDocs();
          console.log("Document added successfully");
        }}
      />
    </div>
  );
};

export default Block;
