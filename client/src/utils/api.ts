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
  // Auth
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

  // Profile
  fetchProfile: async (userId: string): Promise<UserProfile> => {
    try {
      const response = await api.get(`/auth/profile/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch profile");
    }
  },

  // Media
  fetchMedia: async (userId: string): Promise<MediaItem[]> => {
    try {
      const response = await api.get(`/media/${userId}`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch media");
    }
  },

  // Comments
  fetchComments: async (mediaId: string, userId: string) => {
    try {
      const response = await api.get(`/media/${mediaId}/comments`, {
        params: { userId },
      });
      return response.data;
    } catch (error) {
      throw new Error("Failed to fetch comments");
    }
  },

  replyToComment: async (
    mediaId: string,
    commentId: string,
    userId: string,
    message: string
  ) => {
    try {
      const response = await api.post(
        `/media/${mediaId}/comments/${commentId}/reply`,
        {
          userId,
          message,
        }
      );
      return response.data;
    } catch (error) {
      throw new Error("Failed to reply to comment");
    }
  },
};
