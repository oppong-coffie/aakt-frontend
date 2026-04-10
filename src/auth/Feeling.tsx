import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< HEAD
import axios from "axios";
=======
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9

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

const feelingsList = [
  {
    left: "Excited",
    right: "Burn Out",
    color: "bg-blue-500",
    shadow: "shadow-blue-500/50",
  },
  {
    left: "Confident",
    right: "Unsure",
    color: "bg-lime-400",
    shadow: "shadow-lime-400/50",
  },
  {
    left: "Lonely",
    right: "Belonged",
    color: "bg-purple-500",
    shadow: "shadow-purple-500/50",
  },
  {
    left: "Fear",
    right: "Assured",
    color: "bg-cyan-400",
    shadow: "shadow-cyan-400/50",
  },
];

const Feeling = () => {
  // Initialize with 0 or middle, here 50 for neutral start, but we track interaction
  const [values, setValues] = useState<number[]>([50, 50, 50, 50]);
  const [hasStarted, setHasStarted] = useState(false);

  const navigate = useNavigate();

  const handleChange = (index: number, val: number) => {
    if (!hasStarted) setHasStarted(true);
    const newValues = [...values];
    newValues[index] = val;
    setValues(newValues);
  };

<<<<<<< HEAD
  const handleContinue = async () => {
    try {
      console.log("Feeling Values:", values);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/onboarding/feeling",
        { feeling: values },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Failed to save onboarding feelings:", error);
      // Navigate anyway to keep flow moving, but log error
      navigate("/dashboard/home");
    }
=======
  const handleContinue = () => {
    console.log("Feeling Values:", values);
    navigate("/dashboard/home");
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
  };

  const handleSkip = () => {
    navigate("/dashboard/home");
  };

  // Dynamic Opacity/Density mapping based on slider values (0-100)
  // Mapping specific sliders to relevant color layers
  // Excited (Blue) index 0 + Lonely (Purple) index 2 -> Outer Layer (Purple/Blue)
  const outerDensity = useMemo(
    () => Math.max(0.3, (values[0] + values[2]) / 200),
    [values],
  );

  // Fear (Cyan) index 3 -> Middle Layer (Cyan)
  const middleDensity = useMemo(() => Math.max(0.3, values[3] / 100), [values]); // Min 0.3 opacity

  // Confident (Lime) index 1 -> Center Layer (Lime)
  const innerDensity = useMemo(() => Math.max(0.4, values[1] / 100), [values]);

  return (
    <div className="h-screen bg-[#f0f0eb] relative flex flex-col items-center px-4 overflow-hidden">
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
      <div className="mt-14 mb-5 text-center z-10">
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          How are you feeling about your <br /> entrepreneurial journey?
        </h2>
      </div>

      {/* Glowing Aura Orb - Dynamic & Conditional */}
      <div
        className={`relative w-44 h-44 mb-10 flex items-center justify-center transition-opacity duration-1000 ${hasStarted ? "opacity-100" : "opacity-0"}`}
      >
        {/* Outer Purple/Blue Blur */}
        <div
          className="absolute inset-0 rounded-full blur-[8px] animate-pulse transition-opacity duration-300"
          style={{
            background: `conic-gradient(from 0deg, #a855f7, #3b82f6, #a855f7)`,
            opacity: outerDensity,
          }}
        ></div>

        {/* Middle Cyan/Green Mix */}
        <div
          className="absolute inset-4 rounded-full blur-[4px] transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, #bef264 30%, #22d3ee 70%)`,
            opacity: middleDensity,
          }}
        ></div>

        {/* Center Lime Highlight */}
        <div
          className="relative w-40 h-40 rounded-full blur-none mix-blend-normal shadow-inner transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at center, #f7fee7 0%, #d9f99d 100%)`,
            opacity: innerDensity,
          }}
        ></div>
      </div>

      <div className="w-full md:w-[50vw] space-y-6 z-10">
        {feelingsList.map((item, index) => (
          <div
            key={item.left}
            className="flex items-center justify-between text-gray-800 font-medium"
          >
            <div className="md:w-24 w-16 text-right">{item.left}</div>

            <div className="flex-1 md:mx-6 mx-2 relative h-7 flex items-center">
              {/* Track */}
              <div className="w-full h-7 bg-gray-200/50 rounded-full border border-gray-200 shadow-inner"></div>

              {/* Input */}
              <input
                type="range"
                min="5"
                max="95"
                value={values[index]}
                onChange={(e) => handleChange(index, parseInt(e.target.value))}
                className="absolute w-full h-full opacity-0 cursor-pointer z-20"
              />

              {/* Thumb */}
              <div
                className={`absolute h-5 w-5 rounded-full z-10 pointer-events-none transition-all duration-75 border-2 border-white ${item.color} shadow-lg ${item.shadow}`}
                style={{ left: `calc(${values[index]}% - 12px)` }}
              ></div>
            </div>

            <div className="md:w-24 w-16 text-left">{item.right}</div>
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

export default Feeling;
