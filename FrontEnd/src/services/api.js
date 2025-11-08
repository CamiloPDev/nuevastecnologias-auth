import axios from "axios";

// Cliente axios compartido: envía cookies (sesión) al backend
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
  withCredentials: true,
});

export default api;
