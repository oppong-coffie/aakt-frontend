import { useState, useEffect } from "react";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if we just completed an OAuth flow where backend passed ?token=... down in URL 
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      // Clean up the address bar
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Usually backend returns generic tokens to Login component since MemoryRouter mounts to "/"
      // If we see an isNew parameter, redirect to onboardings
      if (params.get("isNew") === "true") {
        navigate("/register2");
      } else {
        navigate("/dashboard/home");
      }
    }
  }, [navigate]);

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    console.log("Logging in with:", email, password);

    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        console.log("Login successful:", response.data);

        // Store the token in localStorage
        const token = response.data.token || response.data.accessToken;
        if (token) {
          localStorage.setItem("token", token);
        }

        navigate("/dashboard/home");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 400 || error.response.status === 404) {
          alert("Invalid email or password");
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

        <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome</h2>

        <p className="text-gray-500 text-sm mb-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Sign Up
          </Link>
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="w-full px-1 py-1 mt-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative mt-2">
            <input
              className="w-full px-1 py-1 border border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 transition-colors pr-10"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <div className="flex items-center mt-5 text-gray-300 text-xs text-nowrap">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="px-2.5">Or</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* <button
            type="button"
            onClick={() => {
              window.location.href = `${API_URL}/auth/google-login`;
            }}
            className="flex items-center w-full p-1.5 mt-1.5 border border-gray-200 rounded-lg bg-white text-gray-800 font-medium text-sm hover:bg-gray-50 gap-2.5 cursor-pointer transition-colors"
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
            Sign In
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

export default Login;
