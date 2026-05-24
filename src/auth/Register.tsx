import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config/api";

// Simple icons as SVG components
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const isFormValid =
    fullName.trim() !== "" && 
    email.trim() !== "" && 
    password.trim() !== "" && 
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log("Submit register");

    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        fullName,
        email,
        password,
      });

      console.log("Registration response:", response);
      if (response.status === 200 || response.status === 201) {
        console.log("Registration successful, navigating to /otp...");
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          console.log("Token saved to localStorage");
        }
        navigate("/otp");
      }
    } catch (error: any) {
      console.error("Registration failed:", error);
      if (error.response) {
        console.error("Error data:", error.response.data);
        if (error.response.status === 400 || error.response.status === 500) {
          alert(error.response.data.error || "User already exists or registration failed. Please try a different email.");
        } else {
          alert(`Error ${error.response.status}: Something went wrong.`);
        }
      } else {
        alert("Network error: Please check your internet connection.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 h-screen p-4 sm:p-0">
      <div className="bg-white rounded-2xl shadow-sm w-full max-w-[400px] p-5 text-center mx-auto">
        {/* Logo Box */}
        <div className="mx-auto mb-3 w-fit">
          <div className="bg-blue-600 text-white px-1 py-1 rounded-md font-bold tracking-wider">
            AAKT
          </div>
        </div>

        <h2 className="text-md font-bold text-gray-900 mt-4 mb-6">
The Operating
System for Modern
Businesses.
        </h2>

        <p className="text-gray-500 text-sm mb-6">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            sign in
          </Link>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full px-1 py-1 mt-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <input
            className="w-full px-1 py-1 mt-5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div className="relative mt-2">
            <input
              className="w-full px-1 py-1 border mt-5 border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="relative mt-2">
            <input
              className="w-full px-1 py-1 mt-5 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors pr-10"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2/3 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
          
          {password && confirmPassword && password !== confirmPassword && (
            <p className="text-red-500 text-[10px] text-left mt-1 ml-1">Passwords do not match</p>
          )}

          <div className="flex items-center mt-5 text-gray-300 text-xs text-nowrap">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-2.5">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* <button
            type="button"
            onClick={() => {
              window.location.href = `${API_URL}/auth/google-register`;
            }}
            className="flex items-center gap-20 pl-4 w-full p-1.5 mt-1.5 border border-gray-200 rounded-lg bg-white text-gray-800 font-medium text-sm hover:bg-gray-50 gap-2.5 cursor-pointer transition-colors"
          >
            <div className="">
              {" "}
              <GoogleIcon />{" "}
            </div>
            <h1> Continue with Google</h1>
          </button> */}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full p-1.5 mt-4 text-white border-none rounded-lg text-base font-semibold transition-all duration-300 ${isFormValid
              ? "bg-blue-600 cursor-pointer shadow-md hover:shadow-lg"
              : "bg-[#94A6FD] cursor-not-allowed opacity-70"
              }`}
          >
            Continue
          </button>
        </form>

        <p className="text-[10px] text-gray-400 mt-5 leading-relaxed">
          By continuing, you agree with our{" "}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms & Services
          </a>{" "}
          and{" "}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Register;
