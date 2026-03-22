import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import type { IUser } from "../types/entity.types.js";
import { AuthProvider } from "../types/constants.types.js";
import jwt from "jsonwebtoken";

type UserModel = Model<IUser>;

const portfolioSchema = new Schema(
  {
    skills: [
      {
        type: String,
        uppercase: true,
      },
    ],
    experience: [
      {
        company: {
          type: String,
          required: true,
          uppercase: true,
        },
        role: {
          type: String,
          required: true,
          uppercase: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
        },
        isCurrent: {
          type: Boolean,
          default: false,
        },
        description: {
          type: String,
          required: true,
          capitilaize: true,
        },
      },
    ],
    education: [
      {
        institution: {
          type: String,
          required: true,
          uppercase: true,
        },
        degree: {
          type: String,
          required: true,
          uppercase: true,
        },
        from: {
          type: Date,
          required: true,
        },
        to: {
          type: Date,
          required: true,
        },
        score: {
          type: Number,
          required: true,
        },
        maxScore: {
          type: Number,
          required: true,
        },
      },
    ],
    certifications: [
      {
        name: {
          type: String,
          required: true,
          uppercase: true,
        },
        issuer: {
          type: String,
          required: true,
          uppercase: true,
        },
        date: {
          type: String,
          required: true,
        },
      },
    ],

    achievements: [{ type: String }],
  },
  { _id: false },
);

const userSchema = new Schema<IUser, UserModel>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    profileImage: {
      url: { type: String },
      publicId: { type: String },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
    },
    emailVerificationExpires: {
      type: Date,
    },
    googleId: {
      type: String,
    },
    provider: {
      type: String,
      enum: Object.values(AuthProvider),
    },
    portfolio: {
      type: portfolioSchema,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateToken = function (): string {
  const payload = { id: this._id };
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

export const User = mongoose.model<IUser, UserModel>("User", userSchema);
