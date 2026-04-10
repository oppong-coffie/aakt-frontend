import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Get token from local storage
const token = localStorage.getItem("token");
console.log(token);

// Checkmark Icon
const CheckIcon = () => (
  <svg
    width="12"
    height="10"
    viewBox="0 0 12 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 5L4.5 8.5L11 1.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const countries = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cabo Verde",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "East Timor",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Ivory Coast",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Korea, North",
  "Korea, South",
  "Kosovo",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Kitts and Nevis",
  "Saint Lucia",
  "Saint Vincent and the Grenadines",
  "Samoa",
  "San Marino",
  "Sao Tome and Principe",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

const Register2 = () => {
  const [country, setCountry] = useState("Ghana");
  const [numberofbusinesses, setNumberofbusinesses] = useState(0);
  const [teamsize, setTeamsize] = useState("");
  const [referralcode, setReferralcode] = useState("");
  const navigate = useNavigate();

  const isFormValid = country.trim() !== "" && teamsize.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    try {
      await axios.post('http://localhost:3000/onboarding', {
        country,
        numberofbusinesses,
        teamsize,
        referralcode,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      await axios.post('http://localhost:3000/onboarding/send-otp', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate("/otp");
    } catch (err) {
      console.error("Failed to save onboarding business info or send OTP", err);
      // fallback navigate anyway or show error
      navigate("/otp");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[#f0f0eb]">
      <div className="bg-white rounded-2xl shadow-sm w-[450px] p-8 text-center mx-auto">
        {/* Stepper */}
        <div className="flex items-center justify-center mb-6">
          {/* Step 1: Completed */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <CheckIcon />
            </div>
          </div>

          {/* Line 1-2 */}
          <div className="w-10 h-1 bg-blue-600 mx-1"></div>

          {/* Step 2: Active */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm">
              2
            </div>
          </div>

          {/* Line 2-3 */}
          <div className="w-10 h-1 bg-gray-200 mx-1"></div>

          {/* Step 3 */}
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full border-2 border-gray-200 bg-white flex items-center justify-center font-semibold text-gray-700 text-sm">
              3
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Tell us about your business.
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Country Dropdown */}
          <div className="relative">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">
              Country
            </label>
            <select
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 appearance-none bg-gray-50/50"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-[38px] pointer-events-none">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </div>

          {/* Number of Businesses Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Number of Businesses
              </label>
              <span className="text-blue-600 font-bold text-sm">
                {numberofbusinesses === 20 ? "20+" : numberofbusinesses}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={numberofbusinesses}
              onChange={(e) => setNumberofbusinesses(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
              <span>0</span>
              <span>10</span>
              <span>20+</span>
            </div>
          </div>

          {/* Team Size */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">
              Team Size
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50/50"
              type="text"
              placeholder="e.g. 1-10, 50+"
              value={teamsize}
              onChange={(e) => setTeamsize(e.target.value)}
            />
          </div>

          {/* Referral Code */}
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">
              Referral Code (Optional)
            </label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 bg-gray-50/50"
              type="text"
              placeholder="Enter code"
              value={referralcode}
              onChange={(e) => setReferralcode(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3.5 mt-4 bg-blue-600 text-white border-none rounded-xl text-base font-bold transition-all duration-300 shadow-lg shadow-blue-600/20 ${isFormValid
              ? "bg-blue-600 cursor-pointer hover:bg-blue-700 hover:scale-[1.02]"
              : "bg-gray-300 cursor-not-allowed shadow-none"
              }`}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register2;
