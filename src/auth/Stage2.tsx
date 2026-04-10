import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";
import { motion } from "framer-motion";

const ArrowLeftIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const stages = [
  { id: "pre-concept", label: "Pre-Concept", x: "10%", y: "85%" },
  { id: "concept", label: "Concept", x: "30%", y: "80.60%" },
  { id: "experiment", label: "Experiment", x: "50%", y: "67%" },
  { id: "scale", label: "Scale", x: "70%", y: "46%" },
  { id: "maturity", label: "Maturity", x: "90%", y: "20%" },
];

const Stage = () => {
  const [selectedStage, setSelectedStage] = useState(stages[0]);
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      console.log("Selected Stage:", selectedStage);
      const token = localStorage.getItem("token");
      await axios.post(
        `${API_URL}/onboarding/stage`,
        { stage: selectedStage.label },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Failed to save onboarding stage:", error);
      // Optional: Show error to user or navigate anyway?
      // For now, let's navigate to keep the flow moving, but log the error.
      navigate("/dashboard/home");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard/home");
  };

  return (
    <div className="bg-[#f0f0eb] h-screen md:px-32 px-0 pt-5">
      {/* Back Button */}
      <div className="fixed top-8 left-8">
        <button
          onClick={() => navigate(-1)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:text-white hover:bg-blue-600 transition-colors"
          aria-label="Go back"
        >
          <ArrowLeftIcon />
        </button>
      </div>

      {/* Skip Button */}
      <div className="fixed top-8 right-8">
        <button
          onClick={handleSkip}
          className="px-2 py- rounded-lg border border-blue-300 text-gray-700 bg-transparent hover:bg-gray-100 transition text-sm font-medium"
        >
          Skip
        </button>
      </div>

      <div className="md:mt-10 mt-32 mb-10 text-center z-10">
        <h2 className="text-xl font-bold text-gray-900">
          What stage would you say you're at?
        </h2>
      </div>

      {/* Graph Area */}
      <div className="relative md:w-full h-[300px] md:h-[450px]">
        {/* SVG Curve */}
        <svg
          className="absolute top-0 left-0 w-full h-full overflow-visible"
          viewBox="0 0 800 400"
          preserveAspectRatio="none"
        >
          {/* Visual Curve Approximation - adjusting control points to match the exponential look */}
          <path
            d="M 80 340 C 240 340, 400 300, 720 80"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Arrow head at the end */}
          <path
            d="M 715 85 L 720 80 L 710 75"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Interactive Points */}
        {stages.map((stage) => {
          const isSelected = selectedStage.id === stage.id;

          // Manual positioning mapping roughly to the SVG curve logic
          // 10% -> 80px, 30% -> 240px ...
          // Need to match the visual position on the curve.
          // Let's rely on the CSS left/top percentages I defined in the object for simplicity of layout,
          // adjusting them to fit the curve I drew.

          return (
            <div
              key={stage.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: stage.x, top: stage.y }}
              onClick={() => setSelectedStage(stage)}
            >
              {/* Tooltip / Label Bubble - Only show if selected */}
              {isSelected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: -50 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-white px-4 py-2 rounded-full shadow-md text-sm font-bold text-gray-800 whitespace-nowrap border border-gray-100 z-20"
                >
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white transform rotate-45 border-r border-b border-gray-100"></div>
                  {stage.label}
                  {/* Dotted line to point */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-px h-10 border-l border-dashed border-gray-400 pointer-events-none -z-10 bg-transparent"></div>
                </motion.div>
              )}

              {/* Dot Circle */}
              <div
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 z-10 relative
                            ${isSelected ? "bg-blue-700 border-white scale-125 ring-2 ring-blue-700/30" : "bg-blue-200/50 border-transparent hover:bg-blue-400"}`}
              ></div>

              {/* Label below */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-gray-700 whitespace-nowrap">
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={handleContinue}
          className="px-3 py-1 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Stage;
