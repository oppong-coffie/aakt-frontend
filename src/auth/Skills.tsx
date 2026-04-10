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

type Category = "Product" | "Strategy" | "Team" | "Finance";

interface Skill {
  id: string;
  name: string;
  category: Category;
}

const allSkills: Skill[] = [
  { id: "design", name: "Design", category: "Product" },
  { id: "engineering", name: "Engineering", category: "Product" },

  { id: "branding", name: "Branding", category: "Strategy" },
  { id: "sales", name: "Sales", category: "Strategy" },
  { id: "marketing", name: "Marketing", category: "Strategy" },

  { id: "management", name: "Management", category: "Team" },
  { id: "hiring", name: "Hiring & Training", category: "Team" },

  { id: "planning", name: "Planning & Accounting", category: "Finance" },
  { id: "value", name: "Value Engineering", category: "Finance" },
];

const Skills = () => {
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const navigate = useNavigate();

  const toggleSkill = (skillId: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((id) => id !== skillId)
        : [...prev, skillId],
    );
  };

  const handleContinue = async () => {
    try {
      const getSkillsByCategory = (category: Category) =>
        selectedSkills
          .map((id) => allSkills.find((s) => s.id === id))
          .filter((s) => s && s.category === category)
          .map((s) => s?.name)
          .join(", ");

      const payload = {
        skills: {
          product: getSkillsByCategory("Product"),
          strategy: getSkillsByCategory("Strategy"),
          team: getSkillsByCategory("Team"),
          finance: getSkillsByCategory("Finance"),
        },
      };

      console.log("Payload:", payload);

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:3000/onboarding/skills", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/dashboard/home");
    } catch (error) {
      console.error("Failed to save onboarding skills:", error);
      // Navigate anyway to keep flow moving, but log error
      navigate("/dashboard/home");
    }
  };

  const handleSkip = () => {
    navigate("/dashboard/home");
  };

  // Group skills by category
  const skillsByCategory = allSkills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    },
    {} as Record<Category, Skill[]>,
  );

  const categories: Category[] = ["Product", "Strategy", "Team", "Finance"];

  // Check if at least one skill is selected
  const isValidSelection = selectedSkills.length > 0;

  return (
    <div className="md:px-40 px-5">
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

      <div className="mt-10 text-center">
        <h2 className="text-xl font-bold text-gray-900">
          Select which skills you feel defines you?
        </h2>
      </div>

      <div className="w-full max-w-2xl mt-10">
        {categories.map((category) => (
          <div key={category} className="mb-7">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {category}
            </h3>
            <div className="flex flex-wrap gap-4">
              {skillsByCategory[category]?.map((skill) => {
                const isSelected = selectedSkills.includes(skill.id);
                return (
                  <button
                    key={skill.id}
                    onClick={() => toggleSkill(skill.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border 
                                    ${
                                      isSelected
                                        ? "bg-white border-blue-600 text-gray-900 shadow-sm ring-1 ring-blue-600"
                                        : "bg-white border-transparent text-gray-700 hover:bg-gray-50"
                                    }`}
                  >
                    {skill.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Continue Button */}
      <div className="fixed bottom-10 right-10">
        <button
          onClick={handleContinue}
          disabled={!isValidSelection}
          className={`px-3 py-1 font-semibold text-white rounded-lg shadow-lg transition ${
            isValidSelection
              ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              : "bg-[#94A6FD] cursor-not-allowed"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Skills;
