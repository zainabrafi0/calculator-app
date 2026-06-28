import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      login(data.user); // <-- Removed data.token!
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 p-6 font-sans">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgba(236,72,153,0.15)] w-full max-w-md border border-white/50">
        <div className="text-center mb-8">
          <h1 className="text-sm font-bold tracking-widest text-pink-500 uppercase mb-2">Agency Calc</h1>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h2>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-sm text-center mb-6 border border-red-100">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input 
              type="email" 
              placeholder="Email Address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-pink-50/50 border border-pink-100 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-gray-800 transition-all placeholder:text-gray-400"
              required
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-pink-50/50 border border-pink-100 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-gray-800 transition-all placeholder:text-gray-400"
              required
            />
          </div>
          <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]">
            Get Started
          </button>
        </form>
        
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-pink-500 font-bold hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}