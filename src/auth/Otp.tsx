import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { API_URL } from "../config/api";

const Otp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Timer logic for resend button
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    // Use only the last character entered
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Backspace to previous input
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 4 || isLoading) return;

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ otp: otpString }),
      });

      if (!response.ok) {
        let errorMessage = "Invalid OTP";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseErr) {
          // ignore
        }
        throw new Error(errorMessage);
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate("/onboard");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-submit when all digits are filled
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleVerify();
    }
  }, [otp]);

  const handleResend = async () => {
    if (timer > 0) return;
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setTimer(60);
        setError("");
        alert("A new OTP has been sent to your email.");
      } else {
        alert("Failed to resend OTP. Please try again later.");
      }
    } catch (err) {
      console.error("Resend error:", err);
    }
  };

  return (
    <div className="flex items-center justify-center bg-[#f8f9fa] dark:bg-slate-950 h-screen p-4 sm:p-0 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl w-full max-w-[440px] p-10 text-center mx-auto border border-gray-100 dark:border-slate-800 relative overflow-hidden">
        
        {/* Success Overlay */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex flex-col items-center justify-center p-8"
            >
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verified!</h2>
              <p className="text-gray-500 dark:text-gray-400">Taking you to the next step...</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            We've sent a 4-digit code to your email.
          </p>
        </div>

        <form onSubmit={handleVerify}>
          <div className="flex justify-between gap-3 mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]}
                className={`w-16 h-16 border-2 rounded-2xl text-center text-3xl font-bold outline-none transition-all duration-200 ${
                  error 
                    ? "border-red-200 bg-red-50 dark:bg-red-900/10 focus:border-red-500 text-red-600" 
                    : "border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-700 text-gray-900 dark:text-white"
                }`}
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mb-6 font-medium"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={otp.some((d) => d === "") || isLoading}
            className={`w-full py-4 text-white rounded-2xl text-lg font-bold transition-all duration-300 transform active:scale-[0.98] ${
              otp.every((d) => d !== "") && !isLoading
                ? "bg-blue-600 shadow-lg shadow-blue-500/30 hover:bg-blue-700"
                : "bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Account"
            )}
          </button>
        </form>

        <div className="mt-10">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0}
            className={`mt-2 font-bold transition-colors ${
              timer > 0
                ? "text-gray-400 dark:text-slate-600 cursor-not-allowed"
                : "text-blue-600 dark:text-blue-400 hover:text-blue-700"
            }`}
          >
            {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Otp;
