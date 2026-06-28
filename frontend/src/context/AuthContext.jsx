import { createContext, useState } from 'react';
import api from '../api/axios'; // Need this to call the logout route!

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // We still keep 'user' in localStorage so the UI remembers your name when you refresh
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

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