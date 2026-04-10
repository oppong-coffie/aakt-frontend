import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// Simple icons as SVG components
const GoogleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isFormValid =
    fullName.trim() !== "" && email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log("Submit register");

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        fullName,
        email,
        password,
      });

      if (response.status === 200 || response.status === 201) {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
        }
        navigate("/register2");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 500) {
          alert("User already exists, please login or click forgot password");
          navigate("/login");
        } else {
          alert("Something went wrong. Please try again.");
        }
      } else {
        console.error("Network error:", error);
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

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Ideas come true, faster
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
            className="w-full px-1 py-1 mt-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full px-1 py-1 mt-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex items-center mt-5 text-gray-300 text-xs text-nowrap">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-2.5">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          <button
            type="button"
            onClick={() => {
              window.location.href = "http://localhost:3000/auth/google-register";
            }}
            className="flex items-center gap-20 pl-4 w-full p-1.5 mt-1.5 border border-gray-200 rounded-lg bg-white text-gray-800 font-medium text-sm hover:bg-gray-50 gap-2.5 cursor-pointer transition-colors"
          >
            <div className="">
              {" "}
              <GoogleIcon />{" "}
            </div>
            <h1> Continue with Google</h1>
          </button>

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
          <a href="#" className="text-blue-600 hover:underline">
            Terms & Services
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default Register;
