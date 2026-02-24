import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Key, Lock } from "lucide-react";

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Simple Validation (Replace with your actual admin credentials)
    if (email === "m.akramkhan6690@gmail.com" && password === "a") {
      setIsAuthenticated(true);
      navigate("/dashboard"); // Sahi hone par dashboard
    } else {
      setError("Invalid email or password. Please try again."); // Galat hone par error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] text-[Poppins, sans-serif] p-4">
      <div className="bg-white p-10 rounded-2xl border border-[#E0E0E0] w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-[#666666] text-sm mt-2">
            Enter your credentials to access the panel
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
  {/* Email Field */}
  <div className="space-y-2">
    <label className="text-xs font-medium text-[#A0A0A0] tracking-widest block mb-2">
      Email Address
    </label>
    <div className="relative">
      <Lock
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
      />
      <input
        type="email"
        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E0E0E0] focus:border-[#1A1A1A] outline-none transition-all"
        placeholder="admin@certiflow.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>
  </div>

  {/* Password Field - Fixed structure to match Email field */}
  <div className="space-y-2">
    <label className="text-xs font-medium tracking-widest text-[#A0A0A0] block mb-2">
      Password
    </label>
    <div className="relative">
      <Key
        size={16}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A0A0A0]"
      />
      <input
        type="password"
        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-[#E0E0E0] focus:border-[#1A1A1A] outline-none transition-all"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
  </div>

<div className="flex justify-end">
  <label htmlFor="" className="text-xs text-[#A0A0A0] hover:underline cursor-pointer text-[Poppins, sans-serif]">
    Forget Password?
  </label>
</div>

  {error && (
    <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">
      {error}
    </p>
  )}

  <button
    type="submit"
    className="w-full border border-gray-300 font-light text-white py-3 rounded-4xl  bg-[#0066FF] hover:bg-[#0052CC] transition-all cursor-pointer"
  >
    Sign In to Dashboard
  </button>
</form>
      </div>
    </div>
  );
};

export default LoginPage;
