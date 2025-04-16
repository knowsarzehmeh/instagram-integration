export interface MediaItem {
  id: string;
  media_type: string;
  media_url: string;
  caption?: string;
  timestamp: string;
  permalink: string;
  comments_count: number;
  like_count: number;
}

export interface UserProfile {
  username: string;
  name: string;
  bio: string;
  website: string;
  profile_picture_url: string;
  media_count: number;
  followers_count: number;
  following_count: number;
}
