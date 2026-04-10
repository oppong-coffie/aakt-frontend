import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
// Get token from local storage
const token = localStorage.getItem("token");

const Otp = () => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
=======
const Otp = () => {
  const [otp, setOtp] = useState("");
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
  const navigate = useNavigate();

  const isFormValid = otp.trim() !== "";

<<<<<<< HEAD
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/onboarding/verify-otp", {
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
=======
  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    console.log("Verify OTP:", otp);
    navigate("/stage");
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
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
<<<<<<< HEAD
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
=======
            onChange={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full p-2.5 mt-4 text-white border-none rounded-lg text-base font-semibold transition-all duration-300 shadow-md ${
              isFormValid
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
                ? "bg-blue-600 cursor-pointer hover:bg-blue-700 hover:shadow-lg"
                : "bg-[#94A6FD] cursor-not-allowed opacity-70 shadow-none"
            }`}
          >
<<<<<<< HEAD
            {isLoading ? "Verifying..." : "Verify"}
=======
            Verify
>>>>>>> c1832823bd770c159a49d2a042dd2d75b0c902d9
          </button>
        </form>
      </div>
    </div>
  );
};

export default Otp;
