import React from "react";

/**
 * PageLayoutProps - Interface for the PageLayout component.
 */
interface PageLayoutProps {
  /** The content to be rendered inside the layout. */
  children: React.ReactNode;
  /** Optional additional CSS classes to apply to the layout wrapper. */
  className?: string;
}

/**
 * Shared PageLayout Component - Enforces consistent background, padding,
 * and flex behavior for all top-level page views.
 */

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  className = "",
}) => {
  return (
    // Applied fix:
    // - bg-[#f0f0eb] matching user design requirements
    // - p-4 sm:p-8 consistent padding
    // - h-full ensuring full height for flex containers
    // - overflow-hidden to prevent body scroll, assuming inner content scrolls
    <div
      className={`flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-4 sm:p-8 overflow-hidden transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default PageLayout;
