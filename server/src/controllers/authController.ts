import { Request, Response } from "express";
import { User } from "../models/User";

const INSTAGRAM_API_URL = "https://api.instagram.com/oauth/authorize";
const INSTAGRAM_TOKEN_URL = "https://api.instagram.com/oauth/access_token";
const INSTAGRAM_GRAPH_URL = "https://graph.instagram.com";

interface TokenResponse {
  access_token: string;
  user_id: number;
}

interface ProfileResponse {
  id: string;
  username: string;
  account_type: string;
  media_count: number;
}

export const authController = {
  loginWithInstagram: (req: Request, res: Response) => {
    const queryParams = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID || "",
      redirect_uri: process.env.INSTAGRAM_REDIRECT_URI || "",
      scope: "user_profile,user_media",
      response_type: "code",
    });

    const authUrl = `${INSTAGRAM_API_URL}?${queryParams.toString()}`;

    console.log("authUrl", authUrl);
    res.json({ url: authUrl });
  },

  // Handle Instagram OAuth callback
  handleCallback: async (req: Request, res: Response) => {
    try {
      const { code } = req.query;

      if (!code) {
        throw new Error("Authorization code not provided");
      }

      // Exchange code for access token
      const tokenResponse = await fetch(INSTAGRAM_TOKEN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: process.env.INSTAGRAM_APP_ID || "",
          client_secret: process.env.INSTAGRAM_APP_SECRET || "",
          grant_type: "authorization_code",
          redirect_uri: process.env.INSTAGRAM_REDIRECT_URI || "",
          code: code.toString(),
        }),
      });

      const tokenData = (await tokenResponse.json()) as TokenResponse;

      if (!tokenData.access_token) {
        throw new Error("Failed to obtain access token");
      }

      // Fetch user profile
      const profileResponse = await fetch(
        `${INSTAGRAM_GRAPH_URL}/me?fields=id,username,account_type,media_count&access_token=${tokenData.access_token}`
      );

      const profileData = (await profileResponse.json()) as ProfileResponse;

      // Create or update user in database
      const user = await User.findOneAndUpdate(
        { instagramId: profileData.id },
        {
          instagramId: profileData.id,
          username: profileData.username,
          accessToken: tokenData.access_token,
          mediaCount: profileData.media_count,
        },
        { upsert: true, new: true }
      );

      // Redirect to frontend with success
      res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:5173"}?userId=${
          user._id
        }`
      );
    } catch (error) {
      console.error("Instagram authentication error:", error);
      res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:5173"}/error`
      );
    }
  },

  // Get user profile
  getProfile: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};
