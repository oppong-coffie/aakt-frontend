import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";

// Get token from local storage
const token = localStorage.getItem("token");

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isFormValid = otp.trim() !== "";

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/onboarding/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ otp }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid OTP";
        try {
          const data = await response.json();
          if (data?.message) errorMessage = data.message;
        } catch (err) {
          // fallback
        }
        throw new Error(errorMessage);
      }

      navigate("/stage");
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white rounded-2xl shadow-sm w-[400px] p-6 text-center mx-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Enter OTP to verify
        </h2>

        <form onSubmit={handleVerify}>
          <input
            className="w-full px-4 py-2 my-2 border border-blue-400 rounded-lg text-sm outline-none text-gray-700 focus:border-blue-600 transition-colors"
            type="text"
            placeholder=""
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value);
              if (error) setError("");
            }}
          />
          {error && <p className="text-red-500 text-sm mt-1 text-left">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`w-full p-2.5 mt-4 text-white border-none rounded-lg text-base font-semibold transition-all duration-300 shadow-md ${
              isFormValid && !isLoading
                ? "bg-blue-600 cursor-pointer hover:bg-blue-700 hover:shadow-lg"
                : "bg-[#94A6FD] cursor-not-allowed opacity-70 shadow-none"
            }`}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
