import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = {
  login: async () => {
    const response = await api.get("/auth/login");
    return response.data;
  },
};
