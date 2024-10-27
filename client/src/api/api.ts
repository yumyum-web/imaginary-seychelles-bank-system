// src/api/api.ts
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/v1"; // Update as needed for your environment

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
