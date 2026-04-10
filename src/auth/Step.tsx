import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

const Step = () => {
  const [answer, setAnswer] = useState("");
  const navigate = useNavigate();

  const handleContinue = async () => {
    try {
      console.log("Answer:", answer);
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/onboarding/step",
        { step: answer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/dashboard/home");
    } catch (error) {
      console.error("Failed to save onboarding step:", error);
      // Navigate anyway to keep flow moving, but log error
      navigate("/dashboard/home");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard/home");
  };

  return (
    <div className="h-screen">
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

      <div className="mt-3 mb-32 flex justify-center">
        <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
          What is currently between you and your next step or growth?
        </h2>
      </div>

      <div className="w-full flex justify-center">
        <textarea
          className="w-full max-w-3xl h-64 p-6 rounded-xl border-none shadow-sm resize-none focus:ring-2 focus:ring-blue-100 outline-none text-gray-700 text-lg placeholder-gray-400 bg-white"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={handleContinue}
          className="px-3 py-1 bg-blue-600/50 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition"
          style={answer.trim() ? { backgroundColor: "#2563eb" } : {}}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Step;
