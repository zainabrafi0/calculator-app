import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // <-- CRITICAL! This tells Axios to automatically attach the cookie to every single request
});

export default api;