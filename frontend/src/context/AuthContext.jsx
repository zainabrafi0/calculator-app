import { createContext, useState } from 'react';
import api from '../api/axios'; // Need this to call the logout route!

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

const [user, setUser] = useState(() => {
  const storedUser = localStorage.getItem('user');
  if (!storedUser || storedUser === 'undefined') return null;
  
  try {
    return JSON.parse(storedUser);
  } catch (error) {
    console.error('Failed to parse user data:', error);
    return null; // Fallback to safely logged out
  }
});

const login = (userData) => { 
    // Notice: We don't accept or save the token anymore!
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      // 1. Tell the backend to destroy the cookie
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      // 2. Wipe the user from React memory and Local Storage
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};