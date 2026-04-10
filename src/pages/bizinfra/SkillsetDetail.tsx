import { useParams, Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import EditItemModal from "../../components/EditItemModal";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
<<<<<<< HEAD
import { bizInfraService } from "../../api/bizInfra.service";
=======
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

/**
 * SkillsetDetail Component - Displays the specific categories (Department, Operation, etc.)
 * for a selected skill within the BizInfra module.
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
    className=""
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
    className=""
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

const LeftArrow = () => (
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
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
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
    "Blocks",
    "Processes",
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
            className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-[2px] z-100"
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
                  placeholder="Search skills, projects, processess, projects, blocks, operations"
                />
              </div>

              <div className="flex flex-1 overflow-hidden">
                <div className="w-56 border-r border-gray-50 dark:border-slate-800 flex flex-col p-4 gap-1 overflow-y-auto no-scrollbar">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
<<<<<<< HEAD
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all font-['Inter'] ${activeCategory === category
                        ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
=======
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all font-['Inter'] ${
                        activeCategory === category
                          ? "bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-400"
                          : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 dark:bg-slate-950/30">
                  <div className="grid grid-cols-3 gap-4 font-['Space_Grotesk']">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 h-32 shadow-sm transition-all hover:shadow-md cursor-pointer"
                      ></div>
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
            className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-4xl shadow-2xl relative z-100 p-8 border border-gray-100 dark:border-slate-800"
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                New {categoryLabel}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                How would you like to start?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onSelect("blank")}
                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-blue-500 transition-colors">
                  <PlusIcon />
                </div>
                <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
                  Blank
                </span>
              </button>

              <button
                onClick={() => onSelect("template")}
                className="flex flex-col items-center gap-4 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 hover:bg-blue-600 dark:hover:bg-blue-600 hover:text-white transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-blue-500 transition-colors">
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
                <span className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-white">
                  Template
                </span>
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

const SkillsetDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreationModalOpen, setIsCreationModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const plusButtonRef = useRef<HTMLDivElement | null>(null);
  const plusMenuRef = useRef<HTMLDivElement | null>(null);

<<<<<<< HEAD
  const [categories, setCategories] = useState<{ id: string; label: string; image: string | null }[]>([]);
=======
  const [categories, setCategories] = useState([
    { id: "project", label: "Project", image: null as string | null },
    { id: "process", label: "Process", image: null as string | null },
    { id: "block", label: "Block", image: null as string | null },
  ]);
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    image?: string | null;
  } | null>(null);

<<<<<<< HEAD
  // Fetch bizinfra items on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        const items = await bizInfraService.getItems('skillset');
        setCategories(items.map(i => ({ id: i._id, label: i.name, image: i.imageUrl || null })));
      } catch (err) {
        console.error("Failed to load skillsets", err);
      }
    };
    loadItems();
  }, []);

=======
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(categories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCategories(items);
  };

  const skillName = id
    ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")
    : "Skillset";
  const skillPath = id
    ? `/dashboard/bizinfra/skillset/${id}`
    : "/dashboard/bizinfra/skillset";

  useEffect(() => {
    if (!isPlusOpen) return;
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        plusMenuRef.current?.contains(target) ||
        plusButtonRef.current?.contains(target)
      ) {
        return;
      }
      setIsPlusOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isPlusOpen]);

<<<<<<< HEAD
  const handleSaveEdit = async (
=======
  const handleSaveEdit = (
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
    id: string,
    newName: string,
    newImage: string | null,
  ) => {
<<<<<<< HEAD
    try {
      const updated = await bizInfraService.updateItem(id, { name: newName, imageUrl: newImage || undefined });
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, label: updated.name, image: updated.imageUrl || null } : cat,
        ),
      );
    } catch (err) {
      console.error("Failed to update item", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await bizInfraService.deleteItem(id);
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error("Failed to delete item", err);
    }
  };

  const handleModeSelect = async (mode: "blank" | "template") => {
    try {
      // In a real flow, you might show a different modal. For now we just create a generic one
      const newItem = await bizInfraService.createItem('skillset', {
        name: selectedCategory?.label || `New ${mode} item`,
        description: `Created via ${mode} mode`
      });
      setCategories(prev => [...prev, { id: newItem._id, label: newItem.name, image: newItem.imageUrl || null }]);
    } catch (err) {
      console.error("Failed to create item", err);
=======
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, label: newName, image: newImage } : cat,
      ),
    );
  };

  const handleModeSelect = (mode: "blank" | "template") => {
    if (selectedCategory) {
      // Example: Navigate to a creation page with mode and category info
      console.log(
        `Creating new ${selectedCategory.label} in ${mode} mode for skill ${id}`,
      );
      // You would typically use a navigation hook here, e.g., navigate(...)
      // For now, just close the modal
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
    }
    setIsCreationModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Header Area */}
      <header className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-colors">
                <LeftArrow />
              </div>
            </button>
          </div>
          <Breadcrumbs
            items={[
              { label: "BizInfra", to: "/dashboard/bizinfra" },
              { label: "Skillset", to: "/dashboard/bizinfra/skillset" },
              { label: skillName, to: skillPath },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-xl cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <SearchIcon />
          </motion.div>
          <motion.div
            ref={plusButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlusOpen((open) => !open)}
            className="w-10 h-10 rounded-xl cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <PlusIcon />
          </motion.div>

          {isPlusOpen && (
            <div
              ref={plusMenuRef}
              className="absolute right-0 top-12 w-44 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden z-50"
            >
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setIsCreationModalOpen(true);
                    setIsPlusOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-black dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <PlusIcon />
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Categories Grid - Displays links to deeper levels like Department, Project, etc. */}
      <div className="flex flex-wrap items-center justify-center gap-6 max-w-7xl mx-auto w-full flex-1 overflow-y-auto no-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="skillset-detail-cards" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full"
              >
                {categories.map((cat, index) => (
                  <Draggable key={cat.id} draggableId={cat.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
<<<<<<< HEAD
                        className={`transition-all ${snapshot.isDragging ? "z-50" : ""
                          }`}
=======
                        className={`transition-all ${
                          snapshot.isDragging ? "z-50" : ""
                        }`}
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
                      >
                        <Link
                          to={`/dashboard/bizinfra/skillset/${id}/${cat.id}`}
                          className="block relative group"
                        >
                          {/* Hover Actions - Positioned outside the inner box */}
                          <div className="absolute -top-2 -right-0.5 flex opacity-0 group-hover:opacity-100 transition-opacity z-10 mt-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingItem(cat);
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all scale-90 hover:scale-100"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
<<<<<<< HEAD
                                handleDelete(cat.id);
=======
                                console.log("Delete", cat.id);
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
                              }}
                              className="p-2 rounded-xl hover:bg-white dark:hover:bg-slate-800 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all scale-90 hover:scale-100"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                          <motion.div
<<<<<<< HEAD
                            className={`flex flex-col items-center gap-3 w-full cursor-pointer p-6 rounded-[2.5rem] hover:bg-gray-100 dark:hover:bg-slate-900/50 transition-all ${snapshot.isDragging
                              ? "bg-white dark:bg-slate-800 shadow-lg"
                              : ""
                              }`}
=======
                            className={`flex flex-col items-center gap-3 w-full cursor-pointer p-6 rounded-[2.5rem] hover:bg-gray-100 dark:hover:bg-slate-900/50 transition-all ${
                              snapshot.isDragging
                                ? "bg-white dark:bg-slate-800 shadow-lg"
                                : ""
                            }`}
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-full aspect-16/10 bg-white dark:bg-slate-900 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-800 group-hover:shadow-md transition-shadow flex items-center justify-center overflow-hidden">
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.label}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-300">
                                  {/* Icon placeholder */}
                                </div>
                              )}
                            </div>
                            <h3 className="text-base font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              <span className="text-black dark:text-gray-100">
                                {cat.label}
                              </span>
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
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      <CreationModeModal
        isOpen={isCreationModalOpen}
        onClose={() => setIsCreationModalOpen(false)}
        onSelect={handleModeSelect}
        categoryLabel={selectedCategory?.label || ""}
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

export default SkillsetDetail;
