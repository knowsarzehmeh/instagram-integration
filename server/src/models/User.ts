import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    instagramId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
    },
    accessToken: {
      type: String,
      required: true,
    },
    name: String,
    bio: String,
    website: String,
    mediaCount: Number,
    followersCount: Number,
    followingCount: Number,
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model("User", userSchema);
