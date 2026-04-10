import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const navItems = [
  {
    id: "Skillset",
    label: "Skillset",
    image: "/bizinfra/skill2.png",
    path: "/dashboard/bizinfra/skillset",
  },
  {
    id: "Network",
    label: "Network",
    image: "/bizinfra/network.png",
    path: "/dashboard/bizinfra/network",
  },
  {
    id: "Capital",
    label: "Capital",
    image: "/bizinfra/capital.png",
    path: "/dashboard/bizinfra/capital",
  },
  {
    id: "Intel",
    label: "Intel",
    image: "/bizinfra/intel2.png",
    path: "/dashboard/bizinfra/intel",
  },
  {
    id: "Reach",
    label: "Reach",
    image: "/bizinfra/reach.png",
    path: "/dashboard/bizinfra/reach",
  },
];

/**
 * BizInfra Main Layout - A wrapper component that provides the context
 * and outlet for all routes within the Business Infrastructure module.
 */
const Main = () => {
  return (
    <div className="relative">
      <main className="flex-1 overflow-x-scroll">
        <Outlet />
      </main>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-6 pt-4 bg-[#f0f0eb]/90 dark:bg-slate-900/90 backdrop-blur-md z-50 transition-colors duration-300">
        <div className="flex items-center gap-3 sm:gap-6 no-scrollbar max-w-full px-4 text-center">
          {navItems.map((item) => {
            const isSelected = item.id === "Intel";
            return (
              <Link key={item.id} to={item.path} className="contents">
                <motion.div
                  className="flex flex-col items-center gap-2 group shrink-0 cursor-pointer"
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center relative transition-all duration-300
                        ${isSelected ? "bg-yellow-600/10 dark:bg-yellow-500/10 border-2 border-yellow-600 ring-4 ring-yellow-600/5 shadow-md" : "bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-sm"}
                      `}
                  >
                    <img
                      src={item.image}
                      alt={item.label}
                      className="w-3/4 h-3/4 object-contain transform rotate-12 group-hover:rotate-0 transition-transform duration-300"
                    />
                  </div>
                  <span
                    className={`text-[9px] sm:text-[10px] font-bold font-['Inter'] ${isSelected ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300"}`}
                  >
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Main;
