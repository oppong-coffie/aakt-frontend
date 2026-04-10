import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

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

const metrics = ["Skillset", "Network", "Capital", "Intel", "Influence"];

const Confident = () => {
  // Initial values (0-100)
  const [values, setValues] = useState<Record<string, number>>({
    Skillset: 10,
    Network: 10,
    Capital: 10,
    Intel: 10,
    Influence: 10,
  });

  const navigate = useNavigate();

  const handleChange = (metric: string, value: number) => {
    setValues((prev) => ({ ...prev, [metric]: value }));
  };

  const handleContinue = async () => {
    try {
      console.log("Confidence Values:", values);
      const token = localStorage.getItem("token");
      const payload = {
        confident: {
          skillset: values.Skillset,
          network: values.Network,
          capital: values.Capital,
          intel: values.Intel,
          influence: values.Influence,
        },
      };

      await axios.post(`${API_URL}/onboarding/confident`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard/home");
    } catch (error) {
      console.error("Failed to save onboarding confidence:", error);
      // Navigate anyway to keep flow moving, but log error
      navigate("/dashboard/home");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard/home");
  };

  return (
    <div className="h-screen bg-[#f0f0eb] pt-5 md:px-40 px-5">
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
          className="px-2 rounded-lg border border-blue-300 text-gray-700 bg-transparent hover:bg-gray-100 transition text-sm font-medium"
        >
          Skip
        </button>
      </div>

      {/* Question */}
      <div className="mt-20 mb-16 flex justify-center text-center">
        <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
          How confident are you in the following to achieve your 12 month goals?
        </h2>
      </div>

      {/* Slider */}
      <div className="space-y-8 md:ml-48">
        {metrics.map((metric) => (
          <div key={metric} className="flex">
            <div className="w-24 text-left text-gray-800 font-medium text-lg">
              {metric}
            </div>
            <div className="relative flex items-center">
              {/* Track Background */}
              <div className="md:w-[32vw] w-[62vw] h-7 bg-gray-200/50 rounded-full border border-gray-200"></div>

              {/* Custom Range Input overlay */}
              <input
                type="range"
                min="0"
                max="100"
                value={values[metric]}
                onChange={(e) => handleChange(metric, parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
              />

              {/* Visual Thumb/Indicator */}
              <div
                className="absolute h-6 w-6 bg-blue-600 rounded-full shadow-md z-10 pointer-events-none transition-all duration-75"
                style={{ left: `calc(${values[metric]}% - 16px)` }} // Adjust centering
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={handleContinue}
          className="px-3 py-1 bg-blue-400 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-500 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Confident;
