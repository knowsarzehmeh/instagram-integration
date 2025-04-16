import axios from "axios";
import { MediaItem, UserProfile } from "./types";

const API_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiServices = {
  login: async () => {
    try {
      const response = await api.get("/auth/login");
      return response.data;
    } catch (error) {
      throw new Error("Failed to login");
    }
  },
  getAuthState: async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("userId");

    if (!userId) {
      return { isAuthenticated: false, userId: null };
    }

    try {
      // Verify the user exists and get their profile
      const profile = await apiServices.fetchProfile(userId);
      return { isAuthenticated: true, userId, profile };
    } catch (error) {
      return { isAuthenticated: false, userId: null };
    }
  },

  logout: () => {
    // Clear any auth-related data
    window.history.replaceState({}, "", "/");
  },
  fetchMedia: async (userId: string): Promise<MediaItem[]> => {
    try {
      const response = await api.get(`/media/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch media");
    }
  },
  fetchProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const response = await api.get(`/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch profile");
    }
  },
};
