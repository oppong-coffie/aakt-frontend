import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";

/**
 * Process Page (BizInfra) - A detailed view for managing business processes.
 * Includes a sidebar for quick access to Blocks and People involved in the process.
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
const Process = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);
  const [hoveredPerson, setHoveredPerson] = useState<string | null>(null);

  const skillBreadcrumb = id
    ? id.charAt(0).toUpperCase() + id.slice(1).replace(/-/g, " ")
    : "Business management";
  const skillPath = id
    ? `/dashboard/bizinfra/skillset/${id}`
    : "/dashboard/bizinfra/skillset";
  const processPath = id
    ? `/dashboard/bizinfra/skillset/${id}/process`
    : "/dashboard/bizinfra/skillset";

  const people = [
    { name: "Felix", seed: "Felix" },
    { name: "Aneka", seed: "Aneka" },
    { name: "Jace", seed: "Jace" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Header Area */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <div className="w-10 h-10 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-xl transition-colors">
                <LeftArrowIcon />
              </div>
            </button>
          </div>
          <Breadcrumbs
            items={[
              { label: "BizInfra", to: "/dashboard/bizinfra" },
              { label: "Skillset", to: "/dashboard/bizinfra/skillset" },
              { label: skillBreadcrumb, to: skillPath },
              { label: "Process", to: processPath },
            ]}
          />
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
          >
            <SearchIcon />
          </motion.button>
        </div>
      </header>

      <div className="flex flex-1 gap-6">
        {/* Left Sidebar (Blocks & People) */}
        <div className="w-16 flex flex-col gap-8 py-4 z-50">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              Blocks
            </span>
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="relative group flex items-center"
                onMouseEnter={() => setHoveredBlock(i)}
                onMouseLeave={() => setHoveredBlock(null)}
              >
                <div className="w-10 h-10 bg-gray-300 dark:bg-slate-700 rounded-lg shrink-0 cursor-pointer hover:bg-gray-400 dark:hover:bg-slate-600 transition-colors"></div>

                {/* Tooltip */}
                <AnimatePresence>
                  {hoveredBlock === i && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="absolute left-14 flex items-center gap-0 z-100 pointer-events-none"
                    >
                      <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center relative translate-x-1">
                        <div className="w-4 h-4 bg-white dark:bg-slate-800 rotate-45 absolute -left-1.5 border-l border-b border-gray-100 dark:border-slate-700"></div>
                        <div className="w-6 h-6 bg-gray-300 dark:bg-slate-600 rounded-md"></div>
                      </div>
                      <div className="bg-white dark:bg-slate-800 px-3 py-2.5 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 ml-1.5 whitespace-nowrap">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                          Stage {i}
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <button className="w-10 h-10 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-slate-100 hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors shrink-0">
              <PlusIcon />
            </button>
          </div>

          {/* People Section - Displays avatars of team members linked to this process. */}
          <div className="flex flex-col items-center gap-3 mt-auto">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
              People
            </span>
            {people.map((person) => (
              <div
                key={person.name}
                className="relative group flex items-center"
                onMouseEnter={() => setHoveredPerson(person.name)}
                onMouseLeave={() => setHoveredPerson(null)}
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
                  className="w-9 h-9 rounded-full border-2 border-white shadow-sm object-cover cursor-pointer hover:scale-105 transition-transform shrink-0"
                />

                {/* Person Tooltip */}
                <AnimatePresence>
                  {hoveredPerson === person.name && (
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -5 }}
                      className="absolute left-12 flex items-center gap-0 z-50 pointer-events-none"
                    >
                      <div className="w-9 h-9 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center relative translate-x-1">
                        <div className="w-3 h-3 bg-white dark:bg-slate-800 rotate-45 absolute -left-1 border-l border-b border-gray-100 dark:border-slate-700"></div>
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.seed}`}
                          className="w-6 h-6 rounded-full"
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
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden flex flex-col transition-colors">
          <div className="p-8">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight font-['Space_Grotesk']">
              Process
            </h1>
          </div>

          {/* Placeholder for process content logic later */}
          <div className="flex-1"></div>
        </div>
      </div>
    </div>
  );
};

export default Process;
