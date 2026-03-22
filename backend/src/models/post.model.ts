import mongoose, { Schema, Model } from "mongoose";

import type { IPost } from "../types/entity.types.js";
import { PostStatus } from "../types/constants.types.js";

type PostModel = Model<IPost>;

const postSchema = new Schema<IPost>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    interestedUsers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    maxUsers: {
      type: Number,
    },
    eligibility: [
      {
        type: String,
      },
    ],
    skillsRequired: [
      {
        type: String,
      },
    ],
    keywords: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: Object.values(PostStatus),
    },
  },
  {
    timestamps: true,
  },
);

export const Post = mongoose.model<IPost, PostModel>("Post", postSchema);
