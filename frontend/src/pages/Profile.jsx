import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user, login, logout } = useContext(AuthContext); // Added logout here!
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', { name, password });
      setMessage(data.message);
      login(data.user); // <-- Removed localStorage.getItem('token')!
    } catch (err) {
      setMessage('Failed to update profile');
    }
  };
  // NEW: The function that talks to your new backend route
  const handleDeleteAccount = async () => {
    // Standard practice: Always ask for confirmation before a destructive action!
    const confirmDelete = window.confirm("Are you sure? Your personal data will be permanently deleted (history will be kept anonymously).");
    if (!confirmDelete) return;

    try {
      await api.delete('/auth/profile');
      logout(); // This instantly deletes the token from Local Storage and kicks you out!
    } catch (err) {
      setMessage('Failed to delete account. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-pink-200 p-6 font-sans">
      <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-[0_20px_50px_rgba(236,72,153,0.15)] w-full max-w-md border border-white/50">
        
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profile</h2>
          <Link to="/" className="text-sm font-bold text-pink-500 hover:text-pink-600 transition-colors">Back</Link>
        </div>
        
        {message && <div className="bg-pink-50 text-pink-600 p-3 rounded-2xl text-sm text-center mb-6 border border-pink-100 font-bold">{message}</div>}
        
        <form onSubmit={handleUpdate} className="space-y-5 mb-8">
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">Update Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="w-full bg-pink-50/50 border border-pink-100 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-400 uppercase mb-2">New Password <span className="lowercase font-normal">(optional)</span></label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-pink-50/50 border border-pink-100 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-800 transition-all"
            />
          </div>
          <button type="submit" className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-200 active:scale-[0.98]">
            Save Changes
          </button>
        </form>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-pink-100/60 mt-6">
          <button 
            onClick={handleDeleteAccount}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-4 rounded-2xl transition-all duration-200 active:scale-[0.98] border border-red-100"
          >
            Delete Account
          </button>
        </div>

      </div>
    </div>
  );
}