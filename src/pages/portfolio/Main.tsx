import { Outlet } from "react-router-dom";

/**
 * Portfolio Main Layout - A wrapper component for the Portfolio module routes.
 */
const PortfolioMain = () => {
  return (
    <div className="flex flex-col h-full bg-[#f0f0eb]">
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PortfolioMain;
