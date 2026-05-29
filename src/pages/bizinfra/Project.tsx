import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumbs from "../../components/Breadcrumbs";
import EditItemModal from "../../components/EditItemModal";
import apiClient from "../../api/apiClient";

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
  onRename,
  onDelete,
}: {
  card: PhaseCard;
  isLast: boolean;
  onRename: (card: PhaseCard) => void;
  onDelete: (card: PhaseCard) => void;
}) {
  return (
    <div className="flex items-center">
      <div className="relative group">
        {/* Phase label */}
        <Link
          to={card.to}
          className="text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-['Space_Grotesk']"
        >
          {card.label}
        </Link>

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
/* ─── Add Phase Modal ─── */

const AddPhaseModal = ({
  isOpen,
  onClose,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string) => Promise<void> | void;
}) => {
  const [name, setName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setName("");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      onClose();
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
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl relative z-100 p-8 font-['Inter'] border border-gray-100 dark:border-slate-800"
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-['Space_Grotesk']">
              Add New Phase
            </h3>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Phase Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/20 outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  placeholder="e.g. Setup and Configuration"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!name.trim()}
                  className="flex-1 px-4 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/10 dark:shadow-blue-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Phase
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Project = () => {
  const navigate = useNavigate();
  const { id: skillId, projectId } = useParams<{ id: string; projectId: string }>();

  const [cards, setCards] = useState<PhaseCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [skillName, setSkillName] = useState("Skill");
  const [projectName, setProjectName] = useState("Project");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id: string;
    label: string;
    image?: string | null;
  } | null>(null);

  // Fetch the skill name for breadcrumbs
  useEffect(() => {
    const fetchSkillName = async () => {
      try {
        const response = await apiClient.get(`/skills`);
        if (response.data) {
          const skill = response.data.find((s: any) => s._id === skillId);
          if (skill) {
            setSkillName(skill.skillname);
          }
        }
      } catch (error) {
        console.error("Error fetching skill name:", error);
      }
    };
    if (skillId) fetchSkillName();
  }, [skillId]);

  // Fetch project name and phases on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch project details
        const projectRes = await apiClient.get(`/skills/projects/${projectId}`);
        if (projectRes.data) {
          setProjectName(projectRes.data.projectname);
        }

        // Fetch phases
        const phasesRes = await apiClient.get("/skills/phases", {
          params: { projectid: projectId }
        });
        if (phasesRes.data) {
          const loadedPhases = phasesRes.data.map((p: any) => ({
            id: p._id,
            label: p.phasename,
            to: `/dashboard/bizinfra/skillset/${skillId}/projects/${projectId}/${p._id}`,
          }));
          setCards(loadedPhases);
        }
      } catch (error) {
        console.error("Error fetching project data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (projectId) {
      fetchData();
    }
  }, [projectId, skillId]);

  const handleAddPhase = async (name: string) => {
    try {
      const response = await apiClient.post("/skills/phases", {
        projectid: projectId,
        phasename: name,
      });
      if (response.data) {
        const saved = response.data;
        setCards((prev) => [
          ...prev,
          {
            id: saved._id,
            label: saved.phasename,
            to: `/dashboard/bizinfra/skillset/${skillId}/projects/${projectId}/${saved._id}`,
          },
        ]);
      }
    } catch (error) {
      console.error("Error creating phase:", error);
    }
  };

  const handleSaveEdit = async (id: string, newName: string) => {
    try {
      const response = await apiClient.put(`/skills/phases/${id}`, {
        phasename: newName,
      });
      if (response.data) {
        const updated = response.data;
        setCards((prev) =>
          prev.map((c) => (c.id === id ? { ...c, label: updated.phasename } : c)),
        );
      }
    } catch (error) {
      console.error("Error updating phase:", error);
    }
  };

  const handleDelete = async (phase: PhaseCard) => {
    if (
      window.confirm(
        "Are you sure you want to delete this phase and all its associated tasks and documents?"
      )
    ) {
      try {
        await apiClient.delete(`/skills/phases/${phase.id}`);
        setCards((prev) => prev.filter((c) => c.id !== phase.id));
      } catch (error) {
        console.error("Error deleting phase:", error);
      }
    }
  };

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
              {
                label: skillName,
                to: `/dashboard/bizinfra/skillset/${skillId}/projects`,
              },
              { label: projectName, to: `/dashboard/bizinfra/skillset/${skillId}/projects/${projectId}` },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsAddModalOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            <PlusIcon />
          </motion.button>
        </div>
      </header>

      {/* Phases Flow */}
      <div className="flex-1 flex items-center justify-center w-full">
        {isLoading ? (
          <div className="flex items-center justify-center gap-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            <span className="text-gray-500 dark:text-gray-400 font-['Space_Grotesk']">Loading phases...</span>
          </div>
        ) : cards.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="text-gray-400 dark:text-gray-500 font-['Space_Grotesk'] text-lg">
              No phases found. Click the plus button above or below to add your first phase!
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/10 flex items-center gap-2"
            >
              <PlusIcon />
              <span>Create Phase</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-wrap">
            {cards.map((card, i) => (
              <PhaseItem
                key={card.id}
                card={card}
                isLast={i === cards.length - 1}
                onRename={(c) => {
                  setEditingItem(c);
                  setIsEditModalOpen(true);
                }}
                onDelete={(c) => {
                  handleDelete(c);
                }}
              />
            ))}

            {/* Plus button after Phase flow */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="ml-12 w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-md transition"
              aria-label="Add Phase"
            >
              <PlusIcon />
            </button>
          </div>
        )}
      </div>

      <AddPhaseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPhase}
      />

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
