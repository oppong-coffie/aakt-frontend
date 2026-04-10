import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "./Breadcrumbs";

/**
 * PageHeaderProps - Interface for the PageHeader component.
 */
interface PageHeaderProps {
  /** Breadcrumb items shown under the back arrow. */
  breadcrumbs?: { label: string; to: string }[];
  /** Legacy: top breadcrumb label. */
  breadcrumb?: string;
  /** Legacy: page title used as trailing breadcrumb. */
  title?: string;
  /** Legacy: destination for the top breadcrumb/back arrow. */
  previousPath?: string;
  /** Callback for when the search icon is clicked. */
  onSearch?: () => void;
  /** Callback for when the plus/add icon is clicked. */
  onAdd?: () => void;
  /** Additional custom components to render in the action bar. */
  extraActions?: React.ReactNode;
}

/**
 * Shared PageHeader Component - Standardized banner used across all modules.
 * Includes a back button, breadcrumbs, title, and action buttons.
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
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
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

const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  breadcrumb,
  title,
  previousPath,
  onSearch,
  onAdd,
  extraActions,
}) => {
  const computedBreadcrumbs =
    breadcrumbs && breadcrumbs.length > 0
      ? breadcrumbs
      : [
          ...(breadcrumb
            ? [
                {
                  label: breadcrumb,
                  to: previousPath ?? "/dashboard",
                },
              ]
            : []),
          ...(title
            ? [
                {
                  label: title,
                  to: location.pathname,
                },
              ]
            : []),
        ];
  const backTo = computedBreadcrumbs[0]?.to;

  return (
    <header className="flex items-center justify-between mb-6">
      <div className="flex gap-2">
        <div className="flex items-center gap-2">
          {backTo && (
            <Link to={backTo}>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors">
                <LeftArrowIcon />
              </div>
            </Link>
          )}
        </div>
        <Breadcrumbs items={computedBreadcrumbs} />
      </div>

      <div className="flex items-center gap-2">
        {onSearch && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onSearch}
            className="w-10 h-10 rounded-xl cursor-pointer hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <SearchIcon />
          </motion.div>
        )}

        {extraActions}

        {onAdd && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onAdd}
            className="w-10 h-10 rounded-xl cursor-pointer hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors flex items-center justify-center text-gray-400 dark:text-gray-500"
          >
            <PlusIcon />
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
