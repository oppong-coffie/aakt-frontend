<<<<<<< HEAD
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../../api/apiClient";
import { type BizConcept, type GoToMarketStrategy } from "../../../api/portfolio.service";
=======
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9

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

const Culture = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

  // Load saved value from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("bizConcept_culture");
    if (saved) setValue(saved);
  }, []);

  const handleFinish = async () => {
    try {
      setLoading(true);
      localStorage.setItem("bizConcept_culture", value);

      // Gather all concept data from localStorage
      const businessName = localStorage.getItem("bizConcept_name") || "";
      const product = localStorage.getItem("bizConcept_product") || "";
      const customer = localStorage.getItem("bizConcept_customer") || "";
      const goToMarketStr = localStorage.getItem("bizConcept_goToMarket");
      const businessImage = localStorage.getItem("bizConcept_businessImage") || undefined;
      const culture = value;

      const optionsMap: Record<string, GoToMarketStrategy> = {
        "Online Store / E-commerce": "online_store",
        "Direct Sales (B2B)": "direct_sales",
        "Retail / Physical Store": "retail",
        "Subscription Model": "subscription",
        "Freemium Model": "freemium",
        "Marketplace": "marketplace",
        "Consulting / Services": "consulting",
        "Partnerships / Resellers": "partnerships",
      };

      const goToMarket: GoToMarketStrategy[] = goToMarketStr
        ? JSON.parse(goToMarketStr).map((option: string) => optionsMap[option])
        : [];

      const bizConcept: BizConcept = {
        product,
        customer,
        goToMarket,
        culture,
      };

      // Submit all data to /portfolio
      await apiClient.post("/portfolio", {
        businessName,
        businessImage,
        bizConcept,
      });

      // Clear localStorage
      localStorage.removeItem("bizConcept_name");
      localStorage.removeItem("bizConcept_product");
      localStorage.removeItem("bizConcept_customer");
      localStorage.removeItem("bizConcept_goToMarket");
      localStorage.removeItem("bizConcept_culture");
      localStorage.removeItem("bizConcept_businessImage");

      navigate("/dashboard/home");
    } catch (err) {
      console.error("Failed to save concept:", err);
      alert("Error saving concept. Please try again.");
    } finally {
      setLoading(false);
    }
  };
=======
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9

  return (
    <div className="flex flex-col h-full bg-[#f0f0eb] dark:bg-slate-950 p-6 sm:p-12 font-sans text-gray-900 dark:text-gray-100 justify-center items-center relative min-h-screen transition-colors duration-300">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 transition-colors"
      >
        <LeftArrowIcon />
      </button>

<<<<<<< HEAD
      <Link
        to="/dashboard/home"
        onClick={() => localStorage.setItem("bizConcept_culture", value)}
        className="absolute top-6 right-6 px-4 py-2 text-gray-400 dark:text-gray-500 font-bold hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-colors z-10"
      >
        Skip
      </Link>

=======
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
      <div className="max-w-3xl w-full flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight font-['Space_Grotesk'] text-gray-900 dark:text-gray-100">
            What culture do you want to build?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed font-['Inter']">
            Describe the values and environment you envision for your company.
          </p>
        </div>

        {/* Content */}
        <div className="w-full">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. Innovative, collaborative, remote-first..."
            className="w-full p-6 rounded-3xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 dark:focus:border-blue-500 transition-all text-lg min-h-[200px] resize-none font-['Inter'] text-gray-900 dark:text-gray-200"
          />
        </div>
      </div>

      {/* Footer / Buttons */}
      <div className="fixed bottom-0 left-0 right-0 p-6 sm:p-12 flex justify-end gap-4 max-w-7xl mx-auto w-full pointer-events-none">
        <div className="pointer-events-auto flex gap-4">
<<<<<<< HEAD
          <button
            onClick={handleFinish}
            disabled={loading}
            className="px-8 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-bold hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-600/20 dark:shadow-blue-500/10"
          >
            {loading ? "Saving..." : "Finish"}
          </button>
=======
          <Link to="/dashboard/home">
            <button className="px-8 py-3 rounded-xl bg-blue-600 dark:bg-blue-500 text-white font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors shadow-lg shadow-blue-600/20 dark:shadow-blue-500/10">
              Finish
            </button>
          </Link>
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
        </div>
      </div>
    </div>
  );
};

export default Culture;
