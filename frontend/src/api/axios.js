import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true, // This tells Axios to automatically attach the cookie to every single request
});

export default api;