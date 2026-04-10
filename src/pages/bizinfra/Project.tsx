import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/Breadcrumbs";

import EditItemModal from "../../components/EditItemModal";

/**
 * Project Page (BizInfra) - Displays the phases of a selected project.
 * Allows users to navigate into specific phases.
 */

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
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
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

const addOptions = [
  { id: "process", label: "Process" },
  { id: "project", label: "Project" },
  { id: "block", label: "Block" },
];

const LongArrow = () => (
  <div className="mx-6 sm:mx-8 flex items-center">
    <svg width="70" height="18" viewBox="0 0 80 18" fill="none">
      <path
        d="M0 9H72"
        stroke="currentColor"
        className="text-gray-400 dark:text-gray-600"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M72 3L80 9L72 15"
        stroke="currentColor"
        className="text-gray-400 dark:text-gray-600"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

type PhaseCard = { id: string; label: string; to: string };

function PhaseItem({
  card,
  isLast,
  onGo,
  onRename,
  onDelete,
}: {
  card: PhaseCard;
  isLast: boolean;
  onGo: (to: string) => void;
  onRename: (card: PhaseCard) => void;
  onDelete: (card: PhaseCard) => void;
}) {
  return (
    <div className="flex items-center">
      <div className="relative group">
        {/* Phase label */}
        <button
          type="button"
          onClick={() => onGo(card.to)}
          className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-['Space_Grotesk']"
        >
          {card.label}
        </button>

        {/* Hover Actions (Edit/Delete) - Positioned above */}
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-white/90 dark:bg-slate-800/90 rounded-lg p-1 shadow-sm border border-gray-100 dark:border-slate-700">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRename(card);
            }}
            className="p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <EditIcon />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(card);
            }}
            className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Long arrow between phases */}
      {!isLast && <LongArrow />}
    </div>
  );
}

const Project = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [cards, setCards] = useState([
    {
      id: "phase1",
      label: "Phase 1",
      to: `/dashboard/bizinfra/skillset/${id}/project/phase1`,
    },
    {
      id: "phase2",
      label: "Phase 2",
      to: `/dashboard/bizinfra/skillset/${id}/project/phase2`,
    },
    {
      id: "phase3",
      label: "Phase 3",
      to: `/dashboard/bizinfra/skillset/${id}/project/phase3`,
    },
  ]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    image?: string | null;
  } | null>(null);

  const handleSaveEdit = (id: string, newName: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, label: newName } : c)),
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this phase?")) {
      const newCards = cards.filter((c) => c.id !== id);
      setCards(newCards);
    }
  };

  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const plusButtonRef = useRef<HTMLButtonElement | null>(null);
  const plusMenuRef = useRef<HTMLDivElement | null>(null);
  const skillName = id
    ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")
    : "Skillset";
  const skillPath = id
    ? `/dashboard/bizinfra/skillset/${id}`
    : "/dashboard/bizinfra/skillset";
  const projectPath = id
    ? `/dashboard/bizinfra/skillset/${id}/project`
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
  }, [isPlusOpen]);

  return (
    <div className="flex flex-col min-h-[calc(100vh-100px)] bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Header Area */}
      <header className="flex items-center justify-between mb-6">
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
              { label: "Project", to: projectPath },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            <SearchIcon />
          </motion.button>
          <motion.button
            ref={plusButtonRef}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlusOpen((open) => !open)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            <PlusIcon />
          </motion.button>

          {isPlusOpen && (
            <div
              ref={plusMenuRef}
              className="absolute right-0 top-12 w-44 rounded-xl border border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg overflow-hidden z-50"
            >
              {addOptions.map((option) => (
                <Link
                  key={option.id}
                  to={`/dashboard/bizinfra/skillset/${id}/${option.id}`}
                  onClick={() => setIsPlusOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-black dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <PlusIcon />
                  {option.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Phases Flow */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="flex items-center justify-center flex-wrap">
          {cards.map((card, i) => (
            <PhaseItem
              key={card.id}
              card={card}
              isLast={i === cards.length - 1}
              onGo={(to) => navigate(to)}
              onRename={(c) => {
                setEditingItem(c);
                setIsEditModalOpen(true);
              }}
              onDelete={(c) => {
                handleDelete(c.id);
              }}
            />
          ))}

          {/* Plus button after Phase 3 */}
          <button
            type="button"
            onClick={() => setIsPlusOpen(true)}
            className="ml-12 w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition"
            aria-label="Add Phase"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        item={editingItem}
        hideImage={true}
      />
    </div>
  );
};

export default Project;
