import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import EditItemModal from "../../components/EditItemModal";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

/**
 * SearchIcon component - renders a standard search magnifying glass SVG.
 */
const SearchIcon = () => (
  <svg
    width="16"
    height="16"
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

const LeftArrow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-arrow-left-icon lucide-arrow-left"
  >
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    className="lucide lucide-plus-icon lucide-plus"
  >
    <path d="M5 12h14" />
    <path d="M12 5v14" />
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

/**
 * SearchModal component - provides a full-screen search interface with categorized results.
 * @param isOpen - boolean to control visibility
 * @param onClose - function to handle modal closure
 */
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
            className="fixed inset-0 bg-black/5 backdrop-blur-[2px] z-100"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-100 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col pointer-events-auto border border-gray-100 dark:border-slate-800"
            >
              {/* Search Header */}
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
                {/* Sidebar */}
                <div className="w-56 border-r border-gray-50 dark:border-slate-800 flex flex-col p-4 gap-1 overflow-y-auto no-scrollbar font-['Space_Grotesk']">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
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
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30 dark:bg-slate-950/30">
                  <div className="grid grid-cols-3 gap-4 font-['Space_Grotesk']">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                      <div
                        key={i}
                        className={`bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 h-32 shadow-sm transition-all hover:shadow-md cursor-pointer ${
                          i === 3 ? "col-span-1" : ""
                        }`}
                      >
                        {/* Placeholder for items */}
                      </div>
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

const addOptions = [
  { id: "process", label: "Process" },
  { id: "project", label: "Project" },
  { id: "block", label: "Block" },
];

/**
 * Skilset Page - The main landing page for the BizInfra module.
 * Displays a grid of skills and provides search/add functionality.
 */
const Skilset = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const plusButtonRef = useRef<HTMLDivElement | null>(null);
  const plusMenuRef = useRef<HTMLDivElement | null>(null);

  const [cards, setCards] = useState([
    {
      id: "python",
      title: "Python",
      description:
        "I want to open a new Company that's sells fresh cloves to big companies all over the world, How can i start the planning?",
      image: null as string | null,
    },
    {
      id: "business-management",
      title: "Business Management",
      description:
        "I want to open a new Company that's sells fresh cloves to big companies all over the world, How can i start the planning?",
      image: null as string | null,
    },
    {
      id: "backend-developer",
      title: "Backend Developer",
      description:
        "I want to open a new Company that's sells fresh cloves to big companies all over the world, How can i start the planning?",
      image: null as string | null,
    },
    {
      id: "product-designer",
      title: "Product Designer",
      description:
        "I want to open a new Company that's sells fresh cloves to big companies all over the world, How can i start the planning?",
      image: null as string | null,
    },
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    image?: string | null;
  } | null>(null);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
  };

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

  const handleSaveEdit = (
    id: string,
    newName: string,
    newImage: string | null,
  ) => {
    setCards((prev) =>
      prev.map((card) =>
        card.id === id ? { ...card, title: newName, image: newImage } : card,
      ),
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 relative overflow-hidden transition-colors duration-300">
      <header className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors">
                <LeftArrow />
              </div>
            </button>
          </div>
          <Breadcrumbs
            items={[
              { label: "BizInfra", to: "/dashboard/bizinfra" },
              { label: "Skillset", to: "/dashboard/bizinfra/skillset" },
            ]}
          />
        </div>

        {/* Search Bar - Trigger */}
        <div className="flex items-center gap-2 relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-xl cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <SearchIcon />
          </motion.div>
          <motion.div
            ref={plusButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlusOpen((open) => !open)}
            className="w-10 h-10 rounded-xl cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <PlusIcon />
          </motion.div>

          {isPlusOpen && (
            <div
              ref={plusMenuRef}
              className="absolute right-0 top-12 w-44 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden z-50 py-1"
            >
              {addOptions.map((option) => (
                <Link
                  key={option.id}
                  to={`/dashboard/bizinfra/skillset/${option.id}`}
                  onClick={() => setIsPlusOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group"
                >
                  <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    <PlusIcon />
                  </span>
                  {option.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Top Cards Grid */}
      <div className="flex flex-wrap items-center justify-center w-full flex-1 overflow-y-auto no-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="skillset-cards" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full px-4"
              >
                {cards.map((card, index) => (
                  <Draggable key={card.id} draggableId={card.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`transition-all ${
                          snapshot.isDragging ? "z-50" : ""
                        }`}
                      >
                        <Link
                          to={`/dashboard/bizinfra/skillset/${card.title.toLowerCase().replace(/\s+/g, "-")}`}
                          className="block relative group"
                        >
                          {/* Hover Actions - Positioned outside the inner box */}
                          <div className="absolute -top-2 -right-0.5 flex opacity-0 group-hover:opacity-100 transition-opacity z-10 mt-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setEditingItem({
                                  id: card.id,
                                  label: card.title,
                                  image: card.image,
                                });
                                setIsEditModalOpen(true);
                              }}
                              className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all scale-90 hover:scale-100 shadow-sm"
                            >
                              <EditIcon />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                console.log("Delete", card.id);
                              }}
                              className="p-2 rounded-xl bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all scale-90 hover:scale-100 shadow-sm"
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
                            {/* White Placeholder Box */}
                            <div className="w-full aspect-16/10 bg-white dark:bg-slate-800 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-700 group-hover:shadow-md transition-shadow flex flex-col items-center justify-center relative overflow-hidden">
                              {card.image ? (
                                <img
                                  src={card.image}
                                  alt={card.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="text-gray-300 dark:text-gray-600">
                                  {/* Optional: Add a subtle overlay or just let the bg change handle it */}
                                </div>
                              )}
                            </div>

                            {/* Content */}
                            <h3 className="text-lg sm:text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-['Space_Grotesk']">
                              {card.title}
                            </h3>
                            {/* Description removed as per request */}
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

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        item={editingItem}
      />
    </div>
  );
};

export default Skilset;
