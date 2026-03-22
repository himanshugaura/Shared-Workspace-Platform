import asyncHandler from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { AuthProvider } from "../types/constants.types.js";
import { sendResponse } from "../utils/response.js";
import { throwError } from "../utils/throwError.js";
import { generateEmailVerificationToken } from "../utils/generateEmailToken.js";
import crypto from "crypto";
import { sendVerificationMail } from "../utils/sendMail.js";
import { OAuth2Client } from "google-auth-library";
import { generateTempUsername } from "../utils/generateUsername.js";
import { deleteFromCloudinary, uploadBufferToCloudinary } from "../utils/cloudinaryUpload.js";

export const register = asyncHandler(async (req, res) => {
  const { name, username , email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throwError(409, "Account already exists with this email");
  }

  const user = await User.create({
    name,
    email,
    password,
    username,
    provider: AuthProvider.LOCAL,
  });

  const { token, hashedToken } = generateEmailVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save();

  const verificationUrl =
    `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;

  await sendVerificationMail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });


  const jwtToken = user.generateToken();

  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }); 

  return sendResponse(res, 201, {
    message: "User registered successfully",
    data: user,
  });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params as { token: string };
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  });

 if (!user) {
  throwError(400, "Invalid or expired verification link");
  return;
}

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;

  await user.save();

  return sendResponse(res, 200, {
    message: "Email verified successfully",
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email  , provider: AuthProvider.LOCAL }).select("+password");
  const googleUser = await User.findOne({ email , provider: AuthProvider.GOOGLE });

  if (googleUser) {
    throwError(400, "Try logging in with Google");
  }
  if (!user && !googleUser) {
    throwError(401, "User doesn't exist with this email");
  }


  const isMatch = await user?.comparePassword(password);

  if (!isMatch) {
    throwError(401, "Invalid credentials");
  }

  res.cookie("token", user?.generateToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 200, {
    message: "User logged in successfully",
    data: user,
  }); 
});

export const checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.query;
  
  const existingUser = await User.findOne({ username });
  
  if (existingUser) { 
    throwError(409, "Username not available");
  }

  return sendResponse(res, 200, {
    message: "Username is available",
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throwError(404, "User not found");
  }

  return sendResponse(res, 200, {
    message: "User profile fetched successfully",
    data: user,
  });
});



export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return sendResponse(res, 200, {
    message: "User logged out successfully",
  });
});


export const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload) {
    throwError(401,"Invalid Google token");
    return;
  }

  const { email, name, picture } = payload;

  let user = await User.findOne({ email });
  const tempUsername = await generateTempUsername();

  if (!user) {
    user = await User.create({
      email,
      name,
      username: tempUsername,
      profileImage: {
        url: picture || "",
        publicId: "",
      },
      googleId: payload.sub,
      provider: AuthProvider.GOOGLE,
      isVerified: true,
    });
  }

  const jwtToken = user.generateToken();

  res.cookie("token", jwtToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return sendResponse(res, 200, {
    message: "Google login successful",
    data: user,
  });
});

export const sendVerificationToken = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user) {
    throwError(404, "User not found");
    return;
  }

  if (user.isVerified) {
    throwError(400, "Email is already verified");
  }

  const { token, hashedToken } = generateEmailVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save();

  const verificationUrl =
    `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;

  await sendVerificationMail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  return sendResponse(res, 200, {
    message: "Verification email sent successfully",
  });
});

export const resendVerificationToken = asyncHandler(async (req, res) => {
  const userId = req.userId;

  const user = await User.findById(userId);

  if (!user) {
    throwError(404, "User not found");
    return;
  }

  if (user.isVerified) {
    throwError(400, "Email is already verified");
  }

  const { token, hashedToken } = generateEmailVerificationToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await user.save();

  const verificationUrl =
    `${process.env.FRONTEND_URL}/auth/verify-email/${token}`;

  await sendVerificationMail({
    to: user.email,
    name: user.name,
    verificationUrl,
  });

  return sendResponse(res, 200, {
    message: "Verification email resent successfully",
  });
});


export const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const { name, username } = req.body;

  let portfolio: any = undefined;
  if (req.body.portfolio !== undefined) {
    try {
      portfolio =
        typeof req.body.portfolio === "string"
          ? JSON.parse(req.body.portfolio)
          : req.body.portfolio;
    } catch {
      throwError(400, "Invalid portfolio JSON");
      return;
    }
  }

  const user = await User.findById(userId);
  if (!user) {
    throwError(404, "User not found");
    return;
  }

  if (username && username !== user.username) {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throwError(409, "Username already taken");
      return;
    }
    user.username = username;
  }

  if (name !== undefined) user.name = name;

  // Handle image upload first with explicit try/catch
  if (req.file) {
    if (!req.file.buffer) {
      throwError(400, "Profile image buffer missing");
      return;
    }

    try {
      const uploaded = await uploadBufferToCloudinary(req.file.buffer, "profileImage");

      const oldPublicId = user.profileImage?.publicId;

      user.profileImage = {
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
      };

      // delete old only after new is assigned
      if (oldPublicId) {
        try {
          await deleteFromCloudinary(oldPublicId);
        } catch (e) {
          console.warn("Failed to delete old image:", e);
        }
      }
    } catch (e) {
      console.error("Cloudinary upload error:", e);
      throwError(500, "Failed to upload profile image");
      return;
    }
  }

  if (portfolio !== undefined) {
    if (!user.portfolio) user.portfolio = {} as any;

    const { skills, experience, education, certifications, achievements } = portfolio;

    if (skills !== undefined) user.portfolio.skills = skills;
    if (experience !== undefined) user.portfolio.experience = experience;
    if (education !== undefined) user.portfolio.education = education;
    if (certifications !== undefined) user.portfolio.certifications = certifications;
    if (achievements !== undefined) user.portfolio.achievements = achievements;
  }

  try {
    await user.save();
  } catch (e: any) {
    console.error("User save validation error:", e);
    throwError(400, e?.message || "Profile validation failed");
    return;
  }

  return sendResponse(res, 200, {
    message: "Profile & Portfolio updated successfully",
    data: user,
  });
});