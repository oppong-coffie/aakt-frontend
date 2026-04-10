import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";

/**
 * Dashboard Layout - The primary layout for the application's authenticated area.
 * Features a persistent Sidebar (navigation), a main content area (Outlet),
 * and integrated Botpress webchat for support.
 */

// Icons (Simple SVGs)
const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className="text-blue-600"
  >
    <path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" />
  </svg>
);

const BizIcon = () => (
  <div className="w-0 h-0 border-l-[6px] border-l-transparent border-b-[10px] border-b-purple-500 border-r-[6px] border-r-transparent"></div>
);

const PortfolioIcon = () => (
  <div className="w-4 h-4 rounded-full bg-linear-to-br from-blue-500 to-indigo-600"></div>
);

const SettingsIcon = () => (
  <div className="w-4 h-4 rounded-full bg-green-400"></div>
);

const MenuIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-gray-600"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-gray-500 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SidebarToggleIcon = ({ collapsed }: { collapsed: boolean }) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-gray-600 transition-transform duration-300 ${
      collapsed ? "rotate-180" : ""
    }`}
  >
    <circle cx="12" cy="12" r="9" className="stroke-gray-300" />
    <polyline points="11 8 7 12 11 16" />
    <line x1="16.5" y1="12" x2="7" y2="12" />
  </svg>
);

const Dashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [bizInfraOpen, setBizInfraOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
<<<<<<< HEAD
  const [businesses, setBusinesses] = useState<Array<{ _id: string; name: string }>>([]);
  const [businessLoading, setBusinessLoading] = useState(true);
  const [businessError, setBusinessError] = useState<string | null>(null);
=======
  const [saasOpen, setSaasOpen] = useState(false);
  const [saasDepartmentOpen, setSaasDepartmentOpen] = useState(false);
  const [saasOperationOpen, setSaasOperationOpen] = useState(false);
  const [saasProjectOpen, setSaasProjectOpen] = useState(false);
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

<<<<<<< HEAD
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setBusinessLoading(true);
        setBusinessError(null);

        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:3000/business", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const data = await response.json();
        setBusinesses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load businesses", error);
        setBusinessError("Failed to load your businesses. Please refresh.");
      } finally {
        setBusinessLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

=======
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Auto-expansion logic removed as per user request

  useEffect(() => {
    const initBotpress = () => {
      if (!window.botpressWebChat) return;

      window.botpressWebChat.init({
        botId: "YOUR_BOT_ID",
        clientId: "YOUR_CLIENT_ID",
        hostUrl: "https://cdn.botpress.cloud/webchat/v1",
        messagingUrl: "https://messaging.botpress.cloud",
        lazySocket: true,
        showPoweredBy: false,
      });
    };

    // try immediately
    initBotpress();

    // fallback: in case script loads after component mounts
    const interval = setInterval(() => {
      if (window.botpressWebChat) {
        initBotpress();
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-[#f0f0eb] dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-300">
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsSidebarOpen(true)}
        className="lg:hidden absolute top-6 left-6 z-40 p-2 bg-white rounded-lg shadow-sm border border-gray-200"
      >
        <MenuIcon />
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-xs z-60"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 w-72 bg-[#f0f0eb] dark:bg-slate-900 flex flex-col px-4 pb-8 pt-2 border-r text-black dark:text-gray-300 border-gray-200/50 dark:border-slate-800 z-70 transform transition-all duration-700 ease-in-out font-space-grotesk text-gray-600
        lg:translate-x-0 lg:static lg:h-full lg:z-50
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${
          navCollapsed
            ? "lg:w-20 lg:px-2 lg:pb-6 lg:pt-2 lg:opacity-100 lg:translate-x-0"
            : "lg:w-72 lg:opacity-100"
        }
      `}
      >
        {/* Logo & Close Button (Mobile) */}
        <div className="flex items-center justify-between gap-3 mb-8 px-3 py-3">
          {navCollapsed ? (
            <div className="flex items-center justify-center w-full group relative h-10 cursor-pointer lg:block hidden">
              {/* Collapsed State: Logo (Visible by default, hidden on hover) */}
              <div
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-200 group-hover:opacity-0"
                onClick={() => setNavCollapsed(false)}
              >
                <div className="bg-blue-600 text-white w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold shadow-md">
                  A
                </div>
              </div>
              {/* Collapsed State: Toggle Icon (Hidden by default, visible on hover) */}
              <button
                type="button"
                onClick={() => setNavCollapsed((prev) => !prev)}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                aria-label="Expand sidebar"
              >
                <SidebarToggleIcon collapsed={true} />
              </button>
            </div>
          ) : (
            <Link
              to="/dashboard/home"
              className="flex items-center gap-2 hover:opacity-85 transition-all duration-200 flex-1"
            >
              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold tracking-wide shadow-md hover:shadow-lg hover:bg-blue-700 transition-all">
                AAKT
              </div>
            </Link>
          )}

          {!navCollapsed && (
            <button
              type="button"
              onClick={() => setNavCollapsed((prev) => !prev)}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-blue-100 dark:hover:bg-slate-800 text-gray-500 dark:text-gray-400 lg:block hidden"
              aria-label="Collapse sidebar"
            >
              <SidebarToggleIcon collapsed={false} />
            </button>
          )}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 space-y-4 transition-all duration-300 overflow-hidden ${
            navCollapsed ? "px-1" : ""
          }`}
        >
          <Link
            to="/dashboard/home"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center ${
              navCollapsed ? "px-2" : "gap-3 px-4"
            } py-2.5 rounded-xl transition-colors duration-200 ${
              location.pathname === "/dashboard/home"
                ? "bg-gray-200/80 dark:bg-slate-800 shadow-sm border border-gray-300/50 dark:border-slate-700 text-gray-900 dark:text-white"
                : "text-black dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white"
            }`}
            title={navCollapsed ? "Home" : undefined}
          >
            <div className="w-6 flex justify-center">
              <HomeIcon />
            </div>
            <span
              className={`font-medium dark:text-inherit text-sm ${navCollapsed ? "hidden" : ""}`}
            >
              Home
            </span>
          </Link>

          {/* BizInfra Group */}
          <div className="space-y-1">
            <div
              className={`group flex items-center justify-between gap-2 mb-2 ${
                navCollapsed ? "px-2" : "px-4"
              } py-2 rounded-xl transition-colors duration-200 ${
                location.pathname.startsWith("/dashboard/bizinfra")
                  ? "bg-gray-200/80 dark:bg-slate-800 shadow-sm border border-gray-300/50 dark:border-slate-700 text-gray-900 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <Link
                to="/dashboard/bizinfra"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center ${
                  navCollapsed ? "justify-center" : "gap-3"
                } font-bold text-xs uppercase tracking-wider transition-colors duration-200`}
                title={navCollapsed ? "BizInfra" : undefined}
              >
                <BizIcon />
                <span
                  className={navCollapsed ? "hidden" : "dark:text-gray-300"}
                >
                  BizInfra
                </span>
              </Link>
              {!navCollapsed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setBizInfraOpen((o) => !o);
                  }}
                  className="p-1 rounded transition-colors duration-200 hover:bg-gray-200/80 group-hover:bg-gray-200/80"
                  aria-label={
                    bizInfraOpen
                      ? "Collapse BizInfra menu"
                      : "Expand BizInfra menu"
                  }
                >
                  <ChevronIcon open={bizInfraOpen} />
                </button>
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-200 ease-out ${
                navCollapsed
                  ? "hidden"
                  : bizInfraOpen
                    ? "max-h-[320px] opacity-100"
                    : "max-h-0 opacity-70"
              }`}
            >
              <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-5">
                {[
                  { name: "Skillset", icon: "/bizinfra/skill2.png" },
                  { name: "Network", icon: "/bizinfra/network.png" },
                  { name: "Intel", icon: "/bizinfra/intel2.png" },
                  { name: "Capital", icon: "/bizinfra/capital.png" },
                  { name: "Reach", icon: "/bizinfra/reach.png" },
                ].map((item) => (
                  <Link
                    key={item.name}
                    to={`/dashboard/bizinfra/${item.name.toLowerCase()}`}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex text-black items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                      ${
                        location.pathname.includes(item.name.toLowerCase())
                          ? "bg-blue-50 dark:bg-blue-900/20 text-black dark:text-blue-400"
                          : "text-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                      }
                    `}
                  >
                    <img
                      src={item.icon}
                      alt=""
                      className="w-4 h-4 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="dark:text-inherit">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Portfolio Group */}
          <div className="space-y-1 pt-2">
            <div
              className={`group flex items-center justify-between gap-2 mb-2 ${
                navCollapsed ? "px-2" : "px-4"
              } py-2 rounded-xl transition-colors duration-200 ${
                location.pathname.startsWith("/dashboard/portfolio")
                  ? "bg-gray-200/80 dark:bg-slate-800 shadow-sm border border-gray-300/50 dark:border-slate-700 text-gray-900 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800"
              }`}
            >
              <Link
                to="/dashboard/portfolio"
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center ${
                  navCollapsed ? "justify-center" : "gap-3"
                } text-black font-bold text-xs uppercase tracking-wider transition-colors duration-200`}
<<<<<<< HEAD
                title={navCollapsed ? "Business" : undefined}
=======
                title={navCollapsed ? "Portfolio" : undefined}
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
              >
                <PortfolioIcon />
                <span
                  className={navCollapsed ? "hidden" : "dark:text-gray-300"}
                >
<<<<<<< HEAD
                  Business
=======
                  Portfolio
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
                </span>
              </Link>
              {!navCollapsed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPortfolioOpen((o) => !o);
                  }}
                  className="p-1 rounded transition-colors duration-200 hover:bg-gray-200/80 group-hover:bg-gray-200/80"
                  aria-label={
                    portfolioOpen
                      ? "Collapse Portfolio menu"
                      : "Expand Portfolio menu"
                  }
                >
                  <ChevronIcon open={portfolioOpen} />
                </button>
              )}
            </div>
            <div
              className={`overflow-hidden transition-all duration-200 ease-out ${
                navCollapsed
                  ? "hidden"
                  : portfolioOpen
                    ? "max-h-[420px] opacity-100"
                    : "max-h-0 opacity-70"
              }`}
            >
              <div className="pl-4 space-y-1 border-l-2 border-gray-100 ml-5">
<<<<<<< HEAD
                {businessLoading && (
                  <div className="pl-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                    Loading businesses...
                  </div>
                )}

                {businessError && (
                  <div className="pl-2 py-1 text-xs text-red-500">
                    {businessError}
                  </div>
                )}

                {!businessLoading && !businessError && businesses.length > 0 && (
                  <div className="space-y-1">
                    {businesses.map((business) => (
                      <Link
                        key={business._id}
                        to={`/dashboard/portfolio?businessId=${business._id}`}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`block py-2 px-2 rounded-lg text-sm font-medium transition-colors ${
                          location.pathname.startsWith("/dashboard/portfolio")
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-800 dark:hover:text-gray-100"
                        }`}
                      >
                        {business.name}
                      </Link>
                    ))}
                  </div>
                )}
=======
                {/* SaaS with nested submenu */}
                <div className="space-y-1">
                  <div className="group flex items-center justify-between gap-1 py-1">
                    <Link
                      to="/dashboard/portfolio/saas"
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                        location.pathname === "/dashboard/portfolio/saas"
                          ? "bg-blue-50 dark:bg-blue-900/20 text-black dark:text-blue-400"
                          : " text-black dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                      }`}
                    >
                      <span className="text-black dark:text-inherit">SaaS</span>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setSaasOpen((o) => !o);
                      }}
                      className="p-1 rounded hover:bg-gray-200/80 transition-colors shrink-0"
                      aria-label={
                        saasOpen ? "Collapse SaaS menu" : "Expand SaaS menu"
                      }
                    >
                      <ChevronIcon open={saasOpen} />
                    </button>
                  </div>
                  <div
                    className={`overflow-hidden transition-all duration-200 ease-out ${
                      saasOpen
                        ? "max-h-[540px] opacity-100"
                        : "max-h-0 opacity-70"
                    }`}
                  >
                    <div className="pl-3 space-y-0 border-l-2 border-gray-100 dark:border-slate-800 ml-2">
                      {/* Business: Department (expandable → Department, Operation, Project, Process, Block) */}
                      <div className="space-y-0">
                        <div className="group flex items-center justify-between gap-1 py-0.5">
                          <Link
                            to="/dashboard/portfolio/saas/department"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex-1 py-1.5 pl-2 text-sm font-medium rounded-lg transition-colors ${
                              location.pathname ===
                              "/dashboard/portfolio/saas/department"
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                          >
                            <span className="dark:text-inherit">
                              Department
                            </span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSaasDepartmentOpen((o) => !o);
                            }}
                            className="p-0.5 rounded hover:bg-gray-200/80 transition-colors shrink-0"
                            aria-label={
                              saasDepartmentOpen
                                ? "Collapse Department"
                                : "Expand Department"
                            }
                          >
                            <ChevronIcon open={saasDepartmentOpen} />
                          </button>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-200 ease-out ${
                            saasDepartmentOpen
                              ? "max-h-[220px] opacity-100"
                              : "max-h-0 opacity-70"
                          }`}
                        >
                          <div className="pl-3 border-l-2 border-gray-100 ml-2 space-y-0">
                            {[
                              {
                                name: "Department",
                                path: "/dashboard/portfolio/saas/department",
                              },
                              {
                                name: "Operation",
                                path: "/dashboard/portfolio/saas/operation",
                              },
                              {
                                name: "Project",
                                path: "/dashboard/portfolio/saas/project",
                              },
                              {
                                name: "Process",
                                path: "/dashboard/portfolio/saas/process",
                              },
                              {
                                name: "Block",
                                path: "/dashboard/portfolio/saas/block",
                              },
                            ].map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`block py-1.5 pl-3 text-sm font-medium rounded-lg transition-colors ${
                                  location.pathname === item.path
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                                }`}
                              >
                                <span className="text-black dark:text-inherit">
                                  {item.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Operation (expandable → Project, Process, Block) */}
                      <div className="space-y-0">
                        <div className="group flex items-center justify-between gap-1 py-0.5">
                          <Link
                            to="/dashboard/portfolio/saas/operation"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex-1 py-1.5 pl-2 text-sm font-medium rounded-lg transition-colors ${
                              location.pathname ===
                              "/dashboard/portfolio/saas/operation"
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                          >
                            <span className="text-black dark:text-inherit">
                              Operation
                            </span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSaasOperationOpen((o) => !o);
                            }}
                            className="p-0.5 rounded hover:bg-gray-200/80 transition-colors shrink-0"
                            aria-label={
                              saasOperationOpen
                                ? "Collapse Operation"
                                : "Expand Operation"
                            }
                          >
                            <ChevronIcon open={saasOperationOpen} />
                          </button>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-200 ease-out ${
                            saasOperationOpen
                              ? "max-h-[140px] opacity-100"
                              : "max-h-0 opacity-70"
                          }`}
                        >
                          <div className="pl-3 border-l-2 border-gray-100 ml-2 space-y-0">
                            {[
                              {
                                name: "Project",
                                path: "/dashboard/portfolio/saas/project",
                              },
                              {
                                name: "Process",
                                path: "/dashboard/portfolio/saas/process",
                              },
                              {
                                name: "Block",
                                path: "/dashboard/portfolio/saas/block",
                              },
                            ].map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`block py-1.5 pl-3 text-sm font-medium rounded-lg transition-colors ${
                                  location.pathname === item.path
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                                }`}
                              >
                                <span className="text-black dark:text-inherit">
                                  {item.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Project (expandable → Phase, Process, Block) */}
                      <div className="space-y-0">
                        <div className="group flex items-center justify-between gap-1 py-0.5">
                          <Link
                            to="/dashboard/portfolio/saas/project"
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex-1 py-1.5 pl-2 text-sm font-medium rounded-lg transition-colors ${
                              location.pathname ===
                              "/dashboard/portfolio/saas/project"
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                            }`}
                          >
                            <span className="dark:text-inherit">Project</span>
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setSaasProjectOpen((o) => !o);
                            }}
                            className="p-0.5 rounded hover:bg-gray-200/80 transition-colors shrink-0"
                            aria-label={
                              saasProjectOpen
                                ? "Collapse Project"
                                : "Expand Project"
                            }
                          >
                            <ChevronIcon open={saasProjectOpen} />
                          </button>
                        </div>
                        <div
                          className={`overflow-hidden transition-all duration-200 ease-out ${
                            saasProjectOpen
                              ? "max-h-[140px] opacity-100"
                              : "max-h-0 opacity-70"
                          }`}
                        >
                          <div className="pl-3 border-l-2 border-gray-100 ml-2 space-y-0">
                            {[
                              {
                                name: "Phase 1",
                                path: "/dashboard/portfolio/saas/project/phase1",
                              },
                              {
                                name: "Phase 2",
                                path: "/dashboard/portfolio/saas/project/phase2",
                              },
                              {
                                name: "Phase 3",
                                path: "/dashboard/portfolio/saas/project/phase3",
                              },
                            ].map((item) => (
                              <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`block py-1.5 pl-3 text-sm font-medium rounded-lg transition-colors ${
                                  location.pathname === item.path
                                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                                }`}
                              >
                                <span className="text-black dark:text-inherit">
                                  {item.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                      {/* Process (direct link) */}
                      <Link
                        to="/dashboard/portfolio/saas/process"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`block py-1.5 pl-2 text-sm font-medium rounded-lg transition-colors ${
                          location.pathname ===
                          "/dashboard/portfolio/saas/process"
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      >
                        <span className="dark:text-inherit">Process</span>
                      </Link>
                      {/* Block (direct link) */}
                      <Link
                        to="/dashboard/portfolio/saas/block"
                        onClick={() => setIsSidebarOpen(false)}
                        className={`block py-1.5 pl-2 text-sm font-medium rounded-lg transition-colors ${
                          location.pathname ===
                          "/dashboard/portfolio/saas/block"
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                        }`}
                      >
                        <span className="dark:text-inherit">Block</span>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* Ecommerce */}
                <Link
                  to="/dashboard/portfolio/ecommerce"
                  onClick={() => setIsSidebarOpen(false)}
                  className={`block py-2 text-sm font-medium rounded-lg transition-colors ${
                    location.pathname.includes("ecommerce")
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  <span className="dark:text-inherit">Ecommerce</span>
                </Link>
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
              </div>
            </div>
          </div>
        </nav>

<<<<<<< HEAD

=======
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
        <div className="mt-auto pt-6 flex flex-col gap-1">
          <button
            onClick={toggleDarkMode}
            className={`flex items-center ${
              navCollapsed ? "justify-center h-11" : "gap-3 px-4 py-2.5"
            } rounded-xl text-gray-600 dark:text-gray-400 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white`}
            aria-label="Toggle dark mode"
            title={
              navCollapsed
                ? isDarkMode
                  ? "Light Mode"
                  : "Dark Mode"
                : undefined
            }
          >
            <div className="w-6 flex justify-center">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            {!navCollapsed && (
              <span className="font-medium text-sm">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>

          <Link
            to="/"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center ${
              navCollapsed ? "justify-center h-11" : "gap-3 px-4 py-2.5"
            } rounded-xl text-gray-600 dark:text-gray-400 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-slate-800 hover:text-gray-900 dark:hover:text-white`}
            title={navCollapsed ? "Settings" : undefined}
          >
            <div className="w-6 flex justify-center">
              <SettingsIcon />
            </div>
            {!navCollapsed && (
              <span className="font-medium text-sm">
                <span className="dark:text-inherit">Settings</span>
              </span>
            )}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-full overflow-y-auto no-scrollbar relative">
        {/* Scrollable Content */}
        <div className="px-4 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
