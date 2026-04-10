import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const LeftArrowIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 12H5M5 12L12 19M5 12L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const How = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const optionsMap: Record<string, string> = {
    "Online Store / E-commerce": "online_store",
    "Direct Sales (B2B)": "direct_sales",
    "Retail / Physical Store": "retail",
    "Subscription Model": "subscription",
    "Freemium Model": "freemium",
    "Marketplace": "marketplace",
    "Consulting / Services": "consulting",
    "Partnerships / Resellers": "partnerships",
  };

  const options = Object.keys(optionsMap);

  // Load saved value from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bizConcept_goToMarket");
    if (saved) {
      setSelected(JSON.parse(saved));
    }
  }, []);

  const toggleOption = (option: string) => {
    setSelected((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option],
    );
  };

  const handleContinue = () => {
    localStorage.setItem("bizConcept_goToMarket", JSON.stringify(selected));
    navigate("/dashboard/portfolio/questions/culture");
  };

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-6 sm:p-12 font-sans text-gray-900 dark:text-gray-100 justify-center items-center relative min-h-screen transition-colors duration-300">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
      >
        <LeftArrowIcon />
      </button>

      <Link
        to="/dashboard/portfolio/questions/culture"
        onClick={() => localStorage.setItem("bizConcept_goToMarket", JSON.stringify(selected))}
        className="absolute top-6 right-6 px-4 py-2 text-gray-400 dark:text-gray-500 font-bold hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors z-10"
      >
        Skip
      </Link>

      <div className="max-w-3xl w-full flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight font-['Space_Grotesk'] text-gray-900 dark:text-gray-100">
            How are you going to sell it to them?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-['Inter']">
            Select the channels and methods you plan to use.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => toggleOption(option)}
              className={`p-6 rounded-3xl border transition-all text-left font-['Inter'] font-medium text-lg ${
                selected.includes(option)
                  ? "border-blue-600 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-md ring-1 ring-blue-600"
                  : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-800"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Footer / Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 sm:p-12 flex justify-end gap-4 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="pointer-events-auto flex gap-4">
          <button
            onClick={handleContinue}
            className="px-8 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/20 dark:shadow-blue-500/10"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default How;
