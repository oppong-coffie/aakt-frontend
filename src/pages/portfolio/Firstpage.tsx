import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../../config/api";
import Breadcrumbs from "../../components/Breadcrumbs";
import SearchModal from "../../components/SearchModal";

/**
 * Portfolio Main Page - Entry point for the portfolio module.
 * Displays various business sectors (SaaS, Ecommerce) and global search.
 */

// Icons
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

const PortfolioMain = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Home");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/portfolio`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch businesses");
        const json = await res.json();
        const businessList = Array.isArray(json.data) ? json.data : (Array.isArray(json) ? json : []);
        setBusinesses(businessList);
      } catch (error) {
        console.error("Error fetching businesses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  /**
   * Action items for the 'Add' dropdown, allowing users to initiate new business creation.
   */

  /**
   * Action items for the 'Add' dropdown, allowing users to initiate new business creation.
   */
  const dropdownItems = [
    {
      label: "Add New Business",
      action: () => navigate("/dashboard/portfolio/questions/name"),
    },
  ];

  return (
    <div className="flex flex-col bg-[#f0f0eb] dark:bg-slate-950 min-h-screen transition-colors duration-300">
      {/* Standardized Header */}
      <header className="flex justify-between items-center px-8 pt-6 mb-2">
        <Breadcrumbs
          items={[{ label: "Portfolio", to: "/dashboard/portfolio" }]}
        />
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsSearchOpen(true)}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <SearchIcon />
          </motion.button>
          <div className="relative">
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
                        onClick={() => {
                          item.action();
                          setIsDropdownOpen(false);
                        }}
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
        </div>
      </header>

      {/* Tabs Below Header */}
      <div className="flex items-center justify-center gap-8 px-8 mb-8">
        {["Home", "Team"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-2 py-1 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"
              />
            )}
          </motion.button>
        ))}
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl w-full">
          {activeTab === "Home" && (
            <>
              {isLoading ? (
                <div className="text-gray-500 font-medium">Loading businesses...</div>
              ) : businesses.length === 0 ? (
                <div className="text-gray-500 font-medium">No businesses found. Add one to get started!</div>
              ) : (
                businesses.map((business) => (
                  <Link key={business._id} to={`saas?businessId=${business._id}`} className="contents">
                    <motion.div
                      className="flex flex-col items-center gap-3 w-64 group cursor-pointer p-6 rounded-[2.5rem] hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-56 h-36 bg-white dark:bg-slate-900 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-800 group-hover:shadow-md flex items-center justify-center overflow-hidden transition-all duration-300 relative">
                        {business.businessImage ? (
                          <img
                            src={business.businessImage}
                            alt={business.businessName || business.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <>
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-900 opacity-50 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 select-none drop-shadow-sm">
                              {business.businessName?.charAt(0) || business.name?.charAt(0) || "B"}
                            </span>
                          </>
                        )}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {business.businessName || business.name || "Unnamed Business"}
                      </span>
                    </motion.div>
                  </Link>
                ))
              )}
            </>
          )}

          {activeTab === "Team" && (
            <div className="text-gray-500 text-sm">No team members found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PortfolioMain;
