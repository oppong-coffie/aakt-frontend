import { useState } from "react";
import { Outlet } from "react-router-dom";

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

  return (
    <div className="">
      {/* Header */}
      <header className="sm:px-8 px-4 flex items-center justify-between gap-4">
        <div className="font-bold text-lg sm:text-xl">Home</div>

        {/* Search Bar - Trigger */}
        <div
          onClick={() => setIsSearchOpen(true)}
          className="relative cursor-pointer rounded-lg w-10 h-10 flex items-center justify-center hover:bg-white hover:shadow-md transition-all group"
        >
          <div className="flex items-center text-gray-400 hover:text-blue-600 transition-colors">
            <SearchIcon />
          </div>
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
