import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_URL } from "../../config/api";
import Breadcrumbs from "../../components/Breadcrumbs";
import EditItemModal from "../../components/EditItemModal";
import SearchModal from "../../components/SearchModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

/**
 * ProjectList Page (SaaS) - Displays a list of projects.
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
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-4xl shadow-2xl relative z-[100] p-8 font-['Space_Grotesk'] border border-gray-100 dark:border-slate-800"
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
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-gray-800 dark:group-hover:bg-gray-200 transition-colors text-black dark:group-hover:text-black">
                  <PlusIcon />
                </div>
                <span className="font-bold cursor-pointer">Blank</span>
              </button>

              <button
                onClick={() => onSelect("template")}
                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm group-hover:bg-gray-800 dark:group-hover:bg-gray-200 transition-colors text-black dark:group-hover:text-black">
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
                <span className="font-bold cursor-pointer">Template</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 text-gray-400 dark:text-gray-500 font-medium hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
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

const base = "/dashboard/portfolio/saas";
const ProjectList = () => {
  const [searchParams] = useSearchParams();
  const businessId = searchParams.get("businessId");
  
  const [activeTab, setActiveTab] = useState("Home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    image?: string | null;
  } | null>(null);

  const dropdownItems = [
    { id: "project", label: "Project" },
  ];

  // START:: Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      const urlId = businessId || "a";
      try {
        setIsLoading(true);
        const res = await fetch(`${API_URL}/portfolio/projects/${urlId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`
          }
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        
        const fetchedCards = data.map((proj: any) => ({
          id: proj._id || Date.now().toString(),
          label: proj.projectName || "Unnamed Project",
          to: `${base}/project/${proj._id}?businessId=${urlId}`,
          image: null as string | null,
        }));
        
        setCards(fetchedCards);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [businessId]);
  // END:: Fetch projects from API

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newCards = Array.from(cards);
    const [reorderedItem] = newCards.splice(result.source.index, 1);
    newCards.splice(result.destination.index, 0, reorderedItem);

    setCards(newCards);
  };

  const handleModeSelect = (mode: "blank" | "template") => {
    if (selectedType) {
      if (mode === "blank" && selectedType.id === "project") {
        setIsAddProjectModalOpen(true);
      } else {
        console.log(
          `Creating new ${selectedType.label} in ${mode} mode`,
        );
      }
    }
    setIsCreationModalOpen(false);
    setSelectedType(null);
  };

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

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-4 sm:p-8 relative overflow-hidden font-['Inter'] transition-colors duration-300">
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      {/* Header Area */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Link to="/dashboard/portfolio/saas/folder">
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors cursor-pointer">
                <LeftArrowIcon />
              </div>
            </Link>
          </div>
          <Breadcrumbs
            items={[
              { label: "Portfolio", to: "/dashboard/portfolio" },
              { label: "Business", to: "/dashboard/portfolio/saas" },
              { label: "Projects", to: "/dashboard/portfolio/saas/project" },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors cursor-pointer"
          >
            <SearchIcon />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors relative z-50 cursor-pointer"
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
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left group cursor-pointer"
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

      {/* Tabs */}
      <div className="flex items-center justify-center gap-8 mb-8">
        {["Home", "Archived"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-2 py-1 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabOperationSaaS"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Main Grid Area */}
      <div className="flex flex-wrap items-center justify-center gap-6 max-w-7xl mx-auto w-full flex-1 overflow-y-auto no-scrollbar">
        {activeTab === "Home" && (
          isLoading ? (
            <div className="text-gray-500 font-medium font-['Inter']">Loading projects...</div>
          ) : cards.length === 0 ? (
            <div className="text-gray-500 font-medium font-['Inter']">No projects found. Create one to get started!</div>
          ) : (
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="operation-cards" direction="horizontal">
                {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
                >
                  {cards.map((cat, index) => (
                    <Draggable key={cat.id} draggableId={cat.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-all ${
                            snapshot.isDragging ? "z-50" : ""
                          }`}
                        >
                          <Link to={cat.to} className="block relative group">
                            {/* Hover Actions */}
                            <div className="absolute -top-2 -right-0.5 flex opacity-0 group-hover:opacity-100 transition-opacity z-10 mt-2">
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setEditingItem(cat);
                                  setIsEditModalOpen(true);
                                }}
                                className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all scale-90 hover:scale-100 shadow-sm cursor-pointer"
                              >
                                <EditIcon />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  console.log("Delete", cat.id);
                                }}
                                className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all scale-90 hover:scale-100 shadow-sm cursor-pointer"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                            <motion.div
                              className={`flex flex-col items-center gap-3 w-full cursor-pointer p-6 rounded-[2.5rem] hover:bg-gray-100 dark:hover:bg-slate-900 transition-all font-bold ${
                                snapshot.isDragging
                                  ? "bg-white dark:bg-slate-800 shadow-lg"
                                  : ""
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="w-full aspect-16/10 bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:shadow-md transition-shadow flex items-center justify-center overflow-hidden">
                                {cat.image ? (
                                  <img
                                    src={cat.image}
                                    alt={cat.label}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="text-gray-300 dark:text-gray-600 text-4xl">
                                    {cat.label.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <h3 className="text-base font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-['Space_Grotesk']">
                                {cat.label}
                              </h3>
                            </motion.div>
                          </Link>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          )
        )}
        {activeTab === "Archived" && (
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            No archived projects found
          </div>
        )}
      </div>

      <CreationModeModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSelect={handleModeSelect}
        categoryLabel={selectedType?.label || "Item"}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        businessId={businessId}
        onSuccess={(newProject) => {
          setCards(prev => [
            ...prev,
            {
              id: newProject._id || Date.now().toString(),
              label: newProject.projectName || "New Project",
              to: `${base}/project/${newProject._id || Date.now()}`,
              image: null
            }
          ]);
        }}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        item={editingItem}
      />
    </div>
  );
};

export default ProjectList;
