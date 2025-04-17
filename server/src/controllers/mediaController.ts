import { Request, Response } from "express";
import { User } from "../models/User";

const INSTAGRAM_GRAPH_URL = process.env.INSTAGRAM_GRAPH_URL || "";

interface MediaResponse {
  data: Array<{
    id: string;
    media_type: string;
    media_url: string;
    caption?: string;
    timestamp: string;
    permalink: string;
    comments_count: number;
    like_count: number;
  }>;
  paging?: {
    cursors?: {
      before: string;
      after: string;
    };
    next?: string;
    previous?: string;
  };
  error?: {
    message: string;
  };
}

export const mediaController = {
  // Get user's media
  getMedia: async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Calculate offset based on page and limit
      const offset = (Number(page) - 1) * Number(limit);

      // Fetch media from Instagram API with pagination
      const response = await fetch(
        `${INSTAGRAM_GRAPH_URL}/me/media?fields=id,media_type,media_url,caption,timestamp,permalink,comments_count,like_count&access_token=${user.accessToken}&limit=${limit}&offset=${offset}`
      );

      const mediaData = (await response.json()) as MediaResponse;

      // If there's an error in the Instagram API response
      if (mediaData.error) {
        return res.status(400).json({
          message:
            mediaData.error.message || "Failed to fetch media from Instagram",
        });
      }

      // Return paginated response
      return res.json({
        data: mediaData.data,
        pagination: {
          currentPage: Number(page),
          limit: Number(limit),
          total: mediaData.data.length,
          hasNextPage: !!mediaData.paging?.next,
          nextPage: mediaData.paging?.next ? Number(page) + 1 : null,
        },
      });
    } catch (error) {
      console.error("Error fetching media:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get media comments
  getComments: async (req: Request, res: Response) => {
    try {
      const { mediaId } = req.params;
      const { userId } = req.query;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Fetch comments from Instagram API
      const response = await fetch(
        `${INSTAGRAM_GRAPH_URL}/${mediaId}/comments?access_token=${user.accessToken}`
      );

      const commentsData = await response.json();

      return res.json(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Reply to a comment
  replyToComment: async (req: Request, res: Response) => {
    try {
      const { mediaId, commentId } = req.params;
      const { userId, message } = req.body;

      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Post reply to Instagram API
      const response = await fetch(
        `${INSTAGRAM_GRAPH_URL}/${mediaId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            access_token: user.accessToken,
            message: message,
            reply_to_comment_id: commentId,
          }),
        }
      );

      const replyData = await response.json();

      return res.json(replyData);
    } catch (error) {
      console.error("Error replying to comment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};
