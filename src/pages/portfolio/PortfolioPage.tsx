import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "../../components/Breadcrumbs";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { portfolioService } from "../../api/portfolio.service";

/**
 * Portfolio Page - Displays a category-specific view (e.g., SaaS, Ecommerce)
 * with departments and team tabs.
 */

// Icons
const BackIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5M12 19L5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 5V19M5 12H19"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PortfolioPage = () => {
  const [activeTab, setActiveTab] = useState("Home");
  const { category } = useParams();
  const navigate = useNavigate();

  // Capitalize the first letter of the category for the title
  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "Portfolio";

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownItems = [
    { label: "Add Department" },
    { label: "Add Operation" },
    { label: "Project" },
    { label: "Process" },
    { label: "Block" },
  ];

  const [cards, setCards] = useState<{ id: string; title: string; order: number }[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        const cat = category || 'saas';
        // For simplicity at root level, fetching departments
        const items = await portfolioService.getItems(cat, 'department');
        setCards(items.map(i => ({ id: i._id, title: i.name, order: i.order })).sort((a, b) => a.order - b.order));
      } catch (err) {
        console.error("Failed to load portfolio items", err);
      }
    };
    loadItems();
  }, [category]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const reorderedCards = Array.from(cards);
    const [removed] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, removed);

    // Update state optimistically
    const updatedCards = reorderedCards.map((card, idx) => ({ ...card, order: idx }));
    setCards(updatedCards);

    try {
      await portfolioService.reorderItems(updatedCards.map(c => ({ id: c.id, order: c.order })));
    } catch (err) {
      console.error("Failed to save reorder", err);
    }
  };

  const handleCreateNew = async (label: string) => {
    setIsDropdownOpen(false);
    try {
      const cat = category || 'saas';
      let itemType = 'department';
      if (label.includes('Operation')) itemType = 'operation';
      else if (label.includes('Project')) itemType = 'project';
      else if (label.includes('Process')) itemType = 'process';
      else if (label.includes('Block')) itemType = 'block';

      const newItem = await portfolioService.createItem(cat, {
        itemType: itemType as any,
        name: `New ${label}`,
        order: cards.length
      });
      setCards(prev => [...prev, { id: newItem._id, title: newItem.name, order: newItem.order }]);
    } catch (err) {
      console.error("Failed to create item", err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-8 transition-colors duration-300">
      {/* Header */}
      <header className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            <BackIcon />
          </motion.button>
          <Breadcrumbs
            items={[
              { label: "Portfolio", to: "/dashboard/portfolio" },
              { label: title, to: `/dashboard/portfolio/${category}` },
            ]}
          />
        </div>

        <div className="flex items-center gap-4 relative">
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
                  {dropdownItems.map((item, i) => (
                    <button
                      key={i}
                      onClick={() => handleCreateNew(item.label)}
                      className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                      <span className="text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        <PlusIcon />
                      </span>
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 tracking-tight">
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
                layoutId="activeTab2"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Grid Content */}
      <div className="flex flex-wrap items-center justify-center gap-6 max-w-7xl mx-auto w-full">
        {activeTab === "Home" && (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="portfolio-cards" direction="horizontal">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex flex-wrap items-center justify-center gap-6 w-full"
                >
                  {cards.map((card, index) => (
                    <Draggable
                      key={card.id}
                      draggableId={card.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`transition-all ${snapshot.isDragging ? "z-50" : ""
                            }`}
                        >
                          <motion.div
                            className={`flex flex-col items-center gap-3 w-64 group cursor-pointer p-6 rounded-[2.5rem] hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-bold ${snapshot.isDragging
                              ? "bg-white dark:bg-slate-900 shadow-lg"
                              : ""
                              }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="w-56 h-36 bg-white dark:bg-slate-900 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-800 group-hover:shadow-md transition-shadow"></div>
                            <span className="text-gray-800 dark:text-gray-200 font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {card.title}
                            </span>
                          </motion.div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
        {activeTab === "Team" && (
          <div className="text-gray-500 text-sm">No team members found</div>
        )}
      </div>
    </div>
  );
};

export default PortfolioPage;
