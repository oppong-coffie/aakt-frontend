import { AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";

/**
 * BizInfra First Page - The entry point for the Business Infrastructure module.
 * Displays large cards representing different sectors like Skillset, Network, and Capital.
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
                <div className="w-56 border-r border-gray-50 dark:border-slate-800 flex flex-col p-4 gap-1 overflow-y-auto no-scrollbar">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all font-['Inter'] ${
                        activeCategory === category
                          ? "bg-blue-600/10 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
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
                        className={`bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-800 rounded-2xl p-4 h-32 shadow-sm transition-all hover:shadow-md cursor-pointer ${
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

const Firstpage = () => {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [cards, setCards] = useState([
    {
      id: "Skillset",
      label: "Skillset",
      image: "/bizinfra/skill2.png",
      link: "skillset",
    },
    {
      id: "Network",
      label: "Network",
      image: "/bizinfra/network.png",
      link: "network",
    },
    {
      id: "Capital",
      label: "Capital",
      image: "/bizinfra/capital.png",
      link: "capital",
    },
    {
      id: "Intel",
      label: "Intel",
      image: "/bizinfra/intel2.png",
      link: "intel",
    },
    {
      id: "Reach",
      label: "Reach",
      image: "/bizinfra/reach.png",
      link: "reach",
    },
  ]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(cards);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setCards(items);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] bg-[#f0f0eb] dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between px-8 pl-6">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors">
                <LeftArrow />
              </div>
            </button>
          </div>
          <Breadcrumbs
            items={[{ label: "BizInfra", to: "/dashboard/bizinfra" }]}
          />
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-xl cursor-pointer text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center"
          >
            <SearchIcon />
          </motion.div>
        </div>
      </header>

      {/* cards */}
      <div className="h-[calc(100vh-150px)] w-full flex flex-col justify-center items-center">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="bizinfra-cards" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-5 gap-6 px-4"
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
                        <Link to={card.link} className="block">
                          <div
                            className={`flex flex-col items-center group cursor-pointer transition-all ${
                              snapshot.isDragging ? "scale-105" : ""
                            }`}
                          >
                            {/* Card Container */}
                            <div
                              className={`w-full aspect-square bg-gray-100/50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-gray-200/50 dark:border-slate-700/50 flex items-center justify-center relative overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md ${
                                snapshot.isDragging
                                  ? "bg-white dark:bg-slate-700 shadow-xl"
                                  : ""
                              }`}
                            >
                              {/* Image Shape */}
                              <img
                                src={card.image}
                                alt={card.label}
                                draggable={false}
                                className={`object-cover w-3/4 relative transform transition-transform duration-500 ${
                                  snapshot.isDragging
                                    ? "rotate-0"
                                    : "rotate-12 group-hover:rotate-0"
                                }`}
                              />

                              {/* Inner Shine/Overlay if needed for depth */}
                              <div className="absolute inset-0 bg-linear-to-tr from-black/10 via-transparent to-white/20 pointer-events-none"></div>
                            </div>

                            {/* Label */}
                            <span
                              className={`mt-4 text-sm font-semibold transition-colors font-['Space_Grotesk'] ${
                                snapshot.isDragging
                                  ? "text-blue-600 dark:text-blue-400"
                                  : "text-gray-800 dark:text-gray-200"
                              }`}
                            >
                              {card.label}
                            </span>
                          </div>
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

      {/* search modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default Firstpage;
