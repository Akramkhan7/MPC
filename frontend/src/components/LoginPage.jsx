import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple Validation (Replace with your actual admin credentials)
    if (email === 'm.akramkhan6690@gmail.com' && password === 'a') {
      setIsAuthenticated(true);
      navigate('/dashboard'); // Sahi hone par dashboard
    } else {
      setError('Invalid email or password. Please try again.'); // Galat hone par error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-[#E0E0E0] w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#1A1A1A] rounded-xl flex items-center justify-center mx-auto mb-4">
            <div className="w-3 h-3 bg-white rounded-full"></div>
          </div>
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <p className="text-[#666666] text-sm mt-2">Enter your credentials to access the panel</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0] block mb-2">Email Address</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] focus:border-[#1A1A1A] outline-none transition-all"
              placeholder="admin@certiflow.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-[#A0A0A0] block mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] focus:border-[#1A1A1A] outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-xs font-bold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}

          <button 
            type="submit"
            className="w-full bg-[#1A1A1A] text-white py-4 rounded-lg font-bold hover:bg-black transition-all shadow-lg shadow-black/10"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;