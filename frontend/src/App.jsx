import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
//Global State tools
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true;
// Import all of your page components
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile'; 

// This wrapper protects routes from users who aren't logged in
const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  // We check localStorage too, so a page refresh doesn't log you out
  const isAuthenticated = user || localStorage.getItem('token'); 
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes (Require Login) */}
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}