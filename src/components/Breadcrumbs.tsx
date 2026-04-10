import { Link } from "react-router-dom";

type BreadcrumbItem = {
  label: string;
  to: string;
};

const Breadcrumbs = ({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) => {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={`flex flex-wrap items-center gap-2 text-xs sm:text-sm font-semibold ${className}`}
    >
      {items.map((item, index) => (
        <div key={`${item.to}-${index}`} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-600">→</span>
          )}
          <Link
            to={item.to}
            className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <span className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
              {item.label}
            </span>
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
