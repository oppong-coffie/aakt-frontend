import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";

/**
 * Capital Page - Manages fundraising campaigns and capital sources.
 * Includes detailed views for investment sources and creation of campaigns.
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

const ListViewIcon = () => (
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
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const CardViewIcon = () => (
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
    <rect width="7" height="7" x="3" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="3" rx="1" />
    <rect width="7" height="7" x="14" y="14" rx="1" />
    <rect width="7" height="7" x="3" y="14" rx="1" />
  </svg>
);

const capitalSources = [
  {
    id: 1,
    source: "eBay",
    amount: "$767.50",
    status: "Warm",
    statusColor: "text-yellow-600",
    type: "Corporate Venture",
    location: "San Jose, CA",
    thesis:
      "Strategic investments in e-commerce infrastructure and fintech sectors.",
    notes:
      "Follow up scheduled for next quarter. Interested in scalable logistics solutions.",
  },
  {
    id: 2,
    source: "Sony",
    amount: "$779.58",
    status: "Committed",
    statusColor: "text-green-600",
    type: "Venture Capital",
    location: "Tokyo, JP",
    thesis: "Entertainment, gaming, and consumer electronics innovation.",
    notes:
      "Highly interested in interactive digital content and hardware synergies.",
  },
  {
    id: 3,
    source: "Mitsubishi",
    amount: "$219.78",
    status: "Warm",
    statusColor: "text-yellow-600",
    type: "Investment Bank",
    location: "Tokyo, JP",
    thesis: "Global industrial and technology expansion support.",
    notes: "Exploring debt-equity mix for infrastructure projects.",
  },
  {
    id: 4,
    source: "MasterCard",
    amount: "$782.01",
    status: "Committed",
    statusColor: "text-green-600",
    type: "Corporate VC",
    location: "New York, NY",
    thesis: "Digital payments, security, and financial inclusion technologies.",
    notes:
      "Confirmed participation in Series B round. Strategic partnership pending.",
  },
  {
    id: 5,
    source: "McDonald's",
    amount: "$589.99",
    status: "Committed",
    statusColor: "text-green-600",
    type: "Strategic Partner",
    location: "Chicago, IL",
    thesis: "Restaurant tech, logistics, and supply chain efficiency.",
    notes: "Focusing on automation and delivery experience improvements.",
  },
  {
    id: 6,
    source: "L'Oréal",
    amount: "$710.68",
    status: "Pitched",
    statusColor: "text-blue-500",
    type: "Brand Fund",
    location: "Paris, FR",
    thesis:
      "Beauty tech, AI-driven personalization, and sustainable materials.",
    notes: "Initial pitch went well. Moving to technical due diligence.",
  },
  {
    id: 7,
    source: "Bank of America",
    amount: "$450.54",
    status: "Committed",
    statusColor: "text-green-600",
    type: "Institutional Parent",
    location: "Charlotte, NC",
    thesis: "Fintech, cybersecurity, and ESG-focused investments.",
    notes: "Strong support for the green energy transition portfolio.",
  },
];

const fundraisingCampaigns = [
  {
    id: 1,
    name: "Series A Extension",
    type: "Equity",
    amount: "$2M",
    status: "Active",
  },
  {
    id: 2,
    name: "Q3 Bridge Round",
    type: "Debt",
    amount: "$500k",
    status: "Live",
  },
];

const Capital = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isPlusDropdownOpen, setIsPlusDropdownOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any | null>(null);

  /**
   * Modal to add a new capital source.
   */
  const AddCapitalModal = () => (
    <AnimatePresence>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsAddModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-4xl shadow-2xl relative z-100 p-10 overflow-hidden border border-gray-100 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-['Space_Grotesk']">
                Add Capital Source
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100/80 dark:bg-slate-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                title="Close"
              >
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
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-['Inter'] dark:text-gray-100"
              />

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-tighter font-['Inter']">
                  Geography
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <select className="px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm text-gray-500 dark:text-gray-400 appearance-none font-['Inter']">
                    <option>Continent</option>
                  </select>
                  <select className="px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm text-gray-500 dark:text-gray-400 appearance-none font-['Inter']">
                    <option>Country</option>
                  </select>
                  <select className="px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm text-gray-500 dark:text-gray-400 appearance-none font-['Inter']">
                    <option>City</option>
                  </select>
                </div>
              </div>

              <div className="w-full aspect-video border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center gap-3 bg-gray-50/30 dark:bg-slate-800/30 group hover:border-blue-300 dark:hover:border-blue-600 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                  <PlusIcon />
                </div>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-['Inter']">
                  Campaign Image
                </span>
              </div>

              <input
                type="text"
                placeholder="Type of capital source"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm font-['Inter'] dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Check size"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm font-['Inter'] dark:text-gray-100"
              />
              <input
                type="text"
                placeholder="Instrument type"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm font-['Inter'] dark:text-gray-100"
              />

              <textarea
                placeholder="Thesis & Goals"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm h-24 resize-none focus:outline-none font-['Inter'] dark:text-gray-100"
              ></textarea>
              <textarea
                placeholder="Notes"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 bg-gray-50/30 dark:bg-slate-800/30 text-sm h-24 resize-none focus:outline-none font-['Inter'] dark:text-gray-100"
              ></textarea>

              <div className="space-y-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">
                  Reminder
                </span>
                <button className="flex items-center gap-2 text-blue-600 font-bold text-sm hover:underline font-['Inter']">
                  <PlusIcon /> Add Reminder
                </button>
              </div>

              <button className="w-full py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all mt-4 shadow-sm font-['Space_Grotesk']">
                Add Capital Source
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  /**
   * Modal to create a new fundraising campaign.
   */
  const CreateCampaignModal = () => (
    <AnimatePresence>
      {isCampaignModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsCampaignModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-4xl shadow-2xl relative z-100 p-10 overflow-hidden border border-gray-100 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-['Space_Grotesk']">
                Create Campaign
              </h2>
              <button
                onClick={() => setIsCampaignModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center bg-gray-100/80 dark:bg-slate-800 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
                title="Close"
              >
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
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Campaign Name"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm font-['Inter']"
              />
              <textarea
                placeholder="Description"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/30 text-sm h-32 resize-none focus:outline-none font-['Inter']"
              ></textarea>
              <input
                type="text"
                placeholder="Campaign Type"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/30 text-sm focus:outline-none font-['Inter']"
              />

              <div className="relative group">
                <select className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/30 text-sm text-gray-500 appearance-none outline-hidden cursor-pointer font-['Inter']">
                  <option>Select Audience</option>
                  <option>Investors</option>
                  <option>Partners</option>
                  <option>Customers</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
              </div>

              <input
                type="text"
                placeholder="Content"
                className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50/30 text-sm focus:outline-none font-['Inter']"
              />

              <div className="w-full aspect-video border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 bg-gray-50/30 group hover:border-blue-300 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                  <PlusIcon />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 font-['Inter']">
                  Campaign Image
                </span>
              </div>

              <button className="w-full py-4 bg-blue-600 dark:bg-blue-500 text-white font-bold rounded-2xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all mt-4 shadow-sm font-['Space_Grotesk']">
                Add Campaign
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  /**
   * Modal to view and edit details of a specific capital source.
   */
  const SourceDetailsModal = () => (
    <AnimatePresence>
      {selectedSource && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedSource(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white dark:bg-slate-900 w-full max-w-md rounded-5xl shadow-2xl relative z-100 overflow-hidden"
          >
            {/* Modal Header/Art */}
            <div className="h-32 bg-linear-to-br from-yellow-500 to-yellow-300 relative">
              <button
                onClick={() => setSelectedSource(null)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-lg rounded-full text-white hover:bg-white/30 transition-colors"
              >
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
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-10 pb-10 -mt-10">
              <div className="bg-white dark:bg-slate-900 rounded-4xl p-8 shadow-sm border border-gray-100 dark:border-slate-800 mb-8 flex flex-col items-center">
                <div className="w-24 h-24 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-3xl font-black text-yellow-600">
                    {selectedSource.source[0]}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-gray-100 text-center font-['Space_Grotesk']">
                  {selectedSource.source}
                </h3>
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-widest font-['Inter']">
                  {selectedSource.type}
                </p>
                <div className="mt-4 px-4 py-1.5 bg-gray-50 dark:bg-slate-800 rounded-full">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${selectedSource.statusColor}`}
                  >
                    {selectedSource.status}
                  </span>
                </div>
              </div>

              <div className="space-y-8 mb-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1 font-['Inter']">
                      Check Size
                    </span>
                    <span className="text-lg font-black text-blue-600 dark:text-blue-400 font-['Space_Grotesk']">
                      {selectedSource.amount}
                    </span>
                  </div>
                  <div className="bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-2xl">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase block mb-1 font-['Inter']">
                      Geography
                    </span>
                    <span className="text-xs font-bold text-gray-900 dark:text-gray-100 font-['Inter']">
                      {selectedSource.location}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 font-['Inter']">
                    Investment Thesis
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium font-['Inter']">
                    {selectedSource.thesis}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3 font-['Inter']">
                    Notes
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium font-['Inter']">
                    {selectedSource.notes}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSource(null)}
                className="w-full py-5 bg-gray-900 dark:bg-blue-600 text-white rounded-4xl font-bold hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors mb-4 font-['Space_Grotesk']"
              >
                Close Details
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 px-4 sm:px-8 relative overflow-hidden transition-colors duration-300">
      {/* Header Area */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)}>
              <div className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <LeftArrowIcon />
              </div>
            </button>
          </div>
          <Breadcrumbs
            items={[
              { label: "BizInfra", to: "/dashboard/bizinfra" },
              { label: "Capital", to: "/dashboard/bizinfra/capital" },
            ]}
          />
        </div>

        <div className="flex items-center gap-2 relative">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <SearchIcon />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsPlusDropdownOpen(!isPlusDropdownOpen)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isPlusDropdownOpen ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30" : "text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800"}`}
          >
            <PlusIcon />
          </motion.button>

          <AnimatePresence>
            {isPlusDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden py-2"
              >
                <button
                  onClick={() => {
                    setIsAddModalOpen(true);
                    setIsPlusDropdownOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-3 font-['Inter']"
                >
                  New Source
                </button>
                <div className="h-px bg-gray-50 dark:bg-slate-800 mx-4 my-1"></div>
                <button
                  onClick={() => {
                    setIsCampaignModalOpen(true);
                    setIsPlusDropdownOpen(false);
                  }}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-3 font-['Inter']"
                >
                  Fundraising Campaign
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <div className="flex justify-end items-center mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === "list" ? "card" : "list")}
            className="px-4 py-2 bg-white dark:bg-slate-900 rounded-xl flex items-center gap-2 shadow-sm border border-gray-100 dark:border-slate-800 text-xs font-bold text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-slate-800 font-['Inter']"
          >
            {viewMode === "list" ? (
              <>
                <CardViewIcon /> Card view
              </>
            ) : (
              <>
                <ListViewIcon /> List view
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-12 overflow-y-auto no-scrollbar pb-20">
        <div className="mb-10">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 font-['Space_Grotesk']">
            Capital Sources
          </h3>
          <AnimatePresence mode="wait">
            {viewMode === "list" ? (
              <motion.div
                key="list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white/50 dark:bg-slate-900/50 rounded-4xl p-4 border border-gray-200/50 dark:border-slate-800/50"
              >
                <div className="grid grid-cols-3 px-8 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest border-b border-gray-100/50 dark:border-slate-800/50">
                  <span>Source</span>
                  <span>Amount</span>
                  <span>Status</span>
                </div>
                <div className="space-y-1 mt-2">
                  {capitalSources.map((item, i) => (
                    <motion.div
                      key={i}
                      onClick={() => setSelectedSource(item)}
                      className="grid grid-cols-3 px-8 py-4 hover:bg-white dark:hover:bg-slate-800 rounded-2xl transition-colors cursor-pointer group font-['Inter']"
                      whileHover={{
                        scale: 1.01,
                        backgroundColor: "rgba(255, 255, 255, 1)",
                      }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                        {item.source}
                      </span>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400 font-['Space_Grotesk']">
                        {item.amount}
                      </span>
                      <span className={`text-sm font-bold ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {capitalSources.map((item, i) => (
                  <motion.div
                    key={i}
                    onClick={() => setSelectedSource(item)}
                    className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-shadow group cursor-pointer relative overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="absolute top-0 right-0 p-4">
                      <div
                        className={`w-2 h-2 rounded-full ${item.statusColor.replace("text-", "bg-")}`}
                      ></div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                          Source
                        </span>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight font-['Space_Grotesk']">
                          {item.source}
                        </h4>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                          Amount
                        </span>
                        <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                          {item.amount}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-gray-50 dark:border-slate-800 flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${item.statusColor}`}
                        >
                          {item.status}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-gray-300 dark:text-gray-600 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors"
                        >
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 font-['Space_Grotesk']">
              Fundraising Campaigns
            </h3>
            <button
              onClick={() => setIsCampaignModalOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-white dark:hover:text-white hover:bg-blue-600 dark:hover:bg-blue-600 transition-colors"
            >
              <PlusIcon />
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 max-w-7xl mx-auto w-full">
            {fundraisingCampaigns.map((campaign, i) => (
              <Link
                key={i}
                to="/dashboard/bizinfra/skillset/project/project"
                className="contents"
              >
                <motion.div
                  className="flex flex-col items-center gap-3 w-64 group cursor-pointer p-6 rounded-[2.5rem] hover:bg-gray-100 dark:hover:bg-slate-800 transition-all font-bold"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="w-56 h-36 bg-white dark:bg-slate-900 rounded-4xl shadow-sm border border-gray-100 dark:border-slate-800 group-hover:shadow-md transition-shadow flex flex-col gap-4 relative overflow-hidden p-6">
                    <div className="w-full aspect-square bg-gray-100 dark:bg-slate-800 rounded-2xl mb-2 relative overflow-hidden hidden">
                      {/* Placeholder or image hidden in standard view if it clashes with info */}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400 dark:text-gray-500 uppercase">
                          Type:
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {campaign.type}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400 dark:text-gray-500 uppercase">
                          Amount:
                        </span>
                        <span className="text-gray-900 dark:text-gray-100">
                          {campaign.amount}
                        </span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-gray-400 dark:text-gray-500 uppercase">
                          Status:
                        </span>
                        <span className="text-green-600 dark:text-green-400">
                          {campaign.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors font-['Space_Grotesk']">
                    {campaign.name}
                  </h4>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <AddCapitalModal />
      <CreateCampaignModal />
      <SourceDetailsModal />
    </div>
  );
};

export default Capital;
