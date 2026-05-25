import { useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

import SearchModal from "../../components/SearchModal";

/**
 * Main Homepage Layout - A wrapper for the Home module routes.
 * Includes a global search header and a main outlet for sub-pages.
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
    className="text-gray-400"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const MainHomepage = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useOutletContext<{
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  }>();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="">
      {/* Header */}
      <header className="sm:px-8 px-4 py-4 flex items-center justify-between gap-4">
        <div className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white">Home</div>

        <div className="flex items-center gap-2">
          {/* Search Bar - Trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="relative cursor-pointer rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:border-gray-200/50 dark:hover:border-slate-700"
            title="Search"
          >
            <SearchIcon />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="relative cursor-pointer rounded-xl w-10 h-10 flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm transition-all text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 border border-transparent hover:border-gray-200/50 dark:hover:border-slate-700"
            title={isDarkMode ? "Light Mode" : "Dark Mode"}
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="relative cursor-pointer rounded-xl w-10 h-10 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-950/20 hover:shadow-sm transition-all text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 border border-transparent hover:border-red-100/50 dark:hover:border-red-900/30"
            title="Sign Out"
          >
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
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default MainHomepage;
